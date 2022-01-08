import { getPage, getPath } from "./utils.js";
import { handleGradePage } from "./grades.js";
import { onChange } from "./observers.js";

const handlePage = () => {
  const page = getPage();
  switch (page) {
    case "grades":
      handleGradePage();
      break;
    default:
      break;
  }
};

export function main() {
  onChange(getPath, handlePage);
}
