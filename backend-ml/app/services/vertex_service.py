# pyrefly: ignore [missing-import]
import requests
# pyrefly: ignore [missing-import]
import google.auth
# pyrefly: ignore [missing-import]
import google.auth.transport.requests
from fastapi import HTTPException, status
from app.config import Config

class VertexService:
    def __init__(self):
        # Construct the exact URL path matching the working curl command
        self.url = (
            f"https://{Config.VERTEX_DEDICATED_ENDPOINT}/v1"
            f"/projects/{Config.GOOGLE_CLOUD_PROJECT_ID}"
            f"/locations/{Config.VERTEX_LOCATION}"
            f"/endpoints/{Config.VERTEX_ENDPOINT_ID}:predict"
        )

        try:
            # Initialize Application Default Credentials (ADC)
            self.credentials, self.project = google.auth.default()
            self.auth_req = google.auth.transport.requests.Request()
        except Exception as e:
            raise RuntimeError(f"Failed to initialize Google credentials: {str(e)}")

    def build_predict_payload(self, dates: list[str], occupancy: list[float], covariates: dict = None) -> dict:
        """
        Builds the prediction request payload.
        If covariates are provided, formats them matching the official TimesFM 2.5 
        XReg schema (dynamic_categorical_covariates, static_categorical_covariates, etc.).
        """
        payload = {
            "instances": [
                {
                    "input": occupancy,
                    "timestamp": dates,
                    "timestamp_format": "%Y-%m-%d",
                    "horizon": Config.HORIZON
                }
            ]
        }

        if not covariates:
            return payload

        # Extract static covariates
        static_cat = {}
        static_num = {}
        static_ctx = covariates.get("static_context", {})
        for k, v in static_ctx.items():
            try:
                val = float(v)
                static_num[k] = [val]
            except ValueError:
                static_cat[k] = [v]

        # Extract daily/dynamic covariates
        daily_ctx = covariates.get("daily_context", [])
        daily_map = {item["date"]: item for item in daily_ctx if "date" in item}

        # Calculate chronological future dates for the horizon
        from datetime import datetime, timedelta
        total_dates = list(dates)
        try:
            last_date = datetime.strptime(dates[-1], "%Y-%m-%d")
        except Exception:
            last_date = datetime.now()

        future_dates = []
        for i in range(1, Config.HORIZON + 1):
            f_date = (last_date + timedelta(days=i)).strftime("%Y-%m-%d")
            future_dates.append(f_date)
            total_dates.append(f_date)

        # Detect columns dynamically
        dyn_cols = set()
        for item in daily_ctx:
            for k in item.keys():
                if k != "date":
                    dyn_cols.add(k)

        dyn_cat = {}
        dyn_num = {}
        cat_keys = {"holiday", "festival", "promotion", "weekday", "special_event"}
        num_keys = {"discount_percentage", "temperature"}

        for k in dyn_cols:
            is_num = k in num_keys
            if k not in cat_keys and k not in num_keys:
                # Check value types dynamically
                try:
                    for item in daily_ctx:
                        if k in item and item[k] is not None:
                            float(item[k])
                            is_num = True
                            break
                except ValueError:
                    is_num = False

            # Extrapolate covariates to match full length: (history + horizon)
            val_list = []
            for d in total_dates:
                if d in daily_map and k in daily_map[d] and daily_map[d][k] is not None:
                    val_list.append(daily_map[d][k])
                else:
                    # Provide defaults for the future/missing days
                    if k == "weekday":
                        try:
                            val_list.append(datetime.strptime(d, "%Y-%m-%d").strftime("%A"))
                        except Exception:
                            val_list.append("Unknown")
                    elif is_num:
                        if val_list:
                            val_list.append(val_list[-1])
                        else:
                            val_list.append(0.0)
                    else:
                        val_list.append("None")

            if is_num:
                dyn_num[k] = val_list
            else:
                dyn_cat[k] = val_list

        # Inject covariates into the prediction instance object
        instance = payload["instances"][0]
        if static_cat:
            instance["static_categorical_covariates"] = static_cat
        if static_num:
            instance["static_numerical_covariates"] = static_num
        if dyn_cat:
            instance["dynamic_categorical_covariates"] = dyn_cat
        if dyn_num:
            instance["dynamic_numerical_covariates"] = dyn_num

        return payload

    def get_forecast(self, dates: list[str], occupancy: list[float], covariates: dict = None) -> list:
        """
        Refreshes OAuth token, builds prediction payload, and sends a direct
        HTTP POST request. If experimental covariates payload fails with HTTP 400,
        it automatically rebuilds a univariate payload and retries.
        """
        try:
            self.credentials.refresh(self.auth_req)
            token = self.credentials.token
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Failed to refresh Google Cloud OAuth token: {str(e)}"
            )

        # Detect and print experimental covariate settings
        has_covariates = covariates is not None and (
            "static_context" in covariates or "daily_context" in covariates
        )
        print("\n" + "="*50)
        print(f"🤖 Native Covariates Detected in CSV: {has_covariates}")
        if has_covariates:
            detected = []
            if "static_context" in covariates:
                detected.extend([f"static:{k}" for k in covariates["static_context"].keys()])
            if "daily_context" in covariates and covariates["daily_context"]:
                detected.extend([f"dynamic:{k}" for k in covariates["daily_context"][0].keys() if k != "date"])
            print(f"Dynamic/Static Covariates: {detected}")
        print("="*50 + "\n")

        # Build prediction payload (first try with experimental covariates)
        payload = self.build_predict_payload(dates, occupancy, covariates)

        # Print the COMPLETE JSON request before sending
        import json
        print("\n" + "="*50)
        print("--- RAW VERTEX AI PREDICT REQUEST ---")
        print(json.dumps(payload, indent=2))
        print("="*50 + "\n")

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        try:
            response = requests.post(self.url, json=payload, headers=headers)
            
            # If covariates failed with HTTP 400 (unsupported), trigger automatic fallback retry
            if response.status_code == 400 and has_covariates:
                print("\n⚠️  Vertex AI Endpoint returned HTTP 400 (unsupported covariates schema).")
                print("🔄 Falling back automatically to univariate TimesFM prediction...")
                
                # Rebuild request with None covariates
                fallback_payload = self.build_predict_payload(dates, occupancy, None)
                print("\n" + "="*50)
                print("--- RAW VERTEX AI FALLBACK REQUEST ---")
                print(json.dumps(fallback_payload, indent=2))
                print("="*50 + "\n")
                
                response = requests.post(self.url, json=fallback_payload, headers=headers)
                response.raise_for_status()
                
                result = response.json()
                print("\n" + "="*50)
                print("--- RAW VERTEX AI FALLBACK RESPONSE ---")
                print(json.dumps(result, indent=2))
                print("="*50 + "\n")
                return result.get("predictions", [])
            else:
                response.raise_for_status()
                result = response.json()
                
                print("\n" + "="*50)
                print("--- RAW VERTEX AI PREDICT RESPONSE ---")
                print(json.dumps(result, indent=2))
                print("="*50 + "\n")
                return result.get("predictions", [])
                
        except requests.exceptions.HTTPError as e:
            try:
                err_detail = response.json()
            except ValueError:
                err_detail = response.text
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Vertex AI Dedicated Endpoint returned error: {err_detail}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Failed to reach Vertex AI Dedicated Endpoint: {str(e)}"
            )
