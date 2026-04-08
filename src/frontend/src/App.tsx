import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { DashboardSkeleton } from "./components/LoadingSkeleton";

// Lazy-loaded pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Yield = lazy(() => import("./pages/Yield"));
const Goal = lazy(() => import("./pages/Goal"));
const Simulator = lazy(() => import("./pages/Simulator"));
const Innstillinger = lazy(() => import("./pages/Innstillinger"));

function PageLoader() {
  return <DashboardSkeleton />;
}

// Root route wraps everything in Layout
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
  component: () => null,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
});

const portfolioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/portfolio",
  component: Portfolio,
});

const yieldRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/yield",
  component: Yield,
});

const goalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/goal",
  component: Goal,
});

const simulatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/simulator",
  component: Simulator,
});

const innstillingerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/innstillinger",
  component: Innstillinger,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  portfolioRoute,
  yieldRoute,
  goalRoute,
  simulatorRoute,
  innstillingerRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
