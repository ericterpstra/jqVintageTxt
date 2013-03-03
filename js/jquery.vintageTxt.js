(function( $ ) {


  /**
   * Define the Plugin
   * @param method Initial options object or method name
   */
  $.fn.vintageTxt = function( method ) {
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
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
    'onEnterKey'       : null,
    'onFinishedTyping' : null
  };

  $.fn.vintageTxt.start = function start() {
    if ( this.data('vintageTxt') ) {
      var self = this.data('vintageTxt');
      self.startTyping();
    } else {
      $.error( 'Please initialize the plugin first' );
    }
  }

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

        plugin.render( plugin.startTyping );
      });
       return returnObj;
    },

    reset : function( text, options ) {
      var self = this.data('vintageTxt');
      if (self) {

        if (options) self.settings = $.extend({}, $.fn.vintageTxt.settings, options || {});
        self.settings.text = Object.prototype.toString.call(text) === "[object Array]" ? text : [text];
        self.startTyping();
        return this;
      } else {
        $.error('Please initialize the plugin before calling this method');
      } 
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

      var $self     = this
        , textDiv   = this.$elem.find('#oldSchoolContentText')
        ,index      = 0
        , text_pos   = 0
        , settings   = this.settings
        , str_length = this.settings.text[0].length
        , contents
        , row;

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

      typeText();
    },

    endTyping : function endTyping() {
      if (this.settings.onFinishedTyping) {
        this.settings.onFinishedTyping();
        this.settings.onFinishedTyping = null;
      } 
      
      if( this.showPrompt ) this.showPrompt();
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

        if ( $elem.find('#oldSchoolContentInput').val() ) {
          self.settings.onEnterKey ? self.settings.onEnterKey( e ) : self.doRandomSnark();
          $elem.find('#oldSchoolContentInput').val('');
          $elem.find('#oldSchoolContentInputDiv').hide();
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

})( jQuery );