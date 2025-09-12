'use client';

import { useState } from 'react';
import ScheduleCallModal from './ScheduleCallModal';

interface StepHelperProps {
  step: 'objectives' | 'audience' | 'pain_points' | 'success_metrics' | 'timeline_budget';
  onSuggestion?: (suggestion: string) => void;
  projectContext?: {
    client_name: string;
    project_title: string;
    sector: string;
    industry: string;
  };
}

interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
}

export default function StepHelper({ step, onSuggestion, projectContext }: StepHelperProps) {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const helpContent = {
    objectives: {
      title: "Project Objectives",
      quickHelp: "Think about what you want to achieve - increased engagement, better decision-making, or improved community relations.",
      examples: [
        "Increase community engagement by 40%",
        "Improve stakeholder satisfaction scores",
        "Create more inclusive decision-making processes",
        "Build stronger relationships with key community groups"
      ],
      initialMessage: "Hi! I'm here to help you identify your project objectives. What's the main challenge or opportunity you're trying to address?"
    },
    audience: {
      title: "Target Audience",
      quickHelp: "Consider all groups who will be affected by or involved in your project - residents, officials, businesses, nonprofits.",
      examples: [
        "Local residents and families",
        "City council members and staff",
        "Local business owners",
        "Community organizations and nonprofits",
        "Youth and students"
      ],
      initialMessage: "Let's identify your key stakeholders! Who are the main groups of people involved in or affected by this project?"
    },
    pain_points: {
      title: "Pain Points & Challenges",
      quickHelp: "What problems are you trying to solve? Think about current frustrations, barriers, or unmet needs.",
      examples: [
        "Low community participation in planning processes",
        "Difficulty reaching diverse voices",
        "Lack of trust between residents and officials",
        "Complex issues that need clearer communication"
      ],
      initialMessage: "What challenges or frustrations are you currently facing that this project should address?"
    },
    success_metrics: {
      title: "Success Metrics",
      quickHelp: "How will you know if you've succeeded? Think both quantitative (numbers) and qualitative (feelings, stories).",
      examples: [
        "Survey response rates above 25%",
        "Representation from at least 5 demographic groups",
        "80% of participants feel heard and valued",
        "Policy recommendations implemented within 6 months"
      ],
      initialMessage: "Great question about measuring success! What would 'success' look like for your project? Let's think about both numbers and stories."
    },
    timeline_budget: {
      title: "Timeline & Budget",
      quickHelp: "Consider your organization's capacity, any deadlines you're working toward, and realistic budget ranges.",
      examples: [],
      initialMessage: "Let's talk about your timeline and budget. Do you have any specific deadlines or events driving your timeline?"
    }
  };

  const content = helpContent[step];

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: userInput };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(step, userInput, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (currentStep: string, input: string, history: ChatMessage[]): string => {
    const responses = {
      objectives: [
        "That's a great start! Can you be more specific about what success would look like? For example, if you want to increase engagement, by how much and with which groups?",
        "I see you're focused on community impact. Have you considered breaking this down into shorter-term and longer-term objectives?",
        "That sounds important! What would be the first sign that you're making progress toward this goal?"
      ],
      audience: [
        "Good thinking! For each group you mentioned, consider their different needs and communication preferences. Are there any groups that might be harder to reach?",
        "That's a solid list. Are there any groups that might be skeptical or resistant to this project? It's important to include them too.",
        "Great! Now think about the different ways each group likes to participate - some prefer online, others in-person, some need childcare or translation."
      ],
      pain_points: [
        "That's a real challenge many communities face. Can you dig deeper - what do you think is causing this problem?",
        "I hear you. Have you tried addressing this before? What worked or didn't work?",
        "This sounds frustrating! How is this problem currently affecting your community or organization?"
      ],
      success_metrics: [
        "Excellent! That's measurable and meaningful. Can you think of one qualitative metric to go with that quantitative one?",
        "That's a great outcome-focused metric. How would you actually measure that? Surveys? Interviews? Participation data?",
        "I love that you're thinking about both process and outcome! Are there any interim milestones you could track along the way?"
      ],
      timeline_budget: [
        "That timeframe sounds reasonable. Do you have any specific events or seasons that might affect participation?",
        "Budget-wise, it's helpful to think about what you absolutely need versus what would be nice to have. What are your must-haves?",
        "Good to think realistically about capacity. Have you done similar projects before that could inform your timeline?"
      ]
    };

    const stepResponses = responses[currentStep as keyof typeof responses] || responses.objectives;
    return stepResponses[Math.floor(Math.random() * stepResponses.length)];
  };

  const startChat = () => {
    setShowChat(true);
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: content.initialMessage }]);
    }
  };

  const scheduleCall = () => {
    setShowScheduleModal(true);
  };

  return (
    <>
      {/* Help Section */}
      <div className="mb-6 p-4 warren-card" style={{ backgroundColor: '#E6F4EA' }}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2" style={{ color: '#64B37A' }}>
              Need help with {content.title.toLowerCase()}?
            </h3>
            <p className="text-gray-700 mb-3">{content.quickHelp}</p>
            
            {content.examples.length > 0 && (
              <div className="mb-3">
                <p className="text-sm font-medium text-gray-600 mb-2">Examples:</p>
                <div className="space-y-1">
                  {content.examples.map((example, index) => (
                    <div
                      key={index}
                      className="text-sm bg-white p-2 rounded cursor-pointer hover:bg-gray-50 border-l-2"
                      style={{ borderColor: '#64B37A' }}
                      onClick={() => onSuggestion?.(example)}
                    >
                      "{example}"
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-3 mt-4">
          <button
            onClick={startChat}
            className="warren-button-secondary text-sm"
            style={{ padding: '8px 16px' }}
          >
            💬 Let's chat about it!
          </button>
          <button
            onClick={scheduleCall}
            className="warren-button-primary text-sm"
            style={{ padding: '8px 16px' }}
          >
            📞 Get a human
          </button>
        </div>
      </div>

      {/* Chatbot Modal */}
      {showChat && (
        <div className="chat-modal">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between" style={{ backgroundColor: '#64B37A' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-sm font-bold" style={{ color: '#64B37A' }}>W</span>
              </div>
              <span className="text-white font-medium">Discovery Assistant</span>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto" style={{ height: '350px' }}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-gray-100 text-gray-800'
                      : 'text-white'
                  }`}
                  style={{
                    backgroundColor: message.role === 'assistant' ? '#64B37A' : undefined
                  }}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="text-left mb-4">
                <div
                  className="inline-block p-3 rounded-lg text-white"
                  style={{ backgroundColor: '#64B37A' }}
                >
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                placeholder="Type your message..."
              />
              <button
                onClick={handleSendMessage}
                disabled={!userInput.trim()}
                className="warren-button-primary text-sm"
                style={{ padding: '8px 12px' }}
              >
                Send
              </button>
            </div>
            
            <div className="text-center mt-3">
              <button
                onClick={scheduleCall}
                className="text-xs underline"
                style={{ color: '#64B37A' }}
              >
                Prefer to talk to a human? Schedule a call →
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ScheduleCallModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        currentStep={content.title}
        projectContext={projectContext}
      />
    </>
  );
}