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
    const c = assignment.category;
    if (c.name) {
      const category = categoryMap[c.name];
      if (!category) {
        categoryMap[c.name] = {
          points: 0,
          total: 0,
          weight: assignment.category.weight,
          prev: {
            points: 0,
            total: 0,
            percent: 0,
          },
        };
      }
    }

    const name = c.name ? c.name : c;

    const category = categoryMap[name];
    category.points += assignment.points * assignment.multiplier;
    category.total += assignment.total * assignment.multiplier;
  });

  const empty = [];

  for (const [key, value] of Object.entries(categoryMap)) {
    // if points and total are null remove category from categoryMap
    if (value.points === null || value.total === null) {
      empty.push(key);
    }
    value.points = roundToTwo(value.points);
    value.total = roundToTwo(value.total);
    if (value.points === null) {
      value.percent = 0;
      value.weight = 0;
    } else {
      value.percent = roundToTwo((value.points / value.total) * 100);
    }
  }

  // remove categories with null points and total
  empty.forEach((category) => {
    delete categoryMap[category];
  });

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

const calcPercent = (points, total) => {
  return roundToTwo((points / total) * 100);
};

// Calculates the grade for a single assignment
const letterGrade = (p) => {
  if (p > 97) {
    return "A+";
  } else if (p > 93) {
    return "A";
  } else if (p > 90) {
    return "A-";
  } else if (p > 87) {
    return "B+";
  } else if (p > 83) {
    return "B";
  } else if (p > 80) {
    return "B-";
  } else if (p > 77) {
    return "C+";
  } else if (p > 73) {
    return "C";
  } else if (p > 70) {
    return "C-";
  } else if (p > 67) {
    return "D+";
  } else if (p > 63) {
    return "D";
  } else if (p > 60) {
    return "D-";
  } else {
    return "F";
  }
};

export default { categoryGrade, totalGrade, calcPercent, letterGrade };
