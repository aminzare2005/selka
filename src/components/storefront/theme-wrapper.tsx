import type { ResolvedTheme } from "@/lib/themes/types";
import { themeTokensToCssVars, buildGoogleFontsUrl } from "@/lib/themes/resolve";

type ThemeWrapperProps = {
  theme: ResolvedTheme;
  children: React.ReactNode;
};

export function ThemeWrapper({ theme, children }: ThemeWrapperProps) {
  const cssVars = themeTokensToCssVars(theme.tokens);
  const fontsUrl = buildGoogleFontsUrl(theme.googleFonts);

  return (
    <div
      dir="rtl"
      lang="fa"
      style={{
        ...cssVars,
        backgroundColor: "var(--color-background)",
        color: "var(--color-foreground)",
      }}
    >
      {fontsUrl && (
        // eslint-disable-next-line @next/next/no-page-custom-font
        <link rel="stylesheet" href={fontsUrl} />
      )}
      {children}
    </div>
  );
}
