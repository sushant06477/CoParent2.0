import React, { useState, useEffect } from 'react';
import { Enquiry } from '../types';
import { Send, CheckCircle2, MapPin, Building2, ShieldCheck, Eye, EyeOff, Lock, AlertCircle } from 'lucide-react';

interface EnquiryFormProps {
  onSuccess: (enquiry: any) => void;
  defaultServiceType?: string;
  defaultServiceName?: string;
}

export default function EnquiryForm({ onSuccess, defaultServiceType, defaultServiceName }: EnquiryFormProps) {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [userType, setUserType] = useState<'Student' | 'Parent' | 'Coaching' | 'Hostel' | 'Library' | 'Flat / PG' | 'Counsellor'>('Student');
  const [city] = useState('Patna'); // Default: Patna
  const [areaLocality, setAreaLocality] = useState('Boring Road');
  const [interestedService, setInterestedService] = useState<'Coaching' | 'Hostel' | 'Library' | 'Flat / PG' | 'Career Counselling' | 'Scholarships' | 'Career Guidance'>(
    (defaultServiceType as any) || 'Coaching'
  );
  const [preferredCourse, setPreferredCourse] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Handle default state changes if parent component provides them
  useEffect(() => {
    if (defaultServiceType) {
      const map: Record<string, any> = {
        'coaching': 'Coaching',
        'hostel': 'Hostel',
        'library': 'Library',
        'flat': 'Flat / PG',
        'counselling': 'Career Counselling'
      };
      setInterestedService(map[defaultServiceType] || 'Coaching');
    }
    if (defaultServiceName) {
      setMessage(`Hi, I am interested in connecting with "${defaultServiceName}". Please provide admission schedules, vacancy status, and details.`);
    }
  }, [defaultServiceType, defaultServiceName]);

  // Real-time Field Validation Helper
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Full Name
    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required.';
    } else if (fullName.trim().length < 2) {
      errors.fullName = 'Full Name must be at least 2 characters.';
    }

    // Mobile Number (Indian 10-digit number validation)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileNumber) {
      errors.mobileNumber = 'Mobile Number is required.';
    } else if (!mobileRegex.test(mobileNumber)) {
      errors.mobileNumber = 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.';
    }

    // Email Address (Optional, but if filled must be valid)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() && !emailRegex.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    // Password Validation
    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }

    // Confirm Password Validation
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    // Locality
    if (!areaLocality) {
      errors.areaLocality = 'Please select a Patna locality.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Password Strength Score Helper
  const getPasswordStrength = (): { text: string; color: string; percent: string } => {
    if (!password) return { text: '', color: '', percent: '0%' };
    if (password.length < 6) return { text: 'Weak (Min 6 chars)', color: 'text-red-400 bg-red-500', percent: '33%' };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { text: 'Strong', color: 'text-emerald-400 bg-emerald-500', percent: '100%' };
    }
    return { text: 'Medium', color: 'text-amber-400 bg-amber-500', percent: '66%' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateForm()) {
      setErrorMsg('Please correct the highlighted errors before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          mobileNumber,
          email: email.trim() || undefined,
          password,
          userType,
          city,
          areaLocality,
          interestedService,
          preferredCourse: preferredCourse.trim() || undefined,
          message: message.trim() || undefined,
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        setSubmitSuccess(true);
        onSuccess(resData.enquiry);
        // Clear fields
        setFullName('');
        setMobileNumber('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPreferredCourse('');
        setMessage('');
        setFieldErrors({});
      } else {
        setErrorMsg(resData.message || 'Error processing registration.');
      }
    } catch (err) {
      console.error('Enquiry submission error', err);
      setErrorMsg('Network error. Failed to save your registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden max-w-2xl mx-auto">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -z-10" />

      {submitSuccess ? (
        <div className="text-center py-10 space-y-4">
          <div className="inline-flex p-3 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 rounded-2xl mx-auto mb-2 animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-bold text-white">Registration Completed Successfully!</h3>
          <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
            Your account and enquiry have been registered in the coparents.in system. You can now log in using your mobile number and password!
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="mt-6 px-6 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white rounded-xl text-sm transition-colors"
          >
            Register Another Account
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-slate-900 pb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>Register Your Account & Enquiry</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Direct access & connection with verified schools, hostels, libraries, and counsel hubs in Patna.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/50 border border-red-500/30 text-red-400 text-xs rounded-xl font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2 font-medium">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alok Kumar"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (fieldErrors.fullName) setFieldErrors(prev => ({ ...prev, fullName: '' }));
                }}
                className={`w-full px-4 py-3 bg-slate-900 border ${
                  fieldErrors.fullName ? 'border-red-500 text-red-100' : 'border-slate-800/80 text-white'
                } rounded-xl text-sm focus:border-emerald-500 focus:outline-none transition-colors`}
              />
              {fieldErrors.fullName && (
                <p className="text-[11px] text-red-400 font-mono mt-1">{fieldErrors.fullName}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2 font-medium">
                Mobile Number *
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="10-digit mobile (e.g. 9876543210)"
                value={mobileNumber}
                onChange={(e) => {
                  setMobileNumber(e.target.value.replace(/\D/g, ''));
                  if (fieldErrors.mobileNumber) setFieldErrors(prev => ({ ...prev, mobileNumber: '' }));
                }}
                className={`w-full px-4 py-3 bg-slate-900 border ${
                  fieldErrors.mobileNumber ? 'border-red-500 text-red-100' : 'border-slate-800/80 text-white'
                } rounded-xl text-sm focus:border-emerald-500 focus:outline-none transition-colors`}
              />
              {fieldErrors.mobileNumber && (
                <p className="text-[11px] text-red-400 font-mono mt-1">{fieldErrors.mobileNumber}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2 font-medium">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                  }}
                  className={`w-full pl-4 pr-10 py-3 bg-slate-900 border ${
                    fieldErrors.password ? 'border-red-500 text-red-100' : 'border-slate-800/80 text-white'
                  } rounded-xl text-sm focus:border-emerald-500 focus:outline-none transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password ? (
                <p className="text-[11px] text-red-400 font-mono mt-1">{fieldErrors.password}</p>
              ) : passwordStrength.text ? (
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${passwordStrength.color} transition-all duration-300`} style={{ width: passwordStrength.percent }} />
                  </div>
                  <span className={`text-[10px] font-mono font-bold ${passwordStrength.color.split(' ')[0]}`}>{passwordStrength.text}</span>
                </div>
              ) : null}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2 font-medium">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                  className={`w-full pl-4 pr-10 py-3 bg-slate-900 border ${
                    fieldErrors.confirmPassword ? 'border-red-500 text-red-100' : 'border-slate-800/80 text-white'
                  } rounded-xl text-sm focus:border-emerald-500 focus:outline-none transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-[11px] text-red-400 font-mono mt-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 font-medium">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                }}
                className={`w-full px-4 py-3 bg-slate-900 border ${
                  fieldErrors.email ? 'border-red-500 text-red-100' : 'border-slate-800/80 text-white'
                } rounded-xl text-sm focus:border-emerald-500 focus:outline-none transition-colors`}
              />
              {fieldErrors.email && (
                <p className="text-[11px] text-red-400 font-mono mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* User Type */}
            <div>
              <label className="block text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2 font-medium">
                Are you a... *
              </label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value as any)}
                className="w-full px-3 py-3 bg-slate-900 border border-slate-800/80 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              >
                <option value="Student">Student</option>
                <option value="Parent">Parent</option>
                <option value="Coaching">Coaching Owner</option>
                <option value="Hostel">Hostel Owner</option>
                <option value="Library">Library Owner</option>
                <option value="Flat / PG">PG / Flat Landlord</option>
                <option value="Counsellor">Counsellor</option>
              </select>
            </div>

            {/* City (Patna Default) */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 font-medium">
                City (Default)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-emerald-500" />
                <input
                  type="text"
                  disabled
                  value={city}
                  className="w-full pl-9 pr-4 py-3 bg-slate-900/60 border border-slate-800/80 rounded-xl text-slate-400 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            {/* Area / Locality */}
            <div>
              <label className="block text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2 font-medium">
                Patna Locality / Area *
              </label>
              <select
                value={areaLocality}
                onChange={(e) => {
                  setAreaLocality(e.target.value);
                  if (fieldErrors.areaLocality) setFieldErrors(prev => ({ ...prev, areaLocality: '' }));
                }}
                className={`w-full px-3 py-3 bg-slate-900 border ${
                  fieldErrors.areaLocality ? 'border-red-500 text-red-100' : 'border-slate-800/80 text-white'
                } rounded-xl text-sm focus:border-emerald-500 focus:outline-none`}
              >
                <option value="Boring Road">Boring Road</option>
                <option value="Kankarbagh">Kankarbagh</option>
                <option value="Rajendra Nagar">Rajendra Nagar</option>
                <option value="Mahendru">Mahendru</option>
                <option value="Bailey Road">Bailey Road</option>
                <option value="Ashok Rajpath">Ashok Rajpath</option>
                <option value="Saguna More">Saguna More</option>
                <option value="Anisabad">Anisabad</option>
              </select>
              {fieldErrors.areaLocality && (
                <p className="text-[11px] text-red-400 font-mono mt-1">{fieldErrors.areaLocality}</p>
              )}
            </div>

            {/* Interested Service */}
            <div>
              <label className="block text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2 font-medium">
                Interested Service *
              </label>
              <select
                value={interestedService}
                onChange={(e) => setInterestedService(e.target.value as any)}
                className="w-full px-3 py-3 bg-slate-900 border border-slate-800/80 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              >
                <option value="Coaching">Coaching Institutes</option>
                <option value="Hostel">Boys / Girls Hostel</option>
                <option value="Library">Silent Libraries</option>
                <option value="Flat / PG">PG / Student Flats</option>
                <option value="Career Counselling">Career Counselling</option>
                <option value="Scholarships">Scholarships Guide</option>
                <option value="Career Guidance">Career Guidance</option>
              </select>
            </div>

            {/* Preferred Course (Optional) */}
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 font-medium">
                Preferred Course (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. JEE dropper, BPSC, Class 12"
                value={preferredCourse}
                onChange={(e) => setPreferredCourse(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800/80 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 font-medium">
              Your Specific Requirement / Message
            </label>
            <textarea
              rows={3}
              placeholder="Write any details regarding fees, room sharing, batch timings or amenities..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800/80 rounded-xl text-white text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 text-slate-950 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 font-bold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Registering Account in Database...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Register Account Now</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Fully Secure. Details strictly mapped with authorized department owners under Patna Admin rules.</span>
          </p>
        </form>
      )}
    </div>
  );
}
