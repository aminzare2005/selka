export interface StorageAdapter {
  upload(file: Buffer, filename: string, folder: string): Promise<{ url: string }>;
  delete(url: string): Promise<void>;
}
