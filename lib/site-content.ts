import "server-only";

import {
  bannerImage,
  categories as defaultCategories,
  featuredProducts as defaultFeatured,
  founderImage,
  galleryImages as defaultGallery,
  heroImage,
} from "./mock-data";
import {
  DEFAULT_BANNER_CAPTION,
  DEFAULT_FOUNDER_QUOTE,
  type SiteContent,
} from "./site-content.types";
import { getSupabase } from "./supabase";

export {
  DEFAULT_BANNER_CAPTION,
  DEFAULT_FOUNDER_QUOTE,
  type SiteContent,
};

const TABLE = "site_content";
const ROW_ID = 1;

const DEFAULT_CONTENT: SiteContent = {
  hero: { image: heroImage },
  banner: { image: bannerImage, caption: DEFAULT_BANNER_CAPTION },
  founder: { image: founderImage, quote: DEFAULT_FOUNDER_QUOTE },
  galleryImages: defaultGallery,
  categories: defaultCategories,
  featuredProducts: defaultFeatured,
};

function mergeWithDefaults(partial: Partial<SiteContent>): SiteContent {
  return {
    hero: partial.hero ?? DEFAULT_CONTENT.hero,
    banner: partial.banner ?? DEFAULT_CONTENT.banner,
    founder: partial.founder ?? DEFAULT_CONTENT.founder,
    galleryImages: partial.galleryImages ?? DEFAULT_CONTENT.galleryImages,
    categories: partial.categories ?? DEFAULT_CONTENT.categories,
    featuredProducts:
      partial.featuredProducts ?? DEFAULT_CONTENT.featuredProducts,
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  // Read-path resiliente: qualquer erro de configuração ou banco
  // cai nos defaults — a home nunca quebra por causa do CMS.
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from(TABLE)
      .select("content")
      .eq("id", ROW_ID)
      .maybeSingle();

    if (error) {
      console.error("[getSiteContent] query:", error);
      return DEFAULT_CONTENT;
    }
    if (!data) {
      // Linha ainda não existe — devolve defaults sem persistir nada
      return DEFAULT_CONTENT;
    }
    return mergeWithDefaults((data.content ?? {}) as Partial<SiteContent>);
  } catch (err) {
    console.error("[getSiteContent] config:", err);
    return DEFAULT_CONTENT;
  }
}

export async function saveSiteContent(content: SiteContent) {
  const supabase = getSupabase();
  const { error } = await supabase.from(TABLE).upsert({
    id: ROW_ID,
    content,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(`saveSiteContent: ${error.message}`);
  return content;
}

export function getDefaultSiteContent(): SiteContent {
  return DEFAULT_CONTENT;
}
