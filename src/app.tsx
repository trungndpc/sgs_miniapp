import React, { useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App, ZMPRouter, SnackbarProvider, Text, Box, BottomNavigation } from 'zmp-ui';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import HomePage from '@/pages/HomePage';
import NewsPage from '@/pages/NewsPage';
import NewsDetailPage from '@/pages/NewsDetailPage';
import SchedulePage from '@/pages/SchedulePage';
import ProfilePage from '@/pages/ProfilePage';
import RegisterPage from '@/pages/RegisterPage';
import CourseDetailPage from '@/pages/CourseDetailPage';
import MyRegistrationsPage from '@/pages/MyRegistrationsPage';
import {
  HomeNavIcon,
  CategoryNavIcon,
  UserNavIcon,
  ScholarshipNavIcon,
} from '@/components/CustomIcons';
import { navigateTab, getNavigationDirection } from '@/utils/navigation';
import Header from '@/components/Header';
import { PATHS, PATH_TO_TAB } from '@/constants/paths';
import { AuthProvider } from '@/context/AuthContext';

const queryClient = new QueryClient();
const TRANSITION_MS = 300;
const isZaloRuntime =
  Boolean((window as Window & { APP_ID?: string }).APP_ID) ||
  window.location.hostname === 'h5.zdn.vn';

const RuntimeRouter: React.FC<{ children: React.ReactNode }> = ({ children }) =>
  isZaloRuntime ? <ZMPRouter>{children}</ZMPRouter> : <BrowserRouter>{children}</BrowserRouter>;

const AppRoutes: React.FC<{ location: ReturnType<typeof useLocation> }> = ({ location }) => (
  <Routes location={location}>
    <Route path={PATHS.HOME} element={<HomePage />} />
    <Route path={PATHS.NEWS} element={<NewsPage />} />
    <Route path={PATHS.SCHEDULE} element={<SchedulePage />} />
    <Route path={PATHS.PROFILE} element={<ProfilePage />} />
    <Route path="/news/:id" element={<NewsDetailPage />} />
    <Route path="/courses/:id" element={<CourseDetailPage />} />
    <Route path={PATHS.REGISTER} element={<RegisterPage />} />
    <Route path={PATHS.MY_REGISTRATIONS} element={<MyRegistrationsPage />} />
    <Route
      path="*"
      element={
        <Box p={4}>
          <Text>Page Not Found</Text>
        </Box>
      }
    />
  </Routes>
);

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const direction = getNavigationDirection();
  const activeTab = PATH_TO_TAB[location.pathname] || 'home';
  const nodeRefs = useRef<Map<string, React.RefObject<HTMLDivElement>>>(new Map());

  const getNodeRef = (key: string) => {
    let ref = nodeRefs.current.get(key);
    if (!ref) {
      ref = React.createRef<HTMLDivElement>();
      nodeRefs.current.set(key, ref);
    }
    return ref;
  };

  const routeKey = location.pathname;
  const nodeRef = getNodeRef(routeKey);
  const slideClass =
    direction === 'tab' ? 'slide-tab' : direction === 'backward' ? 'slide-backward' : 'slide-forward';

  const handleTabChange = (key: string): void => {
    navigateTab(navigate, activeTab, key);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {PATH_TO_TAB[location.pathname] ? <Header variant="logo" /> : <div />}
      <TransitionGroup className={`page-transition-group min-h-0 flex-1 ${slideClass}`}>
        <CSSTransition
          key={routeKey}
          nodeRef={nodeRef}
          classNames="page"
          timeout={TRANSITION_MS}
          unmountOnExit
          onExited={() => {
            nodeRefs.current.delete(routeKey);
          }}
        >
          <div ref={nodeRef} className="page-shell">
            <AppRoutes location={location} />
          </div>
        </CSSTransition>
      </TransitionGroup>
      {PATH_TO_TAB[location.pathname] ? (
        <BottomNavigation fixed activeKey={activeTab} onChange={handleTabChange}>
          <BottomNavigation.Item
            key="home"
            label="Trang chủ"
            icon={<HomeNavIcon size={24} />}
            activeIcon={<HomeNavIcon active size={24} />}
          />
          <BottomNavigation.Item
            key="news"
            label="Tin tức"
            icon={<CategoryNavIcon size={24} />}
            activeIcon={<CategoryNavIcon active size={24} />}
          />
          <BottomNavigation.Item
            key="schedule"
            label="Lịch"
            icon={<ScholarshipNavIcon size={24} />}
            activeIcon={<ScholarshipNavIcon active size={24} />}
          />
          <BottomNavigation.Item
            key="profile"
            label="Cá nhân"
            icon={<UserNavIcon size={24} />}
            activeIcon={<UserNavIcon active size={24} />}
          />
        </BottomNavigation>
      ) : null}
    </div>
  );
};

const MyApp: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App>
          <SnackbarProvider>
            <RuntimeRouter>
              <AnimatedRoutes />
            </RuntimeRouter>
          </SnackbarProvider>
        </App>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
