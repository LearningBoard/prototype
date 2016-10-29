/**
 * Acknowledgement:
 * Some code of this plugin come from autoembed (http://ckeditor.com/addon/autoembed)
 */

'use strict';

( function() {
	var validLinkRegExp = /^<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>$/i;

	CKEDITOR.plugins.add( 'autoiframe', {
		requires: 'autolink,contextmenu',
		init: function( editor ) {
			editor.on( 'paste', function( evt ) {
				if ( evt.data.dataTransfer.getTransferType( editor ) == CKEDITOR.DATA_TRANSFER_INTERNAL ) {
					return;
				}

				var match = evt.data.dataValue.match( validLinkRegExp );
				if ( match != null && decodeURI( match[ 1 ] ) == decodeURI( match[ 2 ] ) ) {
					evt.data.dataValue = '<iframe src="' + decodeURI( match[ 1 ] ) + '" width="100%" height="400" frameborder="1" scrolling="yes"></iframe><br /><small>Source: <a href="' + decodeURI( match[ 1 ] ) + '" target="_blank">' + decodeURI( match[ 1 ] ) + '</a></small>';
					evt.data.type = 'html';
				}
			}, null, null, 20 ); // Execute after autolink.

			editor.addCommand( 'removeautoiframe', {
				exec: function( editor ) {
					var element = editor.getSelection().getSelectedElement();
					if ( element && element.is( 'img' ) && element.data( 'cke-real-element-type' ) == 'iframe' ) {
						var raw = decodeURIComponent( element.data( 'cke-realelement' ) );
						var a = raw.match( /src="(.*?)"/i );
						element.$.outerHTML = '<a href="' + a [ 1 ] + '" target="_blank">' + a[ 1 ] + '</a>';
						editor.getSelection().getStartElement().scrollIntoView();
						editor.getSelection().getStartElement().focus();
					}
				}
			} );

			if ( editor.contextMenu ) {
				editor.addMenuItem( 'autoiframeItem', {
					label: 'Remove inline frame',
					command: 'removeautoiframe',
					group: 'image'
				} );

				editor.contextMenu.addListener( function( element ) {
					if ( element && element.is( 'img' ) && element.data( 'cke-real-element-type' ) == 'iframe' ) {
						return {autoiframeItem: CKEDITOR.TRISTATE_OFF};
					}
				} );
			}
		}
	} );

} )();
