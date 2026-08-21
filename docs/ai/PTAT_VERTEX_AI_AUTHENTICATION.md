# PTAT Vertex AI Authentication & Cloud IAM Architecture

## 1. Identity & Access Management (IAM) Invariants

The PTAT AI Answer Generation engine follows the Google Cloud Zero-Trust security paradigm. No API keys, static service account JSON tokens, or secrets are embedded into source repositories, build images, or client bundles.

Authentication is strictly mediated via **Application Default Credentials (ADC)** in local development and **Google Cloud IAM Workload Identity** in staging/production runtimes.

---

## 2. Authorized Staging Environment Configuration

| Dimension | Authorized Staging Specification |
|---|---|
| **GCP Target Project** | `tinubu-achievement-stg` |
| **Project Number** | `915443422977` |
| **Vertex AI Location** | `us-central1` |
| **Active Billing Account** | Enabled (`billingEnabled: true`) |
| **API State** | `aiplatform.googleapis.com` (**ENABLED**) |
| **Runtime Service Account** | `firebase-app-hosting-compute@tinubu-achievement-stg.iam.gserviceaccount.com` |
| **IAM Role Binding** | `roles/aiplatform.user` on `projects/tinubu-achievement-stg` |

---

## 3. Local Development ADC Authentication Flow

In local engineering environments, authentication is provided by the active `gcloud` developer session:

```bash
# 1. Authorize Application Default Credentials
gcloud auth application-default login

# 2. Set Active Quota Project
gcloud auth application-default set-quota-project tinubu-achievement-stg

# 3. Configure Active Project Context
gcloud config set project tinubu-achievement-stg

# 4. Verify Access Token Minting
gcloud auth application-default print-access-token
```

The `@google/genai` Node.js SDK automatically discovers the token from the standard Google ADC credential path:
- Windows: `%APPDATA%\gcloud\application_default_credentials.json`
- Linux/macOS: `~/.config/gcloud/application_default_credentials.json`

---

## 4. Staging Runtime Authentication Flow (Firebase App Hosting)

When deployed to Firebase App Hosting / Cloud Run on `tinubu-achievement-stg`:
1. The container runs under the identity of `firebase-app-hosting-compute@tinubu-achievement-stg.iam.gserviceaccount.com`.
2. The Node.js runtime calls the Google Compute Engine Instance Metadata Service (`http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token`) to mint ephemeral OAuth 2.0 access tokens.
3. The token carries the `roles/aiplatform.user` permission granted via Cloud IAM.
4. Ephemeral tokens auto-refresh every ~60 minutes transparently within `@google/genai`.

---

## 5. Security & Isolation Invariants

- **Production Air-Gap**: The staging Vertex AI configuration is strictly locked to `tinubu-achievement-stg`. Under no circumstances can staging code invoke production Vertex endpoints or access production database clusters (`tinubu-achievement-tracker`).
- **Least-Privilege Role**: The runtime identity holds `roles/aiplatform.user` (permits predict/generateContent). It DOES NOT have model tuning, artifact deletion, or administrative IAM permissions.
- **Audit Logging**: All Vertex AI invocations generate Cloud Audit Logs under `aiplatform.googleapis.com/Predict` for complete compliance and telemetry tracking.
