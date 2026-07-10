import type { StorageAdapter } from "./types";

export class MinioStorageAdapter implements StorageAdapter {
  async upload(_file: Buffer, _filename: string, _folder: string): Promise<{ url: string }> {
    throw new Error("MinIO storage is not configured yet. Set STORAGE_DRIVER=local for development.");
  }

  async delete(_url: string): Promise<void> {
    throw new Error("MinIO storage is not configured yet.");
  }
}
