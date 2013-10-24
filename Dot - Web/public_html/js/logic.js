/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define(function(){
    
    var logic = {};
    var dots = [];
    var players = [ { dotColor: "red", hoverColor: "rgba(255, 0, 0, 0.5)" },
                    { dotColor: "blue", hoverColor: "rgba(0, 0, 255, 0.5)" } ],
        currentPlayer = 0;
    
    
    var graph = {};
    graph.vertexs = [];
    
    graph.vertexs[graph.vertexs.length] = {x: 1, y: 1};
    graph.vertexs[graph.vertexs.length] = {x: 0, y: 0};
    graph.vertexs[graph.vertexs.length] = {x: 0, y: 0};
    graph.vertexs[graph.vertexs.length] = {x: 0, y: 0};
    graph.vertexs[graph.vertexs.length] = {x: 0, y: 0};
    
    console.log(graph.vertexs);
   
    logic.initialise = function(){
        
        var vertexes = [ [ 1, 2, 3], [ 0, 6 ], [ 0, 3, 4 ], [ 0, 2 ], [ 2, 5 ], [ 4, 6 ], [ 5, 1 ] ];
        var tree = [ -1, -1, -1, -1, -1, -1, -1 ];
    
        var queue = (function(){
            
            var q = {};
            var array = [];
            var index = 0;
            
            q.isEmpty = function (){
                return (array.lenght - index) === 0;
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
            
            while (u !== 0){
                path[path.length] = u;
                u = tree[u];
            }
            
            path[path.length] = 0;
            
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
        
        var bfs = function(){
            
            queue.add(0);
            tree[0] = 0;
            
            while (!queue.isEmpty()){
                var u = queue.front();
                queue.pop();
                
                for (var i = 0; i < vertexes[u].length; i++){
                    
                    var v = vertexes[u][i];
                    
                    if (tree[v] === -1){
                        // Dedam į eilę
                        queue.add(v);
                        tree[v] = u;
                    } else if (tree[u] !== v){
                        // Radom ciklą
                        var cycle = findCycle(u, v);
                        console.log(cycle);
                    }
                }
            }
            
        };
        
        // bfs();
        
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
        
        if (currentPlayer === 0){
            currentPlayer = 1;
        } else {
            currentPlayer = 0;
        }
        
        return { success: true };
        
        // On success should return array of dots path
        // and count score
        // else - false
    };
    
    logic.getScore = function () {
        // retuns array of players score
    };
    
    logic.getDots = function(){
        return dots;
    };
    
    logic.getCurrentPlayer = function(){
        return players[currentPlayer];
    }
    
    return logic;
    
});
