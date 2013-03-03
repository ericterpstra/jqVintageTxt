(function( $ ) {

  /**
   * Define the Plugin
   * @param method Initial options object or method name
   */
  $.fn.vintageTxt = function( method ) {

    if ( methods[method] ) {
      if ( this.data('vintageTxt') ) {
        return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
      } else {
        $.error( 'Please initialize the plugin before calling ' + method );
      }
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.vintageTxt' );
    }
  };

  /**
   * Plugin Settings
   */
  $.fn.vintageTxt.settings = {
    'maxRows'          : 10,
    'textSpeed'        : 30,
    'linePause'        : 800,
    'text'             : ['All your base','are belong to us.'],
    'promptEnabled'    : true,
    'showMonitor'      : true,
    'autoStart'        : true,
    'onEnterKey'       : null,
    'onFinishedTyping' : null
  };

  /**
   * Plugin "Public" Methods
   */
  var methods = {

    init : function( options ) {
      var returnObj = this.each( function() {
        
        var $elem = $(this);
        var settings = $.extend({}, $.fn.vintageTxt.settings, options || {});
        var plugin = new VintageTxt( settings, $elem );

        // Create a reference to the plugin instance in jQuery's datastore.
        $elem.data('vintageTxt', plugin);

        if ( settings.autoStart && settings.text ){
          plugin.render( plugin.startTyping );
        } else {
          plugin.render();
        }
      });
       return returnObj;
    },

    reset : function( text, options ) {
      var self = this.data('vintageTxt');
      if (self) {

        if (options) self.settings = $.extend({}, $.fn.vintageTxt.settings, options || {});
        self.settings.text = isArray(text) ? text : [text];
        self.startTyping();
        return this;
      } 
      return this;
    },

    playMany : function (textArrays) {
      if ( !isArray(textArrays) || textArrays.length < 1 ) {
        $.error( 'This function requires an array as the first argument' )
      } else {
        var self = this.data('vintageTxt');  
        var showPromptOnEnd = self.settings.promptEnabled;

        function playArray() {
          self.settings.text = textArrays.shift();
          self.settings.promptEnabled = false;
          var next = null;
          if ( textArrays.length ) {
            next = function(){setTimeout(playArray, 800);};
          } else { 
            self.settings.promptEnabled = true;
            next = null;
          }
          self.settings.onFinishedTyping = next;
          self.startTyping();
        }
        playArray();
      }
      return this;
    }

  };



  //////////////////////////////
  // PRIVATE VARS & FUNCTIONS //
  //////////////////////////////

  function VintageTxt( settings, $elem ) {
    this.settings = settings;
    this.$elem = $elem;
    this.$el = null;

    return this;
  }

  VintageTxt.prototype = {

    render : function render( callback ) {
      var $el = this.$elem;

      // Add the content div for inserting text
      this.$elem.html( '<img src="img/oldmac.png" class="imgOldmac" />' +
        '<div id="oldSchoolContent" class="oldSchoolContent" contenteditable="false">' +
        '<div id="oldSchoolContentText" class="oldSchoolContentText"></div><br/>' +
        '<div id="oldSchoolContentInputDiv">' +
        '>&nbsp;<input id="oldSchoolContentInput" type="text">' +
        '</div>' +
        '</div>');

      this.$elem.find('#oldSchoolContentInputDiv').hide()
      // Make it nice and green
      $el.addClass('wrapper');

      // Create event handler for enter key
      $el.on('keyup.vintageTxt', this.inputSubmit );

      $el.click(function() {
        if ( $el.find('#oldSchoolContentInput') )
          $el.find('#oldSchoolContentInput').focus();
      });

      if (callback) callback.call(this);
    },

    startTyping : function startTyping() {

      var $self      = this
        , textDiv    = this.$elem.find('#oldSchoolContentText')
        , index      = 0
        , text_pos   = 0
        , settings   = this.settings
        , str_length = this.settings.text[0].length
        , contents   = ''
        , row        = 0;

      var typeText = function typeText() {
        contents = '';
        row = Math.max( 0, index - settings.maxRows + 1 );
        while(row<index)  {
          contents += settings.text[row++] + '<br/>';
        }
        textDiv.html(contents + settings.text[index].substring(0,text_pos) );
        if( text_pos++ == str_length )
        {
          text_pos=0;
          index++;
          if( index != settings.text.length )
          {
            str_length = settings.text[index].length;
            setTimeout(typeText,800);
          } else {
            $self.endTyping();
          }
        } else {
          setTimeout(typeText,settings.textSpeed);
        }
      };

      if ( $self.settings.text && $self.settings.text.length ) {
        this.$elem.find('#oldSchoolContentInput').val('');
        this.$elem.find('#oldSchoolContentInputDiv').hide();
        typeText();  
      } else {
        textDiv.empty();
      }
      
    },

    endTyping : function endTyping() {
      if (this.settings.onFinishedTyping) {
        this.settings.onFinishedTyping();
        this.settings.onFinishedTyping = null;
      } 
      
      if( this.settings.promptEnabled ) {
        this.showPrompt();
      } 
    },

    showPrompt : function showPrompt() {
      this.$elem.find('#oldSchoolContentInputDiv').show();
      this.$elem.find('#oldSchoolContentInput').focus();
    },

    inputSubmit : function inputSubmit( e ) {
      var code = (e.keyCode ? e.keyCode : e.which);

      if(code == 13) { //Enter keycode
        var $elem = $(this);
        var self = $elem.data('vintageTxt');
        var val = $elem.find('#oldSchoolContentInput').val()
        if ( val ) {
          self.settings.onEnterKey ? self.settings.onEnterKey( e, val ) : self.doRandomSnark();
        }
      }
    },

    doRandomSnark : function doRandomSnark() {
      methods.reset.call(this.$elem, [this.$elem.find('#oldSchoolContentInput').val(),this.getRandomSnark()]);
    },

    getRandomSnark : function getRandomSnark() {
      var quoteIndex = Math.floor(Math.random()*5);
      var quotes = [
        "How profound.",
        "Words of genius.",
        "Said the blind man as he picked up his hammer and saw.",
        "Says you.",
        "<a href='https://www.youtube.com/watch?v=PpccpglnNf0'>Goats Yelling Like People</a>"
      ];
      return quotes[quoteIndex];
    }

  };


  function isArray(obj) {
    return obj ? Object.prototype.toString.call(obj) === "[object Array]" : false;
  }
})( jQuery );