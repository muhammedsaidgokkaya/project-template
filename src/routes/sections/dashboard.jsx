import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AccountLayout } from 'src/sections/account/account-layout';

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));
const OverviewMetaPage = lazy(() => import('src/pages/dashboard/meta'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
const OverviewSearchConsolePage = lazy(() => import('src/pages/dashboard/search-console'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
const OverviewCoursePage = lazy(() => import('src/pages/dashboard/course'));
//Audience
const OverviewAudiencePage = lazy(() => import('src/pages/dashboard/audience/list'));
const OverviewAudienceNew = lazy(() => import('src/pages/dashboard/audience/new'));
// Product
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
// Report
const SearchConsoleReport = lazy(() => import('src/pages/dashboard/report/searchconsole'));
const SearchConsoleReportNew = lazy(() => import('src/pages/dashboard/report/searchconsole/new'));
const SearchConsoleReportView = lazy(() => import('src/pages/dashboard/report/searchconsole/view'));
const AnalyticsReport = lazy(() => import('src/pages/dashboard/report/analytics'));
const AnalyticsReportNew = lazy(() => import('src/pages/dashboard/report/analytics/new'));
const AnalyticsReportView = lazy(() => import('src/pages/dashboard/report/analytics/view'));
const MetaReport = lazy(() => import('src/pages/dashboard/report/meta'));
const MetaReportNew = lazy(() => import('src/pages/dashboard/report/meta/new'));
const MetaReportView = lazy(() => import('src/pages/dashboard/report/meta/view'));
// Order
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
// Invoice
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
// User
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// Account
const AccountGeneralPage = lazy(() => import('src/pages/dashboard/user/account/general'));
const AccountChangePasswordPage = lazy(
  () => import('src/pages/dashboard/user/account/change-password')
);
// Blog
const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// Job
const JobDetailsPage = lazy(() => import('src/pages/dashboard/job/details'));
const JobListPage = lazy(() => import('src/pages/dashboard/job/list'));
const JobCreatePage = lazy(() => import('src/pages/dashboard/job/new'));
const JobEditPage = lazy(() => import('src/pages/dashboard/job/edit'));
// Kanban
const KanbanDetailsPage = lazy(() => import('src/pages/dashboard/kanbans/details'));
const KanbanListPage = lazy(() => import('src/pages/dashboard/kanbans/list'));
const KanbanCreatePage = lazy(() => import('src/pages/dashboard/kanbans/new'));
const KanbanEditPage = lazy(() => import('src/pages/dashboard/kanbans/edit'));
const KanbanSchemaPage = lazy(() => import('src/pages/dashboard/kanbans/schema'));
// File manager
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// App
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// Test render page by role
const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// Blank page
const ParamsPage = lazy(() => import('src/pages/dashboard/params'));
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

// ----------------------------------------------------------------------

const dashboardLayout = () => (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

const accountLayout = () => (
  <AccountLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </AccountLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: dashboardLayout(),
    children: [
      { index: true, element: <IndexPage /> },
      { path: 'meta', element: <OverviewMetaPage /> },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      { path: 'banking', element: <OverviewBankingPage /> },
      { path: 'booking', element: <OverviewBookingPage /> },
      { path: 'file', element: <OverviewFilePage /> },
      { path: 'search-console', element: <OverviewSearchConsolePage /> },
      { path: 'course', element: <OverviewCoursePage /> },
      {
        path: 'audience',
        children: [
          { index: true, element: <OverviewAudiencePage /> },
          { path: 'list', element: <OverviewAudiencePage /> },
          { path: 'new', element: <OverviewAudienceNew /> },
          { path: ':id/edit', element: <UserEditPage /> },
        ],
      },
      {
        path: 'report',
        children: [
          { index: true, element: <SearchConsoleReport /> },
          {
            path: 'search-console',
            children: [
              { index: true, element: <SearchConsoleReport /> },
              { path: 'new', element: <SearchConsoleReportNew /> },
              { path: ':id/view', element: <SearchConsoleReportView /> },
            ],
          },
          {
            path: 'analytics',
            children: [
              { index: true, element: <AnalyticsReport /> },
              { path: 'new', element: <AnalyticsReportNew /> },
              { path: ':id/view', element: <AnalyticsReportView /> },
            ],
          },
          {
            path: 'meta',
            children: [
              { index: true, element: <MetaReport /> },
              { path: 'new', element: <MetaReportNew /> },
              { path: ':id/view', element: <MetaReportView /> },
            ],
          },
        ],
      },
      {
        path: 'user',
        children: [
          { index: true, element: <UserListPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          {
            path: 'account',
            element: accountLayout(),
            children: [
              { index: true, element: <AccountGeneralPage /> },
              { path: 'change-password', element: <AccountChangePasswordPage /> },
            ],
          },
        ],
      },
      {
        path: 'product',
        children: [
          { index: true, element: <ProductListPage /> },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },
      {
        path: 'order',
        children: [
          { index: true, element: <OrderListPage /> },
          { path: 'list', element: <OrderListPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },
      {
        path: 'invoice',
        children: [
          { index: true, element: <InvoiceListPage /> },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'post',
        children: [
          { index: true, element: <BlogPostsPage /> },
          { path: 'list', element: <BlogPostsPage /> },
          { path: ':title', element: <BlogPostPage /> },
          { path: ':title/edit', element: <BlogEditPostPage /> },
          { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        path: 'job',
        children: [
          { index: true, element: <JobListPage /> },
          { path: 'list', element: <JobListPage /> },
          { path: ':id', element: <JobDetailsPage /> },
          { path: 'new', element: <JobCreatePage /> },
          { path: ':id/edit', element: <JobEditPage /> },
        ],
      },
      { path: 'file-manager', element: <FileManagerPage /> },
      { path: 'mail', element: <MailPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      {
        path: 'kanban',
        children: [
          { index: true, element: <KanbanListPage /> },
          { path: 'list', element: <KanbanListPage /> },
          { path: ':id', element: <KanbanDetailsPage /> },
          { path: 'new', element: <KanbanCreatePage /> },
          { path: 'schema', element: <KanbanSchemaPage /> },
          { path: ':id/edit', element: <KanbanEditPage /> },
        ],
      },
      // { path: 'kanban', element: <KanbanPage /> },
      { path: 'permission', element: <PermissionDeniedPage /> },
      { path: 'params', element: <ParamsPage /> },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
