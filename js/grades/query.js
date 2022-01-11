import { searchPathByClass } from "../utils/dom.js";
import model from "./model.js";

const getValidCards = (panel) => {
  const valid = [];

  const termList = getCard(panel);

  for (const card of termList) {
    if (isValidCard(card)) {
      valid.push(card);
    }
  }

  return valid;
};

const getCard = (panel) => {
  const grades = "card";
  return panel.getElementsByClassName(grades);
};

const isValidCard = (card) => {
  const buttonClass = "add-button";

  const buttons = card.getElementsByTagName("button");
  for (const button of buttons) {
    if (button.classList.contains(buttonClass)) {
      return false;
    }
  }

  const categories = getCategories(card);
  return categories.length > 0;
};

const getCategories = (el) => {
  const category = "divider__header";
  const children = el.getElementsByClassName(category);

  const categories = [];

  // remove elements that are not buttons
  for (const c of children) {
    if (c.tagName === "BUTTON") {
      categories.push(c);
    }
  }

  return categories;
};

const getSelectedTerm = (data) => {
  const terms = data.panel.getElementsByClassName("pill-button-group")[0];
  const buttons = terms.getElementsByTagName("button");
  for (const term of buttons) {
    if (term.classList.contains("k-state-selected")) {
      return term.innerHTML;
    }
  }
};

const getPanel = () => {
  return document.querySelector('[role="tabpanel"]');
};

const getHeader = (card) => {
  const gradeHeader = "grades__flex-row--nowrap";
  return card.getElementsByClassName(gradeHeader)[0];
};

const getList = (header) => {
  const listClass = "assignment-list";
  return header.parentElement.getElementsByClassName(listClass)[0];
};

const getHeaderSpans = (header) => {
  return header.getElementsByClassName("grades__flex-row__item--left")[0]
    .children;
};

// Click Event Queries

const getDivider = (e) => {
  const className = "divider";
  return searchPathByClass(e, className);
};

const getDividerHeader = (e) => {
  const divider = getDivider(e);
  const className = "table__row";
  return divider.getElementsByClassName(className)[0];
};

const getHeaderInfo = (e) => {
  const header = getDividerHeader(e);

  return model.fromHeader(getHeaderSpans(header));
};

const getDividerCategories = (e) => {
  const divider = getDivider(e);
  const categories = getCategories(divider);
  return categories;
};

export default {
  getValidCards,
  getSelectedTerm,
  getPanel,
  getHeader,
  getDividerHeader,
  getDivider,
  getHeaderInfo,
  getList,
  getCategories,
  getDividerCategories,
};
