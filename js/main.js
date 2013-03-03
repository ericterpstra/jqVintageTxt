$(function() {
    
    var el = $('#doThis').delay(1500).fadeOut(500);
    
    var p1 = el.vintageTxt({
      text : ["Good Morning.","It's a lovely day, isn't it?","I will not be enjoying it, because I have no legs."]
      //, onFinishedTyping : p2
    });

    function p2() {
      el.vintageTxt('reset',[
          "Don't worry."
          ,"I still like being a computer."
          ,"And I like you."
        ]
        ,{
          onFinishedTyping : null
      });
    }

});
