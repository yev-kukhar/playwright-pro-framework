export const BASE_URL = process.env.BASE_URL;

console.log('BASE_URL:', process.env.BASE_URL);
console.log('API_BASE_URL:', process.env.API_BASE_URL);

if (!BASE_URL) {
  throw new Error('BASE_URL is not defined. Check your .env file');
}
