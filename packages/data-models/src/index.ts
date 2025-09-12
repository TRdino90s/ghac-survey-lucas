// Warren Product Suite - Shared Data Models
// Generated from survey_structure.json and extended for all Warren tools

export interface SurveyBlock {
  block_id: number | string;
  section: string;
  question_content: string;
  response_type: 'Video' | 'Quick Reply Buttons' | 'Text Input' | 'Multiple Choice - Single Select' | 'Multiple Choice - Multi Select' | 'Rating Scale' | 'Message';
  options_details: string;
  logic_branching: string;
  variable_name: string | null;
}

export interface SurveyStructure {
  blocks: SurveyBlock[];
  metadata: {
    title: string;
    description: string;
    estimated_time_minutes: number;
    total_blocks: number;
  };
}

// Discovery Tool Types (The Hatch)
export interface DiscoveryOutline {
  client_name: string;
  project_title: string;
  industry: string;
  sector: string;
  custom_sector: string;
  voice_type: string;
  voice_style: string;
  voice_description: string;
  objectives: string[];
  target_audience: string[];
  pain_points: string[];
  success_metrics: string[];
  timeline: string;
  budget_range: string;
  discovery_notes: string;
  generated_at: string;
}

// Analytics Types (The Hollow)
export interface AnalyticsMetrics {
  surveyStarts: number;
  completedSurveys: number;
  completionRatePct: number;
  demographicOptInPct: number;
  averageDonationAmountUsd: number | null;
}

export interface CommunityArchetype {
  label: string;
  value: number;
  color: string;
  description: string;
}

// Community Intelligence Types
export interface StakeholderGroup {
  id: string;
  name: string;
  description: string;
  engagement_level: 'High' | 'Medium' | 'Low';
  priority_themes: string[];
  communication_preferences: string[];
}

export interface CommunityIntelligenceReport {
  report_id: string;
  sector: 'educators' | 'nonprofits' | 'campaigns' | 'cities' | 'political' | 'other';
  stakeholder_groups: StakeholderGroup[];
  priority_themes: string[];
  engagement_metrics: AnalyticsMetrics;
  recommendations: string[];
  generated_at: string;
  page_count: number;
}

// Shared Utility Types
export interface WarrenUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client' | 'collaborator';
  created_at: string;
  updated_at: string;
}

export interface WarrenProject {
  id: string;
  name: string;
  client_name: string;
  status: 'discovery' | 'building' | 'launched' | 'analyzing' | 'activating' | 'completed';
  created_at: string;
  updated_at: string;
  discovery_outline?: DiscoveryOutline;
  survey_structure?: SurveyStructure;
  analytics_data?: AnalyticsMetrics;
  intelligence_report?: CommunityIntelligenceReport;
}