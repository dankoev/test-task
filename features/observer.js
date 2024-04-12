const sendToListeners = (listeners, oldParams, params) => {
  listeners.forEach((fn) => fn(oldParams, params));
};
const sendToListenersWithRes = (init) => {
  let lastResult = init;
  return (listeners, oldParams, params) => {
    lastResult = listeners.reduce(
      (prevRes, currFn) => currFn(oldParams, params, prevRes),
      lastResult
    );
  };
};

const multyObserver =
  (...inits) =>
  (...listeners) => {
    let params = [...inits];
    return inits.map((_, index) => (newVal) => {
      params[index] = newVal;
      sendToListeners(listeners, params);
    });
  };

const zipedMultyObserver =
  (...inits) =>
  (...listeners) => {
    let params = [...inits];
    return inits.map((_, index) => (newVal) => {
      const oldParams = [...params];
      params[index] = newVal;
      sendToListeners(listeners, oldParams, params);
    });
  };

const zipedMultyWithLastResult =
  (...inits) =>
  (...listeners) => {
    let params = [...inits];
    let send = sendToListenersWithRes(null);
    return inits.map((_, index) => (newVal) => {
      const oldParams = [...params];
      params[index] = newVal;
      send(listeners, oldParams, params);
    });
  };
export { multyObserver, zipedMultyObserver, zipedMultyWithLastResult };
// const [set1, set2, set3] = zipedMultyObserver(
//   1,
//   2,
//   [1, 2]
// )((prev, curr) => console.log("Prev", prev, "Curr", curr));
