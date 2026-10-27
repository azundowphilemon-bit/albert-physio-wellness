'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';

export default function FloatingHome() {
  const pathname = usePathname();
  const { t } = useLanguage();

  // Don't show the home button if we are already on the home page
  if (pathname === '/') {
    return null;
  }

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', left: '1.5rem', zIndex: 1000 }}>
      <Link href="/" style={{ 
        background: 'rgba(255,255,255,0.9)', 
        backdropFilter: 'blur(10px)', 
        padding: '0.6rem 1rem', 
        borderRadius: '10px', 
        color: '#0f766e', 
        fontWeight: 'bold', 
        textDecoration: 'none', 
        border: '1px solid #e2e8f0', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.9rem'
      }}>
         🏠 <span style={{ display: 'none' }} className="sm-show">{t.common.home}</span>
      </Link>
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 640px) { .sm-show { display: inline !important; } }
      `}} />
    </div>
  );
}
