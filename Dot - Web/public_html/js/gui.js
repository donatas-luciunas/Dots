define(['jquery'], function($){
   
   var defaults = {
       scale: 1,
       cellWidth: 30,
       cellHeight: 30
   };
   
   var gui = {};
   
   gui.scale = 1;
   gui.canvas = document.getElementById("matrix");
   
   var context = gui.canvas.getContext("2d");
   
   gui.initialize = function (params)
   {
       gui.drawGrid();
       $(gui.canvas).click(params.onClick);
   };
   
   gui.refresh = function (dots){
       gui.drawGrid();
       gui.drawDots(dots);
   };
   
   gui.drawGrid = function()
   {
       for (var x = 0; x <= 1000; x += defaults.cellWidth) {
            context.moveTo(x, 0);
            context.lineTo(x, 1000);
        }

        for (var x = 0; x <= 1000; x += defaults.cellWidth) {
            context.moveTo(0, x);
            context.lineTo(1000, x);
        }

        context.strokeStyle = "black";
        context.stroke();
   };
   
   gui.drawDots = function(dots){
       console.log(dots);
   };
   
   return gui;
   
});
