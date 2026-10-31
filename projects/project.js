import { fetchJSON, renderProjects } from "../global.js";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON("../lib/projects.json");

const projectsContainer = document.querySelector(".projects");
const projectsTitle = document.querySelector(".projects-title");
const searchInput = document.querySelector(".searchBar");

// Keep the same color for each year
let colors = d3.scaleOrdinal(d3.schemeTableau10)
  .domain(projects.map((project) => project.year));

let selectedYear = null;

// Draw the pie chart and legend
function renderPieChart(projectsToShow) {
  // Count projects for each year
  let rolledData = d3.rollups(
    projectsToShow,
    (group) => group.length,
    (project) => project.year
  );

  let data = rolledData.map(([year, count]) => {
    return {
      value: count,
      label: year
    };
  });

  let arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(50);

  let sliceGenerator = d3.pie()
    .value((d) => d.value);

  let arcData = sliceGenerator(data);

  // Remove the old chart and legend
  d3.select("#projects-plot").selectAll("*").remove();
  d3.select(".legend").selectAll("*").remove();

  // Draw the slices
  arcData.forEach((d) => {
    d3.select("#projects-plot")
      .append("path")
      .attr("d", arcGenerator(d))
      .attr("fill", colors(d.data.label))
      .classed("selected", d.data.label === selectedYear)
      .on("click", () => {
        // Click the same year again to deselect
        if (selectedYear === d.data.label) {
          selectedYear = null;
        } else {
          selectedYear = d.data.label;
        }

        updateProjects(projectsToShow);
      });
  });

  // Create the legend
  data.forEach((d) => {
    d3.select(".legend")
      .append("li")
      .classed("selected", d.label === selectedYear)
      .attr("style", `--color: ${colors(d.label)}`)
      .html(`
        <span class="swatch"></span>
        ${d.label} (${d.value})
      `);
  });
}

// Update the cards, title, and chart
function updateProjects(projectsToShow) {
  let filteredProjects = projectsToShow;

  // Apply the year filter to the search results
  if (selectedYear !== null) {
    filteredProjects = projectsToShow.filter((project) => {
      return project.year === selectedYear;
    });
  }

  renderProjects(filteredProjects, projectsContainer, "h2");
  projectsTitle.textContent = `${filteredProjects.length} Projects`;

  // Keep all years from the search results in the chart
  renderPieChart(projectsToShow);
}

// Show all projects when the page loads
updateProjects(projects);

// Update the results when the user searches
searchInput.addEventListener("input", () => {
  let query = searchInput.value.toLowerCase();

  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join(" ").toLowerCase();
    return values.includes(query);
  });

  updateProjects(filteredProjects);
});

const resetButton = document.querySelector("#reset-filters");

resetButton.addEventListener("click", () => {
  searchInput.value = "";
  selectedYear = null;

  updateProjects(projects);
});