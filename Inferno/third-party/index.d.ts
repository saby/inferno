import { InfernoNode, InfernoText, TRenderer, VNode, VNodeFlags } from "../Types";

export declare function createVNode(
  flags: VNode['flags'],
  type: VNode['type'],
  className: VNode['className'],
  children: VNode['children'],
  childFlags: VNode['childFlags'],
  props: VNode['props'],
  key: VNode['key'],
  ref: VNode['ref']
): VNode;
export declare function createTextVNode(
  text: InfernoText,
  key: VNode['key']
): VNode;
export declare function getFlagsForElementVnode(
  type: VNode['type']
): VNodeFlags;
export declare function patch(
  lastVNode: VNode,
  nextVNode: VNode,
  parentDOM: Element,
  context: Object,
  isSVG: boolean,
  nextNode: Element | null,
  lifecycle: Function[],
  isRootStart?: boolean
): void;
export declare function render(
  input: VNode | null | InfernoNode | undefined,
  parentDOM: Element | SVGAElement | ShadowRoot | DocumentFragment | HTMLElement | Node | null,
  callback?: Function | null,
  context?: Object,
  isRootStart?: boolean
): void;
export declare function createRenderer(
  parentDOM?: Element | null
): TRenderer;
export declare function remove(
  vNode: VNode,
  parentDOM: Element | null
): void;
