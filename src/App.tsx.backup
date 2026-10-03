import { useId, useState, type ChangeEvent, type CSSProperties, type FormEvent, type PointerEvent as ReactPointerEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Camera,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Upload,
  UserRound,
} from "lucide-react";
import {
  ATTRS,
  MERIT_CATEGORIES,
  XP_PER_LEVEL,
  createAuditTrailEntry,
  detectDuplicateQuest,
  evaluateQuestMerit,
  familiarEvolutionStage,
  generateCardArchetype,
  generateHeroSummary,
  levelFromXp,
  mintCard,
  rankFor,
  useHero,
  type AttrKey,
  type FamiliarRealm,
  type FamiliarSignal,
  type Hero,
  type HeroCardSnapshot,
  type HeroDiaryEntry,
  type HeroFamiliar,
  type QuestLog,
} from "../wxh/hero-store";

type Screen = "intro" | "create" | "profile";
type ProofMode = "photo" | "link";
type AwakeningStep = "introduction" | "seeking" | "reveal";
type GatewayStage = "idle" | "contact" | "gathering" | "burst" | "passage";
type FamiliarForm = "dragon" | "phoenix" | "unicorn" | "fae" | "gryphon" | "kitsune" | "pegasus" | "water" | "selkie" | "gargoyle" | "sphinx" | "forest" | "wolf" | "winter" | "raven" | "owl" | "frog" | "moth";

type FamiliarSpec = {
  id: string;
  species: string;
  realm: FamiliarRealm;
  form: FamiliarForm;
  color: string;
  accentColor?: string;
  secondaryForm?: FamiliarForm;
  marking?: string;
  temperament: string;
  name: string;
  origin: string;
  element: string;
  visualSignature: string;
  evolutionPath: string;
};
type FamiliarMatch = { familiar: FamiliarSpec; resonance: FamiliarSignal[]; score: number };

const FAMILIAR_CHOICES: FamiliarSpec[] = [
  { id: "celestial-dragon", species: "Celestial Dragon", realm: "celestial", form: "dragon", color: "#7295a6", temperament: "noble, observant, and quietly protective", name: "Auren", origin: "A keeper of the star-roads in The Between.", element: "Starlight", visualSignature: "Silver-blue scales, horned brow, long whiskers, and constellation runes.", evolutionPath: "Sky Warden → Astral Sovereign" },
  { id: "dawn-phoenix", species: "Dawn Phoenix", realm: "elemental", form: "phoenix", color: "#d58b54", temperament: "resilient, warm, and determined to begin again", name: "Solenne", origin: "A bright-winged ember born where night gives way to morning.", element: "Sunfire", visualSignature: "Layered flame-feathers, a crown of light, and a long streaming tail.", evolutionPath: "First Ember → Sun-Crowned Phoenix" },
  { id: "moon-unicorn", species: "Moonlit Unicorn", realm: "celestial", form: "unicorn", color: "#a69ab6", temperament: "gentle, perceptive, and steadfast", name: "Lumi", origin: "A silver-hoofed wanderer from the quiet meadows above the clouds.", element: "Moonlight", visualSignature: "Spiral crystal horn, flowing mane, luminous eyes, and star-map markings.", evolutionPath: "Moon Foal → Constellation Hart" },
  { id: "elder-fae", species: "Elderwood Fae", realm: "forest", form: "fae", color: "#739578", temperament: "curious, graceful, and fond of unexpected questions", name: "Briar", origin: "A small courtless spirit from a forest that walks between worlds.", element: "Wildgrowth", visualSignature: "Veined glass wings, leaf-metal ornaments, and a crown of living twigs.", evolutionPath: "Thornwing Sprite → Elderwood Keeper" },
  { id: "crystal-gryphon", species: "Crystal Gryphon", realm: "ancient", form: "gryphon", color: "#b19469", temperament: "noble, watchful, and fiercely dependable", name: "Aster", origin: "A mountain guardian whose eyrie rests on a floating ruin.", element: "Gale", visualSignature: "Eagle crest, feline shoulders, feathered wings, and quartz talons.", evolutionPath: "Eyrie Warden → Crown of the High Sky" },
  { id: "kitsune-spirit", species: "Nine-Tailed Fox Spirit", realm: "arcane", form: "kitsune", color: "#c27958", temperament: "clever, playful, and attentive to hidden meanings", name: "Mori", origin: "A fox spirit from the lantern paths of The Between.", element: "Foxfire", visualSignature: "Nine distinct tails, ink-dark paws, and luminous cheek markings.", evolutionPath: "Lantern Fox → Many-Tailed Star Sage" },
  { id: "star-pegasus", species: "Starfall Pegasus", realm: "sky", form: "pegasus", color: "#829ab0", temperament: "bold, generous, and eager for the long road", name: "Vela", origin: "A cloud-runner born from a falling star's reflection.", element: "Wind", visualSignature: "Feathered wings, a braided mane, and bright comet marks along the flank.", evolutionPath: "Cloudrunner → Astral Courser" },
  { id: "tide-oracle", species: "Tide Oracle", realm: "water", form: "water", color: "#538f98", temperament: "patient, thoughtful, and quietly compassionate", name: "Neris", origin: "A moon-pool spirit who carries memories as ripples.", element: "Tide", visualSignature: "Fin-fringed mantle, translucent tail, and floating pearl-like lights.", evolutionPath: "Pool Listener → Deepwater Oracle" },
  { id: "silver-selkie", species: "Silver Selkie", realm: "water", form: "selkie", color: "#849da2", temperament: "gentle, independent, and deeply loyal once bonded", name: "Mara", origin: "A sea-spirit from a shore that appears only between storms.", element: "Sea Mist", visualSignature: "Moon-silver pelt, seal-bright eyes, and tide-script along its mantle.", evolutionPath: "Shore Seeker → Keeper of the Far Current" },
  { id: "rune-gargoyle", species: "Rune Gargoyle", realm: "ancient", form: "gargoyle", color: "#858a8d", temperament: "steadfast, dry-witted, and watchful through long silences", name: "Thorn", origin: "A living sentinel awakened in a forgotten sky-temple.", element: "Stone", visualSignature: "Carved basalt plates, folded wings, rune-lit seams, and small stone horns.", evolutionPath: "Threshold Sentinel → Citadel Guardian" },
  { id: "sphinx-seer", species: "Sphinx Seer", realm: "ancient", form: "sphinx", color: "#b59a69", temperament: "analytical, patient, and fond of questions with no easy answer", name: "Khepri", origin: "A riddle-keeper from an archive hidden beneath the clouds.", element: "Memory", visualSignature: "Lion's poise, feathered mantle, luminous brow mark, and etched gold cuffs.", evolutionPath: "Riddle Keeper → Keeper of the Unwritten Archive" },
  { id: "verdant-warden", species: "Verdant Forest Warden", realm: "forest", form: "forest", color: "#738c65", temperament: "gentle, grounded, and protective of growing things", name: "Moss", origin: "A root-spirit from a forest grown around a fallen star.", element: "Root and Rain", visualSignature: "Branching antlers, fern-flecked coat, and tiny flowers caught in its mane.", evolutionPath: "Mossling Warden → Heartwood Guardian" },
  { id: "dusk-wolf", species: "Dusk Wolf Spirit", realm: "shadow", form: "wolf", color: "#747e8f", temperament: "loyal, perceptive, and protective without boasting", name: "Vesper", origin: "A pack-guardian who crossed the long dusk between worlds.", element: "Twilight", visualSignature: "Layered spectral fur, silver ear tufts, and a crescent blaze between the eyes.", evolutionPath: "Dusk Runner → Moonlit Pack Guardian" },
  { id: "horned-winter-spirit", species: "Horned Winter Spirit", realm: "shadow", form: "winter", color: "#83949a", temperament: "reserved, resourceful, and surprisingly kind in hard seasons", name: "Niv", origin: "An original winter wanderer from the white silence of The Between.", element: "Frost", visualSignature: "Branching crystal antlers, woven frost-mantle, and pale blue runes.", evolutionPath: "Frost Wanderer → Keeper of the Quiet Season" },
  { id: "star-raven", species: "Star-Reader Raven", realm: "sky", form: "raven", color: "#566a7e", temperament: "mysterious, observant, and quietly poetic", name: "Vesper", origin: "A sky-scribe who gathers forgotten fragments of stories.", element: "Night Wind", visualSignature: "Layered midnight feathers, silver flight marks, and a bright star at the throat.", evolutionPath: "Wayfinder Crow → Star-Reader Raven" },
  { id: "archive-owl", species: "Archive Owl", realm: "arcane", form: "owl", color: "#9b896d", temperament: "wise, curious, and endlessly attentive", name: "Rune", origin: "A small keeper of the living library between worlds.", element: "Insight", visualSignature: "Feathered ear tufts, fine spectacles of light, and map-like wing bars.", evolutionPath: "Page Keeper → Oracle of the Open Sky" },
  { id: "moon-moth", species: "Moonveil Moth", realm: "celestial", form: "moth", color: "#9a87a0", temperament: "quiet, curious, and drawn to beautiful details", name: "Wisp", origin: "A dusk-light spirit that follows the paths heroes leave behind.", element: "Dreamlight", visualSignature: "Velvet wings, luminous eye-spots, and dusting like powdered stars.", evolutionPath: "Veilwing → Moonveil Herald" },
  { id: "marsh-oracle", species: "Marsh Oracle", realm: "forest", form: "frog", color: "#7e986e", temperament: "cheerful, unpredictable, and unexpectedly insightful", name: "Mochi", origin: "A little keeper of hidden pools and sideways wisdom.", element: "Rain", visualSignature: "Jade skin, crown-like water lilies, and a mantle of tiny reed charms.", evolutionPath: "Pool Seer → Oracle of the Green Flood" },
];

const SIGNAL_RULES: { key: FamiliarSignal; label: string; pattern: RegExp }[] = [
  { key: "curiosity", label: "Curiosity", pattern: /curious|curiosity|fascinat|wonder|discover|question|explor(?:e|ing) new/i },
  { key: "creativity", label: "Creativity", pattern: /creat|draw|paint|art|music|write|design|invent|imagin|make things/i },
  { key: "protection", label: "Protection", pattern: /protect|care for|help(?:ing)? people|support|keep .{0,12} safe|animal|community/i },
  { key: "exploration", label: "Exploration", pattern: /adventure|travel|experiment|try new|explor|journey|outside/i },
  { key: "wisdom", label: "Wisdom", pattern: /learn|teach|study|read|understand|knowledge|observe|figure out/i },
  { key: "playfulness", label: "Playfulness", pattern: /fun|funny|humou?r|jok|playful|silly|spontaneous/i },
  { key: "courage", label: "Courage", pattern: /brave|courage|challenge|difficult|risk|afraid|bold|attempt/i },
  { key: "adaptability", label: "Adaptability", pattern: /adapt|solve|fix|repair|build|practical|problem|engineer|hands.on/i },
  { key: "leadership", label: "Leadership", pattern: /lead|organ|guide|mentor|coach|community|bring people|teach others/i },
  { key: "mystery", label: "Mystery", pattern: /weird|strange|unusual|unknown|hidden|myster|odd|unconventional|magic/i },
  { key: "resilience", label: "Resilience", pattern: /resilien|keep going|bounce back|overcome|persist|recover|start again/i },
  { key: "patience", label: "Patience", pattern: /patient|slowly|steady|take my time|practice|persistence/i },
  { key: "loyalty", label: "Loyalty", pattern: /loyal|friend|family|together|belong|devot/i },
  { key: "gentleness", label: "Gentleness", pattern: /gentle|kind|soft.spoken|peaceful|quiet|sensitive/i },
  { key: "independence", label: "Independence", pattern: /independent|my own|individual|different|alone|freedom/i },
  { key: "transformation", label: "Transformation", pattern: /change|grow|become|transform|reinvent|evolve/i },
  { key: "observation", label: "Observation", pattern: /notice|observe|watch|detail|pattern|pay attention/i },
  { key: "intuition", label: "Instinct", pattern: /instinct|intuition|sense that|gut feeling|read the room/i },
];

const ARCHETYPE_SIGNALS: Record<string, FamiliarSignal[]> = {
  "celestial-dragon": ["courage", "protection", "wisdom", "leadership"], "dawn-phoenix": ["resilience", "courage", "transformation"],
  "moon-unicorn": ["gentleness", "creativity", "loyalty", "wisdom"], "elder-fae": ["creativity", "curiosity", "playfulness"],
  "crystal-gryphon": ["courage", "protection", "leadership", "exploration"], "kitsune-spirit": ["creativity", "adaptability", "playfulness", "mystery"],
  "star-pegasus": ["courage", "exploration", "leadership"], "tide-oracle": ["wisdom", "gentleness", "patience"], "silver-selkie": ["independence", "loyalty", "gentleness"],
  "rune-gargoyle": ["protection", "loyalty", "patience"], "sphinx-seer": ["wisdom", "curiosity", "mystery"], "verdant-warden": ["protection", "gentleness", "patience"],
  "dusk-wolf": ["loyalty", "protection", "leadership", "intuition" as FamiliarSignal], "horned-winter-spirit": ["resilience", "adaptability", "mystery"],
  "star-raven": ["wisdom", "mystery", "curiosity"], "archive-owl": ["curiosity", "wisdom", "observation" as FamiliarSignal],
  "moon-moth": ["curiosity", "creativity", "transformation", "patience"], "marsh-oracle": ["curiosity", "playfulness", "adaptability", "creativity"],
};

