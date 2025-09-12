'use client';

import { useState } from 'react';

interface AISuggestionEngineProps {
  userInput: string;
  step: 'objectives' | 'audience' | 'pain_points' | 'success_metrics';
  industry: string;
  sector: string;
  projectContext: {
    client_name: string;
    project_title: string;
    discovery_notes: string;
  };
  onAcceptSuggestion: (expandedResponse: string) => void;
  onRejectSuggestion: () => void;
}

export default function AISuggestionEngine({
  userInput,
  step,
  industry,
  sector,
  projectContext,
  onAcceptSuggestion,
  onRejectSuggestion
}: AISuggestionEngineProps) {
  const [expandedResponse, setExpandedResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);

  const generateExpansion = async () => {
    setIsGenerating(true);
    setShowSuggestion(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const expanded = expandResponse(userInput, step, industry, sector, projectContext);
      setExpandedResponse(expanded);
      setIsGenerating(false);
    }, 2000);
  };

  const expandResponse = (
    input: string,
    currentStep: string,
    userIndustry: string,
    userSector: string,
    context: typeof projectContext
  ): string => {
    const warrenKnowledge = {
      educators: {
        objectives: {
          keywords: ['engagement', 'community', 'stakeholder'],
          expansions: {
            'engagement': 'meaningful two-way dialogue between educational leaders and diverse community stakeholders, including parents, students, teachers, and local organizations, that builds trust and shared ownership of educational outcomes',
            'community': 'inclusive representation that reaches beyond traditional PTA networks to include multilingual families, working parents, community-based organizations, and historically underrepresented voices in educational decision-making',
            'stakeholder': 'comprehensive mapping of all parties affected by educational policies, including direct beneficiaries (students, families), implementers (teachers, staff), decision-makers (board members, administrators), and community partners (local businesses, nonprofits, civic organizations)'
          }
        },
        pain_points: {
          common: [
            'Low participation in school board meetings despite high community interest in education',
            'Language barriers preventing multilingual families from meaningful participation',
            'Working parents unable to attend traditional meeting times',
            'Complex educational policies that need translation into accessible language',
            'Mistrust between administration and community due to past communication failures'
          ]
        },
        success_metrics: {
          quantitative: [
            'Survey response rates from at least 15% of families across all demographic groups',
            'Meeting attendance that reflects district demographics within 5% margin',
            'Policy feedback received in multiple languages representing district population'
          ],
          qualitative: [
            'Stories of families feeling heard and valued in the decision-making process',
            'Evidence of community recommendations being incorporated into final policies',
            'Testimonials from educators about improved community relationships'
          ]
        }
      },
      nonprofits: {
        objectives: {
          keywords: ['impact', 'community', 'sustainability'],
          expansions: {
            'impact': 'measurable improvement in the lives of people served, with clear pathways from program activities to long-term community outcomes, documented through both data and participant stories',
            'community': 'authentic partnerships with the populations served, where community members shape program design, implementation, and evaluation rather than being passive recipients',
            'sustainability': 'long-term organizational health that balances mission delivery with financial stability, stakeholder support, and adaptive capacity to meet evolving community needs'
          }
        }
      },
      cities: {
        objectives: {
          keywords: ['transparency', 'engagement', 'equity'],
          expansions: {
            'transparency': 'proactive information sharing that makes government processes accessible to all residents, including multilingual communication, plain-language explanations of complex policies, and clear timelines for decision-making',
            'engagement': 'meaningful opportunities for residents to influence decisions that affect their daily lives, with multiple participation channels that accommodate different schedules, languages, and comfort levels',
            'equity': 'intentional focus on including voices that have been historically excluded from civic processes, with specific outreach to communities of color, renters, working families, and residents with limited English proficiency'
          }
        }
      }
    };

    // Industry-specific knowledge
    const industryInsights = {
      'healthcare': 'patient-centered approaches, health equity considerations, regulatory compliance requirements',
      'housing': 'affordable housing advocacy, tenant rights, community development impacts',
      'environment': 'climate resilience, environmental justice, sustainable development practices',
      'economic development': 'small business support, workforce development, gentrification concerns'
    };

    // Context-aware expansion based on GHAC-style deep discovery
    let expansion = input;
    
    if (currentStep === 'objectives') {
      const sectorKnowledge = warrenKnowledge[userSector as keyof typeof warrenKnowledge];
      if (sectorKnowledge) {
        Object.entries(sectorKnowledge.objectives.expansions).forEach(([keyword, definition]) => {
          if (input.toLowerCase().includes(keyword)) {
            expansion = `${input}\n\nExpanded context: ${definition}`;
          }
        });
      }
      
      // Add industry-specific context
      if (userIndustry && industryInsights[userIndustry as keyof typeof industryInsights]) {
        expansion += `\n\nIndustry considerations: ${industryInsights[userIndustry as keyof typeof industryInsights]}`;
      }
    }
    
    if (currentStep === 'pain_points' && userSector) {
      const sectorKnowledge = warrenKnowledge[userSector as keyof typeof warrenKnowledge];
      if (sectorKnowledge?.pain_points?.common) {
        const relatedPains = sectorKnowledge.pain_points.common
          .filter(pain => pain.toLowerCase().includes(input.toLowerCase().split(' ')[0]))
          .slice(0, 2);
        
        if (relatedPains.length > 0) {
          expansion += `\n\nRelated challenges we often see in ${userSector}:\n${relatedPains.map(p => `• ${p}`).join('\n')}`;
        }
      }
    }
    
    if (currentStep === 'success_metrics' && userSector) {
      const sectorKnowledge = warrenKnowledge[userSector as keyof typeof warrenKnowledge];
      if (sectorKnowledge?.success_metrics) {
        expansion += `\n\nSuggested quantitative metrics:\n${sectorKnowledge.success_metrics.quantitative?.slice(0, 2).map(m => `• ${m}`).join('\n') || ''}`;
        expansion += `\n\nSuggested qualitative indicators:\n${sectorKnowledge.success_metrics.qualitative?.slice(0, 2).map(m => `• ${m}`).join('\n') || ''}`;
      }
    }
    
    return expansion;
  };

  const handleAccept = () => {
    onAcceptSuggestion(expandedResponse);
    setShowSuggestion(false);
    setExpandedResponse('');
  };

  const handleReject = () => {
    onRejectSuggestion();
    setShowSuggestion(false);
    setExpandedResponse('');
  };

  if (!userInput.trim() || userInput.length < 10) return null;

  return (
    <div className="mt-4">
      {!showSuggestion && (
        <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-dashed" style={{ borderColor: '#64B37A', backgroundColor: '#E6F4EA' }}>
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: '#64B37A' }}>
              🚀 Want to expand on "{userInput.substring(0, 50)}${userInput.length > 50 ? '...' : ''}"?
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Let our team suggest deeper insights based on {sector || 'your sector'} expertise and successful projects like GHAC.
            </p>
          </div>
          <button
            onClick={generateExpansion}
            className="warren-button-primary text-sm px-4 py-2"
          >
            ✨ Expand This
          </button>
        </div>
      )}

      {showSuggestion && (
        <div className="warren-card p-4 border-2" style={{ borderColor: '#64B37A' }}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold" style={{ color: '#64B37A' }}>Warren Suggested Expansion</h4>
            <div className="warren-badge text-xs">Warren Intelligence</div>
          </div>
          
          {isGenerating ? (
            <div className="flex items-center gap-3 py-4">
              <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-green-600 rounded-full"></div>
              <span className="text-gray-600">Analyzing your input with Warren's community engagement expertise...</span>
            </div>
          ) : (
            <>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h5 className="font-medium text-gray-700 mb-2">Original:</h5>
                <p className="text-gray-600 text-sm">{userInput}</p>
              </div>
              
              <div style={{ backgroundColor: '#E6F4EA' }} className="p-4 rounded-lg mb-4">
                <h5 className="font-medium mb-2" style={{ color: '#64B37A' }}>Expanded with Warren Context:</h5>
                <div className="text-gray-700 text-sm whitespace-pre-line">
                  {expandedResponse}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleAccept}
                  className="warren-button-primary flex-1"
                >
                  ✓ Use This Expansion
                </button>
                <button
                  onClick={handleReject}
                  className="warren-button-secondary flex-1"
                >
                  Keep Original
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
                You can always edit the expanded version after accepting it.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}