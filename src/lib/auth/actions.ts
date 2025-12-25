'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { users } from '@/lib/mock-data';
import type { User, UserRole } from '@/types';

const COOKIE_NAME = 'concept-compass-session';

export async function login(formData: FormData) {
  // Default to student if no specific role/id is passed
  let role = formData.get('role') as UserRole | null;
  let id = formData.get('id') as string | null;

  if (!role || !id) {
    role = 'student';
    id = 'S101';
  }

  const user = users.find((u) => u.role === role && u.id === id);

  if (!user) {
    // This should not happen with the default, but it's good practice
    // to keep the error handling.
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
