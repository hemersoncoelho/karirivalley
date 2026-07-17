export type EcosystemGroup = {
  id: string;
  label: string;
  title: string;
  desc: string;
  color: string;
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
    bg: "rgba(35,157,140,.09)",
    border: "rgba(35,157,140,.2)",
    items: ["Empreendedores", "Desenvolvedores", "Pesquisadores", "Estudantes"],
  },
  {
    id: "business",
    label: "Startups",
    title: "Startups & Empresas",
    desc: "Negócios que transformam desafios locais em oportunidades reais de impacto.",
    color: "#E9B23C",
    bg: "rgba(232,184,75,.08)",
    border: "rgba(232,184,75,.2)",
    items: ["Startups", "Empresas", "Serviços"],
  },
  {
    id: "education",
    label: "Educação",
    title: "Educação & Pesquisa",
    desc: "Universidades, institutos e habitats que formam talento e sustentam o ecossistema.",
    color: "#E0715A",
    bg: "rgba(224,113,90,.09)",
    border: "rgba(224,113,90,.2)",
    items: ["Universidades", "Institutos de Pesquisa", "Habitats de Inovação"],
  },
  {
    id: "investment",
    label: "Investimento",
    title: "Investimento & Apoio",
    desc: "Investidores e mentores que apostam no potencial do interior do Ceará.",
    color: "#C25A2E",
    bg: "rgba(194,90,46,.1)",
    border: "rgba(194,90,46,.22)",
    items: ["Investidores Anjo", "Fundos", "Mentores"],
  },
  {
    id: "government",
    label: "Governo",
    title: "Governo & Instituições",
    desc: "Gestões municipais e estaduais que criam políticas para a inovação regional.",
    color: "#7FA4D8",
    bg: "rgba(15,34,64,.35)",
    border: "rgba(127,164,216,.25)",
    items: ["Governos Municipais", "Instituições de Fomento", "Políticas Públicas"],
  },
  {
    id: "community",
    label: "Comunidades",
    title: "Comunidades & Eventos",
    desc: "Coletivos e iniciativas locais que mantêm o ecossistema em movimento.",
    color: "#85D4B4",
    bg: "rgba(133,212,180,.08)",
    border: "rgba(133,212,180,.2)",
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
