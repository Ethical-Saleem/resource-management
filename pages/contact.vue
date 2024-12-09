<script setup lang="ts">
import { useApi, useLoadingStore } from '#imports';
import { object, string, array, type InferType } from 'yup'
import type { FormSubmitEvent } from '#ui/types'

const loadingStore = useLoadingStore()
const router = useRouter()

const schema = object({
  companyName: string()
    .optional()
    .max(255, 'Company name cannot exceed 255 characters'),
  address: string()
    .required('Address is required')
    .max(500, 'Address cannot exceed 500 characters'),
  email: string()
    .required('Email is required')
    .email('Invalid email format'),
  telephone: string()
    .required('Telephone is required'),
  city: string().required('City is required'),
  state: string().required('State is required'),
  postalCode: string()
    .optional(),
  tinNo: string()
    .optional()
    .max(20, 'TIN number cannot exceed 20 characters'),
  registrationNo: string()
    .optional()
    .max(20, 'Registration number cannot exceed 20 characters'),
  website: string()
    .optional()
    .url('Invalid URL format'),
  facebookUrl: string()
    .optional(),
  linkedInUrl: string()
    .optional(),
  twitterUrl: string()
    .optional(),
  companySize: string()
    .optional()
    .oneOf(
      ['Small Scale', 'Medium Scale', 'Large Scale'],
      'Company size must be one of: small, medium, large'
    ),
  description: string()
    .optional()
    .max(1000, 'Description cannot exceed 1000 characters'),
  companyGroup: string()
    .optional(),
  resourceInterests: array()
    .of(string().required('Resource interest item is required'))
    .min(1, 'At least one resource interest is required')
    .required('Resource interest is required'),
})

type Schema = InferType<typeof schema>

interface ContactForm {
  companyName: string;
  address: string;
  email: string;
  telephone: string;
  city: string;
  state: string;
  postalCode?: string;
  tinNo?: string;
  registrationNo?: string;
  website?: string;
  facebookUrl?: string;
  linkedInUrl?: string;
  twitterUrl?: string;
  companySize?: string;
  companyDescription?: string;
  companyGroup?: string;
  resourceInterests: Array<string>;
}

const contactForm = reactive<ContactForm>({
  companyName: '',
  address: '',
  email: '',
  telephone: '',
  city: '',
  state: '',
  postalCode: '',
  tinNo: '',
  companyDescription: '',
  resourceInterests: [],
  registrationNo: '',
  website: '',
  facebookUrl: '',
  linkedInUrl: '',
  twitterUrl: '',
  companySize: '',
  companyGroup: '',
})
const companyType = ['Analyzers', 'Dealers', 'Fabricators']
const companySize = [
  'Small Scale', 'Medium Scale', 'Large Scale'
]
const states = ref([])
const resources = ref([])
const apiErrorRes = ref('')
const apiRes = ref<number | null>(null);
const fetching = ref(false);
const loading = ref(false);

const navigateToDashboard = () => {
  router.push('/dashboard');
}

const dispatchSubmitContactForm = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true;
  loadingStore.showLoading();
  if (apiRes.value) {
    apiRes.value = null;
  }
  try {
    const res = await useApi.post('/territory/create-contact-info', event.data);
    console.log('res', res);
    if (res) {
      apiRes.value = 2
      loading.value = false;
      loadingStore.hideLoading();
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log('create-contact-error', error)
    apiRes.value = 1
    apiErrorRes.value = error
    loading.value = false;
    loadingStore.hideLoading();
    throw error;
  }
}

const dispatchFetchStates = async () => {
  fetching.value = true
  try {
    const data = await useApi.get('/territory/fetch-all-states');
    console.log('states', data);
    states.value = data;
    fetching.value = false
  } catch (error) {
    fetching.value = false;
    console.log('fetch-state-error', error);
  }
}

const dispatchFetchResources = async () => {
  fetching.value = true
  try {
    const data = await useApi.get('/resource/fetch-all-resources');
    console.log('resources', data);
    resources.value = data.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
    fetching.value = false
  } catch (error) {
    fetching.value = false;
    console.log('fetch-state-error', error);
  }
}

onMounted(async () => {
  await dispatchFetchStates()
  await dispatchFetchResources()
})
</script>

