import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { getDynamicBasePath } from "../utils/base-path";

import RootLayout from "../pages/RootLayout";
import PageSkeleton from "../components/skeletons/PageSkeleton";

const HomePage = lazy(() => import("../pages/HomePage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const AllCarsPage = lazy(() => import("../pages/AllCarsPage"));
const CarDetailsPage = lazy(() => import("../pages/CarDetailsPage"));
const ComparePage = lazy(() => import("../pages/ComparePage"));
const OffersPage = lazy(() => import("../pages/OffersPage"));
const AboutPage = lazy(() => import("../pages/AboutPage"));
const BlogsPage = lazy(() => import("../pages/BlogsPage"));
const BlogDetailsPage = lazy(() => import("../pages/BlogDetailsPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const FinanceCalculatorPage = lazy(() => import("../pages/FinanceCalculatorPage"));
const BrandsPage = lazy(() => import("../pages/BrandsPage"));
const SpecialOrderPage = lazy(() => import("../pages/SpecialOrderPage"));
const OrdinaryOrderPage = lazy(() => import("../pages/OrdinaryOrderPage"));

const withSuspense = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<PageSkeleton />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        { path: "/", element: withSuspense(HomePage) },
        { path: "/cars/:slug", element: withSuspense(CarDetailsPage) },
        { path: "/cars", element: withSuspense(AllCarsPage) },
        { path: "/compare", element: withSuspense(ComparePage) },
        { path: "/offers", element: withSuspense(OffersPage) },
        { path: "/about", element: withSuspense(AboutPage) },
        { path: "/blog", element: withSuspense(BlogsPage) },
        { path: "/blog/:slug", element: withSuspense(BlogDetailsPage) },
        { path: "/contact", element: withSuspense(ContactPage) },
        { path: "/finance-calculator", element: withSuspense(FinanceCalculatorPage) },
        { path: "/brands", element: withSuspense(BrandsPage) },
        { path: "/orders/special", element: withSuspense(SpecialOrderPage) },
        { path: "/orders/ordinary", element: withSuspense(OrdinaryOrderPage) },
        { path: "*", element: withSuspense(NotFoundPage) },
      ],
    },
  ],
  {
    basename: getDynamicBasePath(),
  },
);
