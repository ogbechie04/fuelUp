export function normalizeLgaName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z]/gi, '') // Remove everything except letters (no spaces, dashes, slashes)
    .trim();
}