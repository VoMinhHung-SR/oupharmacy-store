/** Shared cookie names for BFF auth (middleware + route handlers). */
export const AUTH_ACCESS_COOKIE = 'ouph_at'
export const AUTH_REFRESH_COOKIE = 'ouph_rt'

/** Access ~12h (align with BE OAUTH2_ACCESS_LIFETIME_SEC). */
export const AUTH_ACCESS_MAX_AGE_SEC = 12 * 60 * 60

/** Refresh default 30d — override with OAUTH2_REFRESH_MAX_AGE_SEC if needed. */
export const AUTH_REFRESH_MAX_AGE_SEC = 30 * 24 * 60 * 60