function inferFamiliarSignals(introduction: string): FamiliarSignal[] {
  return SIGNAL_RULES.filter((signal) => signal.pattern.test(introduction)).map((signal) => signal.key);
}

function rankFamiliarMatches(signals: FamiliarSignal[], introduction: string) {
  return FAMILIAR_CHOICES.map((familiar) => {
    const resonance = (ARCHETYPE_SIGNALS[familiar.id] ?? []).filter((signal) => signals.includes(signal));
    return { familiar: personalizeFamiliar(familiar, resonance, introduction), resonance, score: resonance.length };
  }).filter((match) => match.score > 0)
    .sort((left, right) => right.score - left.score || right.resonance.length - left.resonance.length);
}

const FAMILIAR_PALETTES = [
  ["#88b7b9", "#ecd99a"], ["#c88767", "#8dc1b0"], ["#8f91bd", "#f0d58c"],
  ["#6f9f88", "#dbb8cf"], ["#bd9b59", "#8ba9c6"], ["#bd7582", "#e5cf8f"],
  ["#638ea5", "#d2a66b"], ["#8a9b63", "#c4a6d1"],
];

function personalizeFamiliar(familiar: FamiliarSpec, matchedSignals: FamiliarSignal[], introduction: string): FamiliarSpec {
  const signal = matchedSignals[0] ?? "curiosity";
  const story = introduction.toLowerCase();
  let hash = 2166136261;
  for (const character of story) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  const paletteOffset = ({ creativity: 1, protection: 4, exploration: 6, mystery: 2, resilience: 5, gentleness: 3 } as Partial<Record<FamiliarSignal, number>>)[signal] ?? 0;
  const palette = FAMILIAR_PALETTES[(Math.abs(hash) + paletteOffset) % FAMILIAR_PALETTES.length];
  const markings = ["constellation tracery", "crescent runes", "wind-script", "petal sigils", "river lines", "ember freckles", "star-map filigree", "root-vein patterns"];
  return {
    ...familiar,
    color: palette[0],
    accentColor: palette[1],
    marking: markings[(Math.abs(hash >>> 3) + paletteOffset) % markings.length],
  };
}

function creatureNoun(familiar: FamiliarSpec) {
  const nouns = new Set(["fox", "owl", "frog", "moth", "raven", "dragon", "fish", "turtle", "cat", "serpent", "snake", "rabbit", "gryphon", "wolf", "deer", "butterfly", "phoenix", "bat", "bear", "lizard", "horse", "spider"]);
  return familiar.id.split(/[-:]/).find((part) => nouns.has(part)) ?? familiar.species.toLowerCase();
}

function composeFamiliar(first: FamiliarSpec, second: FamiliarSpec): FamiliarSpec {
  return {
    id: `hybrid:${first.id}+${second.id}`,
    species: `${creatureNoun(first)}-${creatureNoun(second)}`.replace(/\b\w/g, (letter) => letter.toUpperCase()),
    realm: first.realm,
    form: first.form,
    secondaryForm: second.form,
    color: first.color,
    accentColor: second.color,
    temperament: `A curious blend of ${first.temperament} and ${second.temperament}`,
    name: first.name,
    origin: `${first.origin} Its path crossed ${second.origin.toLowerCase()}`,
    element: `${first.element} and ${second.element}`,
    visualSignature: `${first.visualSignature} ${second.visualSignature}`,
    evolutionPath: `${first.evolutionPath} → a form not yet known`,
  };
}

function getFamiliarSpec(id: string, appearance?: HeroFamiliar["appearance"]): FamiliarSpec {
  const known = FAMILIAR_CHOICES.find((choice) => choice.id === id);
  if (known) return applyFamiliarAppearance(known, appearance);
  if (id.startsWith("hybrid:")) {
    const [firstId, secondId] = id.slice("hybrid:".length).split("+");
    const first = FAMILIAR_CHOICES.find((choice) => choice.id === firstId);
    const second = FAMILIAR_CHOICES.find((choice) => choice.id === secondId);
    if (first && second) return applyFamiliarAppearance(composeFamiliar(first, second), appearance);
  }
  const legacyIds: Record<string, string> = {
    fox: "kitsune-spirit", owl: "archive-owl", frog: "marsh-oracle", moth: "moon-moth", raven: "star-raven",
    "tiny-dragon": "celestial-dragon", "cloud-fox": "kitsune-spirit", "moon-fish": "tide-oracle", "cosmic-turtle": "rune-gargoyle",
    "shadow-cat": "star-raven", "floating-serpent": "celestial-dragon", "moon-rabbit": "moon-unicorn", "celestial-snake": "celestial-dragon",
    "crystal-spirit": "sphinx-seer", "faerie-moth": "elder-fae", "ancient-owl": "archive-owl", gryphon: "crystal-gryphon",
    "ember-spirit": "dawn-phoenix", "dragon-frog": "celestial-dragon", "horned-rabbit": "horned-winter-spirit", spiderling: "rune-gargoyle",
    wolf: "dusk-wolf", deer: "verdant-warden", snake: "celestial-dragon", butterfly: "moon-moth", turtle: "rune-gargoyle",
    phoenix: "dawn-phoenix", bat: "star-raven", bear: "dusk-wolf", lizard: "celestial-dragon", horse: "star-pegasus",
  };
  const legacyId = id.startsWith("hybrid:") ? id.slice("hybrid:".length).split("+")[0] : id;
  return applyFamiliarAppearance(FAMILIAR_CHOICES.find((choice) => choice.id === legacyIds[legacyId]) ?? FAMILIAR_CHOICES[0], appearance);
}

function applyFamiliarAppearance(familiar: FamiliarSpec, appearance?: HeroFamiliar["appearance"]): FamiliarSpec {
  return appearance ? { ...familiar, color: appearance.primaryColor, accentColor: appearance.accentColor, marking: appearance.marking } : familiar;
}

