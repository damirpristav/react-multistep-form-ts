export const isString = (x: any) => {
  return typeof x === "string" ? x : '';
}

export const guard = (x: any) => {
  if(typeof x === 'string') {
    return x;
  }
}