// Tipo seguro para o client.
// NÃO importar de lib/encomenda-styles.ts no client — esse arquivo usa fs.

export type EncomendaStyle = {
  id: string;
  label: string;
  description: string;
  image: string;
};
