const apiFetch = async (
    endpoint: string,
    options: RequestInit = {},
  ) => {
    const config = useRuntimeConfig();
    const router = useRouter();
    const route = useRoute()
    const apiUrl = `${config.public.apiBase}${endpoint}`;
  
    const response = await fetch(apiUrl, {
      ...options,
      credentials: "include", // include cookies
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  
    if (!response.ok) {
      const error = await response.json();
      if (
        error.statusCode === 401 &&
        route.path !== "/login" &&
        route.path !== "/"
      ) {
        router.push("/401");
      }
      console.log("error", error);
      throw new Error(error.message || "An error occurred");
    }
  
    return response.json();
  };
  
  const postForm = async (
    endpoint: string,
    formData: FormData,
    options: RequestInit = {}
  ) => {
    const config = useRuntimeConfig();
    const apiUrl = `${config.public.apiBase}${endpoint}`;
  
    const response = await fetch(apiUrl, {
      ...options,
      method: "POST",
      credentials: "include", // include cookies
      body: formData,
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "An error occurred");
    }
  
    return response.json();
  };
  
  export const useApi = {
    async get(endpoint: string, options: RequestInit = {}) {
      return apiFetch(endpoint, { ...options, method: "GET" });
    },
    async post(endpoint: string, data: any, options: RequestInit = {}) {
      return apiFetch(endpoint, {
        ...options,
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    async put(endpoint: string, data: any, options: RequestInit = {}) {
      return apiFetch(endpoint, {
        ...options,
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    async del(endpoint: string, options: RequestInit = {}) {
      return apiFetch(endpoint, { ...options, method: "DELETE" });
    },
    async postForm(
      endpoint: string,
      formData: FormData,
      options: RequestInit = {}
    ) {
      return postForm(endpoint, formData, options);
    },
    async login(credentials: { username: string; password: string }) {
      return apiFetch("/Auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
    },
    async logout() {
      return apiFetch("/Auth/logout", {
        method: "POST",
        credentials: "include",
      });
    },
    async getSession() {
      return apiFetch("/Auth");
    },
  };
  