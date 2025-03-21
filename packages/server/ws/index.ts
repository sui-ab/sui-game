import { createBunWebSocket } from "hono/bun";

export function wsHandler(
    upgradeWebSocket: ReturnType<typeof createBunWebSocket>["upgradeWebSocket"],
) {
    return upgradeWebSocket((ctx) => {
        return {
            onMessage(event, ws) {
                try {
                    const message = JSON.parse(event.data.toString());
                    ctx.log("Message received", message);
                } catch {
                    ctx.text("Invalid message received", 400);
                }
            },
            onClose: () => {
                ctx.log("Connection closed");
            },
        };
    });
}
