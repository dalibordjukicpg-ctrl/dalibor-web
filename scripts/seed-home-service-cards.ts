import "./load-dotenv";

import { randomUUID } from "crypto";
import { and, eq } from "drizzle-orm";

import { db } from "../lib/db";
import {
  homeServiceCardTranslations,
  homeServiceCards,
} from "../lib/db/schema";
import type { Locale } from "../lib/i18n";
import { locales } from "../lib/i18n";
import { projectPagePath } from "../lib/project-path";

type SeedCard = {
  id: string;
  sortOrder: number;
  iconName: string;
  slug: string;
  coverImageUrl: string;
  titles: Record<Locale, string>;
  descriptions: Record<Locale, string>;
  bodies: Record<Locale, string>;
};

/** Fiksni ID-jevi — idempotentan upsert. */
export const HOME_SERVICE_CARDS_SEED: SeedCard[] = [
  {
    id: "b2000001-0001-4001-8001-000000000001",
    sortOrder: 1,
    iconName: "sun",
    slug: "mediteranska-vila",
    coverImageUrl: "/showcase/mediterranean-villas.jpg",
    titles: {
      me: "Mediteranska vila",
      en: "Mediterranean villa",
      ru: "Средиземноморская вилла",
    },
    descriptions: {
      me: "Eksterijer, terase i bazenska zona",
      en: "Exterior, terraces and pool area",
      ru: "Экстерьер, террасы и зона бассейна",
    },
    bodies: {
      me: "Kompletan koncept eksterijera mediteranske vile — od fasadnih materijala i rasvjete do rasporeda terasa i bazenske zone. Cilj je bio stvoriti sklad između arhitekture i pejzaža, uz jasnu hijerarhiju prostora za odmor i druženje.\n\nProjekat obuhvata 3D vizualizacije, izbor biljaka otpornih na lokalnu klimu i detaljno planiranje hardscape elemenata — kamene stepenice, ivičnjake i površine za hodanje.",
      en: "A full exterior concept for a Mediterranean villa — from façade materials and lighting to terrace layout and the pool area. The goal was harmony between architecture and landscape, with a clear hierarchy of spaces for rest and gathering.\n\nThe project includes 3D visualizations, plant selection suited to the local climate, and detailed hardscape planning — stone steps, edging and walking surfaces.",
      ru: "Полная концепция экстерьера средиземноморской виллы — от материалов фасада и освещения до террас и зоны бассейна. Цель — гармония архитектуры и ландшафта с чёткой иерархией зон отдыха.\n\nПроект включает 3D-визуализации, подбор растений под местный климат и детальное планирование мощения и каменных элементов.",
    },
  },
  {
    id: "b2000001-0001-4001-8001-000000000002",
    sortOrder: 2,
    iconName: "leaf",
    slug: "imanje-dvoriste",
    coverImageUrl: "/showcase/manor-house.jpg",
    titles: {
      me: "Imanje sa dvorištem",
      en: "Manor estate garden",
      ru: "Усадьба с двором",
    },
    descriptions: {
      me: "Pejzažni plan i hardscape elementi",
      en: "Landscape plan and hardscape",
      ru: "Ландшафтный план и мощение",
    },
    bodies: {
      me: "Dizajn dvorišta imanja sa naglaskom na pejzažni plan, drvored i centralnu livadu. Hardscape elementi — popločavanje, zidovi od prirodnog kamena i fontana — definiraju strukturu prostora i vode kretanje kroz dvorište.\n\nBiljni sloj planiran je u sezonama cvjetanja kako bi dvorište bilo živo tokom cijele godine, uz minimalno održavanje.",
      en: "Courtyard design for a manor estate with emphasis on the landscape plan, tree alleys and a central lawn. Hardscape — paving, natural stone walls and a fountain — defines structure and guides movement through the garden.\n\nPlanting is planned in flowering seasons so the garden stays lively year-round with minimal maintenance.",
      ru: "Дизайн двора усадьбы с акцентом на ландшафтный план, аллеи и центральный газон. Мощение, каменные стены и фонтан задают структуру и маршруты движения.\n\nПосадки спланированы по сезонам цветения для живого сада круглый год при минимальном уходе.",
    },
  },
  {
    id: "b2000001-0001-4001-8001-000000000003",
    sortOrder: 3,
    iconName: "home",
    slug: "kuca-za-odmor",
    coverImageUrl: "/showcase/holiday-home.jpg",
    titles: {
      me: "Kuća za odmor",
      en: "Holiday home",
      ru: "Дом для отдыха",
    },
    descriptions: {
      me: "Dizajn dvorišta i outdoor living",
      en: "Courtyard design and outdoor living",
      ru: "Дизайн двора и открытых зон",
    },
    bodies: {
      me: "Kuća za odmor zahtijevala je intimno dvorište sa zonama za ručavanje na otvorenom, sjenom i večernjim boravkom. Riješenje kombinuje pergolu, sjenke od zelenila i diskretnu rasvjetu.\n\nMaterijali su birani da podnesu promjenjive vremenske uslove i da stare elegantno — prirodni kamen, drvo i neutralne površine koje ne odvlače pažnju od okoline.",
      en: "The holiday home needed an intimate courtyard with outdoor dining, shade and evening lounging. The solution combines a pergola, planting shade and discreet lighting.\n\nMaterials were chosen to withstand changing weather and age gracefully — natural stone, wood and neutral surfaces that don't compete with the surroundings.",
      ru: "Для дома отдыха нужен уютный двор с зоной обеда на свежем воздухе, тенью и вечерним отдыхом. Решение сочетает перголу, зелёную тень и деликатное освещение.\n\nМатериалы выбраны устойчивые к погоде — натуральный камень, дерево и нейтральные покрытия.",
    },
  },
  {
    id: "b2000001-0001-4001-8001-000000000004",
    sortOrder: 4,
    iconName: "star",
    slug: "dvoriste-realizacija",
    coverImageUrl: "/before-after/yard-after.jpg",
    titles: {
      me: "Dvorište — realizacija",
      en: "Courtyard — delivered",
      ru: "Двор — реализация",
    },
    descriptions: {
      me: "Prije / poslije 3D vizualizacije",
      en: "Before / after 3D visualization",
      ru: "До / после 3D визуализации",
    },
    bodies: {
      me: "Ovaj projekat pokazuje put od početnog stanja dvorišta do finalne 3D vizualizacije i realizacije. Prije snimci dokumentuju postojeće stanje; poslije prikazuje predloženi raspored, materijale i biljni sloj.\n\nKlijent je na osnovu vizualizacije mogao donijeti odluke prije početka radova, što je smanjilo neizvjesnost i ubrzalo izvođenje.",
      en: "This project shows the journey from the courtyard's initial state to the final 3D visualization and delivery. Before images document existing conditions; after shows the proposed layout, materials and planting.\n\nThe client could decide before works began, reducing uncertainty and speeding execution.",
      ru: "Проект показывает путь от исходного состояния двора до финальной 3D-визуализации и реализации. Снимки «до» фиксируют текущее состояние; «после» — планировку, материалы и озеленение.\n\nКлиент принял решения до начала работ, что снизило риски и ускорило реализацию.",
    },
  },
  {
    id: "b2000001-0001-4001-8001-000000000005",
    sortOrder: 5,
    iconName: "zap",
    slug: "3d-koncept-prostora",
    coverImageUrl: "/before-after/yard-before.jpg",
    titles: {
      me: "3D koncept prostora",
      en: "3D space concept",
      ru: "3D концепт пространства",
    },
    descriptions: {
      me: "Fotorealistična vizualizacija prije gradnje",
      en: "Photoreal render before construction",
      ru: "Фотореалистичная визуализация",
    },
    bodies: {
      me: "Fotorealistična 3D vizualizacija omogućava da prostor doživite prije nego što krene gradnja ili uređenje. Prikazujemo materijale, rasvjetu, biljke i namještaj u realnim uvjetima — različita doba dana i godišnja doba.\n\nAko želite vlastitu vizualizaciju, možete poslati fotografiju i dobiti personalizovani koncept putem stranice Transformišite prostor.",
      en: "Photorealistic 3D visualization lets you experience the space before construction or landscaping begins. We show materials, lighting, plants and furniture in realistic conditions — different times of day and seasons.\n\nFor your own visualization, send a photo and receive a personalized concept via the Transform your space page.",
      ru: "Фотореалистичная 3D-визуализация позволяет увидеть пространство до начала работ. Показываем материалы, свет, растения и мебель в реальных условиях — разное время суток и сезоны.\n\nДля собственной визуализации отправьте фото через страницу «Преобразите пространство».",
    },
  },
  {
    id: "b2000001-0001-4001-8001-000000000006",
    sortOrder: 6,
    iconName: "users",
    slug: "kompletan-eksterijer",
    coverImageUrl: "/showcase/mediterranean-villas.jpg",
    titles: {
      me: "Kompletan eksterijer",
      en: "Full exterior package",
      ru: "Полный экстерьер",
    },
    descriptions: {
      me: "Od ideje do izvedbenog projekta",
      en: "From concept to execution plans",
      ru: "От идеи до рабочей документации",
    },
    bodies: {
      me: "Kompletan paket eksterijera obuhvata konceptualni dizajn, 3D prezentaciju, specifikaciju materijala i koordinaciju sa izvođačima. Od prve skice do dokumentacije spremne za gradnju — jedan tim vodi cijeli proces.\n\nIdealno za vlasnike kuća i vila koji žele jedinstven izgled bez kompromisa u kvalitetu izvođenja.",
      en: "The full exterior package covers conceptual design, 3D presentation, material specification and contractor coordination. From first sketch to build-ready documentation — one team leads the entire process.\n\nIdeal for homeowners who want a distinctive look without compromising execution quality.",
      ru: "Полный пакет экстерьера включает концепцию, 3D-презентацию, спецификацию материалов и координацию с подрядчиками. От эскиза до документации для строительства — одна команда ведёт весь процесс.\n\nИдеально для владельцев домов и вилл, желающих уникальный облик без компромиссов в качестве.",
    },
  },
];

