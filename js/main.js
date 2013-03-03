$(function() {
    var v1 = $('#doThis');
  v1.vintageTxt()
    .delay(4500)
    .vintageTxt('reset',['I have been reset.','This is awesome.']);
  //$('#doThis2').vintageTxt({text:['Testing.']});

/*
  setTimeout(function(){
    $('#doThis').vintageTxt('reset',"Goodbye!");
  },5000);
*/

});
