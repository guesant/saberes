// @ts-nocheck
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type ContentDatabase = {
    query: (sql: string, params?: unknown[]) => unknown[];
};

type ContentDatabaseLoader = () => Promise<ContentDatabase>;

type ContentState = {
    status: "loading" | "ready" | "error";
    db: ContentDatabase | null;
    error: unknown;
    reload: () => void;
};

const ContentContext = createContext<ContentState | null>(null);

export function ContentProvider({
    children,
    loadDatabase,
}: {
    children: ReactNode;
    loadDatabase: ContentDatabaseLoader;
}) {
    const [attempt, setAttempt] = useState(0);
    const [content, setContent] = useState<Omit<ContentState, "reload">>({
        status: "loading",
        db: null,
        error: null,
    });

    const reload = useCallback(() => setAttempt((current) => current + 1), []);

    useEffect(() => {
        void attempt;
        let active = true;
        setContent({ status: "loading", db: null, error: null });
        loadDatabase()
            .then((db) => {
                if (active) setContent({ status: "ready", db, error: null });
            })
            .catch((error) => {
                if (active) setContent({ status: "error", db: null, error });
            });
        return () => {
            active = false;
        };
    }, [attempt, loadDatabase]);

    const value = useMemo(() => ({ ...content, reload }), [content, reload]);
    return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
    const context = useContext(ContentContext);
    if (!context) throw new Error("useContent deve ser usado dentro de ContentProvider.");
    return context;
}
