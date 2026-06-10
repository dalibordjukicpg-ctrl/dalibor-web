import "./load-dotenv";

import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";

import { db } from "../lib/db";
import { media, postTranslations, posts } from "../lib/db/schema";
import type { Locale } from "../lib/i18n";
import { locales } from "../lib/i18n";

type SeedPost = {
  id: string;
  slug: string;
  coverMediaId: string;
  coverStorageKey: string;
  coverAlt: string;
  inlineImageSrc: string;
  titles: Record<Locale, string>;
  excerpts: Record<Locale, string>;
  bodies: Record<Locale, string>;
  metaTitles: Record<Locale, string>;
  metaDescriptions: Record<Locale, string>;
};

function inlineFigure(src: string, alt: string): string {
  return `<figure class="wp-block-image size-large"><img src="${src}" alt="${alt}" loading="lazy" /></figure>`;
}

function bodyMe(
  intro: string,
  sections: { h: string; p: string }[],
  image?: { src: string; alt: string },
): string {
  const blocks = sections
    .map((s) => `<h2>${s.h}</h2>\n<p>${s.p}</p>`)
    .join("\n");
  const fig = image ? `\n${inlineFigure(image.src, image.alt)}\n` : "";
  return `<p><em>Ovaj tekst možete mijenjati u adminu: Članci → Blog.</em></p>
<p>${intro}</p>${fig}
${blocks}`;
}

function bodyEn(
  intro: string,
  sections: { h: string; p: string }[],
  image?: { src: string; alt: string },
): string {
  const blocks = sections
    .map((s) => `<h2>${s.h}</h2>\n<p>${s.p}</p>`)
    .join("\n");
  const fig = image ? `\n${inlineFigure(image.src, image.alt)}\n` : "";
  return `<p><em>Edit this article in admin: Posts → Blog.</em></p>
<p>${intro}</p>${fig}
${blocks}`;
}

