# TINUBU ACHIEVEMENT TRACKER V2
## First Super Administrator Bootstrap Procedure (Mission 10E / 10E-LIVE)

---

## 1. Operating Principle & Invariant Notice

> [!IMPORTANT]
> **Operator Input Required:** In compliance with security invariants, no synthetic, hardcoded, or automated human administrator account is provisioned during automated deployment. The system operator must provide their chosen email address and execute this out-of-band bootstrap procedure to establish the first authorized Super Administrator.
>
> **Strict Email Ownership Verification:** Staff accounts are created with `emailVerified: false`. The operator must prove email ownership via a genuine Firebase email verification link before an administrative session cookie can be minted.

---

## 2. Prerequisites

1. Terminal access with Node.js 20+ installed.
2. Authenticated Google Application Default Credentials (ADC) or Firebase CLI login on project `tinubu-achievement-stg`.
3. Target project environment variable set:
   ```bash
   export FIREBASE_PROJECT_ID=tinubu-achievement-stg
   ```

---

## 3. Bootstrap Procedure: Step-by-Step

### Step 1: Dry-Run Verification
Execute the bootstrap script in dry-run mode to verify input parameters and project identity without performing mutations:
```bash
node scripts/admin/bootstrap-staff.mjs --email <OPERATOR_EMAIL> --role super_admin
```
Expected output:
```text
============================================================
TAT STAFF BOOTSTRAP CLI — MISSION 10E-LIVE
============================================================
Target Firebase Project: tinubu-achievement-stg
Staff Email:             <OPERATOR_EMAIL>
Assigned Role:           super_admin
Initial Verified Status: UNVERIFIED (Verification Required)
Mode:                    DRY RUN ONLY
------------------------------------------------------------
[DRY RUN] No changes were made. Pass --confirm to execute account bootstrap.
```

### Step 2: Account Provisioning & Claims Assignment
Execute the bootstrap script with the `--confirm` flag:
```bash
node scripts/admin/bootstrap-staff.mjs --email <OPERATOR_EMAIL> --role super_admin --confirm
```

The script will:
1. Create the Firebase Authentication user account (or locate existing) with `emailVerified: false`.
2. Set custom claims `{ tat_staff: true, tat_role: "super_admin" }` server-side via Firebase Admin SDK.
3. Generate a secure, one-time Firebase **Email Verification Link**.
4. Generate a secure, one-time Firebase **Password Reset Link**.
5. Print activation instructions to the terminal.

### Step 3: Verify Email Ownership
1. Copy the generated **Verification Link**.
2. Open the link in a browser window to confirm email ownership with Firebase Identity Toolkit.
3. Firebase updates `emailVerified = true` for the account.

### Step 4: Set Strong Password
1. Copy the generated **Password Reset Link**.
2. Open the link and set a strong password meeting the platform policy:
   - Minimum 12 characters
   - At least 1 uppercase letter (`A-Z`)
   - At least 1 lowercase letter (`a-z`)
   - At least 1 numeric digit (`0-9`)
   - At least 1 non-alphanumeric special character (`!@#$%^&*...`)

### Step 5: First Administrative Login
1. Navigate to `https://tat-staging--tinubu-achievement-stg.us-central1.hosted.app/admin/login` (or `http://localhost:3000/admin/login`).
2. Log in with the newly configured email and password.
3. The server validates that authentication occurred within the last 5 minutes, verifies `email_verified === true`, confirms `tat_staff === true` and `tat_role === "super_admin"`, and issues an 8-hour HTTP-only `tat_admin_session` cookie redirecting you to `/admin`.

---

## 4. Ongoing Staff Provisioning & Governance

Once the first Super Admin is active, additional staff accounts can be provisioned using the same verified workflow:

```bash
# Provision a Researcher
node scripts/admin/bootstrap-staff.mjs --email researcher1@tracker.gov.ng --role researcher --confirm

# Provision a Reviewer
node scripts/admin/bootstrap-staff.mjs --email reviewer1@tracker.gov.ng --role reviewer --confirm

# Provision a Publisher
node scripts/admin/bootstrap-staff.mjs --email publisher1@tracker.gov.ng --role publisher --confirm

# Promote/Change an existing staff role
node scripts/admin/set-staff-role.mjs --email staff@tracker.gov.ng --role reviewer --confirm

# Immediately Disable an account and revoke active sessions
node scripts/admin/disable-staff.mjs --email staff@tracker.gov.ng --confirm
```
