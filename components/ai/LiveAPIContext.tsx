"use client";

import { createContext, FC, ReactNode, useContext } from "react";
import { useLiveAPI, UseLiveAPIResults } from "@/hooks/useLiveAPI";
import { LiveClientOptions } from "@/types/live-api";

const LiveAPIContext = createContext<UseLiveAPIResults | undefined>(undefined);

export type LiveAPIProviderProps = {
    children: ReactNode;
    apiKey: string;
};

export const LiveAPIProvider: FC<LiveAPIProviderProps> = ({
    apiKey,
    children,
}) => {
    const liveAPI = useLiveAPI({ apiKey });

    return (
        <LiveAPIContext.Provider value={liveAPI}>
            {children}
        </LiveAPIContext.Provider>
    );
};

export const useLiveAPIContext = () => {
    const context = useContext(LiveAPIContext);
    if (!context) {
        throw new Error("useLiveAPIContext must be used within a LiveAPIProvider");
    }
    return context;
};
