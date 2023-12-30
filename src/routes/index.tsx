import { useRoutes } from "react-router-dom";
import { Home } from "src/pages/Home";
import { MainRoutes } from "./mainRoutes";
import { AppRoutes } from "./appRoutes";
import { FriendsRoutes } from "./friendsRoutes";

export default function ThemeRoutes() {
  const HomeRoute = {
    path: "/",
    element: <Home />,
    children: [...AppRoutes, ...FriendsRoutes],
  };

  return useRoutes([HomeRoute, ...MainRoutes]);
}
