export type SocialProviderId = "instagram" | "facebook" | "bigo-live" | "youtube" | "tiktok" | "twitch" | "x";
export type ConnectionProviderId = SocialProviderId | "email";
export type SocialMetric = "likes" | "reactions" | "comments" | "shares" | "followers_gained" | "views" | "live_minutes" | "live_participation" | "pk_participation" | "pk_result" | "creator_activity";
export type SocialEventStatus = "pending" | "verified" | "rejected";
export type AccountConnectionState = "not_connected" | "connecting" | "connected" | "connection_error" | "in_development";

export type AccountConnectionDefinition = {
  id: ConnectionProviderId;
  name: string;
  authorization: "official_oauth" | "email_verification";
  state: "available" | "in_development";
  currentDataUse: "none";
  plannedData: readonly string[];
  plannedContribution: string;
  unavailableReason: string;
};

export type ConnectionBackendContract = {
  listConnections: () => Promise<ConnectedSocialAccount[]>;
  beginOAuth: (provider: Exclude<ConnectionProviderId, "email">, returnUrl: string) => Promise<{ authorizationUrl: string; state: string }>;
  completeOAuth: (provider: Exclude<ConnectionProviderId, "email">, code: string, state: string) => Promise<ConnectedSocialAccount>;
  disconnect: (accountId: string) => Promise<void>;
  sendEmailVerification: (email: string) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<{ verified: boolean }>;
};

export const ACCOUNT_CONNECTIONS: readonly AccountConnectionDefinition[] = [
  { id: "bigo-live", name: "BIGO LIVE", authorization: "official_oauth", state: "in_development", currentDataUse: "none", plannedData: [], plannedContribution: "No activity or engagement contributes today.", unavailableReason: "Approved BIGO authorization/API access and a secure backend are not configured." },
  { id: "instagram", name: "Instagram", authorization: "official_oauth", state: "in_development", currentDataUse: "none", plannedData: [], plannedContribution: "No activity or engagement contributes today.", unavailableReason: "Meta app credentials, permission approval, and a secure backend are not configured." },
  { id: "facebook", name: "Facebook", authorization: "official_oauth", state: "in_development", currentDataUse: "none", plannedData: [], plannedContribution: "No activity or engagement contributes today.", unavailableReason: "Meta app credentials, permission approval, and a secure backend are not configured." },
  { id: "email", name: "EMAIL", authorization: "email_verification", state: "in_development", currentDataUse: "none", plannedData: [], plannedContribution: "Email verification does not award XP.", unavailableReason: "World X Heroes account authentication and email delivery are not configured." },
];

export type SocialProviderDefinition = {
  id: SocialProviderId;
  name: string;
  status: "coming_soon" | "not_supported";
  authorization: "official_oauth_only";
  supportedMetrics: readonly SocialMetric[];
  note: string;
  manualReviewAvailable: true;
};

export type ConnectedSocialAccount = {
  id: string;
  provider: SocialProviderId;
  status: "connected" | "disconnected";
  authorizationStatus?: "server_verified" | "local_unverified";
  providerAccountId?: string;
  displayName?: string;
  authorizedScopes: string[];
  connectedAt: number;
  disconnectedAt?: number;
  lastSyncedAt?: number;
};

export type SocialActivityEvent = {
  id: string;
  provider: SocialProviderId;
  accountId: string;
  externalEventId: string;
  metric: SocialMetric;
  value: number;
  occurredAt: number;
  synchronizedAt: number;
  status: SocialEventStatus;
  verificationSource?: "official_api" | "manual_review";
  impactAwarded: number;
  xpAwarded: number;
};

export type SocialImpactRule = {
  impactPerUnit: number;
  unitsPerAward: number;
  maxImpactPerEvent: number;
};

export type SocialImpactPolicy = {
  version: string;
  enabled: boolean;
  xpConversionEnabled: boolean;
  xpPerImpact: number;
  maxImpactPerUtcDay: number;
  rules: Partial<Record<SocialMetric, SocialImpactRule>>;
};

export const SOCIAL_IMPACT_POLICY: SocialImpactPolicy = {
  version: "unconfigured",
  enabled: false,
  xpConversionEnabled: false,
  xpPerImpact: 0,
  maxImpactPerUtcDay: 0,
  rules: {},
};

