// import { forwardRef } from 'react';

export type UnwrapArray<T> = T extends Array<infer U> ? U : T;

// Reference: https://www.totaltypescript.com/concepts/the-prettify-helper
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

// Reference: https://www.totaltypescript.com/forwardref-with-generic-components
// function fixedForwardRef<T, P = {}>(
//   render: (props: P, ref: React.Ref<T>) => React.ReactNode
// ): (props: P & React.RefAttributes<T>) => React.ReactNode {
//   return React.forwardRef(render) as any;
// }
