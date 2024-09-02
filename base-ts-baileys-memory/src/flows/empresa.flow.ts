import { addKeyword, EVENTS } from "@builderbot/bot";
import { backFlow } from "./back.flow";
import { reset } from "~/utils/idle-custom";
import { config } from "dotenv";
config()


const empresaConsultaFlow = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { gotoFlow, blacklist }) => {
        //Revisar estas acciones
        // start(ctx, gotoFlow, 10000)
        // blacklist.add(ctx.from)
    })
    .addAnswer("Perfecto, esperamos tu consulta para derivarte con nuestros asesores...", {capture: true, delay: 1000})


const empresaFlow = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { flowDynamic }) => {
        reset(ctx, flowDynamic, 300000);
    })
    .addAnswer("Perfecto, qué deseas realizar?", {delay: 1000})
    .addAnswer(['1️⃣. Consulta',
        '2️⃣. Pedido',
        '9️⃣. Volver'], {delay: 1000, capture: true}, 
    async (ctx, ctxFn) => {
        const bodyText: string = ctx.body.toLowerCase();
        const keywords: string[] = ['1', 'consulta', '2', 'pedido', '9', 'volver'];
        const containsKeyword = keywords.some(keyword => bodyText.includes(keyword));

        if (containsKeyword) {
            switch (bodyText) {
                case '1':
                case 'consulta':
                    return ctxFn.gotoFlow(empresaConsultaFlow);
                case '2':
                case 'pedido':
                    await ctxFn.flowDynamic("Mientras un agente se conecta, por favor ingresa tu pedido");
                    break;
                case '9':
                case 'volver':
                    return ctxFn.gotoFlow(backFlow);
            }
        } else {

            return ctxFn.fallBack("Debes seleccionar una opción válida");
        }
    });

export { empresaFlow, empresaConsultaFlow };