import { addKeyword, EVENTS } from "@builderbot/bot";
import { backFlow } from "./back.flow";
import { revendedorAromatizacionFlow } from "./revendedorAromatizacion.flow";
import { revendedorGeneralFlow } from "./revendedorGeneral.flow";


const revendedorFlow = addKeyword(EVENTS.ACTION)
    .addAnswer("Qué tipo de revendedor sos? 🤔", {delay: 1000})
    .addAnswer(['1️⃣. Aromatización',
        '2️⃣. General',
        '9️⃣. Volver'], {delay: 1000, capture: true}, 
    async (ctx, ctxFn) => {
        const bodyText: string = ctx.body.toLowerCase();
        const keywords: string[] = ['1', 'aromatización', '2', 'general', '9', 'volver'];
        const containsKeyword = keywords.some(keyword => bodyText.includes(keyword));

        if (containsKeyword) {
            switch (bodyText) {
                case '1':
                case 'aromatización':
                    return ctxFn.gotoFlow(revendedorAromatizacionFlow);
                case '2':
                case 'general':
                    return ctxFn.gotoFlow(revendedorGeneralFlow);
                case '9':
                case 'volver':
                    return ctxFn.gotoFlow(backFlow);
            }
        } else {
            return ctxFn.fallBack("Debes seleccionar una opción válida");
        }
    });

export { revendedorFlow};