import { NavigateFunction } from 'react-router-dom';
import { TAB_PATHS } from '@/constants/paths';

type TabKey = 'home' | 'news' | 'schedule' | 'profile';
export type NavDirection = 'forward' | 'backward' | 'tab';

let _direction: NavDirection = 'tab';
export const getNavigationDirection = (): NavDirection => _direction;

export function navigateForward(
  navigate: NavigateFunction,
  path: string,
  state?: Record<string, unknown>,
): void {
  _direction = 'forward';
  navigate(path, state ? { state } : undefined);
}

export function navigateBack(navigate: NavigateFunction): void {
  _direction = 'backward';
  navigate(-1);
}

export function navigateTab(
  navigate: NavigateFunction,
  currentTab: string,
  targetTab: string,
): void {
  if (currentTab === targetTab) return;

  const path = TAB_PATHS[targetTab];
  if (!path) return;

  _direction = 'tab';
  navigate(path, { replace: true });
}
