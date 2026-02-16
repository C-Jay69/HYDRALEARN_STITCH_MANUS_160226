import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    // Redirect authenticated users to their dashboard
    if (isAuthenticated) {
      if (user?.role === "teacher") {
        navigate("/dashboard");
      } else if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/playground");
      }
    }
  }, [isAuthenticated, user, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                <span className="text-2xl">🐉</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">
                Hydra<span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">Learn</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8 font-medium">
              <a className="hover:text-purple-400 transition-colors" href="#platform">
                Platform
              </a>
              <a className="hover:text-purple-400 transition-colors" href="#features">
                Features
              </a>
              <a className="hover:text-purple-400 transition-colors" href="#resources">
                Resources
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={getLoginUrl()}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500 rounded-full blur-[128px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[128px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-purple-100/10 text-purple-300 mb-6 border border-purple-500/20">
                <span className="mr-2">✨</span>
                AI-Powered Future of Learning
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-8">
                Education <br />
                <span className="bg-gradient-to-r from-purple-500 via-cyan-400 to-green-400 bg-clip-text text-transparent italic">
                  with Bite.
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-400 mb-10 max-w-lg leading-relaxed">
                Unleash the multi-headed power of AI in your classroom. Personalized learning for students, streamlined workflows for teachers, and deep insights for admins.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={getLoginUrl()}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-purple-500/25 hover:scale-105 transition-transform text-center"
                >
                  Join the Forge
                </a>
                <button className="px-8 py-4 border border-gray-700 hover:bg-gray-900 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
                  <span>▶</span>
                  See how it works
                </button>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-700"></div>
              <div className="relative w-full h-auto bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl p-8 border border-purple-500/20">
                <div className="text-6xl text-center">🐉</div>
                <p className="text-center text-gray-400 mt-4">HydraLearn Platform</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-y border-gray-800 bg-gray-900/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8">
            Trusted by Educators Worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🏛️</span>
              <span className="text-xl font-bold">University of Oxford</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">🔬</span>
              <span className="text-xl font-bold">MIT Edu</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">🚀</span>
              <span className="text-xl font-bold">Stanford Tech</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">🌍</span>
              <span className="text-xl font-bold">Global Schools</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">A Triple-Headed Solution</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Powerful tools designed specifically for every stakeholder in the modern educational ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Learn Card */}
            <div className="group p-8 rounded-2xl bg-gray-900 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="w-16 h-16 rounded-2xl bg-purple-900/30 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Learn</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Adaptive AI tutors that understand your pace. Mastery-based learning paths designed to keep students engaged and thriving.
              </p>
              <ul className="space-y-3 text-sm font-medium text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">✓</span> 24/7 Personal AI Tutor
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400">✓</span> Interactive Study Quests
                </li>
              </ul>
            </div>

            {/* Manage Card */}
            <div className="group p-8 rounded-2xl bg-gray-900 border border-gray-800 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10">
              <div className="w-16 h-16 rounded-2xl bg-cyan-900/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Manage</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Empower teachers with AI grading assistants and real-time intervention dashboards. Spend more time teaching, less time tracking.
              </p>
              <ul className="space-y-3 text-sm font-medium text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span> Auto-Grading & Feedback
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">✓</span> Class Health Analytics
                </li>
              </ul>
            </div>

            {/* Protect Card */}
            <div className="group p-8 rounded-2xl bg-gray-900 border border-gray-800 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10">
              <div className="w-16 h-16 rounded-2xl bg-indigo-900/30 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Protect</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Enterprise-grade data security and AI ethics frameworks. We ensure your institution's data remains private and compliant.
              </p>
              <ul className="space-y-3 text-sm font-medium text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400">✓</span> FERPA/GDPR Compliant
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400">✓</span> Ethical AI Safeguards
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border-y border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Education?</h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of educators and students already using HydraLearn to revolutionize learning.
          </p>
          <a
            href={getLoginUrl()}
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-purple-500/25 hover:scale-105 transition-transform"
          >
            Get Started Today
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 pt-20 pb-10 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white">
                  <span className="text-lg">🐉</span>
                </div>
                <span className="text-xl font-bold">HydraLearn</span>
              </div>
              <p className="text-gray-400 mb-6">
                Revolutionizing education through the lens of ethical and powerful AI technology.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 HydraLearn. All rights reserved. Education with Bite.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
