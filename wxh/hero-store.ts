import { useCallback, useEffect, useState } from "react";

export type AttrKey = "mind" | "adapt" | "heart" | "vision" | "legacy";

export const ATTRS: { key: AttrKey; label: string; blurb: string }[] = [
  { key: "mind", label: "MIND", blurb: "Awareness · Intelligence · Strategy" },
  { key: "adapt", label: "ADAPT", blurb: "Trades · Mechanics · Survival" },
  { key: "heart", label: "HEART", blurb: "Integrity · Courage · Caregiving" },
  { key: "vision", label: "VISION", blurb: "Creativity · Art · Innovation" },
  { key: "legacy", label: "LEGACY", blurb: "Leadership · Teaching · Clan" },
];

export type Rank = {
  name: string;
  min: number;
  max: number;
  tone: string;
};

export const RANKS: Rank[] = [
  { name: "Initiate", min: 1, max: 100, tone: "oklch(0.72 0.05 250)" },
  { name: "Vanguard", min: 101, max: 500, tone: "oklch(0.68 0.15 200)" },
  { name: "Master", min: 501, max: 1500, tone: "oklch(0.68 0.16 150)" },
  { name: "Guardian", min: 1501, max: 3500, tone: "oklch(0.72 0.16 80)" },
  { name: "Domain Architect", min: 3501, max: 6500, tone: "oklch(0.62 0.19 305)" },
  { name: "Exemplar", min: 6501, max: 9998, tone: "oklch(0.58 0.21 22)" },
  { name: "APEX HERO", min: 9999, max: 9999, tone: "oklch(0.85 0.13 90)" },
];

export function rankFor(level: number): Rank {
  return RANKS.find((r) => level >= r.min && level <= r.max) ?? (RANKS[0] as Rank);
}

export const XP_PER_LEVEL = 120;

export function levelFromXp(xp: number) {
  return Math.max(1, Math.min(9999, Math.floor(xp / XP_PER_LEVEL) + 1));
}

export type ProofKind = "photo" | "video";

/** XP is never free — every quest must carry proof. */
export type Proof = {
  kind: ProofKind;
  /** data URL of the uploaded photo or video */
  src: string;
  name: string;
};

export type QuestLog = {
  id: string;
  title: string;
  xp: number;
  attr: AttrKey;
  at: number;
  proof: Proof;
  /** sealed = locked in the hidden chest, still counts; public = shown in the feed */
  visibility: "sealed" | "public";
  likes: number;
};

/** XP granted per like on a public proof. */
export const XP_PER_LIKE = 15;

export type VaultItem = {
  id: string;
  title: string;
  kind: "art" | "music" | "writing" | "blueprint";
  note: string;
  at: number;
};

/** A card minted the moment a hero ranks up — a frozen portrait of who they were. */
export type HeroCardSnapshot = {
  id: string;
  at: number;
  rank: string;
  tone: string;
  level: number;
  name: string;
  title: string;
  avatar: string;
  weapon: string;
  attrs: Record<AttrKey, number>;
  skills: string[];
  /** deeds & creations added since the previous card */
  highlights: string[];
};

export type Hero = {
  created: boolean;
  name: string;
  title: string;
  avatar: string;
  weapon: string;
  bio: string;
  ghost: boolean;
  xp: number;
  attrs: Record<AttrKey, number>;
  quests: QuestLog[];
  vault: VaultItem[];
  coins: number;
  guild: string;
  reactions: Record<string, number>;
  badges: string[];
  skills: string[];
  cards: HeroCardSnapshot[];
};

export const DEFAULT_HERO: Hero = {
  created: false,
  name: "",
  title: "",
  avatar: "",
  weapon: "",
  bio: "",
  ghost: false,
  xp: 0,
  attrs: { mind: 4, adapt: 4, heart: 5, vision: 5, legacy: 3 },
  quests: [],
  vault: [
    { id: "v1", title: "Ashline Sketch Series", kind: "art", note: "Ink + gold leaf studies", at: Date.now() },
    { id: "v2", title: "Forge Hymn (loop)", kind: "music", note: "92 BPM · analog percussion", at: Date.now() },
  ],
  coins: 240,
  guild: "The Shadow Forge",
  reactions: { love: 128, resonance: 342, support: 87, alliance: 41, follow: 964 },
  badges: ["I WAS THERE"],
  skills: ["Metalwork", "Systems Design", "Animal Rescue", "Sound Craft"],
  cards: [],
};

/** Builds the card minted at a rank-up moment. */
export function mintCard(hero: Hero, level: number, highlights: string[]): HeroCardSnapshot {
  const rank = rankFor(level);
  return {
    id: crypto.randomUUID(),
    at: Date.now(),
    rank: rank.name,
    tone: rank.tone,
    level,
    name: hero.name,
    title: hero.title,
    avatar: hero.avatar,
    weapon: hero.weapon,
    attrs: { ...hero.attrs },
    skills: [...hero.skills],
    highlights,
  };
}

const KEY = "worldx-heroes-v1";

export function useHero() {
  const [hero, setHero] = useState<Hero>(DEFAULT_HERO);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setHero({ ...DEFAULT_HERO, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(hero));
    } catch {
      /* ignore */
    }
  }, [hero, loaded]);

  const update = useCallback((patch: Partial<Hero>) => {
    setHero((h) => ({ ...h, ...patch }));
  }, []);

  const reset = useCallback(() => setHero(DEFAULT_HERO), []);

  return { hero, setHero, update, loaded, reset };
}
