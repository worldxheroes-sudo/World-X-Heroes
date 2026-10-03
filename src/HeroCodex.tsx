import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, BookOpen, X } from "lucide-react";
import { ACCOUNT_CONNECTIONS, SOCIAL_IMPACT_POLICY } from "../wxh/social-integrations";
import { RANKS, SELF_ATTESTED_XP_DAILY_CAP, XP_PER_LEVEL } from "../wxh/hero-store";

type HeroCodexProps = {
  xp: number;
  level: number;
  rank: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type CodexChapter = {
  title: string;
  eyebrow: string;
  introduction: string;
  content: ReactNode;
};

function CodexBullets({ items }: { items: string[] }) {
  return <ul className="codex-bullets">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export function HowItWorks() {
  const steps = [
    ["CREATE YOUR HERO", "Choose a name, optional portrait, strengths, interests, and goals."],
    ["BUILD YOUR HERO CARD", "Your local card reflects the identity and progression recorded in this prototype."],
    ["RECORD A QUEST", "Describe real work and attach a photo or evidence link."],
    ["EARN MERIT-BASED XP", "Pending quests earn no XP. Self-attested completions use a limited local reward."],
    ["LEVEL UP", `${XP_PER_LEVEL} XP moves a Hero to the next level.`],
    ["ADVANCE YOUR RANK", "Your rank follows your level using the published progression bands."],
    ["COMPLETE ACHIEVEMENTS", "Keep evidence-backed work in your Hero journey and review its merit breakdown."],
    ["TAKE ON CHALLENGES", "Local pass-and-play X-Matches are available here; online matchmaking is coming soon."],
    ["BUILD YOUR LEGEND", "Your actions update your points, attributes, level, and milestone card history."],
  ];

  return (
    <section className="how-it-works" id="how-it-works" aria-labelledby="how-it-works-title">
      <div className="how-it-works__heading">
        <span className="landing-eyebrow">YOUR JOURNEY, STEP BY STEP</span>
        <h2 id="how-it-works-title">HOW WORLD X HEROES WORKS</h2>
      </div>
      <ol className="how-it-works__steps">
        {steps.map(([title, description], index) => (
          <li className="how-it-works__step" key={title}>
            <span className="how-it-works__number">{String(index + 1).padStart(2, "0")}</span>
            <div><h3>{title}</h3><p>{description}</p></div>
          </li>
        ))}
      </ol>
      <p className="how-it-works__note">This is a local prototype. Independent verification, connected social accounts, and online multiplayer are not active.</p>
    </section>
  );
}

export function HeroCodex({ xp, level, rank, open, onOpenChange }: HeroCodexProps) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [turn, setTurn] = useState<"forward" | "backward">("forward");
  const socialStatus = SOCIAL_IMPACT_POLICY.enabled ? "configured" : "not configured";
  const chapters: CodexChapter[] = [
    {
      title: "The Beginning",
      eyebrow: "CHAPTER I · WHY THIS WORLD EXISTS",
      introduction: "The person is not a blank character sheet. The person is the Hero.",
      content: <>
        <p>World X Heroes connects real skills, creativity, goals, accomplishments, and contribution to a personal Hero identity. The current prototype keeps that identity on this device.</p>
        <blockquote>THE HUMAN IS THE CHARACTER.<br />The world does not define your starting point. You define your legend.</blockquote>
        <p>Progress is meant to recognize what a person does and becomes, not popularity or a purchased rank.</p>
      </>,
    },
    {
      title: "The Hero",
      eyebrow: "CHAPTER II · IDENTITY",
      introduction: "Your Hero is shaped by what you choose to share.",
      content: <>
        <p>Create an alias, optionally add a portrait, record skills, and describe interests or goals. These details help form your local profile, Familiar-light preview, and Hero Card.</p>
        <h3>Visible and Masked</h3>
        <p>Visible or Masked changes the identity label in this local prototype. There is no public multi-user service here, so it does not control a server-side audience. Your Hero data is saved in this browser on this device.</p>
        <p>Google, Apple, email login, and external account authentication are not implemented.</p>
      </>,
    },
    {
      title: "The Hero Card",
      eyebrow: "CHAPTER III · YOUR IDENTITY IN THE WORLD",
      introduction: "A Hero Card is a snapshot of the journey you have recorded.",
      content: <>
        <p>The current card uses your chosen name, portrait when provided, title, rank, attributes, skills, and Familiar-light identity.</p>
        <p>A new local card snapshot is created when self-attested progression crosses a level boundary. AI-generated artwork, automatic card art evolution, and physical cards are not connected.</p>
        <p>Card details come from your saved Hero record; unsubmitted accomplishments do not appear as earned achievements.</p>
      </>,
    },
    {
      title: "The Point System",
      eyebrow: "CHAPTER IV · XP AND MERIT",
      introduction: "XP is never free. Every reward needs a reason.",
      content: <>
        <p>Quest XP is computed from the current merit breakdown: difficulty, originality, impact, and completion. Saving a quest for review gives no XP. In this local prototype, a player may explicitly self-attest completion; those rewards are labeled as self-attested, not independently verified.</p>
        <div className="codex-rule-grid"><div><span>XP PER LEVEL</span><strong>{XP_PER_LEVEL}</strong></div><div><span>SELF-ATTESTED DAILY LIMIT</span><strong>{SELF_ATTESTED_XP_DAILY_CAP} XP</strong></div><div><span>YOUR CURRENT XP</span><strong>{xp}</strong></div><div><span>CURRENT LEVEL</span><strong>{level} · {rank}</strong></div></div>
        <p>Likes and followers currently award no XP. Social Impact conversion is {socialStatus}; no external engagement value is active.</p>
      </>,
    },
    {
      title: "The Proof",
      eyebrow: "CHAPTER V · CLAIMED AND VERIFIED",
      introduction: "A claim is a report. Verification is a separate decision.",
      content: <>
        <h3>CLAIMED / SUBMITTED</h3><p>A quest saved with evidence is a submitted claim. Photos and links can be stored locally, but the prototype has no independent reviewer or server-side verification.</p>
        <h3>SELF-ATTESTED</h3><p>You may explicitly attest that you completed a quest. It can grant merit-based XP under the daily cap, but the record remains labeled as player-attested, not independently verified.</p>
        <h3>VERIFIED</h3><p>Independent verification is not available in this prototype. Do not treat a self-attestation as independent proof.</p>
      </>,
    },
    {
      title: "The Connections",
      eyebrow: "CHAPTER VI · CONNECTED WORLDS",
      introduction: "External accounts will only be used through supported, authorized integrations. All current connections are still in development.",
      content: <>
        <p>World X Heroes does not request or store third-party passwords. No platform currently authorizes an account or synchronizes activity in this app. Each service needs official authorization and its own supported permissions.</p>
        <ul className="codex-provider-list">{ACCOUNT_CONNECTIONS.map((connection) => <li key={connection.id}><span>{connection.name}<small>{connection.authorization === "official_oauth" ? "Official OAuth only" : "Email verification"}</small></span><strong>{connection.state === "available" ? "AVAILABLE" : "CONNECTION IN DEVELOPMENT"}</strong><p>{connection.unavailableReason}</p></li>)}</ul>
        <p>BIGO engagement verification is coming soon. Until an approved API or partnership exists, World X Heroes cannot read BIGO IDs, likes, PK activity, followers, or other engagement.</p>
      </>,
    },
    {
      title: "The Engagement",
      eyebrow: "CHAPTER VII · SOCIAL IMPACT",
      introduction: "Reach is one possible signal, never a measure of human worth.",
      content: <>
        <p>External engagement is not currently imported or rewarded. Likes, views, follows, creator activity, and live events do not grant XP in this prototype.</p>
        <div className="codex-rule-grid"><div><span>XP PER LIKE</span><strong>{SOCIAL_IMPACT_POLICY.enabled && SOCIAL_IMPACT_POLICY.rules.likes ? `${SOCIAL_IMPACT_POLICY.rules.likes.impactPerUnit} IMPACT` : "NOT CONFIGURED"}</strong></div><div><span>SOCIAL XP CONVERSION</span><strong>{SOCIAL_IMPACT_POLICY.xpConversionEnabled ? "ENABLED" : "DISABLED"}</strong></div></div>
        <p>Any future system must validate eligible activity, deduplicate events, and use visible, changeable rules. Artificial engagement is not legitimate contribution.</p>
      </>,
    },
    {
      title: "The Journey",
      eyebrow: "CHAPTER VIII · LEVELS AND RANKS",
      introduction: "Every {XP_PER_LEVEL} XP adds one level in the current progression model.",
      content: <>
        <p>Your current position is Level {level}, {rank}. Rank comes from your level; ranks cannot be purchased.</p>
        <ol className="codex-rank-list">{RANKS.map((item) => <li key={item.name}><span>{item.name}</span><strong>{item.min.toLocaleString()}–{item.max.toLocaleString()}</strong></li>)}</ol>
        <p>A level-up can snapshot a new local Hero Card. Rank evolution artwork and unlockable game worlds are future systems.</p>
      </>,
    },
    {
      title: "The Challenges",
      eyebrow: "CHAPTER IX · X-MATCH",
      introduction: "A challenge should show its objective, rules, deadline, and scoring before play.",
      content: <>
        <p>The current X-Match Arena is local pass-and-play: it records opponent name, challenge type, objective, rules, end time, round notes, and score on this device.</p>
        <p>It does not connect online, independently validate a result, or award XP. Online matchmaking, validated competitions, and challenge rewards are coming soon.</p>
      </>,
    },
    {
      title: "The Hero Code",
      eyebrow: "CHAPTER X · HOW WE TREAT EACH OTHER",
      introduction: "A stronger world is built with respect and honest play.",
      content: <CodexBullets items={[
        "Treat people with respect. Harassment, threats, hate, and targeted abuse are not acceptable.",
        "Do not impersonate another person or expose private information without permission.",
        "Do not fabricate accomplishments, forge proof, buy engagement, or manipulate counters.",
        "Do not exploit bugs or interfere with another Hero's records or challenge.",
        "Be clear about what is claimed, self-attested, and independently verified.",
        "Report harmful behavior and use only evidence you have permission to share.",
      ]} />,
    },
    {
      title: "The Future World",
      eyebrow: "CHAPTER XI · DESTINATIONS IN DEVELOPMENT",
      introduction: "The current Hero identity is designed to travel into future World X Heroes experiences.",
      content: <>
        <div className="codex-coming-soon"><span>COMING SOON</span><h3>WORLD X HEROES RPG</h3><p>You and your friends battle as yourselves. Future plans include Hero teams, cooperative levels, monsters, shared objectives, and team-versus-team events.</p><p>Weekly, monthly, and seasonal competitions could award team payouts based on validated results. Scoring and rewards are not yet designed or active.</p></div>
        <CodexBullets items={["AI Familiar: coming soon beyond the temporary living-light preview.", "Official social integrations: coming soon; no account data syncs now.", "Team battles, validated reward payouts, and expanded card evolution: coming soon.", "My Point History: coming soon; this prototype has no independent verification ledger.", "Creator merchandise: coming soon; there is no store or checkout." ]} />
      </>,
    },
  ];
  const currentChapter = chapters[chapterIndex];

  function changeChapter(nextIndex: number, direction: "forward" | "backward") {
    if (nextIndex < 0 || nextIndex >= chapters.length) return;
    setTurn(direction);
    setChapterIndex(nextIndex);
  }

  return (
    <section className="hero-codex" id="codex" aria-labelledby="hero-codex-title">
      <div className="hero-codex__intro">
        <span className="landing-eyebrow">THE GUIDE TO THE WORLD OF WORLD X HEROES</span>
        <h2 id="hero-codex-title">The Hero's Codex</h2>
        <p>Rules, progression, and the future of the world in one place.</p>
      </div>
      <button className="codex-artifact" type="button" onClick={() => onOpenChange(true)} aria-label="Open The Hero's Codex">
        <span className="codex-artifact__spine" />
        <span className="codex-artifact__crest">X</span>
        <span className="codex-artifact__title">THE HERO'S<br />CODEX</span>
        <span className="codex-artifact__subtitle">WORLD X HEROES</span>
        <BookOpen className="codex-artifact__mark" size={20} strokeWidth={1.3} />
        <span className="codex-artifact__glow" />
      </button>
      <p className="hero-codex__caption">CLICK THE BOOK TO OPEN THE GUIDE</p>

      {open && (
        <div className="codex-overlay" role="dialog" aria-modal="true" aria-label="The Hero's Codex">
          <button className="codex-overlay__backdrop" type="button" onClick={() => onOpenChange(false)} aria-label="Close Codex" />
          <section className="codex-reader" aria-labelledby="codex-chapter-title">
            <header className="codex-reader__header">
              <div><span className="landing-eyebrow">OFFICIAL WORLD X HEROES GUIDE</span><h2>THE HERO'S CODEX</h2></div>
              <button type="button" className="codex-close" onClick={() => onOpenChange(false)} aria-label="Close the Codex"><X size={19} /></button>
            </header>
            <div className="codex-reader__body">
              <nav className="codex-contents" aria-label="Codex table of contents">
                <span className="codex-contents__label">TABLE OF CONTENTS</span>
                {chapters.map((chapter, index) => <button key={chapter.title} type="button" className={index === chapterIndex ? "codex-contents__item codex-contents__item--active" : "codex-contents__item"} onClick={() => changeChapter(index, index > chapterIndex ? "forward" : "backward")}><span>{String(index + 1).padStart(2, "0")}</span>{chapter.title}</button>)}
              </nav>
              <article className={`codex-page codex-page--${turn}`} key={chapterIndex}>
                <span className="codex-page__eyebrow">{currentChapter.eyebrow}</span>
                <h1 id="codex-chapter-title">{currentChapter.title}</h1>
                <p className="codex-page__intro">{currentChapter.introduction.replace("{XP_PER_LEVEL}", String(XP_PER_LEVEL))}</p>
                <div className="codex-page__content">{currentChapter.content}</div>
                <footer className="codex-page__footer"><span>WORLD X HEROES · THE HERO'S CODEX</span><span>{String(chapterIndex + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")}</span></footer>
              </article>
            </div>
            <footer className="codex-reader__controls">
              <button type="button" className="codex-turn" onClick={() => changeChapter(chapterIndex - 1, "backward")} disabled={chapterIndex === 0}><ArrowLeft size={16} /> PREVIOUS</button>
              <span>{chapterIndex + 1} of {chapters.length}</span>
              <button type="button" className="codex-turn" onClick={() => changeChapter(chapterIndex + 1, "forward")} disabled={chapterIndex === chapters.length - 1}>NEXT <ArrowRight size={16} /></button>
            </footer>
          </section>
        </div>
      )}
    </section>
  );
}
