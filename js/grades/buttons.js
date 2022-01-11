import { html } from "../utils/dom.js";
import { appendNewAssignment } from "./list.js";

const button = (raw, onClick = () => {}, attributes = {}) => {
  const button = html(raw);

  button.onclick = onClick;

  for (const [key, value] of Object.entries(attributes)) {
    button.setAttribute(key, value);
  }

  return button;
};

const iconButton = (
  iconList,
  buttonList,
  onClick = () => {},
  attributes = {}
) => {
  // turn iconClass array into string separated by spaces
  const iconClass = iconList.join(" ");
  const buttonClass = buttonList.join(" ");
  return button(
    `
    <button class="grade-button ${buttonClass}">
      <i class="divider__icon fa ${iconClass}"></i>
    </button>
    `,
    onClick,
    attributes
  );
};

const plusButton = (onClick = () => {}, attributes = {}) => {
  return iconButton(
    ["fa-plus", "fa-light", "grade-icon"],
    ["add-button"],
    onClick,
    attributes
  );
};

const checkButton = (onClick = () => {}, attributes = {}) => {
  return iconButton(
    ["fa-check", "fa-light", "grade-icon"],
    ["add-button"],
    onClick,
    attributes
  );
};

const minusButton = (onClick = () => {}, attributes = {}) => {
  return iconButton(
    ["fa-minus", "fa-light", "grade-icon"],
    ["remove-button"],
    onClick,
    attributes
  );
};

const closeButton = (onClick = () => {}, attributes = {}) => {
  return iconButton(
    ["fa-times", "fa-light", "grade-icon"],
    ["remove-button"],
    onClick,
    attributes
  );
};

const editButton = (onClick = () => {}, attributes = {}) => {
  return iconButton(
    ["fa-pencil", "fa-light", "grade-icon"],
    ["edit-button"],
    onClick,
    attributes
  );
};

const addAssignmentButton = () => {
  return iconButton(
    ["fa-plus", "header-icon"],
    ["add-button"],
    appendNewAssignment
  );
};

export {
  button,
  iconButton,
  addAssignmentButton,
  plusButton,
  checkButton,
  minusButton,
  closeButton,
  editButton,
};
