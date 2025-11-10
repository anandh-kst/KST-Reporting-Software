import { useLocation } from "react-router-dom";

export function usePageTitle() {
  const location = useLocation();
  const path = location.pathname.split("/").filter(Boolean).pop() || "dashboard";

  // Convert path like "addEmployee" → "Add Employee"
  const title = path
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/-/g, " ") // Handle kebab-case (if any)
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word

  return title;
}
