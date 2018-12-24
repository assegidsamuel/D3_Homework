// @TODO: YOUR CODE HERE!
//Define the SVG area dimensions.
var svgWidth = 900;
var svgHeight = 600;

var margin = {top: 20, right: 30, bottom: 20,left: 20};
//Define the dimensions of the chart area.
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;


//Create a SVG warper and append the SVG group that will hold our chart and 
//the latter by the top and right margins.
var svg = d3
  .select('.chart')
  .append('svg')
  .attr('chartWidth', svgWidth)
  .attr('chartHeight', svgHeight)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
var chart = svg.append('g');

//Append a div to the body to create tooltips, and assign it a class.
d3.select(".chart")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// Retrieve data from CSV file and execute everything below
d3.csv("../../data/data.csv", function(err, healthData) {
    if(error) throw error;

    healthData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

// Create scale functions
var yLinearScale = d3.scaleLinear().range([height, 0]);
var xLinearScale = d3.scaleLinear().range([0, width]);

	//Create the axis functions.
	var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    
    //Scale the domain.
	xLinearScale.domain([0, d3.max(healthData, function(data){
		return +data.poverty;
	})]);

	yLinearScale.domain([0, d3.max(healthData,function(data){
		return +data.poverty;
	})]);