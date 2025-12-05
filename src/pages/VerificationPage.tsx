import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { verificationAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';

const requestOTPSchema = z.object({
  regNo: z.string().min(1, 'Registration number is required'),
});

const verifyOTPSchema = z.object({
  regNo: z.string().min(1, 'Registration number is required'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type RequestOTPFormData = z.infer<typeof requestOTPSchema>;
type VerifyOTPFormData = z.infer<typeof verifyOTPSchema>;

const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [regNo, setRegNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const requestOTPForm = useForm<RequestOTPFormData>({
    resolver: zodResolver(requestOTPSchema),
  });

  const verifyOTPForm = useForm<VerifyOTPFormData>({
    resolver: zodResolver(verifyOTPSchema),
  });

  const onRequestOTP = async (data: RequestOTPFormData) => {
    setLoading(true);
    try {
      await verificationAPI.requestOTP(data.regNo);
      setRegNo(data.regNo);
      setOtpSent(true);
      
      // Show success message
      toast.success('OTP sent to your phone! Check your SMS.', { duration: 4000 });
      
      // Always proceed to verify step
      setStep('verify');
      verifyOTPForm.setValue('regNo', data.regNo);
      
      // Auto-focus OTP input after a short delay
      setTimeout(() => {
        const otpInput = document.getElementById('otp');
        if (otpInput) {
          otpInput.focus();
        }
      }, 300);
    } catch (err: any) {
      if (err.response?.status === 429) {
        // Rate limit error - show retry time
        const errorMessage = err.response?.data?.error || 'Too many requests';
        const errorHint = err.response?.data?.hint || `Please wait ${err.response?.data?.retryAfter || 60} seconds before trying again`;
        toast.error(errorMessage, { duration: 8000 });
        if (errorHint) {
          toast.error(errorHint, { duration: 7000 });
        }
      } else {
        const errorMessage = err.response?.data?.error || 'Failed to send OTP';
        const errorHint = err.response?.data?.hint;
        
        toast.error(errorMessage, { 
          duration: 6000
        });
        if (errorHint) {
          toast.error(errorHint, { duration: 5000 });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOTP = async (data: VerifyOTPFormData) => {
    setLoading(true);
    try {
      const response = await verificationAPI.confirmOTP(data.regNo, data.otp);
      localStorage.setItem('ballotToken', response.ballotToken);
      toast.success('Verification successful! Redirecting to voting...');
      navigate('/vote', { state: { ballotToken: response.ballotToken } });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="flex items-center justify-center min-h-screen py-8 sm:py-12 px-4 relative z-10">
        <Card className="w-full max-w-md shadow-2xl border-2 border-pink-200 bg-white rounded-2xl sm:rounded-3xl animate-bounce-in transform transition-all duration-300 hover:shadow-pink-500/20 hover:scale-[1.02]">
          <CardHeader className="space-y-2 sm:space-y-3 text-center pb-4 sm:pb-6 px-4 sm:px-6 pt-6 sm:pt-8">
            <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-br from-pink-500 via-rose-600 to-pink-700 text-white shadow-xl animate-float hover:scale-110 transition-transform duration-300 cursor-pointer">
              <svg className="h-10 w-10 sm:h-12 sm:w-12" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="verifyPink1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="100%" stopColor="#FCE7F3" />
                  </linearGradient>
                </defs>
                {/* Laptop Screen */}
                <rect x="25" y="20" width="50" height="35" rx="2" fill="#1F2937"/>
                <rect x="27" y="22" width="46" height="31" rx="1" fill="#FFFFFF"/>
                
                {/* Ballot Box on Screen */}
                <rect x="40" y="28" width="20" height="22" rx="1.5" fill="url(#verifyPink1)"/>
                <rect x="42" y="30" width="16" height="18" rx="1" fill="currentColor" opacity="0.3"/>
                {/* Ballot Box Slot */}
                <rect x="42" y="26" width="16" height="2.5" rx="1.25" fill="#1F2937"/>
                
                {/* Ballot Paper */}
                <rect x="60" y="15" width="6" height="14" rx="0.8" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.5"/>
                <rect x="61.5" y="17" width="1.5" height="1.5" rx="0.3" fill="none" stroke="#9CA3AF" strokeWidth="0.5"/>
                <path d="M61.5 17.5L62.5 18.5L64 17" stroke="#10B981" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                
                {/* Hand (simplified) */}
                <ellipse cx="63" cy="12" rx="2.5" ry="2" fill="#FBBF24" opacity="0.9"/>
              </svg>
            </div>
            <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              Voter Verification
            </CardTitle>
            <CardDescription className="text-sm sm:text-base animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              {step === 'request'
                ? 'Enter your registration number to receive an OTP via SMS'
                : 'Enter the OTP sent to your phone'}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
            {step === 'request' ? (
              <form onSubmit={requestOTPForm.handleSubmit(onRequestOTP)} className="space-y-4 sm:space-y-6">
                <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                  <Label htmlFor="regNo" className="text-sm font-semibold text-gray-700">Registration Number</Label>
                  <Input
                    id="regNo"
                    type="text"
                    placeholder="M24B13/054"
                    {...requestOTPForm.register('regNo')}
                    className={`h-12 sm:h-14 rounded-xl border-2 transition-all duration-300 focus:scale-[1.02] focus:border-pink-500 focus:ring-4 focus:ring-pink-200 ${
                      requestOTPForm.formState.errors.regNo ? 'border-red-500 focus:ring-red-200 animate-wiggle' : 'border-gray-200 hover:border-pink-300'
                    }`}
                    aria-invalid={requestOTPForm.formState.errors.regNo ? 'true' : 'false'}
                    aria-describedby={requestOTPForm.formState.errors.regNo ? 'regNo-error' : undefined}
                  />
                  {requestOTPForm.formState.errors.regNo && (
                    <p id="regNo-error" className="text-sm text-red-600 animate-slide-in-right">
                      {requestOTPForm.formState.errors.regNo.message}
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 sm:h-14 bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-700 hover:via-rose-700 hover:to-pink-800 text-white font-bold text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl transform hover:scale-[1.02] active:scale-[0.98] hover:-translate-y-1 animate-fade-in-up" 
                  style={{ animationDelay: '0.5s', animationFillMode: 'both' }}
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
                    'Request OTP '
                  )}
                </Button>

                <div className="p-4 bg-pink-50 border-2 border-pink-200 rounded-xl animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
                  <p className="text-xs text-pink-800 leading-relaxed">
                    <strong>Note:</strong> OTP will be sent to your phone number via SMS. The code expires in <strong>5 minutes</strong>.
                  </p>
                </div>
              </form>
            ) : (
              <form onSubmit={verifyOTPForm.handleSubmit(onVerifyOTP)} className="space-y-6">
                {otpSent && (
                  <div className="p-4 bg-pink-50 border-2 border-pink-200 rounded-xl animate-slide-in-right">
                    <div className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0 animate-bounce-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-pink-800">
                          OTP sent to your phone! ✅
                        </p>
                        <p className="text-xs text-pink-600 mt-1">
                          Registration: <strong>{regNo}</strong>
                        </p>
                        <p className="text-xs text-pink-600 mt-1">
                          Check your SMS and enter the 6-digit code below
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                  <Label htmlFor="otp" className="text-sm font-semibold text-gray-700">Enter 6-Digit OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    {...verifyOTPForm.register('otp', {
                      pattern: {
                        value: /^\d{6}$/,
                        message: 'OTP must be 6 digits',
                      },
                    })}
                    className={`h-14 sm:h-16 rounded-xl text-center text-2xl sm:text-3xl tracking-[0.3em] sm:tracking-[0.5em] font-bold border-2 transition-all duration-300 focus:scale-[1.02] focus:border-pink-500 focus:ring-4 focus:ring-pink-200 ${
                      verifyOTPForm.formState.errors.otp ? 'border-red-500 focus:ring-red-200 animate-wiggle' : 'border-gray-200 hover:border-pink-300'
                    }`}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      verifyOTPForm.setValue('otp', value);
                    }}
                    aria-invalid={verifyOTPForm.formState.errors.otp ? 'true' : 'false'}
                    aria-describedby={verifyOTPForm.formState.errors.otp ? 'otp-error' : undefined}
                  />
                  {verifyOTPForm.formState.errors.otp && (
                    <p id="otp-error" className="text-sm text-red-600 animate-slide-in-right">
                      {verifyOTPForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 sm:gap-3 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12 sm:h-14 rounded-xl border-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm sm:text-base"
                    onClick={() => {
                      setStep('request');
                      setOtpSent(false);
                      verifyOTPForm.reset();
                    }}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 h-12 sm:h-14 bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-700 hover:via-rose-700 hover:to-pink-800 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:-translate-y-1 text-sm sm:text-base" 
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      'Verify OTP ✅'
                    )}
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-sm text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-105"
                  onClick={async () => {
                    try {
                      await verificationAPI.requestOTP(regNo);
                      toast.success('New OTP sent to your phone via SMS!');
                    } catch (err: any) {
                      toast.error(err.response?.data?.error || 'Failed to resend OTP');
                    }
                  }}
                >
                  Resend OTP
                </Button>
              </form>
            )}

            <div className="mt-8 text-center space-y-3 animate-fade-in-up" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center gap-2 hover:underline transition-all duration-200 hover:scale-105 group"
              >
                <svg className="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerificationPage;
