#!/usr/bin/env node
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import { findStorybookComponents } from "./parser";
import { generateStoryFile } from "./generator";

const TEMPLATE_PATH = path.resolve(__dirname, "../templates/story.ejs");

async function runCLI() {
  console.log(chalk.cyan("📘 Storybook Generator CLI"));

  const { rootFolder } = await inquirer.prompt([
    {
      type: "input",
      name: "rootFolder",
      message: "Where are your components located?",
      default: "src",
    },
  ]);

  const components = await findStorybookComponents(rootFolder);

  if (components.length === 0) {
    console.log(chalk.yellow("⚠️ No components with @auto-story found."));
    return;
  }

  console.log(
    chalk.green(`✅ Found ${components.length} component(s) with @auto-story.`),
  );

  const { manualSelect } = await inquirer.prompt([
    {
      type: "confirm",
      name: "manualSelect",
      message: "Do you want to manually select which ones to generate?",
      default: false,
    },
  ]);

  let selected = components;

  if (manualSelect) {
    const { selectedNames } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "selectedNames",
        message: "Select the components:",
        choices: components.map((c) => ({
          name: `${c.storyTitle} (${c.componentName})`,
          value: c,
        })),
      },
    ]);

    selected = selectedNames;
  }

  const { storiesRoot } = await inquirer.prompt([
    {
      type: "input",
      name: "storiesRoot",
      message: "Where should the stories be saved?",
      default: "src/stories",
    },
  ]);

  for (const component of selected) {
    await generateStoryFile({
      componentPath: component.componentPath,
      componentName: component.componentName,
      storyTitle: component.storyTitle,
      templatePath: TEMPLATE_PATH,
      storiesRoot,
      generateDefault: component.generateDefault,
      globalArgs: component.globalArgs,
      variants: component.variants,
      defaultArgs: component.defaultArgs,
    });
  }

  console.log(chalk.green("\n✨ Story generation completed!"));
}

runCLI().catch((err) => {
  console.error(chalk.red("❌ CLI error:"), err);
});
