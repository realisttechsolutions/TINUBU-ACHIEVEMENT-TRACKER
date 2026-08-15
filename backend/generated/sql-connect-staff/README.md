# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `tat-staff`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetInternalReviewQueue*](#getinternalreviewqueue)
  - [*GetResearchBatch*](#getresearchbatch)
- [**Mutations**](#mutations)
  - [*UpdateInternalWorkflow*](#updateinternalworkflow)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `tat-staff`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@tat/sql-connect-staff` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@tat/sql-connect-staff';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@tat/sql-connect-staff';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `tat-staff` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetInternalReviewQueue
You can execute the `GetInternalReviewQueue` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [sql-connect-staff/index.d.ts](./index.d.ts):
```typescript
getInternalReviewQueue(vars?: GetInternalReviewQueueVariables, options?: ExecuteQueryOptions): QueryPromise<GetInternalReviewQueueData, GetInternalReviewQueueVariables>;

interface GetInternalReviewQueueRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: GetInternalReviewQueueVariables): QueryRef<GetInternalReviewQueueData, GetInternalReviewQueueVariables>;
}
export const getInternalReviewQueueRef: GetInternalReviewQueueRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getInternalReviewQueue(dc: DataConnect, vars?: GetInternalReviewQueueVariables, options?: ExecuteQueryOptions): QueryPromise<GetInternalReviewQueueData, GetInternalReviewQueueVariables>;

interface GetInternalReviewQueueRef {
  ...
  (dc: DataConnect, vars?: GetInternalReviewQueueVariables): QueryRef<GetInternalReviewQueueData, GetInternalReviewQueueVariables>;
}
export const getInternalReviewQueueRef: GetInternalReviewQueueRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getInternalReviewQueueRef:
```typescript
const name = getInternalReviewQueueRef.operationName;
console.log(name);
```

### Variables
The `GetInternalReviewQueue` query has an optional argument of type `GetInternalReviewQueueVariables`, which is defined in [sql-connect-staff/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetInternalReviewQueueVariables {
  limit?: number | null;
}
```
### Return Type
Recall that executing the `GetInternalReviewQueue` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetInternalReviewQueueData`, which is defined in [sql-connect-staff/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetInternalReviewQueueData {
  records: ({
    id: UUIDString;
    externalId: string;
    title: string;
    workflowStatus: string;
    publicationStatus: string;
    verificationStatus: string;
    riskLevel: string;
    internalNotes?: string | null;
    currentRevision: number;
    updatedAt: TimestampString;
  } & Record_Key)[];
}
```
### Using `GetInternalReviewQueue`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getInternalReviewQueue, GetInternalReviewQueueVariables } from '@tat/sql-connect-staff';

// The `GetInternalReviewQueue` query has an optional argument of type `GetInternalReviewQueueVariables`:
const getInternalReviewQueueVars: GetInternalReviewQueueVariables = {
  limit: ..., // optional
};

// Call the `getInternalReviewQueue()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getInternalReviewQueue(getInternalReviewQueueVars);
// Variables can be defined inline as well.
const { data } = await getInternalReviewQueue({ limit: ..., });
// Since all variables are optional for this query, you can omit the `GetInternalReviewQueueVariables` argument.
const { data } = await getInternalReviewQueue();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getInternalReviewQueue(dataConnect, getInternalReviewQueueVars);

console.log(data.records);

// Or, you can use the `Promise` API.
getInternalReviewQueue(getInternalReviewQueueVars).then((response) => {
  const data = response.data;
  console.log(data.records);
});
```

### Using `GetInternalReviewQueue`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getInternalReviewQueueRef, GetInternalReviewQueueVariables } from '@tat/sql-connect-staff';

// The `GetInternalReviewQueue` query has an optional argument of type `GetInternalReviewQueueVariables`:
const getInternalReviewQueueVars: GetInternalReviewQueueVariables = {
  limit: ..., // optional
};

// Call the `getInternalReviewQueueRef()` function to get a reference to the query.
const ref = getInternalReviewQueueRef(getInternalReviewQueueVars);
// Variables can be defined inline as well.
const ref = getInternalReviewQueueRef({ limit: ..., });
// Since all variables are optional for this query, you can omit the `GetInternalReviewQueueVariables` argument.
const ref = getInternalReviewQueueRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getInternalReviewQueueRef(dataConnect, getInternalReviewQueueVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.records);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.records);
});
```

## GetResearchBatch
You can execute the `GetResearchBatch` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [sql-connect-staff/index.d.ts](./index.d.ts):
```typescript
getResearchBatch(vars: GetResearchBatchVariables, options?: ExecuteQueryOptions): QueryPromise<GetResearchBatchData, GetResearchBatchVariables>;

interface GetResearchBatchRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetResearchBatchVariables): QueryRef<GetResearchBatchData, GetResearchBatchVariables>;
}
export const getResearchBatchRef: GetResearchBatchRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getResearchBatch(dc: DataConnect, vars: GetResearchBatchVariables, options?: ExecuteQueryOptions): QueryPromise<GetResearchBatchData, GetResearchBatchVariables>;

interface GetResearchBatchRef {
  ...
  (dc: DataConnect, vars: GetResearchBatchVariables): QueryRef<GetResearchBatchData, GetResearchBatchVariables>;
}
export const getResearchBatchRef: GetResearchBatchRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getResearchBatchRef:
```typescript
const name = getResearchBatchRef.operationName;
console.log(name);
```

### Variables
The `GetResearchBatch` query requires an argument of type `GetResearchBatchVariables`, which is defined in [sql-connect-staff/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetResearchBatchVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetResearchBatch` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetResearchBatchData`, which is defined in [sql-connect-staff/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetResearchBatchData {
  researchBatch?: {
    id: UUIDString;
    externalId: string;
    idempotencyKey: string;
    packageChecksum: string;
    contractVersion: string;
    mode: string;
    status: string;
    planHash?: string | null;
    startedAt: TimestampString;
    completedAt?: TimestampString | null;
  } & ResearchBatch_Key;
}
```
### Using `GetResearchBatch`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getResearchBatch, GetResearchBatchVariables } from '@tat/sql-connect-staff';

// The `GetResearchBatch` query requires an argument of type `GetResearchBatchVariables`:
const getResearchBatchVars: GetResearchBatchVariables = {
  id: ..., 
};

// Call the `getResearchBatch()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getResearchBatch(getResearchBatchVars);
// Variables can be defined inline as well.
const { data } = await getResearchBatch({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getResearchBatch(dataConnect, getResearchBatchVars);

console.log(data.researchBatch);

// Or, you can use the `Promise` API.
getResearchBatch(getResearchBatchVars).then((response) => {
  const data = response.data;
  console.log(data.researchBatch);
});
```

### Using `GetResearchBatch`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getResearchBatchRef, GetResearchBatchVariables } from '@tat/sql-connect-staff';

// The `GetResearchBatch` query requires an argument of type `GetResearchBatchVariables`:
const getResearchBatchVars: GetResearchBatchVariables = {
  id: ..., 
};

// Call the `getResearchBatchRef()` function to get a reference to the query.
const ref = getResearchBatchRef(getResearchBatchVars);
// Variables can be defined inline as well.
const ref = getResearchBatchRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getResearchBatchRef(dataConnect, getResearchBatchVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.researchBatch);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.researchBatch);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `tat-staff` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpdateInternalWorkflow
You can execute the `UpdateInternalWorkflow` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [sql-connect-staff/index.d.ts](./index.d.ts):
```typescript
updateInternalWorkflow(vars: UpdateInternalWorkflowVariables): MutationPromise<UpdateInternalWorkflowData, UpdateInternalWorkflowVariables>;

interface UpdateInternalWorkflowRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateInternalWorkflowVariables): MutationRef<UpdateInternalWorkflowData, UpdateInternalWorkflowVariables>;
}
export const updateInternalWorkflowRef: UpdateInternalWorkflowRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateInternalWorkflow(dc: DataConnect, vars: UpdateInternalWorkflowVariables): MutationPromise<UpdateInternalWorkflowData, UpdateInternalWorkflowVariables>;

interface UpdateInternalWorkflowRef {
  ...
  (dc: DataConnect, vars: UpdateInternalWorkflowVariables): MutationRef<UpdateInternalWorkflowData, UpdateInternalWorkflowVariables>;
}
export const updateInternalWorkflowRef: UpdateInternalWorkflowRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateInternalWorkflowRef:
```typescript
const name = updateInternalWorkflowRef.operationName;
console.log(name);
```

### Variables
The `UpdateInternalWorkflow` mutation requires an argument of type `UpdateInternalWorkflowVariables`, which is defined in [sql-connect-staff/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateInternalWorkflowVariables {
  id: UUIDString;
  workflowStatus: string;
  currentRevision: number;
}
```
### Return Type
Recall that executing the `UpdateInternalWorkflow` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateInternalWorkflowData`, which is defined in [sql-connect-staff/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateInternalWorkflowData {
  record_update?: Record_Key | null;
}
```
### Using `UpdateInternalWorkflow`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateInternalWorkflow, UpdateInternalWorkflowVariables } from '@tat/sql-connect-staff';

// The `UpdateInternalWorkflow` mutation requires an argument of type `UpdateInternalWorkflowVariables`:
const updateInternalWorkflowVars: UpdateInternalWorkflowVariables = {
  id: ..., 
  workflowStatus: ..., 
  currentRevision: ..., 
};

// Call the `updateInternalWorkflow()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateInternalWorkflow(updateInternalWorkflowVars);
// Variables can be defined inline as well.
const { data } = await updateInternalWorkflow({ id: ..., workflowStatus: ..., currentRevision: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateInternalWorkflow(dataConnect, updateInternalWorkflowVars);

console.log(data.record_update);

// Or, you can use the `Promise` API.
updateInternalWorkflow(updateInternalWorkflowVars).then((response) => {
  const data = response.data;
  console.log(data.record_update);
});
```

### Using `UpdateInternalWorkflow`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateInternalWorkflowRef, UpdateInternalWorkflowVariables } from '@tat/sql-connect-staff';

// The `UpdateInternalWorkflow` mutation requires an argument of type `UpdateInternalWorkflowVariables`:
const updateInternalWorkflowVars: UpdateInternalWorkflowVariables = {
  id: ..., 
  workflowStatus: ..., 
  currentRevision: ..., 
};

// Call the `updateInternalWorkflowRef()` function to get a reference to the mutation.
const ref = updateInternalWorkflowRef(updateInternalWorkflowVars);
// Variables can be defined inline as well.
const ref = updateInternalWorkflowRef({ id: ..., workflowStatus: ..., currentRevision: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateInternalWorkflowRef(dataConnect, updateInternalWorkflowVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.record_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.record_update);
});
```

