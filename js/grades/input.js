import { wrap, html } from "../utils/dom.js";
import { closeButton, checkButton } from "./buttons.js";
import { onRemove } from "./assignment.js";
import { saveOnInput } from "./list.js";
import user from "./user.js";

const resizeableTextInput = (label, placeholder, required = false) => {
  let req = required ? "required" : "";
  const input = html(`
  <label class="input-sizer">
    <span>${label}: </span>
    <input ${req} type="text" id=${label} onClick="this.select();" name=${label} size="${placeholder.length}" placeholder="${placeholder}" autocomplete="off">
  </label>
    `);

  const onInput = (e) => {
    const element = e.target;
    element.parentNode.dataset.value = element.value;
  };

  input.oninput = onInput;

  const onfocusout = (e) => {
    saveOnInput(e);
  };

  input.addEventListener("focusout", onfocusout);

  return input;
};

const resizeableNumberInput = (label, placeholder, required = false) => {
  let req = required ? "required" : "";

  const input = html(`
  <label class="input-sizer">
    <span>${label}: </span>
    <input ${req} type="text" id="number-input" onClick="this.select();" name=${label} size="${placeholder.length}" placeholder="${placeholder}" autocomplete="off">
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

  const onfocusout = (e) => {
    saveOnInput(e);
  };

  input.addEventListener("focusout", onfocusout);

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
    <select class="select-input" name=${name} id=${name} required>
    </select>
    `);

  const defaultOption = html(`
    <option value="" disabled="disabled" selected="selected">Select Category</option>
    `);

  if (categories.length > 1) {
    menu.appendChild(defaultOption);
  }

  for (const s of categories) {
    const option = dropdownOption(s);
    menu.appendChild(option);
  }

  const onfocusout = (e) => {
    saveOnInput(e);
  };

  menu.addEventListener("focusout", onfocusout);

  return menu;
};

const arrowSvg = () => {
  return html(`
    <svg>
      <use xlink:href="#select-arrow-down"></use>
    </svg>
  `);
};

const arrowSvgRaw = () => {
  return html(`
    <svg class="sprites">
      <symbol id="select-arrow-down" viewbox="0 0 10 6">
        <polyline points="1 1 5 5 9 1"></polyline>
      </symbol>
    </svg>
    `);
};

const selectMenuWrapper = (categories, name, defaultInput = null) => {
  const wrapper = html(`
    <label class="select" for="${name}">
    </label>
    `);

  const menu = dropdownMenu(categories, name);

  if (defaultInput) {
    menu.value = defaultInput;
  }

  const arrow = arrowSvg();

  wrapper.appendChild(menu);
  wrapper.appendChild(arrow);

  return wrapper;
};

const weightCheckBox = (defaultInput = null) => {
  const checkBox = html(`
    <div class="checkbox-wrapper">
    </div>
    `);

  const input = html(`
    <input id="c1" type="checkbox">
    `);

  const label = html(`
    <label for="c1">Multiplier</label>
    `);

  const onClick = (e) => {
    const checkbox = e.target;

    if (checkbox.checked) {
      const container = checkbox.parentNode.parentNode;
      const prevWeight = container.getElementsByClassName("input-sizer")[0];

      if (prevWeight) {
        return;
      }

      const weightInput = resizeableNumberInput("multiplier", "1");
      container.appendChild(weightInput);
    } else {
      const container = checkbox.parentNode.parentNode;
      const prevWeight = container.getElementsByClassName("input-sizer")[0];

      if (prevWeight) {
        container.removeChild(prevWeight);
      }
    }
  };

  input.onclick = onClick;

  const wrapper = wrap([input, label], ["checkbox-wrapper"]);

  checkBox.appendChild(wrapper);

  if (defaultInput && defaultInput !== 1) {
    input.checked = true;
    const prevWeight = checkBox.getElementsByClassName("input-sizer")[0];

    if (prevWeight) {
      defaultValue(prevWeight, defaultInput);
      return;
    }

    const weightInput = resizeableNumberInput("multiplier", "1");

    defaultValue(weightInput, defaultInput);
    checkBox.appendChild(weightInput);
  }

  return checkBox;
};

const customCategoryInput = (defaultInput = null) => {
  const categoryName = resizeableTextInput(
    "category",
    "Untitled Category",
    true
  );
  const customWeight = resizeableNumberInput("weight", "10", true);

  if (defaultInput) {
    defaultValue(categoryName, defaultInput.name);
    defaultValue(customWeight, defaultInput.weight);
  }

  const categoryInput = wrap(
    [categoryName, customWeight],
    ["custom-category-input"]
  );

  return categoryInput;
};

