define(['gui', 'logic'], function(gui, logic){
    
    var game = {};
    
    game.start = function ()
    {
        gui.initialise();
        logic.initialise();
    };
    
    return game;
    
});