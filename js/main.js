$(function() {
  
  var VintageTxtTest = {
    el : $('#doThis')
  };

  VintageTxtTest.go = function go() {
    var self = VintageTxtTest;

    self.el.vintageTxt({
       text : ["4 8 15 16 23 42",".  .  .  "]
      ,textSpeed: 300
      ,promptEnabled: false
      ,overlayImage : 'img/lostpcB.png'
      ,onFinishedTyping : VintageTxtTest.intro
    });

  };

  VintageTxtTest.intro = function intro() {
    var self = VintageTxtTest;
    var texts = [
      ["Just kidding!","Welcome to the VintageTxt demo."]
      ,["If you've seen this before and just want the code, click the GitHub thingy in the corner.","Otherwise sit back and enjoy the show!"]
    ];

    self.el.vintageTxt('updateOptions', {
      textSpeed: 60
      ,onFinishedTyping : null
    });
    self.el.vintageTxt('playMany',texts);
  };



  VintageTxtTest.checkInput = function checkInput(e, inputResult) {
    var self = VintageTxtTest;
    if (inputResult && inputResult.toUpperCase() == 'HANSO' ) {
      self.el.vintageTxt('reset'
        ,[ "Welcome to the dharma initiative.", "You are located in the swan station.", "Please review the orientation video and enjoy your stay.","Namaste" ]
        ,{ onEnterKey : VintageTxtTest.go }
      );
    }
  };

  VintageTxtTest.go();

});
