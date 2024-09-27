import { addKeyword, EVENTS } from "@builderbot/bot";
import { empresaFlow } from "./empresa.flow";
import { revendedorFlow } from "./revendedor.flow";
import { consumidorFinalConsultaFlow, consumidorFinalFlow } from "./consumidorFinal.flow";
import { reset } from "~/utils/idle-custom";
import { revendedorAromatizacionConsultaFlow } from "./revendedorAromatizacion.flow";
import { revendedorGeneralConsultaFlow } from "./revendedorGeneral.flow";

const backFlow = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { flowDynamic }) => {
        reset(ctx, flowDynamic, 300000);
    })
    .addAnswer("Buenísimo, estamos volviendo al menú principal\nQué tipo de cliente eres? 🧐", { delay: 500 })
    .addAnswer([
        '1️⃣. Empresa/Institución/Club', 
        '2️⃣. Revendedor Aromatización',
        '3️⃣. Revendedor General',
        '4️⃣. Consumidor Final'], { capture: true },
        async (ctx, ctxFn) => {
            const bodyText: string = ctx.body.toLowerCase();
            const keywords: string[] = ['1', '2', '3', '4'];
            const containsKeyword = keywords.some(keyword => bodyText.includes(keyword));
            if (containsKeyword) {
                switch (bodyText) {
                    case '1':
                        return ctxFn.gotoFlow(empresaFlow);
                    case '2':
                        return ctxFn.gotoFlow(revendedorAromatizacionConsultaFlow);
                    case '3':
                        return ctxFn.gotoFlow(revendedorGeneralConsultaFlow);
                    case '4':
                        return ctxFn.gotoFlow(consumidorFinalConsultaFlow);
                }
            } else {
                return ctxFn.fallBack("Ups, parece que tu respuesta no está entre mis opciones 😅\n1️⃣. Empresa/Institución/Club\n2️⃣. Revendedor Aromatización\n3️⃣. Revendedor General\n4️⃣. Consumidor Final")
            }
        })

export { backFlow };
