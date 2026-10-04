export function range(start, count) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(i + start);
  }
  return arr;
}