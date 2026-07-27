import type { ComponentType } from "react";
import type { ResolvedTheme, SectionProps, StorefrontContext } from "@selka/theme-sdk";

type SectionRendererProps = {
  sections: ResolvedTheme["sections"];
  sectionMap: Record<string, ComponentType<SectionProps>>;
  context: StorefrontContext;
};

export function SectionRenderer({ sections, sectionMap, context }: SectionRendererProps) {
  return (
    <>
      {sections.map((section, index) => {
        const Component = sectionMap[section.type];
        if (!Component) return null;

        return (
          <Component
            key={`${section.type}-${index}`}
            {...context}
            sectionProps={section.props}
          />
        );
      })}
    </>
  );
}
