import {
    fetchJSON,
    renderProjects,
    fetchGitHubData
} from "./global.js";

// Load all projects.
const projects = await fetchJSON("./lib/projects.json");

// Select the first three projects.
const latestProjects = projects.slice(0, 3);

// Display them on the homepage.
const projectsContainer = document.querySelector(".projects");

renderProjects(latestProjects, projectsContainer, "h3");

// Load your GitHub profile data.
const githubData = await fetchGitHubData("jasonyuki71");

// Find the statistics container.
const profileStats = document.querySelector("#profile-stats");

// Display the statistics if the data and container exist.
if (profileStats && githubData) {
    profileStats.innerHTML = `
    <dl>
        <dt>Public Repos</dt>
        <dd>${githubData.public_repos}</dd>

        <dt>Public Gists</dt>
        <dd>${githubData.public_gists}</dd>

        <dt>Followers</dt>
        <dd>${githubData.followers}</dd>

        <dt>Following</dt>
        <dd>${githubData.following}</dd>
    </dl>
    `;
}