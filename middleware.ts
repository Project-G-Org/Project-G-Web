// Without a defined Matcher, applies next auth to the entire project
export { default } from 'next-auth/middleware'

// Applies next-auth only to specific pages
export const config = { matcher: ['/client/explore'] }
