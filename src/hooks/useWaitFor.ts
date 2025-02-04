/**
 * Hook to wait for a condition to be true.
 *
 * @param condition The condition to wait for. This can be a function or string. If it is a function, it will be called every time
 *                  the hook is called. If it is a string, the global object will be checked for the property.
 * @param interval  The interval to check the condition. (default = 50ms)
 * @param timeout   The maximum amount of time to wait for the condition to be true. (default = unlimited)
 * @returns         A boolean indicating if the condition has been met.
 */

import { useCallback, useEffect, useRef, useState } from "react";

type Condition = (() => boolean) | string;
export const useWaitFor = (
    condition: Condition,
    interval = 50,
    timeout?: number
): boolean => {
    // copy the condition to a ref so the effect doesn't depend on it
    // this allows the condition to be changed without triggering the effect
    // this ensures the interval and timeout are stable even if the condition changes
    const memoizedCondition = useRef<Condition>(condition);
    memoizedCondition.current = condition;

    const checkCondition = useCallback(() => {
        if (typeof memoizedCondition.current === "function") {
            if (memoizedCondition.current()) {
                return true;
            }
        }
        if (typeof memoizedCondition.current === "string") {
            if (memoizedCondition.current in window) {
                return true;
            }
        }

        return false;
    }, [memoizedCondition]);

    const [isConditionMet, setIsConditionMet] = useState(checkCondition());

    useEffect(
        () => {
            if (isConditionMet) return;

            let timeoutId: ReturnType<typeof setTimeout> | undefined;
            // TS is dumb and thinks we don't reassign intervalId, but if we set it to `const`, we get an exception
            // eslint-disable-next-line prefer-const
            let intervalId: ReturnType<typeof setInterval> | undefined;
            const cancelInterval = () => {
                if (intervalId) {
                    clearInterval(intervalId);
                }
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
            };

            const doCheckCondition = (): void => {
                if (checkCondition()) {
                    setIsConditionMet(true);
                    cancelInterval();
                }
            };

            if (timeout) {
                timeoutId = setTimeout(cancelInterval, timeout);
            }
            intervalId = setInterval(doCheckCondition, interval);

            // cancel the interval when the component unmounts
            return cancelInterval;
        },
        /* depend on the interval and timeout; assume any changes to them should reset everything */
        [checkCondition, interval, isConditionMet, timeout]
    );

    return isConditionMet;
};
