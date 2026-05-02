'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, Check } from 'lucide-react';
import { useLoginMutation } from '@/hooks/auth';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [email, setEmail] = useState('admin@saaspos.com'); // Updated default email
  const [password, setPassword] = useState('');
  
  const loginMutation = useLoginMutation();

  const handleLogin = async () => {
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8fafc] px-6 py-8 text-[#3d4652]">
      <div className="pointer-events-none absolute inset-4 rounded-[42px] border border-[#edf1f7]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1024px] items-center justify-center">
        <div className="w-full max-w-[370px]">
          <div className="mb-9 text-center">
            <div className="mb-4 inline-flex h-[40px] w-[40px] items-center justify-center rounded-[8px] bg-[#3758d5] shadow-[0_8px_20px_rgba(55,88,213,0.28)]">
              <Check className="h-4 w-4 fill-white text-white" strokeWidth={3} />
            </div>
            <p className="mb-1 text-[12px] font-semibold tracking-[-0.02em] text-[#606873]">
              AXIOM CONSOLE
            </p>
            <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-[#36404a]">
              Secure Master Access
            </h1>
          </div>

          <div className="rounded-[10px] border border-[#eef2f7] bg-white px-10 pb-10 pt-0 shadow-[0_18px_45px_rgba(35,64,135,0.08)]">
            <div className="mx-[-40px] mb-9 h-[4px] rounded-t-[10px] bg-[#3758d5]" />

            <div className="mb-7">
              <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">
                Enterprise Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-[#6a737d]" strokeWidth={2.2} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-[4px] border border-[#d9e3ec] bg-[#dfeaf3] pl-10 pr-3 text-[14px] text-[#55606d] placeholder:text-[#9aa7b4] focus:outline-none focus:ring-2 focus:ring-[#3758d5]/20"
                  placeholder="admin@axiom.enterprise"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-[12px] font-bold uppercase tracking-[0.12em] text-[#7d8794]">
                  Master Password
                </label>
                <a href="#" className="text-[12px] font-semibold text-[#4d6ae3] hover:text-[#3758d5]">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-[#6a737d]" strokeWidth={2.2} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-[4px] border border-[#d9e3ec] bg-[#dfeaf3] pl-10 pr-12 text-[14px] text-[#55606d] placeholder:text-[#7f8a96] focus:outline-none focus:ring-2 focus:ring-[#3758d5]/20"
                  placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-[#6a737d]" strokeWidth={2.2} />
                  ) : (
                    <Eye className="h-5 w-5 text-[#6a737d]" strokeWidth={2.2} />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-7">
              <label className="flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="h-4 w-4 rounded-[3px] border border-[#d9e1ea] bg-[#edf3f8] text-[#3758d5] focus:ring-2 focus:ring-[#3758d5]/20"
                />
                <span className="ml-3 text-[14px] text-[#6c7682]">Remember this device</span>
              </label>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              className="flex h-[46px] w-full items-center justify-center gap-2 rounded-[4px] bg-[#3758d5] px-4 text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(55,88,213,0.32)] transition hover:bg-[#2f4fca]"
            >
              <Check className="h-4 w-4 fill-white text-white" strokeWidth={3} />
              <span>Secure Login</span>
            </button>

            <div className="mt-8 border-t border-dashed border-[#edf1f5] pt-7">
              <p className="text-center text-[13px] leading-5 text-[#808a95]">
                Access requires hardware token verification.
              </p>
              <p className="text-center text-[13px] leading-5 text-[#4d6ae3]">
                Contact System Administrator
              </p>
            </div>
          </div>

          <div className="mt-7 flex items-center justify-center gap-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#788392]">
            <div className="flex items-center gap-2">
              <div className="h-[7px] w-[7px] rounded-full bg-[#18c184]" />
              <span className="text-[#65707d]">Systems Operational</span>
            </div>
            <span>V2.4.8-Stable</span>
            <span>Encrypted Channel 09</span>
          </div>
        </div>
      </div>
    </div>
  );
}
