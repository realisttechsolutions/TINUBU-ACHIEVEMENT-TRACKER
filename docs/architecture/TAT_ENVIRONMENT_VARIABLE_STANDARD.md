# TAT Environment Variable Standard
## Canonical Environment Schema for Local Development, CI/CD, and Firebase App Hosting

**Status:** APPROVED & ENFORCED  
**Security Level:** CRITICAL (Zero secrets in client builds)  

---

## 1. Variable Namespace Hierarchy

Next.js distinguishes between client-accessible variables (prefixed with `NEXT_PUBLIC_`) and server-only variables (unprefixed).

| Namespace Prefix | Scope / Target | Exposure Risk | Usage |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_FIREBASE_*` | Client Browser & SSR | Low (Public SDK config) | Firebase Client SDK initialization |
| `FIREBASE_*` / `GOOGLE_*` | Server-side Node.js Runtime | HIGH (Secret credentials) | Cloud Run Serverless compute, Admin SDK |
| `NEXT_PUBLIC_APP_*` | Client Browser | Low | App metadata, canonical URL, analytics flags |

---

## 2. Canonical Environment Matrix

```env
# ==============================================================================
# TINUBU ACHIEVEMENT TRACKER V2 - CANONICAL ENVIRONMENT CONFIGURATION
# ==============================================================================

# Application Metadata & Canonical URLs
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Tinubu Achievement Tracker"
NEXT_PUBLIC_APP_VERSION=2.0.0

# Firebase Client SDK Configuration (Google Cloud / Firebase Project)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tinubu-achievement-tracker.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tinubu-achievement-tracker
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tinubu-achievement-tracker.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Server-Only Google Cloud / Firebase Admin Credentials (DO NOT EXPOSE TO CLIENT)
FIREBASE_PROJECT_ID=tinubu-achievement-tracker
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@tinubu-achievement-tracker.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=

# AI Intelligence Service (Vertex AI / Gemini 1.5 Pro)
GOOGLE_GENAI_API_KEY=
VERTEX_AI_PROJECT_ID=tinubu-achievement-tracker
VERTEX_AI_LOCATION=us-central1

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_VERTEX_AI_SEARCH=false
NEXT_PUBLIC_ENABLE_CSV_EXPORTS=true
```
