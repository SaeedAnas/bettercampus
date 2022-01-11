import { wrap, html } from "../utils/dom.js";
import { closeButton, checkButton } from "./buttons.js";
import { onRemove } from "./assignment.js";

const resizeableTextInput = (label, placeholder, required = false) => {
  let req = required ? "required" : "";
  const input = html(`
  <label class="input-sizer">
    <span>${label}: </span>
    <input ${req} type="text" id=${label} name=${label} size="${placeholder.length}" placeholder="${placeholder}" autocomplete="off">
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
    <input ${req} type="text" id="number-input" name=${label} size="${placeholder.length}" placeholder="${placeholder}" autocomplete="off">
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
    <option value="${s}">${s}</option>
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

const defaultValue = (el, value) => {
  let input = el.children[1];
  input.value = value;
  input.parentNode.dataset.value = value;
};

const itemForm = (categories, defaultInputs = {}) => {
  const hasDefaultInputs = Object.keys(defaultInputs).length > 0;

  const textInput = resizeableTextInput("name", "Untitled");

  const pointInput = resizeableNumberInput("points", "0", true);
  const totalInput = resizeableNumberInput("total", "100", true);
  const weightInput = resizeableNumberInput("weight", "1");

  // if defaultInputs is not empty, set input values
  if (hasDefaultInputs) {
    defaultValue(textInput, defaultInputs.name);
    defaultValue(pointInput, defaultInputs.points);
    defaultValue(totalInput, defaultInputs.total);
    defaultValue(weightInput, defaultInputs.weight);
  }

  let inputs = [textInput, pointInput, totalInput, weightInput];

  if (categories.length > 0) {
    const dropdown = dropdownMenu(categories, "category");

    if (hasDefaultInputs) {
      dropdown.value = defaultInputs.category;
    }

    inputs.push(dropdown);
  }

  inputs = wrap(inputs, ["grade-input"]);

  const submitButton = checkButton();
  const deleteButton = closeButton(onRemove, { type: "button" });

  const buttons = wrap([submitButton, deleteButton], ["assignment-buttons"]);

  const form = wrap([inputs, buttons], ["assignment-form"], "form");

  return form;
};

export { itemForm };
