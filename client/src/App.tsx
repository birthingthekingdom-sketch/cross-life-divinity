import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { InstallPrompt } from "./components/InstallPrompt";
import { MobileNav } from "./components/MobileNav";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Enroll from "./pages/Enroll";
import CoursePage from "./pages/CoursePage";
import LessonPage from "./pages/LessonPage";
import Admin from "./pages/Admin";
import AdminCourseDetail from "./pages/AdminCourseDetail";
import AdminEditLesson from "./pages/AdminEditLesson";
import AdminBulkImport from "./pages/AdminBulkImport";
import CourseForum from "./pages/CourseForum";
import ForumTopic from "./pages/ForumTopic";
import AdminEmailSettings from "./pages/AdminEmailSettings";
import AdminFollowUps from "./pages/AdminFollowUps";
import AdminWebinars from "@/pages/AdminWebinars";
import AdminAnalytics from "@/pages/AdminAnalytics";
import Webinars from "./pages/Webinars";
import MyCertificates from "./pages/MyCertificates";
import VerifyCertificate from "./pages/VerifyCertificate";
import Progress from "./pages/Progress";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import AccountSecurity from './pages/AccountSecurity';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/verify-email" component={VerifyEmail} />
        <Route path="/account-security" component={AccountSecurity} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/enroll" component={Enroll} />
      <Route path="/course/:id" component={CoursePage} />
      <Route path="/lesson/:id" component={LessonPage} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/course/:id" component={AdminCourseDetail} />
      <Route path="/admin/lesson/:id" component={AdminEditLesson} />
      <Route path="/admin/bulk-import" component={AdminBulkImport} />
      <Route path="/course/:id/forum" component={CourseForum} />
      <Route path="/forum/topic/:id" component={ForumTopic} />
      <Route path="/admin/email-settings" component={AdminEmailSettings} />
      <Route path="/admin/follow-ups" component={AdminFollowUps} />
          <Route path="/admin/webinars" component={AdminWebinars} />
          <Route path="/admin/analytics" component={AdminAnalytics} />
      <Route path="/webinars" component={Webinars} />
      <Route path="/certificates" component={MyCertificates} />
      <Route path="/verify/:token" component={VerifyCertificate} />
      <Route path="/progress" component={Progress} />
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
          <InstallPrompt />
          <Router />
          <MobileNav />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
