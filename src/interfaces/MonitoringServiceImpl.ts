import { MonitoringService } from "@application/port/MonitoringService";
import { SmartFurnitureHookupID } from "@domain/SmartFurnitureHookupID";
import axios from "axios";

export class MonitoringServiceImpl implements MonitoringService {
  private readonly MONITORING_SERVICE_URI =
    process.env.MONITORING_SERVICE_URI ||
    `http://${process.env.MONITORING_SERVICE_HOST || "monitoring"}:${process.env.MONITORING_SERVICE_PORT || 3003}`;

  async registerSmartFurnitureHookup(
    id: SmartFurnitureHookupID,
    endpoint: string,
  ): Promise<void> {
    await axios.post(
      `${this.MONITORING_SERVICE_URI}/api/internal/registerSmartFurnitureHookup`,
      {
        smartFurnitureHookupID: id.value,
        endpoint,
      },
    );
  }

  async disconnectSmartFurnitureHookup(endpoint: string): Promise<void> {
    await axios.post(
      `${this.MONITORING_SERVICE_URI}/api/internal/disconnectSmartFurnitureHookup`,
      {
        endpoint,
      },
    );
  }
}
