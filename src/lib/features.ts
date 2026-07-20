export const featureFlags = {
  ai: process.env.NEXT_PUBLIC_ENABLE_AI === "true",
  facebook: process.env.NEXT_PUBLIC_ENABLE_FACEBOOK === "true",
  analytics: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
  pwa: process.env.NEXT_PUBLIC_ENABLE_PWA !== "false",
};

export function getSystemStatus() {
  return {
    supabase: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
    admin: Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD),
    analytics: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
    facebook: Boolean(
      process.env.META_FACEBOOK_PAGE_ID &&
        process.env.META_FACEBOOK_PAGE_ACCESS_TOKEN
    ),
    ai: Boolean(process.env.OPENAI_API_KEY),
  };
}
