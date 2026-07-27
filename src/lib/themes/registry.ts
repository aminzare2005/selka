import type { ThemeDefinition, ThemePackage } from "@selka/theme-sdk";
import { themesConfig, DEFAULT_THEME_ID } from "../../../themes.config";

export { DEFAULT_THEME_ID };

export function getRegisteredThemeIds(): string[] {
  return themesConfig.map((t) => t.id);
}

export function isRegisteredTheme(id: string): boolean {
  return themesConfig.some((t) => t.id === id);
}

export async function loadThemePackage(themeId: string): Promise<ThemePackage> {
  const entry = themesConfig.find((t) => t.id === themeId) ??
    themesConfig.find((t) => t.id === DEFAULT_THEME_ID);

  if (!entry) {
    throw new Error(`No themes registered`);
  }

  const mod = await entry.loader();
  return mod.default;
}

export async function loadThemeDefinition(themeId: string): Promise<ThemeDefinition> {
  const pkg = await loadThemePackage(themeId);
  return pkg.definition;
}

export async function listThemeDefinitions(): Promise<ThemeDefinition[]> {
  const packages = await Promise.all(themesConfig.map((t) => t.loader()));
  return packages.map((mod) => mod.default.definition);
}
