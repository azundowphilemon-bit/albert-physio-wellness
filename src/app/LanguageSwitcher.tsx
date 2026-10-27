'use client';

import React from 'react';
import { useLanguage, LANGUAGES, Language } from '@/lib/i18n';
import { usePathname } from 'next/navigation';

export function FlagIcon({ code, size = 18 }: { code: Language; size?: number }) {
  const height = Math.round(size * 0.72);

  if (code === 'en') {
    // United Kingdom (Union Jack) SVG Flag
    return (
      <svg
        width={size}
        height={height}
        viewBox="0 0 60 30"
        aria-hidden="true"
        style={{
          borderRadius: '3px',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.12)',
          flexShrink: 0,
          display: 'block',
        }}
      >
        <clipPath id="uk-clip">
          <path d="M0,0 v30 h60 v-30 z" />
        </clipPath>
        <g clipPath="url(#uk-clip)">
          <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" strokeWidth="6" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="3.5" />
          <path d="M30,0 v30 M0,15 h60" stroke="#ffffff" strokeWidth="10" />
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
        </g>
      </svg>
    );
  }

  if (code === 'de') {
    // Germany Flag (Black, Red, Gold)
    return (
      <svg
        width={size}
        height={height}
        viewBox="0 0 5 3"
        aria-hidden="true"
        style={{
          borderRadius: '3px',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.12)',
          flexShrink: 0,
          display: 'block',
        }}
      >
        <rect width="5" height="3" y="0" fill="#000000" />
        <rect width="5" height="2" y="1" fill="#DD0000" />
        <rect width="5" height="1" y="2" fill="#FFCE00" />
      </svg>
    );
  }

  // France Flag (Blue, White, Red)
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 3 2"
      aria-hidden="true"
      style={{
        borderRadius: '3px',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.12)',
        flexShrink: 0,
        display: 'block',
      }}
    >
      <rect width="3" height="2" fill="#ED2939" />
      <rect width="2" height="2" fill="#FFFFFF" />
      <rect width="1" height="2" fill="#002395" />
    </svg>
  );
}

export function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language selector"
      className="lang-switcher-pill"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: dark ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9',
        border: dark ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid #cbd5e1',
        borderRadius: '9999px',
        padding: '0.2rem',
        gap: '0.15rem',
        flexShrink: 0,
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
            className={`lang-btn ${active ? 'active' : ''}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.32rem',
              padding: '0.3rem 0.55rem',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              background: active
                ? 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)'
                : 'transparent',
              color: active ? '#ffffff' : dark ? '#e2e8f0' : '#334155',
              boxShadow: active ? '0 2px 6px rgba(13, 148, 136, 0.35)' : 'none',
              transition: 'all 0.18s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <FlagIcon code={item.code} size={18} />
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
        top: '0.85rem',
        right: '0.85rem',
        zIndex: 1200,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '9999px',
        padding: '0.15rem',
        boxShadow: '0 6px 20px rgba(15, 23, 42, 0.12)',
      }}
    >
      <LanguageSwitcher />
    </div>
  );
}
