/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define(function(){
    
    var ROOT_PARENT = -2;
    var logic = {};
    var dots = [];
    var players = [ { dotColor: "red", hoverColor: "rgba(255, 0, 0, 0.5)" },
                    { dotColor: "blue", hoverColor: "rgba(0, 0, 255, 0.5)" } ],
        currentPlayer = 0;
    
    var scores = [];
    
    var switchCurrentPlayer = function(){
        if (currentPlayer === 0){
            currentPlayer = 1;
        } else {
            currentPlayer = 0;
        }
    };
    
    var searchForCycles = function(){
        
//        var vertexes = [ [ 1, 2, 3], [ 0, 6 ], [ 0, 3, 4 ], [ 0, 2 ], [ 2, 5 ], [ 4, 6 ], [ 5, 1 ] ];
        
        var tree = [];
        
        for(var i = 0; i < dots.length; i++){
            tree[i] = -1;
        }
        
        var newCycles = [];
        
        var queue = (function(){
            
            var q = {};
            var array = [];
            var index = 0;
            
            q.isEmpty = function (){
                return (array.length - index) === 0;
            };
            
            q.add = function (u) {
                array[array.length] = u;
            };
            
            q.front = function () {
                return array[index];
            };
            
            q.pop = function () {
                index++;
            };
            
            return q;
            
        })();
        
        var findPath = function(u){
            var path = [];
            
            while (u !== ROOT_PARENT){
                path[path.length] = u;
                u = tree[u];
            }
            
            return path;
        };
        
        var findCycle = function(u, v){
            
            var path1 = findPath(u);
            var path2 = findPath(v);
            
            while (path1[path1.length - 2] === path2[path2.length - 2]){
                path1 = path1.splice(0, path1.length - 1);
                path2 = path2.splice(0, path2.length - 1);
            }

            cycle = path1;
            for (var i = path2.length - 2; i >= 0 ; i--){
                cycle[cycle.length] = path2[i];
            }
            
            return cycle;
        };
        
        var getAdjacentDots = function(dot)
        {
            var adjacentDots = [];
            
            for (var i = 0; i < dots.length; i++){
                
                if (dot.x === dots[i].x && dot.y === dots[i].y)
                    continue;
                
                if (Math.abs(dot.x - dots[i].x) < 2
                    && Math.abs(dot.y - dots[i].y) < 2){
                    adjacentDots[adjacentDots.length] = i;
                }
            }
            return adjacentDots;
        };
        
        var bfs = function(root){
            
            queue.add(root);
            tree[root] = ROOT_PARENT;
            
            while (!queue.isEmpty()){
                
                var u = queue.front();
                queue.pop();
                
                var adjacentDots = getAdjacentDots(dots[u]);
                
                for (var i = 0; i < adjacentDots.length; i++){
                    
                    var v = adjacentDots[i];
                    
                    if (tree[v] === -1){
                        // Dedam į eilę
                        queue.add(v);
                        tree[v] = u;
                    } else if (tree[u] !== v){
                        
                        // Radom ciklą
                        var cycle = findCycle(u, v);
                        if(cycle.length > 3){
                            newCycles[newCycles.length] = cycle;
                            console.log(cycle);
                        }
                    }
                }
                
            }
            
        };
        
        bfs(dots.length - 1);
        
        return newCycles;
    };
   
    logic.initialise = function(){
                
//        gui.initialize({
//            onClick: function (x, y){
//                logic.placeDot(x, y);
//                gui.refresh(dots);
//            }
//        });

    };

    logic.placeDot = function(x, y){
        
        
        
        var dotAlreadyExists = function(x, y){
            
            for (var i = 0; i < dots.length; i++){
                if (dots[i].x === x && dots[i].y === y)
                    return true;
            }
            
            return false;
            
        };
        
        if (dotAlreadyExists(x, y)){
            return { success: false };
        }
        
        dots[dots.length] = { x: x, y: y };
        
        var newCycles = searchForCycles();
        countScores(); 
        switchCurrentPlayer();       
        return { success: true, cycles: newCycles };
        
        // On success should return array of dots path
        // and count score
        // else - false

        
    };
     countScores = function(){
        var positionCode = function(dot1, dot2) {
            //If upper left corner 
            if ((dot1.x - 1 === dot2.x) && (dot1.y - 1 === dot2.y)) {
                return 1;
            }
            //If dot2 is above dot1
            if ((dot1.x === dot2.x) && (dot1.y - 1 === dot2.y)) {
                return 2;
            }
            //If dot2 is upper right corner
            if ((dot1.x + 1 === dot2.x) && (dot1.y - 1 === dot2.y)) {
                return 3;
            }
            //If dot2 is in the left of dot1
            if ((dot1.x - 1 === dot2.x) && (dot1.y === dot2.y)) {
                return 4;
            }
            //If dot2 is in the right of dot1
            if ((dot1.x + 1 === dot2.x) && (dot1.y === dot2.y)) {
                return 5;
            }
            //If dot2 is in lower left corner of dot1
            if ((dot1.x - 1 === dot2.x) && (dot1.y + 1 === dot2.y)) {
                return 6;
            }
            //If dot2 is above dot1
            if ((dot1.x === dot2.x) && (dot1.y + 1 === dot2.y)) {
                return 7;
            }
            //If dot2 is in the right corner of of dot1
            if ((dot1.x + 1 === dot2.x) && (dot1.y + 1 === dot2.y)) {
                return 8;
            }
        };
        var leaveJustCorners = function(cycle) {
            cycle[cycle.length] = cycle[0];
            cycle[cycle.length] = cycle[1];
            var corners = [];
            for (var i = 0; i < cycle.length - 2; i++) {
                var b = positionCode(cycle[i], cycle[i + 1]) !== positionCode(cycle[i + 1], cycle[i + 2]);
                if (positionCode(cycle[i], cycle[i + 1]) !== positionCode(cycle[i + 1], cycle[i + 2])) {
                    corners[corners.length] = cycle[i + 1];
                }
            }
            cycle.splice(cycle.length - 1, 1);
            cycle.splice(cycle.length - 1, 1);
            return corners;
        };

        var cycle = [{x: 0, y: 0},
            {x: 1, y: 0},
            {x: 2, y: 0},
            {x: 3, y: 0},
            {x: 4, y: 0},
            {x: 5, y: 0},
            {x: 5, y: 1},
            {x: 5, y: 2},
            {x: 5, y: 3},
            {x: 5, y: 4},
            {x: 5, y: 5},
            {x: 4, y: 5},
            {x: 3, y: 5},
            {x: 2, y: 5},
            {x: 1, y: 5},
            {x: 0, y: 5},
            {x: 0, y: 4},
            {x: 0, y: 3},
            {x: 0, y: 2},
            {x: 0, y: 1}];
        var test = [
            {x: 1, y: 1},
            {x: 1, y: 2},
            {x: 7, y: 7},
            {x: 3, y: 3},
            {x: -1, y: 2},
            {x: 4, y: 4}
        ];
        
        var corners = leaveJustCorners(cycle);
        var polyX = [];
        var polyY = [];
        for (var i = 0; i < corners.length; i++) {
            polyX[polyX.length] = corners[i].x;
            polyY[polyY.length] = corners[i].y;
        }
        polySides = corners.length;

        var pointInPolygon = function(x, y) {
            var i, j = polySides - 1;
            var oddNodes = false;

            for (i = 0; i < polySides; i++) {
                if (polyY[i] < y && polyY[j] >= y
                        || polyY[j] < y && polyY[i] >= y) {
                    if (polyX[i] + (y - polyY[i]) / (polyY[j] - polyY[i]) * (polyX[j] - polyX[i]) < x) {
                        oddNodes = !oddNodes;
                    }
                }
                j = i;
            }

            return oddNodes;
        };
        var countDotsInPolygon = function(polygon, dots){
            var counted = 0;
            for(var i = 0; i < dots.length; i++){
                if(pointInPolygon(dots[i].x, dots[i].y)){
                    counted++;
                }
            }
            return counted;
        }
        console.log(countDotsInPolygon(cycle, test));
    }
    logic.getScores = function () {
        // retuns array of players score
        return scores;
    };
    
    logic.getDots = function(){
        return dots;
    };
    
    logic.getCurrentPlayer = function(){
        return players[currentPlayer];
    };
    
    return logic;
    
});
