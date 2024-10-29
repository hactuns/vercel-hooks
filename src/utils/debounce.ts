const debounce = (callback: Function, timeout: number = 0) =>
  new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const result = await callback();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, timeout);
  });

export default debounce;
