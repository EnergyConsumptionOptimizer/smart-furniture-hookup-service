import axios from "axios";
import { Logger } from "pino";
import { PhysicalSmartFurnitureHookupCommunication } from "@application/outbound/PhysicalSmartFurnitureHookupCommunication";

export class HTTPPhysicalSmartFurnitureHookupCommunication implements PhysicalSmartFurnitureHookupCommunication {
  readonly #logger?: Logger;

  constructor(logger?: Logger) {
    this.#logger = logger;
  }

  async updateIngestingEndpoint(
    smartFurnitureHookupEndpoint: string,
    ingestingEndpoint: string,
  ): Promise<undefined | Error> {
    const dockerizedEndpoint = this.#convertToDockerHost(
      smartFurnitureHookupEndpoint,
    );

    try {
      await axios.patch(dockerizedEndpoint, {
        endpoint_url: ingestingEndpoint,
      });
    } catch (error) {
      this.#logger?.error(
        {
          error,
        },
        "Cannot update the endpoint on the physical smart furniture hookup",
      );

      if (error instanceof Error) {
        return error;
      }

      return new Error(
        "Cannot update the endpoint on the physical smart furniture hookup",
      );
    }
  }

  #convertToDockerHost(originalUrl: string): string {
    try {
      const url = new URL(originalUrl);
      if (url.hostname === "localhost" || url.hostname === "127.0.0.1") {
        url.hostname = "host.docker.internal";
      }

      return url.toString();
    } catch (error) {
      this.#logger?.error(
        {
          error,
        },
        "Cannot convert to docker host",
      );
      console.error("Invalid URL received: ", originalUrl);
      return originalUrl;
    }
  }
}
