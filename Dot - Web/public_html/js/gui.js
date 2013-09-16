define(function(){
   
   var defaults = {
       scale: 1,
       cellWidth: 30,
       cellHeight: 30
   };
   
   var gui = {};
   
   gui.scale = 1;
   gui.canvas = document.getElementById("matrix");
   
   var context = gui.canvas.getContext("2d");
   
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
   
   return gui;
   
});
