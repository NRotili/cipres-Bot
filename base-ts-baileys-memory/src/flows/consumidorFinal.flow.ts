import { addKeyword, EVENTS } from "@builderbot/bot";
import { backFlow } from "./back.flow";
import {
  consumidorFinalConsultaAsesorFlow,
  consumidorFinalConsultaEnviosFlow,
  consumidorFinalConsultaHorariosFlow,
  consumidorFinalConsultaPreciosFlow,
} from "./consumidorFinalConsulta.flow";
import { reset, stop } from "~/utils/idle-custom";
import { mensajeFueraHorarioFlow } from "./fueraHorarioFlow";
import { esHorarioValido } from "~/utils/laboral";
import axios from "axios";
import { config } from "dotenv";

const consumidorFinalConsultaFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic, state }) => {
    await state.update({ tipo: "Consumidor Final" });
    reset(ctx, flowDynamic, 300000);
  })
  .addAnswer("Qué opción te interesa? 🤔", { delay: 1000 })
  .addAnswer(
    ["1️⃣. Precios", 
      "2️⃣. Horarios", 
      "3️⃣. Envíos", 
      "4️⃣. Asesor", 
      "5️⃣. Pedido",
      "9️⃣. Volver"],
    { delay: 1000, capture: true },
    async (ctx, ctxFn) => {
      const bodyText: string = ctx.body.toLowerCase();
      const keywords: string[] = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "9",
      ];
      const containsKeyword = keywords.some((keyword) =>
        bodyText.includes(keyword)
      );

      if (containsKeyword) {
        switch (bodyText) {
          case "1":
            return ctxFn.gotoFlow(consumidorFinalConsultaPreciosFlow);
          case "2":
            return ctxFn.gotoFlow(consumidorFinalConsultaHorariosFlow);
          case "3":
            return ctxFn.gotoFlow(consumidorFinalConsultaEnviosFlow);
          case "4":
            if (esHorarioValido()) {
              return ctxFn.gotoFlow(mensajeFueraHorarioFlow);
            } else {
              return ctxFn.gotoFlow(consumidorFinalConsultaAsesorFlow);
            }
          case "5":
            if (esHorarioValido()) {
              return ctxFn.gotoFlow(mensajeFueraHorarioFlow);
            } else {
              return ctxFn.gotoFlow(consumidorFinalPedidoFlow);
            }
          case "9":
            return ctxFn.gotoFlow(backFlow);
        }
      } else {
        return ctxFn.fallBack("Debes seleccionar una opción válida 🤓");
      }
    }
  );

const consumidorFinalPedidoFlow = addKeyword(EVENTS.ACTION)
  .addAnswer("Te estoy derivando con nuestro personal de atención. 😎", {
    delay: 1000,
  })
  .addAction(async (ctx, { flowDynamic, blacklist, state }) => {
    blacklist.add(ctx.from);
    stop(ctx);
    config();
    try {
      const myState = state.getMyState();
      const response = await axios.put(
        process.env.URL_WEB + "wsp/listaEspera/" + myState.id,
        {
          status: "1",
          consulta: "Pedido",
          tipo: "Consumidor final - Pedido",
        }
      );
      await flowDynamic(
        "Tu posición en la lista de espera es: *" +
        response.data.cantEsperando +
        "*, por favor aguarda a ser atendido. 😁"
      );
    } catch (error) {
      console.log("Error al derivar pedido desde CF: "+error);
    }
    
  })
  .addAnswer("Mientras tanto, anda detallando tu pedido... 📝");

const consumidorFinalFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic }) => {
    reset(ctx, flowDynamic, 300000);
  })
  .addAnswer("Bien, sigamos! 👌", { delay: 1000 })
  .addAnswer(
    ["1️⃣. Consulta", "2️⃣. Pedido", "9️⃣. Volver"],
    { delay: 1000, capture: true },
    async (ctx, ctxFn) => {
      const bodyText: string = ctx.body.toLowerCase();
      const keywords: string[] = [
        "1",
        "2",
        "9",
      ];
      const containsKeyword = keywords.some((keyword) =>
        bodyText.includes(keyword)
      );

      if (containsKeyword) {
        switch (bodyText) {
          case "1":
            return ctxFn.gotoFlow(consumidorFinalConsultaFlow);
          case "2":
            if (esHorarioValido()) {
              return ctxFn.gotoFlow(mensajeFueraHorarioFlow);
            } else {
              return ctxFn.gotoFlow(consumidorFinalPedidoFlow);
            }
          case "9":
            return ctxFn.gotoFlow(backFlow);
        }
      } else {
        return ctxFn.fallBack("Debes seleccionar una opción válida");
      }
    }
  );

export { consumidorFinalFlow, consumidorFinalConsultaFlow, consumidorFinalPedidoFlow };
