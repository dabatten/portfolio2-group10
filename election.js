var width = 960;
var height = 500;

var projection = d3.geo.albersUsa()
    .translate([width / 2, height / 2])
    .scale([1000]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#map1").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g")
    //.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .append("g")
    .attr("id", "states");

var data = {};

d3.csv("2012pres.csv", function (csv_data) {
    console.log(data);
    data = csv_data;
    generateMap();
});


function generateMap() {
    d3.json("us-states.json", function (json) {

        //merge csv data with geo json
        for (var i = 0; i < data.length; i++) {
            //store csv data values
            var dataState = data[i].state;
            var dataParty = data[i].party;
            var dataElectorate = data[i].electorate;

            //for each state, store csv data in json.properties
            for (var j = 0; j < json.features.length; j++) {
                var jsonState = json.features[j].properties.name;
                if (dataState == jsonState) {
                    json.features[j].properties.electorate = dataElectorate;
                    json.features[j].properties.party = dataParty;
                    break;
                }
            }
        }

        console.log(json);

        g.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "state")
            .style("stroke", "white")
            .style("stroke-width", "0.5")
            .style("fill", function (d) {
                var party = d.properties.party;
                if (party == 'R') return 'crimson';
                else if (party == 'D') return 'darkblue';
                else return 'green';
            });


        g.selectAll("text")
            .data(json.features)
            .enter()
            .append("svg:text")
            .text(function (d) {
                return d.properties.electorate;
            })
            .attr("x", function (d) {
                return path.centroid(d)[0];
            })
            .attr("y", function (d) {
                return path.centroid(d)[1];
            })
            .attr("text-anchor", "middle")
            .attr('font-size', '6pt')
            .attr('fill', 'white');


    });
}
