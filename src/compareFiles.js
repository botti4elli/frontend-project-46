const compareObjects = (obj1, obj2) => {
  const diff = {};

  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

  allKeys.forEach((key) => {
    const value1 = obj1[key];
    const value2 = obj2[key];

    if (value1 !== value2) {
      diff[key] = { file1: value1, file2: value2 };
    }
  });
  return diff;
};
export default compareObjects;
