// @TODO: YOUR CODE HERE!
// set the dimensions and margins of the graph
let margin = {top: 10, right: 30, bottom: 50, left: 50},
    width = 950 - margin.left - margin.right,
    height = 775 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#scatter")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

let chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Read the data
d3.csv("D3_data_journalism/data.csv").then(censusData => {
  console.log(censusData);

  // format the data
  censusData.forEach(function(data) {
    data.income = +data.income;
    console.log(data.income);
    data.healthcare = +data.healthcare;
    console.log(data.healthcare);
    data.obesity = +data.obesity;
    console.log(data.obesity);
    data.poverty = +data.poverty;
    console.log(data.poverty);
    data.abbr = data.abbr;
    console.log(data.abbr);
  })

  // Add X axis
  let x = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => d.income)])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
  
  let xlabel = svg.append("text")
    .attr("x", 400)
    .attr("y", 750)
    .attr("value", "income") // value to grab for event listener
    .classed("active", true)
    .text("Median Household Income ($)");

  // Add Y axis
  let y = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => d.healthcare)])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  let bottomAxis = d3.axisBottom(x)
  let leftAxis = d3.axisLeft(y)
  // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
  // Its opacity is set to 0: we don't see it by default.
  let tooltip = d3.select("#scatter")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")



  // A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
  let mouseover = function(d) {
    tooltip
      .style("opacity", 1)
  }

  let mousemove = function(d) {
    tooltip
      .html(`<strong>${d.state}</strong><hr><strong>Healthcare (%):</strong> ${d.healthcare} <br> 
      <strong>Household Income:</strong> ${d.income.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      })}`)
      .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1]) + "px")
  }

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  let mouseleave = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(censusData.filter(function(d,i){return i})) // the .filter part is just to keep a few dots on the chart, not all of them
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.income); } )
      .attr("cy", function (d) { return y(d.healthcare); } )
      .attr("r", 15)
      .style("fill", "green")
      .style("opacity", 0.5)
      .style("stroke", "white")
    .on("mouseover", mouseover )
    .on("mousemove", mousemove )
    .on("mouseleave", mouseleave )

    
    // Label the Y-Axis
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 50 - (height / 2))
    .attr("dy", "1em")
    .classed("active", true)
    .text("Percentage of Population Lacking Healthcare Coverage (%)");
  });