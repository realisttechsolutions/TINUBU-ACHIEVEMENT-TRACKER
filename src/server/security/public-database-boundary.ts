import type { QueryResultRow } from 'pg';
import type { QueryExecutor } from '@/server/db/pool';

const PUBLIC_VIEWS = [
  'public_record_catalog',
  'public_claim_evidence',
  'public_financial_records',
  'public_beneficiary_records',
] as const;

interface PublicBoundaryRow extends QueryResultRow {
  expected_identity: boolean;
  public_role_member: boolean;
  database_connect: boolean;
  schema_usage: boolean;
  required_view_select: boolean;
  zero_base_table_select: boolean;
  zero_relation_writes: boolean;
  zero_schema_or_database_create: boolean;
  zero_relation_ownership: boolean;
  restricted_login_role: boolean;
  zero_privileged_role_membership: boolean;
}

const PUBLIC_BOUNDARY_QUERY = `
  SELECT
    current_user = $1 AS expected_identity,
    pg_has_role(current_user, 'tat_public_reader', 'MEMBER') AS public_role_member,
    has_database_privilege(current_user, current_database(), 'CONNECT') AS database_connect,
    has_schema_privilege(current_user, 'public', 'USAGE') AS schema_usage,
    (
      SELECT count(*) = cardinality($2::text[])
        AND bool_and(has_table_privilege(current_user, relation.oid, 'SELECT'))
      FROM pg_class relation
      JOIN pg_namespace namespace ON namespace.oid = relation.relnamespace
      WHERE namespace.nspname = 'public'
        AND relation.relkind IN ('v', 'm')
        AND relation.relname = ANY($2::text[])
    ) AS required_view_select,
    NOT EXISTS (
      SELECT 1
      FROM pg_class relation
      JOIN pg_namespace namespace ON namespace.oid = relation.relnamespace
      WHERE namespace.nspname = 'public'
        AND relation.relkind IN ('r', 'p')
        AND has_table_privilege(current_user, relation.oid, 'SELECT')
    ) AS zero_base_table_select,
    NOT EXISTS (
      SELECT 1
      FROM pg_class relation
      JOIN pg_namespace namespace ON namespace.oid = relation.relnamespace
      WHERE namespace.nspname = 'public'
        AND relation.relkind IN ('r', 'p', 'v', 'm')
        AND has_table_privilege(
          current_user,
          relation.oid,
          'INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER'
        )
    ) AS zero_relation_writes,
    NOT has_schema_privilege(current_user, 'public', 'CREATE')
      AND NOT has_database_privilege(current_user, current_database(), 'CREATE')
      AS zero_schema_or_database_create,
    NOT EXISTS (
      SELECT 1
      FROM pg_class relation
      JOIN pg_namespace namespace ON namespace.oid = relation.relnamespace
      JOIN pg_roles role ON role.oid = relation.relowner
      WHERE namespace.nspname = 'public'
        AND role.rolname = current_user
    ) AS zero_relation_ownership,
    (
      SELECT NOT rolsuper
        AND NOT rolcreaterole
        AND NOT rolcreatedb
        AND NOT rolreplication
        AND NOT rolbypassrls
      FROM pg_roles
      WHERE rolname = current_user
    ) AS restricted_login_role,
    NOT pg_has_role(current_user, 'cloudsqlsuperuser', 'MEMBER')
      AND NOT pg_has_role(current_user, 'pg_read_all_data', 'MEMBER')
      AND NOT pg_has_role(current_user, 'pg_write_all_data', 'MEMBER')
      AS zero_privileged_role_membership`;

export async function assertPublicDatabaseBoundary(
  database: QueryExecutor,
  expectedDatabaseUser: string,
): Promise<void> {
  if (!expectedDatabaseUser.trim()) throw new Error('Expected database identity is required.');
  const result = await database.query<PublicBoundaryRow>(PUBLIC_BOUNDARY_QUERY, [
    expectedDatabaseUser,
    [...PUBLIC_VIEWS],
  ]);
  const boundary = result.rows[0];
  if (!boundary || Object.values(boundary).some((assertion) => assertion !== true)) {
    throw new Error('Public database boundary verification failed.');
  }
}
