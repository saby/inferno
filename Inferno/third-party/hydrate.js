define('Inferno/third-party/hydrate', ['Core/helpers/String/unEscapeASCII','Env/Env', 'Inferno/third-party/index', 'UI/Utils'], function (unEscapeASCII, Env, infernoSource, uiUtils) {var exports = {}, Logger = uiUtils.Logger; 'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var inferno = infernoSource;

var ERROR_MSG = 'a runtime error occured! Use Inferno in development environment to find the error.';
function isNullOrUndef(o) {
    return isUndefined(o) || isNull(o);
}
function isInvalid(o) {
    return isNull(o) || o === false || isTrue(o) || isUndefined(o);
}
function isFunction(o) {
    return typeof o === 'function';
}
function isNull(o) {
    return o === null;
}
function isTrue(o) {
    return o === true;
}
function isUndefined(o) {
    return o === void 0;
}
function throwError(message) {
    if (!message) {
        message = ERROR_MSG;
    }
    throw new Error(("Inferno Error: " + message));
}
function warning(message) {
    // tslint:disable-next-line:no-console
    // @ts-ignore
    Logger.info('Inferno core - ' + message);
}

function checkIfHydrationNeeded(sibling) {
    // @ts-ignore
    return !(sibling && sibling.tagName === 'SCRIPT' &&
        // @ts-ignore
        sibling.attributes && sibling.attributes['data-requiremodule']
    // @ts-ignore
    ) && !(sibling && sibling.tagName === 'LINK') &&
        // @ts-ignore
        !(sibling && sibling.tagName === 'STYLE');
}
function isSameInnerHTML(dom, innerHTML) {
    var tempdom = document.createElement('i');
    tempdom.innerHTML = innerHTML;
    return tempdom.innerHTML === dom.innerHTML;
}
function findLastDOMFromVNode(vNode) {
    var flags;
    var children;
    while (vNode) {
        flags = vNode.flags;
        if (flags & 2033 /* DOMRef */) {
            return vNode.dom;
        }
        children = vNode.children;
        if (flags & 8192 /* Fragment */) {
            vNode = vNode.childFlags === 2 /* HasVNodeChildren */ ? children : children[children.length - 1];
        }
        else if (flags & 4 /* ComponentClass */) {
            vNode = children.$LI;
        }
        else {
            vNode = children;
        }
    }
    return null;
}
function isSamePropsInnerHTML(dom, props) {
    return Boolean(props && props.dangerouslySetInnerHTML && props.dangerouslySetInnerHTML.__html && isSameInnerHTML(dom, props.dangerouslySetInnerHTML.__html));
}
function hydrateComponent(vNode, parentDOM, dom, context, isSVG, isClass, lifecycle) {
    var type = vNode.type;
    var ref = vNode.ref;
    var props = vNode.props || {};
    var currentNode;
    if (isClass) {
        var instance = inferno._CI(vNode, type, props, context, isSVG, lifecycle);
        var input = instance.$LI;
        currentNode = hydrateVNode(input, parentDOM, dom, instance.$CX, isSVG, lifecycle);
        inferno._MCCC(ref, instance, lifecycle);
        instance.$UPD = false; // Mount finished allow going sync
    }
    else {
        var input$1 = inferno._HI(type(props, context));
        currentNode = hydrateVNode(input$1, parentDOM, dom, context, isSVG, lifecycle);
        vNode.children = input$1;
        inferno._MFCC(props, ref, vNode, lifecycle);
    }
    return currentNode;
}
function hasOnlyIgnoredChildren(dom) {
    // Check if every childNode in `dom` is ignored
    var child = dom.firstChild;
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
function hydrateChildren(parentVNode, parentNode, currentNode, context, isSVG, lifecycle) {
    var childFlags = parentVNode.childFlags;
    var children = parentVNode.children;
    var props = parentVNode.props;
    var flags = parentVNode.flags;
    currentNode = isIgnoredNode(currentNode) ? skipIgnoredNode(currentNode) : currentNode;
    if (childFlags !== 1 /* HasInvalidChildren */) {
        if (childFlags === 2 /* HasVNodeChildren */) {
            if (isNull(currentNode)) {
                inferno._M(children, parentNode, context, isSVG, null, lifecycle);
            }
            else {
                if (!isIgnoredNode(currentNode)) {
                    currentNode = hydrateVNode(children, parentNode, currentNode, context, isSVG, lifecycle);
                }
                currentNode = hydrateVNode(children, parentNode, currentNode, context, isSVG, lifecycle);
                currentNode = currentNode ? currentNode.nextSibling : null;
            }
        }
        else if (childFlags === 16 /* HasTextChildren */) {
            if (isNull(currentNode)) {
                parentNode.appendChild(document.createTextNode(children));
            }
            else if (parentNode.childNodes.length !== 1 || currentNode.nodeType !== 3) {
                parentNode.textContent = children;
            }
            else {
                if (currentNode.nodeValue !== children) {
                    currentNode.nodeValue = children;
                }
            }
            currentNode = null;
        }
        else if (childFlags & 12 /* MultipleChildren */) {
            var prevVNodeIsTextNode = false;
            for (var i = 0, len = children.length; i < len; ++i) {
                var child = children[i];
                if (isNull(currentNode) || (prevVNodeIsTextNode && (child.flags & 16 /* Text */) > 0)) {
                    inferno._M(child, parentNode, context, isSVG, currentNode, lifecycle);
                }
                else {
                    if (!isIgnoredNode(currentNode)) {
                        currentNode = hydrateVNode(child, parentNode, currentNode, context, isSVG, lifecycle);
                    }
                    currentNode = currentNode ? skipIgnoredNode(currentNode) : null;
                }
                prevVNodeIsTextNode = (child.flags & 16 /* Text */) > 0;
            }
        }
        // clear any other DOM nodes, there should be only a single entry for the root
        if ((flags & 8192 /* Fragment */) === 0) {
            var nextSibling = null;
            while (currentNode) {
                nextSibling = currentNode.nextSibling;
                if (!isIgnoredNode(currentNode)) {
                    parentNode.removeChild(currentNode);
                }
                currentNode = nextSibling;
            }
        }
    }
    else if (!isNull(parentNode.firstChild) && !isSamePropsInnerHTML(parentNode, props) && !hasOnlyIgnoredChildren(parentNode)) {
        parentNode.textContent = ''; // dom has content, but VNode has no children remove everything from DOM
        if (flags & 448 /* FormElement */) {
            // If element is form element, we need to clear defaultValue also
            parentNode.defaultValue = '';
        }
    }
}
var domPropertySearchMap = ['chrome-extension', 'mc.yandex.ru', 'kaspersky'];
var ignoredNodeId = ['ghostery-purple-box', 'StayFocusd-infobar'];
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
        (searchForExtension(dom.textContent) || searchForExtension(dom.getAttribute('src')));
}
function ignoreExtensionCSS(dom) {
    return dom &&
        dom.tagName === 'LINK' &&
        searchForExtension(dom.getAttribute('href'));
}
function ignoredById(node) {
    return ignoredNodeId.filter(function (value) {
        return node && node.id === value;
    }).length > 0;
}
/* we have some node that needs to be ignored
* because it was created by requirejs*/
function isIgnoredNode(nextSibling) {
    return (nextSibling && nextSibling.tagName === 'SCRIPT' &&
        nextSibling.attributes && nextSibling.attributes['data-requiremodule']) ||
        ignoreExtensionScripts(nextSibling) || ignoreExtensionCSS(nextSibling) ||
        (nextSibling && nextSibling.attributes && nextSibling.attributes['data-vdomignore']) ||
        /*ignore ghostery chrome plugin*/
        ignoredById(nextSibling);
}
function skipIgnoredNode(childNode) {
    var nextSibling;
    while (childNode) {
        nextSibling = childNode.nextSibling;
        if (!isIgnoredNode(nextSibling)) {
            return nextSibling;
        }
        childNode = nextSibling;
    }
}
function hydrateElement(vNode, parentDOM, dom, context, isSVG, lifecycle, isRootStart) {
    var props = vNode.props;
    var className = vNode.className;
    var flags = vNode.flags;
    var ref = vNode.ref;
    isSVG = isSVG || (flags & 32 /* SvgElement */) > 0;
    if (dom.nodeType !== 1 || dom.tagName.toLowerCase() !== vNode.type.toLowerCase()) {
        {
            warning(("Inferno hydration: разметка на сервере и клиенте не совпала. \n            DOMNode: " + (dom.tagName) + ", VNODE: " + (vNode.type)));
        }
        inferno._ME(vNode, null, context, isSVG, null, lifecycle);
        if (isRootStart) {
            if (parentDOM.parentElement && parentDOM === dom) {
                parentDOM.parentElement.replaceChild(vNode.dom, dom);
            }
        }
        else {
            parentDOM.replaceChild(vNode.dom, dom);
        }
    }
    else {
        vNode.dom = dom;
        hydrateChildren(vNode, dom, dom.firstChild, context, isSVG, lifecycle);
        if (!isNull(props)) {
            // when running hydrate we have to make sure all styles on dom elements are cleaned up
            if (!props.style) {
                inferno._PS(undefined, undefined, dom);
            }
            if (vNode.type === 'iframe' && dom.nodeName === 'IFRAME') {
                // @ts-ignore
                if (props && props.src && dom.src && dom.src.indexOf(props.src) !== -1) {
                    props = Object.keys(props)
                        .filter(function (key) { return key !== 'src'; })
                        .reduce(function (obj, key) {
                        obj[key] = props[key];
                        return obj;
                    }, {});
                }
            }
            inferno._MP(vNode, flags, props, dom, isSVG);
        }
        if (isNullOrUndef(className)) {
            if (dom.className !== '') {
                dom.removeAttribute('class');
            }
        }
        else if (isSVG) {
            dom.setAttribute('class', className);
        }
        else {
            if (dom.className !== '') {
                dom.className = className;
            }
        }
        inferno._MR(ref, dom, lifecycle);
    }
    return vNode.dom;
}
function hydrateText(vNode, parentDOM, dom) {
    if (dom.nodeType !== 3) {
        inferno._MT(vNode, null, null);
        parentDOM.replaceChild(vNode.dom, dom);
    }
    else {
        var text = vNode.children;
        if (dom.nodeValue !== text) {
            dom.nodeValue = text;
        }
        vNode.dom = dom;
    }
    return vNode.dom;
}
function hydrateFragment(vNode, parentDOM, dom, context, isSVG, lifecycle) {
    var children = vNode.children;
    if (vNode.childFlags === 2 /* HasVNodeChildren */) {
        hydrateText(children, parentDOM, dom);
        return children.dom;
    }
    hydrateChildren(vNode, parentDOM, dom, context, isSVG, lifecycle);
    return findLastDOMFromVNode(children[children.length - 1]);
}
function hydrateHTML(vNode, dom) {
    if (dom.outerHTML !== vNode.markup) {
        dom.outerHTML = vNode.markup;
    }
    return dom;
}
function hydrateVNode(vNode, parentDOM, currentDom, context, isSVG, lifecycle, isRootStart) {
    var flags = (vNode.flags |= 16384 /* InUse */);
    if (flags & 14 /* Component */) {
        return hydrateComponent(vNode, parentDOM, currentDom, context, isSVG, (flags & 4 /* ComponentClass */) > 0, lifecycle);
    }
    // @ts-ignore
    if (vNode.moduleName === 'UI/_executor/_Expressions/RawMarkupNode') {
        return hydrateHTML(vNode, currentDom);
    }
    if (flags & 481 /* Element */) {
        return hydrateElement(vNode, parentDOM, currentDom, context, isSVG, lifecycle, isRootStart);
    }
    if (flags & 16 /* Text */) {
        return hydrateText(vNode, parentDOM, currentDom);
    }
    if (flags & 512 /* Void */) {
        return (vNode.dom = currentDom);
    }
    if (flags & 8192 /* Fragment */) {
        return hydrateFragment(vNode, parentDOM, currentDom, context, isSVG, lifecycle);
    }
    {
        throwError(("hydrate() expects a valid VNode, instead it received an object with the type \"" + (typeof vNode) + "\"."));
    }
    throwError();
    return null;
}
function hydrate(input, parentDOM, callback, isRootStart) {
    var dom = isRootStart ? parentDOM : parentDOM.firstChild;
    if (isNull(dom)) {
        {
            warning("Inferno hydration: Server-side markup doesn't match client-side markup");
        }
        inferno.render(input, parentDOM, callback);
    }
    else {
        var lifecycle = [];
        if (!isInvalid(input)) {
            dom = hydrateVNode(input, parentDOM, dom, {}, false, lifecycle, isRootStart);
        }
        // clear any other DOM nodes, there should be only a single entry for the root
        if (!isRootStart) {
            while (dom && (dom = dom.nextSibling)) {
                if (checkIfHydrationNeeded(dom.nextSibling)) {
                    parentDOM.removeChild(dom);
                }
            }
        }
        if (lifecycle.length > 0) {
            var listener;
            while ((listener = lifecycle.shift()) !== undefined) {
                listener();
            }
        }
    }
    parentDOM.$V = input;
    if (isFunction(callback)) {
        callback();
    }
}

exports.hydrate = hydrate;
 return exports;});