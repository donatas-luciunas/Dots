define(['logic', 'jquery'], function(logic, $) {

    var defaults = {
        scale: 1,
        cellWidth: 50,
        cellHeight: 50,
        radius: 20
    };

    var gui = {},
        context,
        dots = [],
        navigating = false;

    gui.scale = defaults.scale;
    gui.pos = { x: 0, y: 0 };
    gui.mousePos = { x: 0, y: 0 };
    
    var $console = $('#console');

    var bindEvents = function() {

        var $canvas = $(gui.canvas);
        $canvas.click(function(e) {
            var coord = coordToPos(e.clientX, e.clientY);
            logic.placeDot(coord.x, coord.y);
            gui.placeDot(coord);
        });
        
        $canvas.bind('contextmenu', function(){
            return false;
        });

        $canvas.mousemove(function(e) {
            
            if (navigating)
            {
                gui.pos.x = gui.pos.x + (gui.mousePos.x - e.clientX) / gui.scale;
                gui.pos.y = gui.pos.y + (gui.mousePos.y - e.clientY) / gui.scale;
                $console.text('x: ' + gui.pos.x + '; y: ' + gui.pos.y);
            }
            
            gui.mousePos = { x: e.clientX, y: e.clientY }
            
            var pos = coordToPos(e.clientX, e.clientY);
            gui.refresh();
            gui.drawDot(pos, "rgba(255, 0, 0, 0.5)");
        });
        
        $canvas.mousedown(function(e){
            if (e.button === 2){
                navigating = true;
                gui.mousePos = { x: e.clientX, y: e.clientY }
                return false;
            }
        }).mouseup(function(e){
            if (e.button === 2){
                navigating = false;
                return false;
            }
        });

        $(document).on('DOMMouseScroll mousewheel', function(e) {
            if (e.originalEvent.detail > 0 || e.originalEvent.wheelDelta < 0) { //alternative options for wheelData: wheelDeltaX & wheelDeltaY
                //scroll down
                if (gui.scale < 0.2) return;
                gui.pos.x -= gui.mousePos.x * 0.1 / gui.scale;
                gui.pos.y -= gui.mousePos.y * 0.1 / gui.scale;
                gui.scale -= 0.1;
            } else {
                //scroll up
                if (gui.scale > 5) return;
                gui.pos.x += gui.mousePos.x * 0.1 / gui.scale;
                gui.pos.y += gui.mousePos.y * 0.1 / gui.scale;
                gui.scale += 0.1;
            }
            //prevent page fom scrolling
            gui.refresh();
            return false;
        });

    };

    var coordToPos = function(x, y) {
        return {
            x: parseInt(Math.round((x / gui.scale + gui.pos.x) / defaults.cellWidth)),
            y: parseInt(Math.round((y / gui.scale + gui.pos.y) / defaults.cellHeight))
        };
    };
    
    var posToCoord = function(pos)
    {
        return {
            x: pos.x * defaults.cellWidth * gui.scale - gui.pos.x * gui.scale,
            y: pos.y * defaults.cellHeight * gui.scale - gui.pos.y * gui.scale
        }
    }

    gui.initialise = function()
    {
        gui.canvas = document.getElementById("matrix");
        context = gui.canvas.getContext("2d")
        var $canvas = $(gui.canvas);
        gui.canvas.height = $canvas.height();
        gui.canvas.width = $canvas.width();

        gui.drawGrid();

        bindEvents();
    };

    gui.refresh = function() {
        gui.clear();
        gui.drawGrid();
        gui.drawDots();
    };

    gui.clear = function()
    {
        context.clearRect(0, 0, gui.canvas.width, gui.canvas.height);
    };

    gui.drawGrid = function()
    {
        var p = 0.5;
        context.lineWidth = 1;
        context.strokeStyle = "black";

        context.beginPath();
        var startX = (defaults.cellWidth - gui.pos.x) % defaults.cellWidth * gui.scale;
        var startY = (defaults.cellHeight - gui.pos.y) % defaults.cellHeight * gui.scale;
        var cellWidth = (defaults.cellWidth * gui.scale);
        var cellHeight = (defaults.cellHeight * gui.scale);
        
        for (var x = startX; x <= gui.canvas.width; x += cellWidth) {
            context.moveTo(x + p, p);
            context.lineTo(x + p, gui.canvas.height + p);
        }

        for (var y = startY; y <= gui.canvas.height; y += cellHeight) {
            context.moveTo(p, y + p);
            context.lineTo(gui.canvas.width + p, y + p);
        }

        context.stroke();
    };

    gui.placeDot = function(dot)
    {
        dots[dots.length] = dot;
        gui.refresh();
    };

    gui.drawDot = function(dot, style) {
        var r = defaults.radius * gui.scale;
        context.lineWidth = 4;
        context.strokeStyle = style || "black";
        context.beginPath();
        var coord = posToCoord(dot);
        context.moveTo(coord.x + r + 0.5, coord.y);
        context.arc(coord.x + 0.5, coord.y + 0.5, r, 0, 2 * Math.PI);
        context.stroke();
    };

    gui.drawDots = function() {
        var r = defaults.radius * gui.scale;
        context.lineWidth = 4;
        context.strokeStyle = "red";
        context.beginPath();
        for (var i = 0; i < dots.length; i++) {
            var coord = posToCoord(dots[i]);
            context.moveTo(coord.x + r + 0.5, coord.y);
            context.arc(coord.x + 0.5, coord.y + 0.5, r, 0, 2 * Math.PI);
            // gui.drawDot(dots[i])
        }
        context.stroke();
    };

    return gui;

});
