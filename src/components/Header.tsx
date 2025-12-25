import Link from 'next/link';
import { AppLogo } from '@/components/AppLogo';
import { getAuthenticatedUser, logout } from '@/lib/auth/actions';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User as UserIcon } from 'lucide-react';

export async function Header() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return null;
  }

  const userInitial = user.name.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <AppLogo className="w-8 h-8"/>
            <span className="font-bold hidden sm:inline-block">Concept Compass</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">{userInitial}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.id}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <form action={logout}>
                  <DropdownMenuItem asChild>
                      <button type="submit" className="w-full">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                      </button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
