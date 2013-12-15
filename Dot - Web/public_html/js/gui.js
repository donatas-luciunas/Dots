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
        cycles = [],
        navigating = false,
        currentPlayer,
        scoresBoard = $('#scores');
       
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
                    gui.placeCycles(result.cycles, currentPlayer.dotColor);                    
                }
                
                updateScores(result.scores);
                
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
            
            gui.mousePos = { x: e.clientX, y: e.clientY };
            
            gui.refresh();
        });
        
        $canvas.mousedown(function(e){
            if (e.button === 2){
                navigating = true;
                gui.mousePos = { x: e.clientX, y: e.clientY };
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
               
//        var animation = (function(strokeStyle){
//          
//            var a = {};
//            var p = 0.5;
//            var context, x, y, w, h,
//                framesCount = 0, posNum = 1;
//            
//            a.initialize = function(_context, _x, _y, _w, _h){
//                context = _context;
//                x = _x + 2;
//                y = _y + 2;
//                w = _w - 4;
//                h = _h - 4;
//            };
//            
//            a.applyNextFrame = function(){
//                
//                if (posNum % 2){
//                    
//                    context.beginPath();
//                    context.strokeStyle = strokeStyle;
//                    context.lineWidth = 3;
//                    context.moveTo(x + p, y + p);
//                    context.lineTo(x + w + p, y + h + p);
//                    context.moveTo(x + w + p, y + p);
//                    context.lineTo(x + p, y + h + p);
//                    context.stroke();
//                    
//                }
//                
//                framesCount++;
//                if (framesCount > 5){
//                    framesCount = 0;
//                    posNum++;
//                    
//                    if (posNum > 4){
//                        return false;
//                    }   
//                }
//                
//                return true;
//                
//            };
//            
//            return a;
//            
//        })("red");
        
        //animate(coord.x - 10, coord.y - 10, 20, 20, animation);
        
        var animation = (function(){
            
            var a;
            var hidden = true;
            var blinks = 0;
            
            var animate = function(){
                hidden = !hidden;
                if (hidden){
                    a.hide();
                } else {
                    a.show();
                    blinks++;
                }
                if (blinks < 3){
                    setTimeout(animate, 300);
                } else {
                    destroy();
                }
            };
            
            var destroy = function(){
                a.remove();
            };
            
            return function(_a){
                a = _a;
                a.addClass('already-taken');
                animate();
            };
            
        })();
        
        animate(coord.x - 9, coord.y - 9, animation);
    };
    
//    var animate = function(x, y, w, h, animation){
//        
//        var p = 0.5;
//        
//        var background = context.getImageData(x + p, y + p, w, h);
//        
//        animation.initialize(context, x, y, w, h);
//        
//        var drawFrame = function(){
//            context.putImageData(background, x, y);
//            if (animation.applyNextFrame()){
//                setTimeout(drawFrame, defaults.animationTimeout);
//            }
//        };
//        
//        drawFrame();
//        
//    };

    var animate = function(x, y, animation){
        var a = $('<span></span>')
                .addClass('animation')
                .css({ left: x + 'px', top: y + 'px' })
                .appendTo(document.body);
        animation(a);
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
        };
    };
    
    var updateScores = function(scores){
        scoresBoard.find('.red b').text(scores[0]);
        scoresBoard.find('.blue b').text(scores[1]);
    };

    gui.initialise = function()
    {
        gui.canvas = document.getElementById("matrix");
        context = gui.canvas.getContext("2d");
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
        gui.drawGridNumbers();
        gui.drawDots();
        gui.drawCycles();
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
    
    gui.drawGridNumbers = function (){
        var p = 0.5;
        context.lineWidth = 1;
        context.fillStyle = "green";
        
        var cellWidth = (defaults.cellWidth * gui.scale);
        var cellHeight = (defaults.cellHeight * gui.scale);
        var startX = (cellWidth - gui.pos.x) % cellWidth;
        var startY = (cellHeight - gui.pos.y) % cellHeight;
        
        if (startX < 0){
            startX += cellWidth;
        }
        
        if (startY < 0){
            startY += cellHeight;
        }
        
        var coordX = Math.ceil(gui.pos.x / cellWidth);
        var coordY = Math.ceil(gui.pos.y / cellHeight);
        
        for (var x = startX; x <= gui.canvas.width; x += cellWidth) {
            context.fillText(coordX + '', x + p + 2, p + 10);
            coordX++;
        }

        for (var y = startY; y <= gui.canvas.height; y += cellHeight) {
            context.fillText(coordY + '', p + 2, y + p + 10);
            coordY++;
        }
        
    };
    
    gui.placeCycles = function(c, color){
        for (var i = 0; i < c.length; i++){
            for (var j = 0; j < c[i].length; j++){
                dots[c[i][j]].filled = true;
            }
            
            cycles[cycles.length] =  { dots: c[i], color: color };
            cycles[cycles.length - 1].dots[cycles[cycles.length - 1].dots.length] = c[i][0];
        }
        gui.refresh();
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
            context.fillStyle = dots[i].color;
            var coord = posToCoord(dots[i].coord);
            context.moveTo(coord.x + r + 0.5, coord.y + 0.5);
            context.arc(coord.x + 0.5, coord.y + 0.5, r, 0, 2 * Math.PI);
            if (dots[i].filled){
                context.fill();
            } else {
                context.stroke();
            }
        }
    };
    
    gui.drawCycles = function(){
        context.lineWidth = 4;
        for (var i = 0; i < cycles.length; i++){
            for (var j = 0; j < cycles[i].dots.length - 1; j++){
                context.beginPath();
                context.strokeStyle = cycles[i].color;
                var dot1 = posToCoord(dots[cycles[i].dots[j]].coord);
                var dot2 = posToCoord(dots[cycles[i].dots[j + 1]].coord);
                context.moveTo(dot1.x + 0.5, dot1.y + 0.5);
                context.lineTo(dot2.x + 0.5, dot2.y + 0.5);
                context.stroke();
            }
        }
    };

    return gui;

});
