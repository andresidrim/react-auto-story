import { Project, CommentRange } from "ts-morph";
import { getAllTSXFiles } from "./scanner";
import { getStoryTitleFromPath } from "./utils/pathHelpers";
import { inferNameFromDefaultExport } from "./utils/componentName";

type StoryComponentInfo = {
  componentName: string;
  componentPath: string;
  storyTitle: string;
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

        const componentName =
          exportName === "default"
            ? inferNameFromDefaultExport(declaration) || "DefaultComponent"
            : exportName;

        if (hasStorybookTag) {
          matchedComponents.push({
            componentName,
            componentPath: fullPath,
            storyTitle: getStoryTitleFromPath(fullPath, root),
          });
        }
      }
    }
  }

  return matchedComponents;
}
