/**
 * The following hook is the same as @react-hook/latest
 * https://github.com/jaredLunde/react-hook
 */
import * as React from "react";
import { fireEvent, renderHook } from "@testing-library/react";
import useLatest from "./useLatest";

describe("useLatest()", () => {
    it("should store the latest value", () => {
        const fnA = () => {
            /* no op */
        };
        const fnB = () => {
            /* no op */
        };
        const { result, rerender } = renderHook(({ fn }) => useLatest(fn), {
            initialProps: { fn: fnA },
        });
        expect(result.current.current).toBe(fnA);
        rerender({ fn: fnB });
        expect(result.current.current).toBe(fnB);
    });

    it("should work as expected in useEffect()", () => {
        const fnA = jest.fn();
        const fnB = jest.fn();
        const { rerender } = renderHook(
            ({ fn }) => {
                const latest = useLatest(fn);
                React.useEffect(() => {
                    window.addEventListener("click", () => latest.current());
                }, [latest]);
            },
            {
                initialProps: { fn: fnA },
            },
        );

        fireEvent.click(window);
        expect(fnA).toBeCalledTimes(1);
        rerender({ fn: fnB });
        fireEvent.click(window);
        expect(fnA).toBeCalledTimes(1);
        expect(fnB).toBeCalledTimes(1);
    });
});
