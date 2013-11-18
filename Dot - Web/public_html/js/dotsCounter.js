/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


define(function() {
    var dotsCounter = {};
    var polyX = [];
    var polyY = [];
    var corners = [];
    var polySides;

    //Counts how many dots are in the cycle
    dotsCounter.count = function(cycle, dots) {
        corners = leaveJustCorners(cycle);
        findOutXY();
        polySides = corners.length;
        return countDotsInPolygon(corners, dots);
    };
    
    //Return seperated arrays of cordinates X and Y
    var findOutXY = function() {
        for (var i = 0; i < corners.length; i++) {
            polyX[polyX.length] = corners[i].x;
            polyY[polyY.length] = corners[i].y;
        }
    };
    
    //Counts how meny dots is in polygon
    var countDotsInPolygon = function(polygon, dots) {
        var counted = 0;
        for (var i = 0; i < dots.length; i++) {
            if ( !dots[i].counted && pointInPolygon(dots[i].x, dots[i].y)) {
                dots[i].counted = true;
                counted++;
            }
        }
        return counted;
    };
    //Checks weather dot is in the polygon
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
    
    //Removes from cycle point which we do not need to define the polygon
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
    return dotsCounter;
});