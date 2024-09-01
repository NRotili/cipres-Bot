import { addKeyword, EVENTS } from "@builderbot/bot";

const audioFlow = addKeyword(EVENTS.VOICE_NOTE)
    .addAction(async (ctx, ctxFn) => {
        console.log(ctx)
        return ctxFn.endFlow("Por el momento no puedo procesar audios. 😥 \nEscribe *HOLA* para que pueda comenzar a ayudarte. 😁")
    });
    

export { audioFlow };