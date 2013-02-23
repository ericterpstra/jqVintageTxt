(function( $ ) {

  var methods = {

    /**
     * Initialize the ting
     * @param options
     * @return {*}
     */
    init : function( options ) {

      var settings = $.extend( {
        'textSpeed' : 30,
        'linePause' : 800,
        'text'      : ['All your base','are belong to us.']
      }, options );


      return this.each( function() {
        this.appendTo('<div id="oldSchoolContent" contenteditable="false"></div>');
        var index      = 0
          , text_pos   = 0
          , str_length = settings.text[0].length
          , contents
          , row;

        function type_text() {
          contents='';
          row=Math.max(0,index-9);
          while(row<index)  {
            contents += settings.text[row++] + '<br/>';
          }
          $('#oldSchoolContent').html(contents + settings.text[index].substring(0,text_pos) );
          if(text_pos++==str_length)
          {
            text_pos=0;
            index++;
            if(index!=settings.text.length)
            {
              str_length=settings.text[index].length;
              setTimeout(type_text,800);
            }
          } else
            setTimeout(type_text,settings.textSpeed);
        }

      });

    }
  }

  /**
   * Define the Plugin
   * @param Initial options object or method name
   * @return {*}
   */
  $.fn.oldSchool = function( methods ) {

    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
    }

  };
})( jQuery );