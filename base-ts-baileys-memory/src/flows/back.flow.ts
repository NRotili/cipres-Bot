import { addKeyword, EVENTS } from "@builderbot/bot";
import { empresaFlow } from "./empresa.flow";

const backFlow = addKeyword(EVENTS.ACTION)
    .addAnswer("Buenísimo, estamos volviendo al menú principal", { delay: 500 })
    .addAnswer("Por favor selecciona una opción", { delay: 500 })
    .addAnswer(['1️⃣. Empresa', '2️⃣. Revendedor', '3️⃣. Consumidor Final'], { capture: true },
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
                return ctxFn.fallBack("Ups, parece que tu respuesta no está entre mis opciones 😅")
            };
        });

export { backFlow };
