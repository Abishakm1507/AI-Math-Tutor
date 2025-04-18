
import { createContext, useContext, ReactNode, useCallback } from 'react';
import { useUserProfile, UserProfile } from '@/hooks/use-user-profile';

interface ProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{
    data: UserProfile | null;
    error: any;
  }>;
  refetchProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { profile, loading, updateProfile: baseUpdateProfile, fetchProfile } = useUserProfile();

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    return await baseUpdateProfile(updates);
  }, [baseUpdateProfile]);

  const refetchProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  return (
    <ProfileContext.Provider value={{ profile, loading, updateProfile, refetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
