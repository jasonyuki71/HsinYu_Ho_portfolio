console.log("IT’S ALIVE!");

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

// Use different base paths locally and on GitHub Pages.
const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"
    : "/HsinYu_Ho_portfolio/";

// List the pages in the navigation menu.
let pages = [
    { url: "", title: "Home" },
    { url: "projects/", title: "Projects" },
    { url: "contact/", title: "Contact" },
    { url: "resume/", title: "Resume" },
    { url: "https://github.com/jasonyuki71", title: "GitHub" }
];

// Create the navigation menu.
let nav = document.createElement("nav");
document.body.prepend(nav);

// Create one link for each page.
for (let page of pages) {
    let url = page.url;

    if (!url.startsWith("http")) {
    url = BASE_PATH + url;
    }

    nav.insertAdjacentHTML(
    "beforeend",
    `<a href="${url}">${page.title}</a>`
    );
}