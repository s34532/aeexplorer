//@ts-nocheck
export function sortArray(array, sortValue) {
  switch (sortValue) {
    // Most recent first
    case 0:
      array.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    // Most recent last
    case 1:
      array.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    // A-Z (Broken)
    case 2:
      array.sort((a, b) => parseFloat(b.fileSize) - parseFloat(a.fileSize));

      break;
    // Z-A (Broken)
    case 3:
      array.sort((a, b) => b.name.localeCompare(a.name));
      break;
  }
}
