import { useCallback, useEffect, useState } from "react";

export type AttrKey = "mind" | "adapt" | "heart" | "vision" | "legacy";
export type MeritCategoryKey = "humanity" | "kindness" | "artistry" | "innovation" | "wisdom";
export type FamiliarRealm = "forest" | "sky" | "water" | "shadow" | "celestial" | "arcane" | "ancient" | "elemental" | "odd";
export type FamiliarSignal = "curiosity" | "creativity" | "protection" | "exploration" | "wisdom" | "playfulness" | "courage" | "adaptability" | "leadership" | "mystery" | "resilience" | "patience" | "loyalty" | "gentleness" | "independence" | "transformation" | "observation" | "intuition";

export type HeroFamiliar = {
  id: string;
  name: string;
  realm: FamiliarRealm;
  appearance?: {
    primaryColor: string;
    accentColor: string;
    marking: string;
  };
};

export type FamiliarMemory = {
  introduction: string;
  signals: FamiliarSignal[];
  recentReplies: string[];
};

export const ATTRS: { key: AttrKey; label: string; blurb: string }[] = [
  { key: "mind", label: "MIND", blurb: "Awareness · Intelligence · Strategy" },
  { key: "adapt", label: "ADAPT", blurb: "Trades · Mechanics · Survival" },
  { key: "heart", label: "HEART", blurb: "Integrity · Courage · Caregiving" },
  { key: "vision", label: "VISION", blurb: "Creativity · Art · Innovation" },
  { key: "legacy", label: "LEGACY", blurb: "Leadership · Teaching · Clan" },
];

export const MERIT_CATEGORIES: { key: MeritCategoryKey; label: string; blurb: string }[] = [
  { key: "humanity", label: "HUMANITY", blurb: "Meaningful benefit to people and communities." },
  { key: "kindness", label: "KINDNESS", blurb: "Compassion, care, and constructive support." },
  { key: "artistry", label: "ARTISTRY", blurb: "Creative expression, craft, and artistic work." },
  { key: "innovation", label: "INNOVATION", blurb: "Systems, invention, and original problem solving." },
  { key: "wisdom", label: "WISDOM", blurb: "Learning, teaching, and practical mastery." },
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
export const MILESTONE_THRESHOLDS = [1000, 5000, 10000] as const;

export function levelFromXp(xp: number) {
  return Math.max(1, Math.min(9999, Math.floor(xp / XP_PER_LEVEL) + 1));
}

export function familiarEvolutionStage(hero: Pick<Hero, "xp" | "quests">): number {
  const verifiedCount = hero.quests.filter((quest) => quest.verification === "verified" || quest.verification === "strongly_verified").length;
  if (hero.xp >= 1000 || verifiedCount >= 7) return 3;
  if (hero.xp >= XP_PER_LEVEL || verifiedCount >= 2) return 2;
  return 1;
}

export type ProofKind = "photo" | "video" | "link";

export type VerificationStatus = "claimed" | "submitted" | "under_review" | "verified" | "strongly_verified";
export type EvidenceLevel = 0 | 1 | 2 | 3 | 4;

/** XP is never free — every quest must carry proof. */
export type Proof = {
  kind: ProofKind;
  /** data URL of uploaded media or an evidence link */
  src: string;
  name: string;
};

export type MeritBreakdown = {
  attributes: Partial<Record<AttrKey, number>>;
  categories: Record<MeritCategoryKey, number>;
  difficulty: number;
  originality: number;
  impact: number;
  completion: number;
  explanation: string;
  summary: string;
};

export type QuestLog = {
  id: string;
  title: string;
  description: string;
  category: string;
  xp: number;
  attr: AttrKey;
  at: number;
  proof: Proof;
  verification: VerificationStatus;
  evidenceLevel: EvidenceLevel;
  /** sealed = locked in the hidden chest, still counts; public = shown in the feed */
  visibility: "sealed" | "public";
  likes: number;
  merit: MeritBreakdown;
};

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
  familiar: HeroFamiliar;
  familiarStage: number;
  familiarTheme: MeritCategoryKey | "none";
  /** deeds & creations added since the previous card */
  highlights: string[];
};

