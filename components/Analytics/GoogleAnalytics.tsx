'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

// Replace with your Google Analytics measurement ID
const GA_MEASUREMENT_ID = 'G-Z6LX81SPD0';

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && window.gtag) {
      // Send page view event when pathname changes
      window.gtag('event', 'page_view', {
        page_path: pathname,
        page_title: document.title,
      });
    }
  }, [pathname]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              page_title: document.title,
            });
          `,
        }}
      />
    </>
  );
}