define(['logic'], function(logic){
    
    var game = {};
    
    game.start = function ()
    {
        logic.initialise();
    };
    
    return game;
    
});