declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';

  const content: React.FC<SvgProps>;
  export default content;
}

declare module '*.png' {
  const content: number;
  export default content;
}

declare module '@env' {
  export const API_BASE_URL: string;
}

declare module 'lodash.debounce' {
  export type DebounceSettings = {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
  };

  export type DebouncedFunc<T extends (...args: any[]) => unknown> = ((
    ...args: Parameters<T>
  ) => void) & {
    cancel: () => void;
    flush: () => ReturnType<T>;
  };

  export default function debounce<T extends (...args: any[]) => unknown>(
    func: T,
    wait?: number,
    options?: DebounceSettings
  ): DebouncedFunc<T>;
}
