'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Role } from '@/types';

export function useProtectedRoute(requiredRole: Role) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('role');
    
    if (role !== requiredRole) {
      router.replace('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [requiredRole, router]);

  return isAuthorized;
}
