import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/sobre", "/galeria", "/como-participar", "/membros", "/agenda", "/oportunidades/publicas"].map((path) => ({
    url: `https://www.karirivalley.com.br${path}`,
  }));
}
