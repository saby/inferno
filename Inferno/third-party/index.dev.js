define('Inferno/third-party/index.dev', ['Core/helpers/String/unEscapeASCII', 'Env/Env', 'Application/Env', 'Core/ReactiveObserver', 'Application/Initializer', 'Core/Serializer', 'Core/helpers/Hcontrol/isElementVisible'], function (unEscapeASCII, Env, Request, ReactiveObserver, AppInit, Serializer, isElementVisible) {
'use strict';
function initInfernoIndex(Expressions, Utils, Markup, Vdom, Focus) {
    ExpressionsLib = Expressions;
    ViewUtilsLib = Utils;
    VdomLib = Vdom;
    MarkupLib = Markup;
    FocusLib = Focus;
}
var exports = {};


Object.defineProperty(exports, '__esModule', { value: true });

var MarkupLib;
var FocusLib;
var ExpressionsLib;
var ViewUtilsLib;
var VdomLib;

// @ts-ignore
var ERROR_MSG = 'a runtime error occured! Use Inferno in development environment to find the error.';
var isArray = Array.isArray;
function isStringOrNumber(o) {
    var type = typeof o;
    return type === 'string' || type === 'number' || o instanceof ExpressionsLib.RawMarkupNode;
}
function isNullOrUndef(o) {
    return isUndefined(o) || isNull(o);
}
function isInvalid(o) {
    return isNull(o) || o === false || isTrue(o) || isUndefined(o);
}
function isFunction(o) {
    return typeof o === 'function';
}
function isString(o) {
    return typeof o === 'string';
}
function isNumber(o) {
    return typeof o === 'number';
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
    Env.IoC.resolve("ILogger").log("Inferno core", message);
}
function combineFrom(first, second) {
    var out = {};
    if (first) {
        for (var key in first) {
            out[key] = first[key];
        }
    }
    if (second) {
        for (var key$1 in second) {
            out[key$1] = second[key$1];
        }
    }
    return out;
}
function unescape(s) {
    if (!s || !s.replace) {
        return s;
    }
    var translate_re = /&(nbsp|amp|quot|apos|lt|gt);/g;
    var translate = { "nbsp": String.fromCharCode(160), "amp": "&", "quot": "\"", "apos": "'", "lt": "<", "gt": ">" };
    // @ts-ignore
    s = unEscapeASCII(s);
    // @ts-ignore
    return (s.replace(translate_re, function (match, entity) {
        return translate[entity];
    }));
}

// We need EMPTY_OBJ defined in one place.
// Its used for comparison so we cant inline it into shared
var EMPTY_OBJ = {};
var Fragment = '$F';
{
    Object.freeze(EMPTY_OBJ);
}
function appendChild(parentDOM, dom) {
    parentDOM.appendChild(dom);
}
function insertOrAppend(parentDOM, newNode, nextNode) {
    if (isNull(nextNode)) {
        appendChild(parentDOM, newNode);
    }
    else {
        if (nextNode && (nextNode.controlClass || nextNode.template)) {
            parentDOM.insertBefore(newNode, findDOMfromVNode(nextNode, true));
        }
        else if (nextNode && nextNode.dom) {
            parentDOM.insertBefore(newNode, nextNode.dom);
        }
        else {
            // @ts-ignore
            if ((Env.detection.isIE10 || Env.detection.isIE11) && nextNode.nodeValue === '') {
                if (parentDOM.firstChild) {
                    // We have to use parentDOM.firstChild only in the case when it's childNodes length equals to 1
                    if (parentDOM.childNodes.length === 1) {
                        parentDOM.insertBefore(newNode, parentDOM.firstChild);
                    }
                    else {
                        parentDOM.insertBefore(newNode, nextNode);
                    }
                }
                else {
                    parentDOM.insertBefore(newNode, nextNode);
                }
            }
            else {
                parentDOM.insertBefore(newNode, nextNode);
            }
        }
    }
}
function documentCreateElement(tag, isSVG) {
    if (isSVG) {
        return document.createElementNS('http://www.w3.org/2000/svg', tag);
    }
    return document.createElement(tag);
}
function replaceChild(parentDOM, newDom, lastDom) {
    parentDOM.replaceChild(newDom, lastDom);
}
function removeChild(parentDOM, childNode) {
    // @ts-ignore
    if (Env.detection.isIE10 || Env.detection.isIE11) {
        if (childNode.nodeValue === '') {
            if (parentDOM.firstChild && parentDOM.childNodes && parentDOM.childNodes.length === 1) {
                parentDOM.removeChild(parentDOM.firstChild);
            }
            else if (parentDOM.firstChild !== null) {
                parentDOM.removeChild(childNode);
            }
        }
        else if (childNode.parentNode) {
            parentDOM.removeChild(childNode);
        }
    }
    else {
        parentDOM.removeChild(childNode);
    }
}
function callAll(arrayFn) {
    var listener;
    while ((listener = arrayFn.shift()) !== undefined) {
        listener();
    }
}
function findDOMfromVNode(vNode, start) {
    var flags;
    var children;
    while (vNode) {
        flags = vNode.flags;
        if (flags & 2033 /* DOMRef */) {
            return vNode.dom;
        }
        children = vNode.children;
        if (flags & 8192 /* Fragment */) {
            vNode = vNode.childFlags === 2 /* HasVNodeChildren */ ? children : children[start ? 0 : children.length - 1];
        }
        else if (flags & 4 /* ComponentClass */) {
            vNode = children.$LI;
        }
        else if (flags & 131072 /* WasabyControl */) {
            // @ts-ignore
            if (!vNode.compound) {
                // @ts-ignore
                if (!vNode.instance.element || !vNode.instance.markup.dom) {
                    // @ts-ignore
                    if (vNode.instance.markup && vNode.instance.markup.instance) {
                        // @ts-ignore
                        return findDOMfromVNode(vNode.instance.markup);
                    }
                }
                // @ts-ignore
                return vNode.instance.element || vNode.instance.markup.dom || null;
            }
            else {
                // @ts-ignore
                return vNode.instance.markup.dom || null;
            }
        }
        else if (flags & 262144 /* TemplateWasabyNode */) {
            if (vNode.markup[0]) {
                if (!vNode.markup[0].dom && (vNode.markup[0].template || vNode.markup[0].controlClass)) {
                    // @ts-ignore
                    return findDOMfromVNode(vNode.markup[0]);
                }
                return vNode.markup[0].dom || null;
            }
            else {
                return null;
            }
        }
        else {
            vNode = children;
        }
    }
    return null;
}
function removeVNodeDOM(vNode, parentDOM) {
    var flags = vNode.flags;
    if (flags & 2033 /* DOMRef */) {
        removeChild(parentDOM, vNode.dom);
    }
    else if (flags & 131072 /* WasabyControl */) {
        // CompoundControls remove their containers automatically when destroyed
        // @ts-ignore
        if (!vNode.compound) {
            // @ts-ignore
            var realDom = vNode.instance && vNode.instance.element;
            if (realDom && realDom.parentElement && parentDOM.contains(realDom)) {
                removeChild(parentDOM, realDom);
            }
        }
    }
    else if (flags & 262144 /* TemplateWasabyNode */) {
        for (var i = 0, len = vNode.markup.length; i < len; ++i) {
            removeVNodeDOM(vNode.markup[i], parentDOM);
        }
    }
    else {
        var children = vNode.children;
        if (flags & 4 /* ComponentClass */) {
            removeVNodeDOM(children.$LI, parentDOM);
        }
        else if (flags & 8 /* ComponentFunction */) {
            removeVNodeDOM(children, parentDOM);
        }
        else if (flags & 8192 /* Fragment */) {
            if (vNode.childFlags === 2 /* HasVNodeChildren */) {
                removeVNodeDOM(children, parentDOM);
            }
            else {
                for (var i$1 = 0, len$1 = children.length; i$1 < len$1; ++i$1) {
                    removeVNodeDOM(children[i$1], parentDOM);
                }
            }
        }
    }
}
function moveVNodeDOM(vNode, parentDOM, nextNode) {
    var flags = vNode.flags;
    if (flags & 2033 /* DOMRef */) {
        insertOrAppend(parentDOM, vNode.dom, nextNode);
    }
    else if (flags & 131072 /* WasabyControl */) {
        insertOrAppend(parentDOM, vNode.instance.element, nextNode);
    }
    else {
        var children = vNode.children || vNode.markup;
        if (flags & 4 /* ComponentClass */) {
            moveVNodeDOM(children.$LI, parentDOM, nextNode);
        }
        else if (flags & 8 /* ComponentFunction */) {
            moveVNodeDOM(children, parentDOM, nextNode);
        }
        else if (flags & 8192 /* Fragment */) {
            if (vNode.childFlags === 2 /* HasVNodeChildren */) {
                moveVNodeDOM(children, parentDOM, nextNode);
            }
            else {
                for (var i = 0, len = children.length; i < len; ++i) {
                    moveVNodeDOM(children[i], parentDOM, nextNode);
                }
            }
        }
        else if (flags & 262144 /* TemplateWasabyNode */) {
            for (var i$1 = 0, len$1 = children.length; i$1 < len$1; ++i$1) {
                moveVNodeDOM(children[i$1], parentDOM, nextNode);
            }
        }
    }
}
function getComponentName(instance) {
    // Fallback for IE
    return instance.name || instance.displayName || instance.constructor.name || (instance.toString().match(/^function\s*([^\s(]+)/) || [])[1];
}
function createDerivedState(instance, nextProps, state) {
    if (instance.constructor.getDerivedStateFromProps) {
        return combineFrom(state, instance.constructor.getDerivedStateFromProps(nextProps, state));
    }
    return state;
}
var options = {
    componentComparator: null,
    createVNode: null,
    renderComplete: null
};

function getTagName(input) {
    var tagName;
    if (isArray(input)) {
        var arrayText = input.length > 3 ? input.slice(0, 3).toString() + ',...' : input.toString();
        tagName = 'Array(' + arrayText + ')';
    }
    else if (isStringOrNumber(input)) {
        tagName = 'Text(' + input + ')';
    }
    else if (isInvalid(input)) {
        tagName = 'InvalidVNode(' + input + ')';
    }
    else {
        var flags = input.flags;
        if (flags & 481 /* Element */) {
            tagName = "<" + (input.type) + (input.className ? ' class="' + input.className + '"' : '') + ">";
        }
        else if (flags & 16 /* Text */) {
            tagName = "Text(" + (input.children) + ")";
        }
        else if (flags & 1024 /* Portal */) {
            tagName = "Portal*";
        }
        else {
            tagName = "<" + (getComponentName(input.type || (input.controlClass && input.controlClass.prototype && input.controlClass.prototype._moduleName))) + " />";
        }
    }
    return '>> ' + tagName + '\n';
}
function findMaxInArray(prev, next) {
    return (prev > next ? prev : next);
}
function duplicateKeys(key, foundKeys) {
    var splitKey;
    var duplicate = key + '-duplicate-';
    var keys = Object.keys(foundKeys).filter(function (keyItem) {
        return ~keyItem.indexOf(duplicate);
    });
    if (key.indexOf(duplicate) === -1 && keys.length === 0) {
        return duplicate + '0';
    }
    splitKey = keys.map(function (keyItem) {
        return parseInt(keyItem.split(duplicate)[1], 10);
    }).reduce(findMaxInArray);
    return duplicate + (parseInt(splitKey, 10) + 1);
}
function DEV_ValidateKeys(vNodeTree, forceKeyed) {
    var foundKeys = {};
    for (var i = 0, len = vNodeTree.length; i < len; ++i) {
        var childNode = vNodeTree[i];
        if (isArray(childNode)) {
            return 'Encountered ARRAY in mount, array must be flattened, or normalize used. Location: \n' + getTagName(childNode);
        }
        if (isInvalid(childNode)) {
            if (forceKeyed) {
                return 'Encountered invalid node when preparing to keyed algorithm. Location: \n' + getTagName(childNode);
            }
            else if (Object.keys(foundKeys).length !== 0) {
                return 'Encountered invalid node with mixed keys. Location: \n' + getTagName(childNode);
            }
            continue;
        }
        if (typeof childNode === 'object') {
            if (childNode.isValidated) {
                continue;
            }
            childNode.isValidated = true;
        }
        // Key can be undefined, null too. But typescript complains for no real reason
        var key = childNode.key;
        if (!isNullOrUndef(key) && !isStringOrNumber(key)) {
            return 'Encountered child vNode where key property is not string or number. Location: \n' + getTagName(childNode);
        }
        var children = childNode.children;
        var childFlags = childNode.childFlags;
        if (!isInvalid(children)) {
            var val = (void 0);
            if (childFlags & 12 /* MultipleChildren */) {
                val = DEV_ValidateKeys(children, (childFlags & 8 /* HasKeyedChildren */) !== 0);
            }
            else if (childFlags === 2 /* HasVNodeChildren */) {
                val = DEV_ValidateKeys([children], false);
            }
            if (val) {
                val += getTagName(childNode);
                return val;
            }
        }
        if (forceKeyed && isNullOrUndef(key)) {
            return ('Encountered child without key during keyed algorithm. If this error points to Array make sure children is flat list. Location: \n' +
                getTagName(childNode));
        }
        else if (!forceKeyed && isNullOrUndef(key)) {
            if (Object.keys(foundKeys).length !== 0) {
                return 'Encountered children with key missing. Location: \n' + getTagName(childNode);
            }
            continue;
        }
        if (foundKeys[key]) {
            // In case of duplicate keys we don't want to crash the whole app because of that,
            // so we have to create a fixed duplicate on the fly
            // @ts-ignore
            Env.IoC.resolve("ILogger").error('Deoptimizing perfomance due to duplicate node keys', 'Encountered two children with same key: {' + key + '}. Location: \n' + getTagName(childNode));
            key = duplicateKeys(childNode.key, foundKeys);
            childNode.key = key;
            // return 'Encountered two children with same key: {' + key + '}. Location: \n' + getTagName(childNode);
        }
        foundKeys[key] = true;
    }
}
function validateVNodeElementChildren(vNode) {
    {
        if (vNode.childFlags === 1 /* HasInvalidChildren */) {
            return;
        }
        if (vNode.flags & 64 /* InputElement */) {
            throwError("input elements can't have children.");
        }
        if (vNode.flags & 128 /* TextareaElement */) {
            throwError("textarea elements can't have children.");
        }
        /* COMMENTED UNUSED AND USELESS CODE
        if (vNode.flags & VNodeFlags.Element) {
          const voidTypes = {
            area: true,
            base: true,
            br: true,
            col: true,
            command: true,
            embed: true,
            hr: true,
            img: true,
            input: true,
            keygen: true,
            link: true,
            meta: true,
            param: true,
            source: true,
            track: true,
            wbr: true
          };
          let tag = vNode.type.toLowerCase();
          if (false) {
            if (tag === 'media') {
              throwError("media elements can't have children.");
            }
            if (voidTypes[tag]) {
              throwError((tag + " elements can't have children."));
            }
          }
        }
        */
    }
}
function validateKeys(vNode) {
    {
        // Checks if there is any key missing or duplicate keys
        if (vNode.isValidated === false && vNode.children && vNode.flags & 481 /* Element */) {
            var error = DEV_ValidateKeys(Array.isArray(vNode.children) ? vNode.children : [vNode.children], (vNode.childFlags & 8 /* HasKeyedChildren */) > 0);
            if (error) {
                throwError(error + getTagName(vNode));
            }
        }
        vNode.isValidated = true;
    }
}
function throwIfObjectIsNotVNode(input) {
    if (!isNumber(input.flags)) {
        throwError(("normalization received an object that's not a valid VNode, you should stringify it first or fix createVNode flags. Object: \"" + (JSON.stringify(input)) + "\"."));
    }
}

var keyPrefix = '$';
function V(childFlags, children, className, flags, key, props, ref, type, markup) {
    {
        this.isValidated = false;
    }
    this.childFlags = childFlags;
    this.children = children;
    this.className = className;
    this.dom = null;
    this.flags = flags;
    this.key = key === void 0 ? null : key;
    this.props = props === void 0 ? null : props;
    this.ref = ref === void 0 ? null : ref;
    this.type = type;
    this.markup = markup;
}
function createVNode(flags, type, className, children, childFlags, props, key, ref, markup) {
    {
        if (flags & 14 /* Component */) {
            throwError('Creating Component vNodes using createVNode is not allowed. Use Inferno.createComponentVNode method.');
        }
    }
    var childFlag = childFlags === void 0 ? 1 /* HasInvalidChildren */ : childFlags;
    var vNode = new V(childFlag, children, className, flags, key, props, ref, type, markup);
    var optsVNode = options.createVNode;
    if (isFunction(optsVNode)) {
        optsVNode(vNode);
    }
    if (childFlag === 0 /* UnknownChildren */) {
        normalizeChildren(vNode, vNode.children);
    }
    {
        validateVNodeElementChildren(vNode);
    }
    return vNode;
}
function createComponentVNode(flags, type, props, key, ref) {
    {
        if (flags & 1 /* HtmlElement */) {
            throwError('Creating element vNodes using createComponentVNode is not allowed. Use Inferno.createVNode method.');
        }
    }
    if ((flags & 2 /* ComponentUnknown */) !== 0) {
        if (type.prototype && type.prototype.render) {
            flags = 4 /* ComponentClass */;
        }
        else if (type.render) {
            flags = 32776 /* ForwardRefComponent */;
            type = type.render;
        }
        else {
            flags = 8 /* ComponentFunction */;
        }
    }
    // set default props
    var defaultProps = type.defaultProps;
    if (!isNullOrUndef(defaultProps)) {
        if (!props) {
            props = {}; // Props can be referenced and modified at application level so always create new object
        }
        for (var prop in defaultProps) {
            if (isUndefined(props[prop])) {
                props[prop] = defaultProps[prop];
            }
        }
    }
    if ((flags & 8 /* ComponentFunction */) > 0 && (flags & 32768 /* ForwardRef */) === 0) {
        var defaultHooks = type.defaultHooks;
        if (!isNullOrUndef(defaultHooks)) {
            if (!ref) {
                // As ref cannot be referenced from application level, we can use the same refs object
                ref = defaultHooks;
            }
            else {
                for (var prop$1 in defaultHooks) {
                    if (isUndefined(ref[prop$1])) {
                        ref[prop$1] = defaultHooks[prop$1];
                    }
                }
            }
        }
    }
    var vNode = new V(1 /* HasInvalidChildren */, null, null, flags, key, props, ref, type);
    var optsVNode = options.createVNode;
    if (isFunction(optsVNode)) {
        optsVNode(vNode);
    }
    return vNode;
}
function createTextVNode(text, key) {
    return new V(1 /* HasInvalidChildren */, isNullOrUndef(text) ? '' : text, null, 16 /* Text */, key, null, null, null);
}
function createFragment(children, childFlags, key) {
    var fragment = createVNode(8192 /* Fragment */, 8192 /* Fragment */, null, children, childFlags, null, key, null);
    switch (fragment.childFlags) {
        case 1 /* HasInvalidChildren */:
            fragment.children = createVoidVNode();
            fragment.childFlags = 2 /* HasVNodeChildren */;
            break;
        case 16 /* HasTextChildren */:
            fragment.children = [createTextVNode(children)];
            fragment.childFlags = 4 /* HasNonKeyedChildren */;
            break;
        default:
            break;
    }
    return fragment;
}
function normalizeProps(vNode) {
    var props = vNode.props;
    if (props) {
        var flags = vNode.flags;
        if (flags & 481 /* Element */) {
            if (props.children !== void 0 && isNullOrUndef(vNode.children)) {
                normalizeChildren(vNode, props.children);
            }
            if (props.className !== void 0) {
                vNode.className = props.className || null;
                props.className = undefined;
            }
        }
        if (props.key !== void 0) {
            vNode.key = props.key;
            props.key = undefined;
        }
        if (props.ref !== void 0) {
            if (flags & 8 /* ComponentFunction */) {
                vNode.ref = combineFrom(vNode.ref, props.ref);
            }
            else {
                vNode.ref = props.ref;
            }
            props.ref = undefined;
        }
    }
    return vNode;
}
/*
 * Fragment is different than normal vNode,
 * because when it needs to be cloned we need to clone its children too
 * But not normalize, because otherwise those possibly get KEY and re-mount
 */
function cloneFragment(vNodeToClone) {
    var clonedChildren;
    var oldChildren = vNodeToClone.children;
    var childFlags = vNodeToClone.childFlags;
    if (childFlags === 2 /* HasVNodeChildren */) {
        clonedChildren = directClone(oldChildren);
    }
    else if (childFlags & 12 /* MultipleChildren */) {
        clonedChildren = [];
        for (var i = 0, len = oldChildren.length; i < len; ++i) {
            clonedChildren.push(directClone(oldChildren[i]));
        }
    }
    return createFragment(clonedChildren, childFlags, vNodeToClone.key);
}
function directClone(vNodeToClone) {
    var flags = vNodeToClone.flags & -81921 /* ClearInUseNormalized */;
    var props = vNodeToClone.props;
    if (flags & 14 /* Component */) {
        if (!isNull(props)) {
            var propsToClone = props;
            props = {};
            for (var key in propsToClone) {
                props[key] = propsToClone[key];
            }
        }
    }
    if (!flags && typeof vNodeToClone.markup === 'string' /* RawMarkupNode Type WS bugfix */) {
        return vNodeToClone;
    }
    if (flags & 131072 /* WasabyControl */) {
        return vNodeToClone;
    }
    if ((flags & 8192 /* Fragment */) === 0) {
        return new V(vNodeToClone.childFlags, vNodeToClone.children, vNodeToClone.className, flags, vNodeToClone.key, props, vNodeToClone.ref, vNodeToClone.type);
    }
    return cloneFragment(vNodeToClone);
}
function createVoidVNode() {
    return createTextVNode('', null);
}
function createPortal(children, container) {
    return createVNode(1024 /* Portal */, 1024 /* Portal */, null, children, 0 /* UnknownChildren */, null, isInvalid(children) ? null : children.key, container);
}
function _normalizeVNodes(nodes, result, index, currentKey) {
    for (var len = nodes.length; index < len; index++) {
        var n = nodes[index];
        if (!isInvalid(n)) {
            var newKey = currentKey + keyPrefix + index;
            if (isArray(n)) {
                _normalizeVNodes(n, result, 0, newKey);
            }
            else {
                if (isStringOrNumber(n)) {
                    n = createTextVNode(n, newKey);
                }
                else {
                    {
                        throwIfObjectIsNotVNode(n);
                    }
                    var oldKey = n.key;
                    var isPrefixedKey = isString(oldKey) && oldKey[0] === keyPrefix;
                    if (n.flags & 81920 /* InUseOrNormalized */ || isPrefixedKey) {
                        n = directClone(n);
                    }
                    n.flags |= 65536 /* Normalized */;
                    if (isNull(oldKey) || isPrefixedKey) {
                        n.key = newKey;
                    }
                    else {
                        n.key = currentKey + oldKey;
                    }
                }
                result.push(n);
            }
        }
    }
}
function getFlagsForElementVnode(type) {
    switch (type) {
        case 'svg':
            return 32 /* SvgElement */;
        case 'input':
            return 64 /* InputElement */;
        case 'select':
            return 256 /* SelectElement */;
        case 'textarea':
            return 128 /* TextareaElement */;
        case Fragment:
            return 8192 /* Fragment */;
        default:
            return 1 /* HtmlElement */;
    }
}
function normalizeChildren(vNode, children) {
    var newChildren;
    var newChildFlags = 1 /* HasInvalidChildren */;
    // Don't change children to match strict equal (===) true in patching
    if (isInvalid(children)) {
        newChildren = children;
    }
    else if (isStringOrNumber(children)) {
        newChildFlags = 16 /* HasTextChildren */;
        newChildren = children;
    }
    else if (isArray(children)) {
        var len = children.length;
        for (var i = 0; i < len; ++i) {
            var n = children[i];
            if (isInvalid(n) || isArray(n)) {
                newChildren = newChildren || children.slice(0, i);
                _normalizeVNodes(children, newChildren, i, '');
                break;
            }
            else if (isStringOrNumber(n)) {
                newChildren = newChildren || children.slice(0, i);
                newChildren.push(createTextVNode(n, keyPrefix + i));
            }
            else {
                {
                    throwIfObjectIsNotVNode(n);
                }
                var key = n.key;
                var needsCloning = (n.flags & 81920 /* InUseOrNormalized */) > 0;
                var isNullKey = isNull(key);
                var isPrefixed = !isNullKey && isString(key) && key[0] === keyPrefix;
                if (needsCloning || isNullKey || isPrefixed) {
                    newChildren = newChildren || children.slice(0, i);
                    if (needsCloning || isPrefixed) {
                        n = directClone(n);
                    }
                    if (isNullKey || isPrefixed) {
                        n.key = keyPrefix + i;
                    }
                    newChildren.push(n);
                }
                else if (newChildren) {
                    newChildren.push(n);
                }
                n.flags |= 65536 /* Normalized */;
            }
        }
        newChildren = newChildren || children;
        if (newChildren.length === 0) {
            newChildFlags = 1 /* HasInvalidChildren */;
        }
        else {
            newChildFlags = 8 /* HasKeyedChildren */;
        }
    }
    else {
        newChildren = children;
        newChildren.flags |= 65536 /* Normalized */;
        if (children.flags & 81920 /* InUseOrNormalized */) {
            newChildren = directClone(children);
        }
        newChildFlags = 2 /* HasVNodeChildren */;
    }
    vNode.children = newChildren;
    vNode.childFlags = newChildFlags;
    return vNode;
}

/**
 * Links given data to event as first parameter
 * @param {*} data data to be linked, it will be available in function as first parameter
 * @param {Function} event Function to be called when event occurs
 * @returns {{data: *, event: Function}}
 */
function linkEvent(data, event) {
    if (isFunction(event)) {
        return { data: data, event: event };
    }
    return null; // Return null when event is invalid, to avoid creating unnecessary event handlers
}

var xlinkNS = 'http://www.w3.org/1999/xlink';
var xmlNS = 'http://www.w3.org/XML/1998/namespace';
var namespaces = {
    'xlink:actuate': xlinkNS,
    'xlink:arcrole': xlinkNS,
    'xlink:href': xlinkNS,
    'xlink:role': xlinkNS,
    'xlink:show': xlinkNS,
    'xlink:title': xlinkNS,
    'xlink:type': xlinkNS,
    'xml:base': xmlNS,
    'xml:lang': xmlNS,
    'xml:space': xmlNS
};

function getDelegatedEventObject(v) {
    return {
        onClick: v,
        onDblClick: v,
        onFocusIn: v,
        onFocusOut: v,
        onKeyDown: v,
        onKeyPress: v,
        onKeyUp: v,
        onMouseDown: v,
        onMouseMove: v,
        onMouseUp: v,
        onSubmit: v,
        onTouchEnd: v,
        onTouchMove: v,
        onTouchStart: v
    };
}
var attachedEventCounts = getDelegatedEventObject(0);
var attachedEvents = getDelegatedEventObject(null);
var delegatedEvents = getDelegatedEventObject(true);
function handleEvent(name, nextEvent, dom) {
    var eventsObject = dom.$EV;
    if (nextEvent) {
        if (attachedEventCounts[name] === 0) {
            attachedEvents[name] = attachEventToDocument(name);
        }
        if (!eventsObject) {
            eventsObject = dom.$EV = getDelegatedEventObject(null);
        }
        if (!eventsObject[name]) {
            ++attachedEventCounts[name];
        }
        eventsObject[name] = nextEvent;
    }
    else if (eventsObject && eventsObject[name]) {
        if (--attachedEventCounts[name] === 0) {
            document.removeEventListener(normalizeEventName(name), attachedEvents[name]);
            attachedEvents[name] = null;
        }
        eventsObject[name] = null;
    }
}
function dispatchEvents(event, target, isClick, name, eventData) {
    var dom = target;
    while (!isNull(dom)) {
        // Html Nodes can be nested fe: span inside button in that scenario browser does not handle disabled attribute on parent,
        // because the event listener is on document.body
        // Don't process clicks on disabled elements
        if (isClick && dom.disabled) {
            return;
        }
        var eventsObject = dom.$EV;
        if (eventsObject) {
            var currentEvent = eventsObject[name];
            if (currentEvent) {
                // linkEvent object
                eventData.dom = dom;
                if (currentEvent.event) {
                    currentEvent.event(currentEvent.data, event);
                }
                else {
                    currentEvent(event);
                }
                if (event.cancelBubble) {
                    return;
                }
            }
        }
        dom = dom.parentNode;
    }
}
function normalizeEventName(name) {
    return name.substr(2).toLowerCase();
}
function stopPropagation() {
    this.cancelBubble = true;
    if (!this.immediatePropagationStopped) {
        this.stopImmediatePropagation();
    }
}
function attachEventToDocument(name) {
    var docEvent = function (event) {
        var isClick = name === 'onClick' || name === 'onDblClick';
        if (isClick && event.button !== 0) {
            // Firefox incorrectly triggers click event for mid/right mouse buttons.
            // This bug has been active for 12 years.
            // https://bugzilla.mozilla.org/show_bug.cgi?id=184051
            event.stopPropagation();
            return;
        }
        event.stopPropagation = stopPropagation;
        // Event data needs to be object to save reference to currentTarget getter
        var eventData = {
            dom: document
        };
        Object.defineProperty(event, 'currentTarget', {
            configurable: true,
            get: function get() {
                return eventData.dom;
            }
        });
        dispatchEvents(event, event.target, isClick, name, eventData);
    };
    document.addEventListener(normalizeEventName(name), docEvent);
    return docEvent;
}

function isSameInnerHTML(dom, innerHTML) {
    var tempdom = document.createElement('i');
    tempdom.innerHTML = innerHTML;
    return tempdom.innerHTML === dom.innerHTML;
}

function triggerEventListener(props, methodName, e) {
    if (props[methodName]) {
        var listener = props[methodName];
        if (listener.event) {
            listener.event(listener.data, e);
        }
        else {
            listener(e);
        }
    }
    else {
        var nativeListenerName = methodName.toLowerCase();
        if (props[nativeListenerName]) {
            props[nativeListenerName](e);
        }
    }
}
function createWrappedFunction(methodName, applyValue) {
    var fnMethod = function (e) {
        var vNode = this.$V;
        // If vNode is gone by the time event fires, no-op
        if (!vNode) {
            return;
        }
        var props = vNode.props || EMPTY_OBJ;
        var dom = vNode.dom;
        if (isString(methodName)) {
            triggerEventListener(props, methodName, e);
        }
        else {
            for (var i = 0; i < methodName.length; ++i) {
                triggerEventListener(props, methodName[i], e);
            }
        }
        if (isFunction(applyValue)) {
            var newVNode = this.$V;
            var newProps = newVNode.props || EMPTY_OBJ;
            applyValue(newProps, dom, false, newVNode);
        }
    };
    Object.defineProperty(fnMethod, 'wrapped', {
        configurable: false,
        enumerable: false,
        value: true,
        writable: false
    });
    return fnMethod;
}

function isCheckedType(type) {
    return type === 'checkbox' || type === 'radio';
}
var onTextInputChange = createWrappedFunction('onInput', applyValueInput);
var wrappedOnChange = createWrappedFunction(['onClick', 'onChange'], applyValueInput);
/* tslint:disable-next-line:no-empty */
function emptywrapper(event) {
    event.stopPropagation();
}
emptywrapper.wrapped = true;
function inputEvents(dom, nextPropsOrEmpty) {
    return;
    if (isCheckedType(nextPropsOrEmpty.type)) {
        dom.onchange = wrappedOnChange;
        dom.onclick = emptywrapper;
    }
    else {
        dom.oninput = onTextInputChange;
    }
}
function applyValueInput(nextPropsOrEmpty, dom) {
    var type = nextPropsOrEmpty.type;
    var value = nextPropsOrEmpty.value;
    var checked = nextPropsOrEmpty.checked;
    var multiple = nextPropsOrEmpty.multiple;
    var defaultValue = nextPropsOrEmpty.defaultValue;
    var hasValue = !isNullOrUndef(value);
    if (type && type !== dom.type) {
        dom.setAttribute('type', type);
    }
    if (!isNullOrUndef(multiple) && multiple !== dom.multiple) {
        dom.multiple = multiple;
    }
    if (!isNullOrUndef(defaultValue) && !hasValue) {
        dom.defaultValue = defaultValue + '';
    }
    if (isCheckedType(type)) {
        if (hasValue) {
            dom.value = value;
        }
        if (!isNullOrUndef(checked)) {
            dom.checked = checked;
        }
    }
    else {
        if (hasValue && dom.value !== value) {
            dom.defaultValue = value;
            dom.value = value;
        }
        else if (!isNullOrUndef(checked)) {
            dom.checked = checked;
        }
    }
}

function updateChildOptions(vNode, value) {
    if (vNode.type === 'option') {
        updateChildOption(vNode, value);
    }
    else {
        var children = vNode.children;
        var flags = vNode.flags;
        if (flags & 4 /* ComponentClass */) {
            updateChildOptions(children.$LI, value);
        }
        else if (flags & 8 /* ComponentFunction */) {
            updateChildOptions(children, value);
        }
        else if (vNode.childFlags === 2 /* HasVNodeChildren */) {
            updateChildOptions(children, value);
        }
        else if (vNode.childFlags & 12 /* MultipleChildren */) {
            for (var i = 0, len = children.length; i < len; ++i) {
                updateChildOptions(children[i], value);
            }
        }
    }
}
function updateChildOption(vNode, value) {
    var props = vNode.props || EMPTY_OBJ;
    var dom = vNode.dom;
    // we do this as multiple may have changed
    dom.value = props.value;
    if (props.value === value || (isArray(value) && value.indexOf(props.value) !== -1)) {
        dom.selected = true;
    }
    else if (!isNullOrUndef(value) || !isNullOrUndef(props.selected)) {
        dom.selected = props.selected || false;
    }
}
var onSelectChange = createWrappedFunction('onChange', applyValueSelect);
function selectEvents(dom) {
    dom.onchange = onSelectChange;
}
function applyValueSelect(nextPropsOrEmpty, dom, mounting, vNode) {
    var multiplePropInBoolean = Boolean(nextPropsOrEmpty.multiple);
    if (!isNullOrUndef(nextPropsOrEmpty.multiple) && multiplePropInBoolean !== dom.multiple) {
        dom.multiple = multiplePropInBoolean;
    }
    var childFlags = vNode.childFlags;
    if (childFlags !== 1 /* HasInvalidChildren */) {
        var value = nextPropsOrEmpty.value;
        if (mounting && isNullOrUndef(value)) {
            value = nextPropsOrEmpty.defaultValue;
        }
        updateChildOptions(vNode, value);
    }
}

var onTextareaInputChange = createWrappedFunction('onInput', applyValueTextArea);
var wrappedOnChange$1 = createWrappedFunction('onChange');
function textAreaEvents(dom, nextPropsOrEmpty) {
    return;
    dom.oninput = onTextareaInputChange;
    if (nextPropsOrEmpty.onChange) {
        dom.onchange = wrappedOnChange$1;
    }
}
function applyValueTextArea(nextPropsOrEmpty, dom, mounting) {
    var value = nextPropsOrEmpty.value;
    var domValue = dom.value;
    if (isNullOrUndef(value)) {
        if (mounting) {
            var defaultValue = nextPropsOrEmpty.defaultValue;
            if (!isNullOrUndef(defaultValue) && defaultValue !== domValue) {
                dom.defaultValue = defaultValue;
                dom.value = defaultValue;
            }
        }
    }
    else if (domValue !== value) {
        /* There is value so keep it controlled */
        dom.defaultValue = value;
        dom.value = value;
    }
}

/**
 * There is currently no support for switching same input between controlled and nonControlled
 * If that ever becomes a real issue, then re design controlled elements
 * Currently user must choose either controlled or non-controlled and stick with that
 */
function processElement(flags, vNode, dom, nextPropsOrEmpty, mounting, isControlled) {
    if (flags & 64 /* InputElement */) {
        applyValueInput(nextPropsOrEmpty, dom);
    }
    else if (flags & 256 /* SelectElement */) {
        applyValueSelect(nextPropsOrEmpty, dom, mounting, vNode);
    }
    else if (flags & 128 /* TextareaElement */) {
        applyValueTextArea(nextPropsOrEmpty, dom, mounting);
    }
    if (isControlled) {
        dom.$V = vNode;
    }
}
function addFormElementEventHandlers(flags, dom, nextPropsOrEmpty) {
    if (flags & 64 /* InputElement */) {
        inputEvents(dom, nextPropsOrEmpty);
    }
    else if (flags & 256 /* SelectElement */) {
        selectEvents(dom);
    }
    else if (flags & 128 /* TextareaElement */) {
        textAreaEvents(dom, nextPropsOrEmpty);
    }
}
function isControlledFormElement(nextPropsOrEmpty) {
    return nextPropsOrEmpty.type && isCheckedType(nextPropsOrEmpty.type) ? !isNullOrUndef(nextPropsOrEmpty.checked) : !isNullOrUndef(nextPropsOrEmpty.value);
}

function createRef() {
    return {
        current: null
    };
}
function forwardRef(render) {
    if (!isFunction(render)) {
        warning(("forwardRef requires a render function but was given " + (render === null ? 'null' : typeof render) + "."));
        return;
    }
    var fwRef = {
        render: render
    };
    Object.seal(fwRef);
    return fwRef;
}
function pushRef(dom, value, lifecycle) {
    lifecycle.push(function () {
        value(dom);
    });
}
function unmountRef(ref) {
    if (ref) {
        if (isFunction(ref)) {
            ref(null);
        }
        else if (ref.current) {
            ref.current = null;
        }
    }
}
function mountRef(ref, value, lifecycle) {
    if (ref) {
        if (isFunction(ref)) {
            pushRef(value, ref, lifecycle);
        }
        else if (ref.current !== void 0) {
            ref.current = value;
        }
    }
}

function compoundUnmountProcess(controlNode) {
    var control = controlNode.control;
    var options$$1 = controlNode.options;
    var name = options$$1.name;
    var logicParent = options$$1.logicParent;
    if (logicParent && name) {
        if (logicParent._children && logicParent._children[name]) {
            delete logicParent._children[name];
        }
        if (logicParent._nativeElements && logicParent._nativeElements[name]) {
            delete logicParent._nativeElements[name];
        }
    }
    control.destroy();
}
function remove(vNode, parentDOM) {
    unmount(vNode);
    if (parentDOM) {
        removeVNodeDOM(vNode, parentDOM);
    }
}
function unmount(vNode) {
    var flags = vNode.flags;
    var children = vNode.children;
    var ref;
    if (flags & 481 /* Element */) {
        ref = vNode.ref;
        var props = vNode.props;
        var childFlags = vNode.childFlags;
        if (!isNull(props)) {
            var keys = Object.keys(props);
            for (var i = 0, len = keys.length; i < len; i++) {
                var key = keys[i];
                if (delegatedEvents[key]) {
                    handleEvent(key, null, vNode.dom);
                }
            }
        }
        if (childFlags & 12 /* MultipleChildren */) {
            unmountAllChildren(children);
        }
        else if (childFlags === 2 /* HasVNodeChildren */) {
            unmount(children);
        }
        unmountRef(ref);
    }
    else if (flags & 131072 /* WasabyControl */) {
        if (!vNode.compound) {
            unmount(vNode.instance.markup);
            if (!vNode.instance.control._destroyed) {
                vNode.instance.control.destroy();
            }
            vNode.instance.control._mounted = false;
            vNode.instance.control._unmounted = true;
        }
        else {
            compoundUnmountProcess(vNode.instance);
        }
    }
    else if (flags & 262144 /* TemplateWasabyNode */) {
        unmountAllChildren(vNode.markup);
    }
    else if (children) {
        if (flags & 4 /* ComponentClass */) {
            if (isFunction(children.componentWillUnmount)) {
                children.componentWillUnmount();
            }
            unmountRef(vNode.ref);
            children.$UN = true;
            unmount(children.$LI);
        }
        else if (flags & 8 /* ComponentFunction */) {
            ref = vNode.ref;
            if (!isNullOrUndef(ref) && isFunction(ref.onComponentWillUnmount)) {
                ref.onComponentWillUnmount(findDOMfromVNode(vNode, true), vNode.props || EMPTY_OBJ);
            }
            unmount(children);
        }
        else if (flags & 1024 /* Portal */) {
            remove(children, vNode.ref);
        }
        else if (flags & 8192 /* Fragment */) {
            if (vNode.childFlags & 12 /* MultipleChildren */) {
                unmountAllChildren(children);
            }
        }
    }
}
function unmountAllChildren(children) {
    for (var i = 0, len = children.length; i < len; ++i) {
        unmount(children[i]);
    }
}
function clearDOM(dom) {
    // Optimization for clearing dom
    dom.textContent = '';
}
function removeAllChildren(dom, vNode, children) {
    unmountAllChildren(children);
    if (vNode.flags & 8192 /* Fragment */) {
        removeVNodeDOM(vNode, dom);
    }
    else if (vNode.flags & 262144 /* TemplateWasabyNode */) {
        removeVNodeDOM(vNode, dom);
    }
    else {
        clearDOM(dom);
    }
}

function createLinkEvent(linkEvent, nextValue) {
    return function (e) {
        linkEvent(nextValue.data, e);
    };
}
function patchEvent(name, nextValue, dom) {
    var nameLowerCase = name.toLowerCase();
    if (!isFunction(nextValue) && !isNullOrUndef(nextValue)) {
        var linkEvent = nextValue.event;
        if (isFunction(linkEvent)) {
            dom[nameLowerCase] = createLinkEvent(linkEvent, nextValue);
        }
        else {
            // Development warning
            {
                throwError(("an event on a VNode \"" + name + "\". was not a function or a valid linkEvent."));
            }
        }
    }
    else {
        var domEvent = dom[nameLowerCase];
        // if the function is wrapped, that means it's been controlled by a wrapper
        if (!domEvent || !domEvent.wrapped) {
            dom[nameLowerCase] = nextValue;
        }
    }
}
// We are assuming here that we come from patchProp routine
// -nextAttrValue cannot be null or undefined
function patchStyle(lastAttrValue, nextAttrValue, dom) {
    if (isNullOrUndef(nextAttrValue)) {
        dom.removeAttribute('style');
        return;
    }
    var domStyle = dom.style;
    var style;
    var value;
    if (isString(nextAttrValue)) {
        domStyle.cssText = nextAttrValue;
        return;
    }
    if (!isNullOrUndef(lastAttrValue) && !isString(lastAttrValue)) {
        for (style in nextAttrValue) {
            // do not add a hasOwnProperty check here, it affects performance
            value = nextAttrValue[style];
            if (value !== lastAttrValue[style]) {
                domStyle.setProperty(style, value);
            }
        }
        for (style in lastAttrValue) {
            if (isNullOrUndef(nextAttrValue[style])) {
                domStyle.removeProperty(style);
            }
        }
    }
    else {
        for (style in nextAttrValue) {
            value = nextAttrValue[style];
            domStyle.setProperty(style, value);
        }
    }
}
function patchProp(prop, lastValue, nextValue, dom, isSVG, hasControlledValue, lastVNode) {
    switch (prop) {
        case 'children':
        case 'childrenType':
        case 'className':
        case 'defaultValue':
        case 'key':
        case 'multiple':
        case 'ref':
            break;
        case 'autoFocus':
            dom.autofocus = !!nextValue;
            break;
        case 'allowfullscreen':
        case 'autoplay':
        case 'capture':
        case 'checked':
        case 'controls':
        case 'default':
        case 'disabled':
        case 'hidden':
        case 'indeterminate':
        case 'loop':
        case 'muted':
        case 'novalidate':
        case 'open':
        case 'readOnly':
        case 'required':
        case 'reversed':
        case 'scoped':
        case 'seamless':
        case 'selected':
            dom[prop] = !!nextValue;
            break;
        case 'defaultChecked':
        case 'value':
        case 'volume':
            if (hasControlledValue && prop === 'value') {
                break;
            }
            var value = isNullOrUndef(nextValue) ? '' : nextValue;
            if (dom[prop] !== value) {
                dom[prop] = value;
            }
            break;
        case 'style':
            patchStyle(lastValue, nextValue, dom);
            break;
        case 'dangerouslySetInnerHTML':
            var lastHtml = (lastValue && lastValue.__html) || '';
            var nextHtml = (nextValue && nextValue.__html) || '';
            if (lastHtml !== nextHtml) {
                if (!isNullOrUndef(nextHtml) && !isSameInnerHTML(dom, nextHtml)) {
                    if (!isNull(lastVNode)) {
                        if (lastVNode.childFlags & 12 /* MultipleChildren */) {
                            unmountAllChildren(lastVNode.children);
                        }
                        else if (lastVNode.childFlags === 2 /* HasVNodeChildren */) {
                            unmount(lastVNode.children);
                        }
                        lastVNode.children = null;
                        lastVNode.childFlags = 1 /* HasInvalidChildren */;
                    }
                    dom.innerHTML = nextHtml;
                }
            }
            break;
        // Fix for added focus attributes to the node
        // TODO: We have to add these attributes at the element properties on the fly
        case 'ws-creates-context':
            break;
        case 'ws-delegates-tabfocus':
            break;
        case 'title':
            if (isNullOrUndef(nextValue)) {
                dom.removeAttribute(prop);
            }
            else {
                dom.setAttribute(prop, nextValue);
            }
            break;
        default:
            if (delegatedEvents[prop]) {
                if (!(lastValue &&
                    nextValue &&
                    !isFunction(lastValue) &&
                    !isFunction(nextValue) &&
                    lastValue.event === nextValue.event &&
                    lastValue.data === nextValue.data)) {
                    handleEvent(prop, nextValue, dom);
                }
            }
            else if (prop.charCodeAt(0) === 111 && prop.charCodeAt(1) === 110) {
                patchEvent(prop, nextValue, dom);
            }
            else if (isNullOrUndef(nextValue)) {
                dom.removeAttribute(prop);
            }
            else if (isSVG && namespaces[prop]) {
                // We optimize for isSVG being false
                // If we end up in this path we can read property again
                dom.setAttributeNS(namespaces[prop], prop, nextValue);
            }
            else {
                dom.setAttribute(prop, unescape(nextValue));
            }
            break;
    }
}
function mountProps(vNode, flags, props, dom, isSVG) {
    var hasControlledValue = false;
    var isFormElement = (flags & 448 /* FormElement */) > 0;
    if (isFormElement) {
        hasControlledValue = isControlledFormElement(props);
        if (hasControlledValue) {
            addFormElementEventHandlers(flags, dom, props);
        }
    }
    for (var prop in props) {
        // do not add a hasOwnProperty check here, it affects performance
        patchProp(prop, null, props[prop], dom, isSVG, hasControlledValue, null);
    }
    if (isFormElement) {
        processElement(flags, vNode, dom, props, true, hasControlledValue);
    }
}

function warnAboutOldLifecycles(component) {
    var oldLifecycles = [];
    if (component.componentWillMount) {
        oldLifecycles.push('componentWillMount');
    }
    if (component.componentWillReceiveProps) {
        oldLifecycles.push('componentWillReceiveProps');
    }
    if (component.componentWillUpdate) {
        oldLifecycles.push('componentWillUpdate');
    }
    if (oldLifecycles.length > 0) {
        warning(("\n      Warning: Unsafe legacy lifecycles will not be called for components using new component APIs.\n      " + (getComponentName(component)) + " contains the following legacy lifecycles:\n      " + (oldLifecycles.join('\n')) + "\n      The above lifecycles should be removed.\n    "));
    }
}
function renderNewInput(instance, props, context) {
    var nextInput = handleComponentInput(instance.render(props, instance.state, context));
    var childContext = context;
    if (isFunction(instance.getChildContext)) {
        childContext = combineFrom(context, instance.getChildContext());
    }
    instance.$CX = childContext;
    return nextInput;
}
function createClassComponentInstance(vNode, Component, props, context, isSVG, lifecycle) {
    var instance = new Component(props, context);
    var usesNewAPI = (instance.$N = Boolean(Component.getDerivedStateFromProps || instance.getSnapshotBeforeUpdate));
    instance.$SVG = isSVG;
    instance.$L = lifecycle;
    {
        if (instance.getDerivedStateFromProps) {
            warning(((getComponentName(instance)) + " getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method."));
        }
        if (usesNewAPI) {
            warnAboutOldLifecycles(instance);
        }
    }
    vNode.children = instance;
    instance.$BS = false;
    instance.context = context;
    if (instance.props === EMPTY_OBJ) {
        instance.props = props;
    }
    if (!usesNewAPI) {
        if (isFunction(instance.componentWillMount)) {
            instance.$BR = true;
            instance.componentWillMount();
            var pending = instance.$PS;
            if (!isNull(pending)) {
                var state = instance.state;
                if (isNull(state)) {
                    instance.state = pending;
                }
                else {
                    for (var key in pending) {
                        state[key] = pending[key];
                    }
                }
                instance.$PS = null;
            }
            instance.$BR = false;
        }
    }
    else {
        instance.state = createDerivedState(instance, props, instance.state);
    }
    instance.$LI = renderNewInput(instance, props, context);
    return instance;
}
function handleComponentInput(input) {
    if (isInvalid(input)) {
        input = createVoidVNode();
    }
    else if (isStringOrNumber(input)) {
        input = createTextVNode(input, null);
    }
    else if (isArray(input)) {
        input = createFragment(input, 0 /* UnknownChildren */, null);
    }
    else if (input.flags & 16384 /* InUse */) {
        input = directClone(input);
    }
    return input;
}

function getModuleDefaultCtor(mod) {
    // @ts-nocheck
    return typeof mod === 'function' ? mod : mod.constructor;
}
function getControlNodeParams(control, environment) {
    var composedDecorator = VdomLib.Functional.composeWithResultApply.call(undefined, [environment.getMarkupNodeDecorator()]).bind(control);
    return {
        defaultOptions: {},
        markupDecorator: composedDecorator
    };
}
function collectObjectVersions(collection) {
    var versions = {};
    for (var key in collection) {
        if (collection.hasOwnProperty(key)) {
            if (collection[key] && collection[key].getVersion) {
                versions[key] = collection[key].getVersion();
            }
            else if (collection[key] && collection[key].isDataArray) {
                // тут нужно собрать версии всех объектов,
                // которые используются внутри контентных опций
                // здесь учитывается кейс, когда внутри контентной опции
                // есть контентная опция
                // по итогу получаем плоский список всех версий всех объектов
                // внутри контентных опций
                for (var kfn = 0; kfn < collection[key].length; kfn++) {
                    var innerVersions = collectObjectVersions(collection[key][kfn].internal || {});
                    for (var innerKey in innerVersions) {
                        if (innerVersions.hasOwnProperty(innerKey)) {
                            versions[key + ';' + kfn + ';' + innerKey] = innerVersions[innerKey];
                        }
                    }
                }
            }
        }
    }
    return versions;
}
function shallowMerge(dest, src) {
    var i;
    for (i in src) {
        if (src.hasOwnProperty(i)) {
            dest[i] = src[i];
        }
    }
    return dest;
}
function fixInternalParentOptions(internalOptions, userOptions, parentNode) {
    // У compound-контрола parent может уже лежать в user-опциях, берем его оттуда, если нет нашей parentNode
    internalOptions.parent = internalOptions.parent || (parentNode && parentNode.control) || userOptions.parent || null;
    internalOptions.logicParent =
        internalOptions.logicParent ||
            (parentNode && parentNode.control && parentNode.control.logicParent) ||
            userOptions.logicParent ||
            null;
}
function getDecoratedMarkup(controlNode, isRoot) {
    return controlNode.control._getMarkup(controlNode.key, isRoot, {
        attributes: controlNode.attributes,
        domNodeProps: controlNode.domNodeProps,
        events: controlNode.events,
        inheritOptions: controlNode.inheritOptions,
        internal: controlNode.internal,
        key: controlNode.key,
        templateContext: controlNode.templateContext
    });
}
function createNode(controlClass_, options, key, environment, parentNode, serialized, vnode) {
    var controlCnstr = getModuleDefaultCtor(controlClass_);
    var compound = vnode && vnode.compound;
    var serializedState = (serialized && serialized.state) || { vdomCORE: true }; // сериализованное состояние компонента
    var userOptions = options.user; // прикладные опции
    var internalOptions = options.internal || {}; // служебные опции
    var result;
    fixInternalParentOptions(internalOptions, userOptions, parentNode);
    if (!key) {
        /*У каждой ноды должен быть ключ
         * for строит внутренние ноды относительно этого ключа
         * */
        key = '_';
    }
    if (compound) {
        // Создаем виртуальную ноду для compound контрола
        result = ViewUtilsLib.Compatible.createCompoundControlNode(controlClass_, controlCnstr, [], userOptions, internalOptions, key, parentNode, vnode, MarkupLib.GeneratorText);
        result.environment = environment;
        return result;
    }
    else {
        // Создаем виртуальную ноду для не-compound контрола
        var invisible = vnode && vnode.invisible;
        // подмешиваем сериализованное состояние к прикладным опциям
        var optionsWithState = serializedState ? shallowMerge(userOptions, serializedState) : userOptions;
        var optionsVersions;
        var contextVersions;
        var control;
        // @ts-ignore
        var params;
        var context;
        var instCompat;
        var defaultOptions;
        if (typeof controlClass_ === 'function') {
            // создаем инстанс компонента
            instCompat = ViewUtilsLib.Compatible.createInstanceCompatible(controlCnstr, optionsWithState, internalOptions);
            control = instCompat.instance;
            optionsWithState = instCompat.resolvedOptions;
            defaultOptions = instCompat.defaultOptions;
        }
        else {
            // инстанс уже есть, работаем с его опциями
            control = controlClass_;
            defaultOptions = ViewUtilsLib.OptionsResolver.getDefaultOptions(controlClass_);
            // @ts-ignore
            if (isJs.compat) {
                optionsWithState = ViewUtilsLib.Compatible.combineOptionsIfCompatible(controlCnstr.prototype, optionsWithState, internalOptions);
                if (control._setInternalOptions) {
                    control._options.doNotSetParent = true;
                    control._setInternalOptions(internalOptions || {});
                }
            }
        }
        // check current options versions
        optionsVersions = collectObjectVersions(optionsWithState);
        // check current context field versions
        context = (vnode && vnode.context) || {};
        contextVersions = collectObjectVersions(context);
        params = getControlNodeParams(control, environment);
        result = new WCN(options, control, controlCnstr, optionsWithState, internalOptions, optionsVersions, serialized, parentNode, key, invisible, params, defaultOptions, vnode, contextVersions);
        environment.setupControlNode(result);
        return result;
    }
}
function WCN(options, control, controlCnstr, optionsWithState, internalOptions, optionsVersions, serialized, parentNode, key, invisible, params, defaultOptions, vnode, contextVersions) {
    this.attributes = options.attributes;
    this.events = options.events;
    this.control = control;
    this.errors = serialized && serialized.errors;
    this.controlClass = controlCnstr;
    this.options = optionsWithState;
    this.internalOptions = internalOptions;
    this.optionsVersions = optionsVersions;
    this.id = control._instId || 0;
    this.idCount = parseInt(this.id.replace('inst_', ''), 10);
    this.parent = parentNode;
    this.key = key;
    this.defaultOptions = defaultOptions;
    this.markup = invisible ? createTextVNode('') : undefined;
    this.fullMarkup = undefined;
    this.childrenNodes = [];
    this.markupDecorator = params && params.markupDecorator;
    this.serializedChildren = serialized && serialized.childrenNodes;
    this.hasCompound = false;
    this.receivedState = undefined;
    this.invisible = invisible;
    this.contextVersions = contextVersions;
    this.context = (vnode && vnode.context) || {},
        this.inheritOptions = (vnode && vnode.inheritOptions) || {};
}
var nextTickWasaby = typeof Promise !== 'undefined' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout.bind(window);

function ifRawMarkupNode(vNode) {
    return vNode && vNode.hasOwnProperty('nodeProperties') && vNode.hasOwnProperty('markup');
}
function mount(vNode, parentDOM, context, isSVG, nextNode, lifecycle, isRootStart, environment, parentControlNode, parentVNode) {
    var flags = (vNode.flags |= 16384 /* InUse */);
    if (flags & 481 /* Element */) {
        mountElement(vNode, parentDOM, context, isSVG, nextNode, lifecycle, isRootStart, environment, parentControlNode);
    }
    else if (flags & 4 /* ComponentClass */) {
        mountClassComponent(vNode, parentDOM, context, isSVG, nextNode, lifecycle);
    }
    else if (flags & 8 /* ComponentFunction */) {
        mountFunctionalComponent(vNode, parentDOM, context, isSVG, nextNode, lifecycle);
    }
    else if (flags & 512 /* Void */ || flags & 16 /* Text */) {
        mountText(vNode, parentDOM, nextNode);
    }
    else if (flags & 8192 /* Fragment */) {
        mountFragment(vNode, parentDOM, context, isSVG, nextNode, lifecycle);
    }
    else if (flags & 1024 /* Portal */) {
        mountPortal(vNode, context, parentDOM, nextNode, lifecycle);
    }
    else if (vNode instanceof ExpressionsLib.RawMarkupNode || ifRawMarkupNode(vNode)) {
        return mountHTML(vNode, parentDOM, nextNode);
    }
    else if (flags & 131072 /* WasabyControl */ || flags === 147456) {
        mountWasabyControl(vNode, parentDOM, isSVG, nextNode, lifecycle, isRootStart, environment, parentControlNode, parentVNode);
    }
    else if (flags & 262144 /* TemplateWasabyNode */) {
        mountWasabyTemplateNode(vNode, parentDOM, isSVG, nextNode, lifecycle, isRootStart, environment, parentControlNode, parentVNode);
    }
    else {
        // Development validation, in production we don't need to throw because it crashes anyway
        if (typeof vNode === 'object') {
            throwError(("mount() received an object that's not a valid VNode, you should stringify it first, fix createVNode flags or call normalizeChildren. Object: \"" + (JSON.stringify(vNode)) + "\"."));
        }
        else {
            throwError(("mount() expects a valid VNode, instead it received an object with the type \"" + (typeof vNode) + "\"."));
        }
    }
}
function mountHTML(vNode, parentDom, nextNode) {
    // @ts-ignore
    var dom = (vNode.dom = $(vNode.markup)[0]);
    if (!isNull(parentDom)) {
        insertOrAppend(parentDom, dom, nextNode);
    }
    return dom;
}
function mountPortal(vNode, context, parentDOM, nextNode, lifecycle) {
    mount(vNode.children, vNode.ref, context, false, null, lifecycle);
    var placeHolderVNode = createVoidVNode();
    mountText(placeHolderVNode, parentDOM, nextNode);
    vNode.dom = placeHolderVNode.dom;
}
function mountFragment(vNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    var children = vNode.children;
    if (vNode.childFlags === 2 /* HasVNodeChildren */) {
        mount(children, parentDOM, nextNode, isSVG, nextNode, lifecycle);
    }
    else {
        mountArrayChildren(children, parentDOM, context, isSVG, nextNode, lifecycle);
    }
}
function mountText(vNode, parentDOM, nextNode) {
    var dom = (vNode.dom = document.createTextNode(unescape(vNode.children)));
    if (!isNull(parentDOM)) {
        insertOrAppend(parentDOM, dom, nextNode);
    }
}
function mountTextContent(dom, children) {
    dom.textContent = children;
}
function closest(sourceElement, rootElement) {
    while (sourceElement.parentNode) {
        sourceElement = sourceElement.parentNode;
        if (sourceElement === rootElement) {
            return true;
        }
    }
    return false;
}
function fireEvent(e) {
    if (!this._rootDOMNode) {
        return;
    }
    var relatedTarget = e.relatedTarget || document.body;
    var target = e.target;
    var evt = document.createEvent('Events');
    evt.initEvent('keydown', true, true);
    var shifted = false;
    if (target.className === 'vdom-focus-in') {
        if (closest(relatedTarget, this._rootDOMNode)) {
            // в vdom-focus-in прилетели либо изнутри контейнера, либо сверху потому что зациклились, shift - только если изнутри
            if (!(relatedTarget.classList.contains('vdom-focus-out') && this._rootDOMNode['ws-tab-cycling'] === 'true')) {
                shifted = true;
            }
        }
    }
    if (target.className === 'vdom-focus-out') {
        if (!closest(relatedTarget, this._rootDOMNode)) {
            // в vdom-focus-out прилетели либо снаружи контейнера, либо снизу потому что зациклились, shift - и если снаружи и если зациклились
            shifted = true;
        }
    }
    // @ts-ignore
    evt.view = window;
    // @ts-ignore
    evt.altKey = false;
    // @ts-ignore
    evt.ctrlKey = false;
    // @ts-ignore
    evt.shiftKey = shifted;
    // @ts-ignore
    evt.metaKey = false;
    // @ts-ignore
    evt.keyCode = 9;
    target.dispatchEvent(evt);
}
function findFirstVNode(arr) {
    if (!Array.isArray(arr)) {
        return null;
    }
    return arr.find(function (value) {
        return !!value;
    });
}
function appendFocusesElements(self, vnode) {
    var firstChild = findFirstVNode(vnode.children);
    var fireTab = function (e) {
        fireEvent.call(self, e);
    };
    var hookOut = function hookOut(node) {
        if (node) {
            node.addEventListener('focus', fireTab);
        }
    };
    // добавляем ноды vdom-focus-in и vdom-focus-out тольео если есть какие-то внутренние ноды
    if (firstChild && firstChild.key !== 'vdom-focus-in') {
        var focusInNode = createVNode(getFlagsForElementVnode('a'), 'a', 'vdom-focus-in', [], 0, {
            class: 'vdom-focus-in',
            tabindex: '1'
        }, 'vdom-focus-in', hookOut);
        var focusOutNode = createVNode(getFlagsForElementVnode('a'), 'a', 'vdom-focus-out', [], 0, {
            class: 'vdom-focus-out',
            tabindex: '0'
        }, 'vdom-focus-out', hookOut);
        // @ts-ignore
        vnode.children = [].concat(focusInNode, vnode.children, focusOutNode);
        return { in: focusInNode, out: focusOutNode };
    }
    return false;
}
/**
   * We have to find focus elements, that belongs to the specific rootNode
   * @param elem
   * @param cssClass
   * @returns {*}
   */
/**
 * We have to find focus elements, that belongs to the specific rootNode
 * @param elem
 * @param cssClass
 * @returns {*}
 */
function findDirectChildren(elem, cssClass) {
    return Array.prototype.filter.call(elem.children, function (el) {
        return el.matches(cssClass);
    });
} /**
 * We have to insert focus elements are already in the DOM,  before virtual dom synchronization
 * @param rootElement
 */
/**
 * We have to insert focus elements are already in the DOM,  before virtual dom synchronization
 * @param rootElement
 */
function appendFocusElementsToDOM(rootElement, appendedElements) {
    var firstChild = rootElement.firstChild;
    if (firstChild && firstChild.classList && !firstChild.classList.contains('vdom-focus-in')) {
        var vdomFocusInElems = findDirectChildren(rootElement, '.vdom-focus-in');
        var vdomFocusOutElems = findDirectChildren(rootElement, '.vdom-focus-out');
        var focusInElem = vdomFocusInElems.length ? vdomFocusInElems[0] : document.createElement('a');
        focusInElem.classList.add('vdom-focus-in');
        focusInElem.tabIndex = 1;
        var focusOutElem = vdomFocusOutElems.length ? vdomFocusOutElems[0] : document.createElement('a');
        focusOutElem.classList.add('vdom-focus-out');
        focusOutElem.tabIndex = 0;
        rootElement.insertBefore(focusInElem, firstChild);
        rootElement.appendChild(focusOutElem);
        appendedElements.in.dom = focusInElem;
        appendedElements.out.dom = focusOutElem;
        return true;
    }
    return false;
}
function appendForFocuses(vNode, environment) {
    if (vNode.type === 'body') {
        if (vNode && vNode.children) {
            var appendedElements = appendFocusesElements(environment, vNode);
            if (appendedElements) {
                var bodyDOM = vNode.dom;
                if (bodyDOM) {
                    appendFocusElementsToDOM(bodyDOM, appendedElements);
                }
            }
        }
    }
}
function mountElement(vNode, parentDOM, context, isSVG, nextNode, lifecycle, isRootStart, environment, parentControlNode) {
    var flags = vNode.flags;
    var props = vNode.props;
    var className = vNode.className;
    var ref = vNode.ref;
    var children = vNode.children;
    var childFlags = vNode.childFlags;
    isSVG = isSVG || (flags & 32 /* SvgElement */) > 0;
    var dom = isRootStart && parentDOM ? parentDOM : documentCreateElement(vNode.type, isSVG);
    vNode.dom = dom;
    appendForFocuses(vNode, environment);
    if (!isNullOrUndef(className) && className !== '') {
        if (dom) {
            if (isSVG) {
                dom.setAttribute('class', className);
            }
            else {
                dom.className = className;
            }
        }
    }
    {
        validateKeys(vNode);
    }
    if (!isRootStart && !isNull(parentDOM)) {
        if (parentDOM !== nextNode) {
            insertOrAppend(parentDOM, dom, nextNode);
        }
        else {
            vNode.dom = nextNode;
            dom = nextNode;
        }
    }
    if (vNode.hprops && vNode.hprops.events && Object.keys(vNode.hprops.events).length > 0) {
        var setEventFunction = VdomLib.Hooks.setEventHooks(environment);
        var templateNodeEventRef = setEventFunction(vNode.type, vNode.hprops, vNode.children, vNode.key, parentControlNode, vNode.ref);
        vNode.ref = templateNodeEventRef[4];
        ref = vNode.ref;
    }
    if (childFlags === 16 /* HasTextChildren */) {
        if (dom) {
            mountTextContent(dom, children);
        }
    }
    else if (childFlags !== 1 /* HasInvalidChildren */) {
        var childrenIsSVG = isSVG && vNode.type !== 'foreignObject';
        if (childFlags === 2 /* HasVNodeChildren */) {
            if (children.flags & 16384 /* InUse */) {
                vNode.children = children = directClone(children);
            }
            mount(children, dom, context, childrenIsSVG, null, lifecycle, parentControlNode, vNode);
        }
        else if (childFlags === 8 /* HasKeyedChildren */ || childFlags === 4 /* HasNonKeyedChildren */) {
            if (dom) {
                mountArrayChildren(children, dom, context, childrenIsSVG, null, lifecycle, environment, parentControlNode, vNode);
            }
        }
    }
    if (!isNull(props)) {
        if (vNode.type === 'link') {
            if (dom) {
                // @ts-ignore
                if (props.href !== (dom.attributes.href && dom.attributes.href.value)) {
                    mountProps(vNode, flags, props, dom, isSVG);
                }
            }
        }
        else {
            mountProps(vNode, flags, props, dom, isSVG);
        }
    }
    {
        if (isString(ref)) {
            throwError('string "refs" are not supported in Inferno 1.0. Use callback ref or Inferno.createRef() API instead.');
        }
    }
    mountRef(ref, dom, lifecycle);
}
function mountArrayChildren(children, dom, context, isSVG, nextNode, lifecycle, environment, parentControlNode, parentVNode) {
    for (var i = 0, len = children.length; i < len; ++i) {
        var child = children[i];
        if (child.flags & 16384 /* InUse */) {
            children[i] = child = directClone(child);
        }
        if (child.controlClass || child.template) {
            if (!child.sibling) {
                child.sibling = children[i + 1];
            }
        }
        mount(child, dom, context, isSVG, nextNode, lifecycle, false, environment, parentControlNode, parentVNode);
    }
}
function mountClassComponent(vNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    var instance = createClassComponentInstance(vNode, vNode.type, vNode.props || EMPTY_OBJ, context, isSVG, lifecycle);
    mount(instance.$LI, parentDOM, instance.$CX, isSVG, nextNode, lifecycle);
    mountClassComponentCallbacks(vNode.ref, instance, lifecycle);
    instance.$UPD = false;
}
function afterMountProcess(controlNode) {
    try {
        // @ts-ignore
        var afterMountValue = controlNode.control._afterMount && controlNode.control._afterMount(controlNode.options, controlNode.context);
        controlNode.control._mounted = true;
        if (controlNode.control._$needForceUpdate) {
            delete controlNode.control._$needForceUpdate;
            controlNode.control._forceUpdate();
        }
    }
    catch (error) {
        // @ts-ignore
        catchLifeCircleErrors('_afterMount', error, controlNode.control._moduleName);
    }
}
function compoundMountProcess(controlNode) {
    var options$$1 = controlNode.options;
    var element = controlNode.markup.dom;
    var name = options$$1.name;
    var logicParent = options$$1.logicParent;
    options$$1.element = element;
    options$$1.hasMarkup = true;
    options$$1.parent = null;
    controlNode.control = new controlNode.controlClass(options$$1);
    var control = controlNode.control;
    if (logicParent && name) {
        if (logicParent._children) {
            logicParent._children[name] = control;
        }
        if (logicParent._nativeElements) {
            logicParent._nativeElements[name] = element;
        }
    }
}
function beforeRenderCallback(controlNode) {
    return function () {
        try {
            if (!controlNode.control._destroyed) {
                // @ts-ignore
                var afterUpdateResult = controlNode.control._beforeRender && controlNode.control._beforeRender();
            }
        }
        catch (error) {
            // @ts-ignore
            catchLifeCircleErrors('beforeRender', error, controlNode.control._moduleName);
        }
    };
}
function mountWasabyCallback(controlNode) {
    return function () {
        if (controlNode.compound) {
            compoundMountProcess(controlNode);
        }
        else {
            // _reactiveStart means starting of monitor change in properties
            controlNode.control._reactiveStart = true;
            if (!controlNode.control._mounted && !controlNode.control._unmounted) {
                if (controlNode.hasCompound) {
                    VdomLib.runDelayedRebuild(function () {
                        afterMountProcess(controlNode);
                    });
                }
                else {
                    afterMountProcess(controlNode);
                }
            }
            else {
                /**
                 * TODO: удалить после синхронизации с контролами
                 */
                try {
                    if (!controlNode.control._destroyed) {
                        // @ts-ignore
                        var afterUpdateResult = controlNode.control._afterRender && controlNode.control._afterRender();
                    }
                }
                catch (error) {
                    // @ts-ignore
                    catchLifeCircleErrors('afterRender', error, controlNode.control._moduleName);
                }
                try {
                    if (!controlNode.control._destroyed) {
                        // @ts-ignore
                        var afterUpdateResult$1 = controlNode.control._beforePaint && controlNode.control._beforePaint();
                    }
                }
                catch (error) {
                    // @ts-ignore
                    catchLifeCircleErrors('beforePaint', error, controlNode.control._moduleName);
                }
                try {
                    if (!controlNode.control._destroyed) {
                        // @ts-ignore
                        var afterUpdateResult$2 = controlNode.control._afterUpdate && controlNode.control._afterUpdate(controlNode.oldOptions || controlNode.options, controlNode.oldContext);
                    }
                }
                catch (error) {
                    // @ts-ignore
                    catchLifeCircleErrors('_afterUpdate', error, controlNode.control._moduleName);
                }
                finally {
                    // We need controlNode.oldOptions only in _afterUpdate method. Can delete them from node after using.
                    delete controlNode.oldOptions;
                }
            }
        }
    };
}
function catchLifeCircleErrors(hookName, error, moduleName) {
    // @ts-ignore
    Env.IoC.resolve("ILogger").log('LIFECYCLE ERROR. IN CONTROL ' + moduleName + '. HOOK NAME: ' + hookName, error, error);
}
function findTopConfig(configId) {
    return (configId + '').replace('cfg-', '').split(',')[0];
}
function fillCtx(control, vnode, resolvedCtx) {
    control._saveContextObject(resolvedCtx);
    control.saveFullContext(ExpressionsLib.ContextResolver.wrapContext(control, vnode.context || {}));
}
function getStateReadyOrCall(stateVar, control, vnode, serializer) {
    var data;
    var srec;
    // @ts-ignore
    if (AppInit.isInit()) {
        // @ts-ignore
        srec = Request.getStateReceiver();
    }
    if (srec && srec.register) {
        srec.register(stateVar, {
            getState: function getState() {
                return {};
            },
            setState: function setState(rState) {
                data = rState;
            }
        });
    }
    /* Compat layer. For page without Controls.Application */
    if (!data && window["inline" + stateVar]) {
        data = JSON.parse(window["inline" + stateVar], serializer.deserialize);
        if (window["inline" + stateVar]) {
            window["inline" + stateVar] = undefined;
        }
    }
    var ctx = ExpressionsLib.ContextResolver.resolveContext(control.constructor, vnode.context || {}, control);
    var res;
    try {
        res = data ? control._beforeMountLimited(vnode.controlProperties, ctx, data) : control._beforeMountLimited(vnode.controlProperties, ctx);
    }
    catch (error) {
        // @ts-ignore
        catchLifeCircleErrors('_beforeMount', error, control._moduleName);
    }
    if (res && res.then) {
        res.then(function (resultDef) {
            fillCtx(control, vnode, ctx);
            return resultDef;
        });
    }
    else {
        fillCtx(control, vnode, ctx);
    }
    if (!vnode.inheritOptions) {
        vnode.inheritOptions = {};
    }
    ViewUtilsLib.OptionsResolver.resolveInheritOptions(vnode.controlClass, vnode, vnode.controlProperties);
    control.saveInheritOptions(vnode.inheritOptions);
    if (srec && srec.unregister) {
        srec.unregister(stateVar);
    }
    return res;
}
function updateWasabyControl(controlNode, parentDOM, lifecycle) {
    var shouldUp;
    try {
        var resolvedContext;
        //  Logger.log('DirtyChecking (update node with changed)', [
        //      '',
        //      '',
        //      changedOptions || changedInternalOptions || changedAttrs || changedContext
        //  ]);
        controlNode.environment.setRebuildIgnoreId(controlNode.id);
        ViewUtilsLib.OptionsResolver.resolveInheritOptions(controlNode.controlClass, controlNode, controlNode.options);
        controlNode.control.saveInheritOptions(controlNode.inheritOptions);
        resolvedContext = ExpressionsLib.ContextResolver.resolveContext(controlNode.controlClass, controlNode.context, controlNode.control);
        // Forbid force update in the time between _beforeUpdate and _afterUpdate
        // @ts-ignore
        ReactiveObserver.pauseReactive(controlNode.control, function () {
            // Forbid force update in the time between _beforeUpdate and _afterUpdate
            // @ts-ignore
            var beforeUpdateResults = controlNode.control._beforeUpdate && controlNode.control.__beforeUpdate(controlNode.control._options, resolvedContext);
        });
        // controlNode.control._options = newOptions;
        // @ts-ignore
        var shouldUpdate = (controlNode.control._shouldUpdate ? controlNode.control._shouldUpdate(controlNode.control._options, resolvedContext) : true);
        // controlNode.control._setInternalOptions(changedInternalOptions || {});
        controlNode.oldOptions = controlNode.options; // TODO Для afterUpdate подумать, как еще можно передать
        // TODO Для afterUpdate подумать, как еще можно передать
        controlNode.oldContext = controlNode.context; // TODO Для afterUpdate подумать, как еще можно передать
        // TODO Для afterUpdate подумать, как еще можно передать
        // controlNode.attributes = nextVNode.controlAttributes;
        // controlNode.events = nextVNode.controlEvents;
        controlNode.control._saveContextObject(resolvedContext);
        controlNode.control.saveFullContext(ExpressionsLib.ContextResolver.wrapContext(controlNode.control, controlNode.control._context));
    }
    finally {
        /**
         * TODO: удалить после синхронизации с контролами
         */
        shouldUp = controlNode.control._shouldUpdate ? controlNode.control._shouldUpdate(controlNode.control._options, controlNode.context) : true;
    }
    if (shouldUp) {
        controlNode.control.saveFullContext(ExpressionsLib.ContextResolver.wrapContext(controlNode.control, controlNode.context || {}));
        // @ts-ignore
        var nextInput = getDecoratedMarkup(controlNode, false);
        var controlElement = (nextInput.instance && nextInput.instance.markup.dom) || controlNode.element;
        // nextVNode.instance = controlNode;
        nextInput.ref = controlNode.markup.ref;
        lifecycle.mount.push(beforeRenderCallback(controlNode));
        // @ts-ignore
        patch$1(controlNode.markup, nextInput, parentDOM, {}, false, controlElement, lifecycle, false, controlNode.environment, controlNode);
        controlNode.markup = nextInput;
        controlNode.fullMarkup = controlNode.markup;
        lifecycle.mount.push(mountWasabyCallback(controlNode));
    }
}
function applyWasabyState(component, pNode) {
    var lifecycle = [];
    // @ts-ignore
    lifecycle.mount = [];
    var controlContainer = (component.control._container && (component.control._container[0] || component.control._container));
    var savedActiveElement = document.activeElement;
    var prevControls = FocusLib.goUpByControlTree(savedActiveElement);
    updateWasabyControl(component, pNode || controlContainer, lifecycle);
    component.environment._restoreFocusState = true; // если сразу после изменения DOM-дерева фокус слетел в body, пытаемся восстановить фокус на ближайший элемент от
    // предыдущего активного, чтобы сохранить контекст фокуса и дать возможность управлять с клавиатуры
    // если сразу после изменения DOM-дерева фокус слетел в body, пытаемся восстановить фокус на ближайший элемент от
    // предыдущего активного, чтобы сохранить контекст фокуса и дать возможность управлять с клавиатуры
    if (document.activeElement === document.body && document.activeElement !== savedActiveElement) {
        prevControls.find(function (control) {
            var container = control._container[0] ? control._container[0] : control._container;
            // @ts-ignore
            return isElementVisible(control._container) && FocusLib.focus(container);
        });
    }
    component.environment._restoreFocusState = false; // для совместимости, фокус устанавливаелся через старый механизм setActive, нужно восстановить фокус после _rebuild
    // для совместимости, фокус устанавливаелся через старый механизм setActive, нужно восстановить фокус после _rebuild
    if (component.control.__$focusing) {
        component.control.activate(); // до синхронизации мы сохранили __$focusing - фокусируемый элемент, а после синхронизации здесь фокусируем его.
        // если не нашли фокусируемый элемент - значит в доме не оказалось этого элемента.
        // но мы все равно отменяем скинем флаг, чтобы он не сфокусировался позже когда уже не надо
        // https://online.sbis.ru/opendoc.html?guid=e46d87cc-5dc2-4f67-b39c-5eeea973b2cc
        // до синхронизации мы сохранили __$focusing - фокусируемый элемент, а после синхронизации здесь фокусируем его.
        // если не нашли фокусируемый элемент - значит в доме не оказалось этого элемента.
        // но мы все равно отменяем скинем флаг, чтобы он не сфокусировался позже когда уже не надо
        // https://online.sbis.ru/opendoc.html?guid=e46d87cc-5dc2-4f67-b39c-5eeea973b2cc
        component.control.__$focusing = false;
    }
    component.environment.addTabListener();
    // Call all lifecycle if all async controls in current environment are updated.
    if (Object.keys(component.environment.asyncRenderIds).length === 0) {
        if (lifecycle.length > 0) {
            callAll(lifecycle);
        }
        // @ts-ignore
        if (lifecycle.mount.length > 0) {
            // @ts-ignore
            callAll(lifecycle.mount);
        }
    }
}
function startQueue(queue, environment) {
    var filteredQueue = [].concat( queue );
    filteredQueue.sort(function (a, b) { return b.idCount - a.idCount; });
    rerenderWasaby(filteredQueue, environment);
}
// @ts-ignore
function queueWasabyControlChanges(controlNode, regular) {
    var queue = controlNode.environment.infernoQueue;
    // @ts-ignore
    if (queue.indexOf(controlNode) === -1) {
        if (regular) {
            queue.unshift(controlNode);
        }
        else {
            queue.push(controlNode);
        }
    }
    VdomLib.runDelayedRebuild(function () {
        startQueue(controlNode.environment.infernoQueue, controlNode.environment);
    });
}
function rerenderWasaby(queue, environment) {
    var component;
    while (Object.keys(environment.asyncRenderIds).length === 0 && (component = queue.pop())) {
        var componentIndex = environment.infernoQueue.indexOf(component);
        if (componentIndex !== -1) {
            environment.infernoQueue.splice(componentIndex, 1);
        }
        if (component && component.control && component.control._mounted) {
            applyWasabyState(component, component.parentDOM);
        }
    }
}
function setWasabyControlNodeHooks(controlNode, vNode, parentVNode, isRootStart, parentDOM, lifecycle, environment) {
    var setHookFunction;
    var controlNodeRef;
    var setEventFunction;
    var controlNodeEventRef;
    // @ts-ignore
    controlNode.markup = getDecoratedMarkup(controlNode, isRootStart);
    if (controlNode.markup && controlNode.markup.type && controlNode.markup.type === 'invisible-node') {
        setHookFunction = VdomLib.Hooks.setControlNodeHook(controlNode);
        if (controlNode.markup.ref && parentVNode.ref) {
            var cnmRef = controlNode.markup.ref;
            // @ts-ignore
            controlNode.markup.ref = function (domNode) {
                cnmRef(parentDOM);
                parentVNode.ref(parentDOM);
            };
        }
        controlNodeRef = setHookFunction(controlNode.markup.type, controlNode.markup.props, controlNode.markup.children, controlNode.key, controlNode, parentVNode.ref || controlNode.markup.ref);
        parentVNode.ref = controlNodeRef[4];
        setEventFunction = VdomLib.Hooks.setEventHooks(environment);
        controlNodeEventRef = setEventFunction(controlNode.markup.type, {
            attributes: vNode.controlAttributes,
            events: (controlNode.markup.hprops && controlNode.markup.hprops.events) || vNode.controlEvents
        }, controlNode.markup.children, controlNode.key, controlNode, parentVNode.ref);
        parentVNode.ref = controlNodeEventRef[4];
        controlNode.fullMarkup = controlNode.markup;
        vNode.instance = controlNode;
        vNode.instance.parentDOM = parentDOM;
        vNode.ref = parentVNode.ref;
        mountRef(parentVNode.ref, parentVNode.dom || parentVNode.element || parentDOM, lifecycle);
    }
    else {
        setHookFunction = VdomLib.Hooks.setControlNodeHook(controlNode);
        if (controlNode.markup.ref && vNode.ref) {
            var cnmRef$1 = controlNode.markup.ref;
            controlNode.markup.ref = function (domNode) {
                cnmRef$1(domNode);
                vNode.ref(domNode);
            };
        }
        controlNodeRef = setHookFunction(controlNode.markup.type, controlNode.markup.props, controlNode.markup.children, controlNode.key, controlNode, controlNode.markup.ref || vNode.ref);
        controlNode.markup.ref = controlNodeRef[4];
        setEventFunction = VdomLib.Hooks.setEventHooks(environment);
        controlNodeEventRef = setEventFunction(controlNode.markup.type, {
            attributes: vNode.controlAttributes,
            events: (controlNode.markup.hprops && controlNode.markup.hprops.events) || vNode.controlEvents
        }, controlNode.markup.children, controlNode.key, controlNode, controlNode.markup.ref);
        vNode.instance = controlNode;
        vNode.instance.parentDOM = parentDOM;
        vNode.instance.markup.ref = controlNodeEventRef[4];
    }
    return vNode;
}
// @ts-ignore
var Slr = new Serializer();
// @ts-ignore
function createWasabyControlInstance(vNode, parentDOM, isSVG, nextNode, lifecycle, isRootStart, environment, parentControlNode, parentVNode, fromHyd) {
    var controlNode;
    var carrier;
    var setHookFunction;
    var setEventFunction;
    var controlNodeEventRef;
    var controlNodeRef;
    if (vNode && !vNode.instance) {
        controlNode = createNode(vNode.controlClass, {
            attributes: vNode.controlAttributes,
            events: vNode.controlEvents,
            internal: vNode.controlInternalProperties,
            user: vNode.controlProperties
        }, vNode.key, environment, parentControlNode, vNode.serialized, vNode);
        if (!controlNode.compound) {
            if (!controlNode.control._mounted && !controlNode.control._unmounted) {
                var control = controlNode.control;
                var rstate = controlNode.key ? findTopConfig(controlNode.key) : '';
                if (control._beforeMountLimited) {
                    carrier = getStateReadyOrCall(rstate, control, vNode, Slr);
                }
                if (carrier) {
                    controlNode.receivedState = carrier;
                }
                if (controlNode.control.saveOptions) {
                    controlNode.control.saveOptions(controlNode.options, controlNode);
                }
                else {
                    /**
                      * Поддержка для совместимости версий контролов
                     */
                    controlNode.control._options = controlNode.options;
                    controlNode.control._container = controlNode.element;
                    controlNode.control._setInternalOptions(vNode.controlInternalProperties || {});
                }
            }
        }
    }
    else {
        controlNode = vNode.instance;
    }
    if (carrier && carrier.then) {
        controlNode.markup = createVNode(getFlagsForElementVnode('span'), 'span', '', [], 0, controlNode.attributes, controlNode.key);
        vNode.instance = controlNode;
        vNode.instance.parentDOM = parentDOM;
        vNode.carrier = carrier;
        // if (parentVNode) {
        //   mountRef(parentVNode.ref, parentVNode.dom || parentVNode.element || parentDOM, lifecycle);
        // }
    }
    else if (!controlNode.compound) {
        controlNode.control.saveFullContext(ExpressionsLib.ContextResolver.wrapContext(controlNode.control, controlNode.context || {}));
        controlNode.markup = getDecoratedMarkup(controlNode, isRootStart);
        if (controlNode.markup && controlNode.markup.type && controlNode.markup.type === 'invisible-node') {
            setHookFunction = VdomLib.Hooks.setControlNodeHook(controlNode);
            if (controlNode.markup.ref && parentVNode.ref) {
                var cnmRef = controlNode.markup.ref;
                // @ts-ignore
                controlNode.markup.ref = function (domNode) {
                    cnmRef(parentDOM);
                    parentVNode.ref(parentDOM);
                };
            }
            controlNodeRef = setHookFunction(controlNode.markup.type, controlNode.markup.props, controlNode.markup.children, controlNode.key, controlNode, parentVNode.ref || controlNode.markup.ref);
            parentVNode.ref = controlNodeRef[4];
            setEventFunction = VdomLib.Hooks.setEventHooks(environment);
            controlNodeEventRef = setEventFunction(controlNode.markup.type, {
                attributes: vNode.controlAttributes,
                events: (controlNode.markup.hprops && controlNode.markup.hprops.events) || vNode.controlEvents
            }, controlNode.markup.children, controlNode.key, controlNode, parentVNode.ref);
            parentVNode.ref = controlNodeEventRef[4];
            controlNode.fullMarkup = controlNode.markup;
            vNode.instance = controlNode;
            vNode.instance.parentDOM = parentDOM;
            vNode.ref = parentVNode.ref;
            mountRef(parentVNode.ref, parentVNode.dom || parentVNode.element || parentDOM, lifecycle);
        }
        else {
            setHookFunction = VdomLib.Hooks.setControlNodeHook(controlNode);
            if (controlNode.markup.ref && vNode.ref) {
                var cnmRef$1 = controlNode.markup.ref;
                controlNode.markup.ref = function (domNode) {
                    cnmRef$1(domNode);
                    vNode.ref(domNode);
                };
            }
            controlNodeRef = setHookFunction(controlNode.markup.type, controlNode.markup.props, controlNode.markup.children, controlNode.key, controlNode, controlNode.markup.ref || vNode.ref);
            controlNode.markup.ref = controlNodeRef[4];
            setEventFunction = VdomLib.Hooks.setEventHooks(environment);
            controlNodeEventRef = setEventFunction(controlNode.markup.type, {
                attributes: vNode.controlAttributes,
                events: (controlNode.markup.hprops && controlNode.markup.hprops.events) || vNode.controlEvents
            }, controlNode.markup.children, controlNode.key, controlNode, controlNode.markup.ref);
            vNode.instance = controlNode;
            vNode.instance.parentDOM = parentDOM;
            vNode.instance.markup.ref = controlNodeEventRef[4];
        }
    }
    else {
        vNode.instance = controlNode;
        vNode.instance.parentDOM = parentDOM;
    }
    return vNode;
}
function mountWasabyControl(vNode, parentDOM, isSVG, nextNode, lifecycle, isRootStart, environment, parentControlNode, parentVNode) {
    if (!environment.infernoQueue) {
        environment.infernoQueue = [];
    }
    if (!environment.asyncRenderIds) {
        environment.asyncRenderIds = {};
    }
    var VirtualNode = createWasabyControlInstance(vNode, parentDOM, isSVG, nextNode, lifecycle, isRootStart, environment, parentControlNode, parentVNode);
    if (parentVNode && parentVNode.controlClass) {
        VirtualNode.sibling = parentVNode.sibling;
    }
    if (VirtualNode.carrier && VirtualNode.carrier.then) {
        if (VirtualNode.instance.control && VirtualNode.instance.control._forceUpdate) {
            environment.asyncRenderIds[VirtualNode.instance.id] = true;
            VirtualNode.instance.control._forceUpdate = function (memo) {
                // var lifecycle = [];
                // @ts-ignore
                if (memo === 'mount') {
                    delete environment.asyncRenderIds[VirtualNode.instance.id];
                    if (VirtualNode.compound || (VirtualNode.instance.markup && VirtualNode.instance.markup.type !== 'invisible-node')) {
                        VirtualNode = setWasabyControlNodeHooks(VirtualNode.instance, VirtualNode, parentVNode, isRootStart, parentDOM, lifecycle, environment);
                        if (VirtualNode.sibling) {
                            if (VirtualNode.sibling.dom) {
                                nextNode = VirtualNode.sibling.dom;
                            }
                            else {
                                nextNode = VirtualNode.sibling;
                            }
                        }
                        lifecycle.mount.push(beforeRenderCallback(VirtualNode.instance));
                        mount(VirtualNode.instance.markup, parentDOM, {}, isSVG, nextNode, lifecycle, isRootStart, environment, VirtualNode.instance, VirtualNode);
                        lifecycle.mount.push(mountWasabyCallback(VirtualNode.instance));
                    }
                    if (Object.keys(environment.asyncRenderIds).length === 0) {
                        if (lifecycle.length > 0) {
                            var listener;
                            while ((listener = lifecycle.shift()) !== undefined) {
                                listener();
                            }
                        }
                        if (lifecycle.mount.length > 0) {
                            var listener$1;
                            while ((listener$1 = lifecycle.mount.shift()) !== undefined) {
                                listener$1();
                            }
                        }
                    }
                    if (environment.infernoQueue && Object.keys(environment.infernoQueue).length !== 0) {
                        startQueue(environment.infernoQueue, environment);
                    }
                }
                else {
                    queueWasabyControlChanges(VirtualNode.instance, true);
                }
            };
            VirtualNode.carrier.then(function (data) {
                VirtualNode.instance.receivedState = data;
                VirtualNode.carrier = undefined;
                VirtualNode.instance.control._forceUpdate('mount');
            }, function (error) {
                console.log("MOUNT error: ", error, VirtualNode.instance.control._moduleName);
            });
        }
    }
    else {
        var isInvisibleNode = VirtualNode.instance.markup && VirtualNode.instance.markup.type !== 'invisible-node';
        if (VirtualNode.instance.control && VirtualNode.instance.control._forceUpdate) {
            VirtualNode.instance.control._forceUpdate = function () {
                queueWasabyControlChanges(VirtualNode.instance, true);
            };
        }
        lifecycle.mount.push(beforeRenderCallback(VirtualNode.instance));
        if (VirtualNode.compound || isInvisibleNode) {
            mount(VirtualNode.instance.markup, parentDOM, {}, isSVG, nextNode, lifecycle, isRootStart, environment, VirtualNode.instance, vNode);
        }
        lifecycle.mount.push(mountWasabyCallback(VirtualNode.instance));
    }
}
function getMarkupForTemplatedNode(vNode) {
    return vNode.parentControl
        ? vNode.template.call(vNode.parentControl, vNode.controlProperties, vNode.attributes, vNode.context, true)
        : vNode.template(vNode.controlProperties, vNode.attributes, vNode.context, true);
}
// @ts-ignore
function createWasabyTemplateNode(vNode, parentDOM, isSVG, nextNode, lifecycle, isRootStart, environment, parentControlNode) {
    vNode.markup = getMarkupForTemplatedNode(vNode);
    // check current context field versions
    vNode.optionsVersions = collectObjectVersions(vNode.controlProperties);
    // check current context field versions
    vNode.contextVersions = collectObjectVersions(vNode.context);
    vNode.markup.forEach(function (node) {
        var nref = node.ref;
        if (vNode.ref) {
            node.ref = function (element) {
                if (nref) {
                    nref(element);
                }
                vNode.ref(element);
            };
        }
        if (node.hprops) {
            var setEventFunction = VdomLib.Hooks.setEventHooks(environment);
            var templateNodeEventRef = setEventFunction(node.type, node.hprops, node.children, node.key, parentControlNode, node.ref);
            node.ref = templateNodeEventRef[4];
        }
    });
    vNode.childFlags = vNode.markup && vNode.markup.length ? vNode.key ? 8 : 4 : 0;
    return vNode;
}
// @ts-ignore
function mountWasabyTemplateNode(vNode, parentDOM, isSVG, nextNode, lifecycle, isRootStart, environment, parentControlNode, parentVNode) {
    var yVNode = createWasabyTemplateNode(vNode, parentDOM, isSVG, nextNode, lifecycle, isRootStart, environment, parentControlNode);
    var lastChild;
    if (vNode.sibling) {
        if (yVNode.markup.length) {
            lastChild = yVNode.markup[yVNode.markup.length - 1];
            lastChild.sibling = vNode.sibling;
        }
        if (vNode.sibling.dom) {
            nextNode = vNode.sibling.dom;
        }
    }
    mountArrayChildren(yVNode.markup, parentDOM, {}, isSVG, nextNode, lifecycle, environment, parentControlNode);
}
function mountFunctionalComponent(vNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    var type = vNode.type;
    var props = vNode.props || EMPTY_OBJ;
    var ref = vNode.ref;
    var input = handleComponentInput(vNode.flags & 32768 /* ForwardRef */ ? type(props, ref, context) : type(props, context));
    vNode.children = input;
    mount(input, parentDOM, context, isSVG, nextNode, lifecycle);
    mountFunctionalComponentCallbacks(props, ref, vNode, lifecycle);
}
function createClassMountCallback(instance) {
    return function () {
        instance.$UPD = true;
        instance.componentDidMount();
        instance.$UPD = false;
    };
}
function mountClassComponentCallbacks(ref, instance, lifecycle) {
    mountRef(ref, instance, lifecycle);
    {
        if (isStringOrNumber(ref)) {
            throwError('string "refs" are not supported in Inferno 1.0. Use callback ref or Inferno.createRef() API instead.');
        }
        else if (!isNullOrUndef(ref) && typeof ref === 'object' && ref.current === void 0) {
            throwError('functional component lifecycle events are not supported on ES2015 class components.');
        }
    }
    if (isFunction(instance.componentDidMount)) {
        lifecycle.push(createClassMountCallback(instance));
    }
}
function createOnMountCallback(ref, vNode, props) {
    return function () {
        ref.onComponentDidMount(findDOMfromVNode(vNode, true), props);
    };
}
function mountFunctionalComponentCallbacks(props, ref, vNode, lifecycle) {
    if (!isNullOrUndef(ref)) {
        if (isFunction(ref.onComponentWillMount)) {
            ref.onComponentWillMount(props);
        }
        if (isFunction(ref.onComponentDidMount)) {
            lifecycle.push(createOnMountCallback(ref, vNode, props));
        }
    }
}

function replaceWithNewNode(lastVNode, nextVNode, parentDOM, context, isSVG, lifecycle, isRootStart, environment, parentControlNode, parentVNode) {
    unmount(lastVNode);
    if ((nextVNode.flags & lastVNode.flags & 2033 /* DOMRef */) !== 0) {
        // If we have controlNode, that starts not at the root HTMLElement and markup of this node is not the same
        // as current dom, we have to remove current dom entirely and insert next markup in DOM
        if (parentDOM.tagName === 'HTML' && nextVNode.type === 'html') {
            mount(nextVNode, parentDOM, context, isSVG, null, lifecycle, true, environment, parentControlNode, nextVNode);
        }
        else if (isRootStart && lastVNode.dom === parentDOM) {
            mount(nextVNode, parentDOM, context, isSVG, null, lifecycle, true, environment, parentControlNode, nextVNode);
            if (parentDOM.parentNode) {
                // @ts-ignore
                removeVNodeDOM(lastVNode, parentDOM.parentNode);
            }
        }
        else {
            // Single DOM operation, when we have dom references available
            mount(nextVNode, null, context, isSVG, null, lifecycle, false, environment, parentControlNode, nextVNode);
        }
        // Single DOM operation, when we have dom references available
        if (parentDOM !== nextVNode.dom) {
            replaceChild(parentDOM, nextVNode.dom, lastVNode.dom);
        }
    }
    else {
        mount(nextVNode, parentDOM, context, isSVG, lastVNode.sibling || null, lifecycle, false, environment, parentControlNode, parentVNode);
        removeVNodeDOM(lastVNode, parentDOM);
    }
}
function patch$1(lastVNode, nextVNode, parentDOM, context, isSVG, nextNode, lifecycle, isRootStart, environment, parentControlNode, parentVNode) {
    var nextFlags = (nextVNode.flags |= 16384 /* InUse */);
    {
        if (isFunction(options.componentComparator) && lastVNode.flags & nextFlags & 4 /* ComponentClass */) {
            if (options.componentComparator(lastVNode, nextVNode) === false) {
                patchClassComponent(lastVNode, nextVNode, parentDOM, context, isSVG, nextNode, lifecycle);
                return;
            }
        }
    }
    // @ts-ignore
    if (lastVNode.flags !== nextFlags || lastVNode.type !== nextVNode.type || lastVNode.key !== nextVNode.key || (nextFlags & 2048 /* ReCreate */) !== 0 || lastVNode.controlClass !== nextVNode.controlClass) {
        if (lastVNode.flags & 16384 /* InUse */) {
            replaceWithNewNode(lastVNode, nextVNode, parentDOM, context, isSVG, lifecycle, isRootStart, environment, parentControlNode, parentVNode);
        }
        else {
            var dom = lastVNode.dom;
            if (!dom && parentDOM) {
                // IT'S BAD CODE!!! TODO: DELETE IT
                var elements = parentDOM.getElementsByTagName(lastVNode.type);
                if (lastVNode.type === 'style') {
                    elements[0].setAttribute('key', lastVNode.key);
                    dom = lastVNode.dom = elements[0];
                }
                for (var k = 0; k < elements.length; k++) {
                    if (elements[k].attributes.key
                        && elements[k].attributes.key.value === lastVNode.key) {
                        dom = lastVNode.dom = elements[k];
                        break;
                    }
                }
                nextVNode.dom = dom;
            }
            // Async nodes will be mounted if from another point. TODO: bad code, have to rewrite.
            if (!environment.asyncRenderIds[parentControlNode.id]) {
                // Last vNode is not in use, it has crashed at application level. Just mount nextVNode and ignore last one
                mount(nextVNode, parentDOM, context, isSVG, nextNode, lifecycle, false, environment, parentControlNode, parentVNode);
            }
        }
    }
    else if (nextFlags & 481 /* Element */) {
        patchElement(lastVNode, nextVNode, context, isSVG, nextFlags, lifecycle, environment, parentControlNode);
    }
    else if (nextFlags & 4 /* ComponentClass */) {
        patchClassComponent(lastVNode, nextVNode, parentDOM, context, isSVG, nextNode, lifecycle);
    }
    else if (nextFlags & 8 /* ComponentFunction */) {
        patchFunctionalComponent(lastVNode, nextVNode, parentDOM, context, isSVG, nextNode, lifecycle);
    }
    else if (nextFlags & 16 /* Text */) {
        patchText(lastVNode, nextVNode, parentDOM);
    }
    else if (nextFlags & 512 /* Void */) {
        nextVNode.dom = lastVNode.dom;
    }
    else if (nextFlags & 8192 /* Fragment */) {
        patchFragment(lastVNode, nextVNode, parentDOM, context, isSVG, lifecycle);
        // @ts-ignore
    }
    else if (nextFlags & 131072 /* WasabyControl */) {
        patchWasabyControl(lastVNode, nextVNode, parentDOM, context, isSVG, lifecycle, environment, parentControlNode, parentVNode);
        // @ts-ignore
    }
    else if (nextFlags & 262144 /* TemplateWasabyNode */) {
        patchWasabyTemplateNode(lastVNode, nextVNode, parentDOM, context, isSVG, lifecycle, nextNode, environment, parentControlNode);
    }
    else if (nextVNode instanceof ExpressionsLib.RawMarkupNode) {
        patchHTML(lastVNode, nextVNode, parentDOM);
    }
    else {
        patchPortal(lastVNode, nextVNode, context, lifecycle);
    }
}
function patchHTML(lastVNode, nextVNode, parentDOM) {
    if (nextVNode instanceof ExpressionsLib.RawMarkupNode) {
        if (lastVNode.markup !== nextVNode.markup) {
            parentDOM.innerHTML = nextVNode.markup;
        }
    }
}
function patchSingleTextChild(lastChildren, nextChildren, parentDOM) {
    if (lastChildren !== nextChildren) {
        if (lastChildren !== '') {
            parentDOM.firstChild.nodeValue = nextChildren;
        }
        else {
            parentDOM.textContent = nextChildren;
        }
    }
}
function patchContentEditableChildren(dom, nextChildren) {
    if (dom.textContent !== nextChildren) {
        dom.textContent = nextChildren;
    }
}
function patchFragment(lastVNode, nextVNode, parentDOM, context, isSVG, lifecycle) {
    var lastChildren = lastVNode.children;
    var nextIsSingle = (nextVNode.childFlags & 2 /* HasVNodeChildren */) !== 0;
    var nextNode = null;
    if (lastVNode.childFlags & 12 /* MultipleChildren */ && (nextIsSingle || (!nextIsSingle && nextVNode.children.length > lastChildren.length))) {
        nextNode = findDOMfromVNode(lastChildren[lastChildren.length - 1], false).nextSibling;
    }
    patchChildren(lastVNode.childFlags, nextVNode.childFlags, lastChildren, nextVNode.children, parentDOM, context, isSVG, nextNode, lastVNode, lifecycle);
}
function patchPortal(lastVNode, nextVNode, context, lifecycle) {
    var lastContainer = lastVNode.ref;
    var nextContainer = nextVNode.ref;
    var nextChildren = nextVNode.children;
    patchChildren(lastVNode.childFlags, nextVNode.childFlags, lastVNode.children, nextChildren, lastContainer, context, false, null, lastVNode, lifecycle);
    nextVNode.dom = lastVNode.dom;
    if (lastContainer !== nextContainer && !isInvalid(nextChildren)) {
        var node = nextChildren.dom;
        removeChild(lastContainer, node);
        appendChild(nextContainer, node);
    }
}
function patchElement(lastVNode, nextVNode, context, isSVG, nextFlags, lifecycle, environment, parentControlNode) {
    var dom = lastVNode.dom;
    var lastProps = lastVNode.props;
    var nextProps = nextVNode.props;
    var isFormElement = false;
    var hasControlledValue = false;
    var nextPropsOrEmpty;
    nextVNode.dom = dom;
    isSVG = isSVG || (nextFlags & 32 /* SvgElement */) > 0;
    // inlined patchProps  -- starts --
    if (nextVNode.hprops && nextVNode.hprops.events && Object.keys(nextVNode.hprops.events).length > 0) {
        var setEventFunction = VdomLib.Hooks.setEventHooks(environment);
        var templateNodeEventRef = setEventFunction(nextVNode.type, nextVNode.hprops, nextVNode.children, nextVNode.key, parentControlNode, nextVNode.ref);
        nextVNode.ref = templateNodeEventRef[4];
    }
    if (lastProps !== nextProps) {
        var lastPropsOrEmpty = lastProps || EMPTY_OBJ;
        nextPropsOrEmpty = nextProps || EMPTY_OBJ;
        if (nextPropsOrEmpty !== EMPTY_OBJ) {
            isFormElement = (nextFlags & 448 /* FormElement */) > 0;
            if (isFormElement) {
                hasControlledValue = isControlledFormElement(nextPropsOrEmpty);
            }
            for (var prop in nextPropsOrEmpty) {
                var lastValue = lastPropsOrEmpty[prop];
                var nextValue = nextPropsOrEmpty[prop];
                if (lastValue !== nextValue) {
                    patchProp(prop, lastValue, nextValue, dom, isSVG, hasControlledValue, lastVNode);
                }
            }
        }
        if (lastPropsOrEmpty !== EMPTY_OBJ) {
            for (var prop$1 in lastPropsOrEmpty) {
                if (isNullOrUndef(nextPropsOrEmpty[prop$1]) && !isNullOrUndef(lastPropsOrEmpty[prop$1])) {
                    patchProp(prop$1, lastPropsOrEmpty[prop$1], null, dom, isSVG, hasControlledValue, lastVNode);
                }
            }
        }
    }
    appendForFocuses(nextVNode, environment);
    var nextChildren = nextVNode.children;
    var nextClassName = nextVNode.className;
    // inlined patchProps  -- ends --
    if (lastVNode.className !== nextClassName) {
        if (isNullOrUndef(nextClassName)) {
            dom.removeAttribute('class');
        }
        else if (isSVG) {
            dom.setAttribute('class', nextClassName);
        }
        else {
            dom.className = nextClassName;
        }
    }
    {
        validateKeys(nextVNode);
    }
    if (nextFlags & 4096 /* ContentEditable */) {
        patchContentEditableChildren(dom, nextChildren);
    }
    else {
        patchChildren(lastVNode.childFlags, nextVNode.childFlags, lastVNode.children, nextChildren, dom, context, isSVG && nextVNode.type !== 'foreignObject', null, lastVNode, lifecycle, environment, parentControlNode, nextVNode);
    }
    if (isFormElement) {
        processElement(nextFlags, nextVNode, dom, nextPropsOrEmpty, false, hasControlledValue);
    }
    var nextRef = nextVNode.ref;
    var lastRef = lastVNode.ref;
    if (lastRef !== nextRef) {
        unmountRef(lastRef);
        mountRef(nextRef, dom, lifecycle);
        appendForFocuses(nextVNode, environment);
    }
}
function replaceOneVNodeWithMultipleVNodes(lastChildren, nextChildren, parentDOM, context, isSVG, lifecycle) {
    unmount(lastChildren);
    mountArrayChildren(nextChildren, parentDOM, context, isSVG, findDOMfromVNode(lastChildren, true), lifecycle);
    removeVNodeDOM(lastChildren, parentDOM);
}
function patchChildren(lastChildFlags, nextChildFlags, lastChildren, nextChildren, parentDOM, context, isSVG, nextNode, parentVNode, lifecycle, environment, parentControlNode, parentVNodeW) {
    switch (lastChildFlags) {
        case 2 /* HasVNodeChildren */:
            switch (nextChildFlags) {
                case 2 /* HasVNodeChildren */:
                    patch$1(lastChildren, nextChildren, parentDOM, context, isSVG, nextNode, lifecycle, false, environment, parentControlNode, parentVNodeW);
                    break;
                case 1 /* HasInvalidChildren */:
                    remove(lastChildren, parentDOM);
                    break;
                case 16 /* HasTextChildren */:
                    unmount(lastChildren);
                    mountTextContent(parentDOM, nextChildren);
                    break;
                default:
                    replaceOneVNodeWithMultipleVNodes(lastChildren, nextChildren, parentDOM, context, isSVG, lifecycle);
                    break;
            }
            break;
        case 1 /* HasInvalidChildren */:
            switch (nextChildFlags) {
                case 2 /* HasVNodeChildren */:
                    mount(nextChildren, parentDOM, context, isSVG, nextNode, lifecycle, environment, parentControlNode, parentVNodeW);
                    break;
                case 1 /* HasInvalidChildren */:
                    break;
                case 16 /* HasTextChildren */:
                    mountTextContent(parentDOM, nextChildren);
                    break;
                default:
                    mountArrayChildren(nextChildren, parentDOM, context, isSVG, nextNode, lifecycle, environment, parentControlNode, parentVNodeW);
                    break;
            }
            break;
        case 16 /* HasTextChildren */:
            switch (nextChildFlags) {
                case 16 /* HasTextChildren */:
                    patchSingleTextChild(lastChildren, nextChildren, parentDOM);
                    break;
                case 2 /* HasVNodeChildren */:
                    clearDOM(parentDOM);
                    mount(nextChildren, parentDOM, context, isSVG, nextNode, lifecycle, environment, parentControlNode, parentVNodeW);
                    break;
                case 1 /* HasInvalidChildren */:
                    clearDOM(parentDOM);
                    break;
                default:
                    clearDOM(parentDOM);
                    mountArrayChildren(nextChildren, parentDOM, context, isSVG, nextNode, lifecycle, environment, parentControlNode, parentVNodeW);
                    break;
            }
            break;
        default:
            switch (nextChildFlags) {
                case 16 /* HasTextChildren */:
                    unmountAllChildren(lastChildren);
                    mountTextContent(parentDOM, nextChildren);
                    break;
                case 2 /* HasVNodeChildren */:
                    removeAllChildren(parentDOM, parentVNode, lastChildren);
                    mount(nextChildren, parentDOM, context, isSVG, nextNode, lifecycle, environment, parentControlNode, parentVNodeW);
                    break;
                case 1 /* HasInvalidChildren */:
                    removeAllChildren(parentDOM, parentVNode, lastChildren);
                    break;
                default:
                    var lastLength = lastChildren.length | 0;
                    var nextLength = nextChildren.length | 0;
                    // Fast path's for both algorithms
                    if (lastLength === 0) {
                        if (nextLength > 0) {
                            mountArrayChildren(nextChildren, parentDOM, context, isSVG, nextNode, lifecycle, environment, parentControlNode, parentVNodeW);
                        }
                    }
                    else if (nextLength === 0) {
                        removeAllChildren(parentDOM, parentVNode, lastChildren);
                    }
                    else if (nextChildFlags === 8 /* HasKeyedChildren */ && lastChildFlags === 8 /* HasKeyedChildren */) {
                        patchKeyedChildren(lastChildren, nextChildren, parentDOM, context, isSVG, lastLength, nextLength, nextNode, parentVNode, lifecycle, environment, parentControlNode, parentVNodeW);
                    }
                    else {
                        patchNonKeyedChildren(lastChildren, nextChildren, parentDOM, context, isSVG, lastLength, nextLength, nextNode, lifecycle, environment, parentControlNode, parentVNodeW);
                    }
                    break;
            }
            break;
    }
}
// @ts-ignore
function patchWasabyTemplateNode(lastVNode, nextVNode, parentDOM, context, isSVG, lifecycle, nN, environment, parentControlNode) {
    var nextNode = nN || null;
    // @ts-ignore
    nextVNode.optionsVersions = collectObjectVersions(nextVNode.controlProperties); // check current context field versions
    // check current context field versions
    nextVNode.contextVersions = collectObjectVersions(nextVNode.context);
    var changedOptions = VdomLib.getChangedOptions(nextVNode.controlProperties, lastVNode.controlProperties, false, lastVNode.optionsVersions);
    var oldAttrs = lastVNode.attributes.attributes;
    var newAttrs = nextVNode.attributes.attributes;
    var changedAttrs = VdomLib.getChangedOptions(newAttrs, oldAttrs, false, {});
    var changedTemplate = lastVNode.template !== nextVNode.template;
    var nextInput;
    nextVNode.childFlags = nextVNode.markup && nextVNode.markup.length ? nextVNode.key ? 8 : 4 : 0;
    if (!nextVNode.hasOwnProperty('sibling')) {
        if (lastVNode.sibling && lastVNode.sibling.dom) {
            var docContains = false;
            // @ts-ignore
            if (Env.detection.isIE) {
                // IE document api does not treat document as any HTML NODE Element, so we have to 
                // take that method call to body
                docContains = document.body.contains(lastVNode.sibling.dom);
            }
            else {
                docContains = document.contains(lastVNode.sibling.dom);
            }
            if (docContains) {
                nextVNode.sibling = lastVNode.sibling;
            }
        }
    }
    if (changedOptions || changedAttrs || changedTemplate) {
        //    Logger.log('DirtyChecking (update template with changed options)', ['', '', changedOptions]);
        nextInput = getMarkupForTemplatedNode(nextVNode);
        nextInput.forEach(function (node) {
            var nref = node.ref;
            if (nextVNode.ref) {
                node.ref = function (element) {
                    nref(element);
                    nextVNode.ref(element);
                };
            }
            if (node.hprops) {
                var setEventFunction = VdomLib.Hooks.setEventHooks(environment);
                var templateNodeEventRef = setEventFunction(node.type, node.hprops, node.children, node.key, parentControlNode, node.ref);
                node.ref = templateNodeEventRef[4];
            }
        });
        lastVNode.childFlags = lastVNode.markup && lastVNode.markup.length ? lastVNode.key ? 8 : 4 : 0;
        nextVNode.childFlags = nextInput && nextInput.length ? nextVNode.key ? 8 : 4 : 0;
        if (nextVNode.sibling) {
            if (nextVNode.sibling.dom) {
                nextNode = nextVNode.sibling.dom;
            }
        }
        patchChildren(lastVNode.childFlags, nextVNode.childFlags, lastVNode.markup, nextInput, parentDOM, {}, isSVG, nextNode || lastVNode.sibling || null, lastVNode, lifecycle, environment, parentControlNode);
        nextVNode.markup = nextInput;
    }
    else {
        nextVNode.markup = lastVNode.markup;
    }
}
function createDidUpdate(instance, lastProps, lastState, snapshot, lifecycle) {
    lifecycle.push(function () {
        instance.componentDidUpdate(lastProps, lastState, snapshot);
    });
}
function updateClassComponent(instance, nextState, nextProps, parentDOM, context, isSVG, force, nextNode, lifecycle) {
    var lastState = instance.state;
    var lastProps = instance.props;
    var usesNewAPI = Boolean(instance.$N);
    var hasSCU = isFunction(instance.shouldComponentUpdate);
    if (usesNewAPI) {
        nextState = createDerivedState(instance, nextProps, nextState !== lastState ? combineFrom(lastState, nextState) : nextState);
    }
    if (force || !hasSCU || (hasSCU && instance.shouldComponentUpdate(nextProps, nextState, context))) {
        if (!usesNewAPI && isFunction(instance.componentWillUpdate)) {
            instance.componentWillUpdate(nextProps, nextState, context);
        }
        instance.props = nextProps;
        instance.state = nextState;
        instance.context = context;
        var snapshot = null;
        var nextInput = renderNewInput(instance, nextProps, context);
        if (usesNewAPI && isFunction(instance.getSnapshotBeforeUpdate)) {
            snapshot = instance.getSnapshotBeforeUpdate(lastProps, lastState);
        }
        patch$1(instance.$LI, nextInput, parentDOM, instance.$CX, isSVG, nextNode, lifecycle);
        // Dont update Last input, until patch has been succesfully executed
        instance.$LI = nextInput;
        if (isFunction(instance.componentDidUpdate)) {
            createDidUpdate(instance, lastProps, lastState, snapshot, lifecycle);
        }
    }
    else {
        instance.props = nextProps;
        instance.state = nextState;
        instance.context = context;
    }
}
function patchClassComponent(lastVNode, nextVNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    var instance = (nextVNode.children = lastVNode.children);
    // If Component has crashed, ignore it to stay functional
    if (isNull(instance)) {
        return;
    }
    instance.$L = lifecycle;
    var nextProps = nextVNode.props || EMPTY_OBJ;
    var nextRef = nextVNode.ref;
    var lastRef = lastVNode.ref;
    var nextState = instance.state;
    instance.$UPD = true;
    if (!instance.$N) {
        if (isFunction(instance.componentWillReceiveProps)) {
            instance.$BR = true;
            instance.componentWillReceiveProps(nextProps, context);
            // If instance component was removed during its own update do nothing.
            if (instance.$UN) {
                return;
            }
            instance.$BR = false;
        }
        if (!isNull(instance.$PS)) {
            nextState = combineFrom(nextState, instance.$PS);
            instance.$PS = null;
        }
    }
    updateClassComponent(instance, nextState, nextProps, parentDOM, context, isSVG, false, nextNode, lifecycle);
    if (lastRef !== nextRef) {
        unmountRef(lastRef);
        mountRef(nextRef, instance, lifecycle);
    }
    instance.$UPD = false;
}
// @ts-ignore
function patchWasabyControl(lastVNode, nextVNode, parentDOM, context, isSVG, lifecycle, environment, parentControlNode, parentVNode) {
    // для не-compound контролов делаем проверку изменения служебных опций
    var changedInternalOptions = VdomLib.getChangedOptions(nextVNode.controlInternalProperties, lastVNode.internalOptions);
    // Атрибуты тоже учавствуют в DirtyChecking
    var changedOptions = VdomLib.getChangedOptions(nextVNode.controlProperties, lastVNode.controlProperties, nextVNode.compound, lastVNode.instance.optionsVersions);
    var changedContext = VdomLib.getChangedOptions(nextVNode.context, lastVNode.instance.context, false, lastVNode.instance.contextVersions);
    var oldOptions = lastVNode.instance.options;
    var oldAttrs = lastVNode.controlAttributes || lastVNode.instance.attributes;
    var changedAttrs = VdomLib.getChangedOptions(nextVNode.controlAttributes, oldAttrs, nextVNode.compound);
    var childControlNode = lastVNode.instance;
    var childControl = childControlNode.control;
    environment = lastVNode.instance.environment;
    // @ts-ignore
    var shouldUpdate = true;
    var oldChildNodeContext = lastVNode.instance.context;
    var newChildNodeContext = nextVNode.context || {};
    // @ts-ignore
    var beforeUpdateResults;
    var newOptions = nextVNode.compound ?
        ViewUtilsLib.Compatible.createCombinedOptions(nextVNode.controlProperties, nextVNode.controlInternalProperties)
        : nextVNode.controlProperties;
    if (lastVNode.carrier) {
        lastVNode.carrier.then(function () {
            // Атрибуты тоже учавствуют в DirtyChecking
            if (changedOptions || changedInternalOptions || changedAttrs || changedContext) {
                if (!nextVNode.compound) {
                    try {
                        var resolvedContext;
                        //  Logger.log('DirtyChecking (update node with changed)', [
                        //      '',
                        //      '',
                        //      changedOptions || changedInternalOptions || changedAttrs || changedContext
                        //  ]);
                        environment.setRebuildIgnoreId(childControlNode.id);
                        ViewUtilsLib.OptionsResolver.resolveInheritOptions(childControlNode.controlClass, childControlNode, newOptions);
                        childControl.saveInheritOptions(childControlNode.inheritOptions);
                        resolvedContext = ExpressionsLib.ContextResolver.resolveContext(childControlNode.controlClass, newChildNodeContext, childControlNode.control);
                        ViewUtilsLib.OptionsResolver.resolveOptions(childControlNode.controlClass, childControlNode.defaultOptions, newOptions, parentControlNode.control._moduleName);
                        // Forbid force update in the time between _beforeUpdate and _afterUpdate
                        // @ts-ignore
                        ReactiveObserver.pauseReactive(childControl, function () {
                            // Forbid force update in the time between _beforeUpdate and _afterUpdate
                            beforeUpdateResults = childControl._beforeUpdate && childControl.__beforeUpdate(newOptions, resolvedContext);
                        });
                        childControl._options = newOptions;
                        shouldUpdate = (childControl._shouldUpdate ? childControl._shouldUpdate(newOptions, resolvedContext) : true) || changedInternalOptions;
                        childControl._setInternalOptions(changedInternalOptions || {});
                        childControlNode.oldOptions = oldOptions; // TODO Для afterUpdate подумать, как еще можно передать
                        // TODO Для afterUpdate подумать, как еще можно передать
                        childControlNode.oldContext = oldChildNodeContext; // TODO Для afterUpdate подумать, как еще можно передать
                        // TODO Для afterUpdate подумать, как еще можно передать
                        childControlNode.attributes = nextVNode.controlAttributes;
                        childControlNode.events = nextVNode.controlEvents;
                        childControl._saveContextObject(resolvedContext);
                        childControl.saveFullContext(ExpressionsLib.ContextResolver.wrapContext(childControl, childControl._context));
                    }
                    finally {
                        /**
                         * TODO: удалить после синхронизации с контролами
                         */
                        var shouldUp = childControl._shouldUpdate ? childControl._shouldUpdate(newOptions, newChildNodeContext) || changedInternalOptions : true;
                        childControl._setInternalOptions(changedInternalOptions || {});
                        if (shouldUp) {
                            environment.setRebuildIgnoreId(null);
                        }
                        childControlNode.options = newOptions;
                        childControlNode.context = newChildNodeContext;
                        if (!nextVNode.compound) {
                            childControlNode.internalOptions = nextVNode.controlInternalProperties;
                        }
                    }
                    childControlNode.control.saveFullContext(ExpressionsLib.ContextResolver.wrapContext(childControlNode.control, childControlNode.context || {}));
                    var nextInput = getDecoratedMarkup(childControlNode, false);
                    nextVNode.instance = childControlNode;
                    nextInput.ref = nextVNode.instance.markup.ref;
                    var setEventFunction = VdomLib.Hooks.setEventHooks(environment);
                    var controlNodeEventRef = setEventFunction(childControlNode.markup.type, {
                        attributes: nextVNode.controlAttributes,
                        events: (childControlNode.markup.hprops && childControlNode.markup.hprops.events) || nextVNode.controlEvents
                    }, childControlNode.markup.children, childControlNode.key, childControlNode, childControlNode.markup.ref);
                    nextVNode.instance.markup.ref = controlNodeEventRef[4];
                    lifecycle.mount.push(beforeRenderCallback(childControlNode));
                    patch$1(lastVNode.instance.markup, nextInput, parentDOM, {}, isSVG, nextInput.dom, lifecycle, false, environment, nextVNode.instance, nextInput);
                    nextVNode.instance.markup = nextInput;
                    lifecycle.mount.push(mountWasabyCallback(childControlNode));
                }
                else {
                    if (changedOptions) {
                        childControl.setProperties(changedOptions);
                        childControlNode.options = childControl._options;
                    }
                    nextVNode.instance = childControlNode;
                }
            }
            else {
                nextVNode.instance = lastVNode.instance;
            }
            if (lastVNode.instance.markup && lastVNode.instance.markup.type === 'invisible-node') {
                if (lastVNode.ref) {
                    parentVNode.ref = lastVNode.ref;
                }
            }
            startQueue(nextVNode.environment.infernoQueue, nextVNode.environment);
        });
    }
    else {
        if (changedOptions || changedInternalOptions || changedAttrs || changedContext) {
            if (!nextVNode.compound) {
                try {
                    var resolvedContext;
                    //  Logger.log('DirtyChecking (update node with changed)', [
                    //      '',
                    //      '',
                    //      changedOptions || changedInternalOptions || changedAttrs || changedContext
                    //  ]);
                    environment.setRebuildIgnoreId(childControlNode.id);
                    ViewUtilsLib.OptionsResolver.resolveInheritOptions(childControlNode.controlClass, childControlNode, newOptions);
                    childControl.saveInheritOptions(childControlNode.inheritOptions);
                    resolvedContext = ExpressionsLib.ContextResolver.resolveContext(childControlNode.controlClass, newChildNodeContext, childControlNode.control);
                    ViewUtilsLib.OptionsResolver.resolveOptions(childControlNode.controlClass, childControlNode.defaultOptions, newOptions, parentControlNode.control._moduleName);
                    // Forbid force update in the time between _beforeUpdate and _afterUpdate
                    // @ts-ignore
                    ReactiveObserver.pauseReactive(childControl, function () {
                        // Forbid force update in the time between _beforeUpdate and _afterUpdate
                        beforeUpdateResults = childControl._beforeUpdate && childControl.__beforeUpdate(newOptions, resolvedContext);
                    });
                    childControl._options = newOptions;
                    shouldUpdate = (childControl._shouldUpdate ? childControl._shouldUpdate(newOptions, resolvedContext) : true) || changedInternalOptions;
                    childControl._setInternalOptions(changedInternalOptions || {});
                    childControlNode.oldOptions = oldOptions; // TODO Для afterUpdate подумать, как еще можно передать
                    // TODO Для afterUpdate подумать, как еще можно передать
                    childControlNode.oldContext = oldChildNodeContext; // TODO Для afterUpdate подумать, как еще можно передать
                    // TODO Для afterUpdate подумать, как еще можно передать
                    childControlNode.attributes = nextVNode.controlAttributes;
                    childControlNode.events = nextVNode.controlEvents;
                    childControl._saveContextObject(resolvedContext);
                    childControl.saveFullContext(ExpressionsLib.ContextResolver.wrapContext(childControl, childControl._context));
                }
                finally {
                    /**
                     * TODO: удалить после синхронизации с контролами
                     */
                    var shouldUp = childControl._shouldUpdate ? childControl._shouldUpdate(newOptions, newChildNodeContext) || changedInternalOptions : true;
                    childControl._setInternalOptions(changedInternalOptions || {});
                    if (shouldUp) {
                        environment.setRebuildIgnoreId(null);
                    }
                    childControlNode.options = newOptions;
                    childControlNode.context = newChildNodeContext;
                    if (!nextVNode.compound) {
                        childControlNode.internalOptions = nextVNode.controlInternalProperties;
                    }
                }
                childControlNode.control.saveFullContext(ExpressionsLib.ContextResolver.wrapContext(childControlNode.control, childControlNode.context || {}));
                var nextInput = getDecoratedMarkup(childControlNode, false);
                nextVNode.instance = childControlNode;
                nextInput.ref = nextVNode.instance.markup.ref;
                var setEventFunction = VdomLib.Hooks.setEventHooks(environment);
                var controlNodeEventRef = setEventFunction(childControlNode.markup.type, {
                    attributes: nextVNode.controlAttributes,
                    events: (childControlNode.markup.hprops && childControlNode.markup.hprops.events) || nextVNode.controlEvents
                }, childControlNode.markup.children, childControlNode.key, childControlNode, childControlNode.markup.ref);
                nextVNode.instance.markup.ref = controlNodeEventRef[4];
                lifecycle.mount.push(beforeRenderCallback(childControlNode));
                patch$1(lastVNode.instance.markup, nextInput, parentDOM, {}, isSVG, nextInput.dom, lifecycle, false, environment, nextVNode.instance, nextInput);
                nextVNode.instance.markup = nextInput;
                lifecycle.mount.push(mountWasabyCallback(childControlNode));
            }
            else {
                if (changedOptions) {
                    childControl.setProperties(changedOptions);
                    childControlNode.options = childControl._options;
                }
                nextVNode.instance = childControlNode;
            }
        }
        else {
            nextVNode.instance = lastVNode.instance;
        }
        if (lastVNode.instance.markup && lastVNode.instance.markup.type === 'invisible-node') {
            if (lastVNode.ref) {
                parentVNode.ref = lastVNode.ref;
            }
        }
    }
}
function patchFunctionalComponent(lastVNode, nextVNode, parentDOM, context, isSVG, nextNode, lifecycle) {
    var shouldUpdate = true;
    var nextProps = nextVNode.props || EMPTY_OBJ;
    var nextRef = nextVNode.ref;
    var lastProps = lastVNode.props;
    var nextHooksDefined = !isNullOrUndef(nextRef);
    var lastInput = lastVNode.children;
    if (nextHooksDefined && isFunction(nextRef.onComponentShouldUpdate)) {
        shouldUpdate = nextRef.onComponentShouldUpdate(lastProps, nextProps);
    }
    if (shouldUpdate !== false) {
        if (nextHooksDefined && isFunction(nextRef.onComponentWillUpdate)) {
            nextRef.onComponentWillUpdate(lastProps, nextProps);
        }
        var nextInput = handleComponentInput(nextVNode.type(nextProps, context));
        patch$1(lastInput, nextInput, parentDOM, context, isSVG, nextNode, lifecycle);
        nextVNode.children = nextInput;
        if (nextHooksDefined && isFunction(nextRef.onComponentDidUpdate)) {
            nextRef.onComponentDidUpdate(lastProps, nextProps);
        }
    }
    else {
        nextVNode.children = lastInput;
    }
}
// @ts-ignore
var ie10or11 = Env.detection.isIE10 || Env.detection.isIE11;
function patchText(lastVNode, nextVNode, parentDOM) {
    var nextText = unescape(nextVNode.children);
    var dom = lastVNode.dom;
    if (nextText !== lastVNode.children && lastVNode.children !== nextVNode.children) {
        // inner text has to be just for IE 10 and for EmptyTextNode
        // EmptyTextNode - implementation of empty string value
        // You can't set nodeValue property in EmptyTextNode
        if (ie10or11) {
            if (dom && dom.parentNode) {
                // @ts-ignore
                var parentChildNodesLength = dom.parentNode.childNodes && dom.parentNode.childNodes.length === 1;
                // We have to use innerText property only in the case when childNodes length of DOMNode are
                // equal to 1, cause if don't do that, we will be in the situation of the whole parentNode
                // childs removed
                // @ts-ignore
                if ((Env.detection.isIE10 || dom.nodeValue === '') && parentChildNodesLength) {
                    // @ts-ignore
                    dom.parentNode.innerText = nextText;
                }
                else {
                    dom.nodeValue = nextText;
                }
            }
            else {
                // @ts-ignore
                parentDOM.innerText = nextText;
            }
        }
        else {
            dom.nodeValue = nextText;
        }
    }
    nextVNode.dom = dom;
}
function patchNonKeyedChildren(lastChildren, nextChildren, dom, context, isSVG, lastChildrenLength, nextChildrenLength, nextNode, lifecycle, 
// @ts-ignore
environment, 
// @ts-ignore
parentControlNode, 
// @ts-ignore
parentVNodeW) {
    var commonLength = lastChildrenLength > nextChildrenLength ? nextChildrenLength : lastChildrenLength;
    var i = 0;
    var nextChild;
    var lastChild;
    for (; i < commonLength; ++i) {
        nextChild = nextChildren[i];
        lastChild = lastChildren[i];
        if (nextChild.flags & 16384 /* InUse */) {
            nextChild = nextChildren[i] = directClone(nextChild);
        }
        patch$1(lastChild, nextChild, dom, context, isSVG, nextNode, lifecycle, false, environment, parentControlNode, parentVNodeW);
        lastChildren[i] = nextChild;
    }
    if (lastChildrenLength < nextChildrenLength) {
        for (i = commonLength; i < nextChildrenLength; ++i) {
            nextChild = nextChildren[i];
            if (nextChild.flags & 16384 /* InUse */) {
                nextChild = nextChildren[i] = directClone(nextChild);
            }
            mount(nextChild, dom, context, isSVG, nextNode, lifecycle, false, environment, parentControlNode, parentVNodeW);
        }
    }
    else if (lastChildrenLength > nextChildrenLength) {
        for (i = commonLength; i < lastChildrenLength; ++i) {
            remove(lastChildren[i], dom);
        }
    }
}
function patchKeyedChildren(a, b, dom, context, isSVG, aLength, bLength, outerEdge, parentVNode, lifecycle, environment, parentControlNode, parentVNodeW) {
    var aEnd = aLength - 1;
    var bEnd = bLength - 1;
    var i = 0;
    var j = 0;
    var aNode = a[j];
    var bNode = b[j];
    var nextPos;
    var nextNode;
    // Step 1
    // tslint:disable-next-line
    outer: {
        // Sync nodes with the same key at the beginning.
        while (aNode.key === bNode.key) {
            if (bNode.flags & 16384 /* InUse */) {
                b[j] = bNode = directClone(bNode);
            }
            // @ts-ignore
            if (bNode.controlClass || bNode.template) {
                // @ts-ignore
                if (!bNode.sibling && b[j + 1]) {
                    // @ts-ignore
                    bNode.sibling = b[j + 1];
                }
            }
            patch$1(aNode, bNode, dom, context, isSVG, outerEdge, lifecycle, false, environment, parentControlNode, parentVNodeW);
            a[j] = bNode;
            ++j;
            if (j > aEnd || j > bEnd) {
                break outer;
            }
            aNode = a[j];
            bNode = b[j];
        }
        aNode = a[aEnd];
        bNode = b[bEnd];
        // Sync nodes with the same key at the end.
        while (aNode.key === bNode.key) {
            if (bNode.flags & 16384 /* InUse */) {
                b[bEnd] = bNode = directClone(bNode);
            }
            // @ts-ignore
            if (bNode.controlClass || bNode.template) {
                // @ts-ignore
                if (!bNode.sibling && b[j - 1]) {
                    // @ts-ignore
                    bNode.sibling = b[j - 1];
                }
            }
            patch$1(aNode, bNode, dom, context, isSVG, outerEdge, lifecycle, false, environment, parentControlNode, parentVNodeW);
            a[aEnd] = bNode;
            aEnd--;
            bEnd--;
            if (j > aEnd || j > bEnd) {
                break outer;
            }
            aNode = a[aEnd];
            bNode = b[bEnd];
        }
    }
    if (j > aEnd) {
        if (j <= bEnd) {
            nextPos = bEnd + 1;
            nextNode = nextPos < bLength ? findDOMfromVNode(b[nextPos], true) : outerEdge;
            while (j <= bEnd) {
                bNode = b[j];
                if (bNode.flags & 16384 /* InUse */) {
                    b[j] = bNode = directClone(bNode);
                }
                ++j;
                mount(bNode, dom, context, isSVG, nextNode, lifecycle, false, environment, parentControlNode, parentVNodeW);
            }
        }
    }
    else if (j > bEnd) {
        while (j <= aEnd) {
            remove(a[j++], dom);
        }
    }
    else {
        var aStart = j;
        var bStart = j;
        var aLeft = aEnd - j + 1;
        var bLeft = bEnd - j + 1;
        var sources = [];
        while (i++ <= bLeft) {
            sources.push(0);
        }
        // Keep track if its possible to remove whole DOM using textContent = '';
        var canRemoveWholeContent = aLeft === aLength;
        var moved = false;
        var pos = 0;
        var patched = 0;
        // When sizes are small, just loop them through
        if (bLength < 4 || (aLeft | bLeft) < 32) {
            for (i = aStart; i <= aEnd; ++i) {
                aNode = a[i];
                if (patched < bLeft) {
                    for (j = bStart; j <= bEnd; j++) {
                        bNode = b[j];
                        if (aNode.key === bNode.key) {
                            sources[j - bStart] = i + 1;
                            if (canRemoveWholeContent) {
                                canRemoveWholeContent = false;
                                while (aStart < i) {
                                    remove(a[aStart++], dom);
                                }
                            }
                            if (pos > j) {
                                moved = true;
                            }
                            else {
                                pos = j;
                            }
                            if (bNode.flags & 16384 /* InUse */) {
                                b[j] = bNode = directClone(bNode);
                            }
                            patch$1(aNode, bNode, dom, context, isSVG, outerEdge, lifecycle, false, environment, parentControlNode, parentVNodeW);
                            ++patched;
                            break;
                        }
                    }
                    if (!canRemoveWholeContent && j > bEnd) {
                        remove(aNode, dom);
                    }
                }
                else if (!canRemoveWholeContent) {
                    remove(aNode, dom);
                }
            }
        }
        else {
            var keyIndex = {};
            // Map keys by their index
            for (i = bStart; i <= bEnd; ++i) {
                keyIndex[b[i].key] = i;
            }
            // Try to patch same keys
            for (i = aStart; i <= aEnd; ++i) {
                aNode = a[i];
                if (patched < bLeft) {
                    j = keyIndex[aNode.key];
                    if (j !== void 0) {
                        if (canRemoveWholeContent) {
                            canRemoveWholeContent = false;
                            while (i > aStart) {
                                remove(a[aStart++], dom);
                            }
                        }
                        bNode = b[j];
                        sources[j - bStart] = i + 1;
                        if (pos > j) {
                            moved = true;
                        }
                        else {
                            pos = j;
                        }
                        if (bNode.flags & 16384 /* InUse */) {
                            b[j] = bNode = directClone(bNode);
                        }
                        patch$1(aNode, bNode, dom, context, isSVG, outerEdge, lifecycle, false, environment, parentControlNode, parentVNodeW);
                        ++patched;
                    }
                    else if (!canRemoveWholeContent) {
                        remove(aNode, dom);
                    }
                }
                else if (!canRemoveWholeContent) {
                    remove(aNode, dom);
                }
            }
        }
        // fast-path: if nothing patched remove all old and add all new
        if (canRemoveWholeContent) {
            removeAllChildren(dom, parentVNode, a);
            mountArrayChildren(b, dom, context, isSVG, outerEdge, lifecycle, environment, parentControlNode, parentVNodeW);
        }
        else if (moved) {
            var seq = lis_algorithm(sources);
            j = seq.length - 1;
            for (i = bLeft - 1; i >= 0; i--) {
                if (sources[i] === 0) {
                    pos = i + bStart;
                    bNode = b[pos];
                    if (bNode.flags & 16384 /* InUse */) {
                        b[pos] = bNode = directClone(bNode);
                    }
                    nextPos = pos + 1;
                    mount(bNode, dom, context, isSVG, nextPos < bLength ? findDOMfromVNode(b[nextPos], true) : outerEdge, lifecycle, false, environment, parentControlNode, parentVNode);
                }
                else if (j < 0 || i !== seq[j]) {
                    pos = i + bStart;
                    bNode = b[pos];
                    nextPos = pos + 1;
                    moveVNodeDOM(bNode, dom, nextPos < bLength ? findDOMfromVNode(b[nextPos], true) : outerEdge);
                }
                else {
                    j--;
                }
            }
        }
        else if (patched !== bLeft) {
            // when patched count doesn't match b length we need to insert those new ones
            // loop backwards so we can use insertBefore
            for (i = bLeft - 1; i >= 0; i--) {
                if (sources[i] === 0) {
                    pos = i + bStart;
                    bNode = b[pos];
                    if (bNode.flags & 16384 /* InUse */) {
                        b[pos] = bNode = directClone(bNode);
                    }
                    nextPos = pos + 1;
                    mount(bNode, dom, context, isSVG, nextPos < bLength ? findDOMfromVNode(b[nextPos], true) : outerEdge, lifecycle, false /* isRootStart */, environment, parentControlNode, parentVNodeW);
                }
            }
        }
    }
}
// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function lis_algorithm(arr) {
    var p = arr.slice();
    var result = [0];
    var i;
    var j;
    var u;
    var v;
    var c;
    var len = arr.length;
    for (i = 0; i < len; ++i) {
        var arrI = arr[i];
        if (arrI !== 0) {
            j = result[result.length - 1];
            if (arr[j] < arrI) {
                p[i] = j;
                result.push(i);
                continue;
            }
            u = 0;
            v = result.length - 1;
            while (u < v) {
                c = ((u + v) / 2) | 0;
                if (arr[result[c]] < arrI) {
                    u = c + 1;
                }
                else {
                    v = c;
                }
            }
            if (arrI < arr[result[u]]) {
                if (u > 0) {
                    p[i] = result[u - 1];
                }
                result[u] = i;
            }
        }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
        result[u] = v;
        v = p[v];
    }
    return result;
}

var hasDocumentAvailable = typeof document !== 'undefined';
{
    if (hasDocumentAvailable && !document.body) {
        warning('Inferno warning: you cannot initialize inferno without "document.body". Wait on "DOMContentLoaded" event, add script to bottom of body, or use async/defer attributes on script tag.');
    }
}
var documentBody = null;
if (hasDocumentAvailable) {
    documentBody = document.body;
    if (typeof Node !== 'undefined') {
        /*
        * Defining $EV and $V properties on Node.prototype
        * fixes v8 "wrong map" de-optimization
        */
        Node.prototype.$EV = null;
        Node.prototype.$V = null;
    }
}
function __render(input, parentDOM, callback, context, isRootStart, environment, parentControlNode) {
    // Development warning
    {
        if (documentBody === parentDOM) {
            throwError('you cannot render() to the "document.body". Use an empty element as a container instead.');
        }
        if (isInvalid(parentDOM)) {
            throwError(("render target ( DOM ) is mandatory, received " + (parentDOM === null ? 'null' : typeof parentDOM)));
        }
    }
    var lifecycle = [];
    // @ts-ignore
    lifecycle.mount = [];
    var rootInput = parentDOM.$V;
    if (isNullOrUndef(rootInput)) {
        if (!isNullOrUndef(input)) {
            if (input.flags & 16384 /* InUse */) {
                input = directClone(input);
            }
            mount(input, parentDOM, context, false, null, lifecycle, isRootStart, environment, parentControlNode);
            parentDOM.$V = input;
            rootInput = input;
        }
    }
    else {
        if (isNullOrUndef(input)) {
            remove(rootInput, parentDOM);
            parentDOM.$V = null;
        }
        else {
            if (input.flags & 16384 /* InUse */) {
                input = directClone(input);
            }
            patch$1(rootInput, input, parentDOM, context, false, null, lifecycle, isRootStart, environment, parentControlNode);
            rootInput = parentDOM.$V = input;
        }
    }
    if (isFunction(callback)) {
        // @ts-ignore
        lifecycle.mount.push(callback);
    }
    if (!environment.asyncRenderIds || Object.keys(environment.asyncRenderIds).length === 0) {
        if (lifecycle.length > 0) {
            callAll(lifecycle);
        }
        // @ts-ignore
        if (lifecycle.mount.length > 0) {
            // @ts-ignore
            callAll(lifecycle.mount);
        }
    }
    if (isFunction(options.renderComplete)) {
        options.renderComplete(rootInput, parentDOM);
    }
}
function render(input, parentDOM, callback, context, isRootStart, environment, parentControlNode) {
    if ( callback === void 0 ) callback = null;
    if ( context === void 0 ) context = EMPTY_OBJ;

    __render(input, parentDOM, callback, context, isRootStart, environment, parentControlNode);
}
function createRenderer(parentDOM) {
    return function renderer(lastInput, nextInput, callback, context) {
        if (!parentDOM) {
            parentDOM = lastInput;
        }
        render(nextInput, parentDOM, callback, context);
    };
}

var nextTick = typeof Promise !== 'undefined' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout.bind(window);
var QUEUE = [];
function queueStateChanges(component, newState, callback, force) {
    if (isFunction(newState)) {
        newState = newState(component.state, component.props, component.context);
    }
    var pending = component.$PS;
    if (isNullOrUndef(pending)) {
        component.$PS = newState;
    }
    else {
        for (var stateKey in newState) {
            pending[stateKey] = newState[stateKey];
        }
    }
    if (!component.$BR) {
        if (!component.$UPD) {
            component.$UPD = true;
            if (QUEUE.length === 0) {
                applyState(component, force, callback);
                return;
            }
        }
        // @ts-ignore
        if (QUEUE.push(component) === 1) {
            nextTick(rerender);
        }
        if (isFunction(callback)) {
            var QU = component.$QU;
            if (!QU) {
                QU = component.$QU = [];
            }
            QU.push(callback);
        }
    }
    else if (isFunction(callback)) {
        component.$L.push(callback.bind(component));
    }
}
function callSetStateCallbacks(component) {
    var queue = component.$QU;
    for (var i = 0, len = queue.length; i < len; ++i) {
        queue[i].call(component);
    }
    component.$QU = null;
}
function rerender() {
    var component;
    while ((component = QUEUE.pop())) {
        var queue = component.$QU;
        applyState(component, false, queue ? callSetStateCallbacks.bind(null, component) : null);
    }
}
function applyState(component, force, callback) {
    if (component.$UN) {
        return;
    }
    if (force || !component.$BR) {
        var pendingState = component.$PS;
        component.$PS = null;
        component.$UPD = true;
        var lifecycle = [];
        updateClassComponent(component, combineFrom(component.state, pendingState), component.props, findDOMfromVNode(component.$LI, true).parentNode, component.context, component.$SVG, force, null, lifecycle);
        component.$UPD = false;
        if (lifecycle.length > 0) {
            callAll(lifecycle);
        }
    }
    else {
        component.state = component.$PS;
        component.$PS = null;
    }
    if (isFunction(callback)) {
        callback.call(component);
    }
}
var Component = function Component(props, context) {
    // Public
    this.state = null;
    // Internal properties
    this.$BR = false; // BLOCK RENDER
    this.$BS = true; // BLOCK STATE
    this.$PS = null; // PENDING STATE (PARTIAL or FULL)
    this.$LI = null; // LAST INPUT
    this.$UN = false; // UNMOUNTED
    this.$CX = null; // CHILDCONTEXT
    this.$UPD = true; // UPDATING
    this.$QU = null; // QUEUE
    this.$N = false; // Uses new lifecycle API Flag
    this.$L = null; // Current lifecycle of this component
    this.$SVG = false; // Flag to keep track if component is inside SVG tree
    /** @type {object} */
    this.props = props || EMPTY_OBJ;
    /** @type {object} */
    this.context = context || EMPTY_OBJ; // context should not be mutable
};
Component.prototype.forceUpdate = function forceUpdate (callback) {
    if (this.$UN) {
        return;
    }
    // Do not allow double render during force update
    queueStateChanges(this, {}, callback, true);
};
Component.prototype.setState = function setState (newState, callback) {
    if (this.$UN) {
        return;
    }
    if (!this.$BS) {
        queueStateChanges(this, newState, callback, false);
    }
    else {
        // Development warning
        {
            throwError('cannot update state via setState() in constructor. Instead, assign to `this.state` directly or define a `state = {};`');
        }
        return;
    }
};
Component.prototype.render = function render (_nextProps, _nextState, _nextContext) {
    return null;
};

{
    /* tslint:disable-next-line:no-empty */
    var testFunc = function testFn() { };
    /* tslint:disable-next-line*/
    // @ts-ignore
    Env.IoC.resolve("ILogger").log("Inferno core", "Inferno is in development mode.");
    if ((testFunc.name || testFunc.toString()).indexOf('testFn') === -1) {
        warning("It looks like you're using a minified copy of the development build " +
            'of Inferno. When deploying Inferno apps to production, make sure to use ' +
            'the production build which skips development warnings and is faster. ' +
            'See http://infernojs.org for more details.');
    }
}
var version = "6.2.1";

exports.Component = Component;
exports.Fragment = Fragment;
exports.EMPTY_OBJ = EMPTY_OBJ;
exports.createComponentVNode = createComponentVNode;
exports.createFragment = createFragment;
exports.createPortal = createPortal;
exports.createRef = createRef;
exports.createRenderer = createRenderer;
exports.createTextVNode = createTextVNode;
exports.createVNode = createVNode;
exports.forwardRef = forwardRef;
exports.directClone = directClone;
exports.findDOMfromVNode = findDOMfromVNode;
exports.getFlagsForElementVnode = getFlagsForElementVnode;
exports.linkEvent = linkEvent;
exports.normalizeProps = normalizeProps;
exports.options = options;
exports.render = render;
exports.rerender = rerender;
exports.version = version;
exports._CI = createClassComponentInstance;
exports._HI = handleComponentInput;
exports._M = mount;
exports._MCCC = mountClassComponentCallbacks;
exports._ME = mountElement;
exports._MFCC = mountFunctionalComponentCallbacks;
exports._MR = mountRef;
exports._MT = mountText;
exports._MP = mountProps;
exports.__render = __render;
exports._PS = patchStyle;
exports._CWCI = createWasabyControlInstance;
exports._MWWC = mountWasabyCallback;
exports._CWTN = createWasabyTemplateNode;
exports._queueWasabyControlChanges = queueWasabyControlChanges;
exports._callAll = callAll;
exports.nextTickWasaby = nextTickWasaby;
exports._SWCNH = setWasabyControlNodeHooks;
exports.beforeRenderCallback = beforeRenderCallback;
exports.appendForFocuses = appendForFocuses;

exports.initInfernoIndex = initInfernoIndex;
return exports;});