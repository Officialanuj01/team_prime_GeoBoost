# pyrefly: ignore [missing-import]
from fastapi import APIRouter, UploadFile, File
from datetime import datetime
from app.models import ForecastResponse, ForecastItem, KPIs, MergedDailyInsight, BusinessActions
from app.services.csv_service import CSVService
from app.services.vertex_service import VertexService
from app.services.gemini_service import GeminiService

router = APIRouter()

# Instantiate services
csv_service = CSVService()
vertex_service = VertexService()
gemini_service = GeminiService()

@router.post(
    "/forecast",
    response_model=ForecastResponse,
    summary="Generate hotel occupancy predictions",
    description="Upload a CSV file containing 'date' and 'occupancy' columns to fetch predictions from Vertex AI TimesFM 2.5."
)
async def forecast_occupancy(file: UploadFile = File(...)):
    # Read raw bytes from the uploaded file
    file_bytes = await file.read()

    # Parse and extract clean structured data
    dates, occupancy = csv_service.parse_and_validate_csv(file_bytes)

    # Extract covariates/exogenous context from the CSV DataFrame in a backward-compatible way
    import io
    import pandas as pd
    forecast_context = {}
    try:
        df = pd.read_csv(io.BytesIO(file_bytes))
        df.columns = [col.strip().lower() for col in df.columns]
        
        # 1. Extract static context if present
        static_context = {}
        for col in ["hotel_tier", "room_type", "region", "hotel_id"]:
            if col in df.columns:
                non_null = df[col].dropna()
                if not non_null.empty:
                    static_context[col] = str(non_null.iloc[0])
        if static_context:
            forecast_context["static_context"] = static_context

        # 2. Extract daily context covariates if present
        daily_context = []
        if "date" in df.columns:
            clean_df = df.dropna(subset=["date"])
            for _, row in clean_df.iterrows():
                row_date = str(row["date"]).strip()
                day_covariates = {}
                
                # Dynamic categorical columns
                for col in ["holiday", "festival", "promotion", "weekday", "special_event"]:
                    if col in df.columns and pd.notna(row[col]):
                        day_covariates[col] = str(row[col]).strip()
                
                # Dynamic numerical columns
                for col in ["discount_percentage", "temperature"]:
                    if col in df.columns and pd.notna(row[col]):
                        try:
                            day_covariates[col] = float(row[col])
                        except ValueError:
                            pass
                
                if day_covariates:
                    day_covariates["date"] = row_date
                    daily_context.append(day_covariates)
        if daily_context:
            forecast_context["daily_context"] = daily_context
    except Exception as e:
        print(f"⚠️ Warning: Failed to extract covariates context: {str(e)}")

    # Call Vertex AI endpoint and get raw model predictions
    predictions = vertex_service.get_forecast(dates, occupancy, covariates=forecast_context)

    # 1. Parse prediction data
    forecast_items = []
    if predictions:
        pred_dict = predictions[0]
        point_forecast = pred_dict.get("point_forecast", pred_dict.get("pointForecast", []))
        timestamps = pred_dict.get("timestamp", [])
        p10 = pred_dict.get("p10", [])
        p90 = pred_dict.get("p90", [])
        
        for i in range(len(timestamps)):
            forecast_items.append({
                "date": timestamps[i],
                "predicted_occupancy": round(float(point_forecast[i]), 2) if i < len(point_forecast) else 0.0,
                "lower_bound": round(float(p10[i]), 2) if i < len(p10) else 0.0,
                "upper_bound": round(float(p90[i]), 2) if i < len(p90) else 0.0
            })

    # 2. Compute Deterministic KPIs on the Backend
    if forecast_items:
        avg_occ = round(sum(item["predicted_occupancy"] for item in forecast_items) / len(forecast_items), 2)
        peak_item = max(forecast_items, key=lambda x: x["predicted_occupancy"])
        peak_occ = peak_item["predicted_occupancy"]
        peak_day = peak_item["date"]
        
        # Growth calculation relative to the last historical record
        last_hist = occupancy[-1] if occupancy else 1.0
        last_fore = forecast_items[-1]["predicted_occupancy"]
        growth_percent = round(((last_fore - last_hist) / last_hist) * 100, 2) if last_hist != 0 else 0.0
        
        # Trend classification
        first_fore = forecast_items[0]["predicted_occupancy"]
        diff = last_fore - first_fore
        if diff > 1.0:
            trend_str = "Increasing"
        elif diff < -1.0:
            trend_str = "Decreasing"
        else:
            trend_str = "Stable"
    else:
        avg_occ = 0.0
        peak_occ = 0.0
        peak_day = ""
        growth_percent = 0.0
        trend_str = "Stable"

    kpis = KPIs(
        average_occupancy=avg_occ,
        peak_occupancy=peak_occ,
        peak_day=peak_day,
        growth_percent=growth_percent,
        trend=trend_str
    )

    # 3. Compute Daily Metrics (Status, Priority, Day Names) on the Backend
    computed_daily_insights = []
    for item in forecast_items:
        try:
            day_name = datetime.strptime(item["date"], "%Y-%m-%d").strftime("%A")
        except Exception:
            day_name = "Unknown"

        occ = item["predicted_occupancy"]

        # Status & Priority mapping
        if occ >= 90.0:
            status_str = "Near Capacity"
            priority_str = "Critical"
        elif occ >= 85.0:
            status_str = "Peak Demand"
            priority_str = "High"
        elif occ >= 80.0:
            status_str = "High Demand"
            priority_str = "Medium"
        elif occ >= 70.0:
            status_str = "Healthy"
            priority_str = "Low"
        else:
            status_str = "Normal"
            priority_str = "Low"

        computed_daily_insights.append({
            "date": item["date"],
            "day": day_name,
            "predicted_occupancy": occ,
            "lower_bound": item["lower_bound"],
            "upper_bound": item["upper_bound"],
            "status": status_str,
            "priority": priority_str
        })

    # 4. Generate Strategic AI Recommendations (Gemini generates ONLY business reasoning)
    if forecast_items:
        forecast_dates = [item["date"] for item in forecast_items]
        forecast_occupancy = [item["predicted_occupancy"] for item in forecast_items]
        
        gemini_insights = gemini_service.generate_strategic_insights(
            history_dates=dates,
            history_occupancy=occupancy,
            forecast_dates=forecast_dates,
            forecast_occupancy=forecast_occupancy,
            forecast_context=forecast_context
        )
    else:
        gemini_insights = gemini_service.get_fallback_insights("No forecast data generated by TimesFM.")

    # 5. Merge TimesFM Data + Computed Statistics + Gemini Insights
    merged_insights = []
    for i, daily_comp in enumerate(computed_daily_insights):
        if i < len(gemini_insights.daily_insights):
            g_insight = gemini_insights.daily_insights[i]
            headline = g_insight.headline
            summary_text = g_insight.summary
            recommended_action = g_insight.recommended_action
            risk = g_insight.risk
            dashboard_badge = g_insight.dashboard_badge
        else:
            # Fallbacks in case index mismatch
            headline = "Standby"
            summary_text = "Operational outlook."
            recommended_action = "Maintain baseline operations."
            risk = "Limited visibility."
            dashboard_badge = "Monitor"

        merged_insights.append(MergedDailyInsight(
            date=daily_comp["date"],
            day=daily_comp["day"],
            predicted_occupancy=daily_comp["predicted_occupancy"],
            lower_bound=daily_comp["lower_bound"],
            upper_bound=daily_comp["upper_bound"],
            status=daily_comp["status"],
            priority=daily_comp["priority"],
            headline=headline,
            summary=summary_text,
            recommended_action=recommended_action,
            risk=risk,
            dashboard_badge=dashboard_badge
        ))

    # Assemble response items for ForecastItem list
    forecast_list = [
        ForecastItem(
            date=item["date"],
            predicted_occupancy=item["predicted_occupancy"],
            lower_bound=item["lower_bound"],
            upper_bound=item["upper_bound"]
        ) for item in forecast_items
    ]

    return ForecastResponse(
        forecast=forecast_list,
        records_analyzed=len(dates),
        kpis=kpis,
        summary=gemini_insights.summary,
        daily_insights=merged_insights,
        business_actions=BusinessActions(
            pricing=gemini_insights.business_actions.pricing,
            staffing=gemini_insights.business_actions.staffing,
            inventory=gemini_insights.business_actions.inventory,
            marketing=gemini_insights.business_actions.marketing
        )
    )

