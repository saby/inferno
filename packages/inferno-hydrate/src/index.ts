import { isFunction, isInvalid, isNull, isNullOrUndef, throwError, warning, unescape } from 'inferno-shared';
import { ChildFlags, VNodeFlags } from 'inferno-vnode-flags';
import { VNode, _CI, _HI, _MT, _M, _MCCC, _ME, _MFCC, _MR, _MP, render, _PS, _CWCI, _queueWasabyControlChanges, _MWWC, _CWTN, _SWCNH, beforeRenderCallback, appendForFocuses} from 'inferno';

function checkIfHydrationNeeded(sibling: Node | Element | null): boolean {
  // @ts-ignore
  return !(sibling && sibling.tagName === 'SCRIPT' &&
  // @ts-ignore
            sibling.attributes && sibling.attributes['data-requiremodule']
  // @ts-ignore
          ) && !(sibling && sibling.tagName === 'LINK') &&
  // @ts-ignore
          !(sibling && sibling.tagName === 'STYLE');
}


function isSameInnerHTML(dom: Element, innerHTML: string): boolean {
  const tempdom = document.createElement('i');

  tempdom.innerHTML = innerHTML;
  return tempdom.innerHTML === dom.innerHTML;
}

function findLastDOMFromVNode(vNode: VNode) {
  let flags;
  let children;

  while (vNode) {
    flags = vNode.flags;

    if (flags & VNodeFlags.DOMRef) {
      return vNode.dom;
    }

    children = vNode.children;

    if (flags & VNodeFlags.Fragment) {
      vNode = vNode.childFlags === ChildFlags.HasVNodeChildren ? (children as VNode) : (children as VNode[])[children.length - 1];
    } else if (flags & VNodeFlags.ComponentClass) {
      vNode = (children as any).$LI;
    } else {
      vNode = children;
    }
  }

  return null;
}

function isSamePropsInnerHTML(dom: Element, props): boolean {
  return Boolean(props && props.dangerouslySetInnerHTML && props.dangerouslySetInnerHTML.__html && isSameInnerHTML(dom, props.dangerouslySetInnerHTML.__html));
}

function hydrateWasabyControl(vNode, parentDOM, currentDom, context, isSVG, lifecycle, isRootStart, environment, parentControlNode, parentVNode) {
  if (!environment.infernoQueue) {
    environment.infernoQueue = [];
  }
  if (!environment.asyncRenderIds) {
    environment.asyncRenderIds = {};
  }
  if (!environment.asyncAwaitRenderQueue) {
    environment.asyncAwaitRenderQueue = [];
  }
  let yVNode = _CWCI(vNode, parentDOM, isSVG, {}, lifecycle, isRootStart, environment, parentControlNode, parentVNode, true);
  const input = yVNode.instance.markup;
  let currentNode;
  if (input.type === 'invisible-node') {
    if (input.props && input.props.tabindex) {
      delete input.props.tabindex;
    } 
    currentNode = parentDOM;
  } else {
    currentNode = currentDom;
  }
  if (yVNode.carrier && yVNode.carrier.then) {
      if (yVNode.instance.control && yVNode.instance.control._forceUpdate) {
         environment.asyncRenderIds[yVNode.instance.id] = true;
         yVNode.instance.control._forceUpdate = function (memo) {
//               const lifecycle = [];
              // @ts-ignore
//               lifecycle.mount = [];
              if (memo === 'hydrate') {
                  delete environment.asyncRenderIds[yVNode.instance.id];
                  yVNode = _SWCNH(yVNode.instance, yVNode, parentVNode, false, parentDOM, lifecycle, environment);
                  lifecycle.mount.push(beforeRenderCallback(yVNode.instance));
                  hydrateVNode(yVNode, parentDOM, currentDom, context, isSVG, lifecycle, isRootStart, environment, parentControlNode, vNode);
                  // @ts-ignore
                  // lifecycle.mount.push(inferno._MWWC(yVNode.instance));
                  if (Object.keys(environment.asyncRenderIds).length === 0) {
                      if (lifecycle.length > 0) {
                          let listener;
                          while ((listener = lifecycle.shift()) !== undefined) {
                            listener();
                          }
                      }
                      // @ts-ignore
                      if (lifecycle.mount.length > 0) {
                        let listener;
                        // @ts-ignore
                        while ((listener = lifecycle.mount.shift()) !== undefined) {
                          listener();
                        }
                     }
                  }
              } else {
                _queueWasabyControlChanges(yVNode.instance);
              }
           };
       }
     yVNode.carrier.then(function (data) {
        yVNode.instance.receivedState = data;
        yVNode.carrier = undefined;
        yVNode.instance.control._forceUpdate('hydrate');
      }, function (error) {
          console.log("Hydrate error: ", error, yVNode.instance.control._moduleName);
      });
  } else {
      if (yVNode.instance.control && yVNode.instance.control._forceUpdate) {
         yVNode.instance.control._forceUpdate = function () {
               let asyncAwaitRenderItem;
               if (Object.keys(yVNode.instance.environment.asyncRenderIds).length === 0) {
                  _queueWasabyControlChanges(yVNode.instance);
                   if (yVNode.instance.environment.asyncAwaitRenderQueue && yVNode.instance.environment.asyncAwaitRenderQueue.length === 0) {
                      while ((asyncAwaitRenderItem = yVNode.instance.environment.asyncAwaitRenderQueue.pop())) {
                        _queueWasabyControlChanges(asyncAwaitRenderItem);
                      }
                   }
               } else {
                  yVNode.instance.environment.asyncAwaitRenderQueue.push(yVNode.instance);
               }
          };
      }
      lifecycle.mount.push(beforeRenderCallback(yVNode.instance));
      currentNode = hydrateVNode(input, parentDOM, currentDom, context, isSVG, lifecycle, isRootStart, environment, yVNode.instance, vNode);
      lifecycle.mount.push(_MWWC(yVNode.instance));
  }
  return currentNode;
}

