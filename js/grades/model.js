const fromTerm = (term) => {
  const data = [];

  term.categories.forEach((category) => {
    const name = category.name;

    let weight = 1;

    if (term.task.groupWeighted) {
      weight = category.isWeighted ? category.weight : 0;
    }

    const progress = category.progress;

    let points;
    let total;
    let percent;

    if (!progress) {
      points = 0;
      total = 0;
      percent = 0;
    } else {
      points = progress.progressPointsEarned;
      total = progress.progressTotalPoints;
      percent = progress.progressPercent;
    }

    const categoryData = {
      name,
      weight,
      points,
      total,
      percent,
    };

    data.push(categoryData);
  });

  return data;
};

const fromHeader = (spans) => {
  const termName = spans[0].innerText.trim().slice(1, -1); // (Q1) -> Q1
  const taskName = spans[1].innerText.trim();

  return {
    termName,
    taskName,
  };
};

const fromForm = (form, placeholders = true) => {
  const inputs = form.getElementsByTagName("input");

  // input array to object where key is input name and value is input value
  const formData = {};
  for (const input of inputs) {
    let val = input.value;
    if (input.value === "") {
      if (placeholders) {
        val = input.placeholder;
      } else {
        val = null;
      }
    }

    // if id is number-input, convert to number
    if (input.id === "number-input") {
      val = Number(val);
    }

    if (input.name.toLowerCase() === "multiplier") {
      val = Number(val);
      formData.multiplier = val;
      continue;
    }

    formData[input.name] = val;
  }

  const dropDownBox = form.getElementsByClassName("custom-category")[0];
  if (!dropDownBox.checked) {
    const dropdown = form.getElementsByTagName("select")[0];
    formData.category = dropdown.value;
  } else {
    formData.category = { name: formData.category, weight: formData.weight };
  }

  if (!formData.multiplier) {
    formData.multiplier = 1;
  }

  return formData;
};

const fromItem = (item) => {
  const spans = item.getElementsByTagName("span");

  // input array to object where key is input name and value is input value
  const itemData = {};
  for (const span of spans) {
    const value = Number(span.innerText);

    if (!isNaN(value)) {
      itemData[span.id] = value;
    } else {
      itemData[span.id] = span.innerText;
    }
  }

  if (!itemData.multiplier) {
    itemData.multiplier = 1;
  }

  if (itemData.category_weight) {
    itemData.category = {
      name: itemData.category,
      weight: itemData.category_weight,
    };
  }

  return itemData;
};

const fromCategoryButton = (button) => {
  const text = button.innerText.trim().split("\n");

  const name = text[0] ? text[0].trim() : null;
  const weight = text[1] ? text[1].trim() : null;

  return {
    name,
    weight,
  };
};

const fromList = (ul) => {
  const items = [];

  if (!ul) {
    return items;
  }

  for (const li of ul.children) {
    if (li.classList.contains("assignment-item")) {
      const itemData = fromItem(li);
      items.push({ type: "item", data: itemData });
    } else if (li.classList.contains("assignment-form-wrapper")) {
      const formData = fromForm(li, false);
      items.push({ type: "form", data: formData });
    }
  }

  return items;
};

export default {
  fromTerm,
  fromHeader,
  fromForm,
  fromItem,
  fromCategoryButton,
  fromList,
};
