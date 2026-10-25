import type { Metadata } from 'next';
import './globals.css';
import FloatingHome from './FloatingHome';
import ClinicConcierge from './ClinicConcierge';

export const metadata: Metadata = {
  title: 'ACOOR | Africa Clinic of Osteopathy and Rehabilitation',
  description: 'ACOOR: Africa Clinic of Osteopathy and Rehabilitation. German Still Academy faculty-led osteopathic medicine, physical therapy, occupational therapy (Ergotherapie), speech therapy & international medical advisory.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <FloatingHome />
        <ClinicConcierge />
        {children}
        <footer>
          &copy; {new Date().getFullYear()} ACOOR - Africa Clinic of Osteopathy and Rehabilitation. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
