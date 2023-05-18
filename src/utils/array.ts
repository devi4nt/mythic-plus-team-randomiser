/** fisher yates shuffle */
export function shuffle(array: unknown[]) {
  let i = array.length;
  while (--i > 0) {
    const temp = Math.floor(Math.random() * (i + 1));
    [array[temp], array[i]] = [array[i], array[temp]];
  }
}
