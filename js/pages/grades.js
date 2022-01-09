import {
  searchPathByClass,
  searchPathByTag,
  wrap,
  injectAfter,
  html,
} from "../utils/dom.js";
import { getTerms } from "../user.js";
import { onChange, onLoaded } from "../utils/observers.js";

// Components
const buttonClass = "add-button";

const addGrade = async (e) => {
  await appendNewAssignment(e);
};

const gradeAddButton = () => {
  const button = html(`
    <button class="${buttonClass} grade-button">
      <i class="divider__icon fa fa-plus header-icon"></i>
    </button>
    `);

  button.onclick = addGrade;

  return button;
};

const listClass = "assignment-list";

const assignmentList = () => {
  const ul = html(`
    <ul role="new-grades" class="${listClass}">
    </ul>
    `);
  return ul;
};

const onRemove = (e) => {
  removeLi(e);
};

const addAssignmentButton = () => {
  const button = html(`
    <button class="add-button grade-button">
      <i class="divider__icon fa fa-plus fa-light grade-icon"></i>
    </button>
    `);

  return button;
};

const removeAssignmentButton = () => {
  const button = html(`
    <button type="button" class="remove-button grade-button">
      <i class="divider__icon fa fa-minus fa-light grade-icon"></i>
    </button>
    `);

  return button;
};

const resizeableTextInput = (label, placeholder, required = false) => {
  let req = required ? "required" : "";
  const input = html(`
  <label class="input-sizer">
    <span>${label}: </span>
    <input ${req} type="text" id=${label} name=${label} size="${placeholder.length}" placeholder="${placeholder}">
  </label>
    `);

  const onInput = (e) => {
    const element = e.target;
    element.parentNode.dataset.value = element.value;
  };

  input.oninput = onInput;

  return input;
};

const resizeableNumberInput = (label, placeholder, required = false) => {
  let req = required ? "required" : "";

  const input = html(`
  <label class="input-sizer">
    <span>${label}: </span>
    <input ${req} type="text" id="number-input" name=${label} size="${placeholder.length}" placeholder="${placeholder}">
  </label>
    `);

  // makes sure input is a valid number
  const onInput = (e) => {
    const element = e.target;

    // empty or number followed by . followed by number
    const regex = /^((\d+)(\.)?)?(\d+)?$/;

    let value = element.value;

    if (regex.test(value)) {
      element.parentNode.dataset.value = value;
    } else {
      value = element.parentNode.dataset.value
        ? element.parentNode.dataset.value
        : "";
      element.value = value;
    }
  };

  input.oninput = onInput;

  return input;
};

// Dropdown menu
const dropdownOption = (s) => {
  const option = html(`
    <option value=${s}>${s}</option>
    `);

  return option;
};

const dropdownMenu = (categories, name) => {
  const menu = html(`
    <select class="select-input" name=${name} id=${name}></select>
    `);

  for (const s of categories) {
    const option = dropdownOption(s);
    menu.appendChild(option);
  }

  return menu;
};

const getAssignmentFormData = (e) => {
  const form = e.target;

  const inputs = form.getElementsByTagName("input");
  const dropdown = form.getElementsByTagName("select")[0];

  for (const input of inputs) {
    // if input is empty, make input placeholder
    if (input.value === "") {
      input.value = input.placeholder;
    }
  }

  // input array to object where key is input name and value is input value
  const formData = {};
  for (const input of inputs) {
    if (input.value === "") {
      input.value = input.placeholder;
    }

    // if id is number-input, convert to number
    if (input.id === "number-input") {
      input.value = Number(input.value);
    }

    formData[input.name] = input.value;
  }

  formData.category = dropdown.value;

  return formData;
};

const addAssignment = (e) => {
  const data = getAssignmentFormData(e);

  const assignment = assignmentItem(data);

  replaceLi(e, assignment);

  return false;
};

const replaceLi = (e, newLi) => {
  const ul = searchPathByTag(e, "ul");
  const li = searchPathByTag(e, "li");

  ul.replaceChild(newLi, li);
};

const removeLi = (e) => {
  const ul = searchPathByTag(e, "ul");
  const li = searchPathByTag(e, "li");

  ul.removeChild(li);
};

// Grade item component to input custom grade
const assignmentClass = "assignment";
const assignmentForm = (categories, defaultInputs = {}) => {
  const li = html(`
    <li class="assignment"></li>
    `);

  const textInput = resizeableTextInput("name", "Assignment");

  const gradeInput = resizeableNumberInput("grade", "0", true);
  const totalInput = resizeableNumberInput("total", "100", true);
  const weightInput = resizeableNumberInput("weight", "1");

  // if defaultInputs is not empty, set input values
  if (Object.keys(defaultInputs).length > 0) {
    textInput.children[1].value = defaultInputs.name;
    gradeInput.children[1].value = defaultInputs.grade;
    totalInput.children[1].value = defaultInputs.total;
    weightInput.children[1].value = defaultInputs.weight;
  }

  let inputs = [textInput, gradeInput, totalInput, weightInput];

  if (categories) {
    const dropdown = dropdownMenu(categories, "category");

    if (Object.keys(defaultInputs).length > 0) {
      dropdown.value = defaultInputs.category;
    }

    inputs.push(dropdown);
  }

  inputs = wrap(inputs, ["grade-input"]);

  const submitButton = addAssignmentButton();
  const deleteButton = removeAssignmentButton();

  deleteButton.onclick = onRemove;

  const buttons = wrap([submitButton, deleteButton], ["assignment-buttons"]);

  const form = wrap([inputs, buttons], ["assignment-form"], "form");
  form.action = "";
  form.onsubmit = addAssignment;
  li.appendChild(form);

  return li;
};

