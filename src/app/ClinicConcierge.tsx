'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

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

const INITIAL_SUGGESTIONS = [
  '🏛️ About ACOOR & Faculty',
  '🩺 What is Osteopathy & 5 Pillars?',
  '🏥 4 Rehabilitation Departments',
  '🌐 Global Hospital Advisory',
  '💰 What are your fees & deposit?',
  '💬 Chat on WhatsApp'
];

export default function ClinicConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! 👋 Welcome to **ACOOR (Africa Clinic of Osteopathy and Rehabilitation)**. I am your virtual clinic assistant.\n\nHow can I help you today? You can ask about Osteopathic Medicine, our 4 rehabilitation departments, our German Still Academy faculty background, or tap an option below:',
      time: 'Just now',
      suggestions: INITIAL_SUGGESTIONS
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const getBotResponse = (userInput: string): Omit<Message, 'id' | 'sender' | 'time'> => {
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
      q.includes('groin numbness') ||
      q.includes('loss of bladder') ||
      q.includes('emergency')
    ) {
      return {
        text: '⚠️ URGENT MEDICAL ADVISORY:\n\nIf you are experiencing severe acute trauma, loss of limb sensation, chest pain, or sudden loss of bowel/bladder control, please proceed immediately to an emergency hospital department or call local emergency services.\n\nOur outpatient physiotherapy clinic is designed for non-emergency musculoskeletal rehabilitation.',
        isEmergency: true,
        action: {
          label: 'Call Emergency Hospital',
          href: 'tel:112',
          type: 'secondary'
        },
        suggestions: ['What non-emergency services do you offer?', 'Where is your clinic located?']
      };
    }

    // Password Recovery & Account Access
    if (
      q.includes('forgot password') ||
      q.includes('reset password') ||
      q.includes('change password') ||
      q.includes('cannot login') ||
      q.includes("can't login") ||
      q.includes('password')
    ) {
      return {
        text: '🔑 **Password Reset & Account Recovery:**\n\nIf you have forgotten your password or cannot access your patient dashboard:\n\n1. Go to our **Forgot Password** portal.\n2. Enter your registered email address.\n3. Open the secure reset link sent to your inbox to choose a new password.\n\n*Tip:* If you do not see the email within 2 minutes, please check your Spam/Junk folder.',
        action: {
          label: '🔑 Reset Your Password Now',
          href: '/forgot-password',
          type: 'primary',
        },
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
      q.includes('acoor')
    ) {
      return {
        text: '🏛️ **About ACOOR & Clinical Leadership:**\n\n**ACOOR** (Africa Clinic of Osteopathy and Rehabilitation) was founded by **Albert Nana Yaw Ntekoh**, who completed medical education in Osteopathic Medicine in Germany and is an appointed **Lecturer and Clinical Instructor at the renowned Still Academy in Germany**—one of Europe’s leading osteopathic academic institutions.\n\nACOOR was founded to bring world-class European osteopathic standards, multidisciplinary rehabilitation, and international hospital coordination directly to patients in Africa.',
        action: {
          label: '📖 Read About Us & Clinical Philosophy',
          href: '/about',
          type: 'primary'
        },
        suggestions: ['What is Osteopathy?', 'The 5 Pillars of Osteopathy', 'Global Hospital Advisory', 'Book a Consultation']
      };
    }

    // B. What is Osteopathy & The 5 Pillars
    if (
      q.includes('osteopath') ||
      q.includes('pillar') ||
      q.includes('what is osteopathy') ||
      q.includes('who is an osteopath')
    ) {
      return {
        text: '🩺 **What is Osteopathy?**\nOsteopathy is an evidence-informed holistic medical science focusing on the interconnection between the body’s structure and function. Rather than merely masking symptoms, it restores mobility and natural self-healing.\n\n🏛️ **The 5 Pillars of Osteopathy:**\n1. **Biomechanical Model (Parietal):** Joint articulation, spine, posture & fascial mobility.\n2. **Neurological Model:** Regulating central & autonomic nervous pathways; calming pain reflexes.\n3. **Respiratory & Circulatory Model:** Optimizing arterial supply and lymphatic drainage.\n4. **Metabolic & Visceral Model:** Internal organ mobility, digestion & cellular vitality.\n5. **Biopsychosocial Model:** Craniosacral harmony, stress release & mind-body balance.',
        action: {
          label: '📖 Explore 5 Pillars & Who is an Osteopath',
          href: '/about',
          type: 'primary'
        },
        suggestions: ['4 Rehabilitation Departments', 'Still Academy Faculty Background', 'Book a Consultation']
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
      q.includes('second opinion')
    ) {
      return {
        text: '🌐 **Our Global Hospital Advisory:**\n\nA core pillar of ACOOR’s mission is connecting African patients with the world’s leading medical institutions.\n\nThrough ACOOR’s clinical network with top university clinics and orthopedic surgeons across **Germany, Switzerland, and the UK**, we provide:\n• Expert second opinions on MRI scans & surgery recommendations\n• Direct medical coordination for specialized operations abroad\n• Seamless pre-surgery preparation and post-surgical rehabilitation back home in Accra.',
        action: {
          label: '💬 Inquire About Hospital Advisory via WhatsApp',
          href: 'https://wa.me/49123456789?text=Hello%20ACOOR,%20I%20would%20like%20to%20inquire%20about%20your%20International%20Hospital%20Advisory',
          isExternal: true,
          type: 'whatsapp'
        },
        suggestions: ['About ACOOR', 'Post-Surgery Rehabilitation', 'Book a Consultation']
      };
    }

    // D. Multidisciplinary Rehabilitation (Physiotherapy, Ergotherapie, Logopädie, Post-Surgery)
    if (
      q.includes('rehab') ||
      q.includes('ergotherapie') ||
      q.includes('ergotherapy') ||
      q.includes('occupational') ||
      q.includes('logopadie') ||
      q.includes('logopädie') ||
      q.includes('speech') ||
      q.includes('swallowing')
    ) {
      return {
        text: '🏥 **Multidisciplinary Rehabilitation at ACOOR:**\n\nWe provide 4 integrated clinical departments:\n\n1. **Physical Therapy (Physiotherapie):** Manual joint mobilization, sports rehab, spinal decompression & electrotherapy.\n2. **Occupational Therapy (Ergotherapie):** Regaining fine motor control, hand rehabilitation, stroke recovery & ergonomic independence.\n3. **Speech & Language Therapy (Logopädie):** Treatment for speech, voice, communication, and swallowing disorders (dysphagia).\n4. **Post-Surgical Specialized Care:** Structured recovery following orthopedic joint replacements and spine surgeries.',
        action: {
          label: '📖 View All Rehabilitation Services',
          href: '/about',
          type: 'primary'
        },
        suggestions: ['Book Post-Surgery Care', 'Manual Therapy', 'Chat with ACOOR on WhatsApp']
      };
    }

    // 2. Back & Neck Pain
    if (
      q.includes('back') ||
      q.includes('neck') ||
      q.includes('spine') ||
      q.includes('sciatica') ||
      q.includes('lumbar') ||
      q.includes('stiff') ||
      q.includes('disc') ||
      q.includes('hernia')
    ) {
      return {
        text: 'For back, neck, and spinal discomfort, ACOOR recommends our **Manual Therapy & Spinal Realignment** program.\n\nThis hands-on therapy decompresses restricted spinal segments, releases muscle spasms, and restores comfortable pain-free mobility.',
        action: {
          label: '📅 Book Manual Therapy (300 GHS)',
          href: '/book?service=manual-therapy',
          type: 'primary'
        },
        suggestions: ['How much is the deposit?', 'What should I wear to my visit?', 'Chat on WhatsApp']
      };
    }

    // 3. Sports Injury & Sprains
    if (
      q.includes('sport') ||
      q.includes('football') ||
      q.includes('ankle') ||
      q.includes('knee') ||
      q.includes('acl') ||
      q.includes('hamstring') ||
      q.includes('muscle tear') ||
      q.includes('sprain') ||
      q.includes('run')
    ) {
      return {
        text: 'For sports injuries, ligament strains, and muscle pulls, we specialize in **Sports Physiotherapy & Athletic Rehab**.\n\nWe provide biomechanical movement screenings, progressive muscle loading, and functional return-to-sport testing to get you back to peak performance safely.',
        action: {
          label: '📅 Book Sports Physio Visit',
          href: '/book?service=sports-physio',
          type: 'primary'
        },
        suggestions: ['What happens during the first visit?', 'Do you accept insurance?', 'Chat on WhatsApp']
      };
    }

    // 4. Post-Surgery Recovery
    if (
      q.includes('surgery') ||
      q.includes('operation') ||
      q.includes('replacement') ||
      q.includes('post-op') ||
      q.includes('fracture')
    ) {
      return {
        text: 'We provide structured, surgeon-aligned **Post-Surgical Orthopedic Recovery** protocols for knee replacements, hip surgeries, arthroscopic repairs, and fractures.\n\nOur clinical team ensures safe passive-to-active range of motion progression while preventing scar tissue stiffness.',
        action: {
          label: '📅 Book Post-Surgical Rehab',
          href: '/book?service=post-surgery',
          type: 'primary'
        },
        suggestions: ['What documents should I bring?', 'Where is the clinic located?']
      };
    }

    // 5. Swelling / Lymphatic Drainage
    if (
      q.includes('swell') ||
      q.includes('fluid') ||
      q.includes('edema') ||
      q.includes('lymph') ||
      q.includes('circulation')
    ) {
      return {
        text: 'Our **Medical Lymphatic Drainage & Edema Care** utilizes specialized gentle decongestive techniques to stimulate lymphatic circulation, rapidly clearing post-operative fluid accumulation and reducing heavy, swollen limbs.',
        action: {
          label: '📅 Book Lymphatic Therapy',
          href: '/book?service=lymphatic-drainage',
          type: 'primary'
        },
        suggestions: ['Consultation pricing', 'Location in Pokuasi']
      };
    }

    // 6. Muscle Knots / Massage / Trigger Point / Headaches
    if (
      q.includes('knot') ||
      q.includes('massage') ||
      q.includes('deep tissue') ||
      q.includes('headache') ||
      q.includes('trigger') ||
      q.includes('myofascial')
    ) {
      return {
        text: 'Our **Trigger Point & Myofascial Deep Release** targets hyper-irritable muscle knots to eliminate referred pain, release chronic shoulder tension, and relieve persistent tension headaches.',
        action: {
          label: '📅 Book Deep Tissue Session',
          href: '/book?service=trigger-point',
          type: 'primary'
        },
        suggestions: ['What are your opening hours?', 'Book an appointment']
      };
    }

    // 7. Tech-Neck & Posture
    if (
      q.includes('posture') ||
      q.includes('desk') ||
      q.includes('sitting') ||
      q.includes('tech neck') ||
      q.includes('shoulder')
    ) {
      return {
        text: 'Suffering from desk strain? Our **Cervical Spine, Neck & Posture Alignment** program corrects tech-neck, rounded shoulders, and upper back tightness through spinal mobilization and ergonomic strengthening.',
        action: {
          label: '📅 Book Posture Alignment',
          href: '/book?service=posture-care',
          type: 'primary'
        },
        suggestions: ['Where is the clinic?', 'Pricing & Fees']
      };
    }

    // 8. Chronic Pain / Ultrasound / Shockwave
    if (
      q.includes('ultrasound') ||
      q.includes('shockwave') ||
      q.includes('electro') ||
      q.includes('chronic') ||
      q.includes('tendon') ||
      q.includes('bursitis') ||
      q.includes('arthritis')
    ) {
      return {
        text: 'For chronic joint pain and tendonitis, we offer **Advanced Electrotherapy & Deep Ultrasound**.\n\nThis modality stimulates deep collagen repair, increases local blood supply, and breaks down stubborn calcified tissues.',
        action: {
          label: '📅 Book Advanced Rehab Session',
          href: '/book?service=advanced-rehab',
          type: 'primary'
        },
        suggestions: ['Pricing & Insurance', 'What should I wear?']
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
      q.includes('pay')
    ) {
      return {
        text: 'Here is our transparent pricing:\n\n• **Comprehensive Session:** 300 GHS (45–60 min 1-on-1 with Certified Specialist)\n• **Online Booking Deposit:** 90 GHS (30% to reserve your exact Google Calendar slot)\n• **Remaining Balance:** 210 GHS paid at the clinic during your appointment.',
        action: {
          label: '📅 Book Slot Now (90 GHS Deposit)',
          href: '/book',
          type: 'primary'
        },
        suggestions: ['Do you accept health insurance?', 'Where is the clinic in Pokuasi?', 'Chat on WhatsApp']
      };
    }

    // 10. Health Insurance
    if (q.includes('insurance') || q.includes('nhis') || q.includes('coverage') || q.includes('claim')) {
      return {
        text: 'Yes! We welcome both private self-pay patients and major approved corporate and private health insurance schemes.\n\nPlease bring your valid membership card or policy slip, or message us directly on WhatsApp so our front desk can confirm your coverage in advance.',
        action: {
          label: '💬 Check Insurance on WhatsApp',
          href: 'https://wa.me/49123456789?text=Hello%20ACOOR,%20I%20would%20like%20to%20verify%20my%20insurance%20coverage',
          isExternal: true,
          type: 'whatsapp'
        },
        suggestions: ['What are your opening hours?', 'Book an appointment']
      };
    }

    // 11. Location, Address, Directions, Parking
    if (
      q.includes('location') ||
      q.includes('where') ||
      q.includes('address') ||
      q.includes('pokuasi') ||
      q.includes('accra') ||
      q.includes('map') ||
      q.includes('park') ||
      q.includes('direction')
    ) {
      return {
        text: '📍 **Clinic Location:**\nACOOR (Africa Clinic of Osteopathy & Rehabilitation) is located in **Pokuasi, Accra, Ghana**.\n\nWe are conveniently accessible with dedicated, secure on-site parking for all our patients.',
        action: {
          label: '🗺️ Open in Google Maps',
          href: 'https://maps.google.com/?q=Pokuasi,+Accra,+Ghana',
          isExternal: true,
          type: 'map'
        },
        suggestions: ['What are your opening hours?', 'What treatments do you offer?', 'Book an appointment']
      };
    }

    // 12. Opening Hours
    if (q.includes('hour') || q.includes('open') || q.includes('close') || q.includes('time') || q.includes('saturday') || q.includes('sunday')) {
      return {
        text: '⏰ **Clinic Hours:**\n\n• **Monday – Thursday:** 08:00 – 18:00\n• **Friday:** 08:00 – 15:00\n• **Saturday & Sunday:** Closed *(urgent post-op follow-ups by prior arrangement)*\n\nYou can book appointments 24/7 directly through our real-time calendar!',
        action: {
          label: '📅 View Real-Time Availability',
          href: '/book',
          type: 'primary'
        },
        suggestions: ['Where is the clinic?', 'How much does a session cost?']
      };
    }

    // 13. What to wear or bring
    if (q.includes('wear') || q.includes('bring') || q.includes('cloth') || q.includes('document') || q.includes('x-ray') || q.includes('mri')) {
      return {
        text: '👕 **What to wear:**\nPlease wear comfortable, flexible sportswear (shorts, t-shirt, sweatpants) so our clinical specialist can easily examine and mobilize your joints.\n\n📋 **What to bring:**\nPlease bring your photo ID and any previous X-rays, MRI scans, or doctor referral notes if you have them. If not, our clinical team will perform a full diagnostic assessment during your session.',
        suggestions: ['How long does a session take?', 'Book an appointment']
      };
    }

    // 14. Session Duration
    if (q.includes('duration') || q.includes('long') || q.includes('minute') || q.includes('session')) {
      return {
        text: '⏱️ Each standard clinical appointment takes approximately **45 to 60 minutes**.\n\nThis includes a comprehensive diagnostic assessment, personalized hands-on therapy, and take-home functional exercise instructions.',
        action: {
          label: '📅 Book Your 45–60 Min Session',
          href: '/book',
          type: 'primary'
        },
        suggestions: ['Pricing & Fees', 'Clinic Location']
      };
    }

    // 15. Cancel or Reschedule
    if (q.includes('cancel') || q.includes('reschedule') || q.includes('change date') || q.includes('change time')) {
      return {
        text: 'You can easily reschedule or cancel an existing appointment directly from your **Patient Dashboard** up to 24 hours prior to your scheduled time.\n\nIf you need urgent assistance within 24 hours, please message us directly on WhatsApp.',
        action: {
          label: '👤 Open Patient Dashboard',
          href: '/dashboard',
          type: 'secondary'
        },
        suggestions: ['Chat on WhatsApp', 'Clinic Opening Hours']
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
      q.includes('albert')
    ) {
      return {
        text: 'You can connect directly with ACOOR clinical reception staff via WhatsApp or phone right now:\n\n• **WhatsApp:** Instant messaging\n• **Phone:** +49 123 456 789\n• **Email:** info@albert-physio.de',
        action: {
          label: '💬 Open WhatsApp (+49 123 456 789)',
          href: 'https://wa.me/49123456789?text=Hello%20ACOOR,%20I%20have%20a%20question%20about%20your%20services',
          isExternal: true,
          type: 'whatsapp'
        },
        suggestions: ['Book an appointment online', 'Clinic Location & Hours']
      };
    }

    // 17. Which treatment do I need? (Interactive guide)
    if (q.includes('treatment') || q.includes('service') || q.includes('offer') || q.includes('program') || q.includes('help me')) {
      return {
        text: 'ACOOR offers 8 specialized clinical programs:\n\n1. **Manual Therapy** (Spine, back & neck pain)\n2. **Sports Physio** (Sprains, athletic tears)\n3. **Post-Surgery Recovery** (Joint replacements)\n4. **Advanced Electrotherapy** (Chronic joint pain)\n5. **Lymphatic Drainage** (Swelling & fluid relief)\n6. **Trigger Point Release** (Muscle knots & headaches)\n7. **Posture Alignment** (Desk workers & tech-neck)\n8. **Functional Joint Mobility** (Osteoarthritis & aging)\n\nWhich of these conditions are you experiencing?',
        suggestions: ['Back & Neck Pain', 'Sports Injury', 'Post-Surgery Rehab', 'Swelling & Edema', 'Muscle Knots']
      };
    }

    // Default Fallback
    return {
      text: `Thank you for asking! ACOOR specializes in evidence-based osteopathy and comprehensive rehabilitation tailored to your exact condition.\n\nWould you like to schedule an appointment, or speak directly with ACOOR on WhatsApp?`,
      action: {
        label: '📅 Book Appointment Online',
        href: '/book',
        type: 'primary'
      },
      suggestions: [
        '🩺 Which treatment do I need?',
        '💰 Fees & Deposit (300 GHS)',
        '💬 Chat with ACOOR on WhatsApp',
        '📍 Location in Pokuasi'
      ]
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate realistic typing delay (450ms)
    setTimeout(() => {
      const botReply = getBotResponse(text);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: botReply.action,
        suggestions: botReply.suggestions,
        isEmergency: botReply.isEmergency
      };
      setMessages(prev => [...prev, botMessage]);
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
        text: 'Hello again! 👋 How can I assist you with your health or booking today?',
        time: 'Just now',
        suggestions: INITIAL_SUGGESTIONS
      }
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
          aria-label={isOpen ? 'Close Live Chat' : 'Chat with ACOOR Virtual Assistant'}
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
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
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
          <span>{isOpen ? 'Close Chat' : 'Chat with Us'}</span>
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
                  ACOOR Live Support
                </h3>
                <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.92, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                  Africa Clinic of Osteopathy & Rehab • Online
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
                aria-label="Close Chat"
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
                    background: msg.sender === 'user' 
                      ? 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' 
                      : (msg.isEmergency ? '#fef2f2' : '#ffffff'),
                    color: msg.sender === 'user' ? '#ffffff' : (msg.isEmergency ? '#991b1b' : '#1e293b'),
                    border: msg.sender === 'user' ? 'none' : (msg.isEmergency ? '1px solid #fecaca' : '1px solid #e2e8f0'),
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
                        onMouseEnter={e => {
                          e.currentTarget.style.background = '#f0fdfa';
                          e.currentTarget.style.borderColor = '#0d9488';
                        }}
                        onMouseLeave={e => {
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
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '0.3rem' }}>Assistant is typing...</span>
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
              placeholder="Ask about your pain, fees, hours, booking..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
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

  // default primary
  return {
    ...base,
    background: '#0d9488',
    color: '#ffffff',
  };
}
