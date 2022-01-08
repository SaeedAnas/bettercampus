const isGradePath = (path) => {
  const re = /classroom\/\d+\/grades/;

  if (path.match(re)) {
    return true;
  }
  return false;
};

const getPath = () => {
  let url = document.URL;
  let path = new URL(url).pathname;
  return path;
};

const getPage = () => {
  let path = getPath();
  if (isGradePath(path)) {
    return "grades";
  }

  return "";
};

// export all functions
export { getPath, isGradePath, getPage };
