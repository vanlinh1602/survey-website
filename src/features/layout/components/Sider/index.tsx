import { FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import logo from '@/assets/logo.png';
import { translations } from '@/locales/translations';

const Sidebar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex p-4 text-xl font-bold text-gray-800 dark:text-white items-center">
        <img src={logo} alt="Logo" className="h-8 w-8 rounded-full mr-2" />
        {t(translations.appName)}
      </div>
      <nav>
        <a
          className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => navigate('/')}
        >
          <FileText className="h-5 w-5 mr-3" />
          Surveys
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
