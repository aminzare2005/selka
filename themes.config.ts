/**
 * Theme registry configuration.
 *
 * To add an external theme:
 * 1. Create a package that exports a ThemePackage (see packages/theme-sdk)
 * 2. Add it to package.json: "@marty-theme/my-theme": "file:./my-theme" or "github:user/repo"
 * 3. Register it here with a dynamic import
 * 4. Add the package name to transpilePackages in next.config.ts
 */
import type { ThemePackage } from "./packages/theme-sdk/src";

export type ThemeConfigEntry = {
  id: string;
  loader: () => Promise<{ default: ThemePackage }>;
};

export const themesConfig: ThemeConfigEntry[] = [
  {
    id: "modern",
    loader: () => import("@/themes/modern"),
  },
  {
    id: "classic",
    loader: () => import("@/themes/classic"),
  },
];

export const DEFAULT_THEME_ID = "modern";
