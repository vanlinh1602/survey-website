import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/shallow';

import { Waiting } from '@/components';
import { toast } from '@/components/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStore } from '@/features/user/hooks';
import { translations } from '@/locales/translations';
import { auth } from '@/services/firebase';
import formatError from '@/utils/formatError';

export default function Login() {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const { state } = useLocation();

  const [handling, setHandling] = useState<boolean>();

  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState('email');
  const [info, setInfo] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { userInfo } = useUserStore(
    useShallow((userState) => ({
      userInfo: userState.information,
    }))
  );

  useEffect(() => {
    if (userInfo) {
      navigate(state?.from?.pathname || '/');
    }
  }, [navigate, state?.from?.pathname, userInfo]);

  const handleSubmit = async () => {
    setHandling(true);
    try {
      if (!isLogin) {
        if (info.password !== info.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await createUserWithEmailAndPassword(auth, info.email, info.password);
      } else {
        await signInWithEmailAndPassword(auth, info.email, info.password);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: formatError(error),
      });
    } finally {
      setHandling(false);
    }
  };

  const handleSocialLogin = async () => {
    setHandling(true);
    try {
      const providerInstance = new GoogleAuthProvider();
      await signInWithPopup(auth, providerInstance);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: formatError(error),
      });
    } finally {
      setHandling(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {handling ? <Waiting /> : null}
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {isLogin
              ? t(translations.actions.logIn)
              : t(translations.actions.register)}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? 'Enter your credentials to access your account'
              : 'Create a new account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-start">
          <Tabs
            defaultValue="social"
            className="w-full"
            onValueChange={(value) => setSelectedTab(value)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    onChange={(e) =>
                      setInfo({ ...info, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    onChange={(e) =>
                      setInfo({ ...info, password: e.target.value })
                    }
                  />
                </div>
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      onChange={(e) =>
                        setInfo({ ...info, confirmPassword: e.target.value })
                      }
                    />
                  </div>
                )}
              </form>
              <Button className="w-full mt-5" onClick={handleSubmit}>
                {isLogin ? 'Login' : 'Register'}
              </Button>
            </TabsContent>
            <TabsContent value="social">
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleSocialLogin()}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                    <path fill="none" d="M1 1h22v22H1z" />
                  </svg>
                  Continue with Google
                </Button>
                {/* <Button variant="outline" className="w-full">
                  <Facebook className="w-5 h-5 mr-2" />
                  Continue with Facebook
                </Button> */}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          {selectedTab === 'email' ? (
            <Button
              variant="link"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? // eslint-disable-next-line quotes
                  "Don't have an account? Register"
                : 'Already have an account? Login'}
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
}
