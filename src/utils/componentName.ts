export function inferNameFromDefaultExport(declaration: any): string | null {
  try {
    if (declaration.getKindName() === "FunctionDeclaration") {
      return declaration.getName() || null;
    }

    const initializer = declaration.getInitializer?.();
    if (initializer?.getKindName() === "ArrowFunction") {
      return declaration.getName?.() || null;
    }

    return null;
  } catch {
    return null;
  }
}
