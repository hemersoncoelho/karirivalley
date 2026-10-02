/**
 * Import the community's photo archive without changing the original files.
 * Run: node scripts/import-gallery.mjs /path/to/Photos-1-001
 * Requires sharp, which is included in this project's Next.js installation.
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { join, basename, resolve } from "node:path";
import sharp from "sharp";

const sourceDirectory = resolve(process.argv[2] ?? "/home/joao/Downloads/Photos-1-001");
const outputDirectory = resolve("public/media/gallery");
const sourceFiles = (await readdir(sourceDirectory)).filter((name) => /\.(jpe?g|png|webp|heic|heif)$/i.test(name)).sort();

await mkdir(outputDirectory, { recursive: true });

// Descriptions follow what is visible in the supplied photographs; names of
// events, people, institutions, and venues are not inferred from filenames.
const photoDescriptions = {
  "20230715_152511.jpg": "Participante apresenta a comunidade ao lado de um painel durante um encontro",
  "20230715_155236.jpg": "Pessoas acompanham uma conversa em um espaço aberto de inovação",
  "20230927_201512.jpg": "Participante conduz uma conversa com pessoas reunidas em mesas",
  "20231107_213939_fav.jpg": "Grupo da comunidade reunido à noite em frente ao painel do Siará Tech Summit",
  "20231108_150500_fav.jpg": "Pessoas da comunidade seguram a bandeira do Kariri Valley em um evento",
  "20231108_150514.jpg": "Grupo da comunidade reunido com a bandeira do Kariri Valley",
  "20231108_161347.jpg": "Participante assina a bandeira do Kariri Valley",
  "20231122_162417.jpg": "Pessoas conversam em torno de uma mesa com materiais de uma atividade colaborativa",
  "20231122_162428.jpg": "Participantes compartilham ideias em uma sala com mesas e materiais de trabalho",
  "20231125_183715.jpg": "Grupo da comunidade reunido em um espaço de encontro, com pessoas sentadas e em pé",
  "20231205_172120_fav.jpg": "Pessoas da comunidade reunidas no palco de um auditório, com o painel Ilumina Day ao fundo",
  "20231208_110704.jpg": "Grupo da comunidade reunido em frente a uma parede com a marca Sicredi",
  "20260801_195702_fav.jpg": "Pessoas da comunidade reunidas à noite na varanda de um espaço de encontro",
  "IMG-20220402-WA0012.jpg": "Participantes acompanham uma apresentação sentados em uma sala",
  "IMG-20220521-WA0068.jpg": "Grupo de participantes reunido sobre um tapete vermelho após uma atividade",
  "IMG-20220522-WA0002.jpg": "Participantes trabalham em grupos ao redor de mesas em uma sala de inovação",
  "IMG-20220522-WA0006.jpg": "Painel de atividade colaborativa com anotações e desenhos sobre forças, oportunidades e ameaças",
  "IMG-20220522-WA0016.jpg": "Grupo da comunidade posa entre painéis do Kariri Valley e do Sebrae",
  "IMG_20220527_202026603.jpg": "Pessoas acompanham uma apresentação com slides em uma sala de encontro",
  "IMG-20220527-WA0056.jpg": "Grupo da comunidade reunido em torno de mesas após uma conversa",
  "IMG-20220527-WA0088.jpg": "Participante apresenta ideias a um grupo sentado em uma sala",
  "IMG-20220603-WA0043.jpg": "Pessoas da comunidade reunidas para uma fotografia de grupo em uma sala",
  "IMG_20220716_171710485.jpg": "Pessoas sentadas em roda participam de uma conversa em um espaço aberto",
  "IMG_20220716_171740983.jpg": "Participante fala a uma roda de pessoas em um espaço de inovação",
  "IMG_20220716_172915464.jpg": "Participantes com camisetas do Kariri Valley reunidos em um evento",
  "IMG-20220716-WA0043.jpg": "Participantes da comunidade apresentam ideias junto a uma tela em um espaço de evento",
  "IMG-20220801-WA0040.jpg": "Participante com microfone conversa com pessoas sentadas em um espaço aberto de inovação",
  "IMG_20220928_183243772.jpg": "Grupo sentado em roda sobre um gramado interno compartilha uma conversa",
  "IMG_20221011_144713377.jpg": "Pessoas reunidas em círculo conversam em uma sala de inovação",
  "IMG-20221019-WA0058.jpg": "Grupo da comunidade reunido em uma sala com mesas, cadeiras e painéis",
  "IMG-20221025-WA0024.jpg": "Participantes apresentam ideias diante de estudantes em uma sala de aula",
  "IMG-20221105-WA0002_fav.jpg": "Grande grupo reunido sobre um palco, com os painéis Ceará Awards ao fundo",
  "IMG-20221216-WA0100.jpg": "Grupo da comunidade reunido em um auditório, com participantes segurando certificados",
  "IMG-20230118-WA0076.jpg": "Participantes reunidos em uma sala de encontro, segurando uma chave simbólica",
  "IMG-20230309-WA0036.jpg": "Grupo da comunidade reunido em cadeiras sobre um tapete vermelho",
  "IMG_20230401_095550177.jpg": "Participante fala a um público sentado em uma sala com painéis coloridos",
  "IMG_20230401_100201311.jpg": "Participante apresenta ideias ao lado de uma projeção durante um encontro",
  "IMG-20230401-WA0022.jpg": "Grupo da comunidade reunido após uma apresentação em uma sala",
  "IMG-20230831-WA0074.jpg": "Pessoas da comunidade reunidas ao ar livre, em frente a um edifício",
  "IMG-20231109-WA0004.jpg": "Participantes seguram a bandeira do Kariri Valley em um espaço de exposição",
  "IMG-20231125-WA0120.jpg": "Grupo da comunidade reunido com a bandeira do Kariri Valley em um espaço de encontro",
  "IMG-20250405-WA0128_fav.jpg": "Grande grupo da comunidade segura a bandeira do Kariri Valley em uma varanda ao pôr do sol",
  "IMG-20251010-WA0134_fav.jpg": "Pessoas da comunidade reunidas em um evento, sentadas e em pé sobre uma arquibancada rosa",
  "IMG-20251202-WA0104.jpg": "Participantes da comunidade reunidos em frente a um painel de evento",
  "IMG_8091.HEIC": "Grupo da comunidade reunido em uma sala com um painel iluminado ao fundo",
};
const photos = [];

for (const sourceName of sourceFiles) {
  const source = join(sourceDirectory, sourceName);
  const id = basename(sourceName).replace(/\.[^.]+$/, "").toLowerCase().replaceAll("_", "-");
  // sharp sniffs the actual file format; the supplied .HEIC is a JPEG.
  const metadata = await sharp(source).metadata();
  const filenameDate = sourceName.match(/(20\d{2})(\d{2})(\d{2})/);
  const exifDate = metadata.exif?.toString("latin1").match(/(20\d{2}):(\d{2}):(\d{2}) \d{2}:\d{2}:\d{2}/);
  const dateParts = filenameDate ?? exifDate;
  const date = dateParts ? `${dateParts[1]}-${dateParts[2]}-${dateParts[3]}` : null;
  const favorite = /_fav\./i.test(sourceName);
  const full = await sharp(source).rotate().resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true }).webp({ quality: 82, effort: 5 }).toFile(join(outputDirectory, `${id}.webp`));
  const thumbnail = await sharp(source).rotate().resize({ width: 720, height: 720, fit: "inside", withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toFile(join(outputDirectory, `${id}-thumb.webp`));

  photos.push({
    id,
    src: `/media/gallery/${id}.webp`,
    thumbnail: `/media/gallery/${id}-thumb.webp`,
    width: full.width,
    height: full.height,
    thumbnailWidth: thumbnail.width,
    thumbnailHeight: thumbnail.height,
    date,
    year: date ? Number(date.slice(0, 4)) : null,
    favorite,
    alt: photoDescriptions[sourceName] ?? "Registro da comunidade de inovação do Cariri",
    caption: date ? `Registro da comunidade · ${new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${date}T12:00:00Z`))}` : "Registro da comunidade · data não informada",
    sourceName,
  });
}

// The selected favorites lead the archive; each group is newest first.
photos.sort((a, b) => Number(b.favorite) - Number(a.favorite) || (b.date ?? "").localeCompare(a.date ?? "") || a.id.localeCompare(b.id));

await writeFile(resolve("src/lib/gallery.ts"), `/** Community photo archive. Generated by scripts/import-gallery.mjs. */
export type GalleryPhoto = {
  id: string;
  src: string;
  thumbnail: string;
  width: number;
  height: number;
  thumbnailWidth: number;
  thumbnailHeight: number;
  date: string | null;
  year: number | null;
  favorite: boolean;
  alt: string;
  caption: string;
  sourceName: string;
};

export const galleryPhotos: GalleryPhoto[] = ${JSON.stringify(photos, null, 2)};

export const favoritePhotos = galleryPhotos.filter((photo) => photo.favorite);
export const galleryYears = [...new Set(galleryPhotos.map((photo) => photo.year).filter((year): year is number => year !== null))].sort((a, b) => b - a);
`);

console.log(`Imported ${photos.length} photos (${photos.filter((photo) => photo.favorite).length} favorites).`);
console.log(photos.filter((photo) => photo.favorite).map(({ id, width, height }) => ({ id, width, height })));
