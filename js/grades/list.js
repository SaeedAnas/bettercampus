import {
  injectAfter,
  injectBefore,
  html,
  searchPathByTag,
  remove,
} from "../utils/dom.js";
import { assignmentForm } from "./assignment.js";
import query from "./query.js";
import user from "./user.js";
import model from "./model.js";
import calculator from "./calculator.js";

const assignmentList = () => {
  const ul = html(`
    <ul role="new-grades" class="assignment-list">
    </ul>
    `);
  return ul;
};

// Checks if grade list is created and if not creates it
const createList = (e) => {
  const header = query.getDividerHeader(e);

  // check if ul exists
  let ul = query.getList(header);

  if (ul) {
    return ul;
  }

  ul = assignmentList();

  injectAfter(ul, header);

  return ul;
};

const handleOnRemove = (e) => {
  const ul = searchPathByTag(e, "ul");

  updateDivider(e);

  // if ul length is 0, then remove the ul
  if (ul.children.length === 0) {
    remove(ul);
  }
};

const appendNewAssignment = async (e) => {
  // const data = await user.load();
  // console.log(data);

  const ul = createList(e);

  const categories = await user.fetchCategories(e);

  const newAssignment = assignmentForm(categories);

  ul.appendChild(newAssignment);
};

const updateDivider = async (e) => {
  const ul = searchPathByTag(e, "ul");

  const data = [];

  for (const li of ul.children) {
    if (li.classList.contains("assignment-item")) {
      const item = model.fromItem(li);
      data.push(item);
    }
  }

  const term = await user.fetchCurrentTerm(e);

  const categories = model.fromTerm(term);

  const categoryMap = calculator.categoryGrade(data, categories);

  updateCategories(e, categoryMap);

  let total = calculator.totalGrade(categoryMap);

  const prevTotal =
    term.task.progressPercent !== undefined ? term.task.progressPercent : 0;

  updateTotal(e, total, prevTotal);
};

const categoryGrade = (categoryData) => {
  const color =
    categoryData.percent > categoryData.prev.percent
      ? "higher-score"
      : "lower-score";

  const wrapper = html(`
    <div role="custom-grade" class="category-wrapper ${color}">
    </div>
    `);

  const ratio = html(`
    <div class="category-ratio"> ${categoryData.points}/${categoryData.total} </div>
    `);

  const percent = html(`
    <div class="category-percent"> (${categoryData.percent}%) </div>
    `);

  wrapper.appendChild(ratio);
  wrapper.appendChild(percent);

  return wrapper;
};

const hasCategoryChanged = (categoryData) => {
  return (
    categoryData.points !== categoryData.prev.points ||
    categoryData.total !== categoryData.prev.total
  );
};

const injectCategoryGrade = (category, categoryMap) => {
  const prevGradeDiv = category.querySelector('[role="custom-grade"]');

  if (prevGradeDiv) {
    remove(prevGradeDiv);
  }

  const buttonData = model.fromCategoryButton(category.children[0]);
  const categoryData = categoryMap[buttonData.name];

  if (!hasCategoryChanged(categoryData)) {
    return;
  }

  const customGradeDiv = categoryGrade(categoryData);

  const gradeDiv = category.getElementsByClassName("totals__row")[0];

  injectAfter(customGradeDiv, gradeDiv);
};

const updateCategories = async (e, categoryMap) => {
  const categoryList = query.getDividerCategories(e);
  for (const category of categoryList) {
    injectCategoryGrade(category, categoryMap);
  }
};

const totalGrade = (total, prevTotal) => {
  const color = total > prevTotal ? "higher-score" : "lower-score";

  const letterGrade = calculator.letterGrade(total);

  const wrapper = html(`
    <div role="custom-total" class="total-wrapper ${color}" >
    </div>
    `);

  const letter = html(`
    <div class="total-letter">
      <b>${letterGrade}</b>
    </div>
    `);

  const percent = html(`
    <div class="total-percent">
      <b> (${total}%) </b>
    </div>
    `);

  wrapper.appendChild(letter);
  wrapper.appendChild(percent);

  return wrapper;
};

const hasTotalChanged = (total, prevTotal) => {
  return total > prevTotal + 0.01 || total < prevTotal - 0.01;
};

const injectTotalGrade = (div, total, prevTotal) => {
  const prevTotalDiv = div.parentElement.querySelector('[role="custom-total"]');

  if (prevTotalDiv) {
    remove(prevTotalDiv);
  }

  if (!hasTotalChanged(total, prevTotal)) {
    return;
  }

  const customTotalDiv = totalGrade(total, prevTotal);

  injectAfter(customTotalDiv, div);
};

const updateTotal = async (e, total, prevTotal) => {
  const header = query.getDividerHeader(e);
  const gradeDiv = header.getElementsByClassName(
    "grades__flex-row__item--right"
  )[0];
  injectTotalGrade(gradeDiv, total, prevTotal);
};

export { appendNewAssignment, handleOnRemove, updateDivider };
