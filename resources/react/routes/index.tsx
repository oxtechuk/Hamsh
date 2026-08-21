import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../pages/RootLayout";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";

import AllCarsPageSkeleton from "../components/AllCarsPageSkeleton";
import CarDetailsPageSkeleton from "../components/CarDetailsPageSkeleton";
import ComparePageSkeleton from "../components/ComparePageSkeleton";
import OffersPageSkeleton from "../components/OffersPageSkeleton";
import AboutPageSkeleton from "../components/AboutPageSkeleton";
import BlogsPageSkeleton from "../components/BlogsPageSkeleton";
import BlogDetailsPageSkeleton from "../components/BlogDetailsPageSkeleton";
import ContactPageSkeleton from "../components/ContactPageSkeleton";
import FinanceCalculatorPageSkeleton from "../components/FinanceCalculatorPageSkeleton";
import BrandsPageSkeleton from "../components/BrandsPageSkeleton";
import SpecialOrderPageSkeleton from "../components/SpecialOrderPageSkeleton";
import DrivePageSkeleton from "../components/DrivePageSkeleton";

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
const DrivePage = lazy(() => import("../pages/DrivePage"));

function withSuspense(element: ReactNode, fallback: ReactNode) {
  return <Suspense fallback={fallback}>{element}</Suspense>;
}

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: RootLayout,
      errorElement: <NotFoundPage />,
      children: [
        {
          index: true,
          Component: HomePage,
        },
        {
          path: "/cars",
          element: withSuspense(<AllCarsPage />, <AllCarsPageSkeleton />),
        },
        {
          path: "/cars/:slug",
          element: withSuspense(<CarDetailsPage />, <CarDetailsPageSkeleton />),
        },
        {
          path: "/compare",
          element: withSuspense(<ComparePage />, <ComparePageSkeleton />),
        },
        {
          path: "/offers",
          element: withSuspense(<OffersPage />, <OffersPageSkeleton />),
        },
        {
          path: "/about",
          element: withSuspense(<AboutPage />, <AboutPageSkeleton />),
        },
        {
          path: "/blog",
          element: withSuspense(<BlogsPage />, <BlogsPageSkeleton />),
        },
        {
          path: "/blog/:slug",
          element: withSuspense(<BlogDetailsPage />, <BlogDetailsPageSkeleton />),
        },
        {
          path: "/contact",
          element: withSuspense(<ContactPage />, <ContactPageSkeleton />),
        },
        {
          path: "/finance-calculator",
          element: withSuspense(
            <FinanceCalculatorPage />,
            <FinanceCalculatorPageSkeleton />,
          ),
        },
        {
          path: "/brands",
          element: withSuspense(<BrandsPage />, <BrandsPageSkeleton />),
        },
        {
          path: "/orders/special",
          element: withSuspense(<SpecialOrderPage />, <SpecialOrderPageSkeleton />),
        },
        {
          path: "drive",
          element: withSuspense(<DrivePage />, <DrivePageSkeleton />),
        },
        {
          path: "*",
          Component: NotFoundPage,
        },
      ],
    },
  ],
);
