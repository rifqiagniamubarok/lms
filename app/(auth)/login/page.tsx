'use client';
import React, { useState } from 'react';
import { Card, CardBody, Input, Button, Image, Link, Chip, Checkbox } from '@heroui/react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email atau password salah');
      } else if (result?.ok) {
        // Successful login - redirect to dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-[512px] relative">
      <Card className="bg-white shadow-lg border-0" style={{ boxShadow: '0px 4px 12px 0px rgba(0,0,0,0.05)' }}>
        <CardBody className="p-6">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Image src="/logo.png" alt="Mathzy Logo" width={80} height={82} className="object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-[#0075e6] mb-2 tracking-tight">Mathzy</h1>
            <p className="text-[#525252] text-base">Login Guru</p>
          </div>

          {/* Demo Credentials */}
          <div className="mb-6">
            <Chip
              variant="flat"
              className="w-full bg-[#f8fafc] border border-[#cbd5e1] p-3 h-auto"
              startContent={
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            >
              <span className="text-[#475569] text-xs">
                Demo: <span className="font-bold">guru@mathzy.com</span> / <span className="font-bold">password123</span>
              </span>
            </Chip>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <Input
                type="email"
                label="Email"
                placeholder="Masukkan email anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isRequired
                variant="flat"
                className="w-full"
                classNames={{
                  label: 'text-[#374151] text-sm font-medium mb-1.5',
                  input: 'text-sm',
                  inputWrapper: 'bg-[#f9fafb] border border-[#e5e7eb] rounded-lg h-11',
                }}
                isInvalid={!!error}
              />
            </div>

            <div>
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isRequired
                variant="flat"
                className="w-full"
                classNames={{
                  label: 'text-[#374151] text-sm font-medium mb-1.5',
                  input: 'text-sm',
                  inputWrapper: 'bg-[#f9fafb] border border-[#e5e7eb] rounded-lg h-11',
                }}
                isInvalid={!!error}
                endContent={
                  <button className="focus:outline-none p-1" type="button" onClick={togglePasswordVisibility}>
                    {showPassword ? <EyeSlashIcon className="h-4 w-4 text-gray-400" /> : <EyeIcon className="h-4 w-4 text-gray-400" />}
                  </button>
                }
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between py-1">
              <Link href="/forgot-password" className="text-[#0075e6] text-xs font-medium hover:underline">
                Lupa password?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button type="submit" className="w-full bg-[#0075e6] text-white font-normal text-sm rounded-xl h-10 shadow-sm" isLoading={isLoading} disabled={!email || !password}>
              {isLoading ? 'Masuk...' : 'Masuk'}
            </Button>
          </form>

          {/* Divider */}
          <div className="border-t border-[#f3f4f6] pt-5 mb-6">
            <p className="text-center text-[#6b7280] text-xs">
              Belum punya akun?{' '}
              <Link href="/register" className="text-[#0075e6] font-semibold hover:underline">
                Daftar
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Footer */}
      <div className="text-center mt-6">
        <p className="text-[#737373] text-sm">© 2025 Mathzy. Semua hak dilindungi.</p>
      </div>
    </div>
  );
}
