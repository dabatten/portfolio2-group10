var width = 600;
var height = 400;
var margin = {
    top: 30,
    right:25,
    bottom: 125,
    left:25
};


//set scales
var xScale = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.05);
var yScale = d3.scale.linear()
    .rangeRound([height - margin.top, 0]);

//var color = d3.scale.ordinal().range(["lightblue", "lightpink"]);
var color = d3.scale.ordinal()
    .range(["violet", "royalblue"]);

var svg = d3.select("body").selectAll("div")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.bottom + margin.top);

var dataset = null;

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

d3.csv("gender_stats.csv", function (data) {

    //assign a color to each gender
    color.domain(d3.keys(data[0]).filter(function (key) {
        return key !== 'major';
    }));

    data.forEach(function (d) {
        var y0 = 0;
        d.genders = color.domain().map(function (gender) {
            return {
                gender: gender,
                y0: y0,
                y1: y0 += +d[gender]
            };
        });
        d.total = d.genders[d.genders.length - 1].y1;
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

    var major = svg.selectAll("g.major")
        .data(dataset)
        .enter()
        .append("g")
        .attr("class", "major")
        .attr("transform", function (d) {
            return "translate(" + xScale(d.major) + ",0)";
        });

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
    
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-10px")
        .attr("dy", "-5px")
        .attr("transform", "rotate(-90)");

}

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

    majors.data(dataset)
        .transition()
        .duration(duration);

    majors.selectAll("rect")
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
    
    xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");
    
    svg.selectAll("g.x-axis")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-10px")
        .attr("dy", "-5px")
        .attr("transform", "rotate(-90)");
    
}