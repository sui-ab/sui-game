import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { create } from "zustand";
import { MINUTE } from "../config/constants";

interface IGlobalState {
    privyAppId: string;
    wsUrl: string;
    ready: boolean;
    actions: {
        setPrivyAppId: (appId: string) => void;
        setWsUrl: (wsUrl: string) => void;
        initialize: () => void;
    };
}

const useGlobalStore = create<IGlobalState>()((set) => ({
    privyAppId: "",
    wsUrl: "",
    ready: false,

    actions: {
        setPrivyAppId: (appId) => set({ privyAppId: appId }),
        setWsUrl: (wsUrl) => set({ wsUrl }),
        initialize: () => set({ ready: true }),
    },
}));

export const usePrivyAppId = () => useGlobalStore((state) => state.privyAppId);

export const useGlobalStoreActions = () =>
    useGlobalStore((state) => state.actions);

export const useServerConfig = () => {
    const globalStore = useGlobalStore();

    const serverStats = useQuery({
        queryKey: ["server-stats"],
        queryFn: async () => {
            const res = await axios.get<{ privyAppId: string; wsUrl: string }>(
                "/stats",
            );
            return res.data;
        },
        enabled: !globalStore.ready,
        staleTime: 10 * MINUTE,
    });

    useEffect(() => {
        if (serverStats.data) {
            globalStore.actions.setPrivyAppId(serverStats.data.privyAppId);
            globalStore.actions.setWsUrl(serverStats.data.wsUrl);
            globalStore.actions.initialize();
        }
    }, [serverStats.data]);

    return {
        privyAppId: globalStore.privyAppId,
        loading: (serverStats.isLoading || !globalStore.ready ||
            !globalStore.privyAppId),
    };
};
