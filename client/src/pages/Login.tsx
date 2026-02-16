import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    // Redirect to Manus OAuth login
    window.location.href = getLoginUrl();
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 mb-4">
            <span className="text-2xl">🐉</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">HydraLearn</h1>
          <p className="text-gray-400">Enter the Forge</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
          <p className="text-center text-gray-300 mb-6">
            Redirecting to login...
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
