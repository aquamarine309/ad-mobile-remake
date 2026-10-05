export function range(start, count) {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(i + start);
  }
  return arr;
}

export function repeat(value, count) {
  const arr = [];
  for (let i = 0; i < count;i++) {
    arr.push(value);
  }
  return arr;
}