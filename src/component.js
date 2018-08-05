import { FORCE_RENDER } from './constants';
import { extend } from './util';
import { renderComponent, catchErrorInComponent } from './vdom/component';
import { enqueueRender } from './render-queue';
/**
 * Base Component class.
 * Provides `setState()` and `forceUpdate()`, which trigger rendering.
 * @typedef {object} Component
 * @param {object} props The initial component props
 * @param {object} context The initial context from parent components' getChildContext
 * @public
 *
 * @example
 * class MyFoo extends Component {
 *   render(props, state) {
 *     return <div />;
 *   }
 * }
 */
export function Component(props, context) {
	this._dirty = true;
	this._caught = false;

	/**
	 * @public
	 * @type {object}
	 */
	this.context = context;

	/**
	 * @public
	 * @type {object}
	 */
	this.props = props;

	/**
	 * @public
	 * @type {object}
	 */
	this.state = this.state || {};

	this._renderCallbacks = [];

	this._options = undefined;
}


extend(Component.prototype, {

	/**
	 * Update component state and schedule a re-render.
	 * @param {object} state A dict of state properties to be shallowly merged
	 * 	into the current state, or a function that will produce such a dict. The
	 * 	function is called with the current state and props.
	 * @param {() => void} callback A function to be called once component state is
	 * 	updated
	 */
	setState(state, callback) {
		const prev = this.prevState = this.state;
		if (typeof state === 'function') state = state(prev, this.props);
		this.state = extend(extend({}, prev), state);
		if (callback) this._renderCallbacks.push(callback);
		enqueueRender(this);
	},


	/**
	 * Immediately perform a synchronous re-render of the component.
	 * @param {() => void} callback A function to be called after component is
	 * 	re-rendered.
	 * @private
	 */
	forceUpdate(callback) {
		if (callback) this._renderCallbacks.push(callback);
		renderComponent(this, FORCE_RENDER);
	},


	/**
	 * Accepts `props` and `state`, and returns a new Virtual DOM tree to build.
	 * Virtual DOM is generally constructed via [JSX](http://jasonformat.com/wtf-is-jsx).
	 * @param {object} props Props (eg: JSX attributes) received from parent
	 * 	element/component
	 * @param {object} state The component's current state
	 * @param {object} context Context object, as returned by the nearest
	 *  ancestor's `getChildContext()`
	 * @returns {import('./vnode').VNode | void}
	 */
	render() {},

	/**
	 * Raises an error for an ancestor component to handle in its `componentDidCatch` method
	 * @param {object} e The error to raise
	 * @returns {void}
	 */
	raiseError(e) {
		catchErrorInComponent(e, this._ancestorComponent);
	}

});
