import { unstable_rethrow } from "next/navigation";

/** Keep public pages readable during service failures without hiding Next.js signals. */
export async function loadPublicContent<T>(fetcher: () => Promise<T[]>) {
  try {
    return { data: await fetcher(), unavailable: false };
  } catch (error) {
    unstable_rethrow(error);
    return { data: [] as T[], unavailable: true };
  }
}
