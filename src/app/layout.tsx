import type { Metadata } from 'next';
import './globals.css';
import FloatingHome from './FloatingHome';
import ClinicConcierge from './ClinicConcierge';
import { LanguageProvider } from '@/lib/i18n';
import { FloatingLanguageSwitcher } from './LanguageSwitcher';

export const metadata: Metadata = {
  metadataBase: new URL('https://acoor-clinic.vercel.app'),
  title: 'ACOOR | Africa Clinic of Osteopathy and Rehabilitation',
  description: 'ACOOR: Africa Clinic of Osteopathy and Rehabilitation. German Still Academy faculty-led osteopathic medicine, physical therapy, occupational therapy (Ergotherapie), speech therapy & international medical advisory.',
  openGraph: {
    title: 'ACOOR | Africa Clinic of Osteopathy and Rehabilitation',
    description: 'Faculty-led osteopathy, multidisciplinary rehabilitation, and international hospital coordination in Ghana.',
    url: 'https://acoor-clinic.vercel.app',
    siteName: 'ACOOR',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://acoor-clinic.vercel.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <FloatingHome />
          <FloatingLanguageSwitcher />
          <ClinicConcierge />
          {children}
          <footer>
            &copy; {new Date().getFullYear()} ACOOR - Africa Clinic of Osteopathy and Rehabilitation.
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
