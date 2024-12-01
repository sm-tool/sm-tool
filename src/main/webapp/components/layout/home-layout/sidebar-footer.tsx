import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/shadcn/side-bar.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/shadcn/dropdown-menu.tsx';
import { Avatar, AvatarFallback } from '@/components/ui/shadcn/avatar.tsx';
import { BadgeCheck, ChevronsUpDown, LogOut } from 'lucide-react';
import useAuth from '@/lib/auth/hooks/use-auth.ts';
import ThemeSwitcherLong from '@/components/ui/common/buttons/theme-switcher/theme-switcher-long.tsx';
import useAuthDispatch from '@/lib/auth/hooks/use-auth-dispatch.ts';
import { Dialog, DialogTrigger } from '@/components/ui/shadcn/dialog.tsx';
import AccountSettingsModal from '@/components/layout/home-layout/account-settings-modal.tsx';

const IndexedAvatar = ({ text }: { text: string }) => (
  <Avatar className='h-8 w-8 rounded-lg bg-secondary-300'>
    <AvatarFallback className='rounded-lg text-secondary-900'>
      {text.slice(0, 2)}
    </AvatarFallback>
  </Avatar>
);

const UserSidebarFooter = () => {
  const auth = useAuth();
  const { logout } = useAuthDispatch();

  if (!auth.isAuthenticated()) {
    return;
  }

  const { email, given_name, family_name } = auth.getTokenData()!;

  return (
    <Dialog>
      <AccountSettingsModal />
      <SidebarFooter>
        <ThemeSwitcherLong />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent
                    data-[state=open]:text-sidebar-accent-foreground md:h-8 md:p-0'
                >
                  <IndexedAvatar text={given_name} />
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>
                      {family_name}
                    </span>
                    <span className='truncate text-xs'>{email}</span>
                  </div>
                  <ChevronsUpDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                    <IndexedAvatar text={given_name} />
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-semibold'>
                        {family_name}
                      </span>
                      <span className='truncate text-xs'>{email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DialogTrigger asChild>
                    <DropdownMenuItem>
                      <BadgeCheck />
                      Account
                    </DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className='text-red-500'
                  onClick={void logout}
                >
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Dialog>
  );
};

export default UserSidebarFooter;
