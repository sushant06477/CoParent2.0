import React, { useState } from 'react';
import { SocialLink } from '../types';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Linkedin, 
  Send, 
  BookOpen, 
  CheckCircle,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

interface FooterProps {
  socialLinks: SocialLink[];
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  setActiveTab: (tab: string) => void;
  onOpenLogin?: () => void;
}

export default function Footer({ socialLinks, contactInfo, setActiveTab, onOpenLogin }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const activeSocials = socialLinks.filter(s => s.isEnabled);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'Facebook': return Facebook;
      case 'Instagram': return Instagram;
      case 'YouTube': return Youtube;
      case 'LinkedIn': return Linkedin;
      default: return Facebook;
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2" onClick={() => setActiveTab('home')}>
              <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl">
                <BookOpen className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">coparents.in</span>
            </div>
            <p className="text-xs leading-relaxed">
              Patna’s largest educational ecosystem portal verifying coaching centers, study libraries, student hostels, PG rooms, and career guides since 2025.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              {activeSocials.map((social) => {
                const Icon = getSocialIcon(social.platform);
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 transition-all border border-slate-850"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Nav links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-widest border-l-2 border-emerald-500 pl-2">
              Quick Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('coaching')} className="hover:text-emerald-400 hover:underline">
                  Coaching Centers
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('hostel')} className="hover:text-emerald-400 hover:underline">
                  Student Hostels
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('library')} className="hover:text-emerald-400 hover:underline">
                  Self Study Libraries
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('flat')} className="hover:text-emerald-400 hover:underline">
                  PG sharing / Rent
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('counselling')} className="hover:text-emerald-400 hover:underline text-left">
                  Counsellors
                </button>
              </li>
              {onOpenLogin && (
                <li className="pt-1.5 border-t border-slate-900">
                  <button onClick={onOpenLogin} className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline flex items-center gap-1 text-left">
                    <span>🔐 Login Portal</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-widest border-l-2 border-emerald-500 pl-2">
              Patna HQ Office
            </h4>
            <ul className="space-y-3.5 text-xs">
              <li className="flex gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="leading-snug text-slate-300">{contactInfo.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500" />
                <span className="text-slate-300">{contactInfo.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span className="text-slate-300">{contactInfo.phone}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-widest border-l-2 border-emerald-500 pl-2">
              Bihar Admission Feed
            </h4>
            <p className="text-xs leading-relaxed">
              Subscribe to receive weekly vacancy lists, batch deadlines, and student credit card updates.
            </p>
            {subscribed ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-1.5 font-mono">
                <CheckCircle className="w-4 h-4" />
                <span>Subscribed successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 min-w-0 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-emerald-500 text-slate-950 rounded-xl hover:bg-emerald-400 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Legal & copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-wider text-slate-600 font-semibold">
          <p>© {new Date().getFullYear()} coparents.in. All rights reserved.</p>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('privacy')} className="hover:text-slate-400 transition-colors">Privacy Policy</button>
            <button onClick={() => setActiveTab('terms')} className="hover:text-slate-400 transition-colors">Terms & Conditions</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
