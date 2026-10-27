'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage, Language } from '@/lib/i18n';

interface ChatAction {
  label: string;
  href: string;
  isExternal?: boolean;
  type?: 'primary' | 'whatsapp' | 'secondary' | 'map';
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  action?: ChatAction;
  suggestions?: string[];
  isEmergency?: boolean;
}

export default function ClinicConcierge() {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: t.concierge.welcomeText,
      time: t.concierge.justNow,
      suggestions: t.concierge.initialSuggestions,
    },
  ]);

  // Update the initial welcome message automatically when the user changes language if they haven't chatted yet
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [
          {
            id: 'welcome',
            sender: 'bot',
            text: t.concierge.welcomeText,
            time: t.concierge.justNow,
            suggestions: t.concierge.initialSuggestions,
          },
        ];
      }
      return prev;
    });
  }, [lang, t.concierge]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const getBotResponse = (userInput: string, currentLang: Language): Omit<Message, 'id' | 'sender' | 'time'> => {
    const q = userInput.toLowerCase().trim();

    // 1. Emergency Red-Flag Triage
    if (
      q.includes('chest pain') ||
      q.includes('heart') ||
      q.includes('stroke') ||
      q.includes('cannot breathe') ||
      q.includes("can't breathe") ||
      q.includes('paralysis') ||
      q.includes('cannot walk') ||
      q.includes("can't walk") ||
      q.includes('bleeding') ||
      q.includes('fainted') ||
      q.includes('emergency') ||
      q.includes('notfall') ||
      q.includes('herzinfarkt') ||
      q.includes('schlaganfall') ||
      q.includes('atemnot') ||
      q.includes('urgence') ||
      q.includes('avc') ||
      q.includes('cardiaque') ||
      q.includes('respirer')
    ) {
      if (currentLang === 'de') {
        return {
          text: '⚠️ DRINGENDER MEDIZINISCHER HINWEIS:\n\nBei akuten schweren Traumata, Gefühlsverlust in Gliedmaßen, Brustschmerzen oder plötzlichen neurologischen Ausfällen begeben Sie sich bitte sofort in eine Notaufnahme oder wählen Sie den Notruf.\n\nUnsere ambulante Klinik ist auf nicht-notfallmäßige Rehabilitation spezialisiert.',
          isEmergency: true,
          action: { label: 'Notruf wählen (112)', href: 'tel:112', type: 'secondary' },
          suggestions: ['Welche Behandlungen bieten Sie an?', 'Wo befindet sich die Klinik?'],
        };
      }
      if (currentLang === 'fr') {
        return {
          text: '⚠️ AVIS MÉDICAL URGENT :\n\nEn cas de traumatisme aigu grave, de perte de sensibilité d’un membre, de douleur thoracique ou de symptômes neurologiques soudains, veuillez vous rendre immédiatement aux urgences ou appeler les secours.\n\nNotre clinique ambulatoire est dédiée à la rééducation non urgente.',
          isEmergency: true,
          action: { label: 'Appeler les Urgences (112)', href: 'tel:112', type: 'secondary' },
          suggestions: ['Quels soins proposez-vous ?', 'Où se trouve la clinique ?'],
        };
      }
      return {
        text: '⚠️ URGENT MEDICAL ADVISORY:\n\nIf you are experiencing severe acute trauma, loss of limb sensation, chest pain, or sudden loss of bowel/bladder control, please proceed immediately to an emergency hospital department or call local emergency services.\n\nOur outpatient physiotherapy clinic is designed for non-emergency musculoskeletal rehabilitation.',
        isEmergency: true,
        action: { label: 'Call Emergency Hospital', href: 'tel:112', type: 'secondary' },
        suggestions: ['What non-emergency services do you offer?', 'Where is your clinic located?'],
      };
    }

    // Password Recovery & Account Access
    if (
      q.includes('forgot password') ||
      q.includes('reset password') ||
      q.includes('change password') ||
      q.includes('cannot login') ||
      q.includes("can't login") ||
      q.includes('password') ||
      q.includes('passwort') ||
      q.includes('kennwort') ||
      q.includes('mot de passe')
    ) {
      if (currentLang === 'de') {
        return {
          text: '🔑 **Passwort zurücksetzen & Kontowiederherstellung:**\n\nWenn Sie Ihr Passwort vergessen haben:\n1. Öffnen Sie unsere Seite **Passwort vergessen**.\n2. Geben Sie Ihre registrierte E-Mail-Adresse ein.\n3. Klicken Sie auf den sicheren Link in Ihrem Posteingang, um ein neues Passwort zu wählen.',
          action: { label: '🔑 Passwort jetzt zurücksetzen', href: '/forgot-password', type: 'primary' },
          suggestions: ['Wie buche ich einen Termin?', 'Wo ist die Klinik?', 'WhatsApp-Chat'],
        };
      }
      if (currentLang === 'fr') {
        return {
          text: '🔑 **Réinitialisation du mot de passe :**\n\nSi vous avez oublié votre mot de passe :\n1. Accédez à notre page **Mot de passe oublié**.\n2. Saisissez votre adresse e-mail enregistrée.\n3. Ouvrez le lien sécurisé envoyé par e-mail pour définir un nouveau mot de passe.',
          action: { label: '🔑 Réinitialiser mon mot de passe', href: '/forgot-password', type: 'primary' },
          suggestions: ['Comment prendre rendez-vous ?', 'Où se trouve la clinique ?', 'Discuter sur WhatsApp'],
        };
      }
      return {
        text: '🔑 **Password Reset & Account Recovery:**\n\nIf you have forgotten your password or cannot access your patient dashboard:\n\n1. Go to our **Forgot Password** portal.\n2. Enter your registered email address.\n3. Open the secure reset link sent to your inbox to choose a new password.\n\n*Tip:* If you do not see the email within 2 minutes, please check your Spam/Junk folder.',
        action: { label: '🔑 Reset Your Password Now', href: '/forgot-password', type: 'primary' },
        suggestions: ['How do I book an appointment?', 'Where is the clinic located?', 'Contact Reception on WhatsApp'],
      };
    }

    // A. About ACOOR & Clinical Leadership
    if (
      q.includes('about') ||
      q.includes('who is albert') ||
      q.includes('leadership') ||
      q.includes('director') ||
      q.includes('faculty') ||
      q.includes('still academy') ||
      q.includes('biography') ||
      q.includes('background') ||
      q.includes('acoor') ||
      q.includes('über') ||
      q.includes('fakultät') ||
      q.includes('à propos') ||
      q.includes('faculté')
    ) {
      if (currentLang === 'de') {
        return {
          text: '🏛️ **Über ACOOR & Klinische Leitung:**\n\n**ACOOR** (Africa Clinic of Osteopathy and Rehabilitation) wurde von **Albert Nana Yaw Ntekoh** gegründet, der sein Studium der Osteopathischen Medizin in Deutschland absolvierte und als **Dozent und klinischer Ausbilder an der renommierten Still Academy in Deutschland** tätig ist.\n\nACOOR bringt erstklassige europäische Osteopathie-Standards, multidisziplinäre Rehabilitation und internationale Klinikberatung direkt nach Afrika.',
          action: { label: '📖 Über Uns & Klinikphilosophie lesen', href: '/about', type: 'primary' },
          suggestions: ['Was ist Osteopathie?', '4 Reha-Abteilungen', 'Globale Klinikberatung', 'Termin buchen'],
        };
      }
      if (currentLang === 'fr') {
        return {
          text: "🏛️ **À propos d'ACOOR & Direction Clinique :**\n\n**ACOOR** (Africa Clinic of Osteopathy and Rehabilitation) a été fondée par **Albert Nana Yaw Ntekoh**, diplômé en Médecine Ostéopathique en Allemagne et **Conférencier et Instructeur Clinique à la prestigieuse Still Academy en Allemagne**.\n\nACOOR apporte les standards européens d'ostéopathie, la rééducation pluridisciplinaire et la coordination hospitalière internationale aux patients en Afrique.",
          action: { label: '📖 Découvrir ACOOR & Notre Philosophie', href: '/about', type: 'primary' },
          suggestions: ["Qu'est-ce que l'Ostéopathie ?", '4 Départements de Rééducation', 'Conseil Hospitalier Mondial', 'Prendre RDV'],
        };
      }
      return {
        text: '🏛️ **About ACOOR & Clinical Leadership:**\n\n**ACOOR** (Africa Clinic of Osteopathy and Rehabilitation) was founded by **Albert Nana Yaw Ntekoh**, who completed medical education in Osteopathic Medicine in Germany and is an appointed **Lecturer and Clinical Instructor at the renowned Still Academy in Germany**—one of Europe’s leading osteopathic academic institutions.\n\nACOOR was founded to bring world-class European osteopathic standards, multidisciplinary rehabilitation, and international hospital coordination directly to patients in Africa.',
        action: { label: '📖 Read About Us & Clinical Philosophy', href: '/about', type: 'primary' },
        suggestions: ['What is Osteopathy?', 'The 5 Pillars of Osteopathy', 'Global Hospital Advisory', 'Book a Consultation'],
      };
    }

    // B. What is Osteopathy & The 5 Pillars
    if (
      q.includes('osteopath') ||
      q.includes('pillar') ||
      q.includes('säule') ||
      q.includes('pilier') ||
      q.includes('ostéopath')
    ) {
      if (currentLang === 'de') {
        return {
          text: '🩺 **Was ist Osteopathie?**\nDie Osteopathie ist eine evidenzbasierte, ganzheitliche Medizinwissenschaft, die das Zusammenspiel von Struktur und Funktion des Körpers behandelt und die natürliche Selbstheilung aktiviert.\n\n🏛️ **Die 5 Säulen der Osteopathie:**\n1. **Biomechanisches Modell (Parietal):** Gelenke, Wirbelsäule, Haltung & Faszien.\n2. **Neurologisches Modell:** Regulierung des zentralen & autonomen Nervensystems.\n3. **Respiratorisch-Zirkulatorisches Modell:** Durchblutung & Lymphfluss.\n4. **Metabolisch-Viszerales Modell:** Mobilität der inneren Organe & Stoffwechsel.\n5. **Biopsychosoziales Modell:** Kraniosakrale Balance & Stressabbau.',
          action: { label: '📖 Die 5 Säulen der Osteopathie entdecken', href: '/about', type: 'primary' },
          suggestions: ['4 Reha-Abteilungen', 'Über ACOOR & Fakultät', 'Termin buchen'],
        };
      }
      if (currentLang === 'fr') {
        return {
          text: "🩺 **Qu'est-ce que l'Ostéopathie ?**\nL'ostéopathie est une science médicale holistique fondée sur les preuves qui traite l'interconnexion entre la structure et la fonction du corps afin de restaurer la mobilité et l'auto-guérison.\n\n🏛️ **Les 5 Piliers de l'Ostéopathie :**\n1. **Modèle Biomécanique (Pariétal) :** Articulations, rachis, posture & fascias.\n2. **Modèle Neurologique :** Équilibre du système nerveux et apaisement de la douleur.\n3. **Modèle Respiratoire & Circulatoire :** Flux artériel et drainage lymphatique.\n4. **Modèle Métabolique & Viscéral :** Mobilité des organes internes & vitalité.\n5. **Modèle Biopsychosocial :** Harmonie crânio-sacrée & équilibre corps-esprit.",
          action: { label: "📖 Explorer les 5 Piliers de l'Ostéopathie", href: '/about', type: 'primary' },
          suggestions: ['4 Départements de Rééducation', 'À propos d’ACOOR & Faculté', 'Prendre RDV'],
        };
      }
      return {
        text: '🩺 **What is Osteopathy?**\nOsteopathy is an evidence-informed holistic medical science focusing on the interconnection between the body’s structure and function. Rather than merely masking symptoms, it restores mobility and natural self-healing.\n\n🏛️ **The 5 Pillars of Osteopathy:**\n1. **Biomechanical Model (Parietal):** Joint articulation, spine, posture & fascial mobility.\n2. **Neurological Model:** Regulating central & autonomic nervous pathways; calming pain reflexes.\n3. **Respiratory & Circulatory Model:** Optimizing arterial supply and lymphatic drainage.\n4. **Metabolic & Visceral Model:** Internal organ mobility, digestion & cellular vitality.\n5. **Biopsychosocial Model:** Craniosacral harmony, stress release & mind-body balance.',
        action: { label: '📖 Explore 5 Pillars & Who is an Osteopath', href: '/about', type: 'primary' },
        suggestions: ['4 Rehabilitation Departments', 'Still Academy Faculty Background', 'Book a Consultation'],
      };
    }

    // C. Global Hospital Advisory (Treatment Abroad)
    if (
      q.includes('hospital') ||
      q.includes('abroad') ||
      q.includes('global') ||
      q.includes('mission') ||
      q.includes('germany') ||
      q.includes('europe') ||
      q.includes('travel') ||
      q.includes('second opinion') ||
      q.includes('klinikberatung') ||
      q.includes('deutschland') ||
      q.includes('zweitmeinung') ||
      q.includes('mondial') ||
      q.includes('hospitalier') ||
      q.includes('allemagne') ||
      q.includes('deuxième avis')
    ) {
      if (currentLang === 'de') {
        return {
          text: '🌐 **Unsere Globale Klinikberatung:**\n\nEin zentraler Bestandteil der Mission von ACOOR ist die Verbindung von Patienten mit weltweit führenden Kliniken.\n\nÜber unser Netzwerk mit Spitzen-Universitätskliniken und orthopädischen Chirurgen in **Deutschland, der Schweiz und Großbritannien** bieten wir:\n• Ärztliche Zweitmeinungen zu MRT-Befunden & OP-Indikationen\n• Direkte medizinische Koordination für Spezialoperationen im Ausland\n• Nahtlose präoperative Vorbereitung und postoperative Reha in Accra.',
          action: {
            label: '💬 Anfrage zur Klinikberatung per WhatsApp',
            href: 'https://wa.me/49123456789?text=Hallo%20ACOOR,%20ich%20m%C3%B6chte%20mich%20%C3%BCber%20die%20internationale%20Klinikberatung%20informieren',
            isExternal: true,
            type: 'whatsapp',
          },
          suggestions: ['Über ACOOR & Fakultät', 'Post-OP Rehabilitation', 'Termin buchen'],
        };
      }
      if (currentLang === 'fr') {
        return {
          text: '🌐 **Notre Conseil Hospitalier Mondial :**\n\nUn pilier central de la mission d’ACOOR est de connecter les patients aux meilleures institutions médicales du monde.\n\nGrâce à notre réseau de cliniques universitaires et de chirurgiens orthopédistes en **Allemagne, en Suisse et au Royaume-Uni**, nous proposons :\n• Un deuxième avis médical expert sur vos IRM et indications chirurgicales\n• Une coordination médicale directe pour des interventions spécialisées à l’étranger\n• Une préparation préopératoire et une rééducation post-opératoire complète à Accra.',
          action: {
            label: '💬 Contacter le Conseil Hospitalier sur WhatsApp',
            href: 'https://wa.me/49123456789?text=Bonjour%20ACOOR,%20je%20souhaite%20me%20renseigner%20sur%20le%20Conseil%20Hospitalier%20International',
            isExternal: true,
            type: 'whatsapp',
          },
          suggestions: ['À propos d’ACOOR', 'Rééducation Post-Chirurgicale', 'Prendre RDV'],
        };
      }
      return {
        text: '🌐 **Our Global Hospital Advisory:**\n\nA core pillar of ACOOR’s mission is connecting African patients with the world’s leading medical institutions.\n\nThrough ACOOR’s clinical network with top university clinics and orthopedic surgeons across **Germany, Switzerland, and the UK**, we provide:\n• Expert second opinions on MRI scans & surgery recommendations\n• Direct medical coordination for specialized operations abroad\n• Seamless pre-surgery preparation and post-surgical rehabilitation back home in Accra.',
        action: {
          label: '💬 Inquire About Hospital Advisory via WhatsApp',
          href: 'https://wa.me/49123456789?text=Hello%20ACOOR,%20I%20would%20like%20to%20inquire%20about%20your%20International%20Hospital%20Advisory',
          isExternal: true,
          type: 'whatsapp',
        },
        suggestions: ['About ACOOR', 'Post-Surgery Rehabilitation', 'Book a Consultation'],
      };
    }

    // D. Multidisciplinary Rehabilitation
    if (
      q.includes('rehab') ||
      q.includes('ergotherapie') ||
      q.includes('ergotherapy') ||
      q.includes('occupational') ||
      q.includes('logopadie') ||
      q.includes('logopädie') ||
      q.includes('speech') ||
      q.includes('swallowing') ||
      q.includes('abteilung') ||
      q.includes('rééducation') ||
      q.includes('ergothérapie') ||
      q.includes('orthophonie') ||
      q.includes('département')
    ) {
      if (currentLang === 'de') {
        return {
          text: '🏥 **Multidisziplinäre Rehabilitation bei ACOOR:**\n\nWir bieten 4 integrierte Fachabteilungen:\n\n1. **Physiotherapie:** Manuelle Gelenkmobilisation, Sport-Reha, Wirbelsäulendekompression & Elektrotherapie.\n2. **Ergotherapie:** Feinmotorik, Handrehabilitation, Schlaganfall-Reha & Alltagsunabhängigkeit.\n3. **Logopädie (Sprachtherapie):** Behandlung von Sprach-, Stimm-, Sprech- und Schluckstörungen (Dysphagie).\n4. **Postoperative Spezialnachsorge:** Strukturierte Genesung nach Gelenkersatz und Wirbelsäulen-OPs.',
          action: { label: '📖 Alle Reha-Abteilungen ansehen', href: '/about#rehabilitation', type: 'primary' },
          suggestions: ['Post-OP-Reha buchen', 'Manuelle Therapie', 'WhatsApp-Chat'],
        };
      }
      if (currentLang === 'fr') {
        return {
          text: '🏥 **Rééducation Pluridisciplinaire chez ACOOR :**\n\nNous disposons de 4 départements cliniques intégrés :\n\n1. **Kinésithérapie (Physiotherapie) :** Mobilisation articulaire manuelle, réathlétisation sportive, décompression vertébrale & électrothérapie.\n2. **Ergothérapie :** Motricité fine, rééducation de la main, récupération post-AVC & autonomie quotidienne.\n3. **Orthophonie (Logopädie) :** Traitement des troubles de la parole, de la voix et de la déglutition (dysphagie).\n4. **Soins Post-Chirurgicaux Spécialisés :** Suivi structuré après prothèse articulaire et chirurgie du rachis.',
          action: { label: '📖 Voir Tous les Services de Rééducation', href: '/about#rehabilitation', type: 'primary' },
          suggestions: ['Réserver Suivi Post-Op', 'Thérapie Manuelle', 'Discuter sur WhatsApp'],
        };
      }
      return {
        text: '🏥 **Multidisciplinary Rehabilitation at ACOOR:**\n\nWe provide 4 integrated clinical departments:\n\n1. **Physical Therapy (Physiotherapie):** Manual joint mobilization, sports rehab, spinal decompression & electrotherapy.\n2. **Occupational Therapy (Ergotherapie):** Regaining fine motor control, hand rehabilitation, stroke recovery & ergonomic independence.\n3. **Speech & Language Therapy (Logopädie):** Treatment for speech, voice, communication, and swallowing disorders (dysphagia).\n4. **Post-Surgical Specialized Care:** Structured recovery following orthopedic joint replacements and spine surgeries.',
        action: { label: '📖 View All Rehabilitation Services', href: '/about#rehabilitation', type: 'primary' },
        suggestions: ['Book Post-Surgery Care', 'Manual Therapy', 'Chat with ACOOR on WhatsApp'],
      };
    }

    // 9. Pricing, Fees & Deposit
    if (
      q.includes('price') ||
      q.includes('cost') ||
      q.includes('fee') ||
      q.includes('how much') ||
      q.includes('deposit') ||
      q.includes('ghs') ||
      q.includes('rate') ||
      q.includes('pay') ||
      q.includes('preis') ||
      q.includes('kosten') ||
      q.includes('anzahlung') ||
      q.includes('gebühr') ||
      q.includes('tarif') ||
      q.includes('prix') ||
      q.includes('coût') ||
      q.includes('acompte')
    ) {
      if (currentLang === 'de') {
        return {
          text: '💰 **Unsere transparente Preisübersicht:**\n\n• **Umfassende Behandlungssitzung:** 300 GHS (45–60 Min. 1-zu-1 mit zertifiziertem Spezialisten)\n• **Online-Anzahlung:** 90 GHS (30 % zur verbindlichen Reservierung Ihres Termins)\n• **Restbetrag:** 210 GHS zahlbar vor Ort in der Klinik.',
          action: { label: '📅 Jetzt Termin buchen (90 GHS Anzahlung)', href: '/book', type: 'primary' },
          suggestions: ['Akzeptieren Sie Krankenversicherungen?', 'Wo ist die Klinik in Pokuasi?', 'WhatsApp-Chat'],
        };
      }
      if (currentLang === 'fr') {
        return {
          text: '💰 **Nos tarifs transparents :**\n\n• **Consultation & Séance Complète :** 300 GHS (45–60 min en individuel avec un spécialiste certifié)\n• **Acompte de Réservation en Ligne :** 90 GHS (30 % pour bloquer votre créneau)\n• **Solde Restant :** 210 GHS à régler sur place lors de votre rendez-vous.',
          action: { label: '📅 Réserver un Créneau (Acompte 90 GHS)', href: '/book', type: 'primary' },
          suggestions: ['Acceptez-vous les assurances ?', 'Où se trouve la clinique ?', 'Discuter sur WhatsApp'],
        };
      }
      return {
        text: 'Here is our transparent pricing:\n\n• **Comprehensive Session:** 300 GHS (45–60 min 1-on-1 with Certified Specialist)\n• **Online Booking Deposit:** 90 GHS (30% to reserve your exact Google Calendar slot)\n• **Remaining Balance:** 210 GHS paid at the clinic during your appointment.',
        action: { label: '📅 Book Slot Now (90 GHS Deposit)', href: '/book', type: 'primary' },
        suggestions: ['Do you accept health insurance?', 'Where is the clinic in Pokuasi?', 'Chat on WhatsApp'],
      };
    }

    // 11. Location, Address, Directions
    if (
      q.includes('location') ||
      q.includes('where') ||
      q.includes('address') ||
      q.includes('pokuasi') ||
      q.includes('accra') ||
      q.includes('map') ||
      q.includes('park') ||
      q.includes('direction') ||
      q.includes('wo ') ||
      q.includes('standort') ||
      q.includes('adresse') ||
      q.includes('où')
    ) {
      if (currentLang === 'de') {
        return {
          text: '📍 **Standort der Klinik:**\nACOOR befindet sich in **Pokuasi, Accra, Ghana**.\n\nUnsere Klinik ist bequem erreichbar und verfügt über sichere Patientenparkplätze direkt vor Ort.',
          action: { label: '🗺️ In Google Maps öffnen', href: 'https://maps.google.com/?q=Pokuasi,+Accra,+Ghana', isExternal: true, type: 'map' },
          suggestions: ['Wie sind Ihre Öffnungszeiten?', 'Preise & Anzahlung?', 'Termin buchen'],
        };
      }
      if (currentLang === 'fr') {
        return {
          text: '📍 **Adresse de la Clinique :**\nACOOR est située à **Pokuasi, Accra, Ghana**.\n\nLa clinique est facilement accessible et dispose d’un parking privé et sécurisé pour tous nos patients.',
          action: { label: '🗺️ Ouvrir dans Google Maps', href: 'https://maps.google.com/?q=Pokuasi,+Accra,+Ghana', isExternal: true, type: 'map' },
          suggestions: ['Quels sont vos horaires ?', 'Tarifs & Acompte ?', 'Prendre RDV'],
        };
      }
      return {
        text: '📍 **Clinic Location:**\nACOOR (Africa Clinic of Osteopathy & Rehabilitation) is located in **Pokuasi, Accra, Ghana**.\n\nWe are conveniently accessible with dedicated, secure on-site parking for all our patients.',
        action: { label: '🗺️ Open in Google Maps', href: 'https://maps.google.com/?q=Pokuasi,+Accra,+Ghana', isExternal: true, type: 'map' },
        suggestions: ['What are your opening hours?', 'What treatments do you offer?', 'Book an appointment'],
      };
    }

    // 12. Opening Hours
    if (
      q.includes('hour') ||
      q.includes('open') ||
      q.includes('close') ||
      q.includes('time') ||
      q.includes('saturday') ||
      q.includes('sunday') ||
      q.includes('öffnungszeit') ||
      q.includes('uhrzeit') ||
      q.includes('horaire') ||
      q.includes('ouvert')
    ) {
      if (currentLang === 'de') {
        return {
          text: '⏰ **Öffnungszeiten der Klinik:**\n\n• **Montag – Donnerstag:** 08:00 – 18:00 Uhr\n• **Freitag:** 08:00 – 15:00 Uhr\n• **Samstag & Sonntag:** Geschlossen *(dringende Post-OP-Termine nach Vereinbarung)*\n\nOnline-Buchungen sind rund um die Uhr möglich!',
          action: { label: '📅 Freie Termine ansehen', href: '/book', type: 'primary' },
          suggestions: ['Wo befindet sich die Klinik?', 'Preise & Anzahlung?'],
        };
      }
      if (currentLang === 'fr') {
        return {
          text: '⏰ **Horaires de la Clinique :**\n\n• **Lundi – Jeudi :** 08h00 – 18h00\n• **Vendredi :** 08h00 – 15h00\n• **Samedi & Dimanche :** Fermé *(suivis post-opératoires urgents sur rendez-vous)*\n\nVous pouvez réserver votre créneau 24h/24 en ligne !',
          action: { label: '📅 Voir les Disponibilités', href: '/book', type: 'primary' },
          suggestions: ['Où se trouve la clinique ?', 'Tarifs & Acompte ?'],
        };
      }
      return {
        text: '⏰ **Clinic Hours:**\n\n• **Monday – Thursday:** 08:00 – 18:00\n• **Friday:** 08:00 – 15:00\n• **Saturday & Sunday:** Closed *(urgent post-op follow-ups by prior arrangement)*\n\nYou can book appointments 24/7 directly through our real-time calendar!',
        action: { label: '📅 View Real-Time Availability', href: '/book', type: 'primary' },
        suggestions: ['Where is the clinic?', 'How much does a session cost?'],
      };
    }

    // 16. WhatsApp / Human Contact
    if (
      q.includes('whatsapp') ||
      q.includes('chat') ||
      q.includes('talk') ||
      q.includes('speak') ||
      q.includes('call') ||
      q.includes('phone') ||
      q.includes('human') ||
      q.includes('reception') ||
      q.includes('doctor') ||
      q.includes('albert') ||
      q.includes('kontakt') ||
      q.includes('telefon') ||
      q.includes('contacter') ||
      q.includes('téléphone')
    ) {
      if (currentLang === 'de') {
        return {
          text: 'Sie erreichen unser ACOOR-Empfangsteam direkt per WhatsApp oder Telefon:\n\n• **WhatsApp:** Direktchat\n• **Telefon:** +49 123 456 789\n• **E-Mail:** info@albert-physio.de',
          action: {
            label: '💬 WhatsApp öffnen (+49 123 456 789)',
            href: 'https://wa.me/49123456789?text=Hallo%20ACOOR,%20ich%20habe%20eine%20Frage%20zu%20Ihren%20Leistungen',
            isExternal: true,
            type: 'whatsapp',
          },
          suggestions: ['Online-Termin buchen', 'Standort & Öffnungszeiten'],
        };
      }
      if (currentLang === 'fr') {
        return {
          text: 'Vous pouvez contacter directement la réception clinique d’ACOOR via WhatsApp ou par téléphone :\n\n• **WhatsApp :** Messagerie instantanée\n• **Téléphone :** +49 123 456 789\n• **E-mail :** info@albert-physio.de',
          action: {
            label: '💬 Ouvrir WhatsApp (+49 123 456 789)',
            href: 'https://wa.me/49123456789?text=Bonjour%20ACOOR,%20j%27ai%20une%20question%20concernant%20vos%20soins',
            isExternal: true,
            type: 'whatsapp',
          },
          suggestions: ['Prendre RDV en ligne', 'Adresse & Horaires'],
        };
      }
      return {
        text: 'You can connect directly with ACOOR clinical reception staff via WhatsApp or phone right now:\n\n• **WhatsApp:** Instant messaging\n• **Phone:** +49 123 456 789\n• **Email:** info@albert-physio.de',
        action: {
          label: '💬 Open WhatsApp (+49 123 456 789)',
          href: 'https://wa.me/49123456789?text=Hello%20ACOOR,%20I%20have%20a%20question%20about%20your%20services',
          isExternal: true,
          type: 'whatsapp',
        },
        suggestions: ['Book an appointment online', 'Clinic Location & Hours'],
      };
    }

    // Default Fallback in selected language
    if (currentLang === 'de') {
      return {
        text: 'Vielen Dank für Ihre Anfrage! ACOOR ist spezialisiert auf evidenzbasierte Osteopathie, Physiotherapie, Ergotherapie, Logopädie und internationale Klinikberatung.\n\nMöchten Sie direkt einen Termin buchen oder mit uns auf WhatsApp schreiben?',
        action: { label: '📅 Online-Termin Buchen', href: '/book', type: 'primary' },
        suggestions: t.concierge.initialSuggestions,
      };
    }
    if (currentLang === 'fr') {
      return {
        text: "Merci pour votre message ! ACOOR est spécialisée en ostéopathie fondée sur les preuves, kinésithérapie, ergothérapie, orthophonie et conseil hospitalier international.\n\nSouhaitez-vous réserver un rendez-vous en ligne ou discuter avec nous sur WhatsApp ?",
        action: { label: '📅 Prendre Rendez-vous en Ligne', href: '/book', type: 'primary' },
        suggestions: t.concierge.initialSuggestions,
      };
    }
    return {
      text: `Thank you for asking! ACOOR specializes in evidence-based osteopathy and comprehensive rehabilitation tailored to your exact condition.\n\nWould you like to schedule an appointment, or speak directly with ACOOR on WhatsApp?`,
      action: {
        label: '📅 Book Appointment Online',
        href: '/book',
        type: 'primary',
      },
      suggestions: t.concierge.initialSuggestions,
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botReply = getBotResponse(text, lang);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: botReply.action,
        suggestions: botReply.suggestions,
        isEmergency: botReply.isEmergency,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 450);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: t.concierge.resetWelcomeText,
        time: t.concierge.justNow,
        suggestions: t.concierge.initialSuggestions,
      },
    ]);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <aside
        style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1100 }}
        aria-label="Clinic Support Chatbot"
      >
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setHasInteracted(true);
          }}
          aria-label={isOpen ? t.concierge.closeChat : t.concierge.chatWithUs}
          style={{
            background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            padding: '0.8rem 1.35rem',
            boxShadow: '0 10px 28px rgba(13, 148, 136, 0.38), 0 2px 6px rgba(0, 0, 0, 0.08)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.7rem',
            fontWeight: 600,
            fontSize: '0.94rem',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '1.3rem' }}>💬</span>
            {!hasInteracted && (
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#34d399',
                  borderRadius: '50%',
                  border: '2px solid #0f766e',
                }}
              />
            )}
          </span>
          <span>{isOpen ? t.concierge.closeChat : t.concierge.chatWithUs}</span>
        </button>
      </aside>

      {/* Conversational Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="ACOOR Live Chat"
          style={{
            position: 'fixed',
            bottom: '5.2rem',
            right: '1.5rem',
            width: 'min(430px, calc(100vw - 2rem))',
            height: 'min(620px, calc(100vh - 7rem))',
            background: '#ffffff',
            borderRadius: '22px',
            boxShadow: '0 24px 50px rgba(15, 23, 42, 0.2), 0 0 0 1px rgba(13, 148, 136, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1100,
            overflow: 'hidden',
            fontFamily: "'Inter', sans-serif",
            animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* Conversational Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0d9488 0%, #115e59 100%)',
              color: '#ffffff',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  border: '2px solid rgba(255,255,255,0.3)',
                }}
              >
                🩺
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#fff', fontFamily: "'Outfit', sans-serif" }}>
                  {t.concierge.headerTitle}
                </h3>
                <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.92, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                  {t.concierge.headerSub}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                onClick={resetChat}
                title="Restart conversation"
                aria-label="Restart conversation"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '8px',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                🔄
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label={t.concierge.closeChat}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '1.3rem',
                  cursor: 'pointer',
                  padding: '0.3rem',
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div
            style={{
              padding: '1.1rem 1rem',
              overflowY: 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              background: '#f8fafc',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '0.85rem 1rem',
                    borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background:
                      msg.sender === 'user'
                        ? 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)'
                        : msg.isEmergency
                        ? '#fef2f2'
                        : '#ffffff',
                    color: msg.sender === 'user' ? '#ffffff' : msg.isEmergency ? '#991b1b' : '#1e293b',
                    border: msg.sender === 'user' ? 'none' : msg.isEmergency ? '1px solid #fecaca' : '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
                    fontSize: '0.88rem',
                    lineHeight: '1.48',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {msg.text}

                  {/* Message Action Button */}
                  {msg.action && (
                    <div style={{ marginTop: '0.85rem' }}>
                      {msg.action.isExternal ? (
                        <a
                          href={msg.action.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={getActionButtonStyle(msg.action.type)}
                        >
                          {msg.action.label}
                        </a>
                      ) : (
                        <Link
                          href={msg.action.href}
                          onClick={() => setIsOpen(false)}
                          style={getActionButtonStyle(msg.action.type)}
                        >
                          {msg.action.label}
                        </Link>
                      )}
                    </div>
                  )}
                </div>

                <span style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '0.25rem', padding: '0 0.4rem' }}>
                  {msg.time}
                </span>

                {/* Quick Suggestion Chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.4rem',
                      marginTop: '0.65rem',
                      maxWidth: '92%',
                    }}
                  >
                    {msg.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(sug)}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #ccfbf1',
                          color: '#0f766e',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.78rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                          transition: 'all 0.15s ease',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#f0fdfa';
                          e.currentTarget.style.borderColor = '#0d9488';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#ffffff';
                          e.currentTarget.style.borderColor = '#ccfbf1';
                        }}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.75rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', width: 'fit-content' }}>
                <span style={{ width: '6px', height: '6px', background: '#0d9488', borderRadius: '50%', animation: 'pulse 1s infinite alternate' }} />
                <span style={{ width: '6px', height: '6px', background: '#0d9488', borderRadius: '50%', animation: 'pulse 1s infinite alternate 0.2s' }} />
                <span style={{ width: '6px', height: '6px', background: '#0d9488', borderRadius: '50%', animation: 'pulse 1s infinite alternate 0.4s' }} />
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '0.3rem' }}>{t.concierge.typing}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div
            style={{
              padding: '0.75rem 1rem',
              background: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <input
              type="text"
              placeholder={t.concierge.placeholder}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              style={{
                flex: 1,
                padding: '0.7rem 0.95rem',
                fontSize: '0.88rem',
                borderRadius: '14px',
                border: '1px solid #cbd5e1',
                outline: 'none',
                background: '#f8fafc',
                color: '#1e293b',
              }}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              aria-label="Send message"
              style={{
                background: inputText.trim() ? '#0d9488' : '#e2e8f0',
                color: inputText.trim() ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '12px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputText.trim() ? 'pointer' : 'default',
                fontSize: '1.1rem',
                transition: 'background 0.2s ease',
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function getActionButtonStyle(type?: 'primary' | 'whatsapp' | 'secondary' | 'map'): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.55rem 0.95rem',
    borderRadius: '10px',
    fontSize: '0.82rem',
    fontWeight: 600,
    textDecoration: 'none',
    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
    transition: 'transform 0.15s ease',
  };

  if (type === 'whatsapp') {
    return {
      ...base,
      background: '#25D366',
      color: '#ffffff',
    };
  }

  if (type === 'secondary') {
    return {
      ...base,
      background: '#0f172a',
      color: '#ffffff',
    };
  }

  if (type === 'map') {
    return {
      ...base,
      background: '#0284c7',
      color: '#ffffff',
    };
  }

  return {
    ...base,
    background: '#0d9488',
    color: '#ffffff',
  };
}