// @ts-ignore
function hydrateTemplateWasabyNode(vNode, parentDOM, currentDom, context, isSVG, lifecycle, isRootStart, environment, parentControlNode, parentVNode?) {
  const yVNode = _CWTN(vNode, parentDOM, isSVG, vNode.sibling, lifecycle, isRootStart, environment, parentControlNode);
  yVNode.children = yVNode.markup;
  yVNode.childFlags = 12;
  yVNode.sibling = vNode.sibling;
  hydrateChildren(yVNode, parentDOM, currentDom, context, isSVG, lifecycle, environment, parentControlNode);
  return findLastDOMFromVNode(yVNode.markup[yVNode.markup.length - 1]);
}

function hydrateComponent(vNode: VNode, parentDOM: Element, dom: Element, context, isSVG: boolean, isClass: boolean, lifecycle: Function[]) {
  const type = vNode.type as Function;
  const ref = vNode.ref;
  const props = vNode.props || {};
  let currentNode;

  if (isClass) {
    const instance = _CI(vNode, type, props, context, isSVG, lifecycle);
    const input = instance.$LI;

    currentNode = hydrateVNode(input, parentDOM, dom, instance.$CX, isSVG, lifecycle);
    _MCCC(ref, instance, lifecycle);
    instance.$UPD = false; // Mount finished allow going sync
  } else {
    const input = _HI(type(props, context));
    currentNode = hydrateVNode(input, parentDOM, dom, context, isSVG, lifecycle);
    vNode.children = input;
    _MFCC(props, ref, vNode, lifecycle);
  }

  return currentNode;
}

// We have to ignore hydration on <head> tag completely.
// Because we don't need to modify or compare real <head> with generated one
// due to inconsistency of data on SSR/client.
function headGetsHydrated(dom) {
  if (dom.tagName && dom.tagName === 'HEAD') {
    return false;
  }
  return true;
}

function hasOnlyIgnoredChildren(dom) {
  // Check if every childNode in `dom` is ignored
  let child = dom.firstChild;
  // In case if we cheking 'head' for hydration, in order to keep head stable and not hydrated
  // we have to return true
  if (dom.tagName && dom.tagName === 'HEAD') {
    return true;
  }
  while (child && isIgnoredNode(child)) {
      child = child.nextSibling;
  }
  return !child;
}