export const BLOG_POSTS_SEED: SeedPost[] = [
  {
    id: "c3000001-0001-4001-8001-000000000001",
    slug: "trendovi-pejzaznog-dizajna",
    coverMediaId: "d4000001-0001-4001-8001-000000000001",
    coverStorageKey: "hero/landscape-hero.jpg",
    coverAlt: "Pejzažni eksterijer sa bazenom",
    inlineImageSrc: "/showcase/mediterranean-villas.jpg",
    titles: {
      me: "Trendovi pejzažnog dizajna koje vrijedi pratiti",
      en: "Landscape design trends worth following",
      ru: "Тренды ландшафтного дизайна",
    },
    excerpts: {
      me: "Od prirodnih materijala do pametnog osvjetljenja — šest pravaca koji oblikuju dvorišta ove godine.",
      en: "From natural materials to smart lighting — six directions shaping gardens this year.",
      ru: "От натуральных материалов до умного освещения — шесть направлений в ландшафте.",
    },
    bodies: {
      me: bodyMe(
        "Pejzažni dizajn se polako pomjera ka prostorima koji izgledaju prirodno, ali rade pametno — sa jasnom strukturom, održivim biljkama i osvjetljenjem koje produžava korištenje dvorišta poslije zalaska sunca.",
        [
          {
            h: "Prirodni hardscape",
            p: "Kamen, drvo i beton sa teksturom postaju standard. Cilj je topao kontrast uz zelenilo, bez hladnog „urbang“ dojma.",
          },
          {
            h: "Slojevito sadnje",
            p: "Visine, teksture i sezone cvjetanja planiraju se kao kompozicija — dvorište ostaje živo tokom cijele godine.",
          },
          {
            h: "Osvjetljenje kao scenografija",
            p: "Diskretne linije svjetla uz staze i akcenti na drveću stvaraju atmosferu i sigurnost bez agresivnih reflektora.",
          },
        ],
        { src: "/showcase/mediterranean-villas.jpg", alt: "Mediteranska vila i pejzaž" },
      ),
      en: bodyEn(
        "Landscape design is shifting toward spaces that feel natural yet work intelligently — clear structure, resilient planting and lighting that extends use after sunset.",
        [
          {
            h: "Natural hardscape",
            p: "Stone, timber and textured concrete are becoming standard, warming the contrast with planting.",
          },
          {
            h: "Layered planting",
            p: "Heights, textures and flowering seasons are composed so the garden stays alive year-round.",
          },
          {
            h: "Lighting as scenography",
            p: "Subtle path lighting and tree accents create atmosphere and safety without harsh floodlights.",
          },
        ],
        { src: "/showcase/mediterranean-villas.jpg", alt: "Mediterranean villa landscape" },
      ),
      ru: bodyMe(
        "Ландшафтный дизайн движется к пространствам, которые выглядят естественно, но работают продуманно.",
        [
          { h: "Натуральный хардскейп", p: "Камень, дерево и текстурированный бетон — тёплый контраст с зеленью." },
          { h: "Ярусные посадки", p: "Высоты и сезоны цветения планируются как композиция на весь год." },
          { h: "Свет как сценография", p: "Дорожки и акценты на деревьях создают атмосферу без резкого света." },
        ],
        { src: "/showcase/mediterranean-villas.jpg", alt: "Средиземноморская вилла" },
      ),
    },
    metaTitles: {
      me: "Trendovi pejzažnog dizajna",
      en: "Landscape design trends",
      ru: "Тренды ландшафтного дизайна",
    },
    metaDescriptions: {
      me: "Prirodni materijali, slojevite sadnje i osvjetljenje — trendovi u pejzažnoj arhitekturi.",
      en: "Natural materials, layered planting and lighting — trends in landscape architecture.",
      ru: "Натуральные материалы, ярусные посадки и освещение в ландшафте.",
    },
  },
  {
    id: "c3000001-0001-4001-8001-000000000002",
    slug: "kako-planirati-dvoriste",
    coverMediaId: "d4000001-0001-4001-8001-000000000002",
    coverStorageKey: "before-after/yard-before.jpg",
    coverAlt: "Dvorište prije pejzažnog uređenja",
    inlineImageSrc: "/before-after/yard-after.jpg",
    titles: {
      me: "Kako planirati dvorište od nule",
      en: "How to plan a garden from scratch",
      ru: "Как спланировать двор с нуля",
    },
    excerpts: {
      me: "Pet koraka od analize terena do izbora biljaka — praktičan vodič prije prvog iskopa.",
      en: "Five steps from site analysis to plant selection — a practical guide before breaking ground.",
      ru: "Пять шагов от анализа участка до выбора растений.",
    },
    bodies: {
      me: bodyMe(
        "Dobro planirano dvorište štedi vrijeme i budžet. Prije dizajna, važno je razumjeti teren, kretanje i način korištenja prostora.",
        [
          {
            h: "1. Analiza terena",
            p: "Nagib, osunčanje, vjetar i postojeća vegetacija određuju gdje idu terase, staze i zone odmora.",
          },
          {
            h: "2. Zone korištenja",
            p: "Definišite šta vam treba: lounge, trava za djecu, povrtnjak, bazen ili samo mirna šetnja.",
          },
          {
            h: "3. Materijali i budžet",
            p: "Prioriteti u hardscape-u (popločavanje, zidovi, ivice) pomažu da investicija bude fazna i kontrolisana.",
          },
        ],
        { src: "/before-after/yard-after.jpg", alt: "Dvorište nakon uređenja" },
      ),
      en: bodyEn(
        "A well-planned garden saves time and budget. Before design, understand the site, movement and how you will use the space.",
        [
          { h: "1. Site analysis", p: "Slope, sun, wind and existing planting define terraces, paths and rest zones." },
          { h: "2. Use zones", p: "Define what you need: lounge, lawn, kitchen garden, pool or a quiet walk." },
          { h: "3. Materials and budget", p: "Hardscape priorities help phase the investment in a controlled way." },
        ],
        { src: "/before-after/yard-after.jpg", alt: "Garden after landscaping" },
      ),
      ru: bodyMe(
        "Хорошо спланированный двор экономит время и бюджет.",
        [
          { h: "1. Анализ участка", p: "Уклон, солнце и ветер определяют террасы и дорожки." },
          { h: "2. Зоны использования", p: "Лаунж, газон, огород или бассейн — зафиксируйте потребности." },
          { h: "3. Материалы и бюджет", p: "Приоритеты в мощении помогают поэтапной реализации." },
        ],
        { src: "/before-after/yard-after.jpg", alt: "Двор после благоустройства" },
      ),
    },
    metaTitles: {
      me: "Planiranje dvorišta",
      en: "Garden planning guide",
      ru: "Планирование двора",
    },
    metaDescriptions: {
      me: "Vodič za planiranje dvorišta — analiza, zone i materijali.",
      en: "Garden planning guide — analysis, zones and materials.",
      ru: "Руководство по планированию двора.",
    },
  },
  {
    id: "c3000001-0001-4001-8001-000000000003",
    slug: "3d-vizualizacija-pred-investiciju",
    coverMediaId: "d4000001-0001-4001-8001-000000000003",
    coverStorageKey: "inquiry/lumion-landscape-hero.jpg",
    coverAlt: "3D vizualizacija pejzaža",
    inlineImageSrc: "/inquiry/form-hero.png",
    titles: {
      me: "Zašto 3D vizualizacija prije investicije",
      en: "Why 3D visualization before you invest",
      ru: "Зачем 3D-визуализация до инвестиций",
    },
    excerpts: {
      me: "Vizualizacija otkriva proporcije, materijale i rasvjetu prije nego što budete vezani za troškove.",
      en: "Visualization reveals proportions, materials and light before costs are locked in.",
      ru: "Визуализация показывает пропорции и материалы до затрат.",
    },
    bodies: {
      me: bodyMe(
        "3D model eksterijera omogućava da „prošetate“ budućim dvorištem i donesete odluke dok su još fleksibilne.",
        [
          {
            h: "Manje nepredviđenih troškova",
            p: "Kad su materijali i nivoi definisani u modelu, izvođači dobijaju jasniju specifikaciju.",
          },
          {
            h: "Brže odluke",
            p: "Uporedite varijante fasade, ograde i rasvjete u istom kadru — bez nagađanja.",
          },
        ],
        { src: "/inquiry/form-hero.png", alt: "3D prikaz eksterijera" },
      ),
      en: bodyEn(
        "A 3D exterior model lets you walk through the future garden while decisions are still flexible.",
        [
          { h: "Fewer surprises", p: "Defined materials and levels give contractors a clearer specification." },
          { h: "Faster decisions", p: "Compare façade, fencing and lighting variants in the same view." },
        ],
        { src: "/inquiry/form-hero.png", alt: "3D exterior preview" },
      ),
      ru: bodyMe(
        "3D-модель экстерьера позволяет «прогуляться» по будущему двору до принятия решений.",
        [
          { h: "Меньше сюрпризов", p: "Материалы и уровни задают чёткое ТЗ для подрядчиков." },
          { h: "Быстрее решения", p: "Сравнение вариантов в одном кадре." },
        ],
        { src: "/inquiry/form-hero.png", alt: "3D-визуализация экстерьера" },
      ),
    },
    metaTitles: {
      me: "3D vizualizacija eksterijera",
      en: "3D exterior visualization",
      ru: "3D-визуализация экстерьера",
    },
    metaDescriptions: {
      me: "Prednosti 3D vizualizacije prije ulaganja u pejzaž i eksterijer.",
      en: "Benefits of 3D visualization before landscape investment.",
      ru: "Преимущества 3D-визуализации до вложений в ландшафт.",
    },
  },
  {
    id: "c3000001-0001-4001-8001-000000000004",
    slug: "biljni-izbor-mediteran",
    coverMediaId: "d4000001-0001-4001-8001-000000000004",
    coverStorageKey: "showcase/mediterranean-villas.jpg",
    coverAlt: "Mediteransko dvorište sa biljkama",
    inlineImageSrc: "/showcase/holiday-home.jpg",
    titles: {
      me: "Biljni izbor za mediteransku klimu",
      en: "Plant selection for Mediterranean climate",
      ru: "Растения для средиземноморского климата",
    },
    excerpts: {
      me: "Lavanda, maslina, trajnice i ornamentalne trave — kombinacije koje podnose sunce i sušu.",
      en: "Lavender, olive, perennials and ornamental grasses — combinations that handle sun and dry spells.",
      ru: "Лаванда, олива, многолетники — сочетания для солнца и засухи.",
    },
    bodies: {
      me: bodyMe(
        "Mediteransko dvorište ne mora biti samo „kaktusi“. Prava paleta biljaka daje miris, teksturu i boju uz minimalno zalijevanje.",
        [
          {
            h: "Strukturalno drveće",
            p: "Maslina, ciparis i magnolija daju okvir i hladovinu — sadnja na zapadnoj ili južnoj strani zaštite.",
          },
          {
            h: "Trajnice i grmlje",
            p: "Lavanda, rozmarin, santolina i sredozemne trajnice čine sloj koji preživljava ljetne vrućine.",
          },
        ],
        { src: "/showcase/holiday-home.jpg", alt: "Kuća za odmor i zelenilo" },
      ),
      en: bodyEn(
        "A Mediterranean garden is not only cacti. The right palette delivers scent, texture and colour with minimal irrigation.",
        [
          { h: "Structural trees", p: "Olive, cypress and magnolia frame the space and provide shade." },
          { h: "Perennials and shrubs", p: "Lavender, rosemary and santolina handle summer heat." },
        ],
        { src: "/showcase/holiday-home.jpg", alt: "Holiday home and planting" },
      ),
      ru: bodyMe(
        "Средиземноморский сад — не только кактусы. Правильная палитра даёт аромат и текстуру.",
        [
          { h: "Структурные деревья", p: "Олива, кипарис и магнолия задают каркас и тень." },
          { h: "Кустарники", p: "Лаванда, розмарин и сантолина переносят жару." },
        ],
        { src: "/showcase/holiday-home.jpg", alt: "Дом и зелёные насаждения" },
      ),
    },
    metaTitles: {
      me: "Biljke za mediteran",
      en: "Mediterranean plants",
      ru: "Средиземноморские растения",
    },
    metaDescriptions: {
      me: "Koji biljni izbor funkcioniše na jugu i uz more.",
      en: "Plant choices that work on the coast and in the south.",
      ru: "Растения для побережья и юга.",
    },
  },
  {
    id: "c3000001-0001-4001-8001-000000000005",
    slug: "hardscape-materijali",
    coverMediaId: "d4000001-0001-4001-8001-000000000005",
    coverStorageKey: "showcase/manor-house.jpg",
    coverAlt: "Imanje sa kamenim stazama",
    inlineImageSrc: "/showcase/manor-house.jpg",
    titles: {
      me: "Hardscape: materijali koji traju",
      en: "Hardscape: materials that last",
      ru: "Хардскейп: долговечные материалы",
    },
    excerpts: {
      me: "Prirodni kamen, beton sa teksturom i drvo — kako birati površine za staze i terase.",
      en: "Natural stone, textured concrete and timber — choosing surfaces for paths and terraces.",
      ru: "Натуральный камень, бетон и дерево для дорожек и террас.",
    },
    bodies: {
      me: bodyMe(
        "Hardscape je kostur dvorišta. Pogrešan materijal na stazi znači klizavost, mrlje ili brzo trošenje.",
        [
          {
            h: "Kamen i šljunak",
            p: "Idealni za mediteranski karakter; pazite na debljinu sloja i odvodnjavanje.",
          },
          {
            h: "Drvene platforme",
            p: "Termo-drvo i egzotične vrste zahtijevaju pravilnu ventilaciju ispod i redovno uljenje.",
          },
        ],
        { src: "/showcase/manor-house.jpg", alt: "Kamene staze i dvorište" },
      ),
      en: bodyEn(
        "Hardscape is the skeleton of the garden. The wrong path material means slipperiness, stains or rapid wear.",
        [
          { h: "Stone and gravel", p: "Ideal for Mediterranean character; mind layer depth and drainage." },
          { h: "Timber decks", p: "Thermowood and hardwoods need ventilation below and regular oiling." },
        ],
        { src: "/showcase/manor-house.jpg", alt: "Stone paths and courtyard" },
      ),
      ru: bodyMe(
        "Хардскейп — скелет сада. Неверный материал дорожки ведёт к скольжению и износу.",
        [
          { h: "Камень и гравий", p: "Мediterranean характер; важны дренаж и толщина слоя." },
          { h: "Деревянные настилы", p: "Термодревесина требует вентиляции снизу." },
        ],
        { src: "/showcase/manor-house.jpg", alt: "Каменные дорожки и двор" },
      ),
    },
    metaTitles: {
      me: "Hardscape materijali",
      en: "Hardscape materials",
      ru: "Материалы хардскейпа",
    },
    metaDescriptions: {
      me: "Vodič kroz kamen, beton i drvo za staze i terase.",
      en: "Guide to stone, concrete and timber for paths and terraces.",
      ru: "Камень, бетон и дерево для дорожек.",
    },
  },
  {
    id: "c3000001-0001-4001-8001-000000000006",
    slug: "odrzavanje-dvorista-kroz-godinu",
    coverMediaId: "d4000001-0001-4001-8001-000000000006",
    coverStorageKey: "before-after/yard-after.jpg",
    coverAlt: "Uređeno dvorište tokom sezone",
    inlineImageSrc: "/hero/landscape-hero.jpg",
    titles: {
      me: "Održavanje dvorišta kroz godinu",
      en: "Year-round garden maintenance",
      ru: "Уход за садом в течение года",
    },
    excerpts: {
      me: "Sezonski kalendar rezidbe, đubrenja i zalijevanja — da prostor ostane uredan bez preopterećenja.",
      en: "A seasonal calendar for pruning, feeding and irrigation — keeping the space tidy without overload.",
      ru: "Сезонный календарь обрезки и полива.",
    },
    bodies: {
      me: bodyMe(
        "Dizajn koji ne možete održavati brzo postaje problem. Plan održavanja gradimo još u fazi projekta.",
        [
          {
            h: "Proljeće",
            p: "Rezidba, đubrenje i priprema zalijevanja; sadnja novih trajnica i mulčiranje.",
          },
          {
            h: "Ljeto",
            p: "Zalijevanje u ranim jutarnjim satima, kontrola bujice i osvjetljenje za večernje korištenje.",
          },
          {
            h: "Jesen i zima",
            p: "Čišćenje lišća, zaštita osjetljivih biljaka i servis rasvjete.",
          },
        ],
        { src: "/hero/landscape-hero.jpg", alt: "Održavan pejzažni eksterijer" },
      ),
      en: bodyEn(
        "A design you cannot maintain quickly becomes a burden. We plan maintenance during the project phase.",
        [
          { h: "Spring", p: "Pruning, feeding and irrigation prep; planting perennials and mulching." },
          { h: "Summer", p: "Early-morning watering, growth control and lighting for evening use." },
          { h: "Autumn and winter", p: "Leaf clearance, protecting tender plants and servicing lights." },
        ],
        { src: "/hero/landscape-hero.jpg", alt: "Maintained landscape exterior" },
      ),
      ru: bodyMe(
        "Дизайн, который нельзя обслуживать, быстро становится проблемой.",
        [
          { h: "Весна", p: "Обрезка, подкормка и подготовка полива." },
          { h: "Лето", p: "Полив утром и контроль буйной растительности." },
          { h: "Осень и зима", p: "Уборка листьев и защита нежных растений." },
        ],
        { src: "/hero/landscape-hero.jpg", alt: "Ухоженный ландшафт" },
      ),
    },
    metaTitles: {
      me: "Održavanje dvorišta",
      en: "Garden maintenance",
      ru: "Уход за садом",
    },
    metaDescriptions: {
      me: "Sezonski plan održavanja pejzažnog dvorišta.",
      en: "Seasonal maintenance plan for landscape gardens.",
      ru: "Сезонный план ухода за садом.",
    },
  },
];

