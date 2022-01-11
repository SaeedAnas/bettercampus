import { getPage, getPath } from "./utils/path.js";
import { onChange } from "./utils/observers.js";
import { handleGradePage } from "./grades/page.js";

const handlePage = async () => {
  const page = getPage();
  switch (page) {
    case "grades":
      await handleGradePage();
      break;
    default:
      break;
  }
};

export async function main() {
  onChange(getPath, handlePage);
}
