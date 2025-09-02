import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserPreferences {
  budget: string;
  travelStyle: string;
  interests: string[];
  accommodation: string;
  transportation: string;
}

interface UserContextType {
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  tripData: any;
  setTripData: (data: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: 'medium',
    travelStyle: 'balanced',
    interests: [],
    accommodation: 'hotel',
    transportation: 'flexible'
  });

  const [tripData, setTripData] = useState(null);

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...prefs }));
  };

  return (
    <UserContext.Provider value={{
      preferences,
      updatePreferences,
      tripData,
      setTripData
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};