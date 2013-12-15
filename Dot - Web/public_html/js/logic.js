/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define(['dotsCounter', 'mapper'], function(dotsCounter, mapper) {

    var ROOT_PARENT = -2;
    var INFINITY = 9999;
    var logic = {};
    var dots = [[], []];
    var players = [{dotColor: "red", hoverColor: "rgba(255, 0, 0, 0.5)"},
        {dotColor: "blue", hoverColor: "rgba(0, 0, 255, 0.5)"}],
    currentPlayer = 0;
    var playersNumber = 2;
    var scores = [0, 0];

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
        
        var removeRedundantVertices = function(cycle){
            
            cycle.push(cycle[0]);
            cycle.unshift(cycle[cycle.length - 2]);
            
            for (var i = 0; i < cycle.length - 2; i++){
                var dot1 = dots[cycle[i]];
                var dot3 = dots[cycle[i + 2]];
                if (Math.abs(dot1.x - dot3.x) < 2
                    && Math.abs(dot1.y - dot3.y) < 2){
                    cycle.splice(i + 1, 1);
                    i--;
                }
            }
            
            cycle.splice(0, 1);
            cycle.splice(cycle.length - 1, 1);
            
            return cycle;
        };
        
        var getUnique = function(cycle){
            var min = { v: INFINITY, i: -1 };
            for (var i = 0; i < cycle.length; i++){
                if (cycle[i] < min.v){
                    min.v = cycle[i];
                    min.i = i;
                }
            }
            
            var unique = [];
            for (var i = min.i; i < cycle.length; i++){
                unique[unique.length] = cycle[i];
            }
            for (var i = 0; i < min.i; i++){
                unique[unique.length] = cycle[i];
            }
            
            return unique;
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
            
            cycle = removeRedundantVertices(cycle);

            return getUnique(cycle);
        };

        var getAdjacentDots = function(dot)
        {
            var adjacentDots = [];

            for (var i = 0; i < dots.length; i++) {

                if (dot.x === dots[i].x && dot.y === dots[i].y)
                    continue;

                if (!dots[i].counted &&
                    Math.abs(dot.x - dots[i].x) < 2
                    && Math.abs(dot.y - dots[i].y) < 2) {
                    adjacentDots[adjacentDots.length] = i;
                }
            }
            return adjacentDots;
        };

        var compareEdge = function(a, b, c, d) {
            if (a === c && b === d) {
                return true;
            }
            if (a === d && b === c) {
                return true;
            }
            return false;
        };

        var haveCommonEdge = function(c1, c2) {
            for (var i = 0; i < c1.length - 1; i++) {
                for (var j = 0; j < c2.length - 1; j++) {
                    if (compareEdge(c1[i], c1[i + 1], c2[j], c2[j + 1])) {
                        return true;
                    }
                }
            }
            return false;
        };

        //c - given cycle
        //Return index of cycle which have common edge with given cycle
        var alreadyIs = function(c) {
            for (var i = 0; i < newCycles.length; i++) {
                if (haveCommonEdge(newCycles[i], c)) {
                    return i;
                }
            }
            return -1;
        };
        
        var areCyclesEqual = function(c1, c2)
        {
            if (c1.length !== c2.length){
                return false;
            }
            
            for (var i = 0; i < c1.length; i++){
                if (c1[i] !== c2[i]){
                    return false;
                }
            }
            
            return true;
        };
        
        var alreadyFound = function (cycle) {
            for (var i = 0; i < newCycles.length; i++) {
                if (areCyclesEqual(newCycles[i], cycle)) {
                    return true;
                }
            }
            return false;
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
//                            var ind = alreadyIs(cycle);
//                            if (ind >= 0) {
//                                if (newCycles[ind].length >= cycle.length) {
//                                    newCycles[ind] = cycle;
//                                }
//                            } else {
//                                newCycles[newCycles.length] = cycle;
//                            }
                              if (!alreadyFound(cycle)){
                                  newCycles[newCycles.length] = cycle;
                              }
                        }
                    }
                }

            }
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
        
        dotsCounter.test();

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
        var newCycles = cyclesIndexesToCycle(newCyclesIndexes);
        var countedScores = countScores(newCycles);
        scores[currentPlayer] += countedScores;
        var oldPlayer = currentPlayer;
        
        switchCurrentPlayer();

        return { success: true, cycles: mapper.cyclesToGui(newCyclesIndexes, oldPlayer), scores: scores };

        // On success should return array of dots path
        // and count score
        // else - false


    };

    logic.getScores = function() {
        // retuns array of players score
        return scores;
    };

    logic.getDots = function() {
        return mapper.dotsToGui(dots);
    };

    logic.getCurrentPlayer = function() {
        return players[currentPlayer];
    };

    return logic;
});
