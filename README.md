# react-auto-story

**react-auto-story** is a CLI tool that automatically generates Storybook `.stories.tsx` files for your React components based on an `@auto-story` annotation.

Useful for teams who want to streamline Storybook integration with minimal manual setup in React projects.

---

## ✨ Features

- Detects annotated components in your React project
- Automatically creates clean `.stories.tsx` files
- Works with both named and default exports
- Outputs stories to a structured `src/stories/` folder
- Smart import paths and customizable title generation

---

## 📦 Installation

```bash
npm install -g react-auto-story
```

or with PNPM:

```bash
pnpm add -g react-auto-story
```

---

## 🚀 Usage

From your project root, simply run:

```bash
react-auto-story
```

Then follow the interactive prompts to:

- Choose the base folder (e.g. `src`)
- Select which components to generate stories for
- Choose where to save the generated files (e.g. `src/stories`)

---

## 🧠 Mark your components

Only components explicitly marked with `@auto-story` will be picked up.

```tsx
// @auto-story
export function Button() {
  return <button>Click me</button>;
}
```

Or:

```tsx
// @auto-story
export default function Input() {
  return <input />;
}
```

---

## 🗂 Output structure

Your stories will be created in:

```
src/stories/[relative-folder]/[Component].stories.tsx
```

For example:

```
src/components/atoms/Button.tsx → src/stories/atoms/Button.stories.tsx
```

---

## ⚙ Configuration

Currently, the CLI assumes:

- Your source code is inside the `src/` folder
- Components are located in folders like `components/atoms/...`
- Output stories are placed in `src/stories`, preserving substructure

You can customize paths by editing the CLI source or contributing to the project.

---

## 📄 License

MIT
