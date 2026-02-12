'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock data for demo
const mockCalls = [
  {
    id: '1',
    callerNumber: '+1 (555) 234-5678',
    callerName: 'John Smith',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    duration: '2:34',
    status: 'completed',
    outcome: 'booked',
    summary: 'Interested in HVAC repair. Booked appointment for Thursday 2pm.',
  },
  {
    id: '2',
    callerNumber: '+1 (555) 345-6789',
    callerName: 'Sarah Johnson',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    duration: '1:12',
    status: 'completed',
    outcome: 'callback',
    summary: 'Needs quote for bathroom plumbing. Requested callback tomorrow morning.',
  },
  {
    id: '3',
    callerNumber: '+1 (555) 456-7890',
    callerName: 'Mike Davis',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    duration: '0:45',
    status: 'completed',
    outcome: 'not_interested',
    summary: 'Wrong number - was looking for auto repair.',
  },
  {
    id: '4',
    callerNumber: '+1 (555) 567-8901',
    callerName: 'Emily Wilson',
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    duration: '3:21',
    status: 'completed',
    outcome: 'booked',
    summary: 'Emergency water heater issue. Booked for same-day service.',
  },
  {
    id: '5',
    callerNumber: '+1 (555) 678-9012',
    callerName: 'Unknown',
    timestamp: new Date(Date.now() - 1000 * 60 * 240),
    duration: '0:00',
    status: 'no_answer',
    outcome: 'no_answer',
    summary: 'Caller did not answer callback attempt.',
  },
];

const outcomeColors: Record<string, string> = {
  booked: 'bg-green-100 text-green-800',
  callback: 'bg-blue-100 text-blue-800',
  not_interested: 'bg-gray-100 text-gray-600',
  no_answer: 'bg-yellow-100 text-yellow-800',
};

const outcomeLabels: Record<string, string> = {
  booked: 'Booked',
  callback: 'Callback Requested',
  not_interested: 'Not Interested',
  no_answer: 'No Answer',
};

function formatTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'calls' | 'settings'>('calls');
  const [businessName, setBusinessName] = useState('Acme Plumbing & HVAC');
  const [greeting, setGreeting] = useState(
    "Hi! This is an AI assistant calling on behalf of {business}. I noticed you tried to reach us a moment ago. How can I help you today?"
  );

  const stats = {
    totalCalls: mockCalls.length,
    booked: mockCalls.filter((c) => c.outcome === 'booked').length,
    callbackRate: Math.round(
      (mockCalls.filter((c) => c.outcome === 'booked' || c.outcome === 'callback').length /
        mockCalls.filter((c) => c.status === 'completed').length) *
        100
    ),
    avgDuration: '1:52',
  };

  return (
    <div className="min-h-screen bg-[var(--cream)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--sand)]/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[var(--teal)] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-[var(--black)]">MissedCallCloser</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[var(--black)]/70">Demo Account</span>
            <div className="w-10 h-10 rounded-full bg-[var(--sand)] flex items-center justify-center text-white font-semibold">
              DA
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-[var(--sand)]/20">
            <div className="text-3xl font-bold text-[var(--black)]">{stats.totalCalls}</div>
            <div className="text-[var(--black)]/60 text-sm">Total Calls Today</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[var(--sand)]/20">
            <div className="text-3xl font-bold text-green-600">{stats.booked}</div>
            <div className="text-[var(--black)]/60 text-sm">Appointments Booked</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[var(--sand)]/20">
            <div className="text-3xl font-bold text-[var(--teal)]">{stats.callbackRate}%</div>
            <div className="text-[var(--black)]/60 text-sm">Conversion Rate</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-[var(--sand)]/20">
            <div className="text-3xl font-bold text-[var(--black)]">{stats.avgDuration}</div>
            <div className="text-[var(--black)]/60 text-sm">Avg Call Duration</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('calls')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'calls'
                ? 'bg-[var(--teal)] text-white'
                : 'bg-white text-[var(--black)] hover:bg-[var(--cream)]'
            }`}
          >
            Call Log
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === 'settings'
                ? 'bg-[var(--teal)] text-white'
                : 'bg-white text-[var(--black)] hover:bg-[var(--cream)]'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Call Log */}
        {activeTab === 'calls' && (
          <div className="bg-white rounded-xl border border-[var(--sand)]/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--cream)]">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--black)]">
                      Caller
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--black)]">
                      Time
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--black)]">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--black)]">
                      Outcome
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--black)]">
                      Summary
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockCalls.map((call) => (
                    <tr key={call.id} className="border-t border-[var(--sand)]/10 hover:bg-[var(--cream)]">
                      <td className="px-6 py-4">
                        <div className="font-medium text-[var(--black)]">{call.callerName}</div>
                        <div className="text-sm text-[var(--black)]/60">{call.callerNumber}</div>
                      </td>
                      <td className="px-6 py-4 text-[var(--black)]/70">
                        {formatTime(call.timestamp)}
                      </td>
                      <td className="px-6 py-4 text-[var(--black)]/70">{call.duration}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            outcomeColors[call.outcome]
                          }`}
                        >
                          {outcomeLabels[call.outcome]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[var(--black)]/70 max-w-xs truncate">
                        {call.summary}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Business Info */}
            <div className="bg-white rounded-xl border border-[var(--sand)]/20 p-6">
              <h3 className="text-lg font-semibold text-[var(--black)] mb-4">Business Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--black)]/70 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full max-w-md px-4 py-2 rounded-lg border border-[var(--sand)]/30 focus:border-[var(--teal)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--black)]/70 mb-1">
                    Phone Number
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value="+1 (555) 123-4567"
                      disabled
                      className="w-full max-w-md px-4 py-2 rounded-lg border border-[var(--sand)]/30 bg-[var(--cream)] text-[var(--black)]/60"
                    />
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Script */}
            <div className="bg-white rounded-xl border border-[var(--sand)]/20 p-6">
              <h3 className="text-lg font-semibold text-[var(--black)] mb-4">AI Greeting Script</h3>
              <p className="text-sm text-[var(--black)]/60 mb-4">
                Customize how the AI introduces itself. Use {'{business}'} to insert your business name.
              </p>
              <textarea
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-[var(--sand)]/30 focus:border-[var(--teal)] focus:outline-none resize-none"
              />
              <div className="mt-4 p-4 bg-[var(--cream)] rounded-lg">
                <div className="text-xs font-medium text-[var(--black)]/60 mb-2">Preview:</div>
                <div className="text-[var(--black)]">
                  {greeting.replace('{business}', businessName)}
                </div>
              </div>
            </div>

            {/* Integration */}
            <div className="bg-white rounded-xl border border-[var(--sand)]/20 p-6">
              <h3 className="text-lg font-semibold text-[var(--black)] mb-4">Integrations</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border border-[var(--sand)]/20 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--teal)]/10 rounded-lg flex items-center justify-center">
                      📅
                    </div>
                    <div>
                      <div className="font-medium text-[var(--black)]">Calendly</div>
                      <div className="text-sm text-[var(--black)]/60">Auto-book appointments</div>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-[var(--teal)] text-[var(--teal)] rounded-lg hover:bg-[var(--teal)] hover:text-white transition text-sm font-medium">
                    Connect
                  </button>
                </div>
                <div className="p-4 border border-[var(--sand)]/20 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--teal)]/10 rounded-lg flex items-center justify-center">
                      📱
                    </div>
                    <div>
                      <div className="font-medium text-[var(--black)]">SMS Notifications</div>
                      <div className="text-sm text-[var(--black)]/60">Get instant alerts</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Connected
                  </span>
                </div>
              </div>
            </div>

            {/* Twilio Config */}
            <div className="bg-white rounded-xl border border-[var(--sand)]/20 p-6">
              <h3 className="text-lg font-semibold text-[var(--black)] mb-4">Twilio Configuration</h3>
              <p className="text-sm text-[var(--black)]/60 mb-4">
                Connect your Twilio account to enable AI callbacks.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--black)]/70 mb-1">
                    Account SID
                  </label>
                  <input
                    type="password"
                    placeholder="AC..."
                    className="w-full max-w-md px-4 py-2 rounded-lg border border-[var(--sand)]/30 focus:border-[var(--teal)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--black)]/70 mb-1">
                    Auth Token
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••••••••"
                    className="w-full max-w-md px-4 py-2 rounded-lg border border-[var(--sand)]/30 focus:border-[var(--teal)] focus:outline-none"
                  />
                </div>
                <button className="px-6 py-2 bg-[var(--teal)] text-white rounded-lg hover:bg-[var(--cyan-dark)] transition font-medium">
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
