const mergeArrays = <T>(oldA: T[], newA: T[], compareFunc: (oldItem: T, newItem: T) => boolean): T[] => {
  const merged = [...oldA];
  newA.forEach(newItem => {
    const originalIndex = merged.findIndex(oldItem => compareFunc(oldItem, newItem));
    if (originalIndex > -1) {
      merged[originalIndex] = newItem;
    } else {
      merged.push(newItem);
    }
  });
  return merged;
};

export default mergeArrays;
