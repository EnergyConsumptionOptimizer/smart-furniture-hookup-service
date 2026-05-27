import { MonitoringService } from "@application/outbound/MonitoringService";
import axios from "axios";
import { Logger } from "pino";
import { getIngestingEndpointResponse } from "@infrastructure/contracts/getIngestingEndpointResponse";

export class HTTPMonitoringService implements MonitoringService {
  readonly #logger?: Logger;

  constructor(
    private readonly baseUrl: string,
    logger?: Logger,
  ) {
    this.#logger = logger;
  }

  async getIngestingEndpoint(): Promise<string | Error> {
    const url = `${this.baseUrl}/api/internal/measurements/getIngestingEndpoint`;

    try {
      const response = getIngestingEndpointResponse.safeParse(
        await axios.get(url),
      );

      if (!response.success) {
        return new Error("Empty ingesting endpoint");
      }
      return response.data.endpoint;
    } catch (error) {
      this.#logger?.error({ error }, "Could not get ingesting endpoint");
      if (error instanceof Error) {
        return error.message;
      }
      return new Error("Could not get ingesting endpoint");
    }
  }
}
