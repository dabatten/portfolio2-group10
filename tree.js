
        var margin = {top: 20, right: 120, bottom: 20, left: 120},
            width = 700,
            height = 500 - margin.top - margin.bottom;

        var tree = d3.layout.tree()
        .size([height, width - 160]);

        var diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.y, d.x];
        });

        var svg = d3.select("#bracket").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(70,0)");

        //choosing json data
        d3.json("soccer.json", function(error, root) {
            if (error) throw error;
            
            //setting tree root, and binding data to each node
            nodes = tree.nodes(root),
                links = tree.links(nodes);
        
            //setting paths between nodes
            var link = svg.selectAll(".link")
            .data(links)
            .enter()
            .append("g")
            .attr("class", "link");

            //colloring each path blue
            link.append("path")
                .attr("fill", "none")
                .attr("stroke", "blue")
                .attr("stroke-width", "1.5px")
                .attr("d", diagonal);

            //adding text to each node
            link.append("text")
                .attr("font-family", "Arial, Helvetica, sans-serif")
                .attr("fill", "Black")
                .style("font", "normal 12px Arial")
                .attr("transform", function(d) {
                return "translate(" +
                    ((d.source.y + d.target.y)/2) + "," + 
                    ((d.source.x + d.target.x)/2) + ")";
            })  
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .text(function(d) {
                console.log(d.target.rule);
                return d.target.rule;
            });

            //set node locaton
            var node = svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

            //set node shape
            node.append("circle")
                .attr("r", 4.5);
            
            //modifiying the text location to center the text in the middle of node
            //and underneath
            node.append("text")
                .attr("dx", function (d) {
                return d.children ? -8 : 8;
            })
                .attr("dy", "1.5em")
                .style("text-anchor", "middle")
                .text(function (d) {
                return d.team1 + " vs " + d.team2;
            });
            
            //click listener
            node.on("click", function(d){
                    update(d);
            });
        });

    
        //update function
        var update = function(d) {
              
            console.log(d);  

            //set variable values
            var home = d.team1;
            var away = d.team2;
            var homeScore = d.t1Score;
            var awayScore = d.t2Score;
            var homeResult = d.t1Result;
            var awayResult = d.t2Result;
            var location = d.location;
            var date = d.date;
            var round = d.round;
            
            //apend the values to the Results div
            var results = d3.select("#results").html("");
            results.append("p").text("Home Team: " + home);
            results.append("p").text("Away Team: " + away);
            results.append("p").text("Home Score: " + homeScore);
            results.append("p").text("Away Score: " + awayScore);
            results.append("p").text("Home Result: " + homeResult);
            results.append("p").text("Away Result: " + awayResult);
            results.append("p").text("Location: " + location);
            results.append("p").text("Round: " + round);

        };     
