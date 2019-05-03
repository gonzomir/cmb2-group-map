window.CMB2Map = window.CMB2Map || {};

( function( window, document, $, l10n, app, undefined ) {
	'use strict';

	/**
	 * Kicked off when jQuery is ready.
	 *
	 * @since  0.1.0
	 */
	app.init = function() {

		$( '.cmb2-group-map-group' )
			// If removing a row, check if post should be deleted as well.
			.on( 'click', '.cmb-remove-group-row', app.maybeDelete );

	};

	/**
	 * When clicking "remove", check if user intends to delete
	 * associated post.
	 *
	 * @since  0.1.0
	 *
	 * @param  {object} evt Click event object
	 */
	app.maybeDelete = function( evt ) {
		evt.preventDefault();

		var $btn = $( this );
		// TODO: This won't work this way, maybe we could do that entirely in the backend?
		var post_id = $btn.next().find( 'input' ).val();

		// Check with user.. Delete the post as well?
		if ( post_id && window.confirm( l10n.strings.delete_permanent ) ) {
			app.doDelete( $btn, post_id );
		}
	};

	/**
	 * Handles deleting the associated group's post object.
	 *
	 * @since  0.1.0
	 *
	 * @param  {object} $btn jQuery object for the delete button.
	 */
	app.doDelete = function( $btn, post_id ) {
		var groupData = $btn.parents( '.cmb2-group-map-group' ).data();

		var deleteFail = function() {
			app.logError( 'Sorry! unable to delete '+ post_id +'!' );
		};

		// Check if requirements are all here.
		if ( ! post_id || ! groupData.groupid ) {
			return deleteFail();
		}

		var params = {
			action   : 'cmb2_group_map_delete_item',
			ajaxurl  : l10n.ajaxurl,
			post_id  : post_id,
			host_id  : document.getElementById( 'post_ID' ).value,
			nonce    : groupData.nonce,
			group_id : groupData.groupid
		};

		$.post( l10n.ajaxurl, params, function( response ) {
			if ( ! response.success ) {
				deleteFail();

				if ( response.data ) {
					app.logError( response.data );
				}
			}
		} ).fail( deleteFail );
	};

	/**
	 * Logs errors to the console.
	 *
	 * @since  0.1.0
	 */
	app.logError = function() {
		app.logError.history = app.logError.history || [];
		app.logError.history.push( arguments );
		if ( window.console ) {
			window.console.error( Array.prototype.slice.call( arguments) );
		}
	};

	// kick it off.
	$( app.init );

} )( window, document, jQuery, window.CMB2Mapl10n, window.CMB2Map );
