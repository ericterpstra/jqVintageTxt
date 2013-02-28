(function( $ ) {


  /** ********************
   *                     *
   *   DEFAULT SETTINGS  *
   *                     *
   * *********************
   * These can be overridden by passing an options object to the 'vintageTxt' or 'init' methods.
   *
   * maxRows    : The maximum lines of text displayed at once. Extra lines will scroll off the top.
   * textSpeed  : The delay between typing individual characters
   * linePause  : The delay between new lines of text.
   * text       : A string, or array of strings to type.  Each string is a new line.
   * el         : The element replaced by the vintageTxt container
   * onEnterKey : a callback function for pressing the 'Enter' key
   */




  /** *********************
   *                      *
   *    PLUGIN METHODS    *
   *                      *
   ********************** */
  var methods = {

    /**
     * Initialize the plugin.
     * This is called by vintageTxt() if no other method is specified.
     *
     * @param {*} options
     * @return {*}
     */
    init : function( options ) {
      var settings = {
        'maxRows'          : 10,
        'textSpeed'        : 30,
        'linePause'        : 800,
        'text'             : ['All your base','are belong to us.',' ','now type something and press enter.'],
        'el'               : this[0],
        'promptEnabled'    : true,
        'showMonitor'      : true,
        'onEnterKey'       : null,
        'onFinishedTyping' : null,
        'elementIds'       : {}
      };
      $.extend( settings, options );

      return this.each( function() {
        $(this).data('settings',settings);
        plugin.setupDivs( this );
        plugin.startTyping( settings );
      });
    },

    /**
     * Reset only the text portion.
     *
     * @param text A string or array of strings.
     */
    reset : function( text ) {
      settings.text = Object.prototype.toString.call(text) === "[object Array]" ? text : [text];
      plugin.startTyping();
    }

  };



  /** *************************
   *                          *
   * JQUERY PLUGIN DEFINITION *
   *                          *
   * **************************
   *
   * This is mostly boilerplate code from
   * http://docs.jquery.com/Plugins/Authoring
   *
   * @param method Initial options object, or method name
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



  /** *************************
   *                          *
   * PRIVATE VARS & FUNCTIONS *
   *                          *
   * ************************** /

  /**
   * The plugin object neatly encapsulates
   * the rest of the vars and functions
   * used in the vintageTxt plugin.
   */
  var plugin = {

    /**
     * Sets up the initial DOM elements for the plugin.
     */
    setupDivs : function setupDivs( el ) {
      var settings = $(el).data('settings');
      var uid = new Date().getTime();
      $.data(el, uid);

      settings.elementIds = {
        vintageMonitorId : 'vintageMonitor'+uid,
        oldSchoolContentId : 'oldSchoolContent'+uid,
        oldSchoolContentTextId : 'oldSchoolContentText'+uid,
        oldSchoolContentInputDivId : 'oldSchoolContentInputDiv'+uid,
        oldSchoolContentInputId : 'oldSchoolContentInput'+uid
      };

      $('<img/>',{
        id : settings.elementIds.vintageMonitorId,
        class : 'vintageMonitor',
        src : 'img/vintageMonitor.png'
      }).appendTo($(el));

      $('<div>',{
        id : settings.elementIds.oldSchoolContentId,
        class : 'oldSchoolContent',
        contenteditable : false
      }).appendTo($(el));

      $('<div>',{
        id : settings.elementIds.oldSchoolContentTextId
      }).appendTo($('#'+settings.elementIds.oldSchoolContentId));

      $('<div>',{
        id : settings.elementIds.oldSchoolContentInputDivId,
        text : '> '
      }).appendTo($('#'+settings.elementIds.oldSchoolContentId));

      $('<input/>',{
        id : settings.elementIds.oldSchoolContentInputId,
        type : 'text'
      }).appendTo($('#'+settings.elementIds.oldSchoolContentInputDivId));

/*
      var initialContent = ( settings.showMonitor ? '<img src="img/vintageMonitor.png" id="vintageMonitor" />' : '' ) +
        '<div id="oldSchoolContent" contenteditable="false">' +
        '<div id="oldSchoolContentText"></div><br/>' +
        '<div id="oldSchoolContentInputDiv">' +
        '>&nbsp;<input id="oldSchoolContentInput" type="text">' +
        '</div>' +
        '</div>'

      // Add the content div for inserting text
      $(el).html( initialContent );
*/
      // Hide the input div containing the prompt
      $('#'+settings.elementIds.oldSchoolContentInputDivId).hide()

      // Make it nice and green
      $(el).addClass('wrapper');

      // Create event handler for enter key if prompt is enabled
      if (settings.promptEnabled) {
        $(el).on('keyup.vintageTxt', plugin.inputSubmit );
      }

      $(el).click(function() {
        if ( $('#'+settings.elementIds.oldSchoolContentInputId) )
          $('#'+settings.elementIds.oldSchoolContentInputId).focus();
      });

    },

    /**
     * This is the function that types out the
     * text string/array in settings.text one
     * character at a time.
     */
    startTyping : function startTyping( settings ) {

      //Set the initial vars for tracking the characters and rows
      var index      = 0
        , text_pos   = 0
        , str_length = settings.text[0].length
        , contents
        , row;

      /**
       * This iterates over the characters in settings.text
       * and is called recursively via setTimeout.
       */
      var typeText = function typeText() {
        // Clear the temporary text contents
        contents = '';

        // Add back the previously typed rows to 'contents' (up to maxRows)
        row = Math.max( 0, index - settings.maxRows + 1 );
        while( row < index )  {
          contents += settings.text[row++] + '<br/>';
        }

        // Spit the contents onto the page
        $('#'+settings.elementIds.oldSchoolContentTextId).html(contents + settings.text[index].substring(0,text_pos) );

        /**
         * Increment text_pos and compare it to the length of the current row.
         * If the end of the row is reached, reset text_pos and increment
         * the row index value.
         */
        if( text_pos++ == str_length )
        {
          text_pos=0;
          index++;

          // If not at the end of the last row, start the next one.
          if( index != settings.text.length )
          {
            str_length = settings.text[index].length;
            setTimeout(typeText,800);
          } else {
            // Otherwise stop typing.
            plugin.endTyping();
          }
        } else {
          // Keep typing letters
          setTimeout(typeText,settings.textSpeed);
        }
      };

      // First call to typeText to get the ball rolling.
      typeText();
    },

    /**
     * Show the user prompt if enabled.
     * Also execute callback if it exists.
     */
    endTyping : function endTyping() {
      if ( settings.promptEnabled ) plugin.showPrompt();
      if ( settings.onFinishedTyping ) settings.onFinishedTyping();
    },

    /**
     * Unhide the prompt and give it focus.
     */
    showPrompt : function showPrompt() {
      $('#'+settings.elementIds.oldSchoolContentInputDivId).show();
      $('#'+settings.elementIds.oldSchoolContentInputId).focus();
    },

    /**
     * Event handler for pressing a key.
     * Checks for the 'Enter' key, then if any
     * content exists in the prompt.
     */
    inputSubmit : function inputSubmit( e ) {
      var code = (e.keyCode ? e.keyCode : e.which);
      if( code == 13 ) { //Enter keycode
        if ( $('#'+settings.elementIds.oldSchoolContentInputId).val() ) {
          settings.onEnterKey ? settings.onEnterKey( e ) : plugin.doRandomSnark();
          $('#'+settings.elementIds.oldSchoolContentInputId).val('');
          $('#'+settings.elementIds.oldSchoolContentInputDivId).hide();
        }
      }
    },

    doRandomSnark : function doRandomSnark() {
      methods.reset([$('#'+settings.elementIds.oldSchoolContentInputId).val(),plugin.getRandomSnark()]);
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