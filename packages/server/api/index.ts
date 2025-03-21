import { Hono } from "hono";
import { cors } from "hono/cors";
import dummy from "./routes/dummy";
import env from "../env";

const app = new Hono();

app.use(
    cors({
        origin: (origin, ctx) => {
            const selfUrl = new URL(ctx.req.url);
            const selfOrigin = selfUrl.origin;
            if (!origin || origin === selfOrigin) {
                return origin;
            }
            return "";
        },
        credentials: true,
        allowMethods: ["POST", "GET", "PATCH", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
    }),
);

app.route("dummy", dummy);

let servedSessions = 0;
app.get("/stats", async (ctx) => {
    servedSessions++;
    const privyAppId = env.PRIVY_APP_ID;
    const wsPort = env.WS_PORT;
    const selfUrl = new URL(ctx.req.url);

    return ctx.json({
        servedSessions,
        privyAppId,
        wsUrl: selfUrl.protocol + "//" + selfUrl.hostname + ":" + wsPort,
    });
});

export default app;
