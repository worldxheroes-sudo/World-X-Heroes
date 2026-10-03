import { levelFromXp, rankFor, type Hero } from "./hero-store";

export type VisualAssetKind = "hero-awakening" | "hero-card" | "familiar-portrait" | "rank-evolution";

export type VisualGenerationOptions = {
  kind: VisualAssetKind;
  portraitApproved?: boolean;
  visualPreferences?: string[];
  approvedStory?: string;
  environment?: string;
  evolutionStage?: number;
};

export type VisualGenerationRequest = {
  kind: VisualAssetKind;
  prompt: string;
  negativePrompt: string;
  referenceImages: string[];
  inputImages: string[];
  metadata: {
    heroName: string;
    rank: string;
    level: number;
    evolutionStage: number;
    familiarName: string;
  };
  privacy: {
    portraitIncluded: boolean;
    privateConversationMemoryIncluded: false;
    readyForTransmission: false;
  };
};

export const WORLD_X_HEROES_ART_BIBLE = {
  lighting: "Cinematic motivated light: luminous sky or practical sources, soft volumetric rays, controlled highlights, readable faces, and atmospheric depth.",
  palette: "Pearl, cloud silver, antique gold, deep ink, and restrained crimson accents; world-specific colors may lead without flattening the universe into one hue.",
  characters: "Individual, recognizable people and creatures with natural anatomy, expressive faces, detailed hair, skin, eyes, fabric, metal, fur, feathers, scales, and personal accessories.",
  worlds: "Vast environments with layered scale, distinct civilizations, architecture, weather, landscape, and small story details that connect the character to the place.",
  fusion: "Fantasy and advanced technology may coexist when the Hero's own story supports it; avoid defaulting to one culture, era, species, or class fantasy.",
  composition: "Premium game key art: clear focal subject, dramatic but believable pose, foreground-midground-background separation, and room for interface overlays where needed.",
  materials: "Tactile, physically legible materials with fine surface detail, restrained ornament, believable wear, and lighting that makes each material distinct.",
  atmosphere: "Use a few scene-specific effects such as mist, cloud, rain, snow, sparks, starlight, or drifting leaves; preserve clarity and accessibility.",
  relationship: "Hero, Familiar, and environment share perspective, light direction, scale, shadows, and atmosphere; never make the companion feel pasted on.",
  evolution: "Keep the Hero recognizable across stages; evolve silhouette, equipment, symbols, environment, and scale in proportion to earned milestones.",
} as const;

const REFERENCE_IMAGES = [
  "photo/Photo%20ref/1000002334.png",
  "photo/Photo%20ref/1000002325.png",
  "photo/Photo%20ref/1000002330.png",
  "photo/Photo%20ref/1000002342.png",
];

function clean(value: string | undefined, limit = 240): string {
  return (value ?? "").replace(/[<>\u0000-\u001f]/g, " ").trim().slice(0, limit);
}

function strongestAttribute(hero: Hero): string {
  return Object.entries(hero.attrs).sort((left, right) => right[1] - left[1])[0]?.[0] ?? "vision";
}

function approvedAccomplishments(hero: Hero): string[] {
  return hero.quests
    .filter((quest) => (quest.verification === "verified" || quest.verification === "strongly_verified") && quest.visibility === "public")
    .slice(-5)
    .map((quest) => clean(quest.title, 100))
    .filter(Boolean);
}

function kindDirection(kind: VisualAssetKind): string {
  switch (kind) {
    case "hero-awakening": return "Create a first-awakening full-figure Hero portrait, as if this person has just crossed into a living world.";
    case "hero-card": return "Create premium collectible-card key art with an immediate focal silhouette and composed negative space for readable card information.";
    case "familiar-portrait": return "Create a distinct Familiar character portrait with species-specific anatomy, a legible personality, and a habitat that belongs to this Hero.";
    case "rank-evolution": return "Create the next earned evolution of this same Hero: preserve recognizable identity while showing a meaningful visual change in costume, emblem, energy, pose, and world scale.";
  }
}

