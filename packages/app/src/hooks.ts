import { useQuery as useTanStackQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useContent } from "./db/ContentContext";

export function useQuery(
    sql: string,
    params: unknown[] = [],
    dependencies: unknown[] = [],
) {
    const { db } = useContent() as unknown as {
        db: { query: (query: string, values: unknown[]) => unknown[] } | null;
    };
    const query = useTanStackQuery({
        queryKey: ["content", sql, params, dependencies],
        enabled: Boolean(db),
        queryFn: () => db?.query(sql, params) || [],
    });

    return {
        loading: query.isPending,
        data: query.data || [],
        error: query.error,
        refetch: query.refetch,
    };
}

export function useAsyncAction<
    T extends (...args: never[]) => Promise<unknown>,
>(action: T) {
    const [state, setState] = useState({
        loading: false,
        error: null as unknown,
    });
    const run = useCallback(
        async (...args: Parameters<T>) => {
            setState({ loading: true, error: null });
            try {
                const value = await action(...args);
                setState({ loading: false, error: null });
                return value;
            } catch (error) {
                setState({ loading: false, error });
                throw error;
            }
        },
        [action],
    );
    return { ...state, run };
}
