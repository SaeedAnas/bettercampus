(async () => {
  const src = chrome.runtime.getURL("/js/content_main.js");
  const contentScript = await import(src);
  await contentScript.main();
})();
