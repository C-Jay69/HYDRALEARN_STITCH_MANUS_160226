import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function StudentPlayground() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("quests");

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-xl">🐉</span>
            </div>
            <h1 className="text-2xl font-bold">HydraLearn</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setActiveTab("quests")}
              className={`font-semibold transition-colors ${
                activeTab === "quests"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Quests
            </button>
            <button
              onClick={() => setActiveTab("games")}
              className={`font-semibold transition-colors ${
                activeTab === "games"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Games
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`font-semibold transition-colors ${
                activeTab === "chat"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sidekick
            </button>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20">
              <span className="text-purple-400">⚡</span>
              <span className="font-bold text-purple-400">{user?.xpPoints || 0} XP</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-4 tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-purple-500 via-cyan-400 to-green-400 bg-clip-text text-transparent">Super Hero!</span>
          </h2>
          <p className="text-gray-400 text-lg">Your learning adventure awaits</p>
        </div>

        {/* Progress Card */}
        <Card className="mb-12 bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Level 14 - Junior Guardian</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current XP</span>
                <span className="font-bold text-cyan-400">{user?.xpPoints || 0} / 1000 XP</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
                  style={{ width: `${Math.min((user?.xpPoints || 0) / 10, 100)}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quests Section */}
        {activeTab === "quests" && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Daily Quest</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">Complete 3 lessons today</p>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                  Start Quest
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-cyan-500/50 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Weekly Challenge</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">Reach 500 XP this week</p>
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-green-500 text-white">
                  View Challenge
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-green-500/50 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg">Legendary Quest</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">Unlock the Lightning Cape</p>
                <Button className="w-full bg-gradient-to-r from-green-500 to-purple-500 text-white">
                  View Quest
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Games Section */}
        {activeTab === "games" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle>Meme Battle</CardTitle>
                <CardDescription>Compete with other students</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Join Battle
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-cyan-500/50 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle>Game Show Arena</CardTitle>
                <CardDescription>Test your knowledge</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                  Enter Arena
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Chat Section */}
        {activeTab === "chat" && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Sidekick Chat</CardTitle>
              <CardDescription>Your AI-powered learning companion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Chat interface coming soon...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
