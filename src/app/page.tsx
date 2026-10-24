import { redirect } from "next/navigation";

/**
 * Root entry for static hosts (GitHub Pages) where `src/proxy.ts` does not run.
 * Always land on the English locale. Locale negotiation is not available here.
 */
export default function RootPage() {
  redirect("/en");
}
