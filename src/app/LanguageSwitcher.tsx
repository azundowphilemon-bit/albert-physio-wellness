'use client';

import React from 'react';
import { useLanguage, LANGUAGES } from '@/lib/i18n';
import { usePathname } from 'next/navigation';

export function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language selector"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: dark ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9',
        border: dark ? '1px solid rgba(255, 255, 255, 0.16)' : '1px solid #cbd5e1',
        borderRadius: '9999px',
        padding: '0.2rem',
        gap: '0.15rem',
      }}
    >
      {LANGUAGES.map((item) => {
        const active = lang === item.code;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLang(item.code)}
            title={item.fullName}
            aria-pressed={active}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.28rem',
              padding: '0.3rem 0.6rem',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.76rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              background: active
                ? 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)'
                : 'transparent',
              color: active ? '#ffffff' : dark ? '#cbd5e1' : '#475569',
              boxShadow: active ? '0 2px 6px rgba(13, 148, 136, 0.3)' : 'none',
              transition: 'all 0.18s ease',
            }}
          >
            <span style={{ fontSize: '0.88rem', lineHeight: 1 }}>{item.flag}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function FloatingLanguageSwitcher() {
  const pathname = usePathname();
  // Pages that already render LanguageSwitcher in their top navbar
  const navbarPages = ['/', '/about', '/dashboard'];
  if (navbarPages.includes(pathname)) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '1.1rem',
        right: '1.25rem',
        zIndex: 1050,
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(10px)',
        borderRadius: '9999px',
        padding: '0.2rem',
        boxShadow: '0 6px 18px rgba(15, 23, 42, 0.08)',
      }}
    >
      <LanguageSwitcher />
    </div>
  );
}
