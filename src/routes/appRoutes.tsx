import { CountryPage } from "src/pages/CountryPage";
import { ExplorePage } from "src/pages/ExplorePage";
import { MapPage } from "src/pages/MapPage";
import { StatisticPage } from "src/pages/StatisticPage";
import { TimelinePage } from "src/pages/TimelinePage";
import { ProtectedRoute } from "./ProtectedRoute";
import { ParameterPage } from "src/pages/ParameterPage";
import { MenuPage } from "src/pages/MenuPage";
import { NoLoginPage } from "src/pages/NoLoginPage";
import { FriendPage } from "src/pages/FriendPage";
import { ComparePage } from "src/pages/ComparePage";
import { LanguagePage } from "src/pages/LanguagePage";
import { OriginCountryPage } from "src/pages/OriginCountryPage";
import { ReportPage } from "src/pages/ReportPage";

export const AppRoutes = [
  {
    path: "/",
    element: <NoLoginPage />,
  },
  {
    path: "/map",
    element: (
      <ProtectedRoute>
        <MapPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/explore",
    element: (
      <ProtectedRoute>
        <ExplorePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/timeline",
    element: (
      <ProtectedRoute>
        <TimelinePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/statistics",
    element: (
      <ProtectedRoute>
        <StatisticPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/country/:id",
    element: <CountryPage />,
  },
  {
    path: "/setting",
    element: (
      <ProtectedRoute>
        <ParameterPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/menu",
    element: (
      <ProtectedRoute>
        <MenuPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/friends",
    element: (
      <ProtectedRoute>
        <FriendPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/compare",
    element: (
      <ProtectedRoute>
        <ComparePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/language",
    element: (
      <ProtectedRoute>
        <LanguagePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/origincountry",
    element: (
      <ProtectedRoute>
        <OriginCountryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/report",
    element: (
      <ProtectedRoute>
        <ReportPage />
      </ProtectedRoute>
    ),
  },
];
