// @TODO: YOUR CODE HERE!
//Define the SVG area dimensions.
var svgWidth = 900;
var svgHeight = 600;
var margin = {top: 20, right: 30, bottom: 60,left: 60};

//Define the dimensions of the chart area.
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;


//Create a SVG wraper and 

var svg = d3.select(".chart")
  .append("svg")
  .attr("chartWidth", svgWidth)
  .attr("chartHeight", svgHeight)
  .append("g")
  .attr("transform", `translate(${margin.left},${ margin.top})`);

// append svg group
  var chart = svg.append("g");

//Append a div to the body 
d3.select(".chart")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Retrieve data from CSV file and execute everything below
// healthData = data;
d3.csv("../../data/data.csv", function(error, healthData) {
   
    if(error) throw error;

    healthData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

// Create scale functions
var yLinearScale = d3.scaleLinear().range([chartHeight, 0]);
var xLinearScale = d3.scaleLinear().range([0, chartWidth]);

//Create the axis functions.
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

//Scale the domain.
var xMin;
var xMax;
var yMin;
var yMax;
    
    xMin = d3.min(healthData, function(data) {
        return +data.poverty * 0.85;
    });

    xMax = d3.max(healthData, function(data) {
        return +data.poverty * 1.15;
    });
    yMin = d3.min(healthData, function(data) {
        return +data.healthcare * 0.94;
    });

    yMax = d3.max(healthData, function(data) {
        return +data.healthcare * 1.06;
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
  chart.call(toolTip);

  chart.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", function(data, index) {
          return xLinearScale(data.poverty)
      })
      .attr("cy", function(data, index) {
          return yLinearScale(data.healthcare)
      })
      .attr("r", "10")
      .attr("fill", "blue")
    // display tooltip on click
      .on("mouseenter", function(data) {
          toolTip.show(data);
      })
      
    // hide tooltip on mouseout
      .on("mouseout", function(data, index) {
          toolTip.hide(data);
      });
  
  // Appending a label to each data point
  chart.append("text")
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
  chart
      .append("g")
      .attr('transform', `translate(0, ${height})`)
      .call(bottomAxis);

  // Append a group for y-axis, then display it
  chart.append("g").call(leftAxis);

  // Append y-axis label
  chart
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0-margin.left + 20)
      .attr("x", 0 - height/2)
      .attr("dy","1em")
      .attr("class", "axis-text")
      .text("healthcare (%)")

  // Append x-axis labels
  chart
      .append("text")
      .attr(
          "transform",
          "translate(" + width / 2 + " ," + (height + margin.top + 30) + ")"
      )
      .attr("class", "axis-text")
      .text("poverty (%)");
  });

 