import { addKeyword, EVENTS } from "@builderbot/bot";
import { revendedorFlow } from "./revendedor.flow";
import { revendedorGeneralConsultaAsesorFlow, revendedorGeneralConsultaHorariosFlow, revendedorGeneralConsultaMetodologiaFlow, revendedorGeneralConsultaPreciosFlow } from "./revendedorGeneralConsulta.flow";
import { reset, stop } from "~/utils/idle-custom";
import axios from "axios";
import { config } from "dotenv";

const revendedorGeneralPedidoFlow = addKeyword(EVENTS.ACTION)
.addAnswer(
    "Te estoy derivando con nuestro personal de atención. 😎",
    { delay: 1000 }
  )
  .addAction(async (ctx, { flowDynamic, blacklist, state }) => {
    config();
    try {
        const myState = state.getMyState();
      const response = await axios.put(
        process.env.URL_WEB + "wsp/listaEspera/" + myState.id,
        {
          consulta: "Pedido",
          status: "1",
          tipo: "Revendedor - General - Pedido",
        }
      );
      await flowDynamic(
        "Tu posición en la lista de espera es: *" +
          response.data.cantEsperando +
          "*, por favor aguarda a ser atendido. 😁"
      );
    } catch (error) {
      console.log(error);
    }
    stop(ctx);
    blacklist.add(ctx.from);
  })
  .addAnswer("Mientras tanto, anda detallando tu pedido... 📝");

const revendedorGeneralConsultaFlow = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { flowDynamic }) => {
        reset(ctx, flowDynamic, 300000);
    })
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
                    return ctxFn.gotoFlow(revendedorGeneralConsultaMetodologiaFlow);
                case '2':
                case 'precios':
                    return ctxFn.gotoFlow(revendedorGeneralConsultaPreciosFlow);
                case '3':
                case 'horarios':
                    return ctxFn.gotoFlow(revendedorGeneralConsultaHorariosFlow);
                case '4':
                case 'asesor':
                    return ctxFn.gotoFlow(revendedorGeneralConsultaAsesorFlow);
                case '9':
                case 'volver':
                    return ctxFn.gotoFlow(revendedorFlow);
            }
        } else {
            return ctxFn.fallBack("Esa opción no es válida. 🤯");
        }
    });


const revendedorGeneralFlow = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { flowDynamic }) => {
        reset(ctx, flowDynamic, 300000);
    })
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
                    return ctxFn.gotoFlow(revendedorGeneralConsultaFlow);
                case '2':
                case 'pedido':
                    return ctxFn.gotoFlow(revendedorGeneralPedidoFlow);
                case '9':
                case 'volver':
                    return ctxFn.gotoFlow(revendedorFlow);
            }
        } else {
            return ctxFn.fallBack("Debes seleccionar una opción válida para poder continuar. 😅");
        }
    });

export { revendedorGeneralFlow, revendedorGeneralConsultaFlow, revendedorGeneralPedidoFlow };