<template>
  <div>
    <header class="relative h-80 md:h-96 bg-cover bg-center" style="">
      <div class="absolute inset-0 bg-gradient-to-t from-black to-white mix-blend-overlay" />

      <div class="absolute inset-0 flex flex-col justify-between items-center text-center">
        <div class="pt-8">
          <NuxtLink to="/">
            <NuxtImg src="/img/rmrdc.png" class="logo w-20 h-20 md:w-32 md:h-32" alt="Logo" />
          </NuxtLink>
        </div>
        
        <div class="pb-16">
          <h1 class="text-white text-4xl md:text-4xl font-bold">Contact Form</h1>
        </div>
      </div>
    </header>
    <section class="py-16 relative">
      <UForm v-if="!loading && !apiRes || apiRes === 1" :state="contactForm" :schema="schema" class="max-w-xl mx-auto w-full px-8" @submit="dispatchSubmitContactForm">
        <p class="text-lg">
          Kindly fill in the correct details in the field below. Note that all marked fields are compulsory.
        </p>
        <span v-if="apiRes === 1" class="text-sm text-red-500">{{ apiErrorRes }}</span>
        <div class="grid grid-cols-12 gap-4 mt-8">
          <div class="col-span-12">
            <UFormGroup label="Company Name" name="companyName" required>
              <UInput v-model="contactForm.companyName" class="border border-[#242424] rounded-md" />
            </UFormGroup>
          </div>
          <div class="col-span-12 md:col-span-6">
            <UFormGroup label="Email Address" name="email" required>
              <UInput v-model="contactForm.email" type="email" class="border border-[#242424] rounded-md" />
            </UFormGroup>
          </div>
          <div class="col-span-12 md:col-span-6">
            <UFormGroup label="Telephone" name="telephone" required>
              <UInput v-model="contactForm.telephone" class="border border-[#242424] rounded-md" />
            </UFormGroup>
          </div>
          <div class="col-span-12">
            <UFormGroup label="Company Address" name="address" required>
              <UInput v-model="contactForm.address" class="border border-[#242424] rounded-md" />
            </UFormGroup>
          </div>
          <div class="col-span-12 md:col-span-6">
            <UFormGroup label="City" name="city" required>
              <UInput v-model="contactForm.city" class="border border-[#242424] rounded-md" />
            </UFormGroup>
          </div>
          <div class="col-span-12 md:col-span-6">
            <UFormGroup label="State" name="state" required>
              <USelectMenu
                v-model="contactForm.state"
                :options="states"
                option-attribute="name"
                value-attribute="name"
                color="uiearth"
                searchable
                placeholder="Select state"
                />
            </UFormGroup>
          </div>
          <div class="col-span-12 md:col-span-6">
            <UFormGroup label="ZIP / Postal Code" name="zipCode">
              <UInput v-model="contactForm.postalCode" class="border border-[#242424] rounded-md" />
            </UFormGroup>
          </div>
          <div class="col-span-12 md:col-span-6">
            <UFormGroup label="RC Number (CAC)" name="registrationNo">
              <UInput v-model="contactForm.registrationNo" class="border border-[#242424] rounded-md" />
            </UFormGroup>
          </div>
          <div class="col-span-12 md:col-span-6">
            <UFormGroup label="TIN" name="tinNo">
              <UInput v-model="contactForm.tinNo" class="border border-[#242424] rounded-md" />
            </UFormGroup>
          </div>
          <div class="col-span-12 md:col-span-6">
            <UFormGroup label="Company Size" name="companySize">
              <USelectMenu
              v-model="contactForm.companySize"
              :options="companySize"
              color="uiearth"
              searchable
              placeholder="Select your company category"
              />
            </UFormGroup>
          </div>
          <div class="col-span-12 md:col-span-6">
            <UFormGroup label="Company Type" name="companyGroup">
              <USelectMenu
              v-model="contactForm.companyGroup"
              :options="companyType"
              color="uiearth"
              searchable
              placeholder="Select your company category"
              />
            </UFormGroup>
          </div>
          <div class="col-span-12 md:col-span-6">
            <UFormGroup label="Areas of Interest" name="resourceInterests">
              <USelectMenu
              v-model="contactForm.resourceInterests"
              :options="resources"
              option-attribute="name"
              value-attribute="name"
              multiple
              color="uiearth"
              searchable
              placeholder="Select your company category"
              />
            </UFormGroup>
          </div>
          <div class="col-span-12 md:col-span-6">
            <UFormGroup label="Company URL" name="website" hint="(if available)">
              <UInput v-model="contactForm.website" class="border border-[#242424] rounded-md" placeholder="https://www.example.com" />
            </UFormGroup>
          </div>
          <div class="col-span-12 md:col-span-6">
            <UFormGroup label="Facebook URL" name="facebookUrl">
              <UInput v-model="contactForm.facebookUrl" class="border border-[#242424] rounded-md" />
            </UFormGroup>
          </div>
          <div class="col-span-12 md:col-span-6">
            <UFormGroup label="Twitter URL" name="twitterUrl">
              <UInput v-model="contactForm.twitterUrl" class="border border-[#242424] rounded-md" />
            </UFormGroup>
          </div>
          <div class="col-span-12 md:col-span-6">
            <UFormGroup label="LinkedIn URL" name="linkedInUrl">
              <UInput v-model="contactForm.linkedInUrl" class="border border-[#242424] rounded-md" />
            </UFormGroup>
          </div>
          <div class="col-span-12">
            <UFormGroup label="Company Description" name="companyDescription">
              <UTextarea v-model="contactForm.companyDescription" :rows="5" class="border border-[#242424] rounded-md" placeholder="Tell us a bit about your company" />
            </UFormGroup>
          </div>
        </div>
        <div class="w-40 mt-8 ms-auto">
          <UButton label="Submit" color="uiearth" block type="submit" :loading="loading" />
        </div>
      </UForm>
      <div v-if="!loading && apiRes === 2" class="h-full w-full">
        <AlertContainer alert-type="success" :title="'Success'" :description="'Your data has been submitted and saved successfully in our database.'" :action="navigateToDashboard" />
      </div>
    </section>
  </div>
</template>
