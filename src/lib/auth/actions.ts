'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { users } from '@/lib/mock-data';
import type { User, UserRole } from '@/types';

const COOKIE_NAME = 'concept-compass-session';

export async function login(formData: FormData) {
  const role = formData.get('role') as UserRole;
  const id = formData.get('id') as string;

  if (!role || !id) {
    return { success: false, error: 'Role and ID are required.' };
  }

  const user = users.find((u) => u.role === role && u.id === id);

  if (!user) {
    return { success: false, error: 'Invalid credentials for this role.' };
  }

  // Set cookie
  cookies().set(COOKIE_NAME, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });

  return { success: true, user };
}

export async function logout() {
  cookies().delete(COOKIE_NAME);
  redirect('/');
}

export async function getAuthenticatedUser(): Promise<User | null> {
  const cookieStore = cookies();
  const session = cookieStore.get(COOKIE_NAME);

  if (!session?.value) {
    return null;
  }

  try {
    const user = JSON.parse(session.value) as User;
    // Validate that the user from cookie exists in our mock DB
    const validUser = users.find(u => u.id === user.id && u.role === user.role);
    return validUser || null;
  } catch (error) {
    return null;
  }
}
