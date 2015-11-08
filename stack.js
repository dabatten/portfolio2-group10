var width = 600;
var height = 400;
var margin = {
    top: 30,
    right: 25,
    bottom: 80,
    left: 50
};


//set scales
var xScale = d3.scale.ordinal()
    .rangeRoundBands([margin.left, width], 0.05);
var yScale = d3.scale.linear()
    .rangeRound([height - margin.top, 0]);
var color = d3.scale.ordinal()
    .range(["violet", "royalblue"]);

//create svg
var svg = d3.select("body").selectAll("div")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.bottom + margin.top);

var dataset = null;

//define axes
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

//import CSV and build dataset
d3.csv("gender_stats.csv", function (data) {

    //assign a color to each gender
    color.domain(d3.keys(data[0]).filter(function (key) {
        return key !== 'major';
    }));

    //build data
    data.forEach(function (d) {
        var y0 = 0;
        d.genders = color.domain().map(function (gender) { //add a gender object to each data point
            return {
                gender: gender,
                y0: y0, //initial y
                y1: y0 += +d[gender] //height
            };
        });
        d.total = d.genders[d.genders.length - 1].y1; //total height
    });

    //sort descending by total enrollment
    data.sort(function (a, b) {
        return b.total - a.total;
    });

    //set x domain based on majors
    xScale.domain(data.map(function (d) {
        return d.major;
    }));
    //set y domain on max value in data
    yScale.domain([0, d3.max(data, function (d) {
        return d.total;
    })]);

    dataset = data;

    console.log(dataset);

    generateGraph();

});


function generateGraph() {

    //major groups
    var major = svg.selectAll("g.major")
        .data(dataset)
        .enter()
        .append("g")
        .attr("class", "major")
        .attr("transform", function (d) {
            return "translate(" + xScale(d.major) + ",0)";
        });

    //rectangles
    major.selectAll("rect")
        .data(function (d) {
            return d.genders;
        })
        .enter()
        .append("rect")
        .attr("width", xScale.rangeBand())
        .attr("y", function (d) {
            return yScale(d.y1);
        })
        .attr("height", function (d) {
            return yScale(d.y0) - yScale(d.y1);
        })
        .attr("fill", function (d) {
            return color(d.gender)
        });

    //x-axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0, " + (height - 25) + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-10px")
        .attr("dy", "-5px")
        .attr("transform", "rotate(-90)");

    //y-axis
    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis);

}

//functions for sorting dataset and then updating graph

function sortFemalePercent() {
    dataset.sort(function (a, b) {
        return (+b.female / b.total) - +(a.female / a.total);
    });

    console.log(dataset);
    updateGraph(1500);
}

function sortMalePercent() {
    dataset.sort(function (a, b) {
        return (+b.male / b.total) - +(a.male / a.total);
    });

    console.log(dataset);
    updateGraph(1500);
}

function sortMale() {
    dataset.sort(function (a, b) {
        return +b.male - +a.male;
    });

    console.log(dataset);
    updateGraph(1500);
}

function sortFemale() {
    dataset.sort(function (a, b) {
        return +b.female - +a.female;
    });

    console.log(dataset);
    updateGraph(1500);
}

//function for updating a graph given a transtion duration

function updateGraph(duration) {

    //set x domain based on majors
    xScale.domain(dataset.map(function (d) {
        return d.major;
    }));
    //set y domain on max value in data
    yScale.domain([0, d3.max(dataset, function (d) {
        return d.total;
    })]);

    var majors = svg.selectAll(".major");
    //perform changes
    
    majors.data(dataset); //rebind data

    majors.selectAll("rect") //redraw rectangles
        .data(function (d) {
            return d.genders;
        })
        .transition()
        .duration(duration)
        .attr("width", xScale.rangeBand())
        .attr("y", function (d) {
            return yScale(d.y1);
        })
        .attr("height", function (d) {
            return yScale(d.y0) - yScale(d.y1);
        })
        .attr("fill", function (d) {
            return color(d.gender)
        });

    //relabel x-axis
    svg.selectAll("g.x-axis")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-10px")
        .attr("dy", "-5px")
        .attr("transform", "rotate(-90)");

}