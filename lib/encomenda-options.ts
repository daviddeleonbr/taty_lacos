// Catálogo de opções para o formulário de encomenda.
// Edite livremente — o admin pode ignorar e criar peças totalmente customizadas.

export const STYLE_REFERENCES = [
  {
    id: "laco-classico",
    label: "Laço clássico",
    description: "O atemporal. Duas alças simétricas e centro firme.",
    image:
      "https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "tiara-bailarina",
    label: "Tiara bailarina",
    description: "Estrutura macia com laço delicado lateral.",
    image:
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "headband-veludo",
    label: "Headband veludo",
    description: "Toque aveludado, queridinho dos ensaios newborn.",
    image:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "laco-duplo",
    label: "Laço duplo",
    description: "Quatro alças sobrepostas para um efeito mais cheio.",
    image:
      "https://images.unsplash.com/photo-1551038247-3d9af20df552?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "presilha-flor",
    label: "Presilha flor",
    description: "Flor central com pétalas em tecido e miolo bordado.",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "personalizado",
    label: "Quero algo único",
    description: "Conte sua ideia e desenhamos juntos.",
    image:
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=600&q=80",
  },
] as const;

export const COLOR_SWATCHES = [
  { id: "blush", label: "Rosa Blush", hex: "#F5D5D0" },
  { id: "nude", label: "Nude Rosado", hex: "#F0E0D6" },
  { id: "off-white", label: "Off-White", hex: "#FAF6F2" },
  { id: "bordeaux", label: "Bordô Poeirento", hex: "#8B4B5C" },
  { id: "champagne", label: "Dourado Champagne", hex: "#C9A876" },
  { id: "sage", label: "Verde Sálvia", hex: "#A8B5A0" },
  { id: "lavanda", label: "Lavanda", hex: "#C8B6CC" },
  { id: "rose", label: "Rosé Antigo", hex: "#D49AA0" },
] as const;

export const MATERIAL_OPTIONS = [
  { id: "cetim", label: "Cetim" },
  { id: "veludo", label: "Veludo" },
  { id: "gorgurao", label: "Gorgurão" },
  { id: "organza", label: "Organza" },
  { id: "linho", label: "Linho" },
] as const;

export const OCCASION_OPTIONS = [
  { id: "ensaio-newborn", label: "Ensaio newborn" },
  { id: "mesversario", label: "Mêsversário" },
  { id: "aniversario", label: "Aniversário" },
  { id: "batizado", label: "Batizado" },
  { id: "festa-tema", label: "Festa temática" },
  { id: "presente", label: "Presente" },
  { id: "dia-a-dia", label: "Para o dia a dia" },
] as const;

export const AGE_RANGES = [
  { id: "newborn", label: "Recém-nascida (0-3m)" },
  { id: "0-6m", label: "0 a 6 meses" },
  { id: "6-12m", label: "6 a 12 meses" },
  { id: "1-2a", label: "1 a 2 anos" },
  { id: "2-4a", label: "2 a 4 anos" },
  { id: "4-7a", label: "4 a 7 anos" },
  { id: "outra", label: "Outra idade" },
] as const;
