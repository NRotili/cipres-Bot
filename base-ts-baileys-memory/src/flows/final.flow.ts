import { addKeyword, EVENTS } from "@builderbot/bot";

const finalFlow = addKeyword(EVENTS.ACTION)
    .addAnswer(["Perfecto, espero haberte ayudado. 😁", "Cualquier otra cosa que necesites, aquí estaré. 😊"], {delay:2000})
    .addAction(async (ctx, ctxFn) => {
        return ctxFn.endFlow("Hasta luego! 👋")
    });

export { finalFlow };
