declare module "Inferno/third-party/hydrate" {
  import { VNode } from "Inferno/third-party/index";
  export function hydrate(
    input: VNode,
    parentDOM: Element,
    callback?: Function,
    isRootStart?: boolean
  ): void;
}

declare module "Inferno/third-party/index" {
  export enum VNodeFlags {
    HtmlElement = 1,
    ComponentUnknown = 1 << 1,
    ComponentClass = 1 << 2,
    ComponentFunction = 1 << 3,
    Text = 1 << 4,
    SvgElement = 1 << 5,
    InputElement = 1 << 6,
    TextareaElement = 1 << 7,
    SelectElement = 1 << 8,
    Void = 1 << 9,
    Portal = 1 << 10,
    ReCreate = 1 << 11,
    ContentEditable = 1 << 12,
    Fragment = 1 << 13,
    InUse = 1 << 14,
    ForwardRef = 1 << 15,
    Normalized = 1 << 16,
    ForwardRefComponent = ForwardRef | ComponentFunction,
    FormElement = InputElement | TextareaElement | SelectElement,
    Element = HtmlElement | SvgElement | FormElement,
    Component = ComponentFunction | ComponentClass | ComponentUnknown,
    DOMRef = Element | Text | Void | Portal,
    InUseOrNormalized = InUse | Normalized,
    ClearInUseNormalized = ~InUseOrNormalized
  }
  export enum ChildFlags {
    UnknownChildren = 0,
    HasInvalidChildren = 1,
    HasVNodeChildren = 1 << 1,
    HasNonKeyedChildren = 1 << 2,
    HasKeyedChildren = 1 << 3,
    HasTextChildren = 1 << 4,
    MultipleChildren = HasNonKeyedChildren | HasKeyedChildren
  }
  export type TKey = string | number | undefined | null;
  export interface WasabyProperties {
    attributes: {
      [property: string]: string;
    };
    hooks: {
      [property: string]: unknown;
    };
    events: {
      [property: string]: unknown;
    };
  }
  export type InfernoText = string | number;
  export type InfernoNode = InfernoText | boolean | null;
  export type TRenderer = (lastInput: VNode, nextInput: VNode, callback: Function, context: Object) => void;
  export interface VNode {
    isValidated?: boolean;
    childFlags: ChildFlags;
    children: InfernoNode | VNode[];
    className: string | null | undefined;
    flags: VNodeFlags;
    key: TKey;
    type: string;
    ref: TRenderer;
    markup: unknown;
    dom: Element | null;
    props: WasabyProperties['attributes'];
    hprops: WasabyProperties;
  }
  export function createVNode(
    flags: VNode['flags'],
    type: VNode['type'],
    className: VNode['className'],
    children: VNode['children'],
    childFlags: VNode['childFlags'],
    props: VNode['props'],
    key: VNode['key'],
    ref: VNode['ref']
  ): VNode;
  export function createTextVNode(
    text: InfernoText,
    key: VNode['key']
  ): VNode;
  export function getFlagsForElementVnode(
    type: VNode['type']
  ): VNodeFlags;
  export function patch(
    lastVNode: VNode,
    nextVNode: VNode,
    parentDOM: Element,
    context: Object,
    isSVG: boolean,
    nextNode: Element | null,
    lifecycle: Function[],
    isRootStart?: boolean
  ): void;
  export function render(
    input: VNode | null | InfernoNode | undefined,
    parentDOM: Element | SVGAElement | ShadowRoot | DocumentFragment | HTMLElement | Node | null,
    callback?: Function | null,
    context?: Object,
    isRootStart?: boolean
  ): void;
  export function createRenderer(
    parentDOM?: Element | null
  ): TRenderer;
  export function remove(
    vNode: VNode,
    parentDOM: Element | null
  ): void;
}
