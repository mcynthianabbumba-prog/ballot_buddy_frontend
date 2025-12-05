import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { verificationAPI } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';

const verifyOTPSchema = z.object({
  regNo: z.string().min(1, 'Registration number is required'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type VerifyOTPFormData = z.infer<typeof verifyOTPSchema>;

const VoterOTPPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [regNo, setRegNo] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const verifyOTPForm = useForm<VerifyOTPFormData>({
    resolver: zodResolver(verifyOTPSchema),
    defaultValues: {
      regNo: '',
      otp: '',
    },
  });

  useEffect(() => {
    // Get registration number from location state or navigate back if missing
    const stateRegNo = (location.state as { regNo?: string })?.regNo;
    if (stateRegNo) {
      setRegNo(stateRegNo);
      verifyOTPForm.setValue('regNo', stateRegNo);
    } else {
      // If no regNo in state, redirect back to login
      toast.error('Please enter your registration number first');
      navigate('/login', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, navigate]);

  const onVerifyOTP = async (data: VerifyOTPFormData) => {
    if (!data.regNo || !data.otp) {
      toast.error('Registration number and OTP are required');
      return;
    }
    
    setLoading(true);
    try {
      // Normalize registration number to uppercase
      const normalizedRegNo = data.regNo.trim().toUpperCase();
      const response = await verificationAPI.confirmOTP(normalizedRegNo, data.otp);
      if (response?.ballotToken) {
        localStorage.setItem('ballotToken', response.ballotToken);
        toast.success('Verification successful! Redirecting to voting...');
        navigate('/vote', { state: { ballotToken: response.ballotToken } });
      } else {
        toast.error('Invalid response from server');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Invalid OTP';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!regNo) {
      toast.error('Registration number is required');
      return;
    }
    
    try {
      // Normalize registration number to uppercase
      const normalizedRegNo = regNo.trim().toUpperCase();
      await verificationAPI.requestOTP(normalizedRegNo);
      toast.success('New OTP sent to your phone via SMS!');
    } catch (err: any) {
      if (err.response?.status === 429) {
        const errorMessage = err.response?.data?.error || 'Too many requests';
        const errorHint = err.response?.data?.hint || `Please wait ${err.response?.data?.retryAfter || 60} seconds before trying again`;
        toast.error(`${errorMessage}. ${errorHint}`);
      } else {
        toast.error(err.response?.data?.error || 'Failed to resend OTP');
      }
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
        <Card className="w-full max-w-md shadow-2xl border-2 border-pink-200 bg-white rounded-2xl sm:rounded-3xl">
          <CardHeader className="space-y-2 sm:space-y-3 text-center pb-4 sm:pb-6 px-4 sm:px-6 pt-6 sm:pt-8">
            <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-br from-pink-500 via-rose-600 to-pink-700 text-white shadow-xl">
              <svg className="h-10 w-10 sm:h-12 sm:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Enter OTP
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Enter the 6-digit OTP sent to your phone
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
            <form onSubmit={verifyOTPForm.handleSubmit(onVerifyOTP)} className="space-y-6">
              {/* Hidden input for regNo to ensure it's included in form submission */}
              <input type="hidden" {...verifyOTPForm.register('regNo')} />
              
              {regNo && (
                <div className="p-4 bg-pink-50 border-2 border-pink-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <svg className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

              <div className="space-y-2">
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
                    verifyOTPForm.formState.errors.otp ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 hover:border-pink-300'
                  }`}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    verifyOTPForm.setValue('otp', value);
                  }}
                  autoFocus
                />
                {verifyOTPForm.formState.errors.otp && (
                  <p className="text-sm text-red-600">{verifyOTPForm.formState.errors.otp.message}</p>
                )}
              </div>

              <div className="flex gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12 sm:h-14 rounded-xl border-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm sm:text-base"
                  onClick={() => navigate('/login', { replace: true })}
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
                onClick={handleResendOTP}
              >
                Resend OTP
              </Button>
            </form>

            <div className="mt-8 text-center space-y-3">
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

export default VoterOTPPage;

