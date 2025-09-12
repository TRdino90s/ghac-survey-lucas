'use client';

import { useState } from 'react';
import type { DiscoveryOutline } from '@warren/data-models';
import StepHelper from './StepHelper';
import AISuggestionEngine from './AISuggestionEngine';
import DiscoveryReportGenerator from './DiscoveryReportGenerator';
import PrimaryButton from '@/components/ui/primary-button';
import AppHeader from '@/components/ui/app-header';
import ClientThemeVars from '@/components/ui/ClientThemeVars';

interface DiscoveryData {
  client_name: string;
  project_title: string;
  industry: string;
  sector: 'educators' | 'nonprofits' | 'campaigns' | 'cities' | 'political' | 'other' | '';
  custom_sector: string;
  voice_type: 'personal' | 'organizational' | '';
  voice_style: string;
  voice_description: string;
  objectives: string[];
  target_audience: string[];
  pain_points: string[];
  success_metrics: string[];
  timeline: string;
  budget_range: string;
  discovery_notes: string;
}

export default function DiscoveryFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showReport, setShowReport] = useState(false);

  // Helper function to get effective sector for AI processing
  const getEffectiveSector = (data: DiscoveryData) => {
    return data.sector === 'other' ? data.custom_sector : data.sector;
  };
  const [discoveryData, setDiscoveryData] = useState<DiscoveryData>({
    client_name: '',
    project_title: '',
    industry: '',
    sector: '',
    custom_sector: '',
    voice_type: '',
    voice_style: '',
    voice_description: '',
    objectives: [],
    target_audience: [],
    pain_points: [],
    success_metrics: [],
    timeline: '',
    budget_range: '',
    discovery_notes: ''
  });

  const totalSteps = 8;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const updateData = (field: keyof DiscoveryData, value: any) => {
    setDiscoveryData(prev => ({ ...prev, [field]: value }));
  };

  const addToArray = (field: keyof DiscoveryData, value: string) => {
    if (value.trim()) {
      const currentArray = discoveryData[field] as string[];
      updateData(field, [...currentArray, value.trim()]);
    }
  };

  const removeFromArray = (field: keyof DiscoveryData, index: number) => {
    const currentArray = discoveryData[field] as string[];
    updateData(field, currentArray.filter((_, i) => i !== index));
  };

  const generateDiscoveryOutline = (): DiscoveryOutline => {
    return {
      ...discoveryData,
      generated_at: new Date().toISOString()
    };
  };

  const handleExport = () => {
    const outline = generateDiscoveryOutline();
    const blob = new Blob([JSON.stringify(outline, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${discoveryData.client_name || 'discovery'}-outline.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateReport = () => {
    setShowReport(true);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ProjectBasicsStep data={discoveryData} updateData={updateData} />;
      case 2:
        return <VoiceStyleStep data={discoveryData} updateData={updateData} />;
      case 3:
        return <ObjectivesStep data={discoveryData} addToArray={addToArray} removeFromArray={removeFromArray} effectiveSector={getEffectiveSector(discoveryData)} />;
      case 4:
        return <AudienceStep data={discoveryData} addToArray={addToArray} removeFromArray={removeFromArray} effectiveSector={getEffectiveSector(discoveryData)} />;
      case 5:
        return <PainPointsStep data={discoveryData} addToArray={addToArray} removeFromArray={removeFromArray} effectiveSector={getEffectiveSector(discoveryData)} />;
      case 6:
        return <SuccessMetricsStep data={discoveryData} addToArray={addToArray} removeFromArray={removeFromArray} effectiveSector={getEffectiveSector(discoveryData)} />;
      case 7:
        return <TimelineBudgetStep data={discoveryData} updateData={updateData} />;
      case 8:
        return <ReviewStep data={discoveryData} onExport={handleExport} onGenerateReport={handleGenerateReport} />;
      default:
        return null;
    }
  };

  // Show the comprehensive report if generated
  if (showReport) {
    return <DiscoveryReportGenerator data={generateDiscoveryOutline()} />;
  }

  return (
    <section className="p-6 space-y-6">
      <ClientThemeVars />
      
      <AppHeader 
        title="Discovery Process" 
        subtitle={`Step ${currentStep} of ${totalSteps} • ${Math.round(progressPercentage)}% Complete`}
      />
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{ 
            width: `${progressPercentage}%`,
            background: 'linear-gradient(90deg, var(--brand-from, #64B37A) 0%, var(--brand-to, #2F6D49) 100%)'
          }}
        />
      </div>

      {/* Step Content */}
      <div className="warren-card">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className={`px-4 py-2 text-sm font-medium rounded-lg border transition ${
            currentStep === 1 
              ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border-gray-200' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Previous
        </button>
        
        <PrimaryButton
          onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
          disabled={currentStep === totalSteps}
          className={currentStep === totalSteps ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {currentStep === totalSteps ? 'Complete' : 'Next'}
        </PrimaryButton>
      </div>
    </section>
  );
}

// Step Components
function ProjectBasicsStep({ data, updateData }: { data: DiscoveryData; updateData: (field: keyof DiscoveryData, value: any) => void }) {
  const sectorOptions = [
    { value: '', label: 'Select your sector...' },
    { value: 'educators', label: 'Education (Schools, Districts, Universities)' },
    { value: 'nonprofits', label: 'Nonprofit Organizations' },
    { value: 'campaigns', label: 'Advocacy & Campaign Organizations' },
    { value: 'cities', label: 'Municipal Government & Cities' },
    { value: 'political', label: 'Political Campaigns & Public Servants' },
    { value: 'other', label: 'Other (please specify)' }
  ];

  const industryOptions = [
    'Healthcare', 'Housing & Community Development', 'Environment & Sustainability',
    'Economic Development', 'Transportation', 'Arts & Culture', 'Social Services',
    'Criminal Justice Reform', 'Immigration', 'Youth Development', 'Senior Services',
    'Technology & Digital Equity', 'Food & Agriculture', 'Other'
  ];

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-900 mb-4">Project Basics</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Client/Organization Name</label>
        <input
          type="text"
          value={data.client_name}
          onChange={(e) => updateData('client_name', e.target.value)}
          className="warren-input"
          placeholder="Enter organization name"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
        <input
          type="text"
          value={data.project_title}
          onChange={(e) => updateData('project_title', e.target.value)}
          className="warren-input"
          placeholder="Enter project title"
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sector *</label>
          <select
            value={data.sector}
            onChange={(e) => updateData('sector', e.target.value)}
            className="warren-input"
            required
          >
            {sectorOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">This helps us provide sector-specific insights</p>
          
          {data.sector === 'other' && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Please specify your sector</label>
              <input
                type="text"
                value={data.custom_sector}
                onChange={(e) => updateData('custom_sector', e.target.value)}
                className="warren-input"
                placeholder="Describe your sector or industry"
              />
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Focus Area/Industry</label>
          <select
            value={data.industry}
            onChange={(e) => updateData('industry', e.target.value)}
            className="warren-input"
          >
            <option value="">Select focus area...</option>
            {industryOptions.map(industry => (
              <option key={industry} value={industry.toLowerCase()}>{industry}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
        <textarea
          value={data.discovery_notes}
          onChange={(e) => updateData('discovery_notes', e.target.value)}
          className="warren-input h-32"
          placeholder="Provide a brief overview of your project, the challenge you're addressing, and what success might look like..."
        />
      </div>
      
      {/* Data Handling Transparency Widget */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
        <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-900 mb-1">Your Data Security</h4>
          <p className="text-xs text-blue-700">
            Encrypted in transit • Stored locally where possible • Never sold • GDPR compliant • Export anytime
          </p>
        </div>
      </div>
      
      {data.sector && (
        <div className="warren-card p-4" style={{ backgroundColor: '#E6F4EA' }}>
          <h3 className="font-semibold mb-2" style={{ color: '#64B37A' }}>
            Warren's {data.sector} Expertise
          </h3>
          <p className="text-sm text-gray-700">
            {data.sector === 'educators' && 'We help educational organizations build meaningful community engagement, navigate complex stakeholder relationships, and create inclusive decision-making processes that serve all families.'}
            {data.sector === 'nonprofits' && 'We partner with nonprofits to amplify community voices, measure authentic impact, and build sustainable engagement strategies that center the people you serve.'}
            {data.sector === 'cities' && 'We work with municipal governments to increase transparency, expand civic participation, and ensure all residents have meaningful opportunities to shape their communities.'}
            {data.sector === 'campaigns' && 'We help advocacy organizations build powerful coalitions, engage diverse communities, and create compelling narratives that drive policy change.'}
          </p>
        </div>
      )}
    </div>
  );
}

function VoiceStyleStep({ data, updateData }: { data: DiscoveryData; updateData: (field: keyof DiscoveryData, value: any) => void }) {
  const personalStyles = [
    { value: 'collaborative-consensus', label: 'Collaborative & consensus-building' },
    { value: 'direct-action', label: 'Direct & action-oriented' },
    { value: 'warm-relationship', label: 'Warm & relationship-focused' },
    { value: 'professional-expertise', label: 'Professional & expertise-driven' }
  ];

  const organizationalStyles = [
    { value: 'collaborative-inclusive', label: 'Collaborative & inclusive' },
    { value: 'professional-informative', label: 'Professional & informative' },
    { value: 'warm-community', label: 'Warm & community-focused' },
    { value: 'direct-mission', label: 'Direct & mission-driven' }
  ];

  const currentStyles = data.voice_type === 'personal' ? personalStyles : organizationalStyles;

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-900 mb-4">Communication Voice & Style</h3>
      <p className="text-gray-600 mb-6">
        Community engagement works best with a consistent, authentic voice. Who or what will be the voice of this engagement?
      </p>
      
      {/* Voice Type Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">Voice Type</label>
        <div className="space-y-3">
          <label className="flex items-start cursor-pointer p-3 rounded-lg border hover:bg-gray-50">
            <input
              type="radio"
              name="voice_type"
              value="personal"
              checked={data.voice_type === 'personal'}
              onChange={(e) => updateData('voice_type', e.target.value)}
              className="mt-1 mr-3"
              style={{ accentColor: '#64B37A' }}
            />
            <div>
              <div className="font-medium text-gray-900">Personal leadership voice</div>
              <div className="text-sm text-gray-600">Candidate, executive, principal, or individual leader</div>
            </div>
          </label>
          
          <label className="flex items-start cursor-pointer p-3 rounded-lg border hover:bg-gray-50">
            <input
              type="radio"
              name="voice_type"
              value="organizational"
              checked={data.voice_type === 'organizational'}
              onChange={(e) => updateData('voice_type', e.target.value)}
              className="mt-1 mr-3"
              style={{ accentColor: '#64B37A' }}
            />
            <div>
              <div className="font-medium text-gray-900">Organizational/brand voice</div>
              <div className="text-sm text-gray-600">Campaign, nonprofit, institution, or company brand</div>
            </div>
          </label>
        </div>
      </div>

      {/* Style Selection - appears after voice type is selected */}
      {data.voice_type && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {data.voice_type === 'personal' ? 'How would you describe your communication style?' : 'How should your organization sound to the community?'}
          </label>
          <div className="space-y-2">
            {currentStyles.map((style) => (
              <label key={style.value} className="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded">
                <input
                  type="radio"
                  name="voice_style"
                  value={style.value}
                  checked={data.voice_style === style.value}
                  onChange={(e) => updateData('voice_style', e.target.value)}
                  className="mr-3"
                  style={{ accentColor: '#64B37A' }}
                />
                <span className="text-sm text-gray-700">{style.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Optional Description with AI Enhancement */}
      {data.voice_style && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Any other qualities that define this voice? (Optional)
          </label>
          <textarea
            value={data.voice_description}
            onChange={(e) => updateData('voice_description', e.target.value)}
            className="warren-input h-24"
            placeholder="Additional voice characteristics, tone preferences, or communication style notes... (detailed entries get Warren enhancement)"
          />
          
          {data.voice_description.length > 15 && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-green-700">Warren Enhancement Available</span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Your voice description can be enhanced with strategic communication frameworks and tone guidance.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ObjectivesStep({ data, addToArray, removeFromArray, effectiveSector }: {
  data: DiscoveryData;
  addToArray: (field: keyof DiscoveryData, value: string) => void;
  removeFromArray: (field: keyof DiscoveryData, index: number) => void;
  effectiveSector: string;
}) {
  const [inputValue, setInputValue] = useState('');
  const [pendingInput, setPendingInput] = useState('');

  const handleAdd = () => {
    if (inputValue.length > 10) {
      // Show Warren suggestion for detailed inputs
      setPendingInput(inputValue);
    } else {
      addToArray('objectives', inputValue);
      setInputValue('');
    }
  };

  const handleSuggestion = (suggestion: string) => {
    addToArray('objectives', suggestion);
  };

  const handleAcceptExpansion = (expandedResponse: string) => {
    addToArray('objectives', expandedResponse);
    setPendingInput('');
    setInputValue('');
  };

  const handleRejectExpansion = () => {
    addToArray('objectives', pendingInput);
    setPendingInput('');
    setInputValue('');
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-900 mb-4">Project Objectives</h3>
      <p className="text-gray-600 mb-4">What are the key objectives you want to achieve with this project?</p>
      
      <StepHelper 
        step="objectives" 
        onSuggestion={handleSuggestion} 
        projectContext={{
          client_name: data.client_name,
          project_title: data.project_title,
          sector: effectiveSector,
          industry: data.industry
        }}
      />
      
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="warren-input flex-1"
          placeholder="Enter an objective and press Enter (detailed entries get Warren enhancement)"
        />
        <PrimaryButton
          onClick={handleAdd}
        >
          Add
        </PrimaryButton>
      </div>
      
      {pendingInput && (
        <AISuggestionEngine
          userInput={pendingInput}
          step="objectives"
          industry={data.industry}
          sector={getEffectiveSector(data)}
          projectContext={{
            client_name: data.client_name,
            project_title: data.project_title,
            discovery_notes: data.discovery_notes
          }}
          onAcceptSuggestion={handleAcceptExpansion}
          onRejectSuggestion={handleRejectExpansion}
        />
      )}
      
      <div className="space-y-2">
        {data.objectives.map((objective, index) => (
          <div key={index} className="warren-card p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 text-gray-800 whitespace-pre-line">{objective}</div>
              <button
                onClick={() => removeFromArray('objectives', index)}
                className="text-red-500 hover:text-red-700 font-medium text-sm ml-3 flex-shrink-0"
              >
                × Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {data.objectives.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No objectives added yet.</p>
          <p className="text-sm mb-4">Use the examples above or enter detailed objectives to get Warren-enhanced suggestions!</p>
          <div className="flex justify-center">
            <button
              onClick={() => addToArray('objectives', 'Working to better understand our stakeholder needs and priorities')}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
            >
              + Not sure yet - help me explore this
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AudienceStep({ data, addToArray, removeFromArray, effectiveSector }: {
  data: DiscoveryData;
  addToArray: (field: keyof DiscoveryData, value: string) => void;
  removeFromArray: (field: keyof DiscoveryData, index: number) => void;
  effectiveSector: string;
}) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    addToArray('target_audience', inputValue);
    setInputValue('');
  };

  const handleSuggestion = (suggestion: string) => {
    addToArray('target_audience', suggestion);
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-900 mb-4">Target Audience</h3>
      <p className="text-gray-600 mb-4">Who are your key stakeholders and target audience groups?</p>
      
      <StepHelper 
        step="audience" 
        onSuggestion={handleSuggestion} 
        projectContext={{
          client_name: data.client_name,
          project_title: data.project_title,
          sector: effectiveSector,
          industry: data.industry
        }}
      />
      
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="warren-input flex-1"
          placeholder="Enter an audience group and press Enter"
        />
        <PrimaryButton
          onClick={handleAdd}
        >
          Add
        </PrimaryButton>
      </div>
      
      <div className="space-y-2">
        {data.target_audience.map((audience, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#E6F4EA' }}>
            <span className="text-gray-800">{audience}</span>
            <button
              onClick={() => removeFromArray('target_audience', index)}
              className="text-red-500 hover:text-red-700 font-medium text-sm"
            >
              × Remove
            </button>
          </div>
        ))}
      </div>

      {data.target_audience.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <p className="text-sm mb-4">No audience groups added yet.</p>
          <div className="flex justify-center">
            <button
              onClick={() => addToArray('target_audience', 'General community members and stakeholders')}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
            >
              + Not sure yet - help me identify key groups
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PainPointsStep({ data, addToArray, removeFromArray, effectiveSector }: {
  data: DiscoveryData;
  addToArray: (field: keyof DiscoveryData, value: string) => void;
  removeFromArray: (field: keyof DiscoveryData, index: number) => void;
  effectiveSector: string;
}) {
  const [inputValue, setInputValue] = useState('');
  const [pendingInput, setPendingInput] = useState('');

  const handleAdd = () => {
    if (inputValue.length > 10) {
      setPendingInput(inputValue);
    } else {
      addToArray('pain_points', inputValue);
      setInputValue('');
    }
  };

  const handleSuggestion = (suggestion: string) => {
    addToArray('pain_points', suggestion);
  };

  const handleAcceptExpansion = (expandedResponse: string) => {
    addToArray('pain_points', expandedResponse);
    setPendingInput('');
    setInputValue('');
  };

  const handleRejectExpansion = () => {
    addToArray('pain_points', pendingInput);
    setPendingInput('');
    setInputValue('');
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-900 mb-4">Pain Points & Challenges</h3>
      <p className="text-gray-600 mb-4">What challenges or problems is this project trying to solve?</p>
      
      <StepHelper 
        step="pain_points" 
        onSuggestion={handleSuggestion} 
        projectContext={{
          client_name: data.client_name,
          project_title: data.project_title,
          sector: effectiveSector,
          industry: data.industry
        }}
      />
      
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="warren-input flex-1"
          placeholder="Describe a challenge (detailed entries get Warren enhancement)"
        />
        <PrimaryButton
          onClick={handleAdd}
        >
          Add
        </PrimaryButton>
      </div>
      
      {pendingInput && (
        <AISuggestionEngine
          userInput={pendingInput}
          step="pain_points"
          industry={data.industry}
          sector={getEffectiveSector(data)}
          projectContext={{
            client_name: data.client_name,
            project_title: data.project_title,
            discovery_notes: data.discovery_notes
          }}
          onAcceptSuggestion={handleAcceptExpansion}
          onRejectSuggestion={handleRejectExpansion}
        />
      )}
      
      <div className="space-y-2">
        {data.pain_points.map((pain, index) => (
          <div key={index} className="warren-card p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 text-gray-800 whitespace-pre-line">{pain}</div>
              <button
                onClick={() => removeFromArray('pain_points', index)}
                className="text-red-500 hover:text-red-700 font-medium text-sm ml-3 flex-shrink-0"
              >
                × Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {data.pain_points.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <p className="text-sm mb-4">No challenges identified yet.</p>
          <div className="flex justify-center">
            <button
              onClick={() => addToArray('pain_points', 'We need to improve our community engagement approach but are not sure where to start')}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
            >
              + Not sure yet - help me identify challenges
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SuccessMetricsStep({ data, addToArray, removeFromArray, effectiveSector }: {
  data: DiscoveryData;
  addToArray: (field: keyof DiscoveryData, value: string) => void;
  removeFromArray: (field: keyof DiscoveryData, index: number) => void;
  effectiveSector: string;
}) {
  const [inputValue, setInputValue] = useState('');
  const [pendingInput, setPendingInput] = useState('');

  const handleAdd = () => {
    if (inputValue.length > 10) {
      setPendingInput(inputValue);
    } else {
      addToArray('success_metrics', inputValue);
      setInputValue('');
    }
  };

  const handleSuggestion = (suggestion: string) => {
    addToArray('success_metrics', suggestion);
  };

  const handleAcceptExpansion = (expandedResponse: string) => {
    addToArray('success_metrics', expandedResponse);
    setPendingInput('');
    setInputValue('');
  };

  const handleRejectExpansion = () => {
    addToArray('success_metrics', pendingInput);
    setPendingInput('');
    setInputValue('');
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-900 mb-4">Success Metrics</h3>
      <p className="text-gray-600 mb-4">How will you measure the success of this project?</p>
      
      <StepHelper 
        step="success_metrics" 
        onSuggestion={handleSuggestion} 
        projectContext={{
          client_name: data.client_name,
          project_title: data.project_title,
          sector: effectiveSector,
          industry: data.industry
        }}
      />
      
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="warren-input flex-1"
          placeholder="How will you measure success? (detailed entries get Warren enhancement)"
        />
        <PrimaryButton
          onClick={handleAdd}
        >
          Add
        </PrimaryButton>
      </div>
      
      {pendingInput && (
        <AISuggestionEngine
          userInput={pendingInput}
          step="success_metrics"
          industry={data.industry}
          sector={getEffectiveSector(data)}
          projectContext={{
            client_name: data.client_name,
            project_title: data.project_title,
            discovery_notes: data.discovery_notes
          }}
          onAcceptSuggestion={handleAcceptExpansion}
          onRejectSuggestion={handleRejectExpansion}
        />
      )}
      
      <div className="space-y-2">
        {data.success_metrics.map((metric, index) => (
          <div key={index} className="warren-card p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 text-gray-800 whitespace-pre-line">{metric}</div>
              <button
                onClick={() => removeFromArray('success_metrics', index)}
                className="text-red-500 hover:text-red-700 font-medium text-sm ml-3 flex-shrink-0"
              >
                × Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {data.success_metrics.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <p className="text-sm mb-4">No success metrics defined yet.</p>
          <div className="flex justify-center">
            <button
              onClick={() => addToArray('success_metrics', 'Improved community participation and satisfaction with engagement processes')}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
            >
              + Not sure yet - help me define success measures
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TimelineBudgetStep({ data, updateData }: {
  data: DiscoveryData;
  updateData: (field: keyof DiscoveryData, value: any) => void;
}) {
  const timelineOptions = [
    '1-2 months',
    '3-6 months',
    '6-12 months',
    '1+ years',
    'Ongoing'
  ];

  const budgetOptions = [
    'Under $25K',
    '$25K - $75K',
    '$75K - $150K',
    '$150K - $300K',
    '$300K+'
  ];

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-900 mb-4">Timeline & Budget</h3>
      
      <StepHelper 
        step="timeline_budget" 
        projectContext={{
          client_name: data.client_name,
          project_title: data.project_title,
          sector: effectiveSector,
          industry: data.industry
        }}
      />
      
      <div className="warren-card p-4" style={{ backgroundColor: '#E6F4EA' }}>
        <label className="block text-sm font-medium text-gray-700 mb-3">Project Timeline</label>
        <div className="space-y-2">
          {timelineOptions.map((option) => (
            <label key={option} className="flex items-center cursor-pointer p-2 hover:bg-white hover:bg-opacity-50 rounded">
              <input
                type="radio"
                name="timeline"
                value={option}
                checked={data.timeline === option}
                onChange={(e) => updateData('timeline', e.target.value)}
                className="mr-3 w-4 h-4"
                style={{ accentColor: '#64B37A' }}
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="warren-card p-4" style={{ backgroundColor: '#E6F4EA' }}>
        <label className="block text-sm font-medium text-gray-700 mb-3">Budget Range</label>
        <div className="space-y-2">
          {budgetOptions.map((option) => (
            <label key={option} className="flex items-center cursor-pointer p-2 hover:bg-white hover:bg-opacity-50 rounded">
              <input
                type="radio"
                name="budget"
                value={option}
                checked={data.budget_range === option}
                onChange={(e) => updateData('budget_range', e.target.value)}
                className="mr-3 w-4 h-4"
                style={{ accentColor: '#64B37A' }}
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewStep({ 
  data, 
  onExport, 
  onGenerateReport 
}: { 
  data: DiscoveryData; 
  onExport: () => void;
  onGenerateReport: () => void;
}) {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-900 mb-4">Discovery Summary</h3>
      <p className="text-gray-600 mb-6">Review your discovery outline and generate your comprehensive strategic report.</p>
      
      <div className="space-y-4">
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#E6F4EA' }}>
          <h3 className="font-semibold mb-2" style={{ color: '#64B37A' }}>Project Information</h3>
          <p><strong>Client:</strong> {data.client_name}</p>
          <p><strong>Project:</strong> {data.project_title}</p>
          <p><strong>Sector:</strong> {data.sector}</p>
          <p><strong>Industry:</strong> {data.industry}</p>
          <p><strong>Timeline:</strong> {data.timeline}</p>
          <p><strong>Budget:</strong> {data.budget_range}</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#E6F4EA' }}>
            <h3 className="font-semibold mb-2" style={{ color: '#64B37A' }}>Objectives ({data.objectives.length})</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {data.objectives.slice(0, 3).map((obj, i) => (
                <li key={i} className="text-gray-700">
                  {obj.length > 80 ? `${obj.substring(0, 80)}...` : obj}
                </li>
              ))}
              {data.objectives.length > 3 && (
                <li className="text-gray-500 italic">...and {data.objectives.length - 3} more</li>
              )}
            </ul>
          </div>
          
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#E6F4EA' }}>
            <h3 className="font-semibold mb-2" style={{ color: '#64B37A' }}>Target Audience ({data.target_audience.length})</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {data.target_audience.slice(0, 3).map((aud, i) => <li key={i} className="text-gray-700">{aud}</li>)}
              {data.target_audience.length > 3 && (
                <li className="text-gray-500 italic">...and {data.target_audience.length - 3} more</li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#E6F4EA' }}>
            <h3 className="font-semibold mb-2" style={{ color: '#64B37A' }}>Pain Points ({data.pain_points.length})</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {data.pain_points.slice(0, 3).map((pain, i) => (
                <li key={i} className="text-gray-700">
                  {pain.length > 60 ? `${pain.substring(0, 60)}...` : pain}
                </li>
              ))}
              {data.pain_points.length > 3 && (
                <li className="text-gray-500 italic">...and {data.pain_points.length - 3} more</li>
              )}
            </ul>
          </div>
          
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#E6F4EA' }}>
            <h3 className="font-semibold mb-2" style={{ color: '#64B37A' }}>Success Metrics ({data.success_metrics.length})</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {data.success_metrics.slice(0, 3).map((metric, i) => (
                <li key={i} className="text-gray-700">
                  {metric.length > 60 ? `${metric.substring(0, 60)}...` : metric}
                </li>
              ))}
              {data.success_metrics.length > 3 && (
                <li className="text-gray-500 italic">...and {data.success_metrics.length - 3} more</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
        <h3 className="font-semibold mb-3" style={{ color: '#64B37A' }}>🚀 Ready for Your Strategic Report?</h3>
        <p className="text-gray-700 mb-4">
          Generate a comprehensive strategic implementation outline with timeline graphics, detailed analysis, 
          and sector-specific recommendations based on your responses.
        </p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={onGenerateReport}
            className="px-8 py-3 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-shadow"
            style={{ backgroundColor: '#64B37A' }}
          >
            Generate Strategic Report
          </button>
          <button
            onClick={onExport}
            className="px-6 py-3 border-2 rounded-lg font-medium hover:bg-green-50 transition-colors"
            style={{ borderColor: '#64B37A', color: '#64B37A' }}
          >
            Export Raw Data
          </button>
        </div>
      </div>
    </div>
  );
}