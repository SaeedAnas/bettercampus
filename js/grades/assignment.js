import {
  removeLi,
  replaceLi,
  wrap,
  html,
  searchPathByTag,
} from "../utils/dom.js";
import { editButton, closeButton } from "./buttons.js";
import { itemForm } from "./input.js";
import user from "./user.js";
import model from "./model.js";
import { handleOnRemove, handleUpdate } from "./list.js";
import calculator from "./calculator.js";

const addGrade = async (e) => {
  toItem(e);
  await handleUpdate(e);
};

const editGrade = async (e) => {
  await toForm(e);
  await handleUpdate(e);
};

const onRemove = async (e) => {
  const li = searchPathByTag(e, "li");

  // add remove class to hide the item
  li.classList.add("remove");

  // wait for animation to finish
  // then remove the item
  li.addEventListener("transitionend", async () => {
    removeLi(e);
    await handleUpdate(e);
    handleOnRemove(e);
  });
};

// Convert form data to item
const toItem = (e) => {
  const form = e.target;
  const data = model.fromForm(form);

  const assignment = assignmentItem(data);

  replaceLi(e, assignment);
};

// Convert item to form
const toForm = async (e) => {
  const item = searchPathByTag(e, "li");

  const data = model.fromItem(item);

  const categories = await user.fetchCategories(e);

  const assignment = assignmentForm(categories, data);

  replaceLi(e, assignment);
};

// Grade item component to input custom grade
const assignmentForm = (categories, defaultInputs = {}) => {
  const li = html(`
    <li class="assignment assignment-form-wrapper"></li>
    `);

  const form = itemForm(categories, defaultInputs);
  form.action = "";
  form.onsubmit = addGrade;

  li.appendChild(form);

  return li;
};

const gripLinesIcon = () => {
  return html(`
    <div class="assignment-icon">
      <span class="fa-stack">
        <i class="divider__icon fa fa-light fa-grip-lines"></i>
      </span>
    </div>
    `);
};

const assignmentInfo = (name, category, weight) => {
  const info = [];

  const nameDiv = html(`
    <div class="assignment-name">
        <span id="name" class="span-item">${name}</span>
    </div>
    `);
  info.push(nameDiv);

  let categoryDiv;

  if (category.name) {
    categoryDiv = html(`
    <div class="assignment-category divider-line">
        <span id="category" class="span-item">${category.name}</span>: 
        <span id="category_weight" class="span-item">${category.weight}</span>
    </div>
    `);
  } else {
    categoryDiv = html(`
    <div class="assignment-category divider-line">
        <span id="category" class="span-item">${category}</span>
    </div>
    `);
  }

  info.push(categoryDiv);

  if (weight != 1) {
    const weightDiv = html(`
      <div class="assignment-weight divider-line">
          Multiplier: <span id="multiplier" class="span-item">${weight}</span>
      </div>
    `);
    info.push(weightDiv);
  }

  const gripLines = gripLinesIcon();

  const infoDiv = wrap(info, ["assignment-info"]);

  const leftDiv = wrap([gripLines, infoDiv], ["assignment-left"]);

  return leftDiv;
};

const assignmentGrade = (points, total, percent) => {
  const ratioDiv = html(`
    <div class="assignment-ratio">
      <span id="points" class="span-item">${points}</span>/<span id="total" class="span-item">${total}</span>
    </div>
    `);

  const percentDiv = html(`
    <div class="assignment-percent divider-line">
      (<span id="percent" class="span-item">${percent}</span>%)
    </div>
    `);

  const gradeDiv = wrap([ratioDiv, percentDiv], ["assignment-grade"]);

  const submitButton = editButton(editGrade);
  const deleteButton = closeButton(onRemove);

  const buttons = wrap([submitButton, deleteButton], ["assignment-buttons"]);

  const rightDiv = wrap([gradeDiv, buttons], ["assignment-right"]);

  return rightDiv;
};

// Grade item component to display custom grade
const assignmentItem = (formData) => {
  const li = html(`
    <li class="assignment assignment-item"></li>
    `);

  const leftDiv = assignmentInfo(
    formData.name,
    formData.category,
    formData.multiplier
  );

  const percent = calculator.calcPercent(formData.points, formData.total);

  const rightDiv = assignmentGrade(formData.points, formData.total, percent);

  const display = wrap([leftDiv, rightDiv], ["assignment-display"]);

  li.appendChild(display);

  return li;
};

export { assignmentForm, assignmentItem, onRemove };
