const fromTerm = (term) => {
  const data = [];

  term.categories.forEach((category) => {
    const name = category.name;

    let weight = 1;

    if (term.task.groupWeighted) {
      weight = category.isWeighted ? category.weight : 0;
    }

    const progress = category.progress;

    const points = progress.progressPointsEarned;
    const total = progress.progressTotalPoints;
    const percent = progress.progressPercent;

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

const fromForm = (form) => {
  const inputs = form.getElementsByTagName("input");
  const dropdown = form.getElementsByTagName("select")[0];

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

  if (!itemData.weight) {
    itemData.weight = 1;
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

export default {
  fromTerm,
  fromHeader,
  fromForm,
  fromItem,
  fromCategoryButton,
};
