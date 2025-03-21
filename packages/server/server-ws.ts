import { Hono } from "hono";
import { logger } from "hono/logger";
import { wsHandler } from "./ws";
import { createBunWebSocket } from "hono/bun";
import type { ServerWebSocket } from "bun";

const { upgradeWebSocket, websocket } = createBunWebSocket<ServerWebSocket>();

import env, { ensureEnv } from "./env";
ensureEnv();

const app = new Hono();

const log = (...data: any[]) => console.log(...data);

app.use(logger(log));
app.use((ctx, next) => {
    ctx.log = log;
    return next();
});

app.get(
    "/ws",
    wsHandler(upgradeWebSocket),
);

export default {
    fetch: app.fetch,
    websocket: websocket,
    port: env.WS_PORT,
};

declare module "hono" {
    interface Context {
        log: (...data: any[]) => void;
    }
}
