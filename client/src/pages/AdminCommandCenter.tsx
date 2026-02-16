import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function AdminCommandCenter() {
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
              Overview
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`font-semibold transition-colors ${
                activeTab === "users"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`font-semibold transition-colors ${
                activeTab === "reports"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Reports
            </button>
            <button
              onClick={() => setActiveTab("compliance")}
              className={`font-semibold transition-colors ${
                activeTab === "compliance"
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Compliance
            </button>
          </nav>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{user?.name || "Admin"}</p>
              <p className="text-xs text-gray-400">System Administrator</p>
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
            <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">Admin Command Center</span>
          </h2>
          <p className="text-gray-400">System-wide management and monitoring</p>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* System Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">1,247</div>
                  <p className="text-xs text-gray-500 mt-1">+45 this week</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Active Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">342</div>
                  <p className="text-xs text-gray-500 mt-1">Currently online</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">99.8%</div>
                  <p className="text-xs text-gray-500 mt-1">Uptime</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Pending Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-400">12</div>
                  <p className="text-xs text-gray-500 mt-1">Needs review</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>System Activity</CardTitle>
                <CardDescription>Real-time platform monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">New user registration</p>
                      <p className="text-sm text-gray-400">45 users joined today</p>
                    </div>
                    <span className="text-green-400">+45</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">Lessons generated</p>
                      <p className="text-sm text-gray-400">AI-powered content creation</p>
                    </div>
                    <span className="text-cyan-400">+23</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">Reports submitted</p>
                      <p className="text-sm text-gray-400">Counselor's corner submissions</p>
                    </div>
                    <span className="text-orange-400">+5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage platform users and roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      View All Users
                    </Button>
                    <Button className="bg-cyan-600 hover:bg-cyan-700">
                      Manage Roles
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700">
                      Export Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>User list interface coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Counselor's Corner Reports</CardTitle>
                <CardDescription>Mental health and wellness reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Submitted</p>
                    <p className="text-2xl font-bold">47</p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Reviewed</p>
                    <p className="text-2xl font-bold">35</p>
                  </div>
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Pending</p>
                    <p className="text-2xl font-bold text-orange-400">12</p>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
                  Review Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === "compliance" && (
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Compliance & Security</CardTitle>
                <CardDescription>FERPA/GDPR compliance tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800 rounded-lg border border-green-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">FERPA Compliance</h3>
                      <span className="text-green-400 text-sm font-bold">✓ Compliant</span>
                    </div>
                    <p className="text-sm text-gray-400">All student data encrypted and secured</p>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg border border-green-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">GDPR Compliance</h3>
                      <span className="text-green-400 text-sm font-bold">✓ Compliant</span>
                    </div>
                    <p className="text-sm text-gray-400">Data processing agreements in place</p>
                  </div>

                  <div className="p-4 bg-gray-800 rounded-lg border border-green-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Ethical AI Safeguards</h3>
                      <span className="text-green-400 text-sm font-bold">✓ Active</span>
                    </div>
                    <p className="text-sm text-gray-400">AI models monitored for bias and fairness</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Security Audit Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-green-500 text-white">
                  View Audit Logs
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
