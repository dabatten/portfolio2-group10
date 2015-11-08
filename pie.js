var dataset;
var height = 500;
var width = 1000;

var outerRadius = height / 2;
var innerRadius = height / 3;

var pie = d3.layout.pie()
    .value(function (d) {
        return d.numStudents
    });

//define color scale
var color = d3.scale.category20();

d3.csv("enrollment_stats.csv", function (data) {

    //format data as pie layout
    dataset = (pie(data));
    console.log(dataset);
    generateChart();
    console.log(color.domain());
});

function generateChart() {

    //create svg canvas for chart
    svg = d3.select("#chart")
        .append("svg")
        .attr("height", height)
        .attr("width", width);


    //draw arc paths
    arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    //set up arc groups
    var arcs = svg.selectAll("g.arc")
        .data(dataset)
        .enter()
        .append("g") //new group
        .attr("class", "arc")
        .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")"); //translate group to right place

    //draw arc paths
    var paths = arcs.append("path")
        .attr("fill", function (d, i) {
            return color(d.data.major);
        })
        .attr("d", arc); //define description for each path

    //add text labels
    arcs.append("text")
        .attr("transform", function (d) {
            return "translate(" + arc.centroid(d) + ")"; //place text in centroid of arc
        })
        .attr("text-anchor", "middle")
        .text(function (d) {
            return d.value; //make text label the number of students
        })
        .attr("fill", "white");
    
    buildLegend();
    
    addTooltips();


}

function buildLegend() {
    var legendRectSize = 18;
    var legendSpacing = 4;

    var legend = svg.selectAll("g.legend")
        .data(color.domain())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            var h = legendRectSize + legendSpacing;
            var offset = h * color.domain().length / 2;
            var horz = legendRectSize + 500;
            var vert = i * h + height / 4;
            return "translate(" + horz + "," + vert + ")";
        });


    //add colored square
    legend.append("rect")
        .attr("width", legendRectSize)
        .attr("height", legendRectSize)
        .style("fill", color)
        .style("stroke", color);
        //onclick handler for enabling/disabling major
   
    //add legend text
    legend.append('text')
        .attr("x", legendRectSize + legendSpacing)
        .attr("y", legendRectSize - legendSpacing)
        .text(function (d) {
            return d;
        });


}



function addTooltips() {
    var tooltip = d3.select("#chart")
        .append("div")
        .attr("class", "tooltip");

    tooltip.append("div")
        .attr("class", "label");

    tooltip.append("div")
        .attr("class", "percent");

    var paths = svg.selectAll("path");

    paths.on('mouseover', function (d) {
        
        var pathSel = d3.select(this);
        
        //darken all other colors
        paths.attr("fill", function (d, i) {
            var rgb = d3.rgb(color(d.data.major));
            return rgb.darker(2.5);
        })
        
        //keep color of selected
        pathSel.attr("fill", function (d, i) {
            return color(d.data.major);
        })
        
        //sum up the number of students
        var total = d3.sum(dataset.map(function (d) {
            return d.data.numStudents;
        }));
        //calculate the percentage
        var percent = Math.round(1000 * d.data.numStudents / total) / 10;
        //fill the tooltip
        tooltip.select('.label').html(d.data.major);
        tooltip.select('.percent').html(percent + '%');
        tooltip.style('display', 'block');
    });

    paths.on('mousemove', function (d) {
        tooltip.style('top', (d3.event.pageY - 40) + 'px')
            .style('left', (d3.event.pageX - 10) + 'px');
    });

    paths.on('mouseout', function () {
        tooltip.style('display', 'none');
        
        //reset colors
        paths.attr("fill", function (d, i) {
            return color(d.data.major);
        })
    });

}