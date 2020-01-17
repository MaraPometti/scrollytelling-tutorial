/* script.js
   Author:
   Date:
*/

 // were adding variables for our different elements
var body = d3.select('.scrolly');
var figure = d3.select('.viz');
var steps = d3.selectAll('.step');
var svg;
var figWidth = d3.select("figure").node().getBoundingClientRect().width
var figHeight = d3.select("figure").node().getBoundingClientRect().height
var onlyitalian;
var filterData;
var countsum;
var topten;


// initializing scrollama
var scroller = scrollama();

// empty data variable global
var dataset;

// were loading the data which takes a few seconds
d3.json('https://github.com/MuseumofModernArt/collection/blob/master/Artworks.json', function(data){

	dataset = data; 
	
	filterData = dataset.filter(d => d["Height (cm)"] != undefined && d["Width (cm)"] != undefined && d["Nationality"] != "" )
  	onlyitalian = filterData.filter(d => d["Nationality"] == "Italian" &&  d["Height (cm)"] > 0 && d["Width (cm)"] > 0 )
  	countsum = d3.nest()
  				.key(d => d["Nationality"])
  				.rollup(function (d) { return d.length; })
  				.entries(filterData)

  	topten = countsum.sort( function (a,b) { return a.value - b.value}).slice(768,778)
  	console.log(topten.map(d => d.key))
	init();

	
})



function init() {

	scroller.setup({

		step: '.step',
		debug: true,
		progress: true,
		offset: 0.5,
	}).onStepEnter(handleStepEnter)
	/*.onStepExit(handleStepExit)*/
}


 // d3 setup

function setup () {

	figure.selectAll("svg").remove()

	 svg = figure.append("svg")
	 	.attr("id", "framework")
		.attr("width", figure.node().getBoundingClientRect().width - 20 + "px")
		.attr("height", figure.node().getBoundingClientRect().height - 20 + "px")
		.style("overflow", "visible")

}

// drawing our first chart
function drawScatterplott () {
	
	var g = svg.append("g");

	var xaxes = d3.scaleLinear()
				.range([0, figWidth])
				.domain(d3.extent(onlyitalian, d => d["Width (cm)"]))

	var yaxes = d3.scaleLinear()
				.range([figHeight, 0])
				.domain(d3.extent(onlyitalian, d => d["Height (cm)"]))

	g.append("g").attr("id", "x-axis").attr("transform", "translate(0," + figHeight + ")").call(d3.axisBottom(xaxes)) 
	g.append("g").attr("id", "y-axis").attr("transform", "translate(20, 0)").call(d3.axisLeft(yaxes)) 


		g.selectAll(".circle")
		.data(onlyitalian)
			.enter()
		.append("rect")
		.attr("ry", (d) => { 
			if ( d["Height (cm)"]) {
				return  yaxes(d["Height (cm)"]) == 0 ? 10 : yaxes(d["Height (cm)"])
			} 
			if (true) {}


		})
		.attr("rx", (d) => { 
			if ( d["Width (cm)"] ) {
				return  xaxes(d["Width (cm)"])
			} 
		})
		.attr("y", (d) => { 
			if ( d["Height (cm)"] ) {
				return  yaxes(d["Height (cm)"])
			} 

		})
		.attr("x", (d) => { 
			if ( d["Width (cm)"] ) {
				return  xaxes(d["Width (cm)"])
			} 
		})
		.attr("width", 10)
		.attr("height", 10)
		//.attr("r", 1)
		.transition()
		.ease(d3.easeBounce)
		.duration(2000)
	
		//.attr("r", (figWidth > 500) ? 10 : 4) 

		// function change () {
				// if (figWidth > 50) then {
					// do whatever
				// } eles() {

				// }
			// }


		// g.append("rect")
		// .attr("class", "box")
		// .attr("width", xaxes(200) + "px")
		// .attr("height", yaxes() "px")
		// .style("fill", "red")
		// .attr("x", xaxes(50))
		// .attr("y", yaxes(200))

		// console.log(d3.max(onlyitalian, d => {d["Height (cm)"]}))
}

