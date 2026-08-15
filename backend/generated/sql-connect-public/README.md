# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `tat-public`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListPublishedRecords*](#listpublishedrecords)
  - [*GetPublishedRecord*](#getpublishedrecord)
  - [*SearchPublishedRecords*](#searchpublishedrecords)
- [**Mutations**](#mutations)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `tat-public`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@tat/sql-connect-public` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@tat/sql-connect-public';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@tat/sql-connect-public';

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

Below are examples of how to use the `tat-public` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListPublishedRecords
You can execute the `ListPublishedRecords` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [sql-connect-public/index.d.ts](./index.d.ts):
```typescript
listPublishedRecords(vars?: ListPublishedRecordsVariables, options?: ExecuteQueryOptions): QueryPromise<ListPublishedRecordsData, ListPublishedRecordsVariables>;

interface ListPublishedRecordsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListPublishedRecordsVariables): QueryRef<ListPublishedRecordsData, ListPublishedRecordsVariables>;
}
export const listPublishedRecordsRef: ListPublishedRecordsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPublishedRecords(dc: DataConnect, vars?: ListPublishedRecordsVariables, options?: ExecuteQueryOptions): QueryPromise<ListPublishedRecordsData, ListPublishedRecordsVariables>;

interface ListPublishedRecordsRef {
  ...
  (dc: DataConnect, vars?: ListPublishedRecordsVariables): QueryRef<ListPublishedRecordsData, ListPublishedRecordsVariables>;
}
export const listPublishedRecordsRef: ListPublishedRecordsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPublishedRecordsRef:
```typescript
const name = listPublishedRecordsRef.operationName;
console.log(name);
```

### Variables
The `ListPublishedRecords` query has an optional argument of type `ListPublishedRecordsVariables`, which is defined in [sql-connect-public/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListPublishedRecordsVariables {
  limit?: number | null;
  offset?: number | null;
}
```
### Return Type
Recall that executing the `ListPublishedRecords` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPublishedRecordsData`, which is defined in [sql-connect-public/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPublishedRecordsData {
  records: ({
    id: UUIDString;
    slug: string;
    recordType: string;
    title: string;
    shortTitle?: string | null;
    summary: string;
    implementationStatus: string;
    verificationStatus: string;
    evidenceProfile: string;
    qualification?: string | null;
    publishedAt?: TimestampString | null;
  } & Record_Key)[];
}
```
### Using `ListPublishedRecords`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPublishedRecords, ListPublishedRecordsVariables } from '@tat/sql-connect-public';

// The `ListPublishedRecords` query has an optional argument of type `ListPublishedRecordsVariables`:
const listPublishedRecordsVars: ListPublishedRecordsVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `listPublishedRecords()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPublishedRecords(listPublishedRecordsVars);
// Variables can be defined inline as well.
const { data } = await listPublishedRecords({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `ListPublishedRecordsVariables` argument.
const { data } = await listPublishedRecords();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPublishedRecords(dataConnect, listPublishedRecordsVars);

console.log(data.records);

// Or, you can use the `Promise` API.
listPublishedRecords(listPublishedRecordsVars).then((response) => {
  const data = response.data;
  console.log(data.records);
});
```

### Using `ListPublishedRecords`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPublishedRecordsRef, ListPublishedRecordsVariables } from '@tat/sql-connect-public';

// The `ListPublishedRecords` query has an optional argument of type `ListPublishedRecordsVariables`:
const listPublishedRecordsVars: ListPublishedRecordsVariables = {
  limit: ..., // optional
  offset: ..., // optional
};

// Call the `listPublishedRecordsRef()` function to get a reference to the query.
const ref = listPublishedRecordsRef(listPublishedRecordsVars);
// Variables can be defined inline as well.
const ref = listPublishedRecordsRef({ limit: ..., offset: ..., });
// Since all variables are optional for this query, you can omit the `ListPublishedRecordsVariables` argument.
const ref = listPublishedRecordsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPublishedRecordsRef(dataConnect, listPublishedRecordsVars);

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

## GetPublishedRecord
You can execute the `GetPublishedRecord` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [sql-connect-public/index.d.ts](./index.d.ts):
```typescript
getPublishedRecord(vars: GetPublishedRecordVariables, options?: ExecuteQueryOptions): QueryPromise<GetPublishedRecordData, GetPublishedRecordVariables>;

interface GetPublishedRecordRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPublishedRecordVariables): QueryRef<GetPublishedRecordData, GetPublishedRecordVariables>;
}
export const getPublishedRecordRef: GetPublishedRecordRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPublishedRecord(dc: DataConnect, vars: GetPublishedRecordVariables, options?: ExecuteQueryOptions): QueryPromise<GetPublishedRecordData, GetPublishedRecordVariables>;

interface GetPublishedRecordRef {
  ...
  (dc: DataConnect, vars: GetPublishedRecordVariables): QueryRef<GetPublishedRecordData, GetPublishedRecordVariables>;
}
export const getPublishedRecordRef: GetPublishedRecordRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPublishedRecordRef:
```typescript
const name = getPublishedRecordRef.operationName;
console.log(name);
```

### Variables
The `GetPublishedRecord` query requires an argument of type `GetPublishedRecordVariables`, which is defined in [sql-connect-public/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPublishedRecordVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetPublishedRecord` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPublishedRecordData`, which is defined in [sql-connect-public/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPublishedRecordData {
  records: ({
    id: UUIDString;
    slug: string;
    recordType: string;
    title: string;
    shortTitle?: string | null;
    summary: string;
    body?: string | null;
    implementationStatus: string;
    publicationStatus: string;
    verificationStatus: string;
    evidenceProfile: string;
    qualification?: string | null;
    publishedAt?: TimestampString | null;
  } & Record_Key)[];
}
```
### Using `GetPublishedRecord`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPublishedRecord, GetPublishedRecordVariables } from '@tat/sql-connect-public';

// The `GetPublishedRecord` query requires an argument of type `GetPublishedRecordVariables`:
const getPublishedRecordVars: GetPublishedRecordVariables = {
  id: ..., 
};

// Call the `getPublishedRecord()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPublishedRecord(getPublishedRecordVars);
// Variables can be defined inline as well.
const { data } = await getPublishedRecord({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPublishedRecord(dataConnect, getPublishedRecordVars);

console.log(data.records);

// Or, you can use the `Promise` API.
getPublishedRecord(getPublishedRecordVars).then((response) => {
  const data = response.data;
  console.log(data.records);
});
```

### Using `GetPublishedRecord`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPublishedRecordRef, GetPublishedRecordVariables } from '@tat/sql-connect-public';

// The `GetPublishedRecord` query requires an argument of type `GetPublishedRecordVariables`:
const getPublishedRecordVars: GetPublishedRecordVariables = {
  id: ..., 
};

// Call the `getPublishedRecordRef()` function to get a reference to the query.
const ref = getPublishedRecordRef(getPublishedRecordVars);
// Variables can be defined inline as well.
const ref = getPublishedRecordRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPublishedRecordRef(dataConnect, getPublishedRecordVars);

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

## SearchPublishedRecords
You can execute the `SearchPublishedRecords` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [sql-connect-public/index.d.ts](./index.d.ts):
```typescript
searchPublishedRecords(vars: SearchPublishedRecordsVariables, options?: ExecuteQueryOptions): QueryPromise<SearchPublishedRecordsData, SearchPublishedRecordsVariables>;

interface SearchPublishedRecordsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: SearchPublishedRecordsVariables): QueryRef<SearchPublishedRecordsData, SearchPublishedRecordsVariables>;
}
export const searchPublishedRecordsRef: SearchPublishedRecordsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
searchPublishedRecords(dc: DataConnect, vars: SearchPublishedRecordsVariables, options?: ExecuteQueryOptions): QueryPromise<SearchPublishedRecordsData, SearchPublishedRecordsVariables>;

interface SearchPublishedRecordsRef {
  ...
  (dc: DataConnect, vars: SearchPublishedRecordsVariables): QueryRef<SearchPublishedRecordsData, SearchPublishedRecordsVariables>;
}
export const searchPublishedRecordsRef: SearchPublishedRecordsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the searchPublishedRecordsRef:
```typescript
const name = searchPublishedRecordsRef.operationName;
console.log(name);
```

### Variables
The `SearchPublishedRecords` query requires an argument of type `SearchPublishedRecordsVariables`, which is defined in [sql-connect-public/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SearchPublishedRecordsVariables {
  term: string;
  limit?: number | null;
}
```
### Return Type
Recall that executing the `SearchPublishedRecords` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SearchPublishedRecordsData`, which is defined in [sql-connect-public/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SearchPublishedRecordsData {
  records: ({
    id: UUIDString;
    slug: string;
    recordType: string;
    title: string;
    summary: string;
    implementationStatus: string;
    verificationStatus: string;
    publishedAt?: TimestampString | null;
  } & Record_Key)[];
}
```
### Using `SearchPublishedRecords`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, searchPublishedRecords, SearchPublishedRecordsVariables } from '@tat/sql-connect-public';

// The `SearchPublishedRecords` query requires an argument of type `SearchPublishedRecordsVariables`:
const searchPublishedRecordsVars: SearchPublishedRecordsVariables = {
  term: ..., 
  limit: ..., // optional
};

// Call the `searchPublishedRecords()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await searchPublishedRecords(searchPublishedRecordsVars);
// Variables can be defined inline as well.
const { data } = await searchPublishedRecords({ term: ..., limit: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await searchPublishedRecords(dataConnect, searchPublishedRecordsVars);

console.log(data.records);

// Or, you can use the `Promise` API.
searchPublishedRecords(searchPublishedRecordsVars).then((response) => {
  const data = response.data;
  console.log(data.records);
});
```

### Using `SearchPublishedRecords`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, searchPublishedRecordsRef, SearchPublishedRecordsVariables } from '@tat/sql-connect-public';

// The `SearchPublishedRecords` query requires an argument of type `SearchPublishedRecordsVariables`:
const searchPublishedRecordsVars: SearchPublishedRecordsVariables = {
  term: ..., 
  limit: ..., // optional
};

// Call the `searchPublishedRecordsRef()` function to get a reference to the query.
const ref = searchPublishedRecordsRef(searchPublishedRecordsVars);
// Variables can be defined inline as well.
const ref = searchPublishedRecordsRef({ term: ..., limit: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = searchPublishedRecordsRef(dataConnect, searchPublishedRecordsVars);

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

# Mutations

No mutations were generated for the `tat-public` connector.

If you want to learn more about how to use mutations in Data Connect, you can follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

