import { fetchJSON, renderProjects } from "../global.js";

// Read the project data.
const projects = await fetchJSON("../lib/projects.json");

// Find the container for the project cards.
const projectsContainer = document.querySelector(".projects");

// Display the projects.
renderProjects(projects, projectsContainer, "h2");

const projectsTitle = document.querySelector(".projects-title");

projectsTitle.textContent = `${projects.length} Projects`;