# Firebase Data Connect & Cloud SQL Deployment Specification

## 1. Google Cloud & Firebase Infrastructure Setup

1. **Cloud SQL for PostgreSQL Provisioning**:
   ```bash
   gcloud sql instances create tat-db-instance \
     --database-version=POSTGRES_17 \
     --tier=db-custom-2-7680 \
     --region=us-central1
   ```

2. **Database Initialization**:
   ```bash
   gcloud sql databases create tat_canonical --instance=tat-db-instance
   ```

3. **Firebase Data Connect Service Deployment**:
   ```bash
   firebase deploy --only dataconnect
   ```

4. **Firebase App Hosting Secret Configuration**:
   ```bash
   firebase apphosting:secrets:set DATABASE_URL
   ```
