const config = {
  links: {
    website: "https://saeedanas.me",
    github: "https://github.com/saeedanas",
  },
};

/* Links */
document.getElementById("link_website").addEventListener("click", () => {
  chrome.tabs.create({ url: config.links.website });
});

document.getElementById("link_github").addEventListener("click", () => {
  chrome.tabs.create({ url: config.links.github });
});