function FamiliarPortrait({ familiar, stage = 1, mood = "calm", scale = "normal", theme = "none" }: { familiar: FamiliarSpec; stage?: number; mood?: string; scale?: "normal" | "backdrop" | "section" | "card"; theme?: string }) {
  const gradientId = useId().replace(/:/g, "");
  const body = `url(#${gradientId}-body)`;
  const highlight = `url(#${gradientId}-highlight)`;
  const starOffsets = [[91, 96], [112, 111], [83, 121], [121, 91], [103, 135]];

  let anatomy;
  switch (familiar.form) {
    case "dragon":
      anatomy = <g>
        <path className="familiar-part familiar-part--wing" d="M91 92 47 40 59 78 29 61 46 106 77 120M111 91 151 42 143 81 171 62 155 108 124 120" />
        <path className="familiar-part familiar-part--tail" d="M125 124c24 1 32 17 44 12 10-4 4-16-5-18l18-8-5 20c-7 17-29 20-47 7" />
        <path className="familiar-part familiar-part--body" fill={body} d="M69 111c8-16 25-21 44-15 17 5 25 22 20 37-5 15-23 19-42 13-18-5-30-19-22-35Z" />
        <path className="familiar-part familiar-part--body" fill={highlight} d="M105 106c1-17 5-31 14-42 9-10 20-8 23 1 4 9-2 20-10 24l-5 22Z" />
        <path className="familiar-part familiar-part--body" fill={body} d="M117 68c3-12 14-20 28-17 11 2 17 11 13 20-4 10-20 13-36 7Z" />
        <path className="familiar-part familiar-part--accent" d="m129 54-7-16 17 9m5 4 5-17 8 20m-11 17 22 8-21 3" />
        <path className="familiar-part familiar-part--limb" d="m82 137-5 17 13-3 6-12m29 1 8 15 11-5-11-15" />
        <path className="familiar-part familiar-part--ink" d="M122 74c10 5 19 7 29 5m-64 25c11 10 26 15 43 14m-47-4 7 5m8-10 7 6m14-45 8 3m5-10 7 3" />
        <circle className="familiar-eye" cx="150" cy="61" r="2.8" /><path className="familiar-glint" d="m155 78 13 2-10 4" />
      </g>;
      break;
    case "phoenix":
      anatomy = <g>
        <path className="familiar-part familiar-part--wing" d="M91 97C65 84 49 60 35 27c29 12 54 31 68 59-5-25 0-45 14-65 12 35 8 60-1 77m-7-1c25-15 43-36 57-64-1 36-15 62-43 83" />
        <path className="familiar-part familiar-part--wing" d="M93 103c-22 3-41-4-61-18 12 26 29 40 55 46m25-27c22 0 39-9 57-26-7 28-22 44-48 53" />
        <path className="familiar-part familiar-part--body" fill={body} d="M86 99c9-13 25-15 35-5 11 11 10 30-1 42-8 10-25 14-36 3-10-10-7-27 2-40Z" />
        <path className="familiar-part familiar-part--body" fill={highlight} d="M103 104c-1-19 5-31 18-38 10-5 21 1 19 10-1 7-11 12-19 12l-4 22Z" />
        <path className="familiar-part familiar-part--accent" d="m120 70 4-22 7 18 10-19 1 25m-48 56c-16 21-25 31-39 40 22-3 38-13 53-31m8-1c8 17 18 26 32 33-3-18-10-31-24-43" />
        <path className="familiar-part familiar-part--ink" d="m61 51 27 32m44-30-15 28m-73-1 37 21m75-10-37 18" />
        <circle className="familiar-eye" cx="132" cy="81" r="2.7" />
      </g>;
      break;
    case "unicorn":
    case "pegasus":
      anatomy = <g>
        {familiar.form === "pegasus" && <path className="familiar-part familiar-part--wing" d="M91 88 62 48 68 79 42 59 56 96 75 112m43-24 30-39-7 31 25-21-12 38-21 18" />}
        <path className="familiar-part familiar-part--body" fill={body} d="M57 105c13-17 43-20 61-7 15 11 16 31 1 42-17 12-48 9-62-4-9-8-8-20 0-31Z" />
        <path className="familiar-part familiar-part--limb" d="m67 130-3 27 8 2 7-27m28 2 2 25 8 0 2-29m-47-1-8 24-8-1 4-25m48 1 12 20 8-3-10-23" />
        <path className="familiar-part familiar-part--body" fill={highlight} d="M102 106c3-18 1-35 11-47 8-10 22-8 25 2 2 8-6 16-14 19l-4 34Z" />
        <path className="familiar-part familiar-part--body" fill={body} d="M119 66c2-13 12-23 26-21 11 2 16 10 11 18-6 9-23 11-37 3Z" />
        {familiar.form === "unicorn" ? <path className="familiar-part familiar-part--accent" d="m137 52 18-31 0 28m-51 44c-14-8-18-19-16-32m3 4 10 9m-5-16 12 8m-7-17 12 8m-60 65c-13 8-19 19-18 31" /> : <path className="familiar-part familiar-part--accent" d="m119 68-13-14 17 6 0-18 9 18 18-8-12 17" />}
        <path className="familiar-part familiar-part--ink" d="M66 110c15 8 34 10 49 6m-60 9 12 5m22-16 8 5m20-29 9 2" />
        <circle className="familiar-eye" cx="145" cy="55" r="2.6" />
        <path className="familiar-glint" d="m78 94 2-3m11 0 2-3m12 2 2-3" />
      </g>;
      break;
    case "fae":
      anatomy = <g>
        <path className="familiar-part familiar-part--wing" d="M88 91C59 74 46 52 51 31c24 5 39 25 43 53m18 5c29-17 42-39 37-59-24 6-39 25-44 53M87 105c-27-2-43 8-50 27 25 7 43 1 58-17m23-10c27-3 43 7 51 24-24 9-43 4-60-14" />
        <path className="familiar-part familiar-part--body" fill={body} d="M91 93c6-10 17-11 23-1l7 37-17 15-18-15Z" />
        <circle className="familiar-part familiar-part--body" fill={highlight} cx="102" cy="81" r="16" />
        <path className="familiar-part familiar-part--accent" d="m92 70-5-14 12 9m9 4 8-12 2 16m-20 55-11 18m27-17 10 15m-17-56 1 19m-6-7 12 0" />
        <path className="familiar-part familiar-part--ink" d="m62 53 25 27m50-30-26 29m-65 43 38-17m63-22-35 17" />
        <circle className="familiar-eye" cx="97" cy="82" r="1.8" /><circle className="familiar-eye" cx="108" cy="82" r="1.8" />
      </g>;
      break;
    case "gryphon":
    case "sphinx":
      anatomy = <g>
        <path className="familiar-part familiar-part--wing" d="M95 95 55 47 63 80 37 59 51 103 79 119m39-25 37-49-7 34 25-22-12 44-28 16" />
        <path className="familiar-part familiar-part--body" fill={body} d="M49 112c8-20 35-25 58-15 24 10 34 30 19 43-15 14-56 13-72 0-8-7-9-17-5-28Z" />
        <path className="familiar-part familiar-part--limb" d="m60 132-5 20 10 2 10-20m25 4 1 19 10 0 2-22m14-6 13 18 9-5-12-23" />
        <path className="familiar-part familiar-part--accent" d="M110 104c-3-17 3-34 19-45 9-6 19 0 16 9-3 8-13 11-21 13l2 25m8-51 7-19 6 19 12-13-5 21" />
        <path className="familiar-part familiar-part--ink" d="m64 113 8 8m8-15 8 8m9-9 8 8m-53 18c15 8 34 10 49 7m35-54 17 5" />
        <circle className="familiar-eye" cx="140" cy="67" r="2.6" />
        {familiar.form === "sphinx" && <path className="familiar-part familiar-part--accent" d="m121 79 27 4m-24 6 25 4m-26 5 24 3" />}
      </g>;
      break;
    case "kitsune":
      anatomy = <g>
        <path className="familiar-part familiar-part--tail" d="M81 132C39 148 27 123 52 104c-28 0-38-26-13-34 4 18 23 21 43 12-25-20-16-48 10-46-6 20 2 31 21 43 20-23 47-16 44 8-18-5-29 2-39 22 34-8 48 12 31 31-14-14-29-13-49-3-4 20-24 24-35 10 13-6 19-16 15-28Z" />
        <path className="familiar-part familiar-part--body" fill={body} d="M77 105c10-17 31-20 46-9 13 10 15 27 1 37-16 12-42 7-49-7-4-7-3-14 2-21Z" />
        <path className="familiar-part familiar-part--body" fill={highlight} d="M108 101c4-18 17-28 32-23 13 4 15 17 5 24-9 7-24 7-37-1Z" />
        <path className="familiar-part familiar-part--accent" d="m119 82 2-18 12 14m8 1 13-13-2 21m-56 49-8 13m35-11 7 13m-53-58c8 10 16 15 28 17" />
        <path className="familiar-part familiar-part--ink" d="M57 105c13 2 23 0 31-8m-32-23c14 11 25 12 38 8m18-29c4 13 13 22 25 29m8 12 17-6m-82 21 9 4m12-12 8 4" />
        <circle className="familiar-eye" cx="144" cy="89" r="2.6" />
      </g>;
      break;
    case "water":
      anatomy = <g>
        <path className="familiar-part familiar-part--tail" d="M97 115c-3 20-10 30-25 43 17 4 29-2 37-14 8 15 21 19 38 15-12-12-18-24-16-42" />
        <path className="familiar-part familiar-part--body" fill={body} d="M91 98c5-16 28-20 39-7 10 12 9 31-3 39l-10 9-15-8c-13-7-17-20-11-33Z" />
        <path className="familiar-part familiar-part--accent" d="M99 110c-18-5-30-19-35-39 18 8 30 20 36 38m21-1c18-7 27-20 30-40-16 9-27 22-31 42m-23-40c5-16 16-24 33-25-7 17-16 28-30 34m-25 57c-20-4-30 3-37 16 19 3 32-1 43-12" />
        <path className="familiar-part familiar-part--ink" d="M94 105c12 6 25 7 37 3m-24 23 9 6m-18-55 8 6m36 3 9-6" />
        <circle className="familiar-eye" cx="119" cy="88" r="2.7" />
      </g>;
      break;
    case "selkie":
      anatomy = <g>
        <path className="familiar-part familiar-part--body" fill={body} d="M48 122c4-25 25-44 52-43 24 1 41 17 42 35 1 16-13 25-34 23-19-2-27 16-48 15-16-1-20-15-12-30Z" />
        <path className="familiar-part familiar-part--accent" d="M70 104c-16-18-18-38-8-54 16 7 25 20 26 39m30 0c12-18 28-25 47-20-4 19-15 32-34 39m-65 31c-9 11-20 15-35 12 9-12 21-17 34-16m67 0c14 8 25 7 37-1-11-9-23-11-36-6" />
        <path className="familiar-part familiar-part--ink" d="M59 119c21 11 47 12 73 1m-75-1 12 7m7-16 11 8m15-10 10 8m13-10 9 6" />
        <circle className="familiar-eye" cx="121" cy="91" r="2.5" />
        <path className="familiar-part familiar-part--body" fill={highlight} d="M102 87c7-13 23-17 36-9 10 6 11 18 2 25-11 8-28 5-38-5Z" />
      </g>;
      break;
    case "gargoyle":
      anatomy = <g>
        <path className="familiar-part familiar-part--wing" d="M86 101 47 62 56 92 34 79 49 117 76 128m41-27 38-39-8 31 22-14-14 39-25 10" />
        <path className="familiar-part familiar-part--body" fill={body} d="M66 106c8-18 31-23 48-13 17 11 21 32 5 44-14 11-44 8-55-4-7-7-4-18 2-27Z" />
        <path className="familiar-part familiar-part--accent" d="m106 105c2-17 11-29 25-30 13-1 18 10 10 19-7 7-18 9-31 11m9-26 3-17 11 16m7-1 12-15-1 21m-69 30-6 18 10-3m28-8 8 17 9-5" />
        <path className="familiar-part familiar-part--ink" d="m73 114 10 5m8-13 10 7m22 3 9-5m-59 20 7 4m18-2 9 5m30-63 11 7" />
        <circle className="familiar-eye" cx="135" cy="91" r="2.6" />
      </g>;
      break;
    case "forest":
      anatomy = <g>
        <path className="familiar-part familiar-part--body" fill={body} d="M49 108c11-17 37-21 58-12 19 8 28 27 13 40-17 15-50 14-67 2-11-8-12-20-4-30Z" />
        <path className="familiar-part familiar-part--limb" d="m61 132-7 22 9 3 11-22m32 2 1 22 9 0 2-25m-47-14-12 18-8-4 12-22m48 3 16 13 7-6-17-18" />
        <path className="familiar-part familiar-part--body" fill={highlight} d="M103 105c4-18 10-29 24-34 13-4 24 5 17 16-5 8-16 11-28 12l-1 18Z" />
        <path className="familiar-part familiar-part--accent" d="m118 74-3-22 10 16 9-25 2 28 17-16-9 26m-74 36 8 7m8-14 9 6m26 5 7 5" />
        <path className="familiar-part familiar-part--ink" d="M50 116c14 8 32 10 47 7m-20 5c5 8 12 12 22 14" />
        <circle className="familiar-eye" cx="137" cy="83" r="2.5" />
      </g>;
      break;
    case "wolf":
      anatomy = <g>
        <path className="familiar-part familiar-part--tail" d="M61 118c-26 8-35 0-42-15 19 4 30 0 39-11" />
        <path className="familiar-part familiar-part--body" fill={body} d="M48 105c12-17 40-18 60-9 20 9 28 25 14 38-13 12-47 13-66 3-12-7-16-21-8-32Z" />
        <path className="familiar-part familiar-part--limb" d="m58 132-7 22 10 3 11-22m30 0 2 22 10 0 2-25m-46-24 18 10m32 0 15 10" />
        <path className="familiar-part familiar-part--body" fill={highlight} d="M100 104c3-19 13-32 29-31 15 1 21 14 11 23-8 7-22 9-40 8Z" />
        <path className="familiar-part familiar-part--accent" d="m109 82-4-24 18 18m10-1 17-18-5 29m-50 33c12 9 25 12 40 9m-37-1 10 5m9-10 8 5" />
        <circle className="familiar-eye" cx="137" cy="85" r="2.7" />
      </g>;
      break;
    case "winter":
      anatomy = <g>
        <path className="familiar-part familiar-part--body" fill={body} d="M85 91c6-13 24-13 30 0l12 39-23 17-25-16Z" />
        <path className="familiar-part familiar-part--body" fill={highlight} d="M82 80c1-18 12-29 27-27 14 2 20 17 11 28-9 10-27 11-38-1Z" />
        <path className="familiar-part familiar-part--accent" d="M94 58C77 48 73 33 80 20c5 18 15 19 23 23m6 14c19-11 23-25 17-39-4 18-14 22-24 27m-22 93c-6 10-5 20 2 29m40-28c9 8 11 17 7 28m-36-47 23 0m-23 10 23 0" />
        <path className="familiar-part familiar-part--ink" d="m88 68 7 4m15 1 8-5m-19 44 6 8m12-8 6 8" />
        <circle className="familiar-eye" cx="94" cy="80" r="2.5" /><circle className="familiar-eye" cx="108" cy="80" r="2.5" />
      </g>;
      break;
    case "raven":
      anatomy = <g>
        <path className="familiar-part familiar-part--wing" d="M93 98C62 86 49 61 41 35c27 8 48 25 59 50-4-28 5-48 23-65 4 34-1 56-14 79m5-4c23-14 40-35 53-62-1 35-14 58-42 78" />
        <path className="familiar-part familiar-part--body" fill={body} d="M86 100c9-12 26-15 36-4 11 13 7 32-4 42-10 8-28 5-35-7-6-10-4-22 3-31Z" />
        <path className="familiar-part familiar-part--body" fill={highlight} d="M105 100c-1-18 8-31 22-34 12-3 20 5 15 15-4 8-16 13-29 13" />
        <path className="familiar-part familiar-part--accent" d="m139 82 21 5-19 7m-35 29c-8 16-17 25-30 34 22-2 37-12 51-29m-38-29 25 12m-16-21 26 11" />
        <path className="familiar-part familiar-part--ink" d="m58 56 30 30m51-32-23 35m-49 6 27 13m64-18-37 21" />
        <circle className="familiar-eye" cx="137" cy="75" r="2.5" />
      </g>;
      break;
    case "owl":
      anatomy = <g>
        <path className="familiar-part familiar-part--body" fill={body} d="M59 105c-1-29 14-49 40-51 27-2 44 20 42 50-1 25-17 42-42 42-24 0-39-16-40-41Z" />
        <path className="familiar-part familiar-part--accent" d="m66 71-8-25 25 16m44 0 24-17-7 29m-65 56-16 18m31-14-5 20m21-20 7 20m15-27 16 14" />
        <ellipse className="familiar-part familiar-part--ink" cx="86" cy="96" rx="17" ry="21" /><ellipse className="familiar-part familiar-part--ink" cx="116" cy="96" rx="17" ry="21" />
        <circle className="familiar-eye" cx="86" cy="97" r="6" /><circle className="familiar-eye" cx="116" cy="97" r="6" />
        <path className="familiar-part familiar-part--accent" d="m96 109 5 8 5-8m-33 12 12 6m27-7 12 7m-41-58 9 4m17-4 9 5" />
        <path className="familiar-part familiar-part--ink" d="M73 127c17 12 38 12 53-1" />
      </g>;
      break;
    case "frog":
      anatomy = <g>
        <path className="familiar-part familiar-part--body" fill={body} d="M55 110c2-26 21-40 46-39 27 1 44 18 43 41-1 21-17 33-45 33-29 0-46-12-44-35Z" />
        <circle className="familiar-part familiar-part--body" fill={highlight} cx="77" cy="76" r="15" /><circle className="familiar-part familiar-part--body" fill={highlight} cx="124" cy="76" r="15" />
        <path className="familiar-part familiar-part--accent" d="m91 72 9-23 7 22m-38 68-14 10 20 4m46-14 15 11-22 4m-42-53c16 10 34 11 52 1" />
        <path className="familiar-part familiar-part--ink" d="M75 111c16 12 35 13 53 1m-45-22c8 6 17 7 26 3m-22 39 7 3m20-2 7-3" />
        <circle className="familiar-eye" cx="78" cy="76" r="3.2" /><circle className="familiar-eye" cx="124" cy="76" r="3.2" />
      </g>;
      break;
    case "moth":
      anatomy = <g>
        <path className="familiar-part familiar-part--wing" d="M93 99C54 98 38 72 44 39c27 2 48 21 57 48 7-29 26-48 55-51 3 33-12 56-46 66m-19 3c-31 12-42 33-34 58 25-8 43-24 54-47m4-1c31 10 42 31 34 54-25-7-43-22-54-44" />
        <path className="familiar-part familiar-part--body" fill={body} d="M92 87c5-11 18-12 24-1l4 37-13 18-14-17Z" />
        <circle className="familiar-part familiar-part--body" fill={highlight} cx="105" cy="78" r="16" />
        <path className="familiar-part familiar-part--accent" d="m98 66-11-17m26 16 12-18m-20 82-7 18m17-18 7 17m-35-65 9 6m16-6 9 6" />
        <path className="familiar-part familiar-part--ink" d="m48 54 31 29m71-29-34 28m-59 38 33-14m49-15 29-17" />
        <circle className="familiar-eye" cx="99" cy="78" r="2" /><circle className="familiar-eye" cx="111" cy="78" r="2" />
      </g>;
      break;
  }

  return (
    <div className={`familiar-art familiar-art--${familiar.form}${familiar.secondaryForm ? ` familiar-art--secondary-${familiar.secondaryForm}` : ""} familiar-art--stage-${stage} familiar-art--${mood} familiar-art--${scale} familiar-art--theme-${theme}`} style={{ "--familiar-color": familiar.color, "--familiar-accent-color": familiar.accentColor ?? familiar.color } as CSSProperties} aria-hidden="true">
      <svg className="familiar-art__drawing" viewBox="0 0 200 190" focusable="false">
        <defs>
          <linearGradient id={`${gradientId}-body`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff8e6" /><stop offset="0.27" stopColor="var(--familiar-accent-color)" /><stop offset="0.72" stopColor="var(--familiar-color)" /><stop offset="1" stopColor="#393a49" /></linearGradient>
          <linearGradient id={`${gradientId}-highlight`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff9e8" /><stop offset="0.42" stopColor="var(--familiar-accent-color)" /><stop offset="1" stopColor="var(--familiar-color)" /></linearGradient>
          <radialGradient id={`${gradientId}-aura`}><stop offset="0" stopColor="var(--familiar-color)" stopOpacity="0.25" /><stop offset="1" stopColor="var(--familiar-color)" stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse cx="100" cy="100" rx="91" ry="88" fill={`url(#${gradientId}-aura)`} />
        {anatomy}
        <g className="familiar-art__sigils">
          {starOffsets.slice(0, stage + 2).map(([x, y], index) => <path key={index} d={`m${x} ${y - 3} 1.3 2 2.3 1-2.3 1-1.3 2-1.3-2-2.3-1 2.3-1Z`} />)}
        </g>
        {stage > 1 && <g className="familiar-art__evolved"><path d="M72 54c17-19 40-22 59-8m-55 99c18 15 42 14 58-1" /><circle cx="101" cy="31" r="4" /></g>}
        {familiar.marking && <title>{`${familiar.species} with ${familiar.marking}`}</title>}
      </svg>
    </div>
  );
}

function UnformedFamiliar({ large = false }: { large?: boolean }) {
  return (
    <div className={`unformed-familiar${large ? " unformed-familiar--large" : ""}`} aria-hidden="true">
      <span className="unformed-familiar__halo" />
      <span className="unformed-familiar__wing unformed-familiar__wing--left" />
      <span className="unformed-familiar__wing unformed-familiar__wing--right" />
      <span className="unformed-familiar__ear unformed-familiar__ear--left" />
      <span className="unformed-familiar__ear unformed-familiar__ear--right" />
      <span className="unformed-familiar__body" />
      <span className="unformed-familiar__eyes"><i /><i /></span>
      <span className="unformed-familiar__tail" />
      <i className="unformed-familiar__fragment unformed-familiar__fragment--one" />
      <i className="unformed-familiar__fragment unformed-familiar__fragment--two" />
      <i className="unformed-familiar__fragment unformed-familiar__fragment--three" />
    </div>
  );
}

function RosePetalField({ mode = "ambient" }: { mode?: "ambient" | "awakening" | "milestone" }) {
  const petals = Array.from({ length: 9 }, (_, index) => ({
    left: `${(index * 37 + 7) % 94}%`,
    size: `${9 + (index % 4) * 3}px`,
    drift: `${((index * 19) % 72) - 36}px`,
    spin: `${index % 2 === 0 ? 210 : -250}deg`,
    duration: `${24 + (index % 5) * 4}s`,
    delay: `${-((index * 7) % 29)}s`,
    tone: ["#a92338", "#c43a4d", "#85273a", "#d25360"][index % 4],
  }));

  return (
    <div className={`rose-petal-field rose-petal-field--${mode}`} aria-hidden="true">
      {petals.map((petal, index) => (
        <svg key={index} viewBox="0 0 44 64" style={{ "--petal-left": petal.left, "--petal-size": petal.size, "--petal-drift": petal.drift, "--petal-spin": petal.spin, "--petal-duration": petal.duration, "--petal-delay": petal.delay, "--petal-tone": petal.tone } as CSSProperties}>
          <path className="rose-petal__shape" d="M22 61C17 49 3 41 4 26 5 13 15 4 23 3c11 10 18 20 15 32-2 10-9 18-16 26Z" />
          <path className="rose-petal__fold" d="M22 57C19 39 13 25 11 15m11 42c3-15 8-26 13-34" />
        </svg>
      ))}
    </div>
  );
}

const MAX_AVATAR_BYTES = 750_000;
const MAX_PROOF_BYTES = 1_500_000;

function readFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("The file could not be read."));
    reader.readAsDataURL(file);
  });
}

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "X";
}

