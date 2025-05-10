import fs from "fs-extra";
import path from "path";

export async function getAllTSXFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const files = await Promise.all(
    entries.map((entry) => {
      const res = path.resolve(dir, entry.name);
      if (entry.isDirectory()) {
        return getAllTSXFiles(res);
      } else if (res.endsWith(".tsx")) {
        return [res];
      } else {
        return [];
      }
    }),
  );

  return files.flat();
}
