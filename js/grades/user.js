import { getCourseNumber } from "../utils/path.js";
import query from "./query.js";

var userData = null;

const load = async () => {
  if (userData) {
    return userData;
  }

  userData = await fetchGrades();

  return userData;
};

const update = async () => {
  userData = await fetchGrades();
};

const clear = () => {
  userData = null;
};

const fetchGrades = async () => {
  const course = getCourseNumber();

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

const fetchTerms = async () => {
  const data = await load();

  const validTerms = getValidTerm(data);

  return validTerms;
};

const fetchCurrentTerm = async (e) => {
  const name = query.getHeaderInfo(e);
  const terms = await fetchTerms();

  for (const term of terms) {
    if (
      (term.task.termName === name.termName) &
      (term.task.taskName === name.taskName)
    ) {
      return term;
    }
  }

  return null;
};

const fetchCategories = async (e) => {
  const categories = [];
  const term = await fetchCurrentTerm(e);

  for (const category of term.categories) {
    categories.push(category.name);
  }

  return categories;
};

export default { load, update, clear, fetchCategories, fetchCurrentTerm };
