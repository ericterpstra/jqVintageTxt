$(function() {
  var ting1 = $('#doThis').vintageTxt();

  setTimeout(function(){
    var ting2 = $('#doThis2').vintageTxt({text:["testing","hello","123"]});
  },2000);
  // TODO: Make this work

  /**
   * Need to add a random string to the end of the div ids that are created.
   * Within the plugin, use references to the ids, rather than the ids themseleves.
   */

});