const onEdit = async (e) => {
  const data = getAssignmentItemData(e);

  const divider = searchPathByClass(e, "divider__item");
  const categories = await getCategories(divider);

  const assignment = assignmentForm(categories, data);

  replaceLi(e, assignment);
};

const getAssignmentItemData = (e) => {
  const item = searchPathByTag(e, "li");

  const spans = item.getElementsByTagName("span");

  // input array to object where key is input name and value is input value
  const itemData = {};
  for (const span of spans) {
    itemData[span.id] = span.innerText;
  }

  return itemData;
};

// Grade item component to display custom grade
const assignmentItem = (data) => {
  const li = html(`
    <li class="assignment"></li>
    `);

  const text = html(`
    <span id="name" class="assignment-name">${data.name}</span>
    `);

  const grade = html(`
    <span id="grade" class="assignment-grade">${data.grade}</span>
    `);

  const total = html(`
    <span id="total" class="assignment-total">${data.total}</span>
    `);

  const weight = html(`
    <span id="weight" class="assignment-weight">${data.weight}</span>
    `);

  const category = html(`
    <span id="category" class="assignment-category">${data.category}</span>
    `);

  const gradeItem = wrap(
    [text, grade, total, weight, category],
    ["grade-item"]
  );

  const submitButton = addAssignmentButton();
  const deleteButton = removeAssignmentButton();

  submitButton.onclick = onEdit;
  deleteButton.onclick = onRemove;

  const buttons = wrap([submitButton, deleteButton], ["assignment-buttons"]);

  const display = wrap([gradeItem, buttons], ["assignment-display"]);

  li.appendChild(display);

  return li;
};

// Checks if grade list is created and if not creates it
const getList = (divider) => {
  // check if ul exists
  let ul = divider.parentElement.getElementsByClassName(listClass)[0];

  if (ul) {
    console.log("ul exists");
    return ul;
  }

  ul = assignmentList();

  injectAfter(ul, divider);

  return ul;
};

const getCardName = (divider) => {
  const spans = divider.getElementsByClassName(
    "grades__flex-row__item--left"
  )[0].children;

  const termName = spans[0].innerText.trim().slice(1, -1); // (Q1) -> Q1
  const taskName = spans[1].innerText.trim();

  return {
    termName,
    taskName,
  };
};

const getCurrentTerm = async (divider) => {
  const name = getCardName(divider);
  const terms = await getTerms();

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

const getCategories = async (divider) => {
  const categories = [];
  const term = await getCurrentTerm(divider);

  for (const category of term.categories) {
    categories.push(category.name);
  }

  return categories;
};

const appendNewAssignment = async (e) => {
  const className = "table__row";
  const divider = searchPathByClass(e, className);

  const ul = getList(divider);

  const categories = await getCategories(divider);

  const newGrade = assignmentForm(categories);
  ul.appendChild(newGrade);
};

const isValidCard = (card) => {
  const assignment = "divider__header";

  const buttons = card.getElementsByTagName("button");
  for (const button of buttons) {
    if (button.classList.contains(buttonClass)) {
      return false;
    }
  }

  const assignments = card.getElementsByClassName(assignment);
  return assignments.length > 0;
};

const getValidCards = (panel) => {
  const valid = [];

  const grades = "card";

  const gradeList = panel.getElementsByClassName(grades);

  // Check if Grade Section has assignments
  for (const card of gradeList) {
    if (isValidCard(card)) {
      valid.push(card);
    }
  }

  return valid;
};

const injectButtons = (result) => {
  const panel = result.data.panel;

  const gradeHeader = "grades__flex-row--nowrap";

  const validCards = getValidCards(panel);
  for (const card of validCards) {
    const header = card.getElementsByClassName(gradeHeader)[0];
    const button = gradeAddButton();
    header.appendChild(button);
  }
};

// Queries
const getSelectedTerm = (data) => {
  const picker = "pill-button-group";
  const termPicker = data.panel.getElementsByClassName(picker)[0];
  const buttons = termPicker.getElementsByTagName("button");
  for (const e of buttons) {
    if (e.classList.contains("k-state-selected")) {
      return e.innerHTML;
    }
  }
};

const getPanel = () => {
  return document.querySelector('[role="tabpanel"]');
};

// Handlers
const handlePanel = (result) => {
  const data = {
    panel: result.queryResult,
  };
  onChange(getSelectedTerm, injectButtons, data);
};

export function handleGradePage() {
  onLoaded(getPanel, handlePanel);
}
