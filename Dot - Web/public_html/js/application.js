require.config({
    paths: {
        jquery: 'http://code.jquery.com/jquery-1.8.0.min'
    }
});

require(['game'], function(g){
   
   g.start();
   
});