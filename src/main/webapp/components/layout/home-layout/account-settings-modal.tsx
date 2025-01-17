import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog.tsx';
import useAuthDispatch from '@/lib/auth/hooks/use-auth-dispatch.ts';
import useAuth from '@/lib/auth/hooks/use-auth.ts';
import { Label } from '@/components/ui/shadcn/label.tsx';
import { Input } from '@/components/ui/shadcn/input.tsx';
import Separator from '@/components/ui/shadcn/separator.tsx';
import { Button } from '@/components/ui/shadcn/button.tsx';
import { KeyRound, Settings, Trash2 } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const AccountSettingsModal = () => {
  const authDispatch = useAuthDispatch();
  const { email, given_name, family_name, roles } = useAuth().getTokenData()!;

  return (
    <DialogContent className='sm:max-w-[425px]'>
      <VisuallyHidden>
        <DialogTitle></DialogTitle>
        <DialogDescription></DialogDescription>
      </VisuallyHidden>
      <DialogHeader>
        <DialogTitle>Account Settings</DialogTitle>
        <DialogDescription>
          Manage your account settings and preferences
        </DialogDescription>
      </DialogHeader>

      <div className='grid gap-4 py-4'>
        <div className='grid gap-2'>
          <Label htmlFor='given_name'>First Name</Label>
          <Input
            id='given_name'
            value={given_name}
            disabled
            className='w-full'
          />
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='family_name'>Last Name</Label>
          <Input
            id='family_name'
            value={family_name}
            disabled
            className='w-full'
          />
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='email'>Email</Label>
          <Input id='email' value={email} disabled className='w-full' />
        </div>

        <div className='grid gap-2'>
          <Label htmlFor='roles'>Roles</Label>
          <Input
            id='roles'
            value={roles.join(', ')}
            disabled
            className='w-full'
          />
        </div>
      </div>

      <Separator />

      <div className='flex flex-col gap-3 mt-4'>
        <Button
          variant='default'
          onClick={() => void authDispatch.updateProfile()}
        >
          <Settings className='mr-2 h-4 w-4' />
          Update Profile
        </Button>

        <Button
          variant='outline'
          onClick={() => void authDispatch.updatePassword()}
        >
          <KeyRound className='mr-2 h-4 w-4' />
          Change Password
        </Button>

        <Button
          variant='destructive'
          onClick={() => void authDispatch.deleteAccount()}
        >
          <Trash2 className='mr-2 h-4 w-4' />
          Delete Account
        </Button>
      </div>
    </DialogContent>
  );
};

export default AccountSettingsModal;
