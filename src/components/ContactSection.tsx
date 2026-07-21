import React from 'react';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

interface ContactProps {
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    mapEmbedUrl: string;
  };
}

export default function ContactSection({ contactInfo }: ContactProps) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [sent, setSent] = React.useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSent(false);
    }, 3000);
  };

  return (
    <section className="py-16 bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Connect with coparents.in
          </h2>
          <p className="mt-2 text-slate-400 text-sm">
            Our verification officers and student counseling desks in Patna, Bihar are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form & Info */}
          <div className="space-y-8 flex flex-col justify-between">
            {/* Quick Details cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl flex flex-col items-center text-center">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl mb-3">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Email Desk</span>
                <span className="text-xs font-semibold text-white mt-1 break-all">{contactInfo.email}</span>
              </div>

              <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl flex flex-col items-center text-center">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl mb-3">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Call Us</span>
                <span className="text-xs font-semibold text-white mt-1">{contactInfo.phone}</span>
              </div>

              <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl flex flex-col items-center text-center">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl mb-3">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Office address</span>
                <span className="text-[11px] font-semibold text-white mt-1 line-clamp-2 leading-snug">{contactInfo.address}</span>
              </div>
            </div>

            {/* Quick message form */}
            <form onSubmit={handleSend} className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white">Send an Direct Message</h3>
              
              {sent ? (
                <div className="p-4 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Your message was sent directly! Our Patna team will reply via email.</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-emerald-500 focus:outline-none"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe your question or issue with listings..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </>
              )}
            </form>
          </div>

          {/* Interactive Google Map iframe */}
          <div className="w-full h-[320px] lg:h-full min-h-[300px] rounded-2xl overflow-hidden border border-slate-850 bg-slate-900 shadow-lg">
            <iframe
              src={contactInfo.mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="coparents.in Patna Office Location"
              className="grayscale brightness-90 contrast-125"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
