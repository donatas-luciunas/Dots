define(['logic', 'jquery'], function(logic, $){
   
   var defaults = {
       scale: 1,
       cellWidth: 50,
       cellHeight: 50
   };
   
   var gui = {},
       context;
   
   gui.scale = 1;
   
   var bindEvents = function () {
       
       $(gui.canvas).click(function (e){
           logic.placeDot(e.clientX, e.clientY);
           gui.drawDot({ x: e.clientX, y: e.clientY });
       });
       
   };
   
   gui.initialise = function ()
   {
       gui.canvas = document.getElementById("matrix");
       context = gui.canvas.getContext("2d")
       var $canvas = $(gui.canvas);
       gui.canvas.height = $canvas.height();
       gui.canvas.width = $canvas.width();
       
       gui.drawGrid();
       
       bindEvents();
   };
   
//   gui.refresh = function (dots){
//       gui.drawGrid();
//       gui.drawDots(dots);
//   };
   
   gui.drawGrid = function()
   {
       var p = 0.5;
       for (var x = 0; x <= gui.canvas.width; x += defaults.cellWidth) {
            context.moveTo(x + p, p);
            context.lineTo(x + p, gui.canvas.height + p);
        }

        for (var x = 0; x <= gui.canvas.height; x += defaults.cellWidth) {
            context.moveTo(p, x + p);
            context.lineTo(gui.canvas.width + p, x + p);
        }

//        context.strokeStyle = "black";
        context.lineWidth = 1;
        context.stroke();
   };
   
   gui.drawDot = function(dot){
       context.moveTo(dot.x, dot.y);
       context.arc(dot.x, dot.y, 10, 0, 2 * Math.PI)
       context.stroke();
   };
   
   gui.drawDots = function(dots){
       for (var i = 0; i < dots.length; i++){
           gui.drawDot(dots[i])
       }
   };
   
   return gui;
   
});
