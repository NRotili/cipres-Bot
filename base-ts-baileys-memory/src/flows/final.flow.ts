import { addKeyword, EVENTS } from "@builderbot/bot";
import { stop } from "~/utils/idle-custom";

const finalFlow = addKeyword(EVENTS.ACTION)
    .addAnswer(["Perfecto, espero haberte ayudado. 😁", "Cualquier otra cosa que necesites, aquí estaré. 😊"], {delay:2000})
    .addAction(async (ctx, ctxFn) => {
        stop(ctx);
        return ctxFn.endFlow("Hasta luego! 👋");
    });

export { finalFlow };
