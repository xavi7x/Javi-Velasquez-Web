export const GTM_ID = 'G-8XX8SZQVV6';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (gaId: string, url: string) => {
  if (typeof window.gtag !== 'function') {
    return;
  }
  window.gtag('config', gaId, {
    page_path: url,
  });
};

type GTagEvent = {
  action: string;
  category: string;
  label: string;
  value: number;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GTagEvent) => {
  if (typeof window.gtag !== 'function') {
    return;
  }
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