export type HeroDiaryEntry = {
  id: string;
  kind: "milestone" | "achievement" | "reflection" | "creation" | "discovery";
  title: string;
  content: string;
  at: number;
  privacy: "private" | "profile" | "public";
};

export type AuditTrailEntry = {
  id: string;
  title: string;
  status: VerificationStatus;
  decision: string;
  evidence: string[];
  criteria: string[];
  points: number;
  xp: number;
  attributes: Partial<Record<AttrKey, number>>;
  categories: Record<MeritCategoryKey, number>;
  reason: string;
  at: number;
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
  diary: HeroDiaryEntry[];
  vault: VaultItem[];
  coins: number;
  guild: string;
  reactions: Record<string, number>;
  badges: string[];
  skills: string[];
  familiar: HeroFamiliar;
  familiarMemory: FamiliarMemory;
  cards: HeroCardSnapshot[];
  summary: string;
  auditTrail: AuditTrailEntry[];
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
  attrs: { mind: 1, adapt: 1, heart: 1, vision: 1, legacy: 1 },
  quests: [],
  diary: [],
  vault: [],
  coins: 0,
  guild: "",
  reactions: { love: 0, resonance: 0, support: 0, alliance: 0, follow: 0 },
  badges: [],
  skills: [],
  familiar: { id: "moth", name: "Wisp", realm: "forest" },
  familiarMemory: { introduction: "", signals: [], recentReplies: [] },
  cards: [],
  summary: "Your journey is just beginning. Real achievements will shape your Hero story.",
  auditTrail: [],
};

/** Builds the card minted at a rank-up moment. */
export function mintCard(hero: Hero, level: number, highlights: string[]): HeroCardSnapshot {
  const rank = rankFor(level);
  const familiarTheme = MERIT_CATEGORIES.reduce((best, category) => {
    const score = hero.quests
      .filter((quest) => quest.verification === "verified" || quest.verification === "strongly_verified")
      .reduce((total, quest) => total + (quest.merit?.categories?.[category.key] ?? 0), 0);
    return score > best.score ? { key: category.key, score } : best;
  }, { key: "humanity" as MeritCategoryKey, score: 0 });
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
    familiar: { ...hero.familiar, appearance: hero.familiar.appearance ? { ...hero.familiar.appearance } : undefined },
    familiarStage: familiarEvolutionStage(hero),
    familiarTheme: familiarTheme.score > 0 ? familiarTheme.key : "none",
    highlights,
  };
}

