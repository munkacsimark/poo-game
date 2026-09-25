import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  Navigate,
  type RouterHistory,
} from "@tanstack/react-router";
import { EditProfile } from "../features/profiles/components/EditProfile";
import { NewProfile } from "../features/profiles/components/NewProfile";
import { ProfilePicker } from "../features/profiles/components/ProfilePicker";
import { useProfiles } from "../features/profiles/ProfilesProvider";
import { GameLayout } from "./GameLayout";
import { NotFound } from "./NotFound";
import { RootLayout } from "./RootLayout";

/*
 * Routes (under the /poo-game/ base path):
 *
 *   /                           the game (asks who's playing first on multi-profile devices)
 *   /faq, /changelog, /theme    dialogs over the game
 *   /profiles                   "Who's playing?"
 *   /profiles/new               "Add profile" dialog over the picker
 *   /profiles/manage            "Manage profiles"
 *   /profiles/manage/$profileId "Edit profile" dialog
 */

const rootRoute = createRootRoute({ component: RootLayout, notFoundComponent: NotFound });

const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "game",
  component: GameLayout,
});

const PlayIndex = () => {
  const { picked } = useProfiles();
  return picked ? null : <Navigate to="/profiles" replace />;
};

const playRoute = createRoute({ getParentRoute: () => gameRoute, path: "/", component: PlayIndex });

const faqRoute = createRoute({
  getParentRoute: () => gameRoute,
  path: "faq",
  component: lazyRouteComponent(() => import("../features/faq/FaqDialog"), "FaqDialog"),
});

const changelogRoute = createRoute({
  getParentRoute: () => gameRoute,
  path: "changelog",
  component: lazyRouteComponent(
    () => import("../features/changelog/ChangelogDialog"),
    "ChangelogDialog",
  ),
});

const themeRoute = createRoute({
  getParentRoute: () => gameRoute,
  path: "theme",
  component: lazyRouteComponent(
    () => import("../features/theme/components/ThemeDialog"),
    "ThemeDialog",
  ),
});

const profilesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "profiles",
  component: ProfilePicker,
});

const profilesIndexRoute = createRoute({ getParentRoute: () => profilesRoute, path: "/" });

const newProfileRoute = createRoute({
  getParentRoute: () => profilesRoute,
  path: "new",
  component: NewProfile,
});

const manageRoute = createRoute({ getParentRoute: () => profilesRoute, path: "manage" });

const manageIndexRoute = createRoute({ getParentRoute: () => manageRoute, path: "/" });

const editProfileRoute = createRoute({
  getParentRoute: () => manageRoute,
  path: "$profileId",
  component: function EditProfileRoute() {
    return <EditProfile profileId={editProfileRoute.useParams().profileId} />;
  },
});

const routeTree = rootRoute.addChildren([
  gameRoute.addChildren([playRoute, faqRoute, changelogRoute, themeRoute]),
  profilesRoute.addChildren([
    profilesIndexRoute,
    newProfileRoute,
    manageRoute.addChildren([manageIndexRoute, editProfileRoute]),
  ]),
]);

/** Which top-level screen a path shows; dialog routes belong to the screen behind them. */
const screenOf = (pathname: string) => (/\/profiles(\/|$)/.test(pathname) ? "profiles" : "game");

/** `history` defaults to the browser's; tests pass a memory history. */
export const createAppRouter = (history?: RouterHistory) =>
  createRouter({
    routeTree,
    history,
    basepath: import.meta.env.BASE_URL,
    scrollRestoration: true,
    defaultPreload: "intent",
    // Blur-fade between screens (the game, the profile screens); dialogs animate themselves.
    defaultViewTransition: {
      types: ({ fromLocation, toLocation }) =>
        fromLocation && screenOf(fromLocation.pathname) !== screenOf(toLocation.pathname)
          ? ["screen"]
          : false,
    },
  });

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}
