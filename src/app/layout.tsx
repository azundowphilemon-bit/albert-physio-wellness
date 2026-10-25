import type { Metadata } from 'next';
import './globals.css';
import FloatingHome from './FloatingHome';
import ClinicConcierge from './ClinicConcierge';

export const metadata: Metadata = {
  title: 'Albert Physio & Wellness | Book an Appointment',
  description: 'Premium physiotherapy and wellness clinic. Book your appointment online.',
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
          &copy; {new Date().getFullYear()} Albert Physio & Wellness. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