function hydrateChildren(parentVNode: VNode, parentNode, currentNode, context, isSVG, lifecycle: Function[], environment?, parentControlNode?) {
  const childFlags = parentVNode.childFlags;
  const children = parentVNode.children;
  const props = parentVNode.props;
  const flags = parentVNode.flags;
  currentNode = isIgnoredNode(currentNode) ? skipIgnoredNode(currentNode) : currentNode;
  if (childFlags !== ChildFlags.HasInvalidChildren) {
    if (childFlags === ChildFlags.HasVNodeChildren) {
      if (isNull(currentNode)) {
        _M(children as VNode, parentNode, context, isSVG, null, lifecycle, false, environment, parentControlNode, parentVNode);
      } else {
        if (!isIgnoredNode(currentNode)) {
          currentNode = hydrateVNode(children as VNode, parentNode, currentNode as Element, context, isSVG, lifecycle, environment, parentControlNode);
        }
        currentNode = hydrateVNode(children as VNode, parentNode, currentNode as Element, context, isSVG, lifecycle, environment, parentControlNode);
        currentNode = currentNode ? currentNode.nextSibling : null;
      }
    } else if (childFlags === ChildFlags.HasTextChildren) {
      if (isNull(currentNode)) {
        parentNode.appendChild(document.createTextNode(children as string));
      } else if (parentNode.childNodes.length !== 1 || currentNode.nodeType !== 3) {
        parentNode.textContent = children as string;
      } else {
        if (currentNode.nodeValue !== children) {
          currentNode.nodeValue = children as string;
        }
      }
      currentNode = null;
    } else if (childFlags & ChildFlags.MultipleChildren) {
      let prevVNodeIsTextNode = false;

      for (let i = 0, len = (children as VNode[]).length; i < len; ++i) {
        const child = (children as VNode[])[i];
        
        // @ts-ignore
        if (child.controlClass || child.template) {
          // @ts-ignore
          child.sibling = children[i+1];
        }

        if (isNull(currentNode) || (prevVNodeIsTextNode && (child.flags & VNodeFlags.Text) > 0)) {
          _M(child as VNode, parentNode, context, isSVG, currentNode, lifecycle, false, environment, parentControlNode, parentVNode);
        } else {
          if (!isIgnoredNode(currentNode)) {
            currentNode = hydrateVNode(child as VNode, parentNode, currentNode as Element, context, isSVG, lifecycle, false, environment, parentControlNode, parentVNode);
          }
          currentNode = currentNode ? skipIgnoredNode(currentNode) : null;
        }

        prevVNodeIsTextNode = (child.flags & VNodeFlags.Text) > 0;
      }
    }

    // clear any other DOM nodes, there should be only a single entry for the root
    if ((flags & VNodeFlags.Fragment) === 0) {
      let nextSibling: Node | null = null;

      while (currentNode) {
        nextSibling = currentNode.nextSibling;
        if (!isIgnoredNode(currentNode)) {
          parentNode.removeChild(currentNode);
        }
        currentNode = nextSibling;
      }
    }
  } else if (!isNull(parentNode.firstChild) && !isSamePropsInnerHTML(parentNode, props) && !hasOnlyIgnoredChildren(parentNode)) {
    parentNode.textContent = ''; // dom has content, but VNode has no children remove everything from DOM
    if (flags & VNodeFlags.FormElement) {
      // If element is form element, we need to clear defaultValue also
      (parentNode as any).defaultValue = '';
    }
  }
}

const domPropertySearchMap = ['chrome-extension', 'mc.yandex.ru', 'kaspersky'];

const ignoredNodeId = ['ghostery-purple-box', 'StayFocusd-infobar'];

function domPropertySearch(domString) {
    return domPropertySearchMap.filter(function (value) {
        return domString.search(value) !== -1;
    }).length > 0;
}

function searchForExtension(domProperty) {
  return domProperty && domPropertySearch(domProperty);
}

function ignoreExtensionScripts(dom) {
  return dom &&
     dom.tagName === 'SCRIPT' &&
     (searchForExtension(dom.innerText) || searchForExtension(dom.getAttribute('src')));
}

function ignoreExtensionCSS(dom) {
  return dom &&
     dom.tagName === 'LINK' &&
     searchForExtension(dom.getAttribute('href'));
}

function ignoredById(node) {
  return ignoredNodeId.filter(function (value) {
    return node && node.id === value;
  }).length > 0
}

