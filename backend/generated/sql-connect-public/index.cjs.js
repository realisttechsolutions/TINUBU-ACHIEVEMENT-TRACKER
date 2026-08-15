const { queryRef, executeQuery, validateArgsWithOptions, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'tat-public',
  service: 'tat-e01-local',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const listPublishedRecordsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListPublishedRecords', inputVars);
}
listPublishedRecordsRef.operationName = 'ListPublishedRecords';
exports.listPublishedRecordsRef = listPublishedRecordsRef;

exports.listPublishedRecords = function listPublishedRecords(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listPublishedRecordsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const getPublishedRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPublishedRecord', inputVars);
}
getPublishedRecordRef.operationName = 'GetPublishedRecord';
exports.getPublishedRecordRef = getPublishedRecordRef;

exports.getPublishedRecord = function getPublishedRecord(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getPublishedRecordRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const searchPublishedRecordsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'SearchPublishedRecords', inputVars);
}
searchPublishedRecordsRef.operationName = 'SearchPublishedRecords';
exports.searchPublishedRecordsRef = searchPublishedRecordsRef;

exports.searchPublishedRecords = function searchPublishedRecords(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(searchPublishedRecordsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;
