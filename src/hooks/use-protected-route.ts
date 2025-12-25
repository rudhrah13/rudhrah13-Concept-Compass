'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppState, type Role } from './use-app-state';

export function useProtectedRoute(requiredRole: Role) {
  const { role } = useAppState();
  const router = useRouter();

  useEffect(() => {
    if (role !== requiredRole) {
      // This is a client-side safeguard.
      // The primary protection is in the middleware.
      const redirectPath = role === 'student' ? '/student/dashboard' : '/teacher/dashboard';
      router.replace(redirectPath);
    }
  }, [role, requiredRole, router]);
}