function update() {
	d3.select("#framework")
	.attr("width", figWidth + "px")
	.attr("height", figHeight + "px")

	var xaxes = d3.scaleLinear()
				.range([0, figWidth])
				.domain(d3.extent(onlyitalian, d => d["Width (cm)"]))

	var yaxes = d3.scaleLinear()
				.range([figHeight, 0])
				.domain(d3.extent(onlyitalian, d => d["Height (cm)"]))

	d3.select("#x-axis").attr("transform", "translate(0," + figHeight + ")").call(d3.axisBottom(xaxes)) 
	d3.select("#y-axis").attr("transform", "translate(20, 0)").call(d3.axisLeft(yaxes)) 

	d3.selectAll("rect")
	.attr("ry", (d) => { 
			if ( d["Height (cm)"]) {
				return  yaxes(d["Height (cm)"]) == 0 ? 10 : yaxes(d["Height (cm)"])
			} 
			if (true) {}


		})
		.attr("rx", (d) => { 
			if ( d["Width (cm)"] ) {
				return  xaxes(d["Width (cm)"])
			} 
		})
		.attr("y", (d) => { 
			if ( d["Height (cm)"] ) {
				return  yaxes(d["Height (cm)"])
			} 

		})
		.attr("x", (d) => { 
			if ( d["Width (cm)"] ) {
				return  xaxes(d["Width (cm)"])
			} 
		})


}

function zoomIn() {

	var xaxes = d3.scaleLinear()
				.range([0, figWidth])
				.domain([0, 50])

	var yaxes = d3.scaleLinear()
				.range([figHeight, 0])
				.domain([0, 50])

	d3.select("#x-axis").attr("transform", "translate(0," + figHeight + ")").call(d3.axisBottom(xaxes)) 
	d3.select("#y-axis").attr("transform", "translate(20, 0)").call(d3.axisLeft(yaxes)) 

	d3.selectAll("rect")
	.transition()
	.duration(2000)
	.ease(d3.easeCubic)
	    .attr("ry", 10)
		.attr("rx", 10)
		.attr("y", (d) => { 
			if ( d["Height (cm)"] ) {
				return  yaxes(d["Height (cm)"])
			} 

		})
		.attr("x", (d) => { 
			if ( d["Width (cm)"] ) {
				return  xaxes(d["Width (cm)"])
			} 
		})


}

function drawBarChart () {

	var xaxes = d3.scaleBand()
				.range([0, figWidth])
				.domain(topten.map(d => d.key))

	var yaxes = d3.scaleLinear()
				.range([figHeight, 0])
				.domain(d3.extent(topten, d => d.value))


	d3.select("#x-axis").attr("transform", "translate(0," + figHeight + ")").call(d3.axisBottom(xaxes)) 
	d3.select("#y-axis").attr("transform", "translate(20, 0)").call(d3.axisLeft(yaxes)) 
    console.log(d3.selectAll("rect"))
	// grab all the rects and give them the new data
	d3.selectAll("rect")
		.data(topten)
		// for all the ones that didnt get any data, exit and remove them from the page
		.exit().remove();

		// .attr("y", (d) => { 
		// 	if ( d["Height (cm)"] ) {
		// 		return  yaxes(d["Height (cm)"])
		// 	} 

		// })
		// .attr("x", (d) => { 
		// 	if ( d["Width (cm)"] ) {
		// 		return  xaxes(d["Width (cm)"])
		// 	} 
		// })
		




}

// scrollama event handlers
function handleStepEnter(response) { 

	window.addEventListener("resize", e => { 
		//we have to feed the already set dimentions from flex fox in the css into d3
	
		figWidth = d3.select("figure").node().getBoundingClientRect().width
		figHeight = d3.select("figure").node().getBoundingClientRect().height

		update();
		// console.log(d3.select("figure"))
	})

   console.log("step is ", response.index)

	steps.classed('is-active', function (d, i) {
				return i === response.index;
			})
	if (response.index == 0) {
		setup(); 
		drawScatterplott();
	}  

	if (response.index == 1) {
		zoomIn();
	}  

	if (response.index == 2) {

		drawBarChart();
	}  


 }



function handleContainerExit(response) { }
// kick-off code to run once on load