export function buildVisualGenerationRequest(hero: Hero, options: VisualGenerationOptions): VisualGenerationRequest {
  const level = levelFromXp(hero.xp);
  const rank = rankFor(level);
  const accomplishments = approvedAccomplishments(hero);
  const skills = hero.skills.map((skill) => clean(skill, 60)).filter(Boolean).slice(0, 12);
  const preferences = [hero.visualPreferences ?? "", ...(options.visualPreferences ?? [])].map((preference) => clean(preference, 100)).filter(Boolean).slice(0, 8);
  const environment = clean(options.environment, 180);
  const approvedStory = clean(options.approvedStory, 300);
  const portraitIncluded = Boolean(options.portraitApproved && hero.avatar);
  const stage = Math.max(1, Math.min(10, Math.floor(options.evolutionStage ?? 1)));
  const familiar = `${clean(hero.familiar.name, 48)} (${clean(hero.familiar.id, 80)}, ${clean(hero.familiar.realm, 32)} realm)`;
  const directions = [
    WORLD_X_HEROES_ART_BIBLE.lighting,
    WORLD_X_HEROES_ART_BIBLE.palette,
    WORLD_X_HEROES_ART_BIBLE.characters,
    WORLD_X_HEROES_ART_BIBLE.worlds,
    WORLD_X_HEROES_ART_BIBLE.fusion,
    WORLD_X_HEROES_ART_BIBLE.composition,
    WORLD_X_HEROES_ART_BIBLE.materials,
    WORLD_X_HEROES_ART_BIBLE.atmosphere,
    WORLD_X_HEROES_ART_BIBLE.relationship,
    WORLD_X_HEROES_ART_BIBLE.evolution,
  ];
  const prompt = [
    "WORLD X HEROES cinematic game-art direction. THE HUMAN IS THE CHARACTER. A WORLD FOR EVERY HERO.",
    kindDirection(options.kind),
    `Hero identity: ${clean(hero.name, 64)}${hero.title ? `, ${clean(hero.title, 80)}` : ""}. Rank ${rank.name}, level ${level}, evolution stage ${stage}.`,
    `Hero strength to express through action and visual motifs: ${strongestAttribute(hero)}. Approved skills: ${skills.join(", ") || "none supplied"}. Public verified accomplishments: ${accomplishments.join("; ") || "none supplied"}.`,
    `Traveling Familiar: ${familiar}. Make the two feel designed for one another, not interchangeable stock characters.`,
    approvedStory ? `Player-approved story context: ${approvedStory}.` : "",
    preferences.length ? `Player-selected visual preferences: ${preferences.join("; ")}.` : "",
    environment ? `Chosen environment: ${environment}.` : "Interpret the Hero's approved identity and preferences to choose a specific, story-rich environment; do not force a stereotype or default fantasy class.",
    ...directions,
    "Preserve the subject's real, recognizable features when an approved identity photo is attached. Use diverse cultural and genre influences only when selected or supported by the player's preferences.",
    "Deliver detailed premium game key art with an unmistakably individualized face, costume, materials, pose, environment, and relationship to the world.",
  ].filter(Boolean).join("\n\n");

  return {
    kind: options.kind,
    prompt,
    negativePrompt: "generic stock fantasy hero, interchangeable face, default Japanese or medieval styling, forced cultural stereotype, chibi, cartoon, flat vector, low-detail mascot, floating head, tiny profile avatar, pasted-on companion, mismatched perspective, plastic skin, malformed anatomy, illegible text, logo, watermark, UI controls",
    referenceImages: [...REFERENCE_IMAGES],
    inputImages: portraitIncluded ? [hero.avatar] : [],
    metadata: { heroName: clean(hero.name, 64), rank: rank.name, level, evolutionStage: stage, familiarName: clean(hero.familiar.name, 48) },
    privacy: { portraitIncluded, privateConversationMemoryIncluded: false, readyForTransmission: false },
  };
}
