
        var margin = {top: 20, right: 120, bottom: 20, left: 120},
            width = 960,
            height = 700 - margin.top - margin.bottom;

        var tree = d3.layout.tree()
        .size([height, width - 160]);

        var diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.y, d.x];
        });

        var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(70,0)");

        d3.json("soccer.json", function(error, root) {
            if (error) throw error;
            
            nodes = tree.nodes(root),
                links = tree.links(nodes);

//            data.forEach(function(d) {
//                var home = d.team1;
//                var away = d.team2;
//                var homeScore = d.t1Score;
//                var awayScore = d.t2Score;
//                var homeResult = d.t1Result;
//                var awayResult = d.t2Result;
//                var location = d.location;
//                var date = d.date;
//                var round = d.round;
//            });
        
            var link = svg.selectAll(".link")
            .data(links)
            .enter()
            .append("g")
            .attr("class", "link");

            link.append("path")
                .attr("fill", "none")
                .attr("stroke", "blue")
                .attr("stroke-width", "1.5px")
                .attr("d", diagonal);

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

            var node = svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

            node.append("circle")
                .attr("r", 4.5);
            
            node.append("text")
                .attr("dx", function (d) {
                return d.children ? -8 : 8;
            })
                .attr("dy", "1.5em")
                .style("text-anchor", "middle")
                .text(function (d) {
                return d.team1 + " vs " + d.team2;
            });
        });

//        var data = updateData(function() {
//        
//            d3.json("soccer.json", function(error, root) {
//                if (error) throw error;
//            
//                home = d.team1;
//                away = d.team2;
//                homeScore = d.t1Score;
//                awayScore = d.t2Score;
//                homeResult = d.t1Result;
//                awayResult = d.t2Result;
//                location = d.location;
//                date = d.date;
//                round = d.round;
//            
//                
//            }); 
//        
//        });     
//    
//        var results = matchResults(function() {
//            updateData();
//        }); 
        