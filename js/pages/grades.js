import { getAssignments } from "../user.js";
import { onChange, onLoaded } from "../utils/observers.js";

const buttonClass = "add-button";

// Create an add button
const appendButton = (e) => {
  let button = document.createElement("button");
  button.classList.add(buttonClass);
  button.onclick = function () {
    getAssignments();
  };

  let plus = document.createElement("i");
  plus.classList.add("divider__icon", "fa", "fa-plus");

  button.appendChild(plus);
  e.appendChild(button);
};

const isValidCard = (card) => {
  const assignment = "divider__header";

  const buttons = card.getElementsByTagName("button");
  for (let button of buttons) {
    if (button.classList.contains(buttonClass)) {
      return false;
    }
  }

  const assignments = card.getElementsByClassName(assignment);
  return assignments.length > 0;
};

const getValidCards = (panel) => {
  let valid = [];

  let grades = "card";
  let gradeHeader = "grades__flex-row--nowrap";

  let gradeList = panel.getElementsByClassName(grades);

  // Check if Grade Section has assignments
  for (let card of gradeList) {
    if (isValidCard(card)) {
      const header = card.getElementsByClassName(gradeHeader)[0];
      valid.push(header);
    }
  }

  return valid;
};

// Inject the buttons on valid cards
const injectButtons = (result) => {
  let panel = result.data.panel;

  let valid = getValidCards(panel);
  for (let e of valid) {
    appendButton(e);
  }
};

const handlePanel = (result) => {
  let panel = result.queryResult;
  let data = {
    panel: panel,
  };
  onChange(getSelectedTerm, injectButtons, data);
};

const getSelectedTerm = (data) => {
  let picker = "pill-button-group";
  var termPicker = data.panel.getElementsByClassName(picker)[0];
  let buttons = termPicker.getElementsByTagName("button");
  for (let e of buttons) {
    if (e.classList.contains("k-state-selected")) {
      return e.innerHTML;
    }
  }
};

export function handleGradePage() {
  const query = () => {
    return document.querySelector('[role="tabpanel"]');
  };

  onLoaded(query, handlePanel);
}
