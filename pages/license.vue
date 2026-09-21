<script setup lang="ts">
definePageMeta({ layout: false });
useHead({ title: "Licence" });

const { status, refresh, unlock, daysRemaining } = useLicenseStatus();

const key = ref("");
const submitting = ref(false);
const error = ref("");

onMounted(refresh);

const submit = async () => {
  if (!key.value.trim()) return;
  submitting.value = true;
  error.value = "";
  try {
    const res = await unlock(key.value.trim());
    if (res?.success) {
      await navigateTo("/dashboard");
    } else {
      error.value = res?.message || "That key wasn't accepted.";
    }
  } catch {
    error.value = "Couldn't reach the server. Try again in a moment.";
  } finally {
    submitting.value = false;
  }
};
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-uimuted-50 px-4">
    <div class="w-full max-w-md rounded-2xl border border-uimuted-200 bg-white p-8 shadow-sm">
      <div class="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-uigreen-600">
        <UIcon name="i-heroicons-key-20-solid" class="h-5 w-5 text-white" />
      </div>

      <template v-if="status?.unlocked">
        <h1 class="text-xl font-extrabold text-uimuted-950">Licence active</h1>
        <p class="mt-2 text-sm text-uimuted-500">This installation is fully licensed.</p>
        <UButton to="/dashboard" class="mt-6" color="uigreen" block>Go to dashboard</UButton>
      </template>

      <template v-else>
        <h1 class="text-xl font-extrabold text-uimuted-950">
          {{ status?.locked ? "Access is suspended" : "Enter licence key" }}
        </h1>
        <p class="mt-2 text-sm leading-relaxed text-uimuted-500">
          <template v-if="status?.locked">
            The evaluation period for this installation has ended. Enter the licence key
            to restore access. Your data has not been touched and will be available
            immediately.
          </template>
          <template v-else>
            This installation is available for {{ daysRemaining ?? "…" }} more
            {{ daysRemaining === 1 ? "day" : "days" }}. Entering the licence key now removes
            the time limit permanently.
          </template>
        </p>

        <form class="mt-6 flex flex-col gap-3" @submit.prevent="submit">
          <UInput
            v-model="key"
            type="password"
            autocomplete="off"
            placeholder="Licence key"
            size="lg"
            :disabled="submitting"
          />
          <p v-if="error" class="text-[13px] text-red-600" role="alert">{{ error }}</p>
          <UButton type="submit" color="uigreen" size="lg" block :loading="submitting">
            Unlock
          </UButton>
        </form>
        <p class="mt-4 text-xs text-uimuted-400">
          Don't have a key? Contact your provider once the licence is settled.
        </p>
      </template>
    </div>
  </div>
</template>
