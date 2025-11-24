import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api/axiosConfig';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const identifier = email.trim();
    const plainPassword = password.trim();

    if (!identifier || !plainPassword) {
      setErrorMessage('Введите логин (email или username) и пароль.');
      return;
    }

    try {
      const isEmail = identifier.includes('@');

      const { data } = await api.post(
        isEmail ? '/Auth/Login' : '/Auth/LoginByUsername',
        isEmail
          ? { email: identifier, password: plainPassword }
          : { username: identifier, password: plainPassword }
      );

      const payload: any = (data && (data as any).data) || data || {};

      const accessToken =
        payload.accessToken ||
        payload.token ||
        payload.jwtToken ||
        payload.access_token;
      const refreshToken = payload.refreshToken || payload.refresh_token;

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('token', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Текущее поведение авторизации
      localStorage.setItem('isLoggedIn', 'true');
      // Dispatch event so Navbar updates immediately
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    } catch (error: any) {
      console.error(error);
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;

      setErrorMessage(
        backendMessage ||
          'Ошибка при входе. Проверьте введённые данные и попробуйте ещё раз.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-brand-600 hover:text-brand-500">
              Sign up
            </Link>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email or Username
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-brand-600 hover:text-brand-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Button type="submit" fullWidth size="lg">
              Log in
            </Button>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600 text-center">{errorMessage}</p>
          )}
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Google
            </button>
            <button className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};