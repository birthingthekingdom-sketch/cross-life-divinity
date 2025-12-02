import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Enroll from "./pages/Enroll";
import CoursePage from "./pages/CoursePage";
import LessonPage from "./pages/LessonPage";
import Admin from "./pages/Admin";
import AdminCourseDetail from "./pages/AdminCourseDetail";
import AdminEditLesson from "./pages/AdminEditLesson";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/enroll" component={Enroll} />
      <Route path="/course/:id" component={CoursePage} />
      <Route path="/lesson/:id" component={LessonPage} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/course/:id" component={AdminCourseDetail} />
      <Route path="/admin/lesson/:id" component={AdminEditLesson} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
