import posthog from "posthog-js";

export const identifyUser = (
    identifier?: string,
    user?: { name?: string; email?: string },
    setOnce?: Record<string, string | number>
  ) => {
    posthog.identify(identifier, {
      name: user?.name,
      email: user?.email,
      $set_once: setOnce,
    });
  };