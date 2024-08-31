import { addKeyword, EVENTS } from "@builderbot/bot";
import { empresaFlow } from "./empresa.flow";

const welcomeFlow = addKeyword(EVENTS.WELCOME)
    .addAnswer("Hola!! Estás hablando con CIPRES! 🤖", {delay: 2000})
    .addAnswer("Espero estés muy bien! 😀", {delay: 2000})
    .addAnswer("Qué tipo de cliente eres? Por favor responde con el número de la opción! 🙏", {delay:500})
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
            }
        } else {
            return ctxFn.fallBack("Ups, parece que tu respuesta no está entre mis opciones 😅");
        }
    });


export { welcomeFlow };