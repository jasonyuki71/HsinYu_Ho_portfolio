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

// Add the theme selector.
document.body.insertAdjacentHTML(
    "afterbegin",
    `
    <label class="color-scheme">
    Theme:
    <select>
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
    </select>
    </label>`
);

// Find the dropdown.
let select = document.querySelector(".color-scheme select");

// Restore the saved preference.
if ("colorScheme" in localStorage) {
    select.value = localStorage.colorScheme;

    document.documentElement.style.setProperty(
    "color-scheme",
    localStorage.colorScheme
    );
}

// Change the theme and save the preference.
select.addEventListener("input", function (event) {
    let colorScheme = event.target.value;

    document.documentElement.style.setProperty(
    "color-scheme",
    colorScheme
    );

    localStorage.colorScheme = colorScheme;
});

// Find the contact form.
let form = document.querySelector('form[action^="mailto:"]');

// Only run this code on pages with a contact form.
if (form) {
    form.addEventListener("submit", function (event) {
    // Stop the browser's default form submission.
    event.preventDefault();

    // Read the form values.
    let data = new FormData(form);

    // Build the email URL.
    let url = form.action + "?";

    for (let [name, value] of data) {
        url +=
        encodeURIComponent(name) +
        "=" +
        encodeURIComponent(value) +
        "&";
    }

    // Open the user's email application.
    location.href = url;
    });
}

export async function fetchJSON(url) {
    try {
    // Load the file.
    const response = await fetch(url);
    // Check whether the request succeeded.
    if (!response.ok) {
        throw new Error(
        `Failed to fetch data: ${response.statusText}`
        );
    }
    // Convert the response into JavaScript data.
    const data = await response.json();
    return data;
} catch (error) {
    console.error("Error fetching or parsing JSON data:", error);
    }
}

export function renderProjects(
    projects,
    containerElement,
    headingLevel = "h2"
) {
  // Clear existing cards to avoid duplicates.
    containerElement.innerHTML = "";
  // Create one card for each project.
    for (let project of projects) {
    const article = document.createElement("article");

    article.innerHTML = `
        <${headingLevel}>${project.title}</${headingLevel}>
        <img src="${project.image}" alt="${project.title}">
        <p>${project.description}</p>
    `;
    containerElement.appendChild(article);
    }
}

export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}