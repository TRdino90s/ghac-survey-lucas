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
    <section className="p-6 space-y-6">
      <div className="max-w-4xl mx-auto">
        <ClientThemeVars />
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img src="/logos/nesolagus-horizontal.png" alt="Warren" className="h-12" />
          </div>
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            Discovery Tool
          </h1>
          <p className="text-lg text-gray-600 mb-2">Community Engagement Discovery</p>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Streamline your discovery process to identify stakeholder needs, map objectives, 
            and create actionable insights for strategic planning initiatives.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="warren-card text-center">
            <div className="w-4 h-4 mx-auto mb-4 rounded" style={{ backgroundColor: 'var(--brand-from, #64B37A)' }}></div>
            <h3 className="font-semibold text-gray-900 mb-2">Stakeholder Mapping</h3>
            <p className="text-gray-600 text-sm">Identify and analyze all community stakeholders and their engagement levels</p>
          </div>
          
          <div className="warren-card text-center">
            <div className="w-4 h-4 mx-auto mb-4 rounded" style={{ backgroundColor: 'var(--brand-from, #64B37A)' }}></div>
            <h3 className="font-semibold text-gray-900 mb-2">Objective Alignment</h3>
            <p className="text-gray-600 text-sm">Map project objectives to stakeholder needs and community priorities</p>
          </div>
          
          <div className="warren-card text-center">
            <div className="w-4 h-4 mx-auto mb-4 rounded" style={{ backgroundColor: 'var(--brand-from, #64B37A)' }}></div>
            <h3 className="font-semibold text-gray-900 mb-2">SOW Generation</h3>
            <p className="text-gray-600 text-sm">Generate comprehensive statements of work from discovery insights</p>
          </div>
        </div>

        {/* Privacy Compliance Section */}
        <div className="mb-8 warren-card" style={{ backgroundColor: '#E6F4EA' }}>
          <h3 className="font-semibold text-gray-900 mb-4">Data Privacy & Security</h3>
          
          {/* Age Verification for COPPA/FERPA Compliance */}
          <div className="mb-4">
            <p className="text-sm text-gray-700 mb-2">Age verification (required for youth data protection):</p>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="age"
                  className="mr-2"
                  onChange={() => setUserAge('adult')}
                />
                <span className="text-sm">18 years or older</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="age"
                  className="mr-2"
                  onChange={() => setUserAge('minor')}
                />
                <span className="text-sm">Under 18 years</span>
              </label>
            </div>
            {userAge === 'minor' && (
              <div className="mt-2 p-3 bg-yellow-100 border border-yellow-300 rounded text-sm">
                ⚠️ Additional parental consent may be required under COPPA and FERPA regulations. 
                Please ensure proper authorization before proceeding.
              </div>
            )}
          </div>

          {/* Privacy Policy Acceptance */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="privacy"
              className="mt-1"
              checked={acceptedPrivacy}
              onChange={(e) => setAcceptedPrivacy(e.target.checked)}
            />
            <label htmlFor="privacy" className="text-sm text-gray-700 flex-1">
              I acknowledge that I have read and agree to the{' '}
              <button
                type="button"
                className="underline font-medium"
                style={{ color: '#64B37A' }}
                onClick={() => setShowPrivacyModal(true)}
              >
                Privacy Policy
              </button>
              , including GDPR, COPPA, FERPA, and Connecticut data protection requirements.
              <br />
              <span className="text-xs text-gray-600 mt-1 block">
                We employ SOC 2 equivalent security measures and never sell personal data.
              </span>
            </label>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <PrimaryButton
            onClick={handleStart}
            disabled={!acceptedPrivacy || !userAge}
            className={`px-8 py-4 text-lg ${
              !acceptedPrivacy || !userAge ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Begin Discovery Process
          </PrimaryButton>
          <p className="text-sm text-gray-600 mt-4">
            Takes approximately 10-15 minutes
          </p>
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
    </section>
  );
}