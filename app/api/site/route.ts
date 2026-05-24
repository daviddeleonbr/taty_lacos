import { NextResponse } from "next/server";
import { getSiteContent, saveSiteContent, type SiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

// Bigger payload because of inline data URLs for images
export const maxDuration = 30;

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json({ content });
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Partial<SiteContent>;

    const current = await getSiteContent();
    const next: SiteContent = {
      hero: body.hero ?? current.hero,
      banner: body.banner ?? current.banner,
      founder: body.founder ?? current.founder,
      galleryImages: body.galleryImages ?? current.galleryImages,
      categories: body.categories ?? current.categories,
      featuredProducts: body.featuredProducts ?? current.featuredProducts,
    };

    const saved = await saveSiteContent(next);
    return NextResponse.json({ content: saved });
  } catch (err) {
    console.error("[PUT /api/site]", err);
    return NextResponse.json(
      { error: "Não foi possível salvar o conteúdo." },
      { status: 500 }
    );
  }
}
