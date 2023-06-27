const mapping: Record<string, string> = {
  'business-ideas': 'business_idea',
  skills: 'skill',
  startups: 'startup',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
