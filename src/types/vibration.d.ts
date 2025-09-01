// Web Vibration API types
interface Navigator {
    vibrate(pattern: number | number[]): boolean;
}

interface NavigatorVibration {
    vibrate(pattern: number | number[]): boolean;
}

declare let navigator: Navigator & NavigatorVibration;
