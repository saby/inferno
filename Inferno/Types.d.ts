export const enum VNodeFlags {
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
export const enum ChildFlags {
  UnknownChildren = 0,
  HasInvalidChildren = 1,
  HasVNodeChildren = 1 << 1,
  HasNonKeyedChildren = 1 << 2,
  HasKeyedChildren = 1 << 3,
  HasTextChildren = 1 << 4,
  MultipleChildren = HasNonKeyedChildren | HasKeyedChildren
}
export declare type TKey = string | number | undefined | null;
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
export declare type TRenderer = (lastInput: VNode, nextInput: VNode, callback: Function, context: Object) => void;
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
  noNeedUnescape: boolean;
}
