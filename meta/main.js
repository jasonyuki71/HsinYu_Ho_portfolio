import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

async function loadData() {
  return await d3.csv("./loc.csv", (row) => ({
    ...row,
    line: Number(row.line),
    depth: Number(row.depth),
    length: Number(row.length),
    date: new Date(row.date + "T00:00" + row.timezone),
    datetime: new Date(row.datetime),
  }));
}

function processCommits(data) {
  return d3.groups(data, (row) => row.commit)
    .map(([id, lines]) => {
      const first = lines[0];
      const [hours, minutes] = first.time.split(":").map(Number);

      return {
        id,
        url: `https://github.com/jasonyuki71/HsinYu_Ho_portfolio/commit/${id}`,
        author: first.author,
        date: first.date,
        time: first.time,
        timezone: first.timezone,
        datetime: first.datetime,
        hourFrac: hours + minutes / 60,
        totalLines: lines.length,
        lines,
      };
    });
}

function renderCommitInfo(data, commits) {
  const stats = d3.select("#stats")
    .append("dl")
    .attr("class", "stats");

  const linesByFile = d3.rollups(
    data,
    (rows) => rows.length,
    (row) => row.file
  );

  const averageLines = d3.mean(linesByFile, ([, count]) => count);
  const maxLines = d3.max(linesByFile, ([, count]) => count);

  stats.append("dt").text("Total Lines of Code");
  stats.append("dd").text(data.length);

  stats.append("dt").text("Total Commits");
  stats.append("dd").text(commits.length);

  stats.append("dt").text("Total Files");
  stats.append("dd").text(linesByFile.length);

  stats.append("dt").text("Average Lines per File");
  stats.append("dd").text(averageLines?.toFixed(1) ?? "—");

  stats.append("dt").text("Most Lines in a File");
  stats.append("dd").text(maxLines ?? "—");
}

function renderScatterplot(commits) {
  if (commits.length === 0) return;

  const width = 800;
  const height = 400;
  const padding = 50;
  const timeTicks = [0, 6, 12, 18, 24];

  const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("width", "100%");

  const xScale = d3.scaleTime()
    .domain(d3.extent(commits, (d) => d.datetime))
    .range([padding, width - padding]);

  const yScale = d3.scaleLinear()
    .domain([0, 24])
    .range([height - padding, padding]);

  // Draw the horizontal gridlines first so they sit behind the dots.
  const gridlines = svg.append("g")
    .attr("transform", `translate(${padding}, 0)`)
    .call(
      d3.axisLeft(yScale)
        .tickValues(timeTicks)
        .tickSize(-(width - 2 * padding))
        .tickFormat(() => "")
    );

  gridlines.select(".domain").remove();
  gridlines.selectAll("line")
    .attr("stroke", "currentColor")
    .attr("stroke-opacity", 0.15);

  // Draw the axes.
  svg.append("g")
    .attr("transform", `translate(0, ${height - padding})`)
    .call(d3.axisBottom(xScale).ticks(6));

  svg.append("g")
    .attr("transform", `translate(${padding}, 0)`)
    .call(
      d3.axisLeft(yScale)
        .tickValues(timeTicks)
        .tickFormat((hour) => `${String(hour).padStart(2, "0")}:00`)
    );

  const tooltip = d3.select("#commit-tooltip");

  function moveTooltip(event) {
    tooltip
      .style("left", `${event.clientX + 12}px`)
      .style("top", `${event.clientY + 12}px`);
  }

  const radiusScale = d3.scaleSqrt()
  .domain(d3.extent(commits, (d) => d.totalLines))
  .range([3, 12]);
  // Draw one dot per commit.
  const sortedCommits = [...commits].sort(
  (a, b) => b.totalLines - a.totalLines
);

  svg.selectAll("circle")
    .data(sortedCommits)
    .join("circle")
    .attr("cx", (d) => xScale(d.datetime))
    .attr("cy", (d) => yScale(d.hourFrac))
    .attr("r", (d) => radiusScale(d.totalLines))
    .attr("fill", "steelblue")
    .on("mouseenter", (event, commit) => {
      d3.select("#commit-link")
        .attr("href", commit.url)
        .text(commit.id);

      d3.select("#commit-date")
        .text(commit.datetime.toLocaleDateString(
          undefined,
          { timeZone: "UTC" }
        ));

      d3.select("#commit-time").text(commit.time);
      d3.select("#commit-author").text(commit.author);
      d3.select("#commit-lines").text(commit.totalLines);

      moveTooltip(event);
      tooltip.property("hidden", false);
    })
    .on("mousemove", moveTooltip)
    .on("mouseleave", () => {
      tooltip.property("hidden", true);
    });

    const brush = d3.brush()
  .extent([
    [padding, padding],
    [width - padding, height - padding],
  ])
  .on("brush end", (event) => {
    const selectedCommits = commits.filter((commit) => {
      if (!event.selection) return false;

      const [[x0, y0], [x1, y1]] = event.selection;
      const x = xScale(commit.datetime);
      const y = yScale(commit.hourFrac);

      return x >= x0 && x <= x1 && y >= y0 && y <= y1;
    });

    const selectedIds = new Set(
      selectedCommits.map((commit) => commit.id)
    );

    svg.selectAll("circle")
      .classed("selected", (commit) => selectedIds.has(commit.id));

    const count = selectedCommits.length;
    d3.select("#selection-count").text(
      count === 0 ? "No commits selected" : `${count} selected`
    );

    renderLanguageBreakdown(selectedCommits);
  });

svg.append("g")
  .attr("class", "brush")
  .call(brush);

svg.selectAll("circle").raise();
}

function renderLanguageBreakdown(selectedCommits) {
  const breakdown = d3.select("#language-breakdown");
  breakdown.selectAll("*").remove();

  const selectedLines = selectedCommits.flatMap((commit) => commit.lines);
  if (selectedLines.length === 0) return;

  const counts = d3.rollups(
    selectedLines,
    (lines) => lines.length,
    (line) => line.type
  ).sort((a, b) => b[1] - a[1]);

  for (const [language, count] of counts) {
    const percent = (count / selectedLines.length) * 100;

    breakdown.append("dt").text(language);
    breakdown.append("dd").text(`${count} lines (${percent.toFixed(1)}%)`);
  }
}

const data = await loadData();
const commits = processCommits(data);

renderCommitInfo(data, commits);
renderScatterplot(commits);