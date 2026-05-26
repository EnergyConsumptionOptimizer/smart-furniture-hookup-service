/**
 * @outbound
 * Service interface for managing monitoring connections
 * to smart furniture hookups.
 */
export interface MonitoringService {
  getIngestingEndpoint(): Promise<string | Error>;
}
