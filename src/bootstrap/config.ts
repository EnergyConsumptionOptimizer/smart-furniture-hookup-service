import { z } from "zod";

export const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  MONGODB_HOST: z.string().default("localhost"),
  MONGODB_PORT: z.coerce.number().default(27017),
  MONGO_DB: z.string().default("hookup"),
  KAFKA_CLIENT_ID: z.string().default("hookup-service"),
  KAFKA_BOOTSTRAP_SERVERS: z.string().default("kafka:9092"),
  KAFKA_GROUP_ID: z.string().default("hookup-service-group"),
  DEVICE_INGESTION_URL: z.string().default("http://localhost:80"),
  LOG_LEVEL: z
    .enum(["trace", "debug", "info", "warn", "error", "fatal"])
    .default("info"),
  NAME: z.string().default("hookup-service"),
});

const result = EnvSchema.safeParse(process.env);

if (!result.success) {
  console.error(
    "Invalid environment configuration:",
    JSON.stringify(result.error.issues, null, 2),
  );
  process.exit(1);
}

const env = result.data;

export const config = {
  port: env.PORT,
  mongo: {
    uri: `mongodb://${env.MONGODB_HOST}:${env.MONGODB_PORT}/${env.MONGO_DB}`,
  },
  kafka: {
    clientId: env.KAFKA_CLIENT_ID,
    brokers: env.KAFKA_BOOTSTRAP_SERVERS.split(","),
    groupId: env.KAFKA_GROUP_ID,
  },
  deviceIngestionUrl: env.DEVICE_INGESTION_URL,
  logLevel: env.LOG_LEVEL,
  appName: env.NAME,
} as const;

export type Config = typeof config;
