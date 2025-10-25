export function normalizeLgaName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '') // Keep letters and numbers only
    .trim();
}