export const HOME_SERVICE_CARD_SEED_IDS = HOME_SERVICE_CARDS_SEED.map((c) => c.id);

async function ensureCard(card: SeedCard): Promise<void> {
  const [existing] = await db
    .select({ id: homeServiceCards.id })
    .from(homeServiceCards)
    .where(eq(homeServiceCards.id, card.id))
    .limit(1);

  const now = new Date();
  const href = projectPagePath(card.slug);

  if (!existing) {
    await db.insert(homeServiceCards).values({
      id: card.id,
      sortOrder: card.sortOrder,
      iconName: card.iconName,
      slug: card.slug,
      href,
      coverImageUrl: card.coverImageUrl,
      visible: true,
      updatedAt: now,
    });
  } else {
    await db
      .update(homeServiceCards)
      .set({
        sortOrder: card.sortOrder,
        iconName: card.iconName,
        slug: card.slug,
        href,
        coverImageUrl: card.coverImageUrl,
        visible: true,
        updatedAt: now,
      })
      .where(eq(homeServiceCards.id, card.id));
  }

  for (const loc of locales) {
    const [match] = await db
      .select({ id: homeServiceCardTranslations.id })
      .from(homeServiceCardTranslations)
      .where(
        and(
          eq(homeServiceCardTranslations.cardId, card.id),
          eq(homeServiceCardTranslations.locale, loc),
        ),
      )
      .limit(1);

    if (match) {
      await db
        .update(homeServiceCardTranslations)
        .set({
          title: card.titles[loc],
          description: card.descriptions[loc],
          body: card.bodies[loc],
        })
        .where(eq(homeServiceCardTranslations.id, match.id));
    } else {
      await db.insert(homeServiceCardTranslations).values({
        id: randomUUID(),
        cardId: card.id,
        locale: loc,
        title: card.titles[loc],
        description: card.descriptions[loc],
        body: card.bodies[loc],
      });
    }
  }
}

async function main() {
  for (const card of HOME_SERVICE_CARDS_SEED) {
    await ensureCard(card);
  }
  console.log(`Seeded ${HOME_SERVICE_CARDS_SEED.length} portfolio projects with pages.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
