import ejs from "ejs";
import fs from "fs-extra";
import path from "path";
import { StoryVariant } from "./common/types/storyVariant";

export async function generateStoryFile(opts: {
  componentPath: string;
  componentName: string;
  storyTitle: string;
  templatePath: string;
  storiesRoot: string;
  globalArgs?: string;
  generateDefault?: boolean;
  variants?: StoryVariant[];
  defaultArgs?: string;
}) {
  const {
    componentPath,
    componentName,
    templatePath,
    storyTitle,
    storiesRoot,
    globalArgs,
    variants,
    generateDefault,
    defaultArgs,
  } = opts;

  const componentFilename = path.basename(componentPath);
  const componentBasename = path.parse(componentFilename).name;

  const parsed = path.parse(componentPath);
  let relativeComponentPathFromSrc = path.relative("src", parsed.dir);

  relativeComponentPathFromSrc = relativeComponentPathFromSrc
    .split(path.sep)
    .filter((part) => part !== "components")
    .join(path.sep);

  const outputFolder = path.join(storiesRoot, relativeComponentPathFromSrc);
  const storyOutputPath = path.join(
    outputFolder,
    `${componentBasename}.stories.tsx`,
  );

  let relativeImportPath = path.relative(
    path.dirname(storyOutputPath),
    componentPath,
  );

  relativeImportPath = relativeImportPath
    .replace(/\\/g, "/")
    .replace(/\.tsx?$/, "");

  if (!relativeImportPath.startsWith(".")) {
    relativeImportPath = "./" + relativeImportPath;
  }

  if (relativeImportPath === "./") {
    relativeImportPath = "./" + componentBasename;
  }

  const rendered = await ejs.renderFile(templatePath, {
    componentName,
    componentFilename,
    storyTitle,
    relativeImportPath,
    globalArgs,
    generateDefault,
    variants,
    defaultArgs,
  });

  await fs.ensureDir(path.dirname(storyOutputPath));
  await fs.outputFile(storyOutputPath, rendered);

  console.log(`Storybook file created: ${storyOutputPath}`);
}
