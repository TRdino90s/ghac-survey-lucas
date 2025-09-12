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

  // Track AI enhancement usage for progressive value
  const getUsageCount = () => {
    const stored = localStorage.getItem('warren-ai-usage');
    return stored ? parseInt(stored) : 0;
  };

  const incrementUsage = () => {
    const current = getUsageCount();
    localStorage.setItem('warren-ai-usage', (current + 1).toString());
  };

  const generateExpansion = async () => {
    setIsGenerating(true);
    setShowSuggestion(true);
    incrementUsage(); // Track usage for progressive value
    
    // Simulate AI processing time
    setTimeout(() => {
      const usageCount = getUsageCount();
      const expanded = expandResponse(userInput, step, industry, sector, projectContext, usageCount);
      setExpandedResponse(expanded);
      setIsGenerating(false);
    }, 2000);
  };

  const expandResponse = (
    input: string,
    currentStep: string,
    userIndustry: string,
    userSector: string,
    context: typeof projectContext,
    usageCount: number = 0
  ): string => {
    
    // Analyze the actual user input for key concepts and themes
    const inputLower = input.toLowerCase();
    const words = inputLower.split(/\s+/);
    
    // Context-aware response generation based on actual user input
    let response = '';
    
    if (currentStep === 'objectives') {
      // Analyze what the user is trying to achieve
      if (inputLower.includes('constituent') || inputLower.includes('voter') || inputLower.includes('campaign') || inputLower.includes('election')) {
        response = `${input}\n\nExpanded Strategic Context:\nPolitical engagement requires authentic listening to understand constituent priorities before advocacy. Consider:\n\n• Multi-modal feedback collection (town halls, digital surveys, one-on-one conversations)\n• Geographic and demographic representation analysis to ensure all voices are heard\n• Issue prioritization frameworks that balance immediate concerns with long-term impact\n• Transparency mechanisms that show how constituent input influences policy positions`;
      }
      else if (inputLower.includes('engagement') || inputLower.includes('participat') || inputLower.includes('involve')) {
        const sector = userSector || 'community';
        response = `${input}\n\nWarren Insight:\nMeaningful engagement in the ${sector} sector requires moving beyond traditional one-way communication to authentic dialogue. Based on our experience:\n\n• Create multiple entry points for different comfort levels and availability\n• Design feedback loops that show community input directly influences decisions\n• Build trust through consistent follow-through and transparent decision-making\n• Address barriers like language, timing, and accessibility that prevent participation`;
      }
      else if (inputLower.includes('trust') || inputLower.includes('relationship') || inputLower.includes('connection')) {
        response = `${input}\n\nRelationship-Building Framework:\nTrust is built through consistent actions over time. Our GHAC work showed that lasting relationships require:\n\n• Authentic vulnerability - acknowledging what you don't know and need to learn\n• Consistent presence - showing up even when there's no immediate agenda\n• Responsive action - demonstrating that community input leads to real change\n• Shared ownership - involving community members in designing solutions, not just providing feedback`;
      }
      else if (inputLower.includes('understand') || inputLower.includes('learn') || inputLower.includes('discover') || inputLower.includes('find out')) {
        response = `${input}\n\nDiscovery-Centered Approach:\nYour instinct to prioritize understanding before action aligns with Warren's methodology. Effective discovery includes:\n\n• Deep listening sessions with diverse stakeholder groups\n• Asset mapping to understand existing community strengths and networks\n• Historical context research to understand past engagement efforts and their outcomes\n• Multiple data collection methods to capture different perspectives and communication styles`;
      }
      else if (inputLower.includes('transparent') || inputLower.includes('accountab') || inputLower.includes('open')) {
        response = `${input}\n\nTransparency as Foundation:\nTransparency builds credibility and enables meaningful participation. Consider:\n\n• Proactive information sharing in accessible formats and languages\n• Clear processes for how decisions are made and community input is incorporated\n• Regular progress updates that acknowledge both successes and challenges\n• Open data practices that allow community members to analyze and understand key information`;
      }
      else {
        // Generic thoughtful expansion based on sector
        const sectorContext = {
          'campaigns': 'Effective political campaigns balance ambitious vision with practical implementation, ensuring constituent voices drive policy priorities rather than partisan talking points.',
          'political': 'Public service excellence requires building authentic relationships with constituents through transparent communication, accessible participation opportunities, and demonstrable responsiveness to community priorities.',
          'educators': 'Educational transformation requires engaging all stakeholders - students, families, educators, and community partners - in collaborative decision-making processes.',
          'nonprofits': 'Sustainable nonprofit impact comes from centering the voices and experiences of the communities being served in all program design and evaluation.',
          'cities': 'Municipal effectiveness depends on creating accessible pathways for resident participation in local decision-making processes.'
        };
        
        const contextual = sectorContext[userSector as keyof typeof sectorContext] || 'Community engagement requires authentic dialogue and shared ownership of outcomes.';
        response = `${input}\n\nStrategic Enhancement:\n${contextual}\n\nTo strengthen this objective, consider:\n• What specific outcomes will demonstrate success?\n• Who are the key stakeholders who must be engaged?\n• What barriers currently prevent optimal results?\n• How will you measure both quantitative progress and qualitative impact?`;
      }
    }
    
    else if (currentStep === 'pain_points') {
      // Analyze challenges and provide strategic solutions
      if (inputLower.includes('time') || inputLower.includes('schedule') || inputLower.includes('busy')) {
        response = `${input}\n\nStrategic Solution Framework:\nTime constraints are among the most common barriers to community engagement. Warren's approach addresses this through:\n\n• Multiple engagement channels (quick surveys, brief video responses, asynchronous discussions)\n• Meeting time diversity (early morning, evening, weekend options)\n• Micro-engagement opportunities (5-minute feedback moments, text-based input)\n• Summary and synthesis services that respect people's time while ensuring their voices are heard`;
      }
      else if (inputLower.includes('language') || inputLower.includes('communicat') || inputLower.includes('understand')) {
        response = `${input}\n\nCommunication Accessibility Solutions:\nLanguage and communication barriers require systematic solutions:\n\n• Professional translation services for key materials and meetings\n• Visual communication tools that transcend language barriers\n• Community liaison programs with trusted messengers\n• Multiple format options (written, verbal, visual, digital) to accommodate different communication preferences`;
      }
      else if (inputLower.includes('trust') || inputLower.includes('skeptic') || inputLower.includes('participat')) {
        response = `${input}\n\nTrust-Building Strategy:\nSkepticism often stems from past experiences of consultation without action. Address this through:\n\n• Transparent acknowledgment of past engagement failures\n• Small, visible wins that demonstrate responsiveness to community input\n• Clear commitment to how feedback will be used and decision-making processes\n• Community ownership opportunities that move beyond consultation to genuine partnership`;
      }
      else {
        response = `${input}\n\nProblem-Solving Approach:\nThis challenge requires systematic analysis and strategic intervention. Consider:\n\n• Root cause analysis - what underlying systems or structures create this problem?\n• Stakeholder impact assessment - who is most affected and how?\n• Resource mapping - what assets and capabilities exist to address this?\n• Implementation pathway - what sequence of actions could create sustainable change?`;
      }
    }
    
    else if (currentStep === 'success_metrics') {
      // Help develop comprehensive measurement frameworks
      if (inputLower.includes('particip') || inputLower.includes('engag') || inputLower.includes('involve')) {
        response = `${input}\n\nComprehensive Participation Metrics:\nMeasuring engagement requires both breadth and depth indicators:\n\nQuantitative measures:\n• Response rates across demographic groups\n• Geographic distribution of participants\n• Repeat engagement over time\n\nQualitative indicators:\n• Participant testimonials about feeling heard\n• Evidence of community input in final decisions\n• Changes in community trust and relationship quality`;
      }
      else if (inputLower.includes('outcome') || inputLower.includes('impact') || inputLower.includes('result')) {
        response = `${input}\n\nOutcome Measurement Framework:\nImpact assessment should capture both immediate and long-term change:\n\n• Short-term: Process improvements, increased participation, enhanced communication\n• Medium-term: Policy changes, program adjustments, relationship quality improvements\n• Long-term: Community capacity building, sustained engagement, systemic change\n\nEnsure measurement includes both beneficiary perspectives and organizational learning.`;
      }
      else {
        response = `${input}\n\nStrategic Measurement Enhancement:\nEffective metrics balance quantitative data with qualitative insights:\n\n• Process metrics - are we implementing as planned?\n• Outcome metrics - are we achieving intended results?\n• Impact metrics - what long-term change are we creating?\n• Learning metrics - how is our approach evolving based on community feedback?`;
      }
    }
    
    // Progressive enhancement based on usage
    if (response && usageCount > 1) {
      // Add strategic depth for engaged users
      response += `\n\nImplementation Considerations:\n• Phased rollout strategy to test and refine approaches\n• Resource allocation planning for sustainable execution\n• Stakeholder communication timeline and touchpoints`;
      
      if (usageCount > 2) {
        // Add even more depth for highly engaged users
        response += `\n• Risk mitigation strategies for potential engagement barriers\n• Success celebration and recognition frameworks\n• Continuous improvement methodology integration`;
      }
    }
    
    // Gentle gatekeeping for high usage
    if (usageCount >= 4) {
      response += `\n\nWarren Insight: You're clearly thinking deeply about this work. Consider scheduling a brief consultation to explore these frameworks in detail - many clients find a 15-minute conversation unlocks implementation strategies that save months of trial and error.`;
    }
    
    return response || input;
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