export function evaluateQuestMerit(
  title: string,
  description: string,
  attribute: AttrKey,
  category: string,
): MeritBreakdown {
  const text = `${title} ${description}`.toLowerCase();
  const attrScores = { mind: 0, adapt: 0, heart: 0, vision: 0, legacy: 0 } as Record<AttrKey, number>;

  if (!title.trim() || !description.trim() || text.trim().length < 18) {
    const zeroCats = { humanity: 0, kindness: 0, artistry: 0, innovation: 0, wisdom: 0 } satisfies Record<MeritCategoryKey, number>;
    return {
      attributes: {},
      categories: zeroCats,
      difficulty: 0,
      originality: 0,
      impact: 0,
      completion: 0,
      explanation: "INSUFFICIENT EVIDENCE — the system does not have enough trustworthy information to score this accomplishment.",
      summary: "INSUFFICIENT EVIDENCE",
    };
  }

  if (/build|design|plan|system|analyze|engine|code|repair|measure|optimi|structure|prototype|logic|research|study|teach/i.test(text)) {
    attrScores.mind += 6;
    attrScores.adapt += 4;
    attrScores.legacy += 2;
  }
  if (/build|fix|repair|craft|make|install|tool|mechanic|wood|metal|garden|kitchen|field|outdoor|survive|operate/i.test(text)) {
    attrScores.adapt += 7;
    attrScores.mind += 2;
  }
  if (/care|help|support|teach|mentor|donate|volunteer|protect|nurse|family|community|kind|gentle|safe|rescue/i.test(text)) {
    attrScores.heart += 8;
    attrScores.legacy += 3;
  }
  if (/art|design|paint|draw|music|write|film|photo|story|illustrate|create|craft|compose|vision|innovate/i.test(text)) {
    attrScores.vision += 9;
    attrScores.mind += 2;
  }
  if (/lead|teach|guide|organize|coach|build|community|club|event|mentor|initiative|support|leadership/i.test(text)) {
    attrScores.legacy += 8;
    attrScores.heart += 2;
  }

  const chosen = attribute;
  attrScores[chosen] += 10;

  const categories = {
    humanity: 0,
    kindness: 0,
    artistry: 0,
    innovation: 0,
    wisdom: 0,
  } satisfies Record<MeritCategoryKey, number>;

  if (/community|help|support|serve|care|people|famil|neigh|local|garden|rescue|aid/i.test(text)) categories.humanity += 8;
  if (/care|kind|help|support|protect|comfort|family|teach|volunteer|nurse|compassion/i.test(text)) categories.kindness += 8;
  if (/art|draw|paint|music|story|film|photo|write|design|craft|poem|sculpt|creative/i.test(text)) categories.artistry += 9;
  if (/build|invent|prototype|system|code|solve|improve|innovation|design|optimi|automate|tool/i.test(text)) categories.innovation += 9;
  if (/learn|study|teach|practice|master|research|guide|skill|improve|discover|lesson/i.test(text)) categories.wisdom += 8;

  const difficulty = Math.min(20, Math.max(5, Math.round((text.length / 18) + 4)));
  const originality = Math.min(20, Math.max(4, Math.round((attrScores.vision + attrScores.mind + attrScores.adapt) / 4 + 2)));
  const impact = Math.min(20, Math.max(4, Math.round((categories.humanity + categories.kindness + categories.wisdom) / 3 + 3)));
  const completion = Math.min(20, Math.max(8, 12 + (title.trim().length > 10 ? 3 : 0)));

  const explanation = `This achievement reflects strong ${ATTRS.find((a) => a.key === chosen)?.label.toLowerCase() ?? "hero"} contribution, supported by the submitted details and evidence. It shows clear effort, practical outcome, and meaningful impact in the category “${category || "general contribution"}.”`;
  const summary = `${title} demonstrates meaningful ${ATTRS.find((a) => a.key === chosen)?.label ?? "hero"} strength with clear evidence, strong contribution to ${category || "the Hero journey"}, and notable real-world impact.`;

  return {
    attributes: attrScores,
    categories,
    difficulty,
    originality,
    impact,
    completion,
    explanation,
    summary,
  };
}

export function getMilestoneCards(hero: Hero): HeroCardSnapshot[] {
  const earned = new Set(hero.cards.map((card) => card.level));
  return MILESTONE_THRESHOLDS.filter((threshold) => hero.xp >= threshold && !earned.has(levelFromXp(threshold))).map((threshold) => {
    const milestoneLevel = levelFromXp(threshold);
    return mintCard({ ...hero, title: hero.title || "Emerging Hero" }, milestoneLevel, [`Milestone ${threshold} Merit`, `Verified Journey`]);
  });
}

export function generateHeroSummary(hero: Hero): string {
  const strongest = ATTRS.reduce((best, attr) => {
    if (hero.attrs[attr.key] > (best ? hero.attrs[best] : -1)) return attr.key;
    return best;
  }, "mind" as AttrKey);

  const topCategory = MERIT_CATEGORIES.reduce((best, cat) => {
    const total = hero.quests.reduce((sum, quest) => sum + (quest.merit?.categories?.[cat.key] ?? 0), 0);
    return total > best.total ? { key: cat.key, total } : best;
  }, { key: "wisdom" as MeritCategoryKey, total: 0 });

  return `Over your recorded journey, your strongest pattern is ${ATTRS.find((a) => a.key === strongest)?.label ?? "hero"} development, with a growing emphasis on ${MERIT_CATEGORIES.find((c) => c.key === topCategory.key)?.label.toLowerCase() ?? "wisdom"}. Your documented work reflects practical effort, creativity, and real impact.`;
}

