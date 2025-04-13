import { useEffect, useRef } from "react";

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // 保存最新的回调
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
