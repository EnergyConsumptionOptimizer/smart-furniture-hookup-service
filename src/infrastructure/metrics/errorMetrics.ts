import { metrics } from "@opentelemetry/api";

const meter = metrics.getMeter("hookup-service");

export const hookupErrorsTotal = meter.createCounter("hookup_errors_total", {
  description: "Total number of errors in hookup service",
});
