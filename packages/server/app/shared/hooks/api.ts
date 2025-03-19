import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MINUTE } from "../config/constants";
import { usePrivy } from "@privy-io/react-auth";

const api = {
    useDummyCoins: () =>
        useQuery({
            queryKey: ["dummy", "coins"],
            queryFn: async () => {
                const res = await axios.get<{
                    coins: {
                        name: string;
                        ticker: string;
                        address: string;
                        imageUrl: string;
                        description: string;
                    }[];
                }>("/dummy/coins");
                return res.data.coins;
            },
            staleTime: 10 * MINUTE,
        }),

    useRelayNonce: () => {
        const privy = usePrivy();
        return useQuery({
            queryKey: ["relay-nonce", privy.user.id],
            queryFn: async () => {
                const res = await axios.get<{
                    nonce: string;
                }>("/access/evm-nonce");
                return res.data.nonce;
            },
        });
    },

    useNewToken: () => {
        return useMutation({
            mutationFn: async (args: { req: string; description: string }) => {
                const res = await axios.post<{
                    address: string;
                    imageUploadPresignedUrl: string;
                }>("/tokens/new", {
                    req: args.req,
                    description: args.description,
                });
                return res.data;
            },
        });
    },

    useFrxUsdPermit: () => {
        return useMutation({
            mutationFn: async (req: string) => {
                const res = await axios.post("/access/frxusd-permit", { req });
                return res.data;
            },
        });
    },
};

export default api;
