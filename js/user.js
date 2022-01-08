import { getPath } from "./utils.js";

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

const getValidQuarters = (data) => {
  let details = data.details;

  let valid = [];
  for (let quarter of details) {
    if (quarter.categories.length > 0) {
      valid.push(quarter);
    }
  }
  return valid;
};

const getAssignments = async () => {
  // get course number
  const course = getCourseNumber();

  const data = await fetchGrades(course);

  const validQuarters = getValidQuarters(data);

  console.log(validQuarters);
};

// export all functions
export { getCourseNumber, fetchGrades, getValidQuarters, getAssignments };
