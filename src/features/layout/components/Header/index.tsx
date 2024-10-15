import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import logo from '@/assets/logo.png';
import { translations } from '@/locales/translations';

const Header = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();

  const splitPath = location.pathname.split('/');
  if (splitPath.length === 2 && splitPath[1] !== '') {
    return null;
  }

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-full max-h-20 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center py-4">
          <div className="flex justify-start lg:w-0 lg:flex-1 items-center">
            <img src={logo} alt="Logo" className="h-8 w-8 rounded-full mr-2" />
            <div
              className="text-xl font-bold text-gray-900 ml-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              {t(translations.appName)}
            </div>
          </div>
          {/* <img
            src={
              'https://act-upload.hoyoverse.com/event-ugc-hoyowiki/2024/07/24/15884296/d36e559a0a718d050fc2c911fa3d3365_8529512733030822447.png'
            }
            alt="Logo"
            className="h-8 w-8 rounded-full"
          /> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
