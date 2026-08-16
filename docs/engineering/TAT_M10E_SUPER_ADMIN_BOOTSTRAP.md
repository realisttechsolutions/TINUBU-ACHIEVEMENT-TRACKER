# TINUBU ACHIEVEMENT TRACKER V2
## First Super Administrator Bootstrap Procedure (Mission 10E)

---

## 1. Operating Principle & Invariant Notice

> [!IMPORTANT]
> **Operator Input Required:** In compliance with security invariants, no synthetic, hardcoded, or automated human administrator account is provisioned during automated deployment. The system operator must execute this out-of-band bootstrap procedure to establish the first authorized Super Administrator.

---

## 2. Prerequisites

1. Terminal access with Node.js 20+ installed.
2. Authenticated Google Application Default Credentials (ADC) with Owner/Editor permissions on Firebase project `tinubu-achievement-stg`:
   ```bash
   gcloud auth application-default login
   # OR ensure GOOGLE_APPLICATION_CREDENTIALS points to an authorized service key
   ```
3. Target project set:
   ```bash
   export FIREBASE_PROJECT_ID=tinubu-achievement-stg
   ```

---

## 3. Bootstrap Procedure: Step-by-Step

### Step 1: Dry-Run Verification
Execute the bootstrap script in dry-run mode to verify credentials and project identity without performing mutations:
```bash
node scripts/admin/bootstrap-staff.mjs --email <OPERATOR_EMAIL> --role super_admin
```
Expected output:
```text
============================================================
TAT STAFF BOOTSTRAP CLI — MISSION 10E
============================================================
Target Firebase Project: tinubu-achievement-stg
Staff Email:             <OPERATOR_EMAIL>
Assigned Role:           super_admin
Email Verified Flag:     FALSE
Mode:                    DRY RUN ONLY
------------------------------------------------------------
[DRY RUN] No changes were made. Pass --confirm to execute account bootstrap.
```

### Step 2: Account Provisioning & Claims Assignment
Execute the bootstrap script with `--confirm` and `--verified` flags:
```bash
node scripts/admin/bootstrap-staff.mjs --email <OPERATOR_EMAIL> --role super_admin --verified --confirm
```

The script will:
1. Create a Firebase Authentication user account if one does not already exist.
2. Set custom claims `{ tat_staff: true, tat_role: "super_admin" }`.
3. Set `emailVerified: true`.
4. Generate a one-time, secure Firebase password reset / account activation link printed to stdout.

### Step 3: Set Password via Activation Link
1. Copy the generated password reset link.
2. Open the link in a secure browser window.
3. Set a strong password adhering to the platform policy:
   - Minimum 12 characters
   - At least 1 uppercase letter (`A-Z`)
   - At least 1 lowercase letter (`a-z`)
   - At least 1 number (`0-9`)
   - At least 1 special character (`!@#$%^&*...`)

### Step 4: First Administrative Login
1. Navigate to `https://tat-staging--tinubu-achievement-stg.us-central1.hosted.app/admin/login` (or `http://localhost:3000/admin/login`).
2. Log in with the newly configured email and password.
3. The server will verify credentials, validate custom claims, and issue an 8-hour `tat_admin_session` cookie redirecting you to the `/admin` console.

---

## 4. Ongoing Staff Provisioning & Governance

Once the first Super Admin is active, subsequent staff accounts can be provisioned using the CLI suite:

```bash
# Provision a Researcher
node scripts/admin/bootstrap-staff.mjs --email researcher1@tracker.gov.ng --role researcher --verified --confirm

# Provision a Reviewer
node scripts/admin/bootstrap-staff.mjs --email reviewer1@tracker.gov.ng --role reviewer --verified --confirm

# Provision a Publisher
node scripts/admin/bootstrap-staff.mjs --email publisher1@tracker.gov.ng --role publisher --verified --confirm

# Promote/Change an existing staff role
node scripts/admin/set-staff-role.mjs --email staff@tracker.gov.ng --role reviewer --confirm

# Immediately Disable an account and revoke active sessions
node scripts/admin/disable-staff.mjs --email staff@tracker.gov.ng --confirm
```
