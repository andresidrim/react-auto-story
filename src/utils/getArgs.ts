import { StoryVariant } from "../common/types/storyVariant";

export function parseCommentFlags(comment: string): {
  globalArgs?: string;
  defaultArgs?: string;
  variants: StoryVariant[];
  generateDefault: boolean;
} {
  const globalArgsMatch = comment.match(/--global-args\s*:?\s*(\{[\s\S]*?\})/);
  const globalArgs = globalArgsMatch ? globalArgsMatch[1].trim() : undefined;

  const defaultArgsMatch = comment.match(
    /--Default-args\s*:?\s*(\{[\s\S]*?\})/,
  );
  const defaultArgs = defaultArgsMatch ? defaultArgsMatch[1].trim() : undefined;

  const variantNames = [...comment.matchAll(/--variant\s+([^\s]+)/g)].map(
    (m) => m[1],
  );

  const variants: StoryVariant[] = variantNames.map((name) => {
    const argRegex = new RegExp(`--${name}-args\\s*:?\\s*(\\{[\\s\\S]*?\\})`);
    const match = comment.match(argRegex);
    return {
      name,
      args: match ? match[1].trim() : "{}",
    };
  });

  const generateDefault = !comment.includes("--no-default");

  return { globalArgs, defaultArgs, variants, generateDefault };
}