function HeroCard({ snapshot }: { snapshot?: HeroCardSnapshot }) {
  const card = snapshot ?? {
    id: "fallback-card",
    at: Date.now(),
    rank: rankFor(1).name,
    tone: rankFor(1).tone,
    level: 1,
    name: "Unclaimed Hero",
    title: "",
    avatar: "",
    weapon: "",
    attrs: { mind: 1, adapt: 1, heart: 1, vision: 1, legacy: 1 },
    skills: [],
    familiar: { id: "moth", name: "Wisp", realm: "forest" as FamiliarRealm },
    familiarStage: 1,
    familiarTheme: "none" as const,
    highlights: [],
  };
  const cardFamiliar = getFamiliarSpec(card.familiar.id, card.familiar.appearance);

  return (
    <article className="hero-card">
      <div className="hero-card__topline">
        <span>WORLD X HEROES</span>
        <span>LVL {card.level}</span>
      </div>
      <div className="hero-card__portrait">
        {card.avatar ? (
          <img src={card.avatar} alt={`${card.name}'s portrait`} />
        ) : (
          <div className="portrait-placeholder"><Sparkles size={31} strokeWidth={1.2} /></div>
        )}
        <span className="hero-card__crest"><span>X</span></span>
      </div>
      <div className="hero-card__identity">
        <span className="hero-card__rank">{card.rank}</span>
        <h3>{card.name}</h3>
        {card.title && <p>{card.title}</p>}
        {card.weapon && <span className="hero-card__craft">{card.weapon}</span>}
      </div>
      <div className="hero-card__attributes">
        {ATTRS.map((attribute) => (
          <span key={attribute.key} title={attribute.label}>
            <b>{attribute.key.slice(0, 1).toUpperCase()}</b>
            {card.attrs[attribute.key]}
          </span>
        ))}
      </div>
      <div className="hero-card__familiar">
        <FamiliarPortrait familiar={cardFamiliar} stage={card.familiarStage} scale="card" theme={card.familiarTheme} />
        <span>TRAVELING WITH {card.familiar.name}</span>
      </div>
      {card.highlights.length > 0 && (
        <div className="hero-card__highlights">{card.highlights.join(" · ")}</div>
      )}
    </article>
  );
}

function CelestialBackdrop({ cinematic = false, familiar, stage = 1, forming = false }: { cinematic?: boolean; familiar?: FamiliarSpec; stage?: number; forming?: boolean }) {
  return (
    <div className={`${cinematic ? "celestial-backdrop celestial-backdrop--cinematic" : "celestial-backdrop celestial-backdrop--ambient"}${familiar ? ` celestial-backdrop--realm-${familiar.realm}` : ""}${forming ? " celestial-backdrop--forming" : ""}`} aria-hidden="true">
      <div className="celestial-art celestial-art--figure" />
      <div className="celestial-art celestial-art--architecture" />
      <div className="celestial-lightwell" />
      <div className="celestial-gate"><span /><span /></div>
      <div className="celestial-cloud celestial-cloud--horizon" />
      <div className="celestial-cloud celestial-cloud--foreground" />
      <div className="celestial-mist celestial-mist--far" />
      <div className="celestial-mist celestial-mist--near" />
      {familiar && (
        <div className={`celestial-familiar-echo celestial-familiar-echo--${familiar.form}`}>
          <span className="celestial-familiar-echo__orbit celestial-familiar-echo__orbit--outer" />
          <span className="celestial-familiar-echo__orbit celestial-familiar-echo__orbit--inner" />
          <FamiliarPortrait familiar={familiar} stage={stage} mood={forming ? "curious" : "calm"} scale="backdrop" />
        </div>
      )}
      <div className="celestial-stars">
        {Array.from({ length: 16 }, (_, particleIndex) => <i key={particleIndex} />)}
      </div>
      {cinematic && (
        <svg className="fate-thread" viewBox="0 0 1600 1000" preserveAspectRatio="none">
          <defs>
            <linearGradient id="fate-red" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#8b1825" />
              <stop offset="0.2" stopColor="#d43c47" />
              <stop offset="0.48" stopColor="#fa8580" />
              <stop offset="0.72" stopColor="#bd2738" />
              <stop offset="1" stopColor="#791823" />
            </linearGradient>
            <linearGradient id="fate-mist-mask" x1="0" y1="0" x2="1600" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="black" />
              <stop offset="0.09" stopColor="white" />
              <stop offset="0.2" stopColor="black" />
              <stop offset="0.31" stopColor="white" />
              <stop offset="0.69" stopColor="white" />
              <stop offset="0.8" stopColor="black" />
              <stop offset="0.91" stopColor="white" />
              <stop offset="1" stopColor="black" />
            </linearGradient>
            <filter id="fate-glow" x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <mask id="fate-mist"><rect width="1600" height="1000" fill="url(#fate-mist-mask)" /></mask>
          </defs>
          <g className="fate-thread__far">
            <path d="M -30 301 C 150 214, 238 369, 394 310 S 648 210, 766 287 S 994 392, 1115 302 S 1375 208, 1630 304" />
            <path className="fate-thread__far-glow" d="M -30 301 C 150 214, 238 369, 394 310 S 648 210, 766 287 S 994 392, 1115 302 S 1375 208, 1630 304" />
          </g>
          <g className="fate-thread__near" mask="url(#fate-mist)">
            <path className="fate-thread__aura" d="M -60 730 C 130 650, 168 863, 326 790 C 442 738, 406 565, 551 592 C 685 617, 646 845, 820 756 C 955 687, 902 494, 1050 520 C 1195 546, 1113 739, 1302 704 C 1445 678, 1448 599, 1660 644" />
            <path className="fate-thread__strand" d="M -60 730 C 130 650, 168 863, 326 790 C 442 738, 406 565, 551 592 C 685 617, 646 845, 820 756 C 955 687, 902 494, 1050 520 C 1195 546, 1113 739, 1302 704 C 1445 678, 1448 599, 1660 644" />
            <path className="fate-thread__shine" d="M -60 725 C 130 645, 168 858, 326 785 C 442 733, 406 560, 551 587 C 685 612, 646 840, 820 751 C 955 682, 902 489, 1050 515 C 1195 541, 1113 734, 1302 699 C 1445 673, 1448 594, 1660 639" />
            <path className="fate-thread__glint" d="M -60 730 C 130 650, 168 863, 326 790 C 442 738, 406 565, 551 592 C 685 617, 646 845, 820 756 C 955 687, 902 494, 1050 520 C 1195 546, 1113 739, 1302 704 C 1445 678, 1448 599, 1660 644" />
          </g>
        </svg>
      )}
    </div>
  );
}

