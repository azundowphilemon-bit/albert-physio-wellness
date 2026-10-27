import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About ACOOR | Africa Clinic of Osteopathy and Rehabilitation',
  description: 'Learn about ACOOR, the 5 pillars of osteopathy, our Still Academy German faculty leadership, our global hospital network, and multidisciplinary rehabilitation.',
};

export default function AboutPage() {
  return <AboutClient />;
}