export const CONNECTED_WORLDS: readonly SocialProviderDefinition[] = [
  { id: "instagram", name: "Instagram", status: "coming_soon", authorization: "official_oauth_only", supportedMetrics: [], note: "Only metrics permitted through official Meta APIs and approved scopes can be considered.", manualReviewAvailable: true },
  { id: "facebook", name: "Facebook", status: "coming_soon", authorization: "official_oauth_only", supportedMetrics: [], note: "Eligible data depends on official Meta permissions and the connected account type.", manualReviewAvailable: true },
  { id: "bigo-live", name: "BIGO LIVE", status: "coming_soon", authorization: "official_oauth_only", supportedMetrics: [], note: "Live and PK activity requires an authorized BIGO API or partnership. No scraping or password collection.", manualReviewAvailable: true },
  { id: "youtube", name: "YouTube", status: "coming_soon", authorization: "official_oauth_only", supportedMetrics: [], note: "Metrics will be limited to data exposed by authorized YouTube APIs.", manualReviewAvailable: true },
  { id: "tiktok", name: "TikTok", status: "coming_soon", authorization: "official_oauth_only", supportedMetrics: [], note: "Metrics will be limited to data exposed by authorized TikTok APIs.", manualReviewAvailable: true },
  { id: "twitch", name: "Twitch", status: "coming_soon", authorization: "official_oauth_only", supportedMetrics: [], note: "Creator and live metrics require approved Twitch authorization scopes.", manualReviewAvailable: true },
  { id: "x", name: "X", status: "coming_soon", authorization: "official_oauth_only", supportedMetrics: [], note: "Metrics will be limited to data exposed by authorized X APIs.", manualReviewAvailable: true },
];

export type SocialImpactEvaluation = {
  acceptedEventIds: string[];
  duplicateEventIds: string[];
  unverifiedEventIds: string[];
  impact: number;
  xp: number;
  policyVersion: string;
};

export type SocialImpactHistory = {
  externalIds: ReadonlySet<string>;
  events: readonly SocialActivityEvent[];
};

export function evaluateSocialImpact(
  events: readonly SocialActivityEvent[],
  history: SocialImpactHistory,
  policy: SocialImpactPolicy = SOCIAL_IMPACT_POLICY,
): SocialImpactEvaluation {
  const result: SocialImpactEvaluation = {
    acceptedEventIds: [],
    duplicateEventIds: [],
    unverifiedEventIds: [],
    impact: 0,
    xp: 0,
    policyVersion: policy.version,
  };
  if (!policy.enabled) return result;

  const localIds = new Set(history.externalIds);
  const dailyTotals = new Map<string, number>();
  for (const event of history.events) {
    if (event.status !== "verified" || !Number.isFinite(event.occurredAt)) continue;
    const day = new Date(event.occurredAt).toISOString().slice(0, 10);
    dailyTotals.set(day, (dailyTotals.get(day) ?? 0) + Math.max(0, event.impactAwarded));
    localIds.add(`${event.provider}:${event.accountId}:${event.externalEventId}`);
  }
  const uniqueEvents = [...events].sort((left, right) => left.occurredAt - right.occurredAt);

  for (const event of uniqueEvents) {
    const externalId = `${event.provider}:${event.accountId}:${event.externalEventId}`;
    if (localIds.has(externalId)) {
      result.duplicateEventIds.push(event.id);
      continue;
    }
    if (event.status !== "verified" || !event.verificationSource || !Number.isFinite(event.value) || event.value <= 0 || !Number.isFinite(event.occurredAt)) {
      result.unverifiedEventIds.push(event.id);
      continue;
    }

    const rule = policy.rules[event.metric];
    if (!rule || rule.unitsPerAward <= 0 || rule.maxImpactPerEvent <= 0) continue;

    const day = new Date(event.occurredAt).toISOString().slice(0, 10);
    const dayTotal = dailyTotals.get(day) ?? 0;
    const remainingDailyImpact = Math.max(0, policy.maxImpactPerUtcDay - dayTotal);
    const rawImpact = Math.floor(event.value / rule.unitsPerAward) * rule.impactPerUnit;
    const awardedImpact = Math.min(rule.maxImpactPerEvent, remainingDailyImpact, Math.max(0, rawImpact));
    localIds.add(externalId);
    result.acceptedEventIds.push(event.id);
    dailyTotals.set(day, dayTotal + awardedImpact);
    result.impact += awardedImpact;
  }

  result.xp = policy.xpConversionEnabled ? Math.floor(result.impact * Math.max(0, policy.xpPerImpact)) : 0;
  return result;
}
