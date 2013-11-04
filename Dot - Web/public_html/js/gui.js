define(['logic', 'jquery'], function(logic, $) {

    var defaults = {
        scale: 1,
        cellWidth: 50,
        cellHeight: 50,
        radius: 20,
        animationTimeout: 50
    };

    var gui = {},
        context,
        dots = [],
        navigating = false,
        currentPlayer;
       
    gui.scale = defaults.scale;
    gui.pos = { x: 0, y: 0 };
    gui.mousePos = { x: 0, y: 0 };
    
    var $console = $('#console');

    var bindEvents = function() {

        var $canvas = $(gui.canvas);
        
        $canvas.click(function(e) {
            
            var pos = coordToPos(e.clientX, e.clientY);
            var result = logic.placeDot(pos.x, pos.y);
            
            if (result.success){
                
                gui.placeDot(pos, currentPlayer.dotColor);
                
                if (result.cycles.length > 0){
                    // TODO: Draw cycle
                    console.log('Cycles!');
                    console.log(result.cycles);
                }
                
                currentPlayer = logic.getCurrentPlayer();
                
            } else {
                alertPositionTaken(pos.x, pos.y);
            }
            
        });
        
        $canvas.bind('contextmenu', function(){
            return false;
        });

        $canvas.mousemove(function(e) {
            
            if (navigating)
            {
                gui.pos.x = gui.pos.x + (gui.mousePos.x - e.clientX);
                gui.pos.y = gui.pos.y + (gui.mousePos.y - e.clientY);
            }
            
            gui.mousePos = { x: e.clientX, y: e.clientY }
            
            gui.refresh();
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
                var sk = (gui.scale - 0.1) / gui.scale;
                gui.pos.x = sk * (gui.pos.x + gui.mousePos.x) - gui.mousePos.x;
                gui.pos.y = sk * (gui.pos.y + gui.mousePos.y) - gui.mousePos.y;
                gui.scale -= 0.1;
            } else {
                //scroll up
                if (gui.scale > 5) return;
                var sk = (gui.scale + 0.1) / gui.scale;
                gui.pos.x = sk * (gui.pos.x + gui.mousePos.x) - gui.mousePos.x;
                gui.pos.y = sk * (gui.pos.y + gui.mousePos.y) - gui.mousePos.y;
                gui.scale += 0.1;
            }
            //prevent page fom scrolling
            gui.refresh();
            return false;
        });

    };
    
    var alertPositionTaken = function (x, y) {
        
        var coord = posToCoord({ x: x, y: y });
               
        var animation = (function(strokeStyle){
          
            var a = {};
            var p = 0.5;
            var context, x, y, w, h,
                framesCount = 0, posNum = 1;
            
            a.initialize = function(_context, _x, _y, _w, _h){
                context = _context;
                x = _x + 2;
                y = _y + 2;
                w = _w - 4;
                h = _h - 4;
            };
            
            a.applyNextFrame = function(){
                
                if (posNum % 2){
                    
                    context.beginPath();
                    context.strokeStyle = strokeStyle;
                    context.lineWidth = 3;
                    context.moveTo(x + p, y + p);
                    context.lineTo(x + w + p, y + h + p);
                    context.moveTo(x + w + p, y + p);
                    context.lineTo(x + p, y + h + p);
                    context.stroke();
                    
                }
                
                framesCount++;
                if (framesCount > 5){
                    framesCount = 0;
                    posNum++;
                    
                    if (posNum > 4){
                        return false;
                    }   
                }
                
                return true;
                
            };
            
            return a;
            
        })("red");
        
        animate(coord.x - 10, coord.y - 10, 20, 20, animation);
        
        console.log('Position is already taken.');
    };
    
    var animate = function(x, y, w, h, animation){
        
        var p = 0.5;
        
        var background = context.getImageData(x + p, y + p, w, h);
        
        animation.initialize(context, x, y, w, h);
        
        var drawFrame = function(){
            context.putImageData(background, x, y);
            if (animation.applyNextFrame()){
                setTimeout(drawFrame, defaults.animationTimeout);
            }
        };
        
        drawFrame();
        
    };

    var coordToPos = function(x, y) {
        return {
            x: parseInt(Math.round((x + gui.pos.x) / (gui.scale * defaults.cellWidth))),
            y: parseInt(Math.round((y + gui.pos.y) / (gui.scale * defaults.cellHeight)))
        };
    };
    
    var posToCoord = function(pos)
    {
        return {
            x: pos.x * defaults.cellWidth * gui.scale - gui.pos.x,
            y: pos.y * defaults.cellHeight * gui.scale - gui.pos.y
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
        
        currentPlayer = logic.getCurrentPlayer();
    };

    gui.refresh = function() {
        gui.clear();
        gui.drawGrid();
        gui.drawDots();
        gui.drawDot(coordToPos(gui.mousePos.x, gui.mousePos.y), currentPlayer.hoverColor);
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
        var cellWidth = (defaults.cellWidth * gui.scale);
        var cellHeight = (defaults.cellHeight * gui.scale);
        var startX = (cellWidth - gui.pos.x) % cellWidth;
        var startY = (cellHeight - gui.pos.y) % cellHeight;
        
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

    gui.placeDot = function(dot, color)
    {
        dots[dots.length] = { coord: dot, color: color };
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
        for (var i = 0; i < dots.length; i++) {
            context.beginPath();
            context.strokeStyle = dots[i].color;
            var coord = posToCoord(dots[i].coord);
            context.moveTo(coord.x + r + 0.5, coord.y);
            context.arc(coord.x + 0.5, coord.y + 0.5, r, 0, 2 * Math.PI);
            context.stroke();
        }
    };

    return gui;

});
