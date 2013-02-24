(function( $ ) {

  /**
   * Plugin Settings
   */
  var settings = {
    'maxRows'   : 10,
    'textSpeed' : 30,
    'linePause' : 800,
    'text'      : ['All your base','are belong to us.'],
    'el'        : this
  };

  /**
   * Plugin Methods
   */
  var methods = {

    init : function( options ) {
      $.extend( settings, options );
      return this.each( function() {
        setupDivs( this );
        startTyping( settings );
      });
    },

    reset : function( text ) {
      settings.text = Object.prototype.toString.call(text) === "[object Array]" ? text : [text];
      startTyping();
    }

  };

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
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }
  };


  //////////////////////////////
  // PRIVATE VARS & FUNCTIONS //
  //////////////////////////////

  var startTyping = function startTyping() {

    var index      = 0
      , text_pos   = 0
      , str_length = settings.text[0].length
      , contents
      , row;

    var typeText = function typeText() {
      contents = '';
      row = Math.max( 0, index - settings.maxRows + 1 );
      while(row<index)  {
        contents += settings.text[row++] + '<br/>';
      }
      $('#oldSchoolContent').html(contents + settings.text[index].substring(0,text_pos) );
      if( text_pos++ == str_length )
      {
        text_pos=0;
        index++;
        if( index != settings.text.length )
        {
          str_length = settings.text[index].length;
          setTimeout(typeText,800);
        }
      } else {
        setTimeout(typeText,settings.textSpeed);
      }
    };

    typeText();
  };


  var setupDivs = function setupDivs( el ) {
    // Add the content div for inserting text
    $(el).html('<img src="img/oldmac.png" id="imgOldmac" /><div id="oldSchoolContent" contenteditable="false"></div>');

    // Make it nice and green
    $(el
    ).addClass('wrapper');
  };

})( jQuery );