import Koa from "koa";
import fetch from "node-fetch";
import cors from "koa-cors";
import Router from "koa-router";
import CompileAllDecks from "./utils/data-managers.ts";

const app = new Koa();
const router = new Router();

app.use(cors());

router.get("/decks", async (ctx) => {
    try {
        const output = await CompileAllDecks();

        ctx.body = output;
    } catch (err: unknown) {
        ctx.status = 500;

        if (err instanceof Error) {
            ctx.body = { error: err.message };
        } else {
            ctx.body = { error: "Unknown error occurred" };
        }

    }
});

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Koa API running on http://localhost:${PORT}`);
})