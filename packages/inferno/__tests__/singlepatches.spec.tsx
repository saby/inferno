import { Component, Fragment, render } from 'inferno';
import sinon, { assert } from 'sinon';
import {innerHTML} from "inferno-utils";

describe('All single patch variations', () => {
  const templateRefSpy = sinon.spy();
  let container;
  let mountSpy;
  let updateSpy;
  let unmountSpy;

  beforeEach(function() {
    mountSpy.resetHistory();
    updateSpy.resetHistory();
    unmountSpy.resetHistory();
    templateRefSpy.resetHistory();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(function() {
    render(null, container);
    container.innerHTML = '';
    document.body.removeChild(container);
  });

  function rTemplate(content) {
    return render(<div>{[content]}</div>, container);
  }

  function tearDown() {
    render(null, container);
    expect(container.innerHTML).toBe('');
  }

  /* tslint:disable:no-empty */
  class ComA extends Component<any, any> {
    public componentDidMount() {}

    public componentWillMount() {}

    public componentWillReceiveProps(_nextProps, _nextContext) {}

    public shouldComponentUpdate(_nextProps, _nextState, _nextContext) {
      return true;
    }

    public componentWillUpdate(_nextProps, _nextState, _nextContext) {}

    public componentDidUpdate(_prevProps, _prevState, _prevContext) {}

    public componentWillUnmount() {}

    public render({ children }) {
      return children;
    }
  }
  /* tslint:enable */

  mountSpy = sinon.spy(ComA.prototype, 'componentWillMount');
  updateSpy = sinon.spy(ComA.prototype, 'componentWillUpdate');
  unmountSpy = sinon.spy(ComA.prototype, 'componentWillUnmount');

  describe('Text to', () => {
    let node;

    beforeEach(() => {
      rTemplate('text');
      expect(container.innerHTML).toEqual('<div>text</div>');
      node = container.firstChild.firstChild;
    });

    it('text', () => {
      rTemplate('more text');
      expect(container.innerHTML).toEqual('<div>more text</div>');

      expect(container.firstChild.firstChild).toBe(node);

      rTemplate('more text2');
      expect(container.innerHTML).toEqual('<div>more text2</div>');

      expect(container.firstChild.firstChild).toBe(node);
      tearDown();
    });

    it('invalid', () => {
      rTemplate(false);
      expect(container.innerHTML).toEqual('<div></div>');

      expect(container.firstChild.firstChild).toBe(null);

      rTemplate(null);
      expect(container.innerHTML).toEqual('<div></div>');

      expect(container.firstChild.firstChild).toBe(null);
      tearDown();
    });

    it('vNode (elem)', () => {
      const spy = sinon.spy();

      rTemplate(<span ref={spy}>1</span>);
      expect(container.innerHTML).toEqual('<div><span>1</span></div>');

      expect(spy.callCount).toBe(1);

      rTemplate(<span ref={spy}>2</span>);
      expect(container.innerHTML).toEqual('<div><span>2</span></div>');

      expect(spy.callCount).toBe(1);
      tearDown();
    });

    it('vNode (com)', () => {
      const spy = sinon.spy();

      rTemplate(<ComA ref={spy}>1</ComA>);
      expect(container.innerHTML).toEqual('<div>1</div>');
      expect(mountSpy.callCount).toBe(1);
      expect(updateSpy.callCount).toBe(0);
      expect(unmountSpy.callCount).toBe(0);
      expect(spy.callCount).toBe(1);

      rTemplate(<ComA ref={spy}>2</ComA>);
      expect(container.innerHTML).toEqual('<div>2</div>');
      expect(mountSpy.callCount).toBe(1);
      expect(updateSpy.callCount).toBe(1);
      expect(unmountSpy.callCount).toBe(0);
      expect(spy.callCount).toBe(1);

      tearDown();
    });

    it('Array', () => {
      const spy = sinon.spy();

      rTemplate([<ComA ref={spy}>1</ComA>, 'foo']);
      expect(container.innerHTML).toEqual('<div>1foo</div>');
      expect(mountSpy.callCount).toBe(1);
      expect(updateSpy.callCount).toBe(0);
      expect(unmountSpy.callCount).toBe(0);
      expect(spy.callCount).toBe(1);

      rTemplate([<ComA ref={spy}>2</ComA>, null]);
      expect(container.innerHTML).toEqual('<div>2</div>');
      expect(mountSpy.callCount).toBe(1);
      expect(updateSpy.callCount).toBe(1);
      expect(unmountSpy.callCount).toBe(0);
      expect(spy.callCount).toBe(1);

      tearDown();
    });
  });

  describe('Component to', () => {
    beforeEach(() => {
      rTemplate(<ComA ref={templateRefSpy}>first</ComA>);
      expect(templateRefSpy.callCount).toBe(1);
      templateRefSpy.resetHistory();
      expect(container.innerHTML).toEqual('<div>first</div>');
      expect(unmountSpy.callCount).toBe(0);
      expect(mountSpy.callCount).toBe(1);
      expect(updateSpy.callCount).toBe(0);
    });

    it('text', () => {
      rTemplate('more text');
      expect(container.innerHTML).toEqual('<div>more text</div>');
      expect(unmountSpy.callCount).toBe(1);
      expect(mountSpy.callCount).toBe(1);
      expect(updateSpy.callCount).toBe(0);

      rTemplate('more text2');
      expect(container.innerHTML).toEqual('<div>more text2</div>');
      tearDown();
    });

    it('invalid', () => {
      rTemplate(false);
      expect(container.innerHTML).toEqual('<div></div>');
      expect(unmountSpy.callCount).toBe(1);
      expect(mountSpy.callCount).toBe(1);
      expect(updateSpy.callCount).toBe(0);

      expect(container.firstChild.firstChild).toBe(null);

      rTemplate(null);
      expect(container.innerHTML).toEqual('<div></div>');

      expect(container.firstChild.firstChild).toBe(null);
      tearDown();
    });

    it('vNode (elem)', () => {
      const spy = sinon.spy();
      expect(templateRefSpy.callCount).toBe(0);

      rTemplate(
        <div ref={spy} className="component2">
          Component 2 <br />
          <span id="clear">clear app</span>
        </div>
      );
      expect(templateRefSpy.callCount).toBe(1); // unmount
      expect(unmountSpy.callCount).toBe(1);
      expect(spy.callCount).toBe(1);
      expect(updateSpy.callCount).toBe(0);
      expect(container.innerHTML).toEqual('<div><div class="component2">Component 2 <br><span id="clear">clear app</span></div></div>');
      assert.callOrder(templateRefSpy, spy); // Unmount should happen before mount

      rTemplate(<span ref={spy}>2</span>);
      expect(container.innerHTML).toEqual('<div><span>2</span></div>');

      expect(spy.callCount).toBe(3); // mount, unmount, mount
      tearDown();
    });

    it('vNode (Com different)', () => {
      class ComC extends Component<any, any> {
        // tslint:disable-next-line
        componentWillMount() {}

        public render({ children }) {
          return children;
        }
      }

      const spy = sinon.spy(ComC.prototype, 'componentWillMount');

      rTemplate(<ComC>second</ComC>);

      assert.callOrder(unmountSpy, spy); // first unmount then mount

      tearDown();
    });
  });

  describe('children', () => {
    describe('HasKeyedChildren', () => {
      it('Should update from Array to single vNode', () => {
        render(<div $HasKeyedChildren>{[<div key="1">1</div>, <div key="2">2</div>]}</div>, container);

        expect(container.innerHTML).toEqual('<div><div>1</div><div>2</div></div>');

        render(
          <div>
            <div>single</div>
          </div>,
          container
        );

        expect(container.innerHTML).toEqual('<div><div>single</div></div>');

        // Revert
        render(<div $HasKeyedChildren>{[<div key="1">1</div>, <div key="2">2</div>]}</div>, container);

        expect(container.innerHTML).toEqual('<div><div>1</div><div>2</div></div>');
      });
    });

    describe('hasNonKeyedChildren', () => {
      it('Should update from Array to single vNode', () => {
        render(<div $HasNonKeyedChildren>{[<div>1</div>, <div>2</div>]}</div>, container);

        expect(container.innerHTML).toEqual('<div><div>1</div><div>2</div></div>');

        render(
          <div>
            <div>single</div>
          </div>,
          container
        );

        expect(container.innerHTML).toEqual('<div><div>single</div></div>');

        // Revert
        render(<div $HasNonKeyedChildren>{[<div>1</div>, <div>2</div>]}</div>, container);

        expect(container.innerHTML).toEqual('<div><div>1</div><div>2</div></div>');
      });
    });
  });

  describe('defaultHooks', () => {
    it('Should never update if defaultProps refs SCU returns false', () => {
      let counter = 0;

      const Static = function() {
        return <div>{counter}</div>;
      };

      Static.defaultHooks = {
        onComponentShouldUpdate() {
          return false;
        }
      };

      function doRender() {
        render(
          <div>
            {counter}
            <Static />
          </div>,
          container
        );
      }

      doRender();
      expect(container.innerHTML).toEqual('<div>0<div>0</div></div>');
      counter++;
      doRender();
      expect(container.innerHTML).toEqual('<div>1<div>0</div></div>');
      counter++;
      doRender();
      expect(container.innerHTML).toEqual('<div>2<div>0</div></div>');
    });

    it('Should prefer external hook if given', () => {
      let counter = 0;
      let mountCounter = 0;

      const Static = function() {
        return <div>{counter}</div>;
      };

      Static.defaultHooks = {
        onComponentShouldUpdate() {
          return false;
        },
        onComponentWillMount() {
          mountCounter++;
        }
      };

      function doRender() {
        render(
          <div>
            {counter}
            <Static onComponentShouldUpdate={() => true} />
          </div>,
          container
        );
      }

      doRender();
      expect(container.innerHTML).toEqual('<div>0<div>0</div></div>');
      counter++;
      expect(mountCounter).toBe(1);
      doRender();
      expect(container.innerHTML).toEqual('<div>1<div>1</div></div>');
      counter++;
      expect(mountCounter).toBe(1);
      doRender();
      expect(container.innerHTML).toEqual('<div>2<div>2</div></div>');
      expect(mountCounter).toBe(1);
    });

    it('Should be possible to define default hooks and use spread operator', () => {
      let counter = 0;
      let mountCounter = 0;

      const Static = function() {
        return <div>{counter}</div>;
      };

      Static.defaultHooks = {
        onComponentShouldUpdate() {
          return false;
        },
        onComponentWillMount() {
          mountCounter++;
        }
      };

      const props = {
        ref: {
          onComponentShouldUpdate: () => true
        }
      };

      function doRender() {
        render(
          <div>
            {counter}
            <Static {...props} />
          </div>,
          container
        );
      }

      doRender();
      expect(container.innerHTML).toEqual('<div>0<div>0</div></div>');
      counter++;
      expect(mountCounter).toBe(1);
      doRender();
      expect(container.innerHTML).toEqual('<div>1<div>1</div></div>');
      counter++;
      expect(mountCounter).toBe(1);
      doRender();
      expect(container.innerHTML).toEqual('<div>2<div>2</div></div>');
      expect(mountCounter).toBe(1);
    });
  });

  describe('immutable children', () => {
    it('Should be possible to render frozen objects', () => {
      const EMPTY_ARRAY = [];
      Object.freeze(EMPTY_ARRAY);

      render(<div>{EMPTY_ARRAY}</div>, container);

      expect(container.innerHTML).toBe('<div></div>');

      render(<div>{EMPTY_ARRAY}</div>, container);

      expect(container.innerHTML).toBe('<div></div>');

      render(<div>{EMPTY_ARRAY}</div>, container);

      expect(container.innerHTML).toBe('<div></div>');

      render(<div>{null}</div>, container);
      expect(container.innerHTML).toBe('<div></div>');
    });

    it('Should be possible to render frozen objects #2', () => {
      const EMPTY_ARRAY = [];
      const TWO_NODES = [<div>1</div>, <div>2</div>];
      Object.freeze(EMPTY_ARRAY);
      Object.freeze(TWO_NODES);

      render(<div>{EMPTY_ARRAY}</div>, container);

      expect(container.innerHTML).toBe('<div></div>');

      render(<div>{TWO_NODES}</div>, container);

      expect(container.innerHTML).toBe('<div><div>1</div><div>2</div></div>');

      render(<div>{EMPTY_ARRAY}</div>, container);

      expect(container.innerHTML).toBe('<div></div>');

      render(<div>{null}</div>, container);
      expect(container.innerHTML).toBe('<div></div>');
    });
  });

  describe('it should use non keyed algorithm if its forced Github #1275', () => {
    it('last & prev are flagged $HasNonKeyedChildren', () => {
      render(<div $HasNonKeyedChildren>{[<div key="1">1</div>, <div key="2">2</div>]}</div>, container);

      const oldFirstNode = container.firstChild.firstChild;
      expect(container.innerHTML).toBe('<div><div>1</div><div>2</div></div>');

      render(<div $HasNonKeyedChildren>{[<div key="2">2</div>, <div key="1">1</div>]}</div>, container);

      expect(container.innerHTML).toBe('<div><div>2</div><div>1</div></div>');

      // It is forced to do non keyed, so elements are remounted
      expect(container.firstChild.firstChild).not.toBe(oldFirstNode);
    });
  });

  it('Should remount whole vNode tree when parent element vNode key changes', () => {
    let mountCallCount = 0;
    let unmountCallCount = 0;

    class ComponentFooBar extends Component<any, any> {
      public componentWillMount() {
        mountCallCount++;
      }

      public componentWillUnmount() {
        unmountCallCount++;
      }

      public render() {
        return <div>Component</div>
      }
    }

    render((
        <div>
          <div key="First"><ComponentFooBar/></div>
        </div>
      ),
      container
    );

    expect(container.innerHTML).toEqual(innerHTML('<div><div><div>Component</div></div></div>'));

    expect(mountCallCount).toBe(1);
    expect(unmountCallCount).toBe(0);


    render((
        <div>
          <div key="Another"><ComponentFooBar/></div>
        </div>
      ),
      container
    );

    expect(container.innerHTML).toEqual(innerHTML('<div><div><div>Component</div></div></div>'));

    expect(mountCallCount).toBe(2);
    expect(unmountCallCount).toBe(1);
  });

  it('Should handle situation where same element ref is used multiple times', () => {
    const div = <div>Fun</div>;

    render(
      <Fragment $HasNonKeyedChildren>
        {[
          div,
          div,
          <div $HasNonKeyedChildren>
            {div}
            <div $HasVNodeChildren>
              {div}
            </div>
          </div>,
          div
        ]}
      </Fragment>,
      container
    );

    expect(container.innerHTML).toBe('<div>Fun</div><div>Fun</div><div><div>Fun</div><div><div>Fun</div></div></div><div>Fun</div>');

    expect(container.$V.children[1].children[0]).not.toBe(container.$V.children[0]);
    expect(container.$V.children[0]).not.toBe(container.$V.children[3]);

    render(
      <Fragment $HasNonKeyedChildren>
        {[
          div,
          div,
          <div $HasNonKeyedChildren>
            {div}
            <div $HasVNodeChildren>
              {div}
            </div>
            {div}
          </div>,
          div
        ]}
      </Fragment>,
      container
    );

    expect(container.innerHTML).toBe('<div>Fun</div><div>Fun</div><div><div>Fun</div><div><div>Fun</div></div><div>Fun</div></div><div>Fun</div>');
    expect(container.$V.children[0]).not.toBe(container.$V.children[3]);
  });

  it('Should unmount root fragment with hoisted children', () => {
    const div = <div>Fun</div>;

    render(
      <Fragment $HasNonKeyedChildren>
        {[
          div,
          div,
          div,
          <div $HasNonKeyedChildren>
            {div}
            <div $HasVNodeChildren>
              {div}
            </div>
            {div}
          </div>,
          div,
          div,
          div
        ]}
      </Fragment>,
      container
    );

    render(null, container);

    expect(container.innerHTML).toBe('');

    render(null, container);
    render(null, container);
  });

  it('Should handle hoisted nodes correctly', () => {
    const div = <div>Fun</div>;

    function Okay() {
      return div;
    }

    const OkayHoisted = <Okay/>;

    function Nested() {
      return OkayHoisted;
    }

    class Foobar extends Component {
      public render() {
        return (
          <>
            {div}
            <span>Ok</span>
            <Okay/>
          </>
        )
      }
    }

    const NestedHoisted = <Nested />;
    const FooBarHoisted = <Foobar/>;

    render(
      <Fragment>
        {[
          FooBarHoisted,
          <Foobar/>,
          div,
          <div>
            {NestedHoisted}
            <div>
              {div}
            </div>
            {NestedHoisted}
          </div>,
          FooBarHoisted,
          div,
          div
        ]}
      </Fragment>,
      container
    );
    render(null, container);

    expect(container.innerHTML).toBe('');

    render(null, container);
    render(null, container);
  });

  it('Should not re-mount fragment contents', () => {
    class Foobar extends Component<any, {
      val: number
    }> {

      public state = {
        val: 1
      };

      constructor(props, context) {
        super(props, context);
      }

      public render() {
        return (
          <div onClick={() => this.setState({val: ++this.state.val})}>
            <span>{this.state.val}</span>
            {this.props.children}
          </div>
        )
      }
    }

    function Foobar2(props) {
      return <span className={props.data}>Foo</span>
    }

    render(
      <>
        <Foobar>
          <div>
            <Foobar2 data="first"/>
          </div>
          <>
            <>
              <Foobar2 data="second"/>
              <Foobar2 data="third"/>
            </>
          </>
        </Foobar>
      </>,
      container
    );

    expect(container.innerHTML).toBe('<div><span>1</span><div><span class="first">Foo</span></div><span class="second">Foo</span><span class="third">Foo</span></div>');

    const firstNode = container.querySelector('.first');
    const secondNode = container.querySelector('.second');

    container.firstChild.click();

    expect(container.innerHTML).toBe('<div><span>2</span><div><span class="first">Foo</span></div><span class="second">Foo</span><span class="third">Foo</span></div>');

    expect(container.querySelector('.first')).toBe(firstNode);
    expect(container.querySelector('.second')).toBe(secondNode);

    container.firstChild.click();

    expect(container.innerHTML).toBe('<div><span>3</span><div><span class="first">Foo</span></div><span class="second">Foo</span><span class="third">Foo</span></div>');

    expect(container.querySelector('.first')).toBe(firstNode);
    expect(container.querySelector('.second')).toBe(secondNode);
  });
});
