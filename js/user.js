import { getPath } from "./utils/path.js";

const getCourseNumber = () => {
  let path = getPath();
  let course = path.match(/\d+/g)[0];
  return course;
};

const fetchGrades = async (course) => {
  let res = await fetch(
    `https://fremontunifiedca.infinitecampus.org/campus/resources/portal/grades/detail/${course}`
  );

  let data = await res.json();
  return data;
};

const getValidTerm = (data) => {
  let details = data.details;

  let valid = [];
  for (const term of details) {
    if (term.categories.length > 0) {
      valid.push(term);
    }
  }
  return valid;
};

const getTerms = async () => {
  // get course number
  const course = getCourseNumber();

  const data = await fetchGrades(course);

  const validTerms = getValidTerm(data);

  return validTerms;
};

export { getCourseNumber, fetchGrades, getValidTerm, getTerms };
