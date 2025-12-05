import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import Logo from '../components/ui/Logo';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

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
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
              Your trusted digital voting platform. Secure, transparent, and designed for modern democracy.
            </p>

            {/* Role Selection - Vertical Stacked Layout */}
            <div className="space-y-4 max-w-md mx-auto mb-16">
              {/* Voters */}
              <div className="group relative">
                <div className="absolute inset-0 bg-pink-100 rounded-2xl transform group-hover:scale-[1.02] transition-transform duration-300" />
                <div className="relative bg-white border-2 border-pink-200 rounded-2xl p-6 hover:border-pink-400 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                        <svg className="w-6 h-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold text-gray-900">Cast Your Vote</h3>
                        <p className="text-sm text-gray-500">Verify and vote securely</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => navigate('/verify')}
                      className="bg-pink-600 hover:bg-pink-700 text-white px-6"
                    >
                      Vote Now
                    </Button>
                  </div>
                </div>
              </div>

              {/* Candidates */}
              <div className="group relative">
                <div className="absolute inset-0 bg-pink-50 rounded-2xl transform group-hover:scale-[1.02] transition-transform duration-300" />
                <div className="relative bg-white border-2 border-pink-200 rounded-2xl p-6 hover:border-pink-400 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                        <svg className="w-6 h-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold text-gray-900">Candidate Portal</h3>
                        <p className="text-sm text-gray-500">Submit nominations</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => navigate('/candidate/register')}
                        className="border-pink-300 text-pink-600 hover:bg-pink-50"
                      >
                        Register
                      </Button>
                      <Button
                        onClick={() => navigate('/candidate/login')}
                        className="bg-pink-600 hover:bg-pink-700 text-white"
                      >
                        Login
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Officers */}
              <div className="group relative">
                <div className="absolute inset-0 bg-pink-50 rounded-2xl transform group-hover:scale-[1.02] transition-transform duration-300" />
                <div className="relative bg-white border-2 border-pink-200 rounded-2xl p-6 hover:border-pink-400 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                        <svg className="w-6 h-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold text-gray-900">Officer Login</h3>
                        <p className="text-sm text-gray-500">Manage elections</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => navigate('/admin/login')}
                      className="bg-pink-600 hover:bg-pink-700 text-white px-6"
                    >
                      Login
                    </Button>
                  </div>
                </div>
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