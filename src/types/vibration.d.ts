// Web Vibration API types
interface Navigator {
  vibrate(pattern: number | number[]): boolean;
}

interface NavigatorVibration {
  vibrate(pattern: number | number[]): boolean;
}

declare let navigator: Navigator & NavigatorVibration;

// Telegram Web App API types
interface TelegramWebApp {
  HapticFeedback: {
    impactOccurred(
      style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
    ): void;
    notificationOccurred(type: 'error' | 'success' | 'warning'): void;
    selectionChanged(): void;
  };
  ready(): void;
  expand(): void;
  close(): void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(leaveActive?: boolean): void;
    hideProgress(): void;
    setText(text: string): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  };
  BackButton: {
    isVisible: boolean;
    show(): void;
    hide(): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  };
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp;
  };
}
