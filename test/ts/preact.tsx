import { h, render, Component, ComponentProps, FunctionalComponent } from "../../src/preact";

interface DummyProps {
	initialInput: string;
}

interface DummyState {
	input: string;
}

class DummyComponent extends Component<DummyProps, DummyState> {
	constructor(props: DummyProps) {
		super(props);
		this.state = {
			input: `x${this.props}x`
		}
	}

	render({ initialInput }: DummyProps, { input }: DummyState) {
		return <DummerComponent initialInput={initialInput} input={input} />
	}
}

interface DummerComponentProps extends DummyProps, DummyState {

}

function DummerComponent({ input, initialInput }: DummerComponentProps) {
	return <div>Input: {input}, initial: {initialInput}</div>;
}

render(h(DummerComponent, { initialInput: "The input" }), document);

// Accessing children
const ComponentWithChildren: FunctionalComponent<DummerComponentProps> = ({ input, initialInput, children }) => {
	return <div>
		<span>{initialInput}</span>
		<span>{input}</span>
		<span>{children}</span>
	</div>
}

const UseOfComponentWithChildren = () => {
	return (
		<ComponentWithChildren initialInput="initial" input="input">
			<span>child 1</span>
			<span>child 2</span>
		</ComponentWithChildren>
	);
}


// using ref and or jsx
class ComponentUsingRef extends Component<any, any> {
	private array: string[];
	private refs: Element[];

	constructor() {
		super();
		this.array = ["1", "2"];
	}

	render() {
		this.refs = [];
		return <div jsx>
			{this.array.map(el =>
				<span ref={this.setRef}>{el}</span>
			)}
		</div>
	}

	private setRef = (el: Element) => {
		this.refs.push(el);
	}
}

// using lifecycles
class ComponentWithLifecycle extends Component<DummyProps, DummyState> {

	render() {
		return <div>Hi</div>
	}

	componentWillMount() {
		console.log("componentWillMount");
	}

	componentDidMount() {
		console.log("componentDidMount");
	}

	componentWillUnmount() {
		console.log("componentWillUnmount");
	}

	componentWillReceiveProps(nextProps: DummyProps, nextCtx: any) {
		const { initialInput } = nextProps;
		console.log("componentWillReceiveProps", initialInput, nextCtx);
	}

	shouldComponentUpdate(nextProps: DummyProps, nextState: DummyState, nextContext: any) {
		return false;
	}

	componentWillUpdate(nextProps: DummyProps, nextState: DummyState, nextContext: any) {
		console.log("componentWillUpdate", nextProps, nextState, nextContext);
	}

	componentDidUpdate(previousProps: DummyProps, previousState: DummyState, previousContext: any) {
		console.log("componentDidUpdate", previousProps, previousState, previousContext);
	}
}
