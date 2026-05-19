import { metrics } from "@opentelemetry/api";

const meter = metrics.getMeter("smart-furniture-service");

export const hookupCreationsTotal = meter.createCounter(
  "smart_furniture_hookup_creations_total",
  {
    description: "Total number of smart furniture hookup creations",
  },
);

export const hookupUpdatesTotal = meter.createCounter(
  "smart_furniture_hookup_updates_total",
  {
    description: "Total number of smart furniture hookup updates",
  },
);

export const hookupDeletionsTotal = meter.createCounter(
  "smart_furniture_hookup_deletions_total",
  {
    description: "Total number of smart furniture hookup deletions",
  },
);
