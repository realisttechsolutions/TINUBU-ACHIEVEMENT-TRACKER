# TAT Generated SDK and Adapter Strategy

## Proven E01 flow

```text
dataconnect/schema + connector operations
        -> Firebase SQL Connect local compiler
        -> backend/generated/sql-connect-public and sql-connect-staff
        -> structural adapter boundary
        -> backend/contracts/public-api.ts
        -> Frontend V2 view models
```

Firebase CLI 15.27.0 successfully compiled the 27-table schema and generated real JavaScript SDK packages and TypeScript declarations for both connectors. The official emulator also regenerated these artifacts during startup. No cloud connection or deployment was used.

## Ownership

- Generated directories are machine output and should not be hand-edited.
- Connector GraphQL and the complete PostgreSQL DDL are backend-owned inputs.
- `backend/contracts/public-api.ts` is the stable consumer boundary.
- Adapter implementations translate generated operation rows, validate/null-normalize values and expose view models.
- React components depend only on the public port/view types; they do not know SQL column names, relationship helper names or connector configuration.

`backend/contracts/generated-sdk-adapter-proof.ts` demonstrates structural typing: a generated row can satisfy the input without the adapter importing the generated package. This keeps the backend typecheck usable before application installation of generated packages and prevents accidental SDK leakage into UI components.

## Public versus staff packages

The public SDK contains only explicitly public, allowlisted operations with server-side publication predicates. The staff SDK is a separate package; E01 marks all internal operations `NO_ACCESS`. Production Auth/role policy must be implemented and tested before changing that directive.

## Change workflow

1. Change schema/operation source on an engineering branch.
2. Run research validation and complete PostgreSQL tests.
3. Run `npm run sqlconnect:generate`.
4. Review generated API/type diff, especially nullability, numeric and timestamp mappings.
5. Run backend and frontend adapter typechecks/tests.
6. Start the emulator and exercise operations against synthetic data.
7. Commit source and deterministic generated output together when version policy allows.

Breaking generated changes are absorbed in the adapter or intentionally version the public contract. A generated type is not itself a promise to Frontend V2.

## Mapping cautions

- UUID maps to string at the public boundary.
- Timestamp/date values are normalized to ISO strings without inventing precision.
- PostgreSQL exact financial numeric values are exported as decimal strings; the current reduced SQL Connect compatibility schema uses `Float` only for connector shape proof and must be reconciled to exact cloud/PostgreSQL numeric behavior before financial writes are enabled.
- JSON audit/control fields are intentionally absent from public SDK operations.
- Generated relation helper names are implementation details.

## Production gate

Before cloud review becomes provisioning authorization, run strict schema reconciliation against a disposable staging database, install generated packages in the application through reviewed package paths, enforce Auth/App Check/server authorization, add operation integration tests, and confirm no internal field appears in public declaration output.
