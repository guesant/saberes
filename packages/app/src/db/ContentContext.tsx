// @ts-nocheck -- migração incremental do provider legado de conteúdo.
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadContentDatabase } from "@guesant/saberes-adapter-data-v1";

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
    const [content, setContent] = useState({
        status: "loading",
        db: null,
        error: null,
    });

    useEffect(() => {
        loadContentDatabase()
            .then((db) => setContent({ status: "ready", db, error: null }))
            .catch((error) => setContent({ status: "error", db: null, error }));
    }, []);

    const value = useMemo(() => content, [content]);
    return (
        <ContentContext.Provider value={value}>
            {children}
        </ContentContext.Provider>
    );
}

export function useContent() {
    return useContext(ContentContext);
}