export function generateCardArchetype(hero: Hero): string {
  const topAttr = ATTRS.reduce((best, attr) => hero.attrs[attr.key] > hero.attrs[best.key] ? attr : best, ATTRS[0]);
  const topCategory = MERIT_CATEGORIES.reduce((best, category) => {
    const score = hero.quests.reduce((sum, quest) => sum + (quest.merit?.categories?.[category.key] ?? 0), 0);
    return score > best.score ? { score, category } : best;
  }, { score: 0, category: MERIT_CATEGORIES[0] });

  const map: Record<string, string> = {
    mind: "THE ARCHITECT",
    adapt: "THE BUILDER",
    heart: "THE CARETAKER",
    vision: "THE VISIONARY",
    legacy: "THE TEACHER",
  };

  if (topCategory.score > 18) {
    if (topCategory.category.key === "artistry") return "THE ARTIST";
    if (topCategory.category.key === "innovation") return "THE INVENTOR";
    if (topCategory.category.key === "kindness") return "THE GUARDIAN";
    if (topCategory.category.key === "wisdom") return "THE TEACHER";
  }

  return map[topAttr.key] ?? "THE EXPLORER";
}

export function detectDuplicateQuest(existingQuests: QuestLog[], title: string, description: string): boolean {
  const normalizedTitle = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");
  const normalizedDescription = description.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");

  return existingQuests.some((quest) => {
    const existingTitle = (quest.title ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");
    const existingDescription = (quest.description ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");

    const titleMatches = normalizedTitle && existingTitle && normalizedTitle === existingTitle;
    const descriptionMatches = normalizedDescription && existingDescription && normalizedDescription === existingDescription;
    const nearDuplicate = normalizedTitle.length > 6 && normalizedDescription.length > 6 && existingTitle.includes(normalizedTitle.slice(0, 8)) && existingDescription.includes(normalizedDescription.slice(0, 8));
    return titleMatches || descriptionMatches || nearDuplicate;
  });
}

export function createAuditTrailEntry(
  quest: QuestLog,
  evidence: string[],
  criteria: string[],
  reason: string,
): AuditTrailEntry {
  return {
    id: crypto.randomUUID(),
    title: quest.title,
    status: quest.verification,
    decision: quest.verification === "verified" || quest.verification === "strongly_verified" ? "QUEST COMPLETE" : "CLAIMED — NOT VERIFIED",
    evidence,
    criteria,
    points: quest.xp,
    xp: quest.xp,
    attributes: quest.merit.attributes,
    categories: quest.merit.categories,
    reason,
    at: Date.now(),
  };
}

const KEY = "worldx-heroes-v1";

export function useHero() {
  const [hero, setHero] = useState<Hero>(DEFAULT_HERO);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const stored = JSON.parse(raw) as Partial<Hero>;
        const quests = (stored.quests ?? []).map((quest) => {
          const verification = quest.verification ?? "submitted";
          return {
            ...quest,
            description: quest.description ?? "",
            category: quest.category ?? "general contribution",
            merit: quest.merit ?? {
              attributes: {},
              categories: { humanity: 0, kindness: 0, artistry: 0, innovation: 0, wisdom: 0 },
              difficulty: 0,
              originality: 0,
              impact: 0,
              completion: 0,
              explanation: "Recorded from your journey.",
              summary: "A new step in your Hero story.",
            },
            verification,
            evidenceLevel: quest.evidenceLevel ?? (quest.proof?.src ? 2 : 1),
            xp: verification === "verified" || verification === "strongly_verified" ? quest.xp : 0,
          };
        });
        const familiar = stored.familiar ?? DEFAULT_HERO.familiar;
        setHero({
          ...DEFAULT_HERO,
          ...stored,
          xp: quests.reduce((total, quest) => total + quest.xp, 0),
          attrs: { ...DEFAULT_HERO.attrs, ...stored.attrs },
          reactions: { ...DEFAULT_HERO.reactions, ...stored.reactions },
          quests,
          familiar,
          familiarMemory: {
            introduction: stored.familiarMemory?.introduction ?? "",
            signals: stored.familiarMemory?.signals ?? [],
            recentReplies: stored.familiarMemory?.recentReplies ?? [],
          },
          cards: (stored.cards ?? []).map((card) => ({
            ...card,
            familiar: card.familiar ?? familiar,
            familiarStage: card.familiarStage ?? 1,
            familiarTheme: card.familiarTheme ?? "none",
          })),
          diary: (stored.diary ?? []).map((entry) => ({ ...entry, privacy: entry.privacy ?? "private" })),
          summary: stored.summary ?? generateHeroSummary({ ...DEFAULT_HERO, ...stored, quests }),
          auditTrail: stored.auditTrail ?? [],
        });
      }
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
