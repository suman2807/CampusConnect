import { ClerkProvider } from '@clerk/clerk-react';

// Get Clerk publishable key from environment variables
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

// Clerk configuration
export const clerkConfig = {
  publishableKey: CLERK_PUBLISHABLE_KEY,
  appearance: {
    baseTheme: 'light',
    variables: {
      colorPrimary: '#28430d',
      colorTextOnPrimaryBackground: '#ffffff',
    },
    elements: {
      formButtonPrimary: {
        backgroundColor: '#28430d',
        '&:hover': {
          backgroundColor: '#1f3308',
        },
      },
    },
  },
  // Only allow university emails
  signUp: {
    emailAddressVerificationStrategy: 'email_code',
    emailAddressRequired: true,
  },
};

// Helper function to check if email is valid university email
export const isUniversityEmail = (email) => {
  return email && email.endsWith('@srmap.edu.in');
};

export { ClerkProvider, CLERK_PUBLISHABLE_KEY };