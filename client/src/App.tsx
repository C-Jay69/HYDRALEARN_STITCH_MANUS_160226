import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./_core/hooks/useAuth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import StudentPlayground from "./pages/StudentPlayground";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminCommandCenter from "./pages/AdminCommandCenter";
import UserProfile from "./pages/UserProfile";

function Router() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path={"/"} component={Home} />
      <Route path={"/login"} component={Login} />

      {/* Protected student routes */}
      {isAuthenticated && user?.role === "user" && (
        <>
          <Route path={"/playground"} component={StudentPlayground} />
          <Route path={"/profile"} component={UserProfile} />
        </>
      )}

      {/* Protected teacher routes */}
      {isAuthenticated && user?.role === "teacher" && (
        <>
          <Route path={"/dashboard"} component={TeacherDashboard} />
          <Route path={"/profile"} component={UserProfile} />
        </>
      )}

      {/* Protected admin routes */}
      {isAuthenticated && user?.role === "admin" && (
        <>
          <Route path={"/admin"} component={AdminCommandCenter} />
          <Route path={"/dashboard"} component={TeacherDashboard} />
          <Route path={"/playground"} component={StudentPlayground} />
          <Route path={"/profile"} component={UserProfile} />
        </>
      )}

      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
