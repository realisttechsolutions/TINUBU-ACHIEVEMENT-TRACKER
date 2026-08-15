const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'tat-staff',
  service: 'tat-staging',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const updateInternalWorkflowRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateInternalWorkflow', inputVars);
}
updateInternalWorkflowRef.operationName = 'UpdateInternalWorkflow';
exports.updateInternalWorkflowRef = updateInternalWorkflowRef;

exports.updateInternalWorkflow = function updateInternalWorkflow(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateInternalWorkflowRef(dcInstance, inputVars));
}
;

const getInternalReviewQueueRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetInternalReviewQueue', inputVars);
}
getInternalReviewQueueRef.operationName = 'GetInternalReviewQueue';
exports.getInternalReviewQueueRef = getInternalReviewQueueRef;

exports.getInternalReviewQueue = function getInternalReviewQueue(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(getInternalReviewQueueRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getResearchBatchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetResearchBatch', inputVars);
}
getResearchBatchRef.operationName = 'GetResearchBatch';
exports.getResearchBatchRef = getResearchBatchRef;

exports.getResearchBatch = function getResearchBatch(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getResearchBatchRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;
