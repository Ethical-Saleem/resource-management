const _useDashboard = () => {
    const route = useRoute()
    const router = useRouter()
    const isMobileSidebarOpen = ref(false)
    const isNotificationsSlideoverOpen = ref(false)
  
    defineShortcuts({
      'g-h': () => router.push('/'),
      'g-i': () => router.push('/inbox'),
      'g-u': () => router.push('/users'),
      'g-s': () => router.push('/settings'),
      '?': () => isMobileSidebarOpen.value = true,
      'n': () => isNotificationsSlideoverOpen.value = true
    })
  
    watch(() => route.fullPath, () => {
      isMobileSidebarOpen.value = false
      isNotificationsSlideoverOpen.value = false
    },
    { immediate: true })

    watch(() => window.innerWidth, (newWidth) => {
      if (newWidth > 991) {
        isMobileSidebarOpen.value = false
      isNotificationsSlideoverOpen.value = false
      }
    },
    { immediate: true })

    // window.addEventListener('resize', () => {
    //   if (window?.innerWidth > 991) {
    //     isMobileSidebarOpen.value = false
    //   }
    // })
  
    return {
      isMobileSidebarOpen,
      isNotificationsSlideoverOpen
    }
  }
  
  export const useDashboard = createSharedComposable(_useDashboard)
