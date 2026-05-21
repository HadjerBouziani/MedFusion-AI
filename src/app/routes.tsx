import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { AITeamLayout } from "./components/ai-team-layout";
import { Dashboard } from "./pages/dashboard";
import { DiagnosisTool } from "./pages/diagnosis-tool";
import { CaseHistory } from "./pages/case-history";
import { CaseDetail } from "./pages/case-detail";
import { Reports } from "./pages/reports";
import { ModelPerformance } from "./pages/model-performance";
import { Settings } from "./pages/settings";
import { Login } from "./pages/login";
import { Profile } from "./pages/profile";
import { Landing } from "./pages/landing";
import { ClinicalModels } from "./pages/clinical-models";
import { Notifications } from "./pages/notifications";

// AI Team Platform Pages
import { AITeamDashboard } from "./pages/ai-team/dashboard";
import { Training } from "./pages/ai-team/training";
import { DownloadPackage } from "./pages/ai-team/download-package";
import { UploadUpdate } from "./pages/ai-team/upload-update";
import { TrainingReportViewer } from "./pages/ai-team/training-report";
import { FLHistory } from "./pages/ai-team/fl-history";
import { AITeamNotifications } from "./pages/ai-team/notifications";
import { ContributionInsights } from "./pages/ai-team/contribution-insights";
import { ModelVersions } from "./pages/ai-team/model-versions";
import { RoundDetails } from "./pages/ai-team/round-details";
import { AIInsights } from "./pages/ai-team/ai-insights";

export const router = createBrowserRouter([
  {
    path: "/landing",
    Component: Landing,
  },
  {
    path: "/login",
    Component: Login,
  },
  // Doctor Platform
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "diagnosis", Component: DiagnosisTool },
      { path: "models", Component: ClinicalModels },
      { path: "model-insights/:id", Component: ModelPerformance },
      { path: "history", Component: CaseHistory },
      { path: "case/:id", Component: CaseDetail },
      { path: "reports", Component: Reports },
      { path: "notifications", Component: Notifications },
      { path: "settings", Component: Settings },
      { path: "profile", Component: Profile },
    ],
  },
  // AI Team Platform (Completely Separate)
  {
    path: "/ai",
    Component: AITeamLayout,
    children: [
      { index: true, Component: AITeamDashboard },
      { path: "training", Component: Training },
      { path: "download-package/:id", Component: DownloadPackage },
      { path: "upload-update/:id", Component: UploadUpdate },
      { path: "training-report/:id", Component: TrainingReportViewer },
      { path: "history", Component: FLHistory },
      { path: "notifications", Component: AITeamNotifications },
      { path: "contribution-insights", Component: ContributionInsights },
      { path: "model-versions", Component: ModelVersions },
      { path: "round-details/:id", Component: RoundDetails },
      { path: "ai-insights", Component: AIInsights },
      { path: "settings", Component: Settings },
    ],
  },
]);