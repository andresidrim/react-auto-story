import path from "path";

export function getStoryTitleFromPath(
  filePath: string,
  root: string = "src",
): string {
  const relativePath = path.relative(root, filePath);
  const parsed = path.parse(relativePath);

  const isIndex = parsed.name.toLowerCase() === "index";
  const title = isIndex ? parsed.dir : path.join(parsed.dir, parsed.name);

  return title
    .replace(/\\/g, "/")
    .replace(/^components\//i, "")
    .replace(/^src\//i, "")
    .split("/")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("/");
}
