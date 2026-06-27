const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  key: K[]
) => {
  const result: Partial<T> = {};
  key.forEach((el) => {
    if (el in obj) {
      result[el] = obj[el];
    }
  });
  return result;
};

export default pick;
