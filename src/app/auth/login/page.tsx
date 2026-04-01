'use client';


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthFromWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/SocialAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaSync } from 'react-icons/fa';

interface LoginFormData {
  email: string;
  password: string;
  captchaInput: string;
  rememberMe?: boolean;
}

interface ErrorObject {
  email?: string;
  password?: string;
  captcha?: string;
}


const VALID_EMAIL = '241712890@gmail.com';
const VALID_PASSWORD = '241712890';

const generateCaptcha = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    captchaInput: '',
  });
  const [errors, setErrors] = useState<ErrorObject>({});
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState('');

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);
  const [attempts, setAttempts] = useState(3);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setFormData(prev => ({ ...prev, captchaInput: '' }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (attempts <= 0) {
      toast.error('Kesempatan login habis!', { position: 'top-right' });
      return;
    }

    const newErrors: ErrorObject = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email tidak boleh kosong';
    } else if (formData.email !== VALID_EMAIL) {
      newErrors.email = 'Email tidak sesuai';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password tidak boleh kosong';
    } else if (formData.password !== VALID_PASSWORD) {
      newErrors.password = 'Password tidak sesuai';
    }

    if (!formData.captchaInput.trim()) {
      newErrors.captcha = 'Captcha belum diisi';
    } else if (formData.captchaInput !== captcha) {
      newErrors.captcha = 'Captcha salah';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const newAttempts = Math.max(0, attempts - 1);
      setAttempts(newAttempts);
      if (newAttempts === 0) {
        toast.error('Kesempatan login habis!', { position: 'top-right' });
      } else {
        toast.error(`Login Gagal! Sisa kesempatan ${newAttempts}`, { position: 'top-right' });
      }
      refreshCaptcha();
      return;
    }

    // nyimpen status login
    localStorage.setItem('isLoggedIn', 'true');
    toast.success('Login Berhasil!', { theme: 'dark', position: 'top-right' });
    router.push('/home');
  };

  const handleResetAttempts = () => {
    if (attempts === 0) {
      setAttempts(3);
      toast.success('Kesempatan login berhasil direset!', { position: 'top-right' });
    }
  };

  return (
    <AuthFromWrapper title="Login">
      <p className="text-center text-sm text-gray-500 mb-4">Sisa kesempatan: {attempts}</p>
      <form onSubmit={handleSubmit} className="space-y-5 w-full">

        {/* email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukan email"
          />
          {errors.email && <p className="text-red-600 text-sm italic mt-1">{errors.email}</p>}
        </div>

        {/* pw */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Masukan password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          {errors.password && <p className="text-red-600 text-sm italic mt-1">{errors.password}</p>}
        </div>

        {/* forgot password sm remember me */}
        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe || false}
              onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
              className="mr-2 h-4 w-4 rounded border-gray-300"
            />
            Ingat saya
          </label>
          <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
            Forgot password?
          </Link>
        </div>

        {/* captcha */}
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Captcha:</span>
            <span className="font-mono text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded">

              {captcha}
            </span>
            <button type="button" onClick={refreshCaptcha} className="text-blue-500 hover:text-blue-700">
              <FaSync />
            </button>
          </div>
          <input
            type="text"
            name="captchaInput"
            value={formData.captchaInput}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.captcha ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukan captcha"
          />
          {errors.captcha && <p className="text-red-600 text-sm italic mt-1">{errors.captcha}</p>}
        </div>

        {/* tombol */}
        <button
          type="submit"
          disabled={attempts === 0}
          className={`w-full font-semibold py-2.5 px-4 rounded-lg text-white transition-colors ${
            attempts === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Sign In
        </button>

        {/* reset kesempatan */}
        <button
          type="button"
          onClick={handleResetAttempts}
          disabled={attempts > 0}
          className={`w-full font-semibold py-2.5 px-4 rounded-lg text-white transition-colors ${
            attempts === 0
              ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Reset Kesempatan
        </button>

        <SocialAuth />

        <p className="mt-6 text-center text-sm text-gray-600">
          Tidak punya akun?{' '}
          <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-semibold">
            Daftar
          </Link>
        </p>
      </form>
    </AuthFromWrapper>
  );
};

export default LoginPage;