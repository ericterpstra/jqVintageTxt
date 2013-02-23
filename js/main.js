$(document).ready(function() {
  $('#doThis').oldSchool();
})

var lineHeight = $('#line').height();
var dotWidth = $('#dot').width();
var lineStart = $('#line').css('top');
var dotStart = $('#dot').css('left');
var desiredBottom = 0;
var lineSpeed = 700;
var dotSpeed = lineSpeed / 3;

var windowHeight = $(window).height();
var windowWidth = $(window).width();
var newPosition = windowHeight - (lineHeight + desiredBottom);
var newPositionDot = windowWidth - dotWidth;

$("#selected_content").focus();

$("#cover").height(windowHeight);

$(document).ready(function() {
/*  move();
  dot_move();
  setInterval(function() {
    move();
  }, lineSpeed);
  setInterval(function() {
    dot_move();
  }, dotSpeed);*/
})

function move() {
  $('#line').animate({
    top: newPosition
  }, lineSpeed);
  $('#line').animate({
    top: lineStart
  }, 0);
};

function dot_move() {
  $('#dot').animate({
    left: newPositionDot
  }, dotSpeed);
  $('#dot').animate({
    left: dotStart
  }, 0);
}

$(window).resize(function() {
  windowHeight = $(window).height();
  windowWidth = $(window).width();
  newPosition = windowHeight - (lineHeight + desiredBottom);
  newPositionDot = windowWidth - dotWidth;
  //$("#cover").height(windowHeight);
});

(function(){
  var tl = [
    "1. FROGGER",
    "2. MONTEZUMA'S REVENGE",
    "3. TYPING MASTER",
    "4. CASTLE WOLFENSTEIN"
  ];

  var speed=30;
  var index=0; text_pos=0;
  var str_length=tl[0].length;
  var contents, row;

  function type_text()
  {
    contents='';
    row=Math.max(0,index-9);
    while(row<index)  {
      contents += tl[row++] + '<br/>';
    }
    $('#ttyText').html(contents + tl[index].substring(0,text_pos) );
    if(text_pos++==str_length)
    {
      text_pos=0;
      index++;
      if(index!=tl.length)
      {
        str_length=tl[index].length;
        setTimeout(type_text,800);
      }
    } else
      setTimeout(type_text,speed);
  }

  type_text();
})();

