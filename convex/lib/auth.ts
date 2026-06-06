import type { UserIdentity } from "convex/server";

import type { MutationCtx, QueryCtx } from "../_generated/server";

type AuthCtx = QueryCtx | MutationCtx;

type AdminAccessResult =
  | { allowed: true; identity: UserIdentity }
  | {
      allowed: false;
      debug: SessionDebugInfo;
      message: string;
    };

export type SessionDebugInfo = {
  configuredAdminEmails: string[];
  configuredAdminUserIds: string[];
  identityEmail: string | null;
  identityName: string | null;
  identitySubject: string | null;
  isAuthenticated: boolean;
};

const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email: string) => email.trim().toLowerCase())
    .filter(Boolean);

const getAdminUserIds = () =>
  (process.env.ADMIN_CLERK_USER_IDS ?? "")
    .split(",")
    .map((userId: string) => userId.trim())
    .filter(Boolean);

const getIdentityEmail = (identity: UserIdentity): string | undefined => {
  if (typeof identity.email === "string" && identity.email.length > 0) {
    return identity.email.toLowerCase();
  }

  const primaryEmail = identity.primary_email_address;

  if (typeof primaryEmail === "string" && primaryEmail.length > 0) {
    return primaryEmail.toLowerCase();
  }

  return undefined;
};

export const getSessionDebugInfo = async (
  ctx: AuthCtx
): Promise<SessionDebugInfo> => {
  const identity = await ctx.auth.getUserIdentity();

  return {
    configuredAdminEmails: getAdminEmails(),
    configuredAdminUserIds: getAdminUserIds(),
    identityEmail: identity ? (getIdentityEmail(identity) ?? null) : null,
    identityName: identity?.name ?? null,
    identitySubject: identity?.subject ?? null,
    isAuthenticated: identity !== null,
  };
};

export const checkAdminAccess = async (
  ctx: AuthCtx
): Promise<AdminAccessResult> => {
  const identity = await ctx.auth.getUserIdentity();
  const debug = await getSessionDebugInfo(ctx);

  if (!identity) {
    return {
      allowed: false,
      debug,
      message:
        "Convex does not see a signed-in user. In Clerk, create a JWT template named convex (Convex preset) or add aud: convex to your session token, then sign out and sign back in.",
    };
  }

  const adminEmails = debug.configuredAdminEmails;
  const adminUserIds = debug.configuredAdminUserIds;

  if (adminEmails.length === 0 && adminUserIds.length === 0) {
    return {
      allowed: false,
      debug,
      message:
        "Admin access is not configured. Set ADMIN_EMAILS and/or ADMIN_CLERK_USER_IDS in your Convex deployment environment variables.",
    };
  }

  const userEmail = getIdentityEmail(identity);
  const emailAllowed = userEmail ? adminEmails.includes(userEmail) : false;
  const userIdAllowed = adminUserIds.includes(identity.subject);

  if (emailAllowed || userIdAllowed) {
    return { allowed: true, identity };
  }

  if (!userEmail && adminEmails.length > 0 && adminUserIds.length === 0) {
    return {
      allowed: false,
      debug,
      message:
        "Convex authenticated your session but no email claim was found. In Clerk Dashboard → Configure → Sessions, add \"email\": \"{{user.primary_email_address}}\" to custom claims, or set ADMIN_CLERK_USER_IDS to your Clerk user ID instead.",
    };
  }

  if (userEmail) {
    return {
      allowed: false,
      debug,
      message: `Signed in as ${userEmail} (Clerk ID: ${identity.subject}), but that account is not listed in ADMIN_EMAILS or ADMIN_CLERK_USER_IDS.`,
    };
  }

  return {
    allowed: false,
    debug,
    message: `Authenticated as Clerk user ${identity.subject}, but that user ID is not listed in ADMIN_CLERK_USER_IDS.`,
  };
};

export async function requireAdmin(ctx: AuthCtx) {
  const access = await checkAdminAccess(ctx);

  if (!access.allowed) {
    throw new Error(access.message);
  }

  return access.identity;
}
