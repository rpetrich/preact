/* eslint-disable no-console */

if (process.env.NODE_ENV === 'development') {
	const { options } = require('preact');
	const oldVnodeOption = options.vnode;

	options.vnode = function(vnode) {
		const { nodeName, attributes, children } = vnode;

		if (nodeName === void 0) {
			console.error('Undefined component passed to preact.h()\n'+serializeVNode(vnode));
		}

		if (
			attributes && attributes.ref !== void 0 &&
			typeof attributes.ref !== 'function' &&
			!('$$typeof' in vnode)  // allow string refs when preact-compat is installed
		) {
			throw new Error(
				`Component's "ref" property should be a function,` +
				` but [${typeof attributes.ref}] passed\n` + serializeVNode(vnode)
			);
		}

		{
			const keys = {};

			inspectChildren(children, (deepChild) => {
				if (!deepChild || deepChild.key==null) return;

				// In Preact, all keys are stored as object values, i.e. being strings
				const key = deepChild.key + '';

				if (keys.hasOwnProperty(key)) {
					console.error(
						'Following component has two or more children with the ' +
						'same "key" attribute. This may cause glitches and misbehavior ' +
						'in rendering process. Component: \n\n' +
						serializeVNode(vnode)
					);

					// Return early to not spam the console
					return true;
				}

				keys[key] = true;
			});
		}

		if (oldVnodeOption) oldVnodeOption.call(this, vnode);
	};

	const inspectChildren = (children, inspect) => {
		if (!Array.isArray(children)) {
			children = [children];
		}
		return children.some((child, i) => {
			if (Array.isArray(child)) {
				return inspectChildren(child, inspect);
			}

			return inspect(child, i);
		});
	};

	const serializeVNode = ({ nodeName, attributes, children }) => {
		if (typeof nodeName==='function') {
			nodeName = nodeName.name || nodeName.displayName;
		}

		let props = '';
		if (attributes) {
			for (let attr in attributes) {
				if (attributes.hasOwnProperty(attr) && attr!=='children') {
					let value = attributes[attr];

					// If it is an object but doesn't have toString(), use Object.toString
					if (typeof value==='function') {
						value = `function ${value.displayName || value.name}() {}`;
					}
					if (Object(value) === value && !value.toString) {
						value = Object.prototype.toString.call(value);
					}
					else {
						value = value + '';
					}

					props += ` ${attr}=${JSON.stringify(value)}`;
				}
			}
		}

		return `<${nodeName}${props}${children && children.length ? ('>..</'+nodeName+'>') : ' />'}`;
	};

	require('preact/devtools');
}
