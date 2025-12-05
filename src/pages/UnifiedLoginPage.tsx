import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authAPI, verificationAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import Logo from '../components/ui/Logo';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const voterRegSchema = z.object({
  regNo: z.string().min(1, 'Registration number is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type VoterRegFormData = z.infer<typeof voterRegSchema>;

const UnifiedLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<'user' | 'voter'>('user');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const voterForm = useForm<VoterRegFormData>({
    resolver: zodResolver(voterRegSchema),
    defaultValues: {
      regNo: '',
    },
  });

  const onUserLogin = async (data: LoginFormData) => {
    if (!data.email || !data.password) {
      setError('Email and password are required');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(data.email.trim().toLowerCase(), data.password);
      
      if (!response?.token || !response?.user) {
        setError('Invalid response from server');
        setLoading(false);
        return;
      }
      
      // Check if account is deactivated
      if (response.user.role === 'OFFICER' && response.user.status === 'INACTIVE') {
        setError('Your account has been deactivated. Please contact the administrator for assistance.');
        setLoading(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return;
      }

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      const userName = response.user.name || response.user.email.split('@')[0];
      const welcomeEmoji = response.user.role === 'ADMIN' ? '👑' : response.user.role === 'OFFICER' ? '📋' : '🎯';
      
      localStorage.setItem('welcomeMessage', JSON.stringify({
        message: `Welcome back, ${userName}! ${welcomeEmoji}`,
        timestamp: Date.now()
      }));

      // Route based on role
      if (response.user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (response.user.role === 'OFFICER') {
        navigate('/officer/dashboard', { replace: true });
      } else if (response.user.role === 'CANDIDATE') {
        navigate('/candidate/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Login failed. Please try again.';
      if (errorMessage.includes('inactive') || errorMessage.includes('deactivated')) {
        setError('Your account has been deactivated. Please contact the administrator for assistance.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const onVoterLogin = async (data: VoterRegFormData) => {
    if (!data.regNo || data.regNo.trim() === '') {
      setError('Registration number is required');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      await verificationAPI.requestOTP(data.regNo.trim().toUpperCase());
      toast.success('OTP sent to your phone! Check your SMS.', { duration: 4000 });
      
      // Navigate to OTP page with registration number
      navigate('/login/otp', { 
        state: { regNo: data.regNo.trim().toUpperCase() },
        replace: true 
      });
    } catch (err: any) {
      if (err.response?.status === 429) {
        const errorMessage = err.response?.data?.error || 'Too many requests';
        const errorHint = err.response?.data?.hint || `Please wait ${err.response?.data?.retryAfter || 60} seconds before trying again`;
        setError(`${errorMessage}. ${errorHint}`);
      } else {
        const errorMessage = err.response?.data?.error || err.message || 'Failed to send OTP';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Pink Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-pink-50 rounded-2xl mb-4">
              <Logo size="lg" showText={false} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              <span className="text-pink-600">Login</span>
            </h1>
            <p className="text-gray-600">Sign in to access your dashboard</p>
          </div>

          {/* Login Type Toggle */}
          <div className="mb-6 bg-pink-50 rounded-xl p-1 border-2 border-pink-200">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => {
                  setLoginType('user');
                  setError('');
                  loginForm.reset();
                  voterForm.reset();
                }}
                className={`py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                  loginType === 'user'
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-pink-600'
                }`}
              >
                Admin/Officer/Candidate
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginType('voter');
                  setError('');
                  loginForm.reset();
                  voterForm.reset();
                }}
                className={`py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                  loginType === 'voter'
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-pink-600'
                }`}
              >
                Voter
              </button>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white border-2 border-pink-200 rounded-2xl shadow-xl p-8">
            {loginType === 'user' ? (
              <form onSubmit={loginForm.handleSubmit(onUserLogin)} className="space-y-6">
                {error && (
                  <div className="p-4 text-sm text-red-700 bg-red-50 border-2 border-red-200 rounded-xl">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@organization.com"
                    {...loginForm.register('email')}
                    className={`h-12 rounded-xl border-2 transition-all ${
                      loginForm.formState.errors.email ? 'border-red-300' : 'border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                    }`}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-red-600">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      {...loginForm.register('password')}
                      className={`h-12 rounded-xl pr-12 border-2 transition-all ${
                        loginForm.formState.errors.password ? 'border-red-300' : 'border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-600 transition-colors p-1"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <div className="mt-4 space-y-2 text-center">
                  <Link
                    to="/forgot-password"
                    className="block text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors"
                  >
                    Forgot Password?
                  </Link>
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link
                      to="/candidate/register"
                      className="text-pink-600 hover:text-pink-700 font-semibold transition-colors"
                    >
                      Register as Candidate
                    </Link>
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={voterForm.handleSubmit(onVoterLogin)} className="space-y-6">
                {error && (
                  <div className="p-4 text-sm text-red-700 bg-red-50 border-2 border-red-200 rounded-xl">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="regNo" className="text-sm font-semibold text-gray-700">
                    Registration Number
                  </Label>
                  <Input
                    id="regNo"
                    type="text"
                    placeholder="M24B13/054"
                    {...voterForm.register('regNo')}
                    className={`h-12 rounded-xl border-2 transition-all ${
                      voterForm.formState.errors.regNo ? 'border-red-300' : 'border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                    }`}
                  />
                  {voterForm.formState.errors.regNo && (
                    <p className="text-sm text-red-600">{voterForm.formState.errors.regNo.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-xl transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending OTP...
                    </span>
                  ) : (
                    'Send OTP'
                  )}
                </Button>

                <div className="p-4 bg-pink-50 border-2 border-pink-200 rounded-xl">
                  <p className="text-xs text-pink-800 leading-relaxed">
                    <strong>Note:</strong> OTP will be sent to your phone number via SMS. The code expires in <strong>5 minutes</strong>.
                  </p>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm text-gray-600 hover:text-pink-600 transition-colors inline-flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLoginPage;

