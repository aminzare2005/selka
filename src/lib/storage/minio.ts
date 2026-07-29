import * as Minio from "minio";
import type { StorageAdapter } from "./types";

type MinioEnv = {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucket: string;
  publicBaseUrl: string;
};

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `MinIO is not configured: missing ${name}. See docs/MINIO.md`,
    );
  }
  return value;
}

function readEnv(): MinioEnv {
  const endPoint = required("MINIO_ENDPOINT");
  const accessKey = required("MINIO_ACCESS_KEY");
  const secretKey = required("MINIO_SECRET_KEY");
  const bucket = process.env.MINIO_BUCKET?.trim() || "selka";
  const port = Number(process.env.MINIO_PORT ?? (process.env.MINIO_USE_SSL === "true" ? 443 : 9000));
  const useSSL =
    process.env.MINIO_USE_SSL === "true" ||
    process.env.MINIO_USE_SSL === "1";

  if (!Number.isFinite(port) || port <= 0) {
    throw new Error("MINIO_PORT must be a positive number");
  }

  const explicitPublic = process.env.MINIO_PUBLIC_URL?.trim().replace(/\/$/, "");
  const publicBaseUrl =
    explicitPublic ||
    `${useSSL ? "https" : "http"}://${endPoint}${port === 443 || port === 80 ? "" : `:${port}`}/${bucket}`;

  return {
    endPoint,
    port,
    useSSL,
    accessKey,
    secretKey,
    bucket,
    publicBaseUrl,
  };
}

function objectKey(folder: string, filename: string): string {
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "").replace(/\.\./g, "");
  const cleanName = filename.replace(/^\/+/g, "").replace(/\.\./g, "");
  return cleanFolder ? `${cleanFolder}/${cleanName}` : cleanName;
}

export class MinioStorageAdapter implements StorageAdapter {
  private client: Minio.Client;
  private bucket: string;
  private publicBaseUrl: string;
  private ready: Promise<void>;

  constructor() {
    const env = readEnv();
    this.bucket = env.bucket;
    this.publicBaseUrl = env.publicBaseUrl;
    this.client = new Minio.Client({
      endPoint: env.endPoint,
      port: env.port,
      useSSL: env.useSSL,
      accessKey: env.accessKey,
      secretKey: env.secretKey,
    });
    this.ready = this.ensureBucket();
  }

  private async ensureBucket(): Promise<void> {
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket, "us-east-1");
    }

    // Public read for storefront images (upload still requires access keys).
    const policy = JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: { AWS: ["*"] },
          Action: ["s3:GetObject"],
          Resource: [`arn:aws:s3:::${this.bucket}/*`],
        },
      ],
    });

    try {
      await this.client.setBucketPolicy(this.bucket, policy);
    } catch (err) {
      // Some hosted S3-compatible providers disallow anonymous policies; uploads still work.
      console.warn("[minio] could not set public-read bucket policy:", err);
    }
  }

  async upload(file: Buffer, filename: string, folder: string): Promise<{ url: string }> {
    await this.ready;
    const key = objectKey(folder, filename);
    await this.client.putObject(this.bucket, key, file, file.length, {
      "Content-Type": guessContentType(filename),
      "Cache-Control": "public, max-age=31536000, immutable",
    });
    return { url: `${this.publicBaseUrl}/${key}` };
  }

  async delete(url: string): Promise<void> {
    await this.ready;
    const key = this.keyFromUrl(url);
    if (!key) return;
    try {
      await this.client.removeObject(this.bucket, key);
    } catch {
      // object may already be gone
    }
  }

  private keyFromUrl(url: string): string | null {
    const base = this.publicBaseUrl.replace(/\/$/, "");
    if (url.startsWith(`${base}/`)) {
      return decodeURIComponent(url.slice(base.length + 1));
    }

    try {
      const parsed = new URL(url);
      const parts = parsed.pathname.replace(/^\/+/, "").split("/");
      if (parts[0] === this.bucket) {
        return decodeURIComponent(parts.slice(1).join("/"));
      }
      return decodeURIComponent(parts.join("/"));
    } catch {
      return null;
    }
  }
}

function guessContentType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    case "jpg":
    case "jpeg":
    default:
      return "image/jpeg";
  }
}
