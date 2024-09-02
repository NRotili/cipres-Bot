import { addKeyword, EVENTS } from "@builderbot/bot";
import { empresaFlow } from "./empresa.flow";
import { revendedorFlow } from "./revendedor.flow";
import { consumidorFinalFlow } from "./consumidorFinal.flow";
import { start } from "~/utils/idle-custom";

const welcomeFlow = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, ctxFn) => {
        console.log(ctx)
        return ctxFn.flowDynamic("Hola "+ ctx.name + "!! Estás hablando con CIPRES!")
    })
    .addAnswer("Espero estés muy bien! 😀", {delay: 2000})
    .addAnswer("Qué tipo de cliente eres? Por favor responde con el número de la opción! 🙏", {delay:500})
    .addAction(async (ctx, { flowDynamic }) => {
        //Revisar estas acciones
        start(ctx, flowDynamic, 300000)
    })
    .addAnswer(['1️⃣. Empresa',
        '2️⃣. Revendedor',
        '3️⃣. Consumidor Final'], {capture: true}, 
    async (ctx, ctxFn) => {
        const bodyText: string = ctx.body.toLowerCase();
        const keywords: string[] = ['1', 'empresa', '2', 'revendedor', '3', 'consumidor final'];
        const containsKeyword = keywords.some(keyword => bodyText.includes(keyword));
        if (containsKeyword) {

            switch (bodyText) {
                case '1':
                case 'empresa':
                    return ctxFn.gotoFlow(empresaFlow);
                case '2':
                case 'revendedor':
                    return ctxFn.gotoFlow(revendedorFlow);
                case '3':
                case 'consumidor final':
                    return ctxFn.gotoFlow(consumidorFinalFlow);
            }
        } else {
            return ctxFn.fallBack("Ups, parece que tu respuesta no está entre mis opciones 😅");
        }
    });


export { welcomeFlow };