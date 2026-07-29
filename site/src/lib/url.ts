/** Join a public-folder path onto the configured base, without double slashes. */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base}/${path}`.replace(/\/{2,}/g, "/");
}
