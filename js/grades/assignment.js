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
import { handleOnRemove, updateDivider } from "./list.js";

const addGrade = (e) => {
  toItem(e);
  updateDivider(e);
};

const editGrade = async (e) => {
  await toForm(e);
  updateDivider(e);
};

const onRemove = (e) => {
  const li = searchPathByTag(e, "li");

  // add remove class to hide the item
  li.classList.add("remove");

  // wait for animation to finish
  // then remove the item
  li.addEventListener("transitionend", () => {
    removeLi(e);
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
    <li class="assignment"></li>
    `);

  const form = itemForm(categories, defaultInputs);
  form.action = "";
  form.onsubmit = addGrade;

  li.appendChild(form);

  return li;
};

const span = (id, value) => {
  return html(`
    <span id="${id}" class="span-item">${value}</span>
    `);
};

// Grade item component to display custom grade
const assignmentItem = (formData) => {
  const li = html(`
    <li class="assignment assignment-item"></li>
    `);

  const info = [];

  // iterate over data and create spans
  for (const [key, value] of Object.entries(formData)) {
    info.push(span(key, value));
  }

  const item = wrap(info, ["grade-item"]);

  const submitButton = editButton(editGrade);
  const deleteButton = closeButton(onRemove);

  const buttons = wrap([submitButton, deleteButton], ["assignment-buttons"]);

  const display = wrap([item, buttons], ["assignment-display"]);

  li.appendChild(display);

  return li;
};

export { assignmentForm, assignmentItem, onRemove };
