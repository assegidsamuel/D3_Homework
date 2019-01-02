// @TODO: YOUR CODE HERE!
//Define the SVG area dimensions.
var svgWidth = 900;
var svgHeight = 600;
var margin = {top: 20, right: 30, bottom: 80,left: 80};

//Define the dimensions of the chart area.
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;


//Create a SVG wraper and 

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", `translate(${margin.left},${ margin.top})`);

// Retrieve data from CSV file and execute everything below

d3.csv("data/data.csv", function(error, healthData) {
   
    if(error) throw error;

    healthData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

// Create scale functions

var xLinearScale = d3.scaleLinear().range([0, chartWidth]).domain([0,24]);
var yLinearScale = d3.scaleLinear().range([chartHeight, 0]).domain([0, 28]);

//Create the axis functions.
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

//Scale the domain.
var xMin;
var xMax;
var yMin;
var yMax;
    
    xMin = d3.min(healthData, function(data) {
        return +data.poverty * .90;
    });

    xMax = d3.max(healthData, function(data) {
        return +data.poverty * 1.10;
    });
    yMin = d3.min(healthData, function(data) {
        return +data.healthcare * .90;
    });

    yMax = d3.max(healthData, function(data) {
        return +data.healthcare * 1.10;
    });	

    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);

// Initialize tooltip 
var toolTip = d3
    .tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(data) {
        var state = data.state;
        var poverty = +data.poverty;
        var healthcare = +data.healthcare;
        return (
            state + '<br> Poverty: ' + poverty + '% <br> health care: ' + healthcare +'%'
        );
    });

// Create tooltip
  svg.call(toolTip);

  svg.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", function(data) {
          return xLinearScale(data.poverty)
      })
      .attr("cy", function(data) {
          return yLinearScale(data.healthcare)
      })
      .attr("r", "10")
      .attr("fill", "lightblue")
      

  
// Appending a label to each data point
  svg.append("text")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .selectAll("tspan")
      .data(healthData)
      .enter()
      .append("tspan")
          .attr("x", function(data) {
              return xLinearScale(data.poverty - 0);
          })
          .attr("y", function(data) {
              return yLinearScale(data.healthcare - 0.2);
          })
          .text(function(data) {
              return data.abbr
          });
  
// Append an SVG group for the xaxis, then display x-axis 
  svg.append("g").attr("transform", `translate(0, ${chartHeight})`).call(bottomAxis);

// Append a group for y-axis, then display it
  svg.append("g").call(leftAxis);



// Append y-axis label
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0-margin.left + 20)
      .attr("x", 0 - svgHeight/2)
      .attr("dy","1em")
      .attr("class", "axis-text")
      .text("Lacks Healthcare (%)")

// Append x-axis labels
  svg.append("text")
      .attr(
          "transform",
          "translate("  + (chartWidth/2) + ", " + (chartHeight + margin.top + 20) + ")")
      .attr("class", "axis-text")
      .text("In Poverty (%)");
  });