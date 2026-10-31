import { fetchJSON, renderProjects } from "../global.js";
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// Read the project data.
const projects = await fetchJSON("../lib/projects.json");

// Find the container for the project cards.
const projectsContainer = document.querySelector(".projects");

// Display the projects.
renderProjects(projects, projectsContainer, "h2");

const projectsTitle = document.querySelector(".projects-title");

projectsTitle.textContent = `${projects.length} Projects`;

let data = [1, 2];

let arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(50);

// Let D3 calculate the slice angles.
let sliceGenerator = d3.pie();
let arcData = sliceGenerator(data);

// Generate the SVG paths.
let arcs = arcData.map((d) => arcGenerator(d));

let colors = ["gold", "purple"];

// Draw the slices.
arcs.forEach((arc, index) => {
  d3.select("#projects-plot")
    .append("path")
    .attr("d", arc)
    .attr("fill", colors[index]);
});