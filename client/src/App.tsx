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
import Landing from './pages/Landing';
import Enroll from "./pages/Enroll";
import CoursePage from "./pages/CoursePage";
import LessonPage from "./pages/LessonPage";
import Admin from "./pages/Admin";
import AdminChat from "./pages/AdminChat";
import AdminCourseDetail from "./pages/AdminCourseDetail";
import AdminEditLesson from "./pages/AdminEditLesson";
import AdminBulkImport from "./pages/AdminBulkImport";
import CourseForum from "./pages/CourseForum";
import ForumTopic from "./pages/ForumTopic";
import AdminEmailSettings from "./pages/AdminEmailSettings";
import AdminFollowUps from "./pages/AdminFollowUps";
import AdminWebinars from "@/pages/AdminWebinars";
import AdminAnalytics from "@/pages/AdminAnalytics";
import AdminGrading from "./pages/AdminGrading";
import PeerReviews from "./pages/PeerReviews";
import { AssignmentCalendar } from "./pages/AssignmentCalendar";
import Webinars from "./pages/Webinars";
import MyCertificates from "./pages/MyCertificates";
import VerifyCertificate from "./pages/VerifyCertificate";
import Progress from "./pages/Progress";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import Pricing from './pages/Pricing';
import Courses from './pages/Courses';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import Upgrade from './pages/Upgrade';
import Subscription from './pages/Subscription';
import AdminRevenue from './pages/AdminRevenue';
import ToggleRole from './pages/ToggleRole';
import LearningPaths from './pages/LearningPaths';
import AdminBundles from './pages/AdminBundles';
import AdminLearningPaths from './pages/AdminLearningPaths';
import Catalog from './pages/Catalog';
import PathCertificate from './pages/PathCertificate';
import EmailSettings from './pages/EmailSettings';
import Referrals from './pages/Referrals';
import AdminEmailConfig from './pages/AdminEmailConfig';
import AdminEmailNotifications from './pages/AdminEmailNotifications';
import AdminEmailExport from './pages/AdminEmailExport';
import CohortGroups from './pages/CohortGroups';
import About from './pages/About';
import FAQ from './pages/FAQ';
import SuccessStories from './pages/SuccessStories';
import Resources from './pages/Resources';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import BundleSelection from './pages/BundleSelection';
import Logout from './pages/Logout';
import AffiliateApply from './pages/AffiliateApply';
import AffiliateDashboard from './pages/AffiliateDashboard';
import ChaplaincyTraining from './pages/ChaplaincyTraining';
import Accreditation from './pages/Accreditation';
import FinancialAid from './pages/FinancialAid';
import Credits from './pages/Credits';
import PriorLearning from './pages/PriorLearning';
import { PaymentPlanCheckout } from './pages/PaymentPlanCheckout';
import MyPayments from './pages/MyPayments';
import ChristmasGift from './pages/ChristmasGift';
import GospelStudies from './pages/GospelStudies';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route path="/affiliate/apply" component={AffiliateApply} />
      <Route path="/affiliate/dashboard" component={AffiliateDashboard} />
      <Route path="/chaplaincy-training" component={ChaplaincyTraining} />
      <Route path="/christmas-gift" component={ChristmasGift} />
      <Route path="/register" component={Register} />
      <Route path="/signup" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/enroll" component={Enroll} />
      <Route path="/course/:id" component={CoursePage} />
      <Route path="/lesson/:id" component={LessonPage} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/chat" component={AdminChat} />
      <Route path="/admin/email-export" component={AdminEmailExport} />
      <Route path="/admin/course/:id" component={AdminCourseDetail} />
      <Route path="/admin/lesson/:id" component={AdminEditLesson} />
      <Route path="/admin/bulk-import" component={AdminBulkImport} />
      <Route path="/course/:id/forum" component={CourseForum} />
      <Route path="/forum/topic/:id" component={ForumTopic} />
      <Route path="/admin/email-settings" component={AdminEmailSettings} />
      <Route path="/admin/follow-ups" component={AdminFollowUps} />
          <Route path="/admin/webinars" component={AdminWebinars} />
          <Route path="/admin/analytics" component={AdminAnalytics} />
      <Route path="/admin/revenue" component={AdminRevenue} />
      <Route path="/admin/bundles" component={AdminBundles} />
      <Route path="/admin/learning-paths" component={AdminLearningPaths} />
      <Route path="/admin/email-config" component={AdminEmailConfig} />
      <Route path="/admin/email-notifications" component={AdminEmailNotifications} />
          <Route path="/admin/grading" component={AdminGrading} />
        <Route path="/peer-reviews" component={PeerReviews} />
        <Route path="/calendar" component={AssignmentCalendar} />
      <Route path="/webinars" component={Webinars} />
      <Route path="/certificates" component={MyCertificates} />
      <Route path="/verify/:token" component={VerifyCertificate} />
      <Route path="/path-certificate/:pathId" component={PathCertificate} />
          <Route path="/email-settings" component={EmailSettings} />
          <Route path="/referrals" component={Referrals} />
      <Route path="/progress" component={Progress} />
      <Route path="/learning-paths" component={LearningPaths} />
      <Route path="/cohorts" component={CohortGroups} />
      <Route path="/about" component={About} />
      <Route path="/accreditation" component={Accreditation} />
      <Route path="/credits" component={Credits} />
      <Route path="/prior-learning" component={PriorLearning} />
      <Route path="/financial-aid" component={FinancialAid} />
      <Route path="/faq" component={FAQ} />
      <Route path="/success-stories" component={SuccessStories} />
      <Route path="/resources" component={Resources} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/courses" component={Courses} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/gospel-studies" component={GospelStudies} />
      <Route path="/bundle-select" component={BundleSelection} />
      <Route path="/payment/success" component={PaymentSuccess} />
      <Route path="/payment/cancel" component={PaymentCancel} />
      <Route path="/checkout/payment-plan" component={PaymentPlanCheckout} />
      <Route path="/my-payments" component={MyPayments} />
      <Route path="/upgrade" component={Upgrade} />
      <Route path="/subscription" component={Subscription} />
      <Route path="/toggle-role" component={ToggleRole} />
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
