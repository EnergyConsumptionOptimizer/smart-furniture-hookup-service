import type { BusinessMetrics } from "@application/outbound/BusinessMetrics";
import {
  hookupCreationsTotal,
  hookupUpdatesTotal,
  hookupDeletionsTotal,
} from "./businessMetrics";

export class OtelBusinessMetrics implements BusinessMetrics {
  recordSmartFurnitureHookupCreation(): void {
    hookupCreationsTotal.add(1);
  }

  recordSmartFurnitureHookupUpdate(): void {
    hookupUpdatesTotal.add(1);
  }

  recordSmartFurnitureHookupDeletion(): void {
    hookupDeletionsTotal.add(1);
  }
}
