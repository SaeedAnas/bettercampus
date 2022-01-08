import { getPage, getPath } from "./utils/path.js";
import { onChange } from "./utils/observers.js";
import { handleGradePage } from "./pages/grades.js";

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
