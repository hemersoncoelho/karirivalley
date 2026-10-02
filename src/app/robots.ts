import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/oportunidades/publicas"],
      disallow: ["/admin", "/dashboard", "/comunidade", "/vitrine", "/eventos", "/oportunidades", "/perfil", "/login", "/cadastro", "/api/"],
    },
    sitemap: "https://www.karirivalley.com.br/sitemap.xml",
  };
}
