$(function() {
  $('#doThis').vintageTxt({
    text : [
     '                   WELCOME!',
     ' ',
     'Thank you for viewing this awesome thing.'
    ]
  });

  setTimeout(function(){
    $('#doThis').vintageTxt('reset',"Goodbye!");
  },5000);
});
