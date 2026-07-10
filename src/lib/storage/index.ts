import { LocalStorageAdapter } from "./local";
import { MinioStorageAdapter } from "./minio";
import type { StorageAdapter } from "./types";

let storageInstance: StorageAdapter | null = null;

export function getStorage(): StorageAdapter {
  if (!storageInstance) {
    const driver = process.env.STORAGE_DRIVER ?? "local";
    storageInstance = driver === "minio" ? new MinioStorageAdapter() : new LocalStorageAdapter();
  }
  return storageInstance;
}
