import './App.css';

import { ScrollArea } from '@radix-ui/react-scroll-area';
import { onAuthStateChanged } from 'firebase/auth';
import { lazy, Suspense, useEffect } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

import { Header } from '@/features/layout/components';

import AuthorizedRoute from './AuthorizedRoute';
import { Waiting } from './components';
import { useUserStore } from './features/user/hooks';
import { auth } from './services/firebase';

const HomePage = lazy(() => import('./pages/Home'));
const SurveyEditPage = lazy(() => import('./pages/SurveyEdit'));
const SurveyResultPage = lazy(() => import('./pages/SurveyResult'));
const SurveyViewPage = lazy(() => import('./pages/SurveyView'));
const LoginPage = lazy(() => import('./pages/Login'));

const AppLayout = () => (
  <Suspense>
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
        <ScrollArea>
          <Outlet />
        </ScrollArea>
      </div>
    </div>
  </Suspense>
);

function App() {
  const { login, userHandling } = useUserStore(
    useShallow((state) => ({
      userEmail: state.information?.email,
      userHandling: state.handling,
      login: state.login,
    }))
  );

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        login();
      }
    });
  }, [login]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<AppLayout />}>
        <Route path="/" element={<AuthorizedRoute />}>
          <Route path="" element={<HomePage />} />
        </Route>
        <Route path="/:id" element={<Outlet />}>
          <Route path="edit" element={<AuthorizedRoute />}>
            <Route path="" element={<SurveyEditPage />} />
          </Route>
          <Route path="results" element={<AuthorizedRoute />}>
            <Route path="" element={<SurveyResultPage />} />
          </Route>
          <Route path="" element={<SurveyViewPage />} />
        </Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Route>
    )
  );

  return (
    <>
      {userHandling ? <Waiting /> : null}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
