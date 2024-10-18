import { LayoutDashboard, LogOut, User } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

import logo from '@/assets/logo.png';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/features/user/hooks';
import { translations } from '@/locales/translations';

const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();

  const splitPath = location.pathname.split('/');

  const { userInfo, signOut } = useUserStore(
    useShallow((userState) => ({
      userInfo: userState.information,
      signOut: userState.logout,
    }))
  );

  const activeKey = useMemo(() => {
    const path = location.pathname;
    const key = path.split('/')[1];
    return key || 'home';
  }, [location.pathname]);

  if (
    (activeKey === 'survey' && splitPath.length === 3) ||
    activeKey === 'login'
  ) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-full max-h-20 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center py-4">
          <div
            className="flex justify-start  items-center cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src={logo} alt="Logo" className="h-8 w-8 rounded-full mr-2" />
            <div className="text-xl font-bold text-gray-900 ml-2 hidden md:block">
              {t(translations.appName)}
            </div>
          </div>

          <nav className="flex space-x-10 items-center justify-center">
            <div
              id="home-header"
              onClick={() => navigate('/')}
              className="text-base font-medium text-gray-500 hover:text-gray-900 cursor-pointer"
            >
              <div
                className={`flex items-center ${
                  activeKey === 'home' ? 'text-gray-900' : 'text-gray-500'
                } hover:text-gray-900`}
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                <div className="hidden md:block">
                  {t(translations.pages.home)}
                </div>
              </div>
            </div>
            <div
              id="match-header"
              onClick={() => navigate('/users')}
              className="text-base font-medium text-gray-500 hover:text-gray-900 cursor-pointer"
            >
              <div
                className={`flex items-center ${
                  activeKey === 'users' ? 'text-gray-900' : 'text-gray-500'
                } hover:text-gray-900`}
              >
                <User className="inline-block mr-2 h-5 w-5" />
                <div className="hidden md:block">
                  {t(translations.pages.user)}
                </div>
              </div>
            </div>
          </nav>

          <div className="flex justify-end items-center">
            {userInfo?.avatar && (
              <img
                src={userInfo.avatar}
                alt="Logo"
                className="h-8 w-8 rounded-full mr-2"
              />
            )}
            <div className="mr-2 hidden md:block">{userInfo?.displayName}</div>
            <Button
              id="login-button"
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => signOut()}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
