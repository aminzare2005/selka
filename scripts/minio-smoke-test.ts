import "dotenv/config";
import * as Minio from "minio";
import { randomUUID } from "crypto";

/**
 * Smoke-test MinIO using the same env vars as the app.
 * Usage: npx tsx scripts/minio-smoke-test.ts
 */
async function main() {
  const endPoint = process.env.MINIO_ENDPOINT;
  const accessKey = process.env.MINIO_ACCESS_KEY;
  const secretKey = process.env.MINIO_SECRET_KEY;
  const bucket = process.env.MINIO_BUCKET || "selka";
  const port = Number(process.env.MINIO_PORT ?? 9000);
  const useSSL = process.env.MINIO_USE_SSL === "true";

  if (!endPoint || !accessKey || !secretKey) {
    console.error("Set MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY (and optional MINIO_PORT/BUCKET/USE_SSL).");
    process.exit(1);
  }

  const client = new Minio.Client({ endPoint, port, useSSL, accessKey, secretKey });

  console.log(`→ connecting ${endPoint}:${port} ssl=${useSSL} bucket=${bucket}`);

  const exists = await client.bucketExists(bucket);
  if (!exists) {
    await client.makeBucket(bucket, "us-east-1");
    console.log(`✓ created bucket ${bucket}`);
  } else {
    console.log(`✓ bucket ${bucket} exists`);
  }

  const key = `_smoke/${randomUUID()}.txt`;
  const body = Buffer.from(`selka-minio-ok ${new Date().toISOString()}`);
  await client.putObject(bucket, key, body, body.length, {
    "Content-Type": "text/plain",
  });
  console.log(`✓ uploaded ${key}`);

  const stream = await client.getObject(bucket, key);
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const readBack = Buffer.concat(chunks).toString("utf8");
  console.log(`✓ read back: ${readBack}`);

  await client.removeObject(bucket, key);
  console.log(`✓ deleted ${key}`);

  const publicBase =
    process.env.MINIO_PUBLIC_URL?.replace(/\/$/, "") ||
    `${useSSL ? "https" : "http"}://${endPoint}${port === 443 || port === 80 ? "" : `:${port}`}/${bucket}`;
  console.log(`✓ public base URL would be: ${publicBase}/...`);
  console.log("All good.");
}

main().catch((err) => {
  console.error("MinIO smoke test failed:");
  console.error(err);
  process.exit(1);
});
