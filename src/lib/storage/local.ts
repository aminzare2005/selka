import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import type { StorageAdapter } from "./types";

export class LocalStorageAdapter implements StorageAdapter {
  async upload(file: Buffer, filename: string, folder: string): Promise<{ url: string }> {
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, file);
    return { url: `/uploads/${folder}/${filename}` };
  }

  async delete(url: string): Promise<void> {
    const filePath = path.join(process.cwd(), "public", url);
    try {
      await unlink(filePath);
    } catch {
      // file may not exist
    }
  }
}
