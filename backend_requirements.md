# GeoBoost — Backend Requirements

## Overview
This document lists the backend infrastructure needed to replace the current hardcoded frontend data with a proper API-driven architecture.

---

## 1. Technology Stack

| Component | Recommended | Alternative |
|---|---|---|
| **Runtime** | Python 3.11+ (FastAPI) | Node.js (Express/Fastify) |
| **Database** | PostgreSQL 15+ | MongoDB |
| **Cache** | Redis | In-memory |
| **ML Framework** | scikit-learn / Prophet / TensorFlow | PyTorch |
| **Task Queue** | Celery + Redis | Bull (Node.js) |
| **File Storage** | AWS S3 / MinIO | Local filesystem |
| **Auth** | JWT + OAuth2 | Firebase Auth |

---

## 2. API Endpoints Required

### Authentication
- `POST /api/auth/register` — Register new user (tourism board / hotel)
- `POST /api/auth/login` — Login with JWT token
- `POST /api/auth/refresh` — Refresh JWT token
- `GET /api/auth/me` — Get current user profile

### Campaign Management
- `POST /api/campaigns` — Create new campaign
- `GET /api/campaigns` — List all campaigns (with pagination)
- `GET /api/campaigns/:id` — Get campaign details
- `PUT /api/campaigns/:id` — Update campaign
- `DELETE /api/campaigns/:id` — Delete campaign
- `POST /api/campaigns/:id/trigger` — Trigger/launch campaign

### File Upload & Processing
- `POST /api/upload/report` — Upload CSV/PDF/XLSX report
- `GET /api/upload/:id/status` — Check processing status
- `GET /api/upload/:id/results` — Get parsed results

### ML Predictions
- `POST /api/predict/occupancy` — Predict occupancy rates
- `POST /api/predict/campaign-timing` — Optimal campaign timing
- `POST /api/predict/audience-segments` — Target audience segmentation
- `GET /api/predict/trends` — Regional travel trends

### Analytics
- `GET /api/analytics/dashboard` — Dashboard overview data
- `GET /api/analytics/footfall` — Regional footfall metrics
- `GET /api/analytics/occupancy` — Historical occupancy data
- `GET /api/analytics/campaign-performance/:id` — Per-campaign metrics

### Notifications
- `POST /api/notifications/generate` — Generate personalized messages via Gemini API (proxy)
- `POST /api/notifications/send` — Send notifications to customers
- `GET /api/notifications/history` — Notification history

### Customers
- `GET /api/customers` — List all customers (with search/filter)
- `POST /api/customers` — Add customer
- `GET /api/customers/:id` — Customer details with preferences

---

## 3. ML Model Requirements

### Tourism Demand Forecasting
- **Input**: Historical occupancy data, event calendars, weather data, seasonal trends
- **Output**: Predicted occupancy rates for next 30/60/90 days
- **Algorithm**: Facebook Prophet or LSTM time-series

### Campaign Optimization
- **Input**: Past campaign performance, target demographics, budget
- **Output**: Recommended timing, channels, ad spend allocation
- **Algorithm**: Gradient boosting (XGBoost/LightGBM)

### Audience Segmentation
- **Input**: Customer booking history, preferences, demographics
- **Output**: Customer clusters with tailored messaging
- **Algorithm**: K-Means / DBSCAN clustering

---

## 4. External APIs Needed

| API | Purpose |
|---|---|
| **Google Gemini API** | AI message generation (proxy through backend) |
| **OpenWeatherMap** | Weather data for tourism predictions |
| **Eventbrite / local event APIs** | Local event schedules |
| **Google Places** | Local attraction data |
| **Twilio / SendGrid** | Email/SMS notifications |

---

## 5. Database Schema (Key Tables)

- `users` — id, email, password_hash, role, organization, created_at
- `campaigns` — id, user_id, title, status, config_json, created_at
- `reports` — id, user_id, file_url, parsed_data, status, created_at
- `customers` — id, name, email, preferences, booking_history
- `notifications` — id, campaign_id, customer_id, message, status, sent_at
- `analytics` — id, campaign_id, metric_type, value, recorded_at
- `predictions` — id, model_type, input_params, output, created_at

---

## 6. Environment Variables Needed

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/geoboost
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_key_here
JWT_SECRET=your_secret_here
S3_BUCKET=geoboost-uploads
S3_ACCESS_KEY=your_key
S3_SECRET_KEY=your_secret
SENDGRID_API_KEY=your_key
```

---

## 7. Priority Order for Development

1. **Auth + User management** — Foundation for everything
2. **File upload + parsing** — Core data ingestion
3. **Campaign CRUD** — Basic campaign management
4. **Gemini API proxy** — Move API key to backend
5. **ML prediction endpoints** — Model training + serving
6. **Analytics dashboard API** — Real-time data
7. **Notification system** — Email/SMS delivery
