console.log("IT’S ALIVE!");

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Website location: local server or GitHub Pages.
const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"
    : "/HsinYu_Ho_portfolio/";

// Navigation links.
let pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "contact/", title: "Contact" },
  { url: "resume/", title: "Resume" },
  { url: "https://github.com/jasonyuki71", title: "GitHub" }
];

// Add a navigation element at the beginning of the page.
let nav = document.createElement("nav");
document.body.prepend(nav);

// Add each link to the navigation element.
for (let page of pages) {
  let url = page.url;

  if (!url.startsWith("http")) {
    url = BASE_PATH + url;
  }

  let a = document.createElement("a");
  a.href = url;
  a.textContent = page.title;

  // Highlight the current page.
  if (
    a.host === location.host &&
    a.pathname === location.pathname
  ) {
    a.classList.add("current");
  }

  // Open GitHub in a new tab.
  if (a.host !== location.host) {
    a.target = "_blank";
    a.rel = "noopener";
  }

  nav.append(a);
}