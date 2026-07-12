import { listThemeDefinitions } from "@/lib/themes/registry";
import { apiSuccess } from "@/lib/api";

export async function GET() {
  const themes = await listThemeDefinitions();
  return apiSuccess(
    themes.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      previewColor: t.tokens.colors.primary,
    })),
  );
}
