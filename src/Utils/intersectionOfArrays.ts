export function intersectionOfArrays<T>(a: T[], b: T[]): T[] {
  const output: T[] = [];
  const inA: Set<string> = new Set(a.map((item: T) => JSON.stringify(item)));
  for (const value of b) {
    if (inA.has(JSON.stringify(value))) {
      output.push(value);
    }
  }
  return output;
}
