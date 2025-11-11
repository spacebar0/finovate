'use client';

import * as React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, updateDocumentNonBlocking, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { User } from '@/firebase/auth/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Upload, Trash2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const formSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters.'),
});

type EditProfileFormValues = z.infer<typeof formSchema>;

interface EditProfileDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: User;
}

const getInitials = (name?: string | null) => {
  if (!name) return '';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export function EditProfileDialog({
  isOpen,
  setIsOpen,
  user,
}: EditProfileDialogProps) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user: authUser } = useUser();
  
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: user.displayName || '',
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({ displayName: user.displayName || '' });
      const currentAvatarData = PlaceHolderImages.find((img) => img.id === user.avatarUrl);
      const currentAvatarUrl = currentAvatarData ? currentAvatarData.imageUrl : user.avatarUrl;
      setAvatarPreview(currentAvatarUrl || null);
    }
  }, [user, form, isOpen]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePicture = () => {
    if (!authUser) return;
    const userDocRef = doc(firestore, 'users', authUser.uid);

    updateDocumentNonBlocking(userDocRef, { avatarUrl: '' });
    setAvatarPreview(null);
    setIsOpen(false);
    toast({
      title: 'Profile Picture Removed',
      description: 'Your avatar has been reset to your initials.',
    });
  }

  const onSubmit = (values: EditProfileFormValues) => {
    if (!authUser) return;
    const userDocRef = doc(firestore, 'users', authUser.uid);

    const updates: Partial<User> = {
      displayName: values.displayName,
    };
    
    // Only include avatarUrl in the update if it has been changed to a new data URL
    if (avatarPreview && avatarPreview.startsWith('data:image')) {
        updates.avatarUrl = avatarPreview;
    }

    updateDocumentNonBlocking(userDocRef, updates);

    setIsOpen(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been successfully updated.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-card/80 backdrop-blur-lg border-border">
        <DialogHeader>
          <DialogTitle className="font-headline">Edit Profile</DialogTitle>
          <DialogDescription>
            Update your display name and profile picture.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
            <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-primary/50 cursor-pointer" onClick={handleAvatarClick}>
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt={user.displayName || 'User Avatar'} />
                    ) : null}
                    <AvatarFallback className="text-4xl font-bold">
                        {getInitials(form.getValues('displayName'))}
                    </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleAvatarClick}>
                    <Upload className="h-8 w-8 text-white" />
                </div>
                <Input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/png, image/jpeg, image/gif"
                    onChange={handleFileChange}
                />
            </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className='gap-2 sm:justify-between'>
              <Button type="button" variant="destructive" onClick={handleRemovePicture}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Picture
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
