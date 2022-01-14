// import { onChange, onLoaded } from "../utils/observers.js";
// import { editPanel } from "./panel.js";
// import user from "./user.js";
// import query from "./query.js";

// Watch for changes to term bar and edit the panel on every navigation change
// const handlePanel = (result) => {
//   const data = {
//     panel: result.queryResult,
//   };
//
//   onChange(query.getSelectedTerm, editPanel, data);
// };

// Wait for panel to load
async function handleTodayPage() {
  // await user.update();
  // onLoaded(query.getPanel, handlePanel);
  // console.log("handleTodayPage");
}

export { handleTodayPage };