const customCategoryBox = (checked) => {
  const checkBox = html(`
    <label class="checkbox-wrapper">
    </label>
    `);

  const input = html(`
    <input class="custom-category" id="custom" type="checkbox">
    `);

  const label = html(`
    <label>Custom Category</label>
    `);

  if (checked) {
    input.checked = true;
  }

  // make input checked on label click
  label.onclick = (e) => {
    const checkbox = e.target.parentNode.getElementsByTagName("input")[0];
    if (checkbox.checked) {
      checkbox.checked = false;
    } else {
      checkbox.checked = true;
    }
    const newEvent = {};
    newEvent.target = checkbox;
    newEvent.path = e.path;
    checkbox.onclick(newEvent);
  };

  const onClick = async (e) => {
    const checkbox = e.target;

    if (checkbox.checked) {
      const container = checkbox.parentNode.parentNode.parentNode;
      const dropdown = container.getElementsByClassName("dropdown-menu")[0];

      if (!dropdown) {
        const customInput = customCategoryInput();
        container.appendChild(customInput);
        return;
      }
      const customInput = customCategoryInput();

      container.replaceChild(customInput, dropdown);
    } else {
      const container = checkbox.parentNode.parentNode.parentNode;
      let dropdown = container.getElementsByClassName("dropdown-menu")[0];

      if (dropdown) {
        return;
      }

      const customInput = container.getElementsByClassName(
        "custom-category-input"
      )[0];

      if (customInput) {
        const categories = await user.fetchCategories(e);
        dropdown = selectMenuWrapper(categories, "category");
        const dropdownWrapper = wrap([dropdown], ["dropdown-menu"]);

        container.replaceChild(dropdownWrapper, customInput);
      }
    }
    saveOnInput(e);
  };

  input.onclick = onClick;

  const wrapper = wrap([input, label], ["checkbox-wrapper"]);

  checkBox.appendChild(wrapper);

  return checkBox;
};

const categoryInput = (categories, defaultInput) => {
  let checked = false;

  let wrapper;

  if (defaultInput) {
    if (defaultInput.name) {
      const custom = customCategoryInput(defaultInput);
      checked = true;
      wrapper = custom;
    } else {
      const dropdown = selectMenuWrapper(categories, "category", defaultInput);
      wrapper = wrap([dropdown], ["dropdown-menu"]);
    }
  } else {
    const dropdown = selectMenuWrapper(categories, "category");
    wrapper = wrap([dropdown], ["dropdown-menu"]);
  }

  const customCategory = customCategoryBox(checked);

  const middle = wrap([customCategory, wrapper], ["form-middle"]);

  return middle;
};

const defaultValue = (el, value) => {
  if (!value) {
    return;
  }
  let input = el.children[1];
  input.value = value;
  input.parentNode.dataset.value = value;
};

const itemForm = (categories, defaultInputs = {}) => {
  const hasDefaultInputs = Object.keys(defaultInputs).length > 0;

  const textInput = resizeableTextInput("name", "Untitled Assignment");

  const pointInput = resizeableNumberInput("points", "0", true);
  const totalInput = resizeableNumberInput("total", "100", true);

  let weightInput;

  // if defaultInputs is not empty, set input values
  if (hasDefaultInputs) {
    defaultValue(textInput, defaultInputs.name);
    defaultValue(pointInput, defaultInputs.points);
    defaultValue(totalInput, defaultInputs.total);
    weightInput = weightCheckBox(defaultInputs.multiplier);
  } else {
    weightInput = weightCheckBox();
  }

  let inputs = [];

  const top = wrap([textInput, pointInput, totalInput], ["form-top"]);

  inputs.push(top);

  if (categories.length > 0) {
    const middle = categoryInput(categories, defaultInputs.category);

    inputs.push(middle);
  }

  const bottom = wrap([weightInput], ["form-bottom"]);

  inputs.push(bottom);

  const arrow = arrowSvgRaw();

  inputs.push(arrow);

  inputs = wrap(inputs, ["grade-input"]);

  const submitButton = checkButton();
  const deleteButton = closeButton(onRemove, { type: "button" });

  const buttons = wrap([submitButton, deleteButton], ["assignment-buttons"]);

  const form = wrap([inputs, buttons], ["assignment-form"], "form");

  return form;
};

export { itemForm };
