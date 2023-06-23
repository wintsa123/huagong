import sparkMD5 from 'spark-md5';

// Get the hash based on the file content. The hash remains the same for the same file, regardless of renaming or changing the file name extension.
export const getHash = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
      const spark = new sparkMD5.ArrayBuffer();
      const buffer = e.target.result;
      spark.append(buffer);
      const hash = spark.end();
      const arr = file.name.split('.');
      const ext = arr[arr.length - 1];
      resolve({ hash, ext, buffer });
    };
  });
};

// File slicing
export const splitFile = (file) => {
  const chunkList = [];
  // Use a fixed chunk size of 100 KB
  let max = 100 * 1024;
  let count = Math.ceil(file.size / max);
  let index = 0;
  // Limit the maximum number of chunks to 100
  if (count > 100) {
    max = Math.ceil(file.size / 100);
    count = 100;
  }
  /**
   * 0: 0, max
   * 1: max, 2*max
   * 2: 2*max, 3*max
   */
  while (index < count) {
    chunkList.push({
      chunkName: `${index}`,
      chunk: new File([file.slice(index * max, (index + 1) * max)], file.name),
    });
    index += 1;
  }
  return chunkList;
};
