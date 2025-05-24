// Remove the import { headers } from "next/headers";

/**
 * Checks if the current path is an admin path
 * @returns boolean indicating if current path is under /admin
 */
export async function isAdminPath(): Promise<boolean> {
  try {
    // Use window.location in client components
    if (typeof window !== 'undefined') {
      return window.location.pathname.includes('/admin');
    }
    
    // For server components, use a different approach that doesn't rely on headers()
    // This could be based on the context or props passed to the component
    return false;
  } catch (error) {
    console.error("Error checking admin path:", error);
    return false;
  }
}

/**
 * Gets the current pathname from client-side
 * @returns string representing the current path
 */
export async function getCurrentPath(): Promise<string> {
  try {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return "";
  } catch (error) {
    console.error("Error getting current path:", error);
    return "";
  }
}