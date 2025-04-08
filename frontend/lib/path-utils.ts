import { headers } from "next/headers";

/**
 * Checks if the current path is an admin path
 * @returns boolean indicating if current path is under /admin
 */
export async function isAdminPath(): Promise<boolean> {
  try {
    const headersList = await headers();
    const url = headersList.get("x-url") || "";
    // Use a relative URL parsing approach
    const pathname = url.startsWith('http') 
      ? new URL(url).pathname 
      : url.split('?')[0]; // Handle relative URLs by extracting path before query params
    return pathname.includes("/admin");
  } catch (error) {
    console.error("Error checking admin path:", error);
    return false;
  }
}

/**
 * Gets the current pathname from server headers
 * @returns string representing the current path
 */
export async function getCurrentPath(): Promise<string> {
  try {
    const headersList = await headers();
    const url = headersList.get("x-url") || "";
    // Use a relative URL parsing approach
    return url.startsWith('http') 
      ? new URL(url).pathname 
      : url.split('?')[0]; // Handle relative URLs by extracting path before query params
  } catch (error) {
    console.error("Error getting current path:", error);
    return "";
  }
}