function App() {
  const { hero, update, loaded } = useHero();
  const bondedFamiliar = getFamiliarSpec(hero.familiar.id, hero.familiar.appearance);
  const bondedFamiliarStage = familiarEvolutionStage(hero);
  const [screen, setScreen] = useState<Screen>("intro");
  const [focus, setFocus] = useState<AttrKey>("heart");
  const [alias, setAlias] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [craft, setCraft] = useState("");
  const [bio, setBio] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [masked, setMasked] = useState(true);
  const [avatar, setAvatar] = useState("");
  const [avatarName, setAvatarName] = useState("");
  const [creationMessage, setCreationMessage] = useState("");
  const [familiarId, setFamiliarId] = useState(hero.familiar.id);
  const [familiarName, setFamiliarName] = useState(hero.familiar.name);
  const [familiarMood, setFamiliarMood] = useState("calm");
  const [awakeningStep, setAwakeningStep] = useState<AwakeningStep>("introduction");
  const [heroIntroduction, setHeroIntroduction] = useState("");
  const [discoverySignals, setDiscoverySignals] = useState<FamiliarSignal[]>([]);
  const [discoveryMatches, setDiscoveryMatches] = useState<FamiliarMatch[]>([]);
  const [recommendationIndex, setRecommendationIndex] = useState(0);
  const [gatewayStage, setGatewayStage] = useState<GatewayStage>("idle");
  const [gatewayOrigin, setGatewayOrigin] = useState({ x: 50, y: 50 });

  const [questTitle, setQuestTitle] = useState("");
  const [questDescription, setQuestDescription] = useState("");
  const [questCategory, setQuestCategory] = useState("General Contribution");
  const [questAttribute, setQuestAttribute] = useState<AttrKey>("heart");
  const [proofMode, setProofMode] = useState<ProofMode>("photo");
  const [proofData, setProofData] = useState("");
  const [proofName, setProofName] = useState("");
  const [proofLink, setProofLink] = useState("");
  const [visibility, setVisibility] = useState<"sealed" | "public">("sealed");
  const [questMessage, setQuestMessage] = useState("");
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [journalPrivacy, setJournalPrivacy] = useState<"private" | "profile" | "public">("private");
  const [goalInput, setGoalInput] = useState("");
  const [companionOpen, setCompanionOpen] = useState(true);
  const [companionInput, setCompanionInput] = useState("");
  const [companionMessages, setCompanionMessages] = useState<Array<{ id: string; role: "hero" | "companion"; text: string }>>([
    {
      id: "welcome",
      role: "companion",
      text: "I am your Hero Companion. Tell me what happened today, what you want to build, or what you need help organizing.",
    },
  ]);

  async function handleAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setCreationMessage("Choose an image for your portrait.");
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setCreationMessage("Keep the portrait image under 750 KB for local storage.");
      return;
    }
    try {
      setAvatar(await readFile(file));
      setAvatarName(file.name);
      setCreationMessage("");
    } catch {
      setCreationMessage("That image could not be loaded. Try another file.");
    }
  }

  function awaken(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const introduction = heroIntroduction.trim();
    const signals = inferFamiliarSignals(introduction);
    if (introduction.length < 18 || signals.length === 0) {
      setCreationMessage("Tell me a little about what you enjoy, hope to learn, or want to become. There is no right answer.");
      return;
    }

    const matches = rankFamiliarMatches(signals, introduction);
    if (matches.length === 0) {
      setCreationMessage("I heard you, but I need another detail about your interests or hopes before a Familiar can take shape.");
      return;
    }

    setDiscoverySignals(signals);
    setDiscoveryMatches(matches);
    setRecommendationIndex(0);
    setFamiliarId(matches[0].familiar.id);
    setFamiliarName(matches[0].familiar.name);
    setCreationMessage("");
    setAwakeningStep("seeking");
    window.setTimeout(() => setAwakeningStep("reveal"), 1450);
  }

  function acceptFamiliar() {
    const chosen = discoveryMatches[recommendationIndex]?.familiar ?? FAMILIAR_CHOICES.find((choice) => choice.id === familiarId) ?? FAMILIAR_CHOICES[0];
    const attributes: Record<AttrKey, number> = { mind: 1, adapt: 1, heart: 1, vision: 1, legacy: 1 };
    attributes[focus] += 2;
    const skills = skillsInput.split(",").map((skill) => skill.trim()).filter(Boolean).slice(0, 12);
    const newHero: Hero = {
      ...hero,
      created: true,
      name: alias.trim(),
      title: heroTitle.trim(),
      avatar,
      weapon: craft.trim(),
      bio: bio.trim(),
      ghost: masked,
      familiar: {
        id: chosen.id,
        name: familiarName.trim() || chosen.name,
        realm: chosen.realm,
        appearance: { primaryColor: chosen.color, accentColor: chosen.accentColor ?? chosen.color, marking: chosen.marking ?? "constellation tracery" },
      },
      familiarMemory: { introduction: heroIntroduction.trim().slice(-4000), signals: discoverySignals, recentReplies: [] },
      xp: 0,
      attrs: attributes,
      quests: [],
      skills,
      cards: [],
    };
    newHero.cards = [mintCard(newHero, 1, [])];
    update(newHero);
    setCompanionMessages([{
      id: "bond-formed",
      role: "companion",
      text: chosen.id.startsWith("hybrid:")
        ? `There you are. I followed ${discoverySignals.slice(0, 2).join(" and ")} through The Between. You're difficult to classify. So am I. I don't think I know what I am yet. Maybe we'll discover it together. You can call me ${familiarName.trim() || chosen.name}.`
        : `There you are. I followed the ${discoverySignals[0] ?? "quiet signal"} through The Between. I finally found you. I don't know exactly what I am yet. Maybe we'll figure that out together. You can call me ${familiarName.trim() || chosen.name}.`,
    }]);
    setFamiliarMood("curious");
    setScreen("profile");
  }

  function exploreAnotherFamiliar() {
    if (discoveryMatches.length < 2) return;
    const nextIndex = (recommendationIndex + 1) % discoveryMatches.length;
    const next = discoveryMatches[nextIndex].familiar;
    setRecommendationIndex(nextIndex);
    setFamiliarId(next.id);
    setFamiliarName(next.name);
  }

  async function handleProofFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setQuestMessage("For this alpha, attach a photo or use an evidence link.");
      return;
    }
    if (file.size > MAX_PROOF_BYTES) {
      setQuestMessage("Keep evidence photos under 1.5 MB for local storage.");
      return;
    }
    try {
      setProofData(await readFile(file));
      setProofName(file.name);
      setQuestMessage("");
    } catch {
      setQuestMessage("That photo could not be loaded. Try another file.");
    }
  }

  function submitQuest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = questTitle.trim();
    const description = questDescription.trim();

    if (!title || !description) {
      setQuestMessage("Add a title and a clear description before submitting.");
      return;
    }

    if (detectDuplicateQuest(hero.quests, title, description)) {
      setQuestMessage("Duplicate submission detected. This appears to be substantially the same accomplishment as one already recorded.");
      return;
    }

    const proof = proofMode === "photo"
      ? (proofData ? { kind: "photo" as const, src: proofData, name: proofName } : null)
      : (proofLink.trim() ? { kind: "link" as const, src: proofLink.trim(), name: proofLink.trim() } : null);

    if (!proof) {
      setQuestMessage("INSUFFICIENT EVIDENCE — attach a photo or add a proof link before submitting.");
      return;
    }

    const merit = evaluateQuestMerit(title, description, questAttribute, questCategory.trim() || "General Contribution");
    const quest: QuestLog = {
      id: crypto.randomUUID(),
      title,
      description,
      category: questCategory.trim() || "General Contribution",
      xp: 0,
      attr: questAttribute,
      at: Date.now(),
      proof,
      verification: "submitted",
      evidenceLevel: proof.kind === "link" ? 2 : 3,
      visibility,
      likes: 0,
      merit,
    };

    const auditEntry = createAuditTrailEntry(
      quest,
      [proof.name, proof.src],
      [`Category: ${quest.category}`, `Attribute: ${ATTRS.find((attribute) => attribute.key === quest.attr)?.label ?? "hero"}`, `Difficulty: ${merit.difficulty}`, `Impact: ${merit.impact}`],
      merit.explanation,
    );

    const questJournalEntry: HeroDiaryEntry = {
      id: crypto.randomUUID(),
      kind: "achievement",
      title: "Quest recorded",
      content: `${title} was documented and stored in your private Hero Journal. The AI is evaluating the evidence and will assign Merit only when the action is supported by proof.`,
      at: Date.now(),
      privacy: "private",
    };

    const nextHero = {
      ...hero,
      quests: [quest, ...hero.quests],
      attrs: Object.fromEntries(ATTRS.map((attribute) => [attribute.key, hero.attrs[attribute.key] + (merit.attributes[attribute.key] ?? 0)])) as Record<AttrKey, number>,
      summary: generateHeroSummary({ ...hero, quests: [quest, ...hero.quests] }),
      skills: Array.from(new Set([...hero.skills, ...quest.title.split(/\s+/).filter((word) => word.length > 4).slice(0, 3)])),
      diary: [questJournalEntry, ...hero.diary],
      auditTrail: [auditEntry, ...hero.auditTrail],
    };

    update(nextHero);
    setFamiliarMood("investigating");
    setQuestTitle("");
    setQuestDescription("");
    setQuestCategory("General Contribution");
    setProofData("");
    setProofName("");
    setProofLink("");
    setQuestMessage("Evidence recorded. Merit and XP are assigned only when the claim is supported by adequate proof.");
  }

  function submitJournal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = journalTitle.trim();
    const content = journalContent.trim();
    if (!title || !content) {
      setQuestMessage("Add a private journal title and reflection before saving.");
      return;
    }

    const entry = {
      id: crypto.randomUUID(),
      kind: "reflection" as const,
      title,
      content,
      at: Date.now(),
      privacy: journalPrivacy,
    };

    update({
      diary: [entry, ...hero.diary],
      summary: `${hero.summary} | Journal entry saved privately.`,
    });
    setFamiliarMood("listening");

    setJournalTitle("");
    setJournalContent("");
    setJournalPrivacy("private");
    setQuestMessage("Private journal entry saved. It remains private unless you choose to share it.");
  }

  function createQuestFromGoal() {
    const goal = goalInput.trim();
    if (!goal) {
      setQuestMessage("Describe a goal to turn it into a Hero quest.");
      return;
    }

    const goalLower = goal.toLowerCase();
    const attribute: AttrKey = goalLower.includes("learn") || goalLower.includes("study") || goalLower.includes("teach")
      ? "legacy"
      : goalLower.includes("art") || goalLower.includes("create") || goalLower.includes("design") || goalLower.includes("music") || goalLower.includes("write")
        ? "vision"
        : goalLower.includes("care") || goalLower.includes("help") || goalLower.includes("support")
          ? "heart"
          : goalLower.includes("build") || goalLower.includes("fix") || goalLower.includes("repair") || goalLower.includes("make")
            ? "adapt"
            : "mind";

    const category = goalLower.includes("art") || goalLower.includes("music") || goalLower.includes("write")
      ? "ARTISTRY"
      : goalLower.includes("build") || goalLower.includes("fix") || goalLower.includes("code") || goalLower.includes("create")
        ? "INNOVATION"
        : goalLower.includes("help") || goalLower.includes("care") || goalLower.includes("community")
          ? "HUMANITY"
          : "WISDOM";

    setQuestTitle(goal.length > 60 ? `${goal.slice(0, 57).trim()}...` : goal);
    setQuestDescription(`Goal: ${goal}. I want to make this real through focused effort, documentation, and evidence, and I will update this quest as I progress.`);
    setQuestAttribute(attribute);
    setQuestCategory(category);
    setGoalInput("");
    setFamiliarMood("curious");
    setQuestMessage("Quest draft created from your goal. You can review, edit, or submit it whenever you’re ready.");
  }

  function getCompanionReply(input: string) {
    const text = input.toLowerCase();
    const activeFamiliar = getFamiliarSpec(hero.familiar.id);
    const recentReplies = hero.familiarMemory.recentReplies ?? [];
    const inputSeed = Array.from(input).reduce((sum, character) => sum + character.charCodeAt(0), 0);
    const freshLine = (options: string[]) => {
      const start = (inputSeed + recentReplies.length) % options.length;
      for (let offset = 0; offset < options.length; offset += 1) {
        const candidate = options[(start + offset) % options.length];
        if (!recentReplies.some((reply) => reply.includes(candidate))) return candidate;
      }
      return options[(start + 1) % options.length];
    };
    const voiceOptions = activeFamiliar.form === "frog" ? ["A small croak of thought. ", "Wait, what if... ", "Oh! I have an idea. "]
      : activeFamiliar.form === "owl" || activeFamiliar.form === "sphinx" ? ["Let me think this through. ", "I noticed a pattern. ", "A question before we begin. "]
        : activeFamiliar.form === "kitsune" ? ["A clever trail starts somewhere. ", "I have a hunch. ", "Let's follow that thought. "]
          : activeFamiliar.form === "dragon" || activeFamiliar.form === "gryphon" ? ["We can meet this boldly. ", "I will keep watch while we plan. ", "A worthy challenge. "]
            : activeFamiliar.form === "raven" || activeFamiliar.form === "moth" ? ["I caught a detail on the breeze. ", "There is a new path here. ", "I have been listening. "]
              : ["Hmm, let's take another look. ", "I am still listening. ", "One step at a time. "];
    const speak = (options: string[]) => `${hero.familiar.name || "Wisp"}: ${freshLine(voiceOptions)}${freshLine(options)}`;
    const strongestAttribute = ATTRS.reduce((best, attr) => hero.attrs[attr.key] > hero.attrs[best.key] ? attr : best, ATTRS[0]);
    const latestQuest = hero.quests[0];

    if (/(what should i work on next|what should i do next|next goal|next quest)/.test(text)) {
      return speak([
        latestQuest
          ? `Your latest Quest is “${latestQuest.title}.” You could build on that step, or choose something new that strengthens ${strongestAttribute.label}. What feels useful now?`
          : `Your ${strongestAttribute.label} is a natural place to begin. Pick one small action you would genuinely like to take, and we can shape it into a Quest.`,
        `Your introduction mentioned ${hero.familiarMemory.signals[0] ?? "your own interests"}. Choose a real-world step that connects to that, and I can help you plan how to document it.`,
        `There is no required next move. We could make a tiny learning goal, a creative project, or a helpful act. Which sounds like your kind of day?`,
      ]);
    }

    if (/(learn|teach|study|practice|improve)/.test(text)) {
      return speak([
        "Let's make the learning goal small enough to start this week. What would you like to understand or practice first?",
        "A skill grows through attempts, not just plans. Tell me what you want to learn and we can outline a first step and what progress might look like.",
        "That fits the curiosity you shared with me. I can help turn it into a Quest; the evidence can be notes, a project, or another record of what you actually do.",
      ]);
    }

    if (/(help me|need help|confused|struggling|not sure|don't know what to do)/.test(text)) {
      return speak(["We can slow it down. What feels hardest right now: choosing a goal, starting, or figuring out what to record?", "No need to solve the whole thing at once. Tell me one part you can influence today, and we'll start there.", "Let's make this smaller together: one goal, one next action, and a way to notice progress. Which part should we untangle first?"]);
    }

    if (/(help|care|kind|volunteer|community|neighbor|support)/.test(text)) {
      return speak([
        "That may connect to Humanity or Kindness. What happened, who did it help, and what record could support the account? Your description alone does not verify it.",
        "Care can take a lot of forms. Tell me the specific action and its outcome; we can decide together what belongs in a private reflection and what has evidence for review.",
        "I hear that helping matters to you. If this was an action you took, let's capture the details and any proof without overstating what it shows.",
      ]);
    }

    if (/(build|invent|prototype|create|design|art|painting|music|write|drawing|project)/.test(text)) {
      return speak([
        "That sounds like a project worth following. What have you made so far, and what would show the next stage clearly?",
        "Your creative streak keeps surfacing. I can help you keep a dated trail of sketches, drafts, versions, or finished work.",
        "Let's give that idea a first step. I can help make a Quest draft, but Merit still depends on documented work and review.",
      ]);
    }

    if (/(finish|completed|done|accomplishment|achievement|quest)/.test(text)) {
      if (latestQuest) {
        return speak([
          `Your latest recorded Quest is “${latestQuest.title},” currently ${latestQuest.verification.replaceAll("_", " ")}. I only know what you told me and the evidence attached; it is not verified yet.`,
          `I have “${latestQuest.title}” in your record. Want to review its evidence or add a private reflection about how it went?`,
          `That may be a meaningful step. Your latest Quest, “${latestQuest.title},” is still ${latestQuest.verification.replaceAll("_", " ")}; I won't call it verified without a review.`,
        ]);
      }
      return speak(["I don't have a Quest record for that yet. Tell me what you did and we can decide how to document it.", "Your story is yours to tell. If you want this in the Hero record, start with the action and any evidence you have.", "I can help turn that into a clear record. What happened, and when?"]);
    }

    if (/(good day|had a good day|i did something|really good)/.test(text)) {
      return speak(["I am glad you told me. What part of today do you want to remember? We can keep it as a private journal note.", "That sounds worth pausing for. Was there a moment you felt proud of, or would you rather just mark the day in your Chronicle?", "Tell me a little more about the good part. I'll listen first; it doesn't have to become a Quest."]);
    }

    return speak([
      "I want to understand what you mean. What happened next, or what would you like to figure out together?",
      "I am listening. We can talk it through without turning every thought into a Merit claim.",
      "That gives me a new thread to follow. Would you like to reflect on it, make a plan, or document an action?",
    ]);
  }

  function handleCompanionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = companionInput.trim();
    if (!trimmed) return;

    const reply = getCompanionReply(trimmed);
    setCompanionMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "hero", text: trimmed },
      { id: crypto.randomUUID(), role: "companion", text: reply },
    ]);
    const learnedSignals = inferFamiliarSignals(trimmed);
    update({
      familiarMemory: {
        introduction: `${hero.familiarMemory.introduction}\n${trimmed}`.trim().slice(-4000),
        signals: Array.from(new Set([...hero.familiarMemory.signals, ...learnedSignals])),
        recentReplies: [...(hero.familiarMemory.recentReplies ?? []), reply].slice(-24),
      },
    });
    setFamiliarMood(/complete|finished|did it|made it/i.test(trimmed) ? "curious" : "listening");
    setCompanionInput("");
  }

  function enterWorld() {
    if (!loaded) return;
    setScreen(hero.created ? "profile" : "create");
    setGatewayStage("idle");
  }

  function recordGatewayPointer(event: ReactPointerEvent<HTMLButtonElement>) {
    setGatewayOrigin({
      x: Math.max(4, Math.min(96, (event.clientX / window.innerWidth) * 100)),
      y: Math.max(4, Math.min(96, (event.clientY / window.innerHeight) * 100)),
    });
  }

  function activateGateway() {
    if (!loaded || gatewayStage !== "idle") return;
    setGatewayStage("contact");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGatewayStage("passage");
      window.setTimeout(enterWorld, 360);
      return;
    }

    window.setTimeout(() => setGatewayStage("gathering"), 240);
    window.setTimeout(() => setGatewayStage("burst"), 720);
    window.setTimeout(() => setGatewayStage("passage"), 1580);
    window.setTimeout(enterWorld, 2440);
  }

  if (screen === "intro") {
    return (
      <main className="intro-scene" id="home">
        <CelestialBackdrop cinematic familiar={hero.created ? bondedFamiliar : undefined} stage={bondedFamiliarStage} />
        <RosePetalField mode={gatewayStage === "idle" ? "ambient" : "awakening"} />
        <header className="landing-header">
          <a className="landing-wordmark" href="#home" aria-label="World X Heroes home"><span>WORLD</span><i>X</i><span>HEROES</span></a>
          <nav className="landing-nav" aria-label="Main navigation">
            <a href="#home">HOME</a><a href="#about">ABOUT</a><a href="#features">FEATURES</a><a href="#roadmap">ROADMAP</a><a href="#join">JOIN</a>
          </nav>
          <p className="landing-manifesto">REAL PEOPLE.<br />REAL SKILLS.<br />REAL IMPACT.</p>
        </header>

        <section className="intro-hero" aria-label="World X Heroes opening">
          <div className="intro-content">
            <h1 className="intro-title">
              <span className="intro-title__word">World</span>
              <span className="intro-title__x">X</span>
              <span className="intro-title__word">Heroes</span>
            </h1>
            <p className="intro-motto">YOU ARE THE MAIN CHARACTER</p>
            <button
              className={`enter-button${gatewayStage === "idle" ? "" : ` enter-button--${gatewayStage}`}`}
              type="button"
              onPointerDown={recordGatewayPointer}
              onClick={activateGateway}
              disabled={!loaded || gatewayStage !== "idle"}
              style={{ "--gateway-origin-x": `${gatewayOrigin.x}%`, "--gateway-origin-y": `${gatewayOrigin.y}%` } as CSSProperties}
              aria-label="Awaken your Hero and enter World X Heroes"
            >
              <span className="enter-button__frame">
                <span className="enter-button__corner enter-button__corner--tl">✧</span>
                <span className="enter-button__corner enter-button__corner--tr">✧</span>
                <span className="enter-button__corner enter-button__corner--bl">✧</span>
                <span className="enter-button__corner enter-button__corner--br">✧</span>
                <span className="enter-button__crest">✦</span>
                <span className="enter-button__label">{loaded ? "AWAKEN YOUR HERO" : "PREPARING YOUR WORLD"}</span>
                <ArrowRight className="enter-button__arrow" size={17} strokeWidth={1.5} />
                <span className="enter-button__inscription">ENTER THE WORLD</span>
              </span>
            </button>
          </div>
          <div className="intro-seal" aria-hidden="true"><span>X</span></div>
        </section>

        <section className="landing-features" id="features" aria-label="World X Heroes features">
          <article><span className="landing-feature__seal"><Award /></span><h2>HERO<br />PROGRESSION</h2><p>1 — 9,999</p><p>Your journey.<br />Your level.</p></article>
          <article><span className="landing-feature__seal"><Sparkles /></span><h2>EVOLVING<br />HERO CARDS</h2><p>Your story.</p><p>Visualized.</p></article>
          <article><span className="landing-feature__seal"><BookOpen /></span><h2>PROOF &amp;<br />PROVENANCE</h2><p>Your creations.</p><p>Protected.</p></article>
          <article><span className="landing-feature__seal"><EyeOff /></span><h2>GHOST HERO<br />MODE</h2><p>Your work.</p><p>Your privacy.</p></article>
          <article><span className="landing-feature__seal"><UserRound /></span><h2>X-MATCH</h2><p>Real people.</p><p>Real collaboration.</p></article>
        </section>

        <section className="landing-story" id="about">
          <div className="landing-story__copy">
            <span className="landing-eyebrow">WORLD X HEROES</span>
            <h2>Your story matters</h2>
            <p>You have skills. You have passions. You have a story. World X Heroes is where it all comes together—connecting you with people who see your value and your potential.</p>
            <p className="landing-story__script">Not just a profile.<br />A hero's journey.</p>
          </div>
          <div className="landing-card-gallery" aria-label="Examples of evolving Hero identities">
            {["THE WAYFINDER", "THE CREATOR", "THE GUARDIAN", "THE DREAMER", "THE BUILDER"].map((title, index) => (
              <article className={`landing-hero-card landing-hero-card--${index + 1}`} key={title}>
                <div className="landing-hero-card__art" style={{ backgroundPosition: `${12 + index * 18}% center` }}>
                  <span className="landing-hero-card__sigil">{["✦", "◈", "⌘", "☾", "✧"][index]}</span>
                </div>
                <strong>{title}</strong>
                <small>WORLD X HEROES</small>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-roadmap" id="roadmap">
          <span className="landing-rule" />
          <p className="landing-eyebrow">MORE THAN A PLATFORM</p>
          <h2>IT'S A UNIVERSE BUILT AROUND YOU.</h2>
          <div className="landing-roadmap__steps"><span>CREATE YOUR HERO</span><i>／</i><span>MEET YOUR FAMILIAR</span><i>／</i><span>LIVE YOUR QUEST</span></div>
        </section>

        <footer className="landing-footer" id="join">
          <div className="landing-footer__invite"><span>BE PART OF SOMETHING GREATER</span><p>CREATE YOUR HERO <i>／</i> MEET YOUR FAMILIAR <i>／</i> SHAPE YOUR WORLD</p></div>
          <button className="landing-join" type="button" onClick={activateGateway} disabled={!loaded || gatewayStage !== "idle"}>BEGIN YOUR JOURNEY <ArrowRight size={16} /></button>
          <div className="landing-footer__brand"><span>WORLD <i>X</i> HEROES</span><small>HUMANITY <b>·</b> CREATIVITY <b>·</b> CONNECTION</small></div>
        </footer>
        {gatewayStage !== "idle" && (
          <div className={`gateway-transition gateway-transition--${gatewayStage}`} style={{ "--gateway-origin-x": `${gatewayOrigin.x}%`, "--gateway-origin-y": `${gatewayOrigin.y}%` } as CSSProperties} aria-hidden="true">
            <div className="gateway-transition__ring" />
            <div className="gateway-transition__second-ring" />
            <div className="gateway-transition__veil" />
            <div className="gateway-transition__mist" />
            <div className="gateway-transition__stardust">
              {Array.from({ length: 88 }, (_, index) => {
                const angle = (index / 88) * Math.PI * 2;
                const distance = 90 + ((index * 47) % Math.max(240, Math.min(window.innerWidth, window.innerHeight) * 0.9));
                return <i key={index} style={{ "--particle-x": `${Math.cos(angle) * distance}px`, "--particle-y": `${Math.sin(angle) * distance}px`, "--gather-x": `${Math.cos(angle) * distance * 0.24}px`, "--gather-y": `${Math.sin(angle) * distance * 0.24}px`, "--particle-delay": `${(index % 14) * 12}ms`, "--particle-size": `${1 + (index % 3)}px` } as CSSProperties} />;
              })}
            </div>
          </div>
        )}
      </main>
    );
  }

  if (screen === "create") {
    const currentMatch = discoveryMatches[recommendationIndex];
    const selectedFamiliar = currentMatch?.familiar ?? FAMILIAR_CHOICES.find((choice) => choice.id === familiarId) ?? FAMILIAR_CHOICES[0];
    const resonanceLabels = (currentMatch?.resonance ?? []).map((signal) => SIGNAL_RULES.find((rule) => rule.key === signal)?.label ?? signal);

    return (
      <main className="alpha-screen creation-screen">
        <CelestialBackdrop cinematic={awakeningStep !== "introduction"} familiar={awakeningStep !== "introduction" ? selectedFamiliar : undefined} forming={awakeningStep === "seeking"} />
        <RosePetalField mode={awakeningStep === "introduction" ? "ambient" : "awakening"} />
        <header className="alpha-header">
          <button className="icon-command" type="button" onClick={() => setScreen("intro")} aria-label="Back to opening">
            <ArrowLeft size={18} />
          </button>
          <span className="alpha-wordmark">WORLD <i>X</i> HEROES</span>
          <span className="step-label">AWAKENING <b>{awakeningStep === "introduction" ? "01" : "02"}</b></span>
        </header>
        <div className="creation-wrap">
          <div className="screen-heading">
            <span className="screen-kicker">{awakeningStep === "introduction" ? "THE BETWEEN" : awakeningStep === "seeking" ? "THE BETWEEN IS ANSWERING" : "A BOND BEGINS"}</span>
            <h1>{awakeningStep === "introduction" ? "Before I take form..." : awakeningStep === "seeking" ? "I think I remember something..." : "Your Familiar has awakened"}</h1>
            <p>{awakeningStep === "introduction" ? "A Familiar crossed the space between worlds to find a Hero. It found you, but it cannot know what it is until it knows who you are." : awakeningStep === "seeking" ? "A signal is gathering. The shape is not settled yet." : "This is a possibility that emerged from your story, not a verdict about who you are."}</p>
          </div>
          <form className="creation-form" onSubmit={awaken}>
            <div className="creation-main">
              {awakeningStep === "introduction" ? (
                <>
                  <div className="familiar-invitation"><UnformedFamiliar /><div><span>A SIGNAL FROM THE BETWEEN</span><p>“There you are. I was looking for you.”</p></div></div>
                  <label className="form-field">
                    <span>WHAT SHOULD I KNOW ABOUT YOU? <b>*</b></span>
                    <textarea className="awakening-introduction" value={heroIntroduction} onChange={(event) => setHeroIntroduction(event.target.value)} placeholder="I love making things, I'm curious about the natural world, and I hope to build something that helps people..." rows={5} maxLength={900} required />
                  </label>
                  <p className="awakening-prompt">You might tell me what you love creating, what you're curious about, what you hope to learn, or the kind of person you want to become. No test. Share only what feels right.</p>
                  <label className="form-field">
                    <span>HERO NAME <b>*</b></span>
                    <input value={alias} onChange={(event) => setAlias(event.target.value)} placeholder="What should your Hero be called?" maxLength={32} required />
                  </label>
                  {!showAdvanced ? (
                    <button type="button" className="secondary-command" onClick={() => setShowAdvanced(true)}>ADD MORE DETAILS</button>
                  ) : (
                    <>
                      <div className="field-row">
                        <label className="form-field"><span>HERO TITLE</span><input value={heroTitle} onChange={(event) => setHeroTitle(event.target.value)} placeholder="Optional title or epithet" maxLength={48} /></label>
                        <label className="form-field"><span>CRAFT</span><input value={craft} onChange={(event) => setCraft(event.target.value)} placeholder="Optional skill or tool" maxLength={48} /></label>
                      </div>
                      <label className="form-field"><span>SKILLS <small>OPTIONAL, SEPARATE WITH COMMAS</small></span><input value={skillsInput} onChange={(event) => setSkillsInput(event.target.value)} placeholder="Teaching, woodworking, sound design..." maxLength={240} /></label>
                      <label className="form-field"><span>PROFILE STORY <small>OPTIONAL, SEPARATE FROM PRIVATE INTRODUCTION</small></span><textarea value={bio} onChange={(event) => setBio(event.target.value)} placeholder="A short note you'd like on your Hero profile." rows={3} maxLength={280} /></label>
                      <button type="button" className="secondary-command" onClick={() => setShowAdvanced(false)}>KEEP IT SIMPLE</button>
                    </>
                  )}
                  <fieldset className="attribute-choice">
                    <legend>CHOOSE A STARTING STRENGTH <small>Pick one to guide your first steps</small></legend>
                    <div className="attribute-options">
                      {ATTRS.map((attribute) => (
                        <button className={focus === attribute.key ? "attribute-option attribute-option--active" : "attribute-option"} type="button" key={attribute.key} aria-pressed={focus === attribute.key} onClick={() => setFocus(attribute.key)}>
                          <span>{attribute.label}</span><small>{attribute.blurb}</small><b>{focus === attribute.key ? "03" : "01"}</b>
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </>
              ) : awakeningStep === "seeking" ? (
                <section className="familiar-seeking" aria-live="polite">
                  <UnformedFamiliar large />
                  <span className="screen-kicker">SOMEWHERE BETWEEN WORLDS</span>
                  <h2>A shape is finding its way to you</h2>
                  <p>The Familiar is following the threads you shared. Its form is still changing.</p>
                  <div className="awakening-clues">{resonanceLabels.map((label) => <span key={label}>{label}</span>)}</div>
                </section>
              ) : (
                <section className="familiar-reveal" aria-live="polite">
                  <div className="awakening-clues">{resonanceLabels.map((label) => <span key={label}>{label}</span>)}</div>
                  <FamiliarPortrait key={selectedFamiliar.id} familiar={selectedFamiliar} mood="curious" />
                  <span className="screen-kicker">FAMILIAR AWAKENED</span>
                  <h2>{selectedFamiliar.species}</h2>
                  <p className="familiar-reveal__temperament">{selectedFamiliar.temperament}</p>
                  <p className="familiar-reveal__reason">I heard you mention {resonanceLabels.map((label) => label.toLowerCase()).join(", ")}. Based on what you chose to share, this Familiar may resonate with your story. It is a possibility to explore, not a judgment about who you are.</p>
                  <blockquote className="familiar-first-words">{selectedFamiliar.id.startsWith("hybrid:") ? "You're difficult to classify. So am I." : "There you are. I wondered what you would be like."}<br />“I don't think I know what I am yet. Maybe we'll figure that out together.”</blockquote>
                  <label className="form-field"><span>GIVE YOUR FAMILIAR A NAME</span><input value={familiarName} onChange={(event) => setFamiliarName(event.target.value)} placeholder="Name your companion" maxLength={24} /></label>
                  <p className="familiar-memory-note"><LockKeyhole size={13} /> Your introduction stays private and is not added to your profile or Hero Card.</p>
                </section>
              )}
            </div>
            <aside className="creation-aside">
              {awakeningStep === "introduction" ? (
                <>
              <div className="avatar-picker">
                <div className="avatar-preview">
                  {avatar ? <img src={avatar} alt="Selected Hero portrait" /> : <UserRound size={43} strokeWidth={1.1} />}
                  <span className="avatar-spark"><Sparkles size={15} /></span>
                </div>
                <label className="upload-command">
                  <Upload size={15} /> ADD PORTRAIT
                  <input type="file" accept="image/*" onChange={handleAvatar} />
                </label>
                <span className="field-help">Optional image, up to 750 KB</span>
                {avatarName && <span className="file-name">{avatarName}</span>}
              </div>
              <fieldset className="privacy-choice">
                <legend>IDENTITY VISIBILITY</legend>
                <div className="privacy-options">
                  <button className={!masked ? "privacy-option privacy-option--active" : "privacy-option"} type="button" aria-pressed={!masked} onClick={() => setMasked(false)}>
                    <Eye size={16} /> VISIBLE
                  </button>
                  <button className={masked ? "privacy-option privacy-option--active" : "privacy-option"} type="button" aria-pressed={masked} onClick={() => setMasked(true)}>
                    <EyeOff size={16} /> MASKED
                  </button>
                </div>
                <p>Your Hero can use an alias. Private identity details are not requested.</p>
              </fieldset>
              <button className="primary-command" type="submit">LET THE FAMILIAR LISTEN <ArrowRight size={17} /></button>
              <p className="form-message" role="status">{creationMessage}</p>
                </>
              ) : awakeningStep === "seeking" ? (
                <div className="familiar-choice-actions familiar-choice-actions--seeking" aria-live="polite">
                  <UnformedFamiliar />
                  <span className="screen-kicker">FOLLOWING YOUR SIGNAL</span>
                  <p>The Familiar is crossing The Between.</p>
                </div>
              ) : (
                <div className="familiar-choice-actions">
                  <button className="primary-command" type="button" onClick={acceptFamiliar}>ACCEPT FAMILIAR <ArrowRight size={17} /></button>
                  <button className="secondary-command" type="button" onClick={exploreAnotherFamiliar}>EXPLORE ANOTHER</button>
                  <button className="secondary-command" type="button" onClick={() => setAwakeningStep("introduction")}>ADD TO MY STORY</button>
                  <p className="form-message" role="status">You choose who walks beside you. Nothing is bound until you accept.</p>
                </div>
              )}
            </aside>
          </form>
        </div>
      </main>
    );
  }

  const level = levelFromXp(hero.xp);
  const rank = rankFor(level);
  const latestCard = hero.cards[hero.cards.length - 1] ?? mintCard(hero, level, []);
  const earnedInLevel = hero.xp - (level - 1) * XP_PER_LEVEL;
  const progressPercent = Math.max(0, Math.min(100, (earnedInLevel / XP_PER_LEVEL) * 100));
  const verifiedQuestCount = hero.quests.filter((quest) => quest.verification === "verified" || quest.verification === "strongly_verified").length;
  const selectedQuest = hero.quests.find((quest) => quest.id === selectedQuestId) ?? null;
  const profileFamiliar = bondedFamiliar;
  const familiarStage = bondedFamiliarStage;

  return (
    <main className="alpha-screen profile-screen">
      <CelestialBackdrop familiar={profileFamiliar} stage={familiarStage} />
      <RosePetalField mode={verifiedQuestCount > 0 ? "milestone" : "ambient"} />
      <header className="alpha-header">
        <button className="icon-command" type="button" onClick={() => setScreen("intro")} aria-label="Back to opening">
          <ArrowLeft size={18} />
        </button>
        <span className="alpha-wordmark">WORLD <i>X</i> HEROES</span>
        <span className="profile-private-label">{hero.ghost ? <><EyeOff size={13} /> MASKED HERO</> : <><Eye size={13} /> VISIBLE HERO</>}</span>
      </header>

      <div className="profile-wrap">
        <button type="button" className="companion-toggle" onClick={() => setCompanionOpen((open) => !open)} aria-label="Toggle Hero Companion">
          <FamiliarPortrait familiar={profileFamiliar} stage={familiarStage} mood={familiarMood} />
          <span>{hero.familiar.name || "Wisp"}<small>YOUR FAMILIAR</small></span>
        </button>

        {companionOpen && (
          <aside className="companion-panel" aria-label="Hero Companion panel">
            <div className="companion-panel__header">
              <FamiliarPortrait familiar={profileFamiliar} stage={familiarStage} mood={familiarMood} />
              <div>
                <span className="screen-kicker">YOUR {profileFamiliar.realm.toUpperCase()} FAMILIAR</span>
                <h3>{hero.familiar.name || "Wisp"}</h3>
                <p>{profileFamiliar.species} · {profileFamiliar.temperament}</p>
              </div>
              <button type="button" className="icon-command" onClick={() => setCompanionOpen(false)} aria-label="Close companion">×</button>
            </div>
            <div className="companion-panel__messages">
              {companionMessages.map((message) => (
                <div key={message.id} className={message.role === "companion" ? "companion-message companion-message--companion" : "companion-message companion-message--hero"}>
                  {message.text}
                </div>
              ))}
            </div>
            <form className="companion-form" onSubmit={handleCompanionSubmit}>
              <textarea value={companionInput} onChange={(event) => setCompanionInput(event.target.value)} rows={3} placeholder="Tell me what happened, what you're learning, or what you want to build..." maxLength={500} />
              <button type="submit" className="primary-command primary-command--submit">SEND TO COMPANION <ArrowRight size={17} /></button>
            </form>
          </aside>
        )}

        <section className="profile-overview">
          <div className="hero-identity">
            <div className="profile-avatar">
              {hero.avatar ? <img src={hero.avatar} alt={`${hero.name}'s portrait`} /> : <span>{initials(hero.name)}</span>}
              <i><Sparkles size={13} /></i>
            </div>
            <div className="hero-identity__text">
              <span className="screen-kicker">YOUR HERO PROFILE</span>
              <h1>{hero.name}</h1>
              {hero.title && <p className="hero-epithet">{hero.title}</p>}
              {hero.bio && <p className="hero-bio">{hero.bio}</p>}
            </div>
          </div>
          <div className="progress-panel">
            <div className="progress-topline">
              <span className="level-number">{String(level).padStart(2, "0")}</span>
              <div><span>LEVEL</span><strong>{rank.name}</strong></div>
              <Award size={26} strokeWidth={1.2} />
            </div>
            <div className="progress-track"><span style={{ width: `${progressPercent}%` }} /></div>
            <div className="progress-foot"><span>{hero.xp} VERIFIED XP</span><span>{XP_PER_LEVEL - earnedInLevel} XP TO NEXT LEVEL</span></div>
            <p className="verified-count"><ShieldCheck size={14} /> {verifiedQuestCount} verified {verifiedQuestCount === 1 ? "achievement" : "achievements"}</p>
          </div>
        </section>

        <div className="profile-grid">
          <section className="profile-panel attributes-panel">
            <div className="panel-heading"><span className="screen-kicker">YOUR FOUNDATION</span><h2>Attributes</h2><FamiliarPortrait familiar={profileFamiliar} stage={familiarStage} mood="curious" scale="section" /></div>
            <div className="attribute-list">
              {ATTRS.map((attribute) => (
                <div className="attribute-row" key={attribute.key}>
                  <div className="attribute-row__heading"><strong>{attribute.label}</strong><span>{hero.attrs[attribute.key]}</span></div>
                  <div className="attribute-track"><span style={{ width: `${Math.min(100, hero.attrs[attribute.key] * 14)}%` }} /></div>
                  <p>{attribute.blurb}</p>
                </div>
              ))}
            </div>
            <div className="skills-block">
              <span className="screen-kicker">RECORDED SKILLS</span>
              {hero.skills.length > 0 ? (
                <div className="skill-list">{hero.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
              ) : <p className="quiet-empty">Your skills will appear here as you record them.</p>}
            </div>
            <div className="merit-block">
              <span className="screen-kicker">AI HERO SUMMARY</span>
              <p className="hero-summary">{hero.summary || generateHeroSummary(hero)}</p>
              <div className="merit-grid">
                {MERIT_CATEGORIES.map((category) => {
                  const total = hero.quests.reduce((sum, quest) => sum + (quest.merit?.categories?.[category.key] ?? 0), 0);
                  return (
                    <div key={category.key} className="merit-pill">
                      <strong>{category.label}</strong>
                      <span>{total}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="card-record">
            <div className="panel-heading"><span className="screen-kicker">A MOMENT IN YOUR JOURNEY</span><h2>Hero Card</h2><FamiliarPortrait familiar={profileFamiliar} stage={familiarStage} scale="section" /></div>
            <HeroCard snapshot={latestCard} />
            <p className="card-note">{generateCardArchetype(hero)} · {hero.name || "Unclaimed Hero"}</p>
          </section>
        </div>

        {selectedQuest && (
          <div className="merit-modal" role="dialog" aria-modal="true" aria-label="AI merit review">
            <div className="merit-modal__backdrop" onClick={() => setSelectedQuestId(null)} />
            <div className="merit-modal__panel">
              <div className="merit-oracle-halo" aria-hidden="true" />
              <div className="merit-modal__header">
                <FamiliarPortrait familiar={profileFamiliar} stage={familiarStage} mood="investigating" scale="section" />
                <div>
                  <span className="screen-kicker">AI MERIT ENGINE</span>
                  <h3>{selectedQuest.title}</h3>
                </div>
                <button type="button" className="icon-command" onClick={() => setSelectedQuestId(null)} aria-label="Close merit review">×</button>
              </div>

              <div className="merit-modal__meta">
                <span>{selectedQuest.category}</span>
                <span>{selectedQuest.verification.toUpperCase().replaceAll("_", " ")}</span>
                <span>{selectedQuest.xp} XP</span>
              </div>

              <p className="merit-modal__summary">{selectedQuest.merit.summary}</p>

              <div className="merit-score-grid">
                {ATTRS.map((attribute) => (
                  <div key={attribute.key} className="merit-score">
                    <div className="merit-score__header">
                      <strong>{attribute.label}</strong>
                      <span>+{selectedQuest.merit.attributes[attribute.key] ?? 0}</span>
                    </div>
                    <div className="merit-score__bar"><span style={{ width: `${Math.min(100, (selectedQuest.merit.attributes[attribute.key] ?? 0) * 8)}%` }} /></div>
                  </div>
                ))}
              </div>

              <div className="merit-category-panel">
                <h4>MERIT CATEGORIES</h4>
                <div className="merit-category-list">
                  {MERIT_CATEGORIES.map((category) => (
                    <div key={category.key} className="merit-category-item">
                      <div className="merit-category-item__header">
                        <strong>{category.label}</strong>
                        <span>{selectedQuest.merit.categories[category.key] ?? 0}</span>
                      </div>
                      <div className="merit-category-item__bar"><span style={{ width: `${Math.min(100, (selectedQuest.merit.categories[category.key] ?? 0) * 10)}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="merit-explain-panel">
                <h4>WHY THIS MERIT WAS AWARDED</h4>
                <p>{selectedQuest.merit.explanation}</p>
              </div>
            </div>
          </div>
        )}

        <section className="achievement-section" id="achievement">
          <div className="achievement-heading">
            <div className="section-title-with-familiar"><FamiliarPortrait familiar={profileFamiliar} stage={familiarStage} mood="investigating" scale="section" /><div><span className="screen-kicker">REAL ACTION. REAL PROOF.</span><h2>First achievement</h2></div></div>
            <span className="pending-count">{hero.quests.length} SUBMITTED</span>
          </div>
          <form className="achievement-form" onSubmit={submitQuest}>
            <div className="achievement-form__fields">
              <label className="form-field">
                <span>WHAT DID YOU DO? <b>*</b></span>
                <input value={questTitle} onChange={(event) => setQuestTitle(event.target.value)} placeholder="Give the accomplishment a clear title" maxLength={80} required />
              </label>
              <div className="field-row">
                <label className="form-field">
                  <span>THE STORY BEHIND IT</span>
                  <textarea value={questDescription} onChange={(event) => setQuestDescription(event.target.value)} placeholder="What did you create, learn, repair, or contribute?" rows={3} maxLength={500} required />
                </label>
                <label className="form-field">
                  <span>MERIT CATEGORY</span>
                  <select value={questCategory} onChange={(event) => setQuestCategory(event.target.value)}>
                    {MERIT_CATEGORIES.map((category) => <option value={category.label} key={category.key}>{category.label} · {category.blurb}</option>)}
                  </select>
                </label>
              </div>
              <div className="field-row">
                <label className="form-field">
                  <span>ATTRIBUTE</span>
                  <select value={questAttribute} onChange={(event) => setQuestAttribute(event.target.value as AttrKey)}>
                    {ATTRS.map((attribute) => <option value={attribute.key} key={attribute.key}>{attribute.label} · {attribute.blurb}</option>)}
                  </select>
                </label>
              </div>
            </div>
            <div className="evidence-column">
              <fieldset className="proof-choice">
                <legend>SUPPORTING EVIDENCE <b>*</b></legend>
                <div className="proof-tabs" role="group" aria-label="Evidence type">
                  <button type="button" className={proofMode === "photo" ? "proof-tab proof-tab--active" : "proof-tab"} aria-pressed={proofMode === "photo"} onClick={() => setProofMode("photo")}><Camera size={15} /> PHOTO</button>
                  <button type="button" className={proofMode === "link" ? "proof-tab proof-tab--active" : "proof-tab"} aria-pressed={proofMode === "link"} onClick={() => setProofMode("link")}><BookOpen size={15} /> LINK</button>
                </div>
                {proofMode === "photo" ? (
                  <label className="proof-upload">
                    <Upload size={18} />
                    <span>{proofName || "Choose a photo"}</span>
                    <small>JPG, PNG, WEBP · up to 1.5 MB</small>
                    <input type="file" accept="image/*" onChange={handleProofFile} />
                  </label>
                ) : (
                  <label className="form-field proof-link-field">
                    <span>EVIDENCE URL</span>
                    <input type="url" value={proofLink} onChange={(event) => setProofLink(event.target.value)} placeholder="https://..." />
                  </label>
                )}
              </fieldset>
              <fieldset className="visibility-choice">
                <legend>RECORD VISIBILITY</legend>
                <div className="privacy-options">
                  <button type="button" className={visibility === "sealed" ? "privacy-option privacy-option--active" : "privacy-option"} aria-pressed={visibility === "sealed"} onClick={() => setVisibility("sealed")}><LockKeyhole size={15} /> SEALED</button>
                  <button type="button" className={visibility === "public" ? "privacy-option privacy-option--active" : "privacy-option"} aria-pressed={visibility === "public"} onClick={() => setVisibility("public")}><Eye size={15} /> PUBLIC</button>
                </div>
              </fieldset>
              <button className="primary-command primary-command--submit" type="submit">SUBMIT FOR REVIEW <ArrowRight size={17} /></button>
              <p className="review-note"><ShieldCheck size={14} /> Evidence is recorded as submitted, never auto-verified.</p>
              <p className="form-message" role="status">{questMessage}</p>
            </div>
          </form>

          {hero.quests.length > 0 ? (
            <div className="achievement-records">
              {hero.quests.map((quest) => <AchievementRecord quest={quest} key={quest.id} onReview={(id) => setSelectedQuestId(id)} />)}
            </div>
          ) : (
            <div className="empty-achievements"><Sparkles size={19} /><p>Your real-world work will begin your progression here.</p></div>
          )}
        </section>

        <section className="diary-section">
          <div className="achievement-heading">
            <div className="section-title-with-familiar"><FamiliarPortrait familiar={profileFamiliar} stage={familiarStage} mood="listening" scale="section" /><div><span className="screen-kicker">PRIVATE HERO JOURNAL</span><h2>Chronicle</h2></div></div>
            <span className="pending-count">{hero.diary.length} ENTRIES</span>
          </div>

          <form className="journal-form" onSubmit={submitJournal}>
            <div className="field-row">
              <label className="form-field">
                <span>JOURNAL TITLE</span>
                <input value={journalTitle} onChange={(event) => setJournalTitle(event.target.value)} placeholder="A reflection, goal, or milestone" maxLength={80} />
              </label>
              <label className="form-field">
                <span>SHARING</span>
                <select value={journalPrivacy} onChange={(event) => setJournalPrivacy(event.target.value as "private" | "profile" | "public")}>
                  <option value="private">KEEP PRIVATE</option>
                  <option value="profile">ADD TO HERO PROFILE</option>
                  <option value="public">SHARE ACHIEVEMENT</option>
                </select>
              </label>
            </div>
            <label className="form-field">
              <span>PRIVATE NOTE</span>
              <textarea value={journalContent} onChange={(event) => setJournalContent(event.target.value)} placeholder="What is the Hero dreaming, learning, building, grieving, or becoming?" rows={4} maxLength={600} />
            </label>
            <button type="submit" className="primary-command primary-command--submit">SAVE PRIVATE JOURNAL ENTRY <ArrowRight size={17} /></button>
          </form>

          <div className="goal-form">
            <label className="form-field">
              <span>GOAL TO QUEST</span>
              <input value={goalInput} onChange={(event) => setGoalInput(event.target.value)} placeholder="I want to learn woodworking and build my first table this year." maxLength={180} />
            </label>
            <button type="button" className="secondary-command" onClick={createQuestFromGoal}>CREATE HERO QUEST</button>
          </div>

          <div className="diary-list">
            {hero.diary.length > 0 ? hero.diary.map((entry) => (
              <article className="diary-entry" key={entry.id}>
                <div className="diary-entry__meta">
                  <span className="diary-kind">{entry.kind.toUpperCase()}</span>
                  <span className="diary-privacy">{entry.privacy.toUpperCase()}</span>
                </div>
                <h3>{entry.title}</h3>
                <p>{entry.content}</p>
              </article>
            )) : <p className="quiet-empty">Your diary will gather reflections, milestones, and discoveries as your Hero journey grows.</p>}
          </div>
        </section>

        <section className="achievement-section">
          <div className="achievement-heading">
            <div className="section-title-with-familiar"><FamiliarPortrait familiar={profileFamiliar} stage={familiarStage} scale="section" /><div><span className="screen-kicker">HERO CARD ARCHIVE</span><h2>Card History</h2></div></div>
            <span className="pending-count">{hero.cards.length} CARD{hero.cards.length === 1 ? "" : "S"}</span>
          </div>
          <div className="card-archive">
            {hero.cards.length > 0 ? hero.cards.map((card) => (
              <article key={card.id} className="archive-card">
                <div className="archive-card__meta"><span>{card.rank}</span><span>LVL {card.level}</span></div>
                <h3>{card.name}</h3>
                <p>{card.title || "Emerging Hero"}</p>
                <div className="archive-card__familiar"><FamiliarPortrait familiar={FAMILIAR_CHOICES.find((choice) => choice.id === card.familiar.id) ?? FAMILIAR_CHOICES[0]} stage={card.familiarStage} scale="card" theme={card.familiarTheme} /><span>{card.familiar.name}</span></div>
                <small>{new Date(card.at).toLocaleDateString()}</small>
              </article>
            )) : <p className="quiet-empty">Your Hero card archive will begin once your first meaningful milestone is reached.</p>}
          </div>
        </section>
      </div>
    </main>
  );
}

function AchievementRecord({ quest, onReview }: { quest: QuestLog; onReview: (id: string) => void }) {
  const status = quest.verification.replaceAll("_", " ").toUpperCase();
  const verified = quest.verification === "verified" || quest.verification === "strongly_verified";
  const evidenceLabels = ["CLAIM ONLY", "SELF-REPORTED", "SUPPORTING MATERIAL", "VERIFIED", "STRONGLY VERIFIED"];
  return (
    <article className="achievement-record">
      {quest.proof.kind === "photo" && <img className="achievement-record__proof" src={quest.proof.src} alt="Submitted evidence" />}
      <div className="achievement-record__body">
        <div className="record-status"><span><ShieldCheck size={14} /> {status}{verified ? "" : " · NOT VERIFIED"}</span><span>{quest.visibility === "sealed" ? <><LockKeyhole size={13} /> SEALED</> : <><Eye size={13} /> PUBLIC</>}</span></div>
        <h3>{quest.title}</h3>
        <p>{quest.description}</p>
        <div className="record-details"><span>{ATTRS.find((attribute) => attribute.key === quest.attr)?.label}</span><span>{quest.category}</span><span>LEVEL {quest.evidenceLevel} · {evidenceLabels[quest.evidenceLevel]}</span><span>{quest.xp ? `${quest.xp} VERIFIED XP` : "XP PENDING REVIEW"}</span></div>
        <div className="merit-breakdown">
          <strong>{ATTRS.find((attribute) => attribute.key === quest.attr)?.label} +{quest.merit.attributes[quest.attr] ?? 0}</strong>
          <button type="button" className="merit-inspect" onClick={() => onReview(quest.id)}>AI MERIT REVIEW</button>
        </div>
        <p className="merit-breakdown__note">{quest.merit.explanation}</p>
        {quest.proof.kind === "link" && <a className="evidence-link" href={quest.proof.src} target="_blank" rel="noreferrer">OPEN SUBMITTED EVIDENCE <ArrowRight size={13} /></a>}
      </div>
    </article>
  );
}

export default App;
