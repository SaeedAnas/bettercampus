const roundToTwo = (num) => {
  if (isNaN(num)) {
    return 0;
  }

  return +(Math.round(num + "e+2") + "e-2");
};

const truncToTwo = (num) => {
  if (isNaN(num)) {
    return 0;
  }
  // Truncates to two decimal places
  num = Math.trunc(num * 100) / 100;

  return num;
};

const categoryGrade = (data, categories) => {
  // create a map of all category names and their grades
  const categoryMap = {};
  categories.forEach((category) => {
    categoryMap[category.name] = {
      points: category.points,
      total: category.total,
      weight: category.weight,
      prev: {
        points: category.points,
        total: category.total,
        percent: category.percent,
      },
    };
  });

  // iterate over data and add points and total to categoryMap using category name
  data.forEach((assignment) => {
    const category = categoryMap[assignment.category];
    category.points += assignment.points;
    category.total += assignment.total;
  });

  for (const [key, value] of Object.entries(categoryMap)) {
    if (value.points === null) {
      value.percent = 0;
      value.weight = 0;
    } else {
      value.percent = roundToTwo((value.points / value.total) * 100);
    }
  }

  return categoryMap;
};

const totalGrade = (categoryMap) => {
  // total of all categories in categoryMap
  let percent = 0;

  let totalWeight = 0;

  for (const [key, value] of Object.entries(categoryMap)) {
    totalWeight += value.weight;
    percent += value.percent * value.weight;
  }

  // find percent to two decimal places
  percent = roundToTwo(percent / totalWeight);

  return percent;
};

export default { categoryGrade, totalGrade };
