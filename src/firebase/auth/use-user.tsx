'use client';

import { useMemo } from 'react';
import { useFirebase, useUser as useFirebaseUser } from '../provider';
import type { User as FirebaseUser } from 'firebase/auth';
import { User } from './types';

export interface UserHookResult {
  user: (User & FirebaseUser) | null;
  isUserLoading: boolean;
}

export const useUser = (): UserHookResult => {
  const { user: firebaseUser, isUserLoading } = useFirebaseUser();

  const user = useMemo(() => {
    if (!firebaseUser) {
      return null;
    }
    // Note: You might want to fetch user profile data from Firestore here
    // and merge it with the firebaseUser object.
    return {
      ...firebaseUser,
      // Add any additional properties from your User type definition
      // e.g. xp: 0, level: 1, etc. from a Firestore doc
    } as User & FirebaseUser;
  }, [firebaseUser]);

  return { user, isUserLoading };
};
