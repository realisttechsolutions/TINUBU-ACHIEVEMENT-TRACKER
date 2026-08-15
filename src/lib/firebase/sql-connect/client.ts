export interface DataConnectClientConfig {
  connector: string;
  location: string;
  service: string;
}

export const defaultPublicConnectorConfig: DataConnectClientConfig = {
  connector: 'public',
  location: 'us-central1',
  service: 'tinubu-achievements-tracker',
};

export const defaultStaffConnectorConfig: DataConnectClientConfig = {
  connector: 'staff',
  location: 'us-central1',
  service: 'tinubu-achievements-tracker',
};
