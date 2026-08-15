# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { listPublishedRecords, getPublishedRecord, searchPublishedRecords } from '@tat/sql-connect-public';


// Operation ListPublishedRecords:  For variables, look at type ListPublishedRecordsVars in ../index.d.ts
const { data } = await ListPublishedRecords(dataConnect, listPublishedRecordsVars);

// Operation GetPublishedRecord:  For variables, look at type GetPublishedRecordVars in ../index.d.ts
const { data } = await GetPublishedRecord(dataConnect, getPublishedRecordVars);

// Operation SearchPublishedRecords:  For variables, look at type SearchPublishedRecordsVars in ../index.d.ts
const { data } = await SearchPublishedRecords(dataConnect, searchPublishedRecordsVars);


```