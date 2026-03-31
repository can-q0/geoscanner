import { PostHog } from "posthog-node";

let _client: PostHog | null = null;

export function getPostHogClient(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  if (!key || !host) return null;

  if (!_client) {
    _client = new PostHog(key, {
      host,
      flushAt: 1,
      flushInterval: 0,
    });
  }

  return _client;
}
