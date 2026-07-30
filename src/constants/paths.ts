export const PATHS = {
  HOME: '/',
  NEWS: '/news',
  SCHEDULE: '/schedule',
  PROFILE: '/profile',
  NEWS_DETAIL: '/news/:id',
  COURSE_DETAIL: '/courses/:id',
  REGISTER: '/register',
  MY_REGISTRATIONS: '/my-registrations',
} as const;

export const TAB_PATHS: Record<string, string> = {
  home: PATHS.HOME,
  news: PATHS.NEWS,
  schedule: PATHS.SCHEDULE,
  profile: PATHS.PROFILE,
};

export const PATH_TO_TAB: Record<string, string> = {
  [PATHS.HOME]: 'home',
  [PATHS.NEWS]: 'news',
  [PATHS.SCHEDULE]: 'schedule',
  [PATHS.PROFILE]: 'profile',
};
