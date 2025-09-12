'use client';

import React from 'react';
import type { DiscoveryOutline } from '@warren/data-models';

interface DiscoveryReportGeneratorProps {
  data: DiscoveryOutline;
}

export default function DiscoveryReportGenerator({ data }: DiscoveryReportGeneratorProps) {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Generate strategic insights based on user responses
  const generateInsights = () => {
    const insights = [];
    
    // Analyze sector-specific challenges
    if (data.sector) {
      const sectorChallenges = {
        educators: [
          "Low participation in traditional meeting formats despite high community interest",
          "Language barriers preventing multilingual family engagement",
          "Complex policy communication needs translation to accessible formats"
        ],
        nonprofits: [
          "Need to balance mission delivery with sustainable funding models",
          "Community voice integration requires authentic partnership approaches",
          "Impact measurement must combine quantitative data with participant stories"
        ],
        cities: [
          "Transparency gaps between government processes and resident understanding",
          "Engagement channels must accommodate diverse schedules and comfort levels",
          "Historical exclusion patterns require intentional inclusive outreach"
        ],
        campaigns: [
          "Coalition building requires diverse community engagement strategies",
          "Message resonance varies significantly across demographic groups",
          "Policy change timeline must account for community education phases"
        ]
      };

      insights.push({
        category: "Sector-Specific Challenges",
        items: sectorChallenges[data.sector as keyof typeof sectorChallenges] || []
      });
    }

    // Analyze objectives for strategic themes
    const objectiveThemes = data.objectives.reduce((themes: string[], obj: string) => {
      if (obj.toLowerCase().includes('engag')) themes.push('Community Engagement Focus');
      if (obj.toLowerCase().includes('transparent')) themes.push('Transparency Priority');
      if (obj.toLowerCase().includes('equity') || obj.toLowerCase().includes('inclusive')) themes.push('Equity Imperative');
      if (obj.toLowerCase().includes('sustain')) themes.push('Sustainability Orientation');
      return [...new Set(themes)]; // Remove duplicates
    }, []);

    if (objectiveThemes.length > 0) {
      insights.push({
        category: "Strategic Themes Identified",
        items: objectiveThemes
      });
    }

    return insights;
  };

  // Generate timeline recommendations
  const generateTimeline = () => {
    const baseTimeline = {
      'Phase 1: Foundation (Months 1-2)': [
        'Stakeholder mapping and initial outreach',
        'Communication framework development',
        'Early engagement pilot programs'
      ],
      'Phase 2: Implementation (Months 3-6)': [
        'Full program launch across all audiences',
        'Feedback collection and rapid iteration',
        'Success metrics tracking and analysis'
      ],
      'Phase 3: Optimization (Months 7-12)': [
        'Program refinement based on learnings',
        'Expansion to additional communities',
        'Long-term sustainability planning'
      ]
    };

    // Customize based on user responses
    if (data.timeline === '1-2 months') {
      return {
        'Rapid Deployment (Weeks 1-4)': [
          'Accelerated stakeholder identification',
          'Streamlined communication rollout',
          'Immediate feedback collection'
        ],
        'Quick Wins (Weeks 5-8)': [
          'Initial program metrics analysis',
          'Community response assessment',
          'Iteration planning for sustainability'
        ]
      };
    }

    return baseTimeline;
  };

  // Generate success metrics based on inputs
  const generateSuccessMetrics = () => {
    const baseMetrics = {
      quantitative: [
        'Response rates from target demographics within 5% of population representation',
        'Meeting attendance reflecting community diversity',
        'Communication reach across all identified stakeholder groups'
      ],
      qualitative: [
        'Stories of meaningful participation in decision-making processes',
        'Evidence of community recommendations integrated into outcomes',
        'Testimonials demonstrating improved trust and relationships'
      ]
    };

    // Enhance with user-specific metrics
    const customMetrics = {
      quantitative: [...baseMetrics.quantitative, ...data.success_metrics.filter(m => 
        m.includes('%') || m.includes('rate') || m.includes('number')
      )],
      qualitative: [...baseMetrics.qualitative, ...data.success_metrics.filter(m => 
        !m.includes('%') && !m.includes('rate') && !m.includes('number')
      )]
    };

    return customMetrics;
  };

  const insights = generateInsights();
  const timeline = generateTimeline();
  const successMetrics = generateSuccessMetrics();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex justify-between items-start">
            <div>
              <img src="/logos/nesolagus-horizontal.png" alt="Warren" className="h-12 mb-6" />
              <h1 className="text-3xl font-medium text-gray-900 mb-2">
                Community Engagement Discovery
              </h1>
              <h2 className="text-xl text-gray-600">Strategic Implementation Outline</h2>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p><strong>Prepared for:</strong> {data.client_name}</p>
              <p><strong>Project:</strong> {data.project_title}</p>
              <p><strong>Date:</strong> {currentDate}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-12">
        {/* Executive Summary */}
        <section>
          <h2 className="text-2xl font-medium text-gray-900 mb-6">1. Executive Summary</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="text-gray-700 mb-4">
              This discovery analysis synthesizes your stakeholder engagement objectives and outlines our strategic 
              approach for {data.project_title}. The initiative aims to transform community relationships through 
              authentic dialogue and inclusive participation across the {data.industry} sector.
            </p>
            
            <h3 className="font-medium text-gray-900 mb-3">Key Strategic Insights:</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Primary Objectives</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {data.objectives.slice(0, 3).map((obj, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      {obj.length > 80 ? `${obj.substring(0, 80)}...` : obj}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Key Challenges</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {data.pain_points.slice(0, 3).map((pain, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      {pain.length > 80 ? `${pain.substring(0, 80)}...` : pain}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Current State Analysis */}
        <section>
          <h2 className="text-2xl font-medium text-gray-900 mb-6">2. Current State Analysis</h2>
          
          {/* Challenge Analysis Table */}
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mb-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Challenge</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Impact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strategic Opportunity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.pain_points.slice(0, 4).map((pain, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {pain.length > 60 ? `${pain.substring(0, 60)}...` : pain}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Limiting stakeholder participation and reducing overall program effectiveness
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Address through targeted engagement strategies and inclusive communication approaches
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Strategic Framework */}
        <section>
          <h2 className="text-2xl font-medium text-gray-900 mb-6">3. Strategic Implementation Framework</h2>
          
          {/* Audience Analysis */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Target Stakeholder Groups</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.target_audience.map((audience, index) => (
                <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-gray-900 mb-2">{audience}</h4>
                  <p className="text-sm text-gray-600">
                    Key stakeholder group requiring tailored engagement approaches and communication strategies.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Implementation Timeline */}
        <section>
          <h2 className="text-2xl font-medium text-gray-900 mb-6">4. Implementation Timeline</h2>
          
          {/* Timeline Visualization */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Project Timeline: {data.timeline}</h3>
              <div className="text-sm text-gray-600">Budget Range: {data.budget_range}</div>
            </div>
            
            <div className="space-y-6">
              {Object.entries(timeline).map(([phase, activities], index) => (
                <div key={phase} className="relative">
                  <div className="flex items-center mb-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full text-sm font-medium mr-4">
                      {index + 1}
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">{phase}</h4>
                  </div>
                  <div className="ml-12">
                    <ul className="space-y-2">
                      {activities.map((activity, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-600">
                          <span className="text-green-600 mr-2">→</span>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {index < Object.entries(timeline).length - 1 && (
                    <div className="absolute left-4 top-8 w-0.5 h-12 bg-gray-300"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Metrics */}
        <section>
          <h2 className="text-2xl font-medium text-gray-900 mb-6">5. Success Metrics & Evaluation Framework</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quantitative Indicators</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <ul className="space-y-3">
                  {successMetrics.quantitative.map((metric, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <span className="text-blue-600 mr-2">📊</span>
                      {metric}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Qualitative Indicators</h3>
              <div className="bg-purple-50 p-4 rounded-lg">
                <ul className="space-y-3">
                  {successMetrics.qualitative.map((metric, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <span className="text-purple-600 mr-2">💭</span>
                      {metric}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Strategic Recommendations */}
        <section>
          <h2 className="text-2xl font-medium text-gray-900 mb-6">6. Strategic Recommendations</h2>
          
          <div className="space-y-6">
            {insights.map((insight, index) => (
              <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">{insight.category}</h3>
                <ul className="space-y-2">
                  {insight.items.map((item, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-700">
                      <span className="text-green-600 mr-2">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Project Overview Summary */}
        <section>
          <h2 className="text-2xl font-medium text-gray-900 mb-6">7. Project Overview</h2>
          
          <div className="bg-gray-800 text-white p-8 rounded-lg">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">{data.objectives.length}</div>
                <div className="text-sm text-gray-300">Strategic Objectives</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">{data.target_audience.length}</div>
                <div className="text-sm text-gray-300">Stakeholder Groups</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">{data.success_metrics.length}</div>
                <div className="text-sm text-gray-300">Success Metrics</div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-700">
              <h3 className="text-lg font-medium mb-3">Project Vision</h3>
              <p className="text-gray-300">
                {data.discovery_notes || `Transform ${data.sector} engagement through innovative stakeholder participation, creating authentic dialogue that builds lasting relationships and drives meaningful community impact across all identified audiences.`}
              </p>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="pb-12">
          <h2 className="text-2xl font-medium text-gray-900 mb-6">8. Next Steps</h2>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Immediate Actions</h3>
            <ul className="space-y-3">
              <li className="flex items-start text-sm text-gray-700">
                <span className="text-green-600 mr-2">1.</span>
                Review and approve this strategic framework with key stakeholders
              </li>
              <li className="flex items-start text-sm text-gray-700">
                <span className="text-green-600 mr-2">2.</span>
                Schedule implementation planning workshop with project team
              </li>
              <li className="flex items-start text-sm text-gray-700">
                <span className="text-green-600 mr-2">3.</span>
                Identify specific resource requirements and timeline dependencies
              </li>
              <li className="flex items-start text-sm text-gray-700">
                <span className="text-green-600 mr-2">4.</span>
                Begin stakeholder mapping and initial outreach preparations
              </li>
            </ul>
            
            <div className="mt-6 p-4 bg-white rounded border border-green-300">
              <p className="text-sm text-gray-700">
                <strong>Ready to move forward?</strong> Contact our team to schedule your implementation planning session 
                and begin transforming your community engagement approach.
              </p>
            </div>
          </div>
        </section>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-600">
            Generated by Warren Community Engagement Discovery Tool • {currentDate}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This strategic outline is customized based on your specific objectives, stakeholder landscape, and sector expertise.
          </p>
        </div>
      </div>
    </div>
  );
}