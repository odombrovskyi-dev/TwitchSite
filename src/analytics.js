// Analytics configuration using Vite environment variables
const ENABLE_ANALYTICS = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
const GA_TRACKING_ID = "G-TNX797RKF7";

if (ENABLE_ANALYTICS) {
  const loadGtag = () => {
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
  };

  // Defer GTM until after the page has fully loaded, then wait for an
  // idle moment. A bare requestIdleCallback with a multi-second timeout
  // can get force-fired mid-render under CPU/network throttling (the
  // browser never reports idle in time), landing right on top of LCP -
  // waiting for `load` first guarantees GTM never competes with it.
  const scheduleLoadGtag = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadGtag, { timeout: 2000 });
    } else {
      window.setTimeout(loadGtag, 1000);
    }
  };

  if (document.readyState === 'complete') {
    scheduleLoadGtag();
  } else {
    window.addEventListener('load', scheduleLoadGtag, { once: true });
  }
} else {
  console.log('🚫 Google Analytics disabled via environment variables');
}

// Export gtag function for use in components if needed
window.gtag = window.gtag || function() {
  if (ENABLE_ANALYTICS) {
    dataLayer.push(arguments);
  }
};
