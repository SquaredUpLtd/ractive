define([ 'ractive' ], function ( Ractive ) {

	'use strict';

	return function () {

		var fixture = document.getElementById( 'qunit-fixture' );

		module( 'Yield' );

		test( 'Basic yield', function ( t ) {
			var Widget, ractive;

			Widget = Ractive.extend({
				template: '<p>{{yield}}</p>'
			});

			ractive = new Ractive({
				el: fixture,
				template: '<widget>yeah!</widget>',
				components: { widget: Widget }
			});

			t.htmlEqual( fixture.innerHTML, '<p>yeah!</p>' );
		});

		test( 'References are resolved in parent context', function ( t ) {
			var Widget, ractive;

			Widget = Ractive.extend({
				template: '<p>{{yield}}</p>',
				isolated: true
			});

			ractive = new Ractive({
				el: fixture,
				template: '<widget>{{foo}}</widget>',
				data: { foo: 'yeah!' },
				components: { widget: Widget }
			});

			t.htmlEqual( fixture.innerHTML, '<p>yeah!</p>' );
		});

		test( 'References are resolved in parent context through multiple layers', function ( t ) {
			var Widget, WidgetInner, Middle, ractive;

			WidgetInner = Ractive.extend({
				template: '<p>{{yield}}</p>',
				isolated: true
			});

			Widget = Ractive.extend({
				template: '<widget-inner>{{yield}}</widget-inner>',
				isolated: true,
				components: { 'widget-inner': WidgetInner }
			});

			Middle = Ractive.extend({
				template: '<strong>{{yield}}</strong>'
			});

			ractive = new Ractive({
				el: fixture,
				template: '<widget><middle>{{foo}}</middle></widget>',
				data: { foo: 'yeah!' },
				components: { widget: Widget, middle: Middle }
			});

			t.htmlEqual( fixture.innerHTML, '<p><strong>yeah!</strong></p>' );
		});

		test( 'Events fire in parent context', function ( t ) {
			var Widget, WidgetInner, Middle, ractive;

			WidgetInner = Ractive.extend({
				template: '<p>{{yield}}</p>',
				isolated: true
			});

			Widget = Ractive.extend({
				template: '<widget-inner>{{yield}}</widget-inner>',
				isolated: true,
				components: { 'widget-inner': WidgetInner }
			});

			Middle = Ractive.extend({
				template: '<strong>{{yield}}</strong>'
			});

			ractive = new Ractive({
				el: fixture,
				template: '<widget><middle><button on-click="test(foo)">click me</button></middle></widget>',
				data: { foo: 'yeah!' },
				components: { widget: Widget, middle: Middle }
			});

			ractive.test = function ( foo ) {
				t.equal( foo, 'yeah!' );
			};

			expect( 1 );
			simulant.fire( ractive.find( 'button' ), 'click' );
		});

		test( 'A component can only have one {{yield}}', function ( t ) {
			var Widget, ractive;

			Widget = Ractive.extend({
				template: '<p>{{yield}}{{yield}}</p>'
			});

			try {
				ractive = new Ractive({
					el: fixture,
					template: '<widget>yeah!</widget>',
					components: { widget: Widget }
				});
			} catch ( err ) {
				t.equal( err.message, 'A component template can only have one {{yield}} declaration' );
			}
		});

	};

});