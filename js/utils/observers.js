const onChange = (
  query,
  callback,
  data = {}, // data to pass to callback
  config = { subtree: true, childList: true }
) => {
  let prevQuery = query(data);

  // initial callback
  callback({ queryResult: prevQuery, data: data });

  const observer = new MutationObserver(function () {
    let queryResult = query(data);
    if (queryResult !== prevQuery) {
      prevQuery = queryResult;
      callback({ queryResult: prevQuery, data: data });
    }
  });
  observer.observe(document, config);
};

const onLoaded = (
  query,
  callback,
  data = {}, // data to pass to callback
  config = { subtree: true, childList: true }
) => {
  let initialQuery = query(data);

  if (initialQuery) {
    callback({ queryResult: initialQuery, data: data });
    return;
  }

  const observer = new MutationObserver(function (_mutations, me) {
    let queryResult = query(data);

    if (queryResult) {
      callback({ queryResult: queryResult, data: data });
      me.disconnect();
      return;
    }
  });

  observer.observe(document, config);
};

export { onChange, onLoaded };
