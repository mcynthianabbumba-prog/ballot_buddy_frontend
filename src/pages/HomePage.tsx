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


const unifiedLoginSchema = z.object({
  email: z.string().optional(),
  password: z.string().optional(),
  regNo: z.string().optional(),
}).refine((data) => {
  // Either email+password OR regNo must be provided
  const hasEmailPassword = data.email && data.password;
  const hasRegNo = data.regNo && data.regNo.trim() !== '';
  return hasEmailPassword || hasRegNo;
}, {
  message: 'Please enter either email and password, or registration number',
  path: ['email'],
});

type UnifiedLoginFormData = z.infer<typeof unifiedLoginSchema>;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const loginForm = useForm<UnifiedLoginFormData>({
    resolver: zodResolver(unifiedLoginSchema),
    defaultValues: {
      email: '',
      password: '',
      regNo: '',
    },
  });

  const onUnifiedLogin = async (data: UnifiedLoginFormData) => {
    setError('');
    setLoading(true);

    // Determine login type based on what's filled
    const hasEmailPassword = data.email && data.password && data.email.trim() !== '' && data.password.trim() !== '';
    const hasRegNo = data.regNo && data.regNo.trim() !== '';

    if (hasEmailPassword) {
      // User login (Admin/Officer/Candidate)
      try {
        const response = await authAPI.login(data.email!.trim().toLowerCase(), data.password!);
        
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
        setLoading(false);
      }
    } else if (hasRegNo) {
      // Voter login
      try {
        await verificationAPI.requestOTP(data.regNo!.trim().toUpperCase());
        toast.success('OTP sent to your phone! Check your SMS.', { duration: 4000 });
        
        // Navigate to OTP page with registration number
        navigate('/login/otp', { 
          state: { regNo: data.regNo!.trim().toUpperCase() },
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
        setLoading(false);
      }
    } else {
      setError('Please enter either email and password, or registration number');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative Pink Shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-50 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-50 rounded-full blur-3xl opacity-20" />
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-20 border-b border-pink-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" showText={true} />
            <div className="hidden md:flex items-center gap-6">
              <a href="#about" className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">
                About
              </a>
              <a href="#features" className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">
                Features
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section - Vertical Layout */}
        <section className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <div className="p-6 bg-pink-50 rounded-3xl inline-block">
                <Logo size="lg" showText={false} />
              </div>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 leading-tight">
              <span className="text-pink-600">BALLOT</span> BUDDY
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Your trusted digital voting platform. Secure, transparent, and designed for modern democracy.
            </p>

            {/* Unified Login Form */}
            <div className="max-w-md mx-auto mb-16">
              <div className="bg-white border-2 border-pink-200 rounded-2xl shadow-xl p-8">
                <form onSubmit={loginForm.handleSubmit(onUnifiedLogin)} className="space-y-6">
                  {error && (
                    <div className="p-4 text-sm text-red-700 bg-red-50 border-2 border-red-200 rounded-xl">
                      {error}
                    </div>
                  )}

                  {/* Email and Password Fields */}
                  <div className="space-y-4 pb-4 border-b border-pink-100">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                        Email Address (Admin/Officer/Candidate)
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
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-pink-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
                    </div>
                  </div>

                  {/* Registration Number Field for Voters */}
                  <div className="space-y-2 pt-4">
                    <Label htmlFor="regNo" className="text-sm font-semibold text-gray-700">
                      Registration Number (Voter)
                    </Label>
                    <Input
                      id="regNo"
                      type="text"
                      placeholder="M24B13/054"
                      {...loginForm.register('regNo')}
                      className={`h-12 rounded-xl border-2 transition-all ${
                        loginForm.formState.errors.regNo ? 'border-red-300' : 'border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                      }`}
                    />
                    {loginForm.formState.errors.regNo && (
                      <p className="text-sm text-red-600">{loginForm.formState.errors.regNo.message}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Enter your registration number to receive OTP via SMS
                    </p>
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
                        {loginForm.watch('regNo') && loginForm.watch('regNo')!.trim() !== '' ? 'Sending OTP...' : 'Signing in...'}
                      </span>
                    ) : (
                      loginForm.watch('regNo') && loginForm.watch('regNo')!.trim() !== '' ? 'Send OTP' : 'Sign In'
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
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Horizontal Cards */}
        <section id="features" className="bg-pink-50/50 py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              Why Choose <span className="text-pink-600">Ballot Buddy</span>?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl p-8 border border-pink-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-pink-100 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Secure</h3>
                <p className="text-gray-600">Bank-level encryption ensures your vote is protected and private.</p>
              </div>
              <div className="bg-white rounded-2xl p-8 border border-pink-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-pink-100 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Transparent</h3>
                <p className="text-gray-600">Full audit trail and real-time results for complete transparency.</p>
              </div>
              <div className="bg-white rounded-2xl p-8 border border-pink-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-pink-100 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Fast</h3>
                <p className="text-gray-600">Cast your vote in seconds with our streamlined interface.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-pink-100 py-8">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-600 text-sm">
              © 2024 Ballot Buddy. Secure • Transparent • Democratic
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;