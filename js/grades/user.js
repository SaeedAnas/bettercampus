import { getCourseNumber } from "../utils/path.js";
import query from "./query.js";

var courseData = null;

const saveState = async (term, state) => {
  let userState = await loadFromStorage();

  if (!userState.state) {
    userState.state = {};
  } else {
    userState = userState.state;
  }

  const personID = term.task.personID;
  const sectionID = term.task.sectionID;
  const termID = term.task.termID;

  let user = userState[personID];
  if (!user) {
    user = {};
    userState[personID] = user;
  }
  let section = user[sectionID];
  if (!section) {
    section = {};
    user[sectionID] = section;
  }
  section[termID] = state;

  writeToStorage(userState);
};

const loadState = async (term) => {
  let userState = await loadFromStorage();

  userState = userState.state;

  if (!userState) {
    return null;
  }

  const personID = term.task.personID;
  const sectionID = term.task.sectionID;
  const termID = term.task.termID;

  let user = userState[personID];
  if (!user) {
    return null;
  }
  let section = user[sectionID];
  if (!section) {
    return null;
  }
  let state = section[termID];
  if (!state) {
    return null;
  }

  return state;
};

const writeToStorage = async (userState) => {
  await chrome.storage.sync.set({ state: userState });
};

const loadFromStorage = async () => {
  let state = chrome.storage.sync.get("state");
  return state;
};

const clearStorage = async () => {
  await chrome.storage.sync.clear();
};

const load = async () => {
  if (courseData) {
    return courseData;
  }

  courseData = await fetchGrades();

  return courseData;
};

const update = async () => {
  courseData = await fetchGrades();
};

const clear = () => {
  courseData = null;
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

const fetchCurrentTermFromCard = async (card) => {
  const name = query.getHeaderInfoFromCard(card);
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

const fetchCategoriesFromCard = async (card) => {
  const categories = [];
  const term = await fetchCurrentTermFromCard(card);

  for (const category of term.categories) {
    categories.push(category.name);
  }

  return categories;
};

export default {
  load,
  update,
  clear,
  fetchCategories,
  fetchCategoriesFromCard,
  fetchCurrentTerm,
  fetchCurrentTermFromCard,
  saveState,
  loadState,
  clearStorage,
};
