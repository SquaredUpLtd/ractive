import runloop from 'global/runloop';

export default function Triple$setValue ( value ) {
	var wrapper;

	// TODO is there a better way to approach this?
	if ( wrapper = this.context.wrapper ) {
		value = wrapper.get();
	}

	if ( value !== this.value ) {
		this.value = value;
		this.parentFragment.bubble();

		if ( this.rendered ) {
			runloop.addView( this );
		}
	}
}