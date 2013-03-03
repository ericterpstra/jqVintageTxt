$(function() {
    var el = $('#doThis');
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
    test = 0;
  //$('#doThis2').vintageTxt({text:['Testing.']});

/*
  setTimeout(function(){
    $('#doThis').vintageTxt('reset',"Goodbye!");
  },5000);
*/

});
