import { useRoutes } from "react-router-dom";
import { Home } from "src/pages/Home";
import { MainRoutes } from "./mainRoutes";
import { AppRoutes } from "./appRoutes";
export default function ThemeRoutes() {
  const HomeRoute = {
    path: "/",
    element: <Home />,
    children: [...AppRoutes],
  };

  return useRoutes([HomeRoute, ...MainRoutes]);
}