async function ensureMedia(
  id: string,
  storageKey: string,
  filename: string,
  alt: string,
) {
  const mimeType = storageKey.endsWith(".png") ? "image/png" : "image/jpeg";
  const [existing] = await db
    .select({ id: media.id })
    .from(media)
    .where(eq(media.id, id))
    .limit(1);

  const values = {
    filename,
    storageKey,
    mimeType,
    sizeBytes: 0,
    altText: alt,
  };

  if (!existing) {
    await db.insert(media).values({
      id,
      ...values,
      createdAt: new Date(),
    });
  } else {
    await db.update(media).set(values).where(eq(media.id, id));
  }
}

async function ensurePost(seed: SeedPost) {
  const now = new Date();
  await ensureMedia(
    seed.coverMediaId,
    seed.coverStorageKey,
    seed.coverStorageKey.split("/").pop() ?? seed.coverStorageKey,
    seed.coverAlt,
  );

  const [existing] = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.id, seed.id))
    .limit(1);

  if (!existing) {
    await db.insert(posts).values({
      id: seed.id,
      published: true,
      publishedAt: now,
      contentRole: "blog",
      coverMediaId: seed.coverMediaId,
      createdAt: now,
      updatedAt: now,
    });
  } else {
    await db
      .update(posts)
      .set({
        published: true,
        publishedAt: now,
        contentRole: "blog",
        coverMediaId: seed.coverMediaId,
        updatedAt: now,
      })
      .where(eq(posts.id, seed.id));
  }

  for (const loc of locales) {
    const [match] = await db
      .select({ id: postTranslations.id })
      .from(postTranslations)
      .where(
        and(
          eq(postTranslations.postId, seed.id),
          eq(postTranslations.locale, loc),
        ),
      )
      .limit(1);

    const slug = loc === "me" ? seed.slug : `${seed.slug}-${loc}`;

    const values = {
      slug,
      title: seed.titles[loc],
      excerpt: seed.excerpts[loc],
      body: seed.bodies[loc],
      metaTitle: seed.metaTitles[loc],
      metaDescription: seed.metaDescriptions[loc],
    };

    if (match) {
      await db
        .update(postTranslations)
        .set(values)
        .where(eq(postTranslations.id, match.id));
    } else {
      await db.insert(postTranslations).values({
        id: randomUUID(),
        postId: seed.id,
        locale: loc,
        ...values,
      });
    }
  }
}

async function main() {
  for (const post of BLOG_POSTS_SEED) {
    await ensurePost(post);
  }
  console.log(`Seeded ${BLOG_POSTS_SEED.length} blog posts (editable in /admin/posts).`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
