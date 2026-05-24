// Tipos e defaults seguros para o client.
// NÃO importar de lib/site-content.ts no client — esse arquivo usa fs.

import type { Category, Product } from "./mock-data";

export type SiteContent = {
  hero: {
    image: string;
  };
  banner: {
    image: string;
    caption?: string;
  };
  founder: {
    image: string;
    quote: string;
  };
  galleryImages: string[];
  categories: Category[];
  featuredProducts: Product[];
};

export const DEFAULT_FOUNDER_QUOTE =
  "Faço cada laço pensando em qual menininha vai usá-lo pela primeira vez.";

export const DEFAULT_BANNER_CAPTION = "Pequenos gestos. Memórias eternas.";
