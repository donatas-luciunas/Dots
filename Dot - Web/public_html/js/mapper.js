define([], function(){
    
    var mapper = {};
    
    mapper.dotsToGui = function(_dots){
        
        var dots = [];
        
        for (var i = 0; i < _dots[0].length; i++){
            for (var j = 0; j < 2 && dots[1][i] !== undefined; j++){
                dots[i * 2 + j] = _dots[j][i];
            }
        }
        
        return dots;
        
    };
    
    mapper.cyclesToGui = function(cycles, player){
        var c = [];
        for (var i = 0; i < cycles.length; i++){
            c[c.length] = mapper.cycleToGui(cycles[i], player);
        }
        return c;
    };
    
    mapper.cycleToGui = function(cycle, player){
        var c = [];
        for (var i = 0; i < cycle.length; i++){
            c[i] = cycle[i] * 2 + player;
        }
        return c;
    };
    
    return mapper;
    
});