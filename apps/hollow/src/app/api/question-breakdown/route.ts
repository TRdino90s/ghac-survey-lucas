// src/app/api/question-breakdown/route.ts
import { NextResponse } from 'next/server'
export const runtime = 'nodejs'

type Item = { label: string; count: number; pct: number }
type Q = { question: string; total: number; items: Item[]; kind: 'SCALE' | 'SINGLE' | 'MULTI' | 'UNKNOWN' }

// Real live data from GHAC dashboard as of latest update
const LIVE_QUESTIONS: Q[] = [
  {
    question: "Ready to share your thoughts? (It'll take about 8-10 minutes)",
    total: 54,
    kind: 'SINGLE',
    items: [
      { label: "🎨 Let's chat", count: 47, pct: 87 },
      { label: "🤔 Tell me more first", count: 7, pct: 13 }
    ]
  },
  {
    question: "Ready?",
    total: 7,
    kind: 'SINGLE', 
    items: [
      { label: "👍 Yes let's chat", count: 6, pct: 86 },
      { label: "✋ Nah, I'm out", count: 1, pct: 14 }
    ]
  },
  {
    question: "How would you **best describe** your connection to the Greater Hartford Arts Council?",
    total: 46,
    kind: 'SINGLE',
    items: [
      { label: "I currently support GHAC", count: 19, pct: 41 },
      { label: "I'm connected through an artist or arts organization", count: 10, pct: 22 },
      { label: "I've supported GHAC in the past", count: 10, pct: 22 },
      { label: "Other connection", count: 3, pct: 7 },
      { label: "This is my first time learning about GHAC", count: 2, pct: 4 },
      { label: "I participated through a workplace giving campaign", count: 2, pct: 4 }
    ]
  },
  {
    question: "The arts ecosystem includes many different touchpoints. How do you currently connect with the arts in our region? (Select all that apply)",
    total: 28,
    kind: 'MULTI',
    items: [
      { label: "I see arts as vital to community wellbeing", count: 25, pct: 89 },
      { label: "I attend performances, exhibitions, or events", count: 24, pct: 86 },
      { label: "I believe arts education is essential", count: 24, pct: 86 },
      { label: "I visit museums, galleries, or cultural sites", count: 23, pct: 82 },
      { label: "I donate to arts organizations", count: 20, pct: 71 },
      { label: "I have friends or family who are artists", count: 15, pct: 54 },
      { label: "My work involves creative thinking", count: 14, pct: 50 },
      { label: "Other connection", count: 8, pct: 29 }
    ]
  },
  {
    question: "When you think about the role of arts in Greater Hartford, how essential do you believe they are?",
    total: 29,
    kind: 'SCALE',
    items: [
      { label: "5️⃣ Absolutely essential—like schools or healthcare", count: 19, pct: 66 },
      { label: "4️⃣ Very important to our community", count: 8, pct: 28 },
      { label: "3️⃣ Important for quality of life", count: 2, pct: 7 }
    ]
  },
  {
    question: "Organizations can connect with supporters in many ways. What type of relationship would feel **most meaningful** to you?",
    total: 29,
    kind: 'SINGLE',
    items: [
      { label: "Keep me informed and inspired", count: 12, pct: 41 },
      { label: "Invite me to special experiences", count: 6, pct: 21 },
      { label: "Include me in important decisions", count: 3, pct: 10 },
      { label: "Connect me with like-minded people", count: 3, pct: 10 },
      { label: "Let me support from a distance", count: 2, pct: 7 },
      { label: "Engage my professional skills", count: 2, pct: 7 },
      { label: "I'm still figuring that out", count: 1, pct: 3 }
    ]
  },
  {
    question: "What, if anything, makes it challenging to engage with arts organizations?",
    total: 23,
    kind: 'MULTI',
    items: [
      { label: "Time constraints", count: 11, pct: 48 },
      { label: "Financial constraints", count: 9, pct: 39 },
      { label: "Other causes take priority", count: 6, pct: 26 },
      { label: "Unclear how my support creates change", count: 5, pct: 22 },
      { label: "Life feels overwhelming right now", count: 5, pct: 22 },
      { label: "Don't feel personally welcomed", count: 3, pct: 13 },
      { label: "Lack of information about opportunities", count: 3, pct: 13 },
      { label: "Past experiences felt impersonal", count: 1, pct: 4 }
    ]
  },
  {
    question: "Creativity shows up in many ways. Which of these resonate with your personal relationship to creativity?",
    total: 22,
    kind: 'MULTI',
    items: [
      { label: "I see supporting artists as civic responsibility", count: 18, pct: 82 },
      { label: "Creative problem-solving is part of my work", count: 17, pct: 77 },
      { label: "I'm passionate about specific art forms", count: 16, pct: 73 },
      { label: "I pursue creative hobbies in my free time", count: 14, pct: 64 },
      { label: "Innovation and experimentation excite me", count: 13, pct: 59 },
      { label: "I wish I had more creative outlets", count: 12, pct: 55 },
      { label: "I believe traditional arts deserve preservation", count: 11, pct: 50 }
    ]
  },
  {
    question: "Looking ahead, what would you most like to see strengthen in Greater Hartford's arts ecosystem?",
    total: 22,
    kind: 'MULTI',
    items: [
      { label: "Sustainable funding for arts organizations", count: 19, pct: 86 },
      { label: "Arts education for young people", count: 18, pct: 82 },
      { label: "More opportunities for emerging artists", count: 16, pct: 73 },
      { label: "Creative spaces for artists to work and gather", count: 15, pct: 68 },
      { label: "Public art that reflects our diversity", count: 14, pct: 64 },
      { label: "Arts as economic development driver", count: 13, pct: 59 },
      { label: "Connections between arts and wellness/healing", count: 8, pct: 36 }
    ]
  },
  {
    question: "Everyone contributes differently to our creative community. What specific opportunities might interest you in the next year?",
    total: 22,
    kind: 'MULTI',
    items: [
      { label: "Learning about artists and their stories", count: 15, pct: 68 },
      { label: "Monthly or quarterly giving", count: 11, pct: 50 },
      { label: "Behind-the-scenes studio visits", count: 10, pct: 45 },
      { label: "Donor gatherings and salons", count: 8, pct: 36 },
      { label: "I need to learn more first", count: 6, pct: 27 },
      { label: "Sharing my professional expertise", count: 4, pct: 18 },
      { label: "Advisory committee participation", count: 3, pct: 14 },
      { label: "Hosting a friend-raising event", count: 2, pct: 9 }
    ]
  },
  {
    question: "If we were to share updates about our impact and opportunities, how would you prefer to hear from us?",
    total: 22,
    kind: 'SINGLE',
    items: [
      { label: "Email updates with stories and impact", count: 14, pct: 64 },
      { label: "A mix of these", count: 4, pct: 18 },
      { label: "Future conversations like this one", count: 2, pct: 9 },
      { label: "Social media updates", count: 1, pct: 5 },
      { label: "Text messages about events and opportunities", count: 1, pct: 5 }
    ]
  },
  {
    question: "What is your age range?",
    total: 29,
    kind: 'SINGLE',
    items: [
      { label: "55-64", count: 8, pct: 28 },
      { label: "45-54", count: 7, pct: 24 },
      { label: "35-44", count: 6, pct: 21 },
      { label: "65-74", count: 4, pct: 14 },
      { label: "25-34", count: 3, pct: 10 },
      { label: "75+", count: 1, pct: 3 }
    ]
  },
  {
    question: "What is your zip code?",
    total: 20,
    kind: 'SINGLE',
    items: [
      { label: "06002", count: 2, pct: 10 },
      { label: "06033", count: 2, pct: 10 },
      { label: "06037", count: 2, pct: 10 },
      { label: "06067", count: 2, pct: 10 },
      { label: "06117", count: 2, pct: 10 },
      { label: "Others", count: 10, pct: 50 }
    ]
  },
  {
    question: "How much do you typically give each year to non-profit organizations?",
    total: 20,
    kind: 'SINGLE',
    items: [
      { label: "$1,000-$2,499", count: 6, pct: 30 },
      { label: "$250-$499", count: 4, pct: 20 },
      { label: "$500-$999", count: 3, pct: 15 },
      { label: "$2,500-$4,999", count: 3, pct: 15 },
      { label: "$100-$249", count: 2, pct: 10 },
      { label: "$5,000+", count: 2, pct: 10 }
    ]
  }
]

export async function GET() {
  return NextResponse.json({ 
    ok: true, 
    source: 'live-dashboard-manual-update', 
    questions: LIVE_QUESTIONS 
  })
}