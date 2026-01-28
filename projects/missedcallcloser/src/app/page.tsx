'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to email service
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[var(--cream)]/90 backdrop-blur-sm z-50 border-b border-[var(--sand)]/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[var(--teal)] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-[var(--black)]">MissedCallCloser</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[var(--black)] hover:text-[var(--teal)] transition">Features</a>
            <a href="#pricing" className="text-[var(--black)] hover:text-[var(--teal)] transition">Pricing</a>
            <a href="#demo" className="text-[var(--black)] hover:text-[var(--teal)] transition">Demo</a>
            <Link href="/dashboard" className="px-4 py-2 bg-[var(--teal)] text-white rounded-lg hover:bg-[var(--teal-dark)] transition">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-hero pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-1 bg-[var(--teal)]/10 text-[var(--teal-dark)] rounded-full text-sm font-medium mb-6">
              ⚡ AI-Powered Callback in 60 Seconds
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[var(--black)] leading-tight mb-6">
              Never Lose Another Lead to a{' '}
              <span className="text-[var(--teal)]">Missed Call</span>
            </h1>
            <p className="text-xl text-[var(--black)]/80 mb-8 leading-relaxed">
              When customers call and you can&apos;t answer, MissedCallCloser calls them back instantly with AI — qualifying leads, answering questions, and booking appointments while you focus on what matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#demo" className="px-8 py-4 bg-[var(--teal)] text-white text-lg font-semibold rounded-lg hover:bg-[var(--teal-dark)] transition shadow-lg shadow-[var(--teal)]/30 text-center">
                Try Free Demo
              </a>
              <a href="#pricing" className="px-8 py-4 border-2 border-[var(--black)] text-[var(--black)] text-lg font-semibold rounded-lg hover:bg-[var(--black)] hover:text-white transition text-center">
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-[var(--black)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[var(--teal-light)]">40%</div>
              <div className="text-[var(--cream)] mt-1">of calls go unanswered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--teal-light)]">$500+</div>
              <div className="text-[var(--cream)] mt-1">average lost per call</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--teal-light)]">60s</div>
              <div className="text-[var(--cream)] mt-1">average callback time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--teal-light)]">24/7</div>
              <div className="text-[var(--cream)] mt-1">always on duty</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--black)] mb-4">
              How It Works
            </h2>
            <p className="text-xl text-[var(--black)]/70 max-w-2xl mx-auto">
              Set it up in 5 minutes. Let AI handle the rest.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[var(--cream)] border border-[var(--sand)]/20">
              <div className="w-14 h-14 rounded-xl bg-[var(--teal)]/10 flex items-center justify-center mb-6">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-[var(--black)] mb-3">
                1. Connect Your Phone
              </h3>
              <p className="text-[var(--black)]/70">
                Forward missed calls to your MissedCallCloser number, or use our Twilio integration for automatic detection.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[var(--cream)] border border-[var(--sand)]/20">
              <div className="w-14 h-14 rounded-xl bg-[var(--teal)]/10 flex items-center justify-center mb-6">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-[var(--black)] mb-3">
                2. AI Calls Back
              </h3>
              <p className="text-[var(--black)]/70">
                Within 60 seconds, our AI agent calls your lead — introducing your business, answering questions, and qualifying their needs.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[var(--cream)] border border-[var(--sand)]/20">
              <div className="w-14 h-14 rounded-xl bg-[var(--teal)]/10 flex items-center justify-center mb-6">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-bold text-[var(--black)] mb-3">
                3. Book or Notify
              </h3>
              <p className="text-[var(--black)]/70">
                Hot leads get booked directly into your calendar. Others get a summary texted to you with their info and needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 bg-[var(--cream-dark)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[var(--black)] mb-4">
              Built for Local Service Businesses
            </h2>
            <p className="text-xl text-[var(--black)]/70">
              The businesses that can&apos;t afford to miss a single lead.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🔧', title: 'Plumbers', desc: 'Emergency calls at 2am? AI handles it.' },
              { icon: '❄️', title: 'HVAC', desc: 'Book AC repairs before they call someone else.' },
              { icon: '🦷', title: 'Dentists', desc: 'Fill your schedule with qualified patients.' },
              { icon: '⚡', title: 'Electricians', desc: 'Turn after-hours calls into morning appointments.' },
              { icon: '🏠', title: 'Realtors', desc: 'Never miss a hot buyer inquiry.' },
              { icon: '🚗', title: 'Auto Repair', desc: 'Book service appointments 24/7.' },
              { icon: '💇', title: 'Salons', desc: 'Keep your chairs full automatically.' },
              { icon: '🏋️', title: 'Gyms', desc: 'Convert membership inquiries instantly.' },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-white rounded-xl border border-[var(--sand)]/20 hover:shadow-lg transition">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="font-bold text-[var(--black)] mt-3 mb-1">{item.title}</h3>
                <p className="text-sm text-[var(--black)]/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[var(--black)] mb-4">
            Try It Yourself
          </h2>
          <p className="text-xl text-[var(--black)]/70 mb-8">
            Enter your phone number and experience MissedCallCloser as a customer would.
          </p>

          <div className="bg-[var(--cream)] p-8 rounded-2xl border border-[var(--sand)]/20 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[var(--teal)] flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>
            <p className="text-[var(--black)]/70 mb-4">
              Our AI will call you back within 60 seconds, just like it would call your customers.
            </p>
            <div className="space-y-4">
              <input
                type="tel"
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 rounded-lg border border-[var(--sand)]/30 focus:border-[var(--teal)] focus:outline-none text-center text-lg"
              />
              <button className="w-full px-6 py-3 bg-[var(--teal)] text-white font-semibold rounded-lg hover:bg-[var(--teal-dark)] transition">
                Call Me Back
              </button>
            </div>
            <p className="text-sm text-[var(--black)]/50 mt-4">
              No credit card required. Standard messaging rates may apply.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-[var(--black)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-[var(--cream)]/80">
              Start free. Upgrade when you&apos;re ready.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-[var(--black-light)] rounded-2xl p-8 border border-[var(--sand)]/20">
              <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
              <p className="text-[var(--cream)]/70 mb-6">For testing the waters</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$79</span>
                <span className="text-[var(--cream)]/70">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-[var(--cream)]">
                  <svg className="w-5 h-5 text-[var(--teal-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  100 AI call minutes
                </li>
                <li className="flex items-center gap-2 text-[var(--cream)]">
                  <svg className="w-5 h-5 text-[var(--teal-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  1 phone number
                </li>
                <li className="flex items-center gap-2 text-[var(--cream)]">
                  <svg className="w-5 h-5 text-[var(--teal-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  SMS notifications
                </li>
                <li className="flex items-center gap-2 text-[var(--cream)]">
                  <svg className="w-5 h-5 text-[var(--teal-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic analytics
                </li>
              </ul>
              <button className="w-full py-3 border-2 border-[var(--teal)] text-[var(--teal-light)] font-semibold rounded-lg hover:bg-[var(--teal)] hover:text-white transition">
                Start Free Trial
              </button>
            </div>

            {/* Pro - Featured */}
            <div className="bg-[var(--teal)] rounded-2xl p-8 relative transform md:-translate-y-4">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--palm)] text-white text-sm font-semibold rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
              <p className="text-white/80 mb-6">For growing businesses</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$199</span>
                <span className="text-white/80">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-white">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited AI minutes
                </li>
                <li className="flex items-center gap-2 text-white">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  3 phone numbers
                </li>
                <li className="flex items-center gap-2 text-white">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Calendar integration
                </li>
                <li className="flex items-center gap-2 text-white">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom AI script
                </li>
                <li className="flex items-center gap-2 text-white">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
              </ul>
              <button className="w-full py-3 bg-white text-[var(--teal-dark)] font-semibold rounded-lg hover:bg-[var(--cream)] transition">
                Start Free Trial
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-[var(--black-light)] rounded-2xl p-8 border border-[var(--sand)]/20">
              <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-[var(--cream)]/70 mb-6">For teams & agencies</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-[var(--cream)]">
                  <svg className="w-5 h-5 text-[var(--teal-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Everything in Pro
                </li>
                <li className="flex items-center gap-2 text-[var(--cream)]">
                  <svg className="w-5 h-5 text-[var(--teal-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited numbers
                </li>
                <li className="flex items-center gap-2 text-[var(--cream)]">
                  <svg className="w-5 h-5 text-[var(--teal-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  White-label option
                </li>
                <li className="flex items-center gap-2 text-[var(--cream)]">
                  <svg className="w-5 h-5 text-[var(--teal-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  API access
                </li>
                <li className="flex items-center gap-2 text-[var(--cream)]">
                  <svg className="w-5 h-5 text-[var(--teal-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Dedicated support
                </li>
              </ul>
              <button className="w-full py-3 border-2 border-[var(--teal)] text-[var(--teal-light)] font-semibold rounded-lg hover:bg-[var(--teal)] hover:text-white transition">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-[var(--cream-dark)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[var(--black)] mb-4">
            Stop Losing Leads Tonight
          </h2>
          <p className="text-xl text-[var(--black)]/70 mb-8">
            Join hundreds of local businesses who never miss a customer call again.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-[var(--sand)]/30 focus:border-[var(--teal)] focus:outline-none"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[var(--teal)] text-white font-semibold rounded-lg hover:bg-[var(--teal-dark)] transition whitespace-nowrap"
              >
                Get Started Free
              </button>
            </form>
          ) : (
            <div className="bg-[var(--teal)]/10 text-[var(--teal-dark)] px-6 py-4 rounded-lg inline-block">
              ✓ Thanks! We&apos;ll be in touch shortly.
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-[var(--black)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--teal)] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">MissedCallCloser</span>
            </div>
            <div className="flex gap-8 text-[var(--cream)]/70">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Contact</a>
            </div>
            <div className="text-[var(--cream)]/50 text-sm">
              © 2026 MissedCallCloser. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
