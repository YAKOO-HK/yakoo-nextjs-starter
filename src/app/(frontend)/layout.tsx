import Script from 'next/script';
import { CookieBanner } from '@/components/CookieBanner';
import { BackToTopButton } from '@/components/layout/BackToTopButton';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Main } from '@/components/layout/Main';
import { MyAccountDropdown } from '@/components/layout/MyAccountDropdown';
import { SkipToMain } from '@/components/layout/SkipToMain';
import { env } from '@/env';

function GoogleAnalytics() {
  if (!env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID) {
    return null;
  }
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', '${env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID}');
`}
      </Script>
    </>
  );
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleAnalytics />
      <SkipToMain />
      <Header>
        <MyAccountDropdown />
      </Header>
      <Main>{children}</Main>
      <BackToTopButton />
      <Footer />
      <CookieBanner />
    </>
  );
}
