/** Soft tint + readable ink pairs used for icon tiles and accents across the panel. */
export const toneSurface = {
  brand: "bg-brand-100 text-brand-600",
  mint: "bg-mint-100 text-mint-600",
  sun: "bg-sun-100 text-sun-600",
  ocean: "bg-ocean-100 text-ocean-600",
  coral: "bg-coral-100 text-coral-600",
} as const;

export type Tone = keyof typeof toneSurface;
