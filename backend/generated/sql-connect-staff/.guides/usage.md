# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { updateInternalWorkflow, getInternalReviewQueue, getResearchBatch } from '@tat/sql-connect-staff';


// Operation UpdateInternalWorkflow:  For variables, look at type UpdateInternalWorkflowVars in ../index.d.ts
const { data } = await UpdateInternalWorkflow(dataConnect, updateInternalWorkflowVars);

// Operation GetInternalReviewQueue:  For variables, look at type GetInternalReviewQueueVars in ../index.d.ts
const { data } = await GetInternalReviewQueue(dataConnect, getInternalReviewQueueVars);

// Operation GetResearchBatch:  For variables, look at type GetResearchBatchVars in ../index.d.ts
const { data } = await GetResearchBatch(dataConnect, getResearchBatchVars);


```