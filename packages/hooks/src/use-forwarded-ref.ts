import type React from "react";
import { useEffect, useImperativeHandle, useRef } from "react";

export function useForwardedRef<T>(ref: React.ForwardedRef<T>) {
  const innerRef = useRef<T>(null);

  useEffect(() => {
    if (!ref) {
      return;
    }

    if (typeof ref === "function") {
      ref(innerRef.current);
    }
  }, [ref]);

  useImperativeHandle(ref, () => innerRef.current as T, []);

  return innerRef;
}
