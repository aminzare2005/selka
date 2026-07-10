import { loadThemeDefinition } from "./registry";
import type { ResolvedTheme, StoreSettings } from "./types";

export async function resolveStoreTheme(
  themeId: string,
  settings: StoreSettings | null | undefined,
): Promise<ResolvedTheme> {
  const theme = await loadThemeDefinition(themeId);
  const storeSettings = (settings ?? {}) as StoreSettings;

  const tokens = {
    colors: {
      ...theme.tokens.colors,
      ...storeSettings.tokens?.colors,
    },
    fonts: {
      ...theme.tokens.fonts,
      ...storeSettings.tokens?.fonts,
    },
    radius: storeSettings.tokens?.radius ?? theme.tokens.radius,
  };

  const sections =
    storeSettings.sections && storeSettings.sections.length > 0
      ? storeSettings.sections
      : theme.defaultSections;

  return {
    id: theme.id,
    name: theme.name,
    tokens,
    sections,
    logo: storeSettings.logo,
    googleFonts: theme.googleFonts,
  };
}

import type { CSSProperties } from "react";

export function themeTokensToCssVars(tokens: ResolvedTheme["tokens"]): CSSProperties {
  return {
    "--color-primary": tokens.colors.primary,
    "--color-secondary": tokens.colors.secondary,
    "--color-background": tokens.colors.background,
    "--color-foreground": tokens.colors.foreground,
    "--color-muted": tokens.colors.muted,
    "--color-accent": tokens.colors.accent,
    "--font-display": tokens.fonts.display,
    "--font-body": tokens.fonts.body,
    "--radius": tokens.radius,
  } as CSSProperties;
}

export function buildGoogleFontsUrl(fonts: ResolvedTheme["googleFonts"]): string | null {
  if (!fonts || fonts.length === 0) return null;

  const families = fonts.map((f) => {
    const weights = f.weights?.join(";") ?? "400;700";
    const family = f.family.replace(/ /g, "+");
    return `family=${family}:wght@${weights}`;
  });

  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}
