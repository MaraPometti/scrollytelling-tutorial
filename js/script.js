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
var g;
var xaxes;
var yaxes;

// initializing scrollama
var scroller = scrollama();

// empty data variable global
//var dataset;
d3.json('./data/topten.json', function(data){
	topten = data 

})

// were loading the data which takes a few seconds
d3.json('./data/italians.json', function(data){

	onlyitalian = data; 
	init();

	
})

	
	// filterData = dataset.filter(d => d["Height (cm)"] != undefined && d["Width (cm)"] != undefined && d["Nationality"] != "" )
 //  	onlyitalian = filterData.filter(d => d["Nationality"] == "Italian" &&  d["Height (cm)"] > 0 && d["Width (cm)"] > 0 )
 //  	countsum = d3.nest()
 //  				.key(d => d["Nationality"])
 //  				.rollup(function (d) { return d.length; })
 //  				.entries(filterData)

 //  	topten = countsum.sort( function (a,b) { return a.value - b.value}).slice(768,778)
 //  	// console.log(topten.map(d => d.key))

 //  	console.log(JSON.stringify(topten))

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

	g = svg.append("g");
	g.append("g").attr("id", "x-axis")
	g.append("g").attr("id", "y-axis")


}

function makeAxes(isScatter, yExtent, xExtent) {
	if (isScatter == true) {
		xaxes = d3.scaleLinear()
					.range([0, figWidth])
					.domain(xExtent)

		yaxes = d3.scaleLinear()
					.range([figHeight, 0])
					.domain(yExtent)


		d3.select("#x-axis").attr("transform", "translate(0," + figHeight + ")").call(d3.axisBottom(xaxes)) 
		d3.select("#y-axis").attr("transform", "translate(20, 0)").call(d3.axisLeft(yaxes)) 

	}
	else {

		xaxes = d3.scaleBand()
				.rangeRound([0, figWidth])
				.padding(0.5)
				.domain(topten.map(d => d.key))

		yaxes = d3.scaleLinear()
				.range([figHeight, 0])
				.domain(d3.extent(topten, d => d.value))

	}


}

// drawing our first chart
function drawScatterplott () {
	
    makeAxes(true, d3.extent(onlyitalian, d => d["Height (cm)"]), d3.extent(onlyitalian, d => d["Width (cm)"]));

	g.selectAll(".circle")
		.data(onlyitalian)
		.enter()
		.append("rect")
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
		.attr("width", 10)
		.attr("height", 10)
		//.attr("r", 1)
		.transition()
		.ease(d3.easeBounce)
		.duration(2000)
	

}

function update(step) {
	
	d3.select("#framework")
		.attr("width", figWidth + "px")
		.attr("height", figHeight + "px")


	if (step == 0) {
    	makeAxes(true, d3.extent(onlyitalian, d => d["Height (cm)"]), d3.extent(onlyitalian, d => d["Width (cm)"]));
		d3.selectAll("rect")
		.attr("height", 10)
		.attr("width", 10)
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
	else if (step == 1) {


	makeAxes(true, [0,50], [0,50]);
		d3.selectAll("rect")
		.attr("ry", 10)
		.attr("height", 10)
		.attr("width", 10)
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

	else  {
		makeAxes(false)
		var rects = d3.selectAll("rect");
	// for all the ones that didnt get any data, exit and remove them from the page

		rects
			// .transition()
			// .duration(2000)
			// .ease(d3.easeCubic)
			.attr('height', d => figHeight - yaxes(d.value))
			.attr('width', xaxes.bandwidth())
			.attr('rx',  0)
			.attr('ry', 0)
			.attr('y', d => yaxes(d.value))
			.attr("x", d => xaxes(d.key))

	}


}

function zoomIn(isTrue) {

if (isTrue) {
	makeAxes(true, [0,50], [0,50]);

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

} else {

	makeAxes(true, d3.extent(onlyitalian, d => d["Height (cm)"]), d3.extent(onlyitalian, d => d["Width (cm)"]));

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

}

function drawBarChart () {

	makeAxes(false);
	
	d3.select("#x-axis").transition()
		.duration(2000)
		.ease(d3.easeCubic)
		.attr("transform", "translate(0," + figHeight + ")").call(d3.axisBottom(xaxes)) 

	d3.select("#y-axis")
		.attr("transform", "translate(20, 0)").transition()
		.duration(2000)
		.ease(d3.easeCubic)
		.call(d3.axisLeft(yaxes))

	// grab all the rects and give them the new data
	var rects = d3.selectAll("rect");
	// for all the ones that didnt get any data, exit and remove them from the page

	var rectsAll = rects.data(topten);

		rectsAll
		.transition()
		.duration(2000)
		.ease(d3.easeCubic)
		.attr('height', d => figHeight - yaxes(d.value))
		.attr('width', xaxes.bandwidth())
		.attr('rx',  0)
		.attr('ry', 0)
		.attr('y', d => yaxes(d.value))
		.attr("x", d => xaxes(d.key))
	    
		//one thing we want to do to the rectangles which is remove the oens we dont want
	    rectsAll.exit().remove();
		
		//take the variable and do things to the rectangles 
	
		

		//in case your new dataset is bigger then your previous dataset and you need to add new elements 
		// rects.enter().append("rect")



}




function redrawScatter() {

	makeAxes(true, [0,50], [0,50])

	var rects = g.selectAll("rect");
	// for all the ones that didnt get any data, exit and remove them from the page

	
		rects.data(onlyitalian).enter().append("rect").merge(rects)
			.attr("width", 10)
		.attr("height", 10)

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
	
	
		//one thing we want to do to the rectangles which is remove the oens we dont want

		

}


// scrollama event handlers
function handleStepEnter(response) { 

	console.log(response.direction, response.index)

	window.addEventListener("resize", e => { 
		//we have to feed the already set dimentions from flex fox in the css into d3
	
		figWidth = d3.select("figure").node().getBoundingClientRect().width
		figHeight = d3.select("figure").node().getBoundingClientRect().height

		update(response.index);
		// console.log(d3.select("figure"))
	})

   
	steps.classed('is-active', function (d, i) {
				return i === response.index;
			})
	if (response.index == 0 && response.direction === "down") {
		setup(); 
		drawScatterplott();
	}  

	if (response.index == 0 && response.direction === "up") {
		zoomIn(false);
	}  

	

	if (response.index === 1 && response.direction === "up") {

		redrawScatter()
	}

	if (response.index == 1 && response.direction === "down") {
		zoomIn(true);
	}  

	if (response.index == 2) {

		drawBarChart();
	}  


 }



function handleContainerExit(response) { }
// kick-off code to run once on load


