'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;

    setStatus('sending');

    // Environment Variables from .env.local
    const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
    const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
    const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
    
    // Simple validation (optional but good for debugging)
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
       console.error("EmailJS environment variables are missing.");
       setStatus('error');
       return;
    }

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then((result) => {
          console.log(result.text);
          setStatus('success');
          form.current?.reset();
          // Reset status after 3 seconds
          setTimeout(() => setStatus('idle'), 3000);
      }, (error) => {
          console.log(error.text);
          setStatus('error');
      });
  };

  return (
    <section id="contact" className="min-h-[80vh] container mx-auto px-6 py-24 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50, rotateX: 10 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ transformPerspective: 1000 }}
        className="w-full max-w-2xl"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter text-center mb-4">
          Get in <span className="text-accent">Touch</span>
        </h2>
        <p className="text-gray-400 text-center mb-12">
          Interested in working together? Fill out the form below.
        </p>

        <form 
          ref={form}
          onSubmit={sendEmail}
          className="space-y-6 bg-white/5 p-8 md:p-12 rounded-3xl border border-white/10 backdrop-blur-xl hover:border-accent/30 transition-colors duration-500"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="user_name" className="text-sm font-medium text-gray-300">Name</label>
              <input 
                type="text" 
                id="user_name"
                name="user_name" // Needs to match EmailJS template variable
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors font-lexend"
                placeholder="John Doe"
                required
                disabled={status === 'sending'}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="user_email" className="text-sm font-medium text-gray-300">Email</label>
              <input 
                type="email" 
                id="user_email"
                name="user_email"
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors font-lexend"
                placeholder="john@example.com"
                required
                disabled={status === 'sending'}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-gray-300">Message</label>
            <textarea 
              id="message"
              name="message" 
              rows={5}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors resize-none font-lexend"
              placeholder="Tell me about your project..."
              required
              disabled={status === 'sending'}
            />
          </div>

          <button 
            type="submit"
            disabled={status === 'sending' || status === 'success'}
            className={`w-full font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all font-lexend
              ${status === 'success' ? 'bg-green-600 text-white' : 
                status === 'error' ? 'bg-red-600 text-white' :
                'bg-accent hover:bg-red-900 text-white hover:scale-[1.02] active:scale-[0.98]'}
            `}
          >
            {status === 'sending' ? (
              <><Loader2 className="animate-spin" size={20} /> Sending...</>
            ) : status === 'success' ? (
              <><CheckCircle size={20} /> Sent Successfully!</>
            ) : status === 'error' ? (
              <><AlertCircle size={20} /> Failed. Try again.</>
            ) : (
              <><Send size={20} /> Send Message</>
            )}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
