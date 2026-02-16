import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

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
              onClick={() => setActiveTab("overview")}
              className={`font-semibold transition-colors ${
                activeTab === "overview"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`font-semibold transition-colors ${
                activeTab === "manage"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Manage
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`font-semibold transition-colors ${
                activeTab === "ai"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              AI Tools
            </button>
          </nav>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{user?.name || "Teacher"}</p>
              <p className="text-xs text-gray-400">Lead Educator</p>
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
        <div className="mb-12">
          <h2 className="text-5xl font-black mb-2 tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">Commander</span>
          </h2>
          <p className="text-gray-400">Manage your classroom and track student progress</p>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">24</div>
                  <p className="text-xs text-gray-500 mt-1">+2 this week</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Avg. Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">78%</div>
                  <p className="text-xs text-gray-500 mt-1">+5% from last week</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Lessons Created</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12</div>
                  <p className="text-xs text-gray-500 mt-1">3 published</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-400">3</div>
                  <p className="text-xs text-gray-500 mt-1">Students need help</p>
                </CardContent>
              </Card>
            </div>

            {/* Class Health */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Class Health Analytics</CardTitle>
                <CardDescription>Real-time insights into student engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Engagement</span>
                      <span className="text-sm text-cyan-400">85%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Completion Rate</span>
                      <span className="text-sm text-purple-400">78%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Manage Tab */}
        {activeTab === "manage" && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Create Lesson</CardTitle>
                <CardDescription>Generate AI-powered lessons</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                  New Lesson
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Manage Students</CardTitle>
                <CardDescription>View and manage class roster</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-green-500 text-white">
                  View Roster
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Auto-Grading</CardTitle>
                <CardDescription>AI-assisted assignment grading</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  Grade Assignments
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Interventions</CardTitle>
                <CardDescription>Alert students who need help</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  View Alerts
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Tools Tab */}
        {activeTab === "ai" && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>AI Training Lab</CardTitle>
              <CardDescription>Customize AI models for your teaching style</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <h3 className="font-semibold mb-2">Lesson Generator</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Create personalized lessons based on subject, age group, and teaching tone
                  </p>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Generate Lesson
                  </Button>
                </div>

                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <h3 className="font-semibold mb-2">Activity Generator</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    Automatically create engaging activities and quizzes
                  </p>
                  <Button className="bg-cyan-600 hover:bg-cyan-700">
                    Generate Activity
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
