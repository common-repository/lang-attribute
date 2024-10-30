import { __ } from '@wordpress/i18n';

// PART : Screen reader text format
// ( function( wp ) {
// 	// Custom button for the editor toolbar
// 	let customButton = function( props ) {
// 		return wp.element.createElement(
// 			wp.editor.RichTextToolbarButton, {
// 				icon    : 'tablet',
// 				title   : __( 'Screen Reader Text', 'lang-attribute' ),
// 				isActive: props.isActive,
// 				onClick : function() {
// 					console.log( 'Custom Button Clicked!' );
// 					props.onChange( wp.richText.toggleFormat(
// 						props.value,
// 						{ type: 'lang-attribute/format-screen-reader-text' }
// 					) );
// 				}
// 			}
// 		)
// 	}
	
// 	// Register the screen reader format type used with the custom button on richText component
// 	wp.richText.registerFormatType( 'lang-attribute/format-screen-reader-text', {
// 		title    : __( 'Screen Reader Text', 'lang-attribute' ),
// 		tagName  : 'span',
// 		className: 'screen-reader-text',
// 		edit     : customButton
// 	} )
// } )( window.wp )



import './index.scss';

import { BlockControls, RichTextToolbarButton } from '@wordpress/block-editor';
import { TextControl, SelectControl, Button, Popover } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { registerFormatType, applyFormat, removeFormat, useAnchorRef } from '@wordpress/rich-text';
import { ENTER } from '@wordpress/keycodes';

const LangAttributeButton = ( props ) => {
	const { contentRef, isActive, onChange, value } = props;
	const anchorRef = useAnchorRef( { ref: contentRef, value } );
	
	const [ lang, setLang ] = useState( '' );
    const [ dir, setDir ] = useState( 'ltr' );

	const [ isPopoverVisible, setIsPopoverVisible ] = useState( false );
	const togglePopover = () => {
		setIsPopoverVisible( ( state ) => ! state );
		setLang( '' )
		setDir( 'ltr' )
	};

	return (
		<>
			<RichTextToolbarButton
				icon="translation"
				label={ __( 'Lang attribute', 'lang-attribute' ) }
				title={ __( 'Lang attribute', 'lang-attribute' ) }
				onClick={ () => {
					if ( isActive ) {
						onChange( removeFormat( value, 'lang-attribute/format-lang-attribute' ) );
					} else {
						togglePopover()
					}
				} }
				isActive={ isActive }
			/>

			{ isPopoverVisible && (
				<Popover
					className="components-lang-attribute-popover"
					anchor={ anchorRef }
					position="bottom center"
				>
					<TextControl
						label={ __( 'Lang attribute', 'lang-attribute' ) }
						value={ lang }
						onChange={ lang => setLang( lang ) }
					/>
					<p class="lang-attribute-info">
						<em>{ __( 'Should be a valid lang attribute, like "en" or "fr".', 'lang-attribute' ) }</em>
					</p>

					<SelectControl
						label={ __( 'Text direction', 'lang-attribute' ) }
						value={ dir }
						options={[
							{ label: __( 'Left to right', 'lang-attribute' ), value: 'ltr' },
							{ label: __( 'Right to left', 'lang-attribute' ), value: 'rtl' },
						]}
						onChange={ dir => setDir( dir ) }
					/>
					<Button
						isPrimary
						text={ __( 'Apply', 'lang-attribute' ) }
						onClick={ () => {
							onChange(
								applyFormat( value, {
									type: 'lang-attribute/format-lang-attribute',
									attributes: {
										lang: lang,
										dir: dir
									}
								} )
							)
							togglePopover()
						} }
					/>
				</Popover>
			) }
		</>
	)
};
		
// Register the Format.
registerFormatType( 'lang-attribute/format-lang-attribute', {
	className: 'lang-attribute',
	edit     : LangAttributeButton,
	tagName  : 'span',
	icon     : 'translation',
	title    : __( 'Lang attribute', 'lang-attribute' ),
} );