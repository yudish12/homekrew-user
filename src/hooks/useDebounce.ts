import { useState, useEffect, useCallback, useRef } from "react";

/**
 * A custom hook for debouncing a value
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

/**
 * A custom hook for debouncing a function
 * @param fn The function to debounce
 * @param delay The delay in milliseconds
 * @returns The debounced function
 */
export function useDebounceFunction<T extends (...args: any[]) => any>(
    fn: T,
    delay: number = 500,
): (...args: Parameters<T>) => void {
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    const debouncedFn = useCallback(
        (...args: Parameters<T>) => {
            if (timer) {
                clearTimeout(timer);
            }

            const newTimer = setTimeout(() => {
                fn(...args);
            }, delay);

            setTimer(newTimer);
        },
        [fn, delay, timer],
    );

    // Clean up the timer when the component unmounts or fn/delay changes
    useEffect(() => {
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [timer]);

    return debouncedFn;
}

/**
 * A custom hook for throttling a function
 * @param fn The function to throttle
 * @param delay The delay in milliseconds
 * @returns The throttled function
 */
export function useThrottle<T extends (...args: any[]) => any>(
    fn: T,
    delay: number = 500,
): (...args: Parameters<T>) => void {
    const lastCallTime = useRef<number>(0);

    const throttledFn = useCallback(
        (...args: Parameters<T>) => {
            const now = Date.now();
            if (now - lastCallTime.current < delay) {
                return; // Ignore the call if within throttle period
            }
            lastCallTime.current = now;
            fn(...args);
        },
        [fn, delay],
    );

    return throttledFn;
}
