'use client';

import { useState } from 'react';
import PrimaryButton from '@/components/ui/primary-button';
import ClientThemeVars from '@/components/ui/ClientThemeVars';

interface DiscoveryWelcomeProps {
  onStart: () => void;
}

export default function DiscoveryWelcome({ onStart }: DiscoveryWelcomeProps) {
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [userAge, setUserAge] = useState<'adult' | 'minor' | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleStart = () => {
    if (!acceptedPrivacy) {
      alert('Please accept the privacy policy to continue');
      return;
    }
    onStart();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientThemeVars />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <img src="/logos/nesolagus-horizontal.png" alt="Warren" className="h-10" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-7">
            <div className="mb-8">
              <h1 className="text-3xl font-medium text-gray-900 mb-4">
                Community Engagement Discovery
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Transform your stakeholder engagement strategy with our streamlined discovery process. 
                Get actionable insights and a custom Statement of Work in minutes.
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-blue-900">Enterprise-grade security:</span> Unlike generic survey tools, Warren is purpose-built for sensitive community data with SOC 2 equivalent controls and privacy-by-design architecture.
                </p>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  5-7 minutes
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Strategic insights
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Instant SOW generation
                </div>
              </div>
            </div>

            {/* What You'll Get */}
            <div className="mb-8">
              <h2 className="text-xl font-medium text-gray-900 mb-4">What you'll discover</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <span className="text-green-600 text-sm font-medium">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Stakeholder Landscape</h3>
                    <p className="text-gray-600 text-sm">Map all community players and their engagement levels</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <span className="text-green-600 text-sm font-medium">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Strategic Alignment</h3>
                    <p className="text-gray-600 text-sm">Connect your objectives with community needs and priorities</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                    <span className="text-green-600 text-sm font-medium">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Actionable Roadmap</h3>
                    <p className="text-gray-600 text-sm">Receive a comprehensive Statement of Work with next steps</p>
                  </div>
                </div>
              </div>
              
              {/* Preview Sample */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="text-xs text-green-700 font-medium mb-2">SAMPLE DELIVERABLE</div>
                <div className="text-sm font-medium text-gray-900 mb-1">Strategic Implementation Framework</div>
                <div className="text-xs text-gray-600 mb-3">Multi-channel communication strategies, inclusive participation design, and phased implementation methodology...</div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">8-section comprehensive report</div>
                  <div className="text-xs text-green-600 font-medium">Generated in 5 minutes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-medium text-gray-900 mb-4">Get Started</h3>
              
              {/* Age Verification */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Age verification</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="age"
                      className="mr-3"
                      onChange={() => setUserAge('adult')}
                      style={{ accentColor: '#64B37A' }}
                    />
                    <span className="text-sm text-gray-700">18 years or older</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="age"
                      className="mr-3"
                      onChange={() => setUserAge('minor')}
                      style={{ accentColor: '#64B37A' }}
                    />
                    <span className="text-sm text-gray-700">Under 18 years</span>
                  </label>
                </div>
                {userAge === 'minor' && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                    ⚠️ Additional parental consent may be required under COPPA and FERPA regulations.
                  </div>
                )}
              </div>

              {/* Privacy Compliance */}
              <div className="mb-6">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    className="mt-1"
                    checked={acceptedPrivacy}
                    onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                    style={{ accentColor: '#64B37A' }}
                  />
                  <label htmlFor="privacy" className="text-sm text-gray-700 flex-1">
                    I agree to the{' '}
                    <button
                      type="button"
                      className="text-green-600 underline hover:text-green-700"
                      onClick={() => setShowPrivacyModal(true)}
                    >
                      Privacy Policy
                    </button>
                    {' '}and data protection terms.
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="font-medium text-blue-700">Full compliance:</span> GDPR, COPPA, FERPA • SOC 2 security • Zero data sales • Export your data anytime
                    </div>
                  </label>
                </div>
              </div>

              {/* Start Button */}
              <PrimaryButton
                onClick={handleStart}
                disabled={!acceptedPrivacy || !userAge}
                className={`w-full py-3 ${
                  !acceptedPrivacy || !userAge ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Start Discovery Process
              </PrimaryButton>
              
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500">
                  Get a comprehensive Discovery Scope in just 5 minutes • Free consultation included (yes, with a real human!)
                </p>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  256-bit encryption
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Zero data sales
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  SOC 2 controls
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Privacy Policy</h2>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4 text-sm text-gray-700">
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">Data Collection & Processing (GDPR Compliant)</h3>
                  <p>We collect only necessary information for discovery purposes. You have the right to access, rectify, erase, restrict processing, and data portability under GDPR.</p>
                </section>
                
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">Youth Data Protection (COPPA/FERPA)</h3>
                  <p>For users under 18, we comply with COPPA and FERPA regulations. Parental consent may be required. Educational data is handled with enhanced security measures.</p>
                </section>
                
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">Connecticut State Compliance</h3>
                  <p>We comply with Connecticut data protection laws including the Connecticut Data Privacy Act requirements for transparent data handling.</p>
                </section>
                
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">Security Measures (SOC 2 Equivalent)</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>End-to-end encryption for all data transmission</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>Access controls and audit logging</li>
                    <li>Data minimization and retention policies</li>
                    <li>Incident response procedures</li>
                  </ul>
                </section>
                
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">Your Rights</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Right to access your personal data</li>
                    <li>Right to correct inaccurate data</li>
                    <li>Right to delete your data</li>
                    <li>Right to restrict processing</li>
                    <li>Right to data portability</li>
                    <li>Right to withdraw consent</li>
                  </ul>
                </section>
                
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                  <p>For privacy questions or to exercise your rights, contact our Data Protection Officer at privacy@warren.tools</p>
                </section>
              </div>
              
              <div className="mt-6 text-center">
                <PrimaryButton
                  onClick={() => setShowPrivacyModal(false)}
                  className="px-6 py-2"
                >
                  Close
                </PrimaryButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}