import './App.css';

import { ScrollArea } from '@radix-ui/react-scroll-area';
import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';

import { Header } from '@/features/layout/components';

const HomePage = lazy(() => import('./pages/Home'));
const SurveyEditPage = lazy(() => import('./pages/SurveyEdit'));
const SurveyResultPage = lazy(() => import('./pages/SurveyResult'));
const SurveyViewPage = lazy(() => import('./pages/SurveyView'));

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
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<AppLayout />}>
        {import.meta.env.REACT_APP_STAGE === 'development' ? (
          <Route path="/" element={<HomePage />} />
        ) : null}
        <Route path="/:id" element={<Outlet />}>
          <Route path="edit" element={<SurveyEditPage />} />
          <Route path="results" element={<SurveyResultPage />} />
          <Route path="" element={<SurveyViewPage />} />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
