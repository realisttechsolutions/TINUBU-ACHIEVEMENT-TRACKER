// Compatibility shim. SQL Connect artifacts remain preserved, while application
// database access is now owned by the direct Cloud SQL server boundary.
export { getDatabaseConnection, closeDatabaseConnection } from '@/server/db/pool';
