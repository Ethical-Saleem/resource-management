// export default defineNuxtPlugin(() => {
//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker
//       .register('/sw.js')
//       .then((registration) => {
//         console.log('Service Worker registered with scope:', registration.scope);
//       })
//       .catch((error) => {
//         console.error('Service Worker registration failed:', error);
//       });
//   }
// });
// export default defineNuxtPlugin(() => {
//   if ('serviceWorker' in navigator) {
//     // Register the service worker
//     navigator.serviceWorker
//       .register('/sw.js', { scope: '/' })  // Ensure the correct scope
//       .then((registration) => {
//         console.log('Service Worker registered with scope:', registration.scope);
//       })
//       .catch((error) => {
//         console.error('Service Worker registration failed:', error);
//       });
    
//     // Optionally: Check if the service worker is already ready
//     navigator.serviceWorker.ready
//       .then((registration) => {
//         console.log('Service Worker is ready:', registration);
//       })
//       .catch((error) => {
//         console.error('Service Worker is not ready:', error);
//       });
//   } else {
//     console.log('Service workers are not supported in this browser.');
//   }
// });