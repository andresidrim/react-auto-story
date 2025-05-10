import { Project, CommentRange } from "ts-morph";
import { getAllTSXFiles } from "./scanner";
import { getStoryTitleFromPath } from "./utils/pathHelpers";
import { inferNameFromDefaultExport } from "./utils/componentName";
import { parseCommentFlags } from "./utils/getArgs";
import { StoryVariant } from "./common/types/storyVariant";

type StoryComponentInfo = {
  componentName: string;
  componentPath: string;
  storyTitle: string;
  globalArgs?: string;
  generateDefault?: boolean;
  variants?: StoryVariant[];
  defaultArgs?: string;
};

export async function findStorybookComponents(
  root: string = "src",
): Promise<StoryComponentInfo[]> {
  const project = new Project({ tsConfigFilePath: "tsconfig.json" });
  const files = await getAllTSXFiles(root);

  const matchedComponents: StoryComponentInfo[] = [];

  for (const fullPath of files) {
    const sourceFile = project.addSourceFileAtPath(fullPath);

    const exports = sourceFile.getExportedDeclarations();

    for (const [exportName, declarations] of exports) {
      for (const declaration of declarations) {
        const leadingComments = declaration.getLeadingCommentRanges();

        const hasStorybookTag = leadingComments.some((comment: CommentRange) =>
          comment.getText().includes("@auto-story"),
        );

        const fullComment = leadingComments
          .map((comment) => comment.getText())
          .join("\n");
        const { globalArgs, variants, generateDefault, defaultArgs } =
          parseCommentFlags(fullComment);

        const componentName =
          exportName === "default"
            ? inferNameFromDefaultExport(declaration) || "DefaultComponent"
            : exportName;

        if (hasStorybookTag) {
          matchedComponents.push({
            componentName,
            componentPath: fullPath,
            storyTitle: getStoryTitleFromPath(fullPath, root),
            globalArgs,
            variants,
            generateDefault,
            defaultArgs,
          });
        }
      }
    }
  }

  return matchedComponents;
}
