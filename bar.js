var width = 600;
var height = 250;

var dataset;

//generate random dataset
function randomizeData() {
    dataset = [];
    for (var i = 0; i < 25; i++) {
        var newNum = Math.floor(Math.random() * 180) + 20;
        dataset.push(newNum);
    }
};
randomizeData();

//set scales
var xScale = d3.scale.ordinal()
    .domain(d3.range(dataset.length))
    .rangeRoundBands([0, width], 0.05); //evenly divide bands along width with 5% spacing

var yScale = d3.scale.linear()
    .domain([0, 200])
    .range([0, height]);

//create svg canvas to draw on
var svg = d3.select("body").select("div")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

//draw bars
svg.selectAll("rect")
    .data(dataset) //bind objects to dataset
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
        return xScale(i); //finds x value for index using d3 scale
    })
    .attr("y", function (d) {
        return height - yScale(d);
    })
    .attr("width", xScale.rangeBand()) //calculates width of each bar
    .attr("height", function (d) {
        return yScale(d);
    })
    .attr("fill", function (d) {
        var color = "rgb(0," + (d % 255) + ",0)"; //fill green value proportional to data value
        return color;
    });

//add labels containing data value
svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function (d) {
        return d;
    })
    .attr("x", function (d, i) {
        return xScale(i) + xScale.rangeBand() / 2; //center data in each bar
    })
    .attr("y", function (d) {
        return height - yScale(d) + 15; //place data 15 pixels lower than bar height
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");

//add event listener to randomize button
d3.select("#random")
    .on("click", function () {
        //generate new random dataset
        randomizeData();
    
        updateGraph(0, 0);
    
    });

//add event listener to slow button
d3.select("#transition")
    .on("click", function () {
        //generate new random dataset
        randomizeData();
        updateGraph(1000,0); //1000ms transtion, 0ms delay

    });

//add event listener to slow button
d3.select("#slow")
    .on("click", function () {
        //generate new random dataset
        randomizeData();
        //redraw graph
        updateGraph(3000, 750); //3000 ms transition, 750ms delay
    });

//add event listener to stagger button
d3.select("#stagger")
    .on("click", function () {
        //generate new random dataset
        randomizeData();
        
        
        var stagger = function(d,i){
            return i * 100; //stagger each bar by 100ms  
        }
        
        updateGraph(500, stagger); //staggered and 500ms transition per bar 
    });



//update graph using given duration, stagger delay
function updateGraph(duration, delay) {
    //redraw rectangles
    svg.selectAll("rect")
        .data(dataset)
        .transition() //animate data changes
        .delay(delay)
        .duration(duration)
        .attr("y", function (d) {
            return height - yScale(d);
        })
        .attr("height", function (d) {
            return yScale(d);
        })
        .attr("fill", function (d) {
            var color = "rgb(0," + (d % 255) + ",0)";
            console.log(color);
            return color;
        });

    //redraw text
    svg.selectAll("text")
        .data(dataset)
        .transition()
        .delay(delay)
        .duration(duration)
        .text(function (d) {
            return d;
        })
        .attr("x", function (d, i) {
            return xScale(i) + xScale.rangeBand() / 2;
        })
        .attr("y", function (d) {
            return height - yScale(d) + 15;
        });
}