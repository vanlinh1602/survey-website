import './App.css';

import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom';

const HomePage = lazy(() => import('./pages/Home'));

const AppLayout = () => (
  <Suspense>
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <Outlet />
      </main>
    </div>
  </Suspense>
);

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
