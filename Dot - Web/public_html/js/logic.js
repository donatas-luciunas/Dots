/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define(['gui'], function(gui){
    
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
    
//    logic.start = function ()
//    {
//        gui.drawGrid();
//    };


    logic.initialise = function(){
        gui.initialize({
            onClick: function (e){
                logic.placeDot(e.clientX, e.clientY);
                gui.refresh(dots);
            }
        });
    };

    logic.placeDot = function(x, y){
        dots[dots.length] = {x: x, y: y};
    };
    
    logic.getDots = function(){
        return dots;
    };
    
    return logic;
    
});
