import type { Metadata } from 'next';
import './globals.css';
import FloatingHome from './FloatingHome';
import ClinicConcierge from './ClinicConcierge';

export const metadata: Metadata = {
  title: 'ACOOR | Africa Clinic of Osteopathy and Rehabilitation',
  description: 'ACOOR: Africa Clinic of Osteopathy and Rehabilitation. Directed by Dr. Albert (Still Academy Germany). Osteopathy, Physical Therapy, Ergotherapy, Speech Therapy & International Medical Advisory.',
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
