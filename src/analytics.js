// Analytics configuration using Vite environment variables
const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || "G-TNX797RKF7";

if (ENABLE_ANALYTICS) {
  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);
  
  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', GA_TRACKING_ID);
  
  console.log(`🔍 Google Analytics loaded: ${GA_TRACKING_ID}`);
} else {
  console.log('🚫 Google Analytics disabled via environment variables');
}

// Export gtag function for use in components if needed
window.gtag = window.gtag || function() {
  if (ENABLE_ANALYTICS) {
    dataLayer.push(arguments);
  }
};
