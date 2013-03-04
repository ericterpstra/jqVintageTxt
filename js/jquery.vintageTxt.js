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
     'overlayImage'     : null
    ,'maxRows'          : 10
    ,'textSpeed'        : 30
    ,'linePause'        : 800
    ,'text'             : ['All your base','are belong to us.']
    ,'promptEnabled'    : true
    ,'showMonitor'      : true
    ,'autoStart'        : true
    ,'onEnterKey'       : null
    ,'onFinishedTyping' : null
  };

  /**
   * Plugin "Public" Methods
   * 
   * These methods are called by the client
   * with $(el).vintageTxt('methodName', args...)
   */
  var methods = {

    /**
     * Instantiate and initialize the plugin
     * for the specified element. User/client
     * may pass in a set of options to override
     * the defaults.
     * 
     * @param  {*} options
     * @return {*}
     */
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

    /**
     * A helper function that is similar to init
     * but does not re-render the plugin. A text
     * array or single string can be passed as the
     * first param, and options can be overridden
     * with the second param.
     * 
     * @param  {array} text
     * @param  {*} options
     * @return {*}
     */
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

    /**
     * Accepts an array of text arrays,
     * (e.g. [['Hello.','Line2'], ['Hi page 2','foo']])
     * Each text array will reset the screen and start
     * typing from line one.
     * 
     * @param  {array} textArrays
     * @return {}
     */
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


  /* *********************
   *                     *
   *    Plugin Object    *
   *                     *
   ********************* */

  /**
   * Constructor Function
   * 
   * 
   * 
   * @param  {*} settings The extended options object.
   * @param  {*} $elem The jQuery wrapped element
   * @return {VintageTxt}
   */
  function VintageTxt( settings, $elem ) {
    this.settings = settings;
    this.$elem = $elem;

    return this;
  }

  VintageTxt.prototype = {

    render : function render( callback ) {
      var $el = this.$elem;

      // Add the content div for inserting text
      this.$elem.html( 
        '<div id="vtxt_Content" class="vtxt_oldSchoolContent" contenteditable="false">' +
        '<div id="vtxt_ContentText" class="vtxt_oldSchoolContentText"></div><br/>' +
        '<div id="vtxt_ContentInputDiv">' +
        '>&nbsp;<input id="vtxt_ContentInput" type="text">' +
        '</div>' +
        '</div>');

      if( this.settings.overlayImage ) {
        var imgTag = '<img src="' + this.settings.overlayImage + '" class="vintageTxt_overlay" />';  
        this.$elem.prepend( imgTag );
      } else {
        this.$elem.addClass('vtxt_defaultBorder');
      }

      this.$elem.find('#vtxt_ContentInputDiv').hide()
      // Make it nice and green
      $el.addClass('vtxt_wrapper');

      // Create event handler for enter key
      $el.on('keyup.vintageTxt', this.inputSubmit );

      $el.click(function() {
        if ( $el.find('#vtxt_ContentInput') )
          $el.find('#vtxt_ContentInput').focus();
      });

      if (callback) callback.call(this);
    },

    startTyping : function startTyping() {

      var $self      = this
        , textDiv    = this.$elem.find('#vtxt_ContentText')
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
        this.$elem.find('#vtxt_ContentInput').val('');
        this.$elem.find('#vtxt_ContentInputDiv').hide();
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
      this.$elem.find('#vtxt_ContentInputDiv').show();
      this.$elem.find('#vtxt_ContentInput').focus();
    },

    inputSubmit : function inputSubmit( e ) {
      var code = (e.keyCode ? e.keyCode : e.which);

      if(code == 13) { //Enter keycode
        var $elem = $(this);
        var self = $elem.data('vintageTxt');
        var val = $elem.find('#vtxt_ContentInput').val()
        if ( val ) {
          self.settings.onEnterKey ? self.settings.onEnterKey( e, val ) : self.doRandomSnark();
        }
      }
    },

    doRandomSnark : function doRandomSnark() {
      methods.reset.call(this.$elem, [this.$elem.find('#vtxt_ContentInput').val(),getRandomSnark()]);
    }, 

  };


  /* **************
   *              *
   *    Utils     *
   *              *
   *************** */

  function isArray(obj) {
    return obj ? Object.prototype.toString.call(obj) === "[object Array]" : false;
  }

  function getRandomSnark() {
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

})( jQuery );