/* we have some node that needs to be ignored
* because it was created by requirejs*/
function isIgnoredNode(nextSibling) {
  return  (nextSibling && nextSibling.tagName === 'SCRIPT' &&
  nextSibling.attributes && nextSibling.attributes['data-requiremodule']) ||
  ignoreExtensionScripts(nextSibling) || ignoreExtensionCSS(nextSibling) ||
  (nextSibling && nextSibling.attributes && nextSibling.attributes['data-vdomignore']) ||
  /*ignore ghostery chrome plugin*/
  ignoredById(nextSibling);
}

function skipIgnoredNode(childNode) {
 let nextSibling;
  while (childNode) {
      nextSibling = childNode.nextSibling;
      if (!isIgnoredNode(nextSibling)) {
          return nextSibling;
      }
     childNode = nextSibling;
  }
}

// @ts-ignore
function hydrateElement(vNode: VNode, parentDOM: Element, dom: Element, context: Object, isSVG: boolean, lifecycle: Function[], isRootStart?: boolean, environment?, parentControlNode?, parentVNode?) {
  let props = vNode.props;
  const className = vNode.className;
  const flags = vNode.flags;
  let ref = vNode.ref;

  isSVG = isSVG || (flags & VNodeFlags.SvgElement) > 0;
  if (vNode.hprops && vNode.hprops.events && Object.keys(vNode.hprops.events).length > 0) {
    // @ts-ignore
    const setEventFunction = Hooks.setEventHooks(environment);
    const templateNodeEventRef = setEventFunction(vNode.type, vNode.hprops, vNode.children, vNode.key, parentControlNode, vNode.ref);
    vNode.ref = templateNodeEventRef[4];
    ref = vNode.ref;
  }
  if (dom.nodeType !== 1 || dom.tagName.toLowerCase() !== vNode.type) {
    if (process.env.NODE_ENV !== 'production') {
      warning("Inferno hydration: Server-side markup doesn't match client-side markup");
    }
    if (parentDOM.tagName === 'HTML' && dom.tagName === 'HTML') {
        _ME(vNode, parentDOM, context, isSVG, null, lifecycle, isRootStart, environment, parentControlNode);
    } else {
        _ME(vNode, null, context, isSVG, null, lifecycle, isRootStart, environment, parentControlNode);
    }
    if (isRootStart) {
      if (parentDOM.parentElement && parentDOM === dom) {
        parentDOM.parentElement.replaceChild(vNode.dom as Element, dom);
      }
    } else {
      parentDOM.replaceChild(vNode.dom as Element, dom);
    }
  } else {
    vNode.dom = dom;
    if (headGetsHydrated(dom)) {
      hydrateChildren(vNode, dom, dom.firstChild, context, isSVG, lifecycle, environment, parentControlNode);
    }
    if (!isNull(props)) {
      // when running hydrate we have to make sure all styles on dom elements are cleaned up
      if (!props.style) {
        _PS(undefined, undefined, dom);
      }
      if (vNode.type === 'iframe' && dom.nodeName === 'IFRAME') {
        // @ts-ignore
        if (props && props.src && dom.src && dom.src.indexOf(props.src) !== -1) {
          props = Object.keys(props)
            .filter(key => key !== 'src')
            .reduce((obj, key) => {
                obj[key] = props[key];
              return obj;
            }, {});
        }
      }
      _MP(vNode, flags, props, dom, isSVG);
    }
    if (isNullOrUndef(className)) {
      if (dom.className !== '') {
        dom.removeAttribute('class');
      }
    } else if (isSVG) {
      dom.setAttribute('class', className);
    } else {
      if (dom.className !== '') {
        dom.className = className;
      }
    }
    _MR(ref, dom, lifecycle);
  }
  appendForFocuses(vNode, environment);
  return vNode.dom;
}

function hydrateText(vNode: VNode, parentDOM: Element, dom: Element) {
  if (dom.nodeType !== 3) {
    _MT(vNode, null, null);
    parentDOM.replaceChild(vNode.dom as Element, dom);
  } else {
    const text = unescape(vNode.children);

    if (dom.nodeValue !== text) {
      dom.nodeValue = text as string;
    }
    vNode.dom = dom;
  }

  return vNode.dom;
}

function hydrateFragment(vNode: VNode, parentDOM: Element, dom: Element, context, isSVG: boolean, lifecycle: Function[]): Element {
  const children = vNode.children;

  if (vNode.childFlags === ChildFlags.HasVNodeChildren) {
    hydrateText(children as VNode, parentDOM, dom);

    return (children as VNode).dom as Element;
  }

  hydrateChildren(vNode, parentDOM, dom, context, isSVG, lifecycle);

  return findLastDOMFromVNode((children as VNode[])[(children as VNode[]).length - 1]) as Element;
}

function hydrateHTML(vNode: VNode, dom: Element) {
  if (dom.outerHTML !== vNode.markup) {
    dom.outerHTML = vNode.markup;
  }
  return dom;
}

function hydrateVNode(vNode: VNode, parentDOM: Element, currentDom: Element, context: Object, isSVG: boolean, lifecycle: Function[], isRootStart?: boolean, environment?, parentControlNode?, parentVNode?): Element | null {
  const flags = (vNode.flags |= VNodeFlags.InUse);

  if (flags & VNodeFlags.Component) {
    return hydrateComponent(vNode, parentDOM, currentDom, context, isSVG, (flags & VNodeFlags.ComponentClass) > 0, lifecycle);
  }
  // @ts-ignore
  if (vNode instanceof RawMarkupNode) {
    return hydrateHTML(vNode, currentDom);
  }
  if (flags & VNodeFlags.Element) {
    return hydrateElement(vNode, parentDOM, currentDom, context, isSVG, lifecycle, isRootStart, environment, parentControlNode);
  }
  if (flags & VNodeFlags.Text) {
    return hydrateText(vNode, parentDOM, currentDom);
  }
  if (flags & VNodeFlags.Void) {
    return (vNode.dom = currentDom);
  }
  if (flags & VNodeFlags.Fragment) {
    return hydrateFragment(vNode, parentDOM, currentDom, context, isSVG, lifecycle);
  }
  if (flags & VNodeFlags.WasabyControl) {
    return hydrateWasabyControl(vNode, parentDOM, currentDom, context, isSVG, lifecycle, isRootStart, environment, parentControlNode, parentVNode);
  }
  if (flags & VNodeFlags.TemplateWasabyNode) {
      return hydrateTemplateWasabyNode(vNode, parentDOM, currentDom, context, isSVG, lifecycle, isRootStart, environment, parentControlNode, parentVNode);
  }
  if (process.env.NODE_ENV !== 'production') {
    throwError(`hydrate() expects a valid VNode, instead it received an object with the type "${typeof vNode}".`);
  }
  throwError();

  return null;
}

export function hydrate(input, parentDOM: Element, callback?: Function, isRootStart?: boolean, environment?, parentControlNode?) {
  let dom = isRootStart ? parentDOM : parentDOM.firstChild as Element;
  const lifecycle: Function[] = [];

  if (isNull(dom)) {
    if (process.env.NODE_ENV !== 'production') {
      warning("Inferno hydration: Server-side markup doesn't match client-side markup");
    }
    render(input, parentDOM, callback, {}, isRootStart, environment, parentControlNode);
  } else {
    // @ts-ignore
    lifecycle.mount = [];

    if (!isInvalid(input)) {
      dom = hydrateVNode(input, parentDOM, dom, {}, false, lifecycle, isRootStart, environment, parentControlNode) as Element;
    }
    // clear any other DOM nodes, there should be only a single entry for the root
    if (!isRootStart) {
      while (dom && (dom = dom.nextSibling as Element)) {
        if (checkIfHydrationNeeded(dom.nextSibling)) {
          parentDOM.removeChild(dom);
        }
      }
    }
  }
  if (isFunction(callback)) {
    // @ts-ignore
    lifecycle.mount.push(callback);
  }
  // We have to wait for any async controls that's in hydration stage till we can call mount callbacks
  // @ts-ignore
  if (!environment.asyncRenderIds || Object.keys(environment.asyncRenderIds).length === 0) {
    // @ts-ignore
    if (lifecycle.length > 0) {
      var listener;
      // @ts-ignore
      while ((listener = lifecycle.shift()) !== undefined) {
        listener();
      }
    }
    // @ts-ignore
    if (lifecycle.mount.length > 0) {
      var listener$1;
      // @ts-ignore
      while ((listener$1 = lifecycle.mount.shift()) !== undefined) {
        listener$1();
      }
    }
  }
  (parentDOM as any).$V = input;
}
