import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

import { useUserStore } from './features/user/hooks';

const AuthorizedRoute = () => {
  const location = useLocation();

  const { isLogin } = useUserStore(
    useShallow((state) => ({
      isLogin: state.information?.uid,
    }))
  );

  if (!isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AuthorizedRoute;
