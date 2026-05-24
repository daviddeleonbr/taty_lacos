export type Availability = "ready" | "made-to-order";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  availability: Availability;
  collection: string;
  color: string;
  image: string;
  imageHover?: string;
  badge?: string;
};

export type Testimonial = {
  id: string;
  motherName: string;
  daughterAge: string;
  quote: string;
  rating: number;
  image?: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  image: string;
  href: string;
};

// Stable Unsplash photo IDs (children, fabric, soft palettes).
// In production, replace with your own photo shoots.
const photo = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const featuredProducts: Product[] = [
  {
    id: "p1",
    slug: "laco-cetim-rosa-blush",
    name: "Laço Cetim Rosa Blush",
    price: 49.9,
    availability: "ready",
    collection: "Primeiros Passos",
    color: "Rosa Blush",
    image: photo("photo-1522771930-78848d9293e8"),
    imageHover: photo("photo-1519689680058-324335c77eba"),
    badge: "Pronta Entrega",
  },
  {
    id: "p2",
    slug: "tiara-pequena-bailarina",
    name: "Tiara Pequena Bailarina",
    price: 89.0,
    oldPrice: 109.0,
    availability: "ready",
    collection: "Pequena Bailarina",
    color: "Off-White",
    image: photo("photo-1518831959646-742c3a14ebf7"),
    badge: "Última peça",
  },
  {
    id: "p3",
    slug: "headband-veludo-bordo",
    name: "Headband Veludo Bordô",
    price: 69.9,
    availability: "made-to-order",
    collection: "Domingo de Vovó",
    color: "Bordô Poeirento",
    image: photo("photo-1503454537195-1dcabb73ffb9"),
    badge: "Sob Encomenda",
  },
  {
    id: "p4",
    slug: "laco-duplo-dourado-champagne",
    name: "Laço Duplo Dourado Champagne",
    price: 79.0,
    availability: "ready",
    collection: "Edição Festa",
    color: "Dourado Champagne",
    image: photo("photo-1551038247-3d9af20df552"),
    badge: "Pronta Entrega",
  },
  {
    id: "p5",
    slug: "presilha-flor-sage",
    name: "Presilha Flor Sage",
    price: 39.9,
    availability: "made-to-order",
    collection: "Jardim Secreto",
    color: "Verde Sálvia",
    image: photo("photo-1469334031218-e382a71b716b"),
    badge: "Sob Encomenda",
  },
  {
    id: "p6",
    slug: "conjunto-newborn-nude",
    name: "Conjunto Newborn Nude",
    price: 119.0,
    availability: "ready",
    collection: "Recém-chegada",
    color: "Nude Rosado",
    image: photo("photo-1505236858219-8359eb29e329"),
    badge: "Pronta Entrega",
  },
];

export const categories: Category[] = [
  {
    id: "c1",
    name: "Recém-nascidas",
    description: "Tecidos macios para a primeira foto",
    image: photo("photo-1555252333-9f8e92e65df9", 600),
    href: "/colecao/recem-nascidas",
  },
  {
    id: "c2",
    name: "Bebês",
    description: "Conforto e charme para o dia a dia",
    image: photo("photo-1519689680058-324335c77eba", 600),
    href: "/colecao/bebes",
  },
  {
    id: "c3",
    name: "Toddler",
    description: "Personalidade para as pequenas que já correm",
    image: photo("photo-1518831959646-742c3a14ebf7", 600),
    href: "/colecao/toddler",
  },
  {
    id: "c4",
    name: "Datas Especiais",
    description: "Batizado, aniversário e ensaios newborn",
    image: photo("photo-1542038784456-1ea8e935640e", 600),
    href: "/colecao/datas-especiais",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    motherName: "Mariana C.",
    daughterAge: "Helena, 8 meses",
    quote:
      "Chorei quando vi minha Helena usando o laço. Cada detalhe é pensado com tanto carinho — parece que foi feito só para ela.",
    rating: 5,
  },
  {
    id: "t2",
    motherName: "Beatriz L.",
    daughterAge: "Antonella, 2 anos",
    quote:
      "Pedi um laço personalizado para o aniversário da minha filha e o acompanhamento com fotos do processo foi a coisa mais linda. Recomendo de olhos fechados.",
    rating: 5,
  },
  {
    id: "t3",
    motherName: "Camila R.",
    daughterAge: "Cecília, recém-nascida",
    quote:
      "A embalagem é uma experiência à parte. Senti que estava recebendo uma joia. Já é nossa marca eterna para datas especiais.",
    rating: 5,
  },
];

export const galleryImages = [
  photo("photo-1519689680058-324335c77eba", 500),
  photo("photo-1555252333-9f8e92e65df9", 500),
  photo("photo-1518831959646-742c3a14ebf7", 500),
  photo("photo-1542038784456-1ea8e935640e", 500),
  photo("photo-1505236858219-8359eb29e329", 500),
  photo("photo-1503454537195-1dcabb73ffb9", 500),
  photo("photo-1522771930-78848d9293e8", 500),
  photo("photo-1469334031218-e382a71b716b", 500),
];

export const heroImage = photo("photo-1519689680058-324335c77eba", 1400);
export const bannerImage = photo("photo-1545558014-8692077e9b5c", 1600);
export const founderImage = photo("photo-1556228720-195a672e8a03", 800);
