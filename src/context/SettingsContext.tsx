import React, { createContext, useContext, useEffect, useState } from 'react';

interface ProductivitySettings {
  defaultPriority: 'low' | 'medium' | 'high';
  defaultCategory: string;
  startDayOfWeek: 'monday' | 'sunday';
  pomodoroDuration: number;
  breakDuration: number;
}

interface NotificationSettings {
  taskReminders: boolean;
  dueDateNotifications: boolean;
  habitReminders: boolean;
  achievements: boolean;
  emailNotifications: boolean;
}

interface SettingsContextType {
  productivity: ProductivitySettings;
  setProductivity: (settings: ProductivitySettings) => void;
  notifications: NotificationSettings;
  setNotifications: (settings: NotificationSettings) => void;
}

const defaultProductivity: ProductivitySettings = {
  defaultPriority: 'medium',
  defaultCategory: 'Work',
  startDayOfWeek: 'monday',
  pomodoroDuration: 25,
  breakDuration: 5,
};

const defaultNotifications: NotificationSettings = {
  taskReminders: true,
  dueDateNotifications: true,
  habitReminders: false,
  achievements: true,
  emailNotifications: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [productivity, setProductivityState] = useState<ProductivitySettings>(() => {
    const saved = localStorage.getItem('genz_settings_productivity');
    return saved ? JSON.parse(saved) : defaultProductivity;
  });

  const [notifications, setNotificationsState] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('genz_settings_notifications');
    return saved ? JSON.parse(saved) : defaultNotifications;
  });

  const setProductivity = (settings: ProductivitySettings) => {
    setProductivityState(settings);
    localStorage.setItem('genz_settings_productivity', JSON.stringify(settings));
  };

  const setNotifications = (settings: NotificationSettings) => {
    setNotificationsState(settings);
    localStorage.setItem('genz_settings_notifications', JSON.stringify(settings));
  };

  return (
    <SettingsContext.Provider value={{ productivity, setProductivity, notifications, setNotifications }}>
      {children}
    </SettingsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
