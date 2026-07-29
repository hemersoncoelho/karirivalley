export type EcosystemGroup = {
  id: string;
  label: string;
  title: string;
  desc: string;
  color: string;
  /** Variante do color com contraste garantido para uso como texto sobre fundo claro. */
  textColor: string;
  bg: string;
  border: string;
  items: readonly string[];
};

// Single source of truth for the ecosystem visual AND the pillar cards below it —
// keeping them on one array is what lets hovering a node highlight its card (and
// vice versa) without the two ever drifting out of sync.
export const ECOSYSTEM_GROUPS: readonly EcosystemGroup[] = [
  {
    id: "people",
    label: "Pessoas",
    title: "Pessoas & Talentos",
    desc: "Empreendedores, devs, pesquisadores e todos que movem a inovação no Cariri.",
    color: "#239D8C",
    textColor: "#166E62",
    bg: "rgba(35,157,140,.12)",
    border: "rgba(35,157,140,.5)",
    items: ["Empreendedores", "Desenvolvedores", "Pesquisadores", "Estudantes"],
  },
  {
    id: "business",
    label: "Startups",
    title: "Startups & Empresas",
    desc: "Negócios que transformam desafios locais em oportunidades reais de impacto.",
    color: "#E9B23C",
    textColor: "#8A5C13",
    bg: "rgba(232,178,60,.16)",
    border: "rgba(232,178,60,.55)",
    items: ["Startups", "Empresas", "Serviços"],
  },
  {
    id: "education",
    label: "Educação",
    title: "Educação & Pesquisa",
    desc: "Universidades, institutos e habitats que formam talento e sustentam o ecossistema.",
    color: "#C25A2E",
    textColor: "#C25A2E",
    bg: "rgba(194,90,46,.12)",
    border: "rgba(194,90,46,.5)",
    items: ["Universidades", "Institutos de Pesquisa", "Habitats de Inovação"],
  },
  {
    id: "investment",
    label: "Investimento",
    title: "Investimento & Apoio",
    desc: "Investidores e mentores que apostam no potencial do interior do Ceará.",
    color: "#1E4D3A",
    textColor: "#1E4D3A",
    bg: "rgba(30,77,58,.1)",
    border: "rgba(30,77,58,.5)",
    items: ["Investidores Anjo", "Fundos", "Mentores"],
  },
  {
    id: "government",
    label: "Governo",
    title: "Governo & Instituições",
    desc: "Gestões municipais e estaduais que criam políticas para a inovação regional.",
    color: "#0F3B36",
    textColor: "#0F3B36",
    bg: "rgba(15,59,54,.1)",
    border: "rgba(15,59,54,.5)",
    items: ["Governos Municipais", "Instituições de Fomento", "Políticas Públicas"],
  },
  {
    id: "community",
    label: "Comunidades",
    title: "Comunidades & Eventos",
    desc: "Coletivos e iniciativas locais que mantêm o ecossistema em movimento.",
    color: "#8A5C13",
    textColor: "#8A5C13",
    bg: "rgba(138,92,19,.1)",
    border: "rgba(138,92,19,.5)",
    items: ["Coletivos", "Iniciativas Locais", "Eventos"],
  },
] as const;

export type NodePosition = { cx: number; cy: number; dirX: number; dirY: number };

export function ellipsePoint(
  center: { cx: number; cy: number },
  rx: number,
  ry: number,
  angleRad: number
): NodePosition {
  const dirX = Math.cos(angleRad);
  const dirY = Math.sin(angleRad);
  return {
    cx: Math.round((center.cx + rx * dirX) * 10) / 10,
    cy: Math.round((center.cy + ry * dirY) * 10) / 10,
    dirX,
    dirY,
  };
}

export function groupAngle(index: number, total: number, startDeg = -90): number {
  return ((startDeg + (360 / total) * index) * Math.PI) / 180;
}
