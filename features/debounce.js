function debounce(fn, delayms) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delayms);
  };
}
function asyncDebounce(asyncFn, delayms) {
  let timeout;
  let resolve;
  let reject;
  let result;
  return function (...args) {
    clearTimeout(timeout);
    reject && reject("abort");
    result = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    timeout = setTimeout(async () => {
      resolve(await asyncFn(...args).catch((err) => reject(err)));
    }, delayms);
    return result;
  };
}
export { debounce, asyncDebounce };

// async function a(a) {
//   console.log(a);
//   return () => {
//     console.log("clisure", a);
//   };
// }
// async function b() {
//   const deb = asyncDebounce(a, 1000);
//   deb(1);
//   deb(2);
//   const res = await deb(3);
//   res();
// }
// b();
