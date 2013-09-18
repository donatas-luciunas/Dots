/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define(function(){
    
    var logic = {};
    var dots = [];
    
    
    
    var graph = {};
    graph.vertexs = [];
    
    graph.vertexs[graph.vertexs.length] = {x: 1, y: 1};
    graph.vertexs[graph.vertexs.length] = {x: 0, y: 0};
    graph.vertexs[graph.vertexs.length] = {x: 0, y: 0};
    graph.vertexs[graph.vertexs.length] = {x: 0, y: 0};
    graph.vertexs[graph.vertexs.length] = {x: 0, y: 0};
    
    console.log(graph.vertexs);
   
    logic.initialise = function(){
//        gui.initialize({
//            onClick: function (x, y){
//                logic.placeDot(x, y);
//                gui.refresh(dots);
//            }
//        });
    };

    logic.placeDot = function(x, y){
        dots[dots.length] = {x: x, y: y};
        
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
    
    return logic;
    
});
