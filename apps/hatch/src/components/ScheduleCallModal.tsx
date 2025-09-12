'use client';

import { useState } from 'react';

interface ScheduleCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep?: string;
  projectContext?: {
    client_name: string;
    project_title: string;
    sector: string;
    industry: string;
  };
}

export default function ScheduleCallModal({ isOpen, onClose, currentStep, projectContext }: ScheduleCallModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: projectContext?.client_name || '',
    phone: '',
    preferredTime: '',
    specificHelp: '',
    urgency: 'within_week'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const urgencyOptions = [
    { value: 'asap', label: 'ASAP - Urgent deadline' },
    { value: 'within_week', label: 'Within the next week' },
    { value: 'within_month', label: 'Within the next month' },
    { value: 'flexible', label: 'Flexible timing' }
  ];

  const timeSlotOptions = [
    'Morning (9am-12pm ET)',
    'Afternoon (12pm-5pm ET)',
    'Evening (5pm-7pm ET)',
    'Any time works'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real implementation, this would send to your CRM/scheduling system
    console.log('Call request submitted:', {
      ...formData,
      currentStep,
      projectContext
    });

    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Auto-close after 3 seconds
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
    }, 3000);
  };

  if (!isOpen) return null;

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E6F4EA' }}>
            <span className="text-2xl" style={{ color: '#64B37A' }}>✓</span>
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#64B37A' }}>Call Scheduled!</h2>
          <p className="text-gray-600 mb-4">
            Thanks {formData.name}! We'll reach out within 24 hours to schedule your discovery call.
          </p>
          <p className="text-sm text-gray-500">
            Check your email for confirmation details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: '#64B37A' }}>Schedule a Discovery Call</h2>
              <p className="text-gray-600 text-sm mt-1">
                Let's discuss your {projectContext?.sector} project in detail
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>

          {currentStep && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#E6F4EA' }}>
              <h3 className="font-semibold mb-2" style={{ color: '#64B37A' }}>
                We'll help you with: {currentStep.replace('_', ' ')}
              </h3>
              <p className="text-sm text-gray-700">
                Our discovery experts will walk you through this step and provide personalized guidance 
                based on your {projectContext?.sector} sector and {projectContext?.industry} focus area.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="warren-input"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="warren-input"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                  className="warren-input"
                  placeholder="Your organization"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="warren-input"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time *</label>
              <select
                required
                value={formData.preferredTime}
                onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                className="warren-input"
              >
                <option value="">Select preferred time...</option>
                {timeSlotOptions.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timeline *</label>
              <select
                required
                value={formData.urgency}
                onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                className="warren-input"
              >
                {urgencyOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                How can we help? (optional)
              </label>
              <textarea
                value={formData.specificHelp}
                onChange={(e) => setFormData(prev => ({ ...prev, specificHelp: e.target.value }))}
                className="warren-input h-24"
                placeholder="Any specific questions or areas you'd like to focus on during our call..."
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">What to expect:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• 30-45 minute discovery conversation</li>
                <li>• Personalized guidance for your {projectContext?.sector} project</li>
                <li>• Specific recommendations based on Warren's expertise</li>
                <li>• Clear next steps and resource recommendations</li>
                <li>• No sales pressure - focused on your success</li>
              </ul>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="warren-button-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="warren-button-primary flex-1"
              >
                {isSubmitting ? 'Scheduling...' : '📞 Schedule Call'}
              </button>
            </div>
          </form>

          <p className="text-xs text-gray-500 text-center mt-4">
            We'll contact you within 24 hours to confirm your preferred time.
          </p>
        </div>
      </div>
    </div>
  );
}