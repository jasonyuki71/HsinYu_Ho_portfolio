console.log("IT’S ALIVE!");

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

// Get all links inside the navigation menu.
let navLinks = $$("nav a");

// Find the link that matches the current page.
let currentLink = navLinks.find(
    (a) => a.host === location.host
        && a.pathname === location.pathname
);

// Highlight it if a matching link exists.
if (currentLink) {
    currentLink.classList.add("current");
}