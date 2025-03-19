import { Hono } from "hono";

const app = new Hono();

app.get("/hi", async (ctx) => {
    return ctx.json({ msg: "hi" });
});

export default app;
