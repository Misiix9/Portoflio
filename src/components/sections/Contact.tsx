'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePerformanceMode } from '@/components/providers/PerformanceProvider';

export default function Contact() {
  const t = useTranslations('Contact');
  const { canUseAmbientMotion } = usePerformanceMode();
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error' | 'config'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;

    setStatus('sending');
    setStatusMessage('');

    const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
    const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
    const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
    
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
       setStatus('config');
       setStatusMessage(t('missingConfig'));
       return;
    }

    try {
      const emailjs = await import('@emailjs/browser');
      await emailjs.default.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, { publicKey: PUBLIC_KEY });
      setStatus('success');
      setStatusMessage(t('success'));
      form.current?.reset();
      setTimeout(() => {
        setStatus('idle');
        setStatusMessage('');
      }, 3000);
    } catch {
      setStatus('error');
      setStatusMessage(t('error'));
    }
  };

  return (
    <section id="contact" className="min-h-[80vh] container mx-auto px-6 py-24 flex flex-col items-center justify-center">
      <motion.div
        initial={canUseAmbientMotion ? { opacity: 0, y: 32 } : false}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.48, ease: "easeOut" }}
        className="w-full max-w-2xl"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter text-center mb-4">
          {t('headingBefore')} <span className="text-accent">{t('headingAccent')}</span>
        </h2>
        <p className="text-gray-400 text-center mb-12">
          {t('intro')}
        </p>

        <form 
          ref={form}
          onSubmit={sendEmail}
          className="space-y-6 bg-white/5 p-8 md:p-12 rounded-3xl border border-white/10 backdrop-blur-xl hover:border-accent/30 transition-colors duration-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="user_name" className="text-sm font-medium text-gray-300">{t('name')}</label>
              <input 
                type="text" 
                id="user_name"
                name="user_name" // Needs to match EmailJS template variable
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors font-lexend"
                placeholder={t('namePlaceholder')}
                required
                disabled={status === 'sending'}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="user_email" className="text-sm font-medium text-gray-300">{t('email')}</label>
              <input 
                type="email" 
                id="user_email"
                name="user_email"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors font-lexend"
                placeholder={t('emailPlaceholder')}
                required
                disabled={status === 'sending'}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-gray-300">{t('message')}</label>
            <textarea 
              id="message"
              name="message" 
              rows={5}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors resize-none font-lexend"
              placeholder={t('messagePlaceholder')}
              required
              disabled={status === 'sending'}
            />
          </div>

          <p
            className={`min-h-5 text-center text-sm ${status === 'config' ? 'text-amber-200/90' : 'text-gray-400'}`}
            aria-live="polite"
          >
            {statusMessage}
          </p>

          <button 
            type="submit"
            disabled={status === 'sending' || status === 'success'}
            className={`w-full font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all font-lexend
              ${status === 'success' ? 'bg-green-600 text-white' : 
                status === 'error' ? 'bg-red-600 text-white' :
                status === 'config' ? 'border border-amber-400/40 bg-amber-500/15 text-amber-100' :
                'bg-accent hover:bg-red-900 text-white hover:scale-[1.02] active:scale-[0.98]'}
            `}
          >
            {status === 'sending' ? (
              <><Loader2 className="animate-spin" size={20} /> {t('sending')}</>
            ) : status === 'success' ? (
              <><CheckCircle size={20} /> {t('success')}</>
            ) : status === 'error' ? (
              <><AlertCircle size={20} /> {t('error')}</>
            ) : status === 'config' ? (
              <><AlertCircle size={20} /> {t('send')}</>
            ) : (
              <><Send size={20} /> {t('send')}</>
            )}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
