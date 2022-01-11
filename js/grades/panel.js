import { addAssignmentButton } from "./buttons.js";
import query from "./query.js";
import { remove } from "../utils/dom.js";
import { loadState } from "./list.js";

// Add buttons to valid terms
const editPanel = async (result) => {
  const panel = result.data.panel;

  const validCards = query.getValidCards(panel);

  for (const card of validCards) {
    await updatePanel(card);
  }
};

const updatePanel = async (card) => {
  appendAssignmentButton(card);
  loadState(card);
};

const removeInfoButton = (header) => {
  const styleDiv = header.querySelectorAll("*[style]")[0];

  if (styleDiv) {
    remove(styleDiv);
  }
};

const appendAssignmentButton = (card) => {
  const header = query.getHeader(card);

  removeInfoButton(header);

  const button = addAssignmentButton();

  header.appendChild(button);
};

export { editPanel };
