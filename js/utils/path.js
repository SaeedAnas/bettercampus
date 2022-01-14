const getCourseNumber = () => {
  let path = getPath();
  let course = path.match(/\d+/g)[0];
  return course;
};

// Checks if the url path is a grade path
const isGradePath = (path) => {
  const re = /classroom\/\d+\/grades/;

  if (path.match(re)) {
    return true;
  }
  return false;
};

// Checks if url path is today path
const isTodayPath = (path) => {
  const re = /apps\/portal\/student\/today/;

  if (path.match(re)) {
    return true;
  }
  return false;
};

// Gets the path of the current page
const getPath = () => {
  let url = document.URL;
  let path = new URL(url).pathname;
  return path;
};

// Gets the page of the current url
const getPage = () => {
  let path = getPath();
  if (isGradePath(path)) {
    return "grades";
  } else if (isTodayPath(path)) {
    return "today";
  }
  return "";
};

export { getPath, isGradePath, getPage, getCourseNumber };
