'use client';

import { useState } from 'react';
import DiscoveryWelcome from '@/components/DiscoveryWelcome';
import DiscoveryFlow from '@/components/DiscoveryFlow';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'discovery'>('welcome');

  return (
    <div className="min-h-screen">
      {currentStep === 'welcome' && (
        <DiscoveryWelcome onStart={() => setCurrentStep('discovery')} />
      )}
      {currentStep === 'discovery' && (
        <DiscoveryFlow />
      )}
    </div>
  );
}
