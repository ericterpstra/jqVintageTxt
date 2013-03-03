$(function() {
  
  var VintageTxtTest = {
    el : $('#doThis')
  };

  VintageTxtTest.go = function go() {
    var texts = [
      ["Howdy Ho, kids!","Merry Christmas!"]
      ,["Test Screen Two","What is 1 + 1?"]
    ];
    var self = VintageTxtTest;

    self.el.vintageTxt({
      autoStart   : false
      ,onEnterKey : VintageTxtTest.checkInput
    });
    self.el.vintageTxt('playMany',texts);
  };

  VintageTxtTest.checkInput = function checkInput(e, inputResult) {
    var self = VintageTxtTest;
    if (inputResult && inputResult == 2) {
      self.el.vintageTxt('reset'
        ,[ "Correct!", "You are the smart!" ]
        ,{ onEnterKey : VintageTxtTest.go }
      );
    }
  };

  VintageTxtTest.go();

});
