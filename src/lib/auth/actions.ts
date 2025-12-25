'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { users } from '@/lib/mock-data';
import type { User, UserRole } from '@/types';

const COOKIE_NAME = 'concept-compass-session';

// This function now returns the cookie string to be set by the middleware
export async function login(formData: FormData): Promise<string | undefined> {
  let role = formData.get('role') as UserRole | null;
  let id = formData.get('id') as string | null;

  if (!role || !id) {
    role = 'student';
    id = 'S101';
  }

  const user = users.find((u) => u.role === role && u.id === id);

  if (!user) {
    return undefined;
  }

  const cookieStore = cookies();
  const sessionValue = JSON.stringify(user);
  
  // Set cookie in the server action context
  cookieStore.set(COOKIE_NAME, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
  
  // Return the cookie string so middleware can set it on the response
  return `${COOKIE_NAME}=${encodeURIComponent(sessionValue)}; Path=/; Max-Age=86400; HttpOnly; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
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
