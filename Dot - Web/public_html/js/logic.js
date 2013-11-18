/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define(['dotsCounter'], function(dotsCounter) {

    var ROOT_PARENT = -2;
    var logic = {};
    var dots = [[], []];
    var players = [{dotColor: "red", hoverColor: "rgba(255, 0, 0, 0.5)"},
        {dotColor: "blue", hoverColor: "rgba(0, 0, 255, 0.5)"}],
    currentPlayer = 0;
    var playersNumber = 2;
    var scores = [[], []];

    //------------------------------------
    //Variables for myself
    myDots = [[]];
    //------------------------------------


    var switchCurrentPlayer = function() {
        if (currentPlayer === 0) {
            currentPlayer = 1;
        } else {
            currentPlayer = 0;
        }
    };

    var searchForCycles = function(dots) {
        var tree = [];

        for (var i = 0; i < dots.length; i++) {
            tree[i] = -1;
        }

        var newCycles = [];

        var queue = (function() {

            var q = {};
            var array = [];
            var index = 0;

            q.isEmpty = function() {
                return (array.length - index) === 0;
            };

            q.add = function(u) {
                array[array.length] = u;
            };

            q.front = function() {
                return array[index];
            };

            q.pop = function() {
                index++;
            };

            return q;

        })();

        var findPath = function(u) {
            var path = [];

            while (u !== ROOT_PARENT) {
                path[path.length] = u;
                u = tree[u];
            }

            return path;
        };

        var findCycle = function(u, v) {

            var path1 = findPath(u);
            var path2 = findPath(v);

            while (path1[path1.length - 2] === path2[path2.length - 2]) {
                path1 = path1.splice(0, path1.length - 1);
                path2 = path2.splice(0, path2.length - 1);
            }

            cycle = path1;
            for (var i = path2.length - 2; i >= 0; i--) {
                cycle[cycle.length] = path2[i];
            }

            return cycle;
        };

        var getAdjacentDots = function(dot)
        {
            var adjacentDots = [];

            for (var i = 0; i < dots.length; i++) {

                if (dot.x === dots[i].x && dot.y === dots[i].y)
                    continue;

                if (Math.abs(dot.x - dots[i].x) < 2
                        && Math.abs(dot.y - dots[i].y) < 2) {
                    adjacentDots[adjacentDots.length] = i;
                }
            }
            return adjacentDots;
        };

        var bfs = function(root) {

            queue.add(root);
            tree[root] = ROOT_PARENT;

            while (!queue.isEmpty()) {

                var u = queue.front();
                queue.pop();

                var adjacentDots = getAdjacentDots(dots[u]);

                for (var i = 0; i < adjacentDots.length; i++) {

                    var v = adjacentDots[i];

                    if (tree[v] === -1) {
                        // Dedam į eilę
                        queue.add(v);
                        tree[v] = u;
                    } else if (tree[u] !== v) {

                        // Radom ciklą
                        var cycle = findCycle(u, v);
                        if (cycle.length > 3) {
                            newCycles[newCycles.length] = cycle;
                        }
                    }
                }

            }
//            var compareEdge = function(a, b, c, d){
//                if(a === c && b === d){
//                    return true;
//                }
//                if(a === d && b === c){
//                    return true;
//                }
//                return false;
//            };
//
//            var isCycleInCycle = function(c1, c2){
//                for(var i = 0; i < c1.length; i++){
//                    for(var j = 0; j < c2.length; j = j + 2){
//                        if(compareEdge(c1[i], c1[i+1], c2[j], c2[j+1])){
//                            
//                        }
//                    }
//                }
//            };

        };

        bfs(dots.length - 1);

        return newCycles;
    };

    //Return concrete player dots
    var getPlayerDots = function(playerInd) {
        var array = [];
        for (var i = playerInd; i < dots.length; i = i + playersNumber) {
            array[array.length] = dots[i];
        }
        return array;
    };

//    //Return all dots which do not belong to specified player
//    var getWhichDoNotBelongTo= function(playerInd){
//        var array = [];
//        for(var i = playerInd; i < dots.length; i = i + playersNumber){
//            if(i % )
//        }
//        return array;
//    };

    logic.initialise = function() {

//        gui.initialize({
//            onClick: function (x, y){
//                logic.placeDot(x, y);
//                gui.refresh(dots);
//            }
//        });

    };

    logic.placeDot = function(x, y) {
        var dotAlreadyExists = function(x, y) {
            for (var j = 0; j < dots.length; j++) {
                for (var i = 0; i < dots[j].length; i++) {
                    if (dots[j][i].x === x && dots[j][i].y === y)
                        return true;
                }
            }
            return false;

        };

        if (dotAlreadyExists(x, y)) {
            return {success: false};
        }

        dots[currentPlayer].push({x: x, y: y, counted: false});
        
        //Returns cycles when cyclesIndexes are given
        var cyclesIndexesToCycle = function(cyclesIndexes) {
            var cycles = [];
            for (var j = 0; j < cyclesIndexes.length; j++) {
                var cycle = [];
                for (var i = 0; i < cyclesIndexes[j].length; i++) {
                    var ind = cyclesIndexes[j][i];
                    cycle.push(dots[currentPlayer][ind]);
                }
                cycles.push(cycle);
            }
            return cycles;
        };

        var getAllNotCurrentPlayerDots = function() {
            if (currentPlayer === 0)
                return dots[1];
            return dots[0];
        };
        
        //Iterate throught cycles and count how many oponent dots are in them
        var countScores = function(cycles) {
            var score = 0;
            var pdots = getAllNotCurrentPlayerDots();
            for (var i = 0; i < cycles.length; i++) {
                score += dotsCounter.count(cycles[i], pdots);
            }
            return score;
        };
        var newCyclesIndexes = searchForCycles(dots[currentPlayer]);
        console.log(newCyclesIndexes);
        var newCycles = cyclesIndexesToCycle(newCyclesIndexes);
        
        console.log(countScores(newCycles));
        scores[currentPlayer] += countScores(newCycles);
        
        switchCurrentPlayer();

        return {success: true, cycles: newCycles};

        // On success should return array of dots path
        // and count score
        // else - false


    };

    logic.getScores = function() {
        // retuns array of players score
        return scores;
    };

    logic.getDots = function() {
        return dots;
    };

    logic.getCurrentPlayer = function() {
        return players[currentPlayer];
    };

    return logic;
});
