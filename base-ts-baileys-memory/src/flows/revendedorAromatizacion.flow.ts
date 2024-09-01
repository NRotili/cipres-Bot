import { addKeyword, EVENTS } from "@builderbot/bot";
import { revendedorFlow } from "./revendedor.flow";
import { revendedorAromatizacionConsultaHorariosFlow, revendedorAromatizacionConsultaMetodologiaFlow, revendedorAromatizacionConsultaPreciosFlow } from "./revendedorAromatizacionConsulta.flow";



const revendedorAromatizacionConsultaFlow = addKeyword(EVENTS.ACTION)
    .addAnswer("Ok! Selecciona la opción...", {delay: 1000})
    .addAnswer(['1️⃣. Metodología',
        '2️⃣. Precios',
        '3️⃣. Horarios',
        '4️⃣. Asesor',
        '9️⃣. Volver'], {delay: 1000, capture: true},
    async (ctx, ctxFn) => {
        const bodyText: string = ctx.body.toLowerCase();
        const keywords: string[] = ['1', 'metodología', '2', 'precios', '3', 'horarios', '4', 'asesor', '9', 'volver'];
        const containsKeyword = keywords.some(keyword => bodyText.includes(keyword));

        if (containsKeyword) {
            switch (bodyText) {
                case '1':
                case 'metodología':
                    return ctxFn.gotoFlow(revendedorAromatizacionConsultaMetodologiaFlow);
                case '2':
                case 'precios':
                    return ctxFn.gotoFlow(revendedorAromatizacionConsultaPreciosFlow);
                case '3':
                case 'horarios':
                    return ctxFn.gotoFlow(revendedorAromatizacionConsultaHorariosFlow);
                case '4':
                case 'asesor':
                    await ctxFn.flowDynamic("El asesor es...");
                    break;
                case '9':
                case 'volver':
                    return ctxFn.gotoFlow(revendedorFlow);
            }
        } else {
            return ctxFn.fallBack("Debes seleccionar una opción válida");
        }
    });


const revendedorAromatizacionFlow = addKeyword(EVENTS.ACTION)
    .addAnswer("Bien, qué deseas?", {delay: 1000})
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
                    return ctxFn.gotoFlow(revendedorAromatizacionConsultaFlow);
                case '2':
                case 'pedido':
                    await ctxFn.flowDynamic("Para realizar un pedido, por favor comunícate con tu asesor de ventas.");
                    break;
                case '9':
                case 'volver':
                    return ctxFn.gotoFlow(revendedorFlow);
            }
        } else {
            return ctxFn.fallBack("Debes seleccionar una opción válida");
        }
    });

export { revendedorAromatizacionFlow, revendedorAromatizacionConsultaFlow };