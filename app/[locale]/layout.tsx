import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, Locale } from "@/i18n/request";
import "./globals.css";
import 'leaflet/dist/leaflet.css';
import { Inter, Outfit, Noto_Sans_Devanagari, Noto_Sans_Gujarati, Noto_Sans_Bengali } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const hiFont = Noto_Sans_Devanagari({ subsets: ["devanagari"], variable: "--font-hindi", weight: ["400", "500", "700"] });
const guFont = Noto_Sans_Gujarati({ subsets: ["gujarati"], variable: "--font-gujarati", weight: ["400", "500", "700"] });
const bnFont = Noto_Sans_Bengali({ subsets: ["bengali"], variable: "--font-bengali", weight: ["400", "500", "700"] });

import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { LanguageOnboarding } from "@/components/onboarding/LanguageOnboarding";
import { PageTransition } from "@/components/ui/PageTransition";
import { DemoModeOverlay } from "@/components/ui/DemoModeOverlay";
import { PersistentProgressBar } from "@/components/ui/PersistentProgressBar";
import { UniversalContinueCTA } from "@/components/ui/UniversalContinueCTA";
import { GuidedTourOverlay } from "@/components/ui/GuidedTourOverlay";
import { TrustBadges } from "@/components/ui/TrustBadges";
import { VoiceNavigator } from "@/components/ui/VoiceNavigator";
import { SWRegistration } from "@/components/pwa/SWRegistration";
import { PrivacyConsent } from "@/components/ui/PrivacyConsent";
import { LegalDisclaimer } from "@/components/ui/LegalDisclaimer";
import { ClientLayoutWrapper } from "@/components/layout/ClientLayoutWrapper";

export const metadata = {
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;


  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={`${inter.variable} ${outfit.variable} ${hiFont.variable} ${guFont.variable} ${bnFont.variable}`}>
      <body suppressHydrationWarning className="antialiased selection:bg-primary/30 selection:text-white min-h-screen bg-background">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <PersistentProgressBar />
          <LanguageOnboarding />
          {/* Background Decorative Elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px]" />
          </div>

          <div className="w-full min-h-screen flex relative bg-slate-50/30">
            <Sidebar />
            <ClientLayoutWrapper>
              {children}
            </ClientLayoutWrapper>
            <GuidedTourOverlay />
            <SWRegistration />
            <PrivacyConsent />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
