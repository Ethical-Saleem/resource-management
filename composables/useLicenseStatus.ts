export interface LicenseStatus {
  enabled: boolean;
  locked: boolean;
  unlocked: boolean;
  graceEndsAt: string | null;
}

/**
 * Licence state from the API's always-reachable /license/status endpoint.
 * `enabled` is false when the deployment has no licence key configured
 * (local dev, or a fully paid-up install) — the banner and lock page stay
 * out of the way in that case.
 */
export const useLicenseStatus = () => {
  const config = useRuntimeConfig();
  const status = useState<LicenseStatus | null>("license-status", () => null);

  const refresh = async () => {
    try {
      status.value = await $fetch<LicenseStatus>(
        `${config.public.apiBase}/license/status`,
      );
    } catch {
      // Status is advisory; a failure must never break the page.
    }
    return status.value;
  };

  const unlock = async (key: string) => {
    const res = await $fetch<{ success: boolean; message?: string }>(
      `${config.public.apiBase}/license/unlock`,
      { method: "POST", body: { key }, ignoreResponseError: true },
    );
    if (res?.success) await refresh();
    return res;
  };

  const daysRemaining = computed(() => {
    const end = status.value?.graceEndsAt;
    if (!end) return null;
    return Math.max(0, Math.ceil((new Date(end).getTime() - Date.now()) / 864e5));
  });

  return { status, refresh, unlock, daysRemaining };
};
