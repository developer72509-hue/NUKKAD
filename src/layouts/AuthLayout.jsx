import { Outlet } from 'react-router-dom';
import Logo from '../components/layout/Logo';

export default function AuthLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-ink-50">
      <div className="container-app flex h-16 items-center">
        <Logo />
      </div>
      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
