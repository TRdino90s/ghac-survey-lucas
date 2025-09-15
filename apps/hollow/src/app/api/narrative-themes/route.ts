import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

// Parse CSV with proper quote handling
function parseCSVStrict(text: string): string[][] {
  const rows: string[][] = []
  let cur: string[] = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuotes) {
      if (ch === '"') { const n = text[i + 1]; if (n === '"') { field += '"'; i++; } else { inQuotes = false } }
      else field += ch
    } else {
      if (ch === '"') inQuotes = true
      else if (ch === ',') { cur.push(field); field = '' }
      else if (ch === '\n') { cur.push(field); rows.push(cur); cur = []; field = '' }
      else if (ch === '\r') {}
      else field += ch
    }
  }
  cur.push(field); rows.push(cur); return rows
}

async function readLatestNarrativeCsv(): Promise<string[][] | null> {
  const docs = path.join(process.cwd(), 'docs')
  try {
    const files = await fs.readdir(docs)
    const matches = files.filter((f) => /^ghac-narrative-responses.*\.csv$/i.test(f))
    if (!matches.length) return null
    matches.sort()
    const name = matches[matches.length - 1]
    const raw = await fs.readFile(path.join(docs, name), 'utf8')
    return parseCSVStrict(raw)
  } catch {
    return null
  }
}

function analyzeThemes(narratives: string[]) {
  // Define theme patterns based on comprehensive analysis
  const themes = {
    'Personal Identity & Creative Expression': {
      patterns: ['identity', 'creative', 'artist', 'performer', 'musician', 'dancer', 'painter', 'writer', 'livelihood', 'career', 'professional'],
      color: '#64B37A',
      responses: [] as string[]
    },
    'Community Building & Connection': {
      patterns: ['community', 'bridge', 'together', 'connection', 'relationships', 'diverse', 'backgrounds', 'strengthen'],
      color: '#86C99B',
      responses: [] as string[]
    },
    'Emotional & Spiritual Impact': {
      patterns: ['emotional', 'spiritual', 'moving', 'cried', 'touching', 'deeply', 'meaningful', 'transforming', 'fulfillment'],
      color: '#A9D8B7',
      responses: [] as string[]
    },
    'Professional Development': {
      patterns: ['launched', 'career', 'neighborhood studios', 'program', 'professional', 'development', 'skills', 'education'],
      color: '#CDEBD8',
      responses: [] as string[]
    },
    'Economic Impact': {
      patterns: ['economy', 'economic', 'funding', 'financial', 'donation', 'business', 'workforce', 'jobs'],
      color: '#0E2A23',
      responses: [] as string[]
    }
  }

  const feedback = {
    'GHAC Operations & Communication': {
      patterns: ['ghac', 'transparency', 'inclusive', 'brand', 'communication', 'organization', 'council'],
      color: '#E6472F',
      responses: [] as string[]
    },
    'Artist Support & Development': {
      patterns: ['artist', 'compensation', 'weather', 'cancelled', 'professional development', 'opportunities', 'support'],
      color: '#F39C12',
      responses: [] as string[]
    },
    'Community Outreach & Inclusion': {
      patterns: ['outreach', 'inclusion', 'suburban', 'hartford', 'geographic', 'communities of color', 'senior'],
      color: '#8E44AD',
      responses: [] as string[]
    },
    'Infrastructure & Programming': {
      patterns: ['venue', 'music', 'infrastructure', 'programming', 'public art', 'literary', 'spaces'],
      color: '#3498DB',
      responses: [] as string[]
    }
  }

  // Categorize narratives by themes
  narratives.forEach(text => {
    const lowerText = text.toLowerCase()
    
    // Categorize by impact themes
    Object.entries(themes).forEach(([themeName, theme]) => {
      if (theme.patterns.some(pattern => lowerText.includes(pattern))) {
        theme.responses.push(text)
      }
    })

    // Categorize by feedback themes
    Object.entries(feedback).forEach(([feedbackName, feedbackTheme]) => {
      if (feedbackTheme.patterns.some(pattern => lowerText.includes(pattern))) {
        feedbackTheme.responses.push(text)
      }
    })
  })

  return { themes, feedback }
}

function getKeyInsights(themes: any, feedback: any, totalResponses: number) {
  // Count responses by personal connection type
  const connectionTypes = {
    professional: 0,
    amateur: 0,
    audience: 0
  }

  // Analyze art forms mentioned
  const artForms = {
    music: 0,
    theater: 0,
    visual: 0,
    dance: 0,
    literature: 0,
    digital: 0
  }

  Object.values(themes).forEach((theme: any) => {
    theme.responses.forEach((response: string) => {
      const lower = response.toLowerCase()
      
      // Connection types
      if (lower.includes('professional') || lower.includes('artist') || lower.includes('career') || lower.includes('livelihood')) {
        connectionTypes.professional++
      } else if (lower.includes('paint') || lower.includes('sing') || lower.includes('perform') || lower.includes('choir')) {
        connectionTypes.amateur++
      } else {
        connectionTypes.audience++
      }

      // Art forms
      if (lower.includes('music') || lower.includes('orchestra') || lower.includes('choir') || lower.includes('concert')) artForms.music++
      if (lower.includes('theater') || lower.includes('musical') || lower.includes('play') || lower.includes('bushnell')) artForms.theater++
      if (lower.includes('paint') || lower.includes('visual') || lower.includes('mural') || lower.includes('art')) artForms.visual++
      if (lower.includes('dance') || lower.includes('dancing')) artForms.dance++
      if (lower.includes('writing') || lower.includes('literature') || lower.includes('story')) artForms.literature++
      if (lower.includes('digital')) artForms.digital++
    })
  })

  return {
    totalResponses,
    connectionTypes,
    artForms,
    topThemes: Object.entries(themes)
      .map(([name, data]: [string, any]) => ({
        name,
        count: data.responses.length,
        percentage: Math.round((data.responses.length / totalResponses) * 100),
        color: data.color
      }))
      .sort((a, b) => b.count - a.count),
    topFeedback: Object.entries(feedback)
      .map(([name, data]: [string, any]) => ({
        name,
        count: data.responses.length,
        percentage: Math.round((data.responses.length / totalResponses) * 100),
        color: data.color
      }))
      .sort((a, b) => b.count - a.count)
  }
}

export async function GET() {
  try {
    const table = await readLatestNarrativeCsv()
    if (!table || table.length <= 1) {
      return Response.json({ 
        themes: {},
        feedback: {},
        insights: { totalResponses: 0, connectionTypes: {}, artForms: {}, topThemes: [], topFeedback: [] },
        error: 'No narrative data found' 
      })
    }

    // Extract narratives from both columns
    const header = table[0]
    const rows = table.slice(1)
    
    const narratives: string[] = []
    rows.forEach(row => {
      // Get both columns (arts impact and change suggestions)
      if (row[0] && row[0].trim()) narratives.push(row[0].trim())
      if (row[1] && row[1].trim()) narratives.push(row[1].trim())
    })

    const { themes, feedback } = analyzeThemes(narratives)
    const insights = getKeyInsights(themes, feedback, narratives.length)

    return Response.json({
      themes,
      feedback,
      insights,
      success: true
    })
  } catch (error) {
    console.error('Error analyzing narrative themes:', error)
    return Response.json({ 
      themes: {},
      feedback: {},
      insights: { totalResponses: 0, connectionTypes: {}, artForms: {}, topThemes: [], topFeedback: [] },
      error: 'Failed to analyze themes' 
    }, { status: 500 })
  }
}