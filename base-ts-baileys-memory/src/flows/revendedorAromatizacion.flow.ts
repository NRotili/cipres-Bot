import { addKeyword, EVENTS } from "@builderbot/bot";
import { revendedorFlow } from "./revendedor.flow";
import {
  revendedorAromatizacionConsultaAsesorFlow,
  revendedorAromatizacionConsultaHorariosFlow,
  revendedorAromatizacionConsultaMetodologiaFlow,
  revendedorAromatizacionConsultaPreciosFlow,
} from "./revendedorAromatizacionConsulta.flow";
import { reset, stop } from "~/utils/idle-custom";
import axios from "axios";
import { config } from "dotenv";
import { esHorarioValido } from "~/utils/laboral";
import { mensajeFueraHorarioFlow } from "./fueraHorarioFlow";

const revendedorAromatizacionConsultaFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic, state }) => {
    await state.update({tipo: "Revendedor - Aromatización"});
    reset(ctx, flowDynamic, 300000);
  })
  .addAnswer("Ok! Selecciona la opción...", { delay: 1000 })
  .addAnswer(
    [
      "1️⃣. Metodología",
      "2️⃣. Precios",
      "3️⃣. Horarios",
      "4️⃣. Asesor",
      "9️⃣. Volver",
    ],
    { delay: 1000, capture: true },
    async (ctx, ctxFn) => {
      const bodyText: string = ctx.body.toLowerCase();
      const keywords: string[] = [
        "1",
        "2",
        "3",
        "4",
        "9",
      ];
      const containsKeyword = keywords.some((keyword) =>
        bodyText.includes(keyword)
      );

      if (containsKeyword) {
        switch (bodyText) {
          case "1":
            return ctxFn.gotoFlow(
              revendedorAromatizacionConsultaMetodologiaFlow
            );
          case "2":
            return ctxFn.gotoFlow(revendedorAromatizacionConsultaPreciosFlow);
          case "3":
            return ctxFn.gotoFlow(revendedorAromatizacionConsultaHorariosFlow);
          case "4":
            if (esHorarioValido()) {
              return ctxFn.gotoFlow(mensajeFueraHorarioFlow);
            } else {
              return ctxFn.gotoFlow(revendedorAromatizacionConsultaAsesorFlow);
            }
          case "9":
            return ctxFn.gotoFlow(revendedorFlow);
        }
      } else {
        return ctxFn.fallBack("Debes seleccionar una opción válida");
      }
    }
  );

const revendedorAromatizacionPedidoRecibidoFlow = addKeyword(EVENTS.DOCUMENT)
  .addAnswer("¡Gracias por tu pedido! 🤗", { delay: 1000 })
  .addAnswer("Te estoy derivando con nuestro personal de atención. 😎", {
    delay: 1000,
  })
  .addAction(async (ctx, { flowDynamic, blacklist, state }) => {
    config();
    try {
      const myState = state.getMyState();
      const response = await axios.put(
        process.env.URL_WEB + "wsp/listaEspera/" + myState.id,
        {
          status: "1",
          consulta: ctx.body,
          tipo: "Revendedor - Aromatización - Pedido",
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
  });

const revendedorAromatizacionPedidoFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic }) => {
    stop(ctx);
  })
  .addAnswer(
    "Te vamos a enviar un excel para que lo completes con tus datos y el pedido. 💪🏽",
    {
      delay: 1000,
    }
  )
  .addAnswer(
    "Por favor, envíanos el archivo completado y sin modificar el formato para procesar tu pedido. 🙏",
    {
      delay: 1000,
      media:
        "https://catalogos.cipresdigital.com.ar/doc/PEDIDOS%20%20(NO%20cambiar%20el%20formato%20EXCEL).xls",
    }
  )
  .addAnswer(
    "Quedamos a la espera del archivo para derivarte con nuestro personal. 😊",
    {
      delay: 2000,
      capture: true,
    }
  )
  .addAction(async (ctx, ctxFn) => {
    return ctxFn.gotoFlow(revendedorAromatizacionPedidoRecibidoFlow);
  });

const revendedorAromatizacionFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic }) => {
    reset(ctx, flowDynamic, 300000);
  })
  .addAnswer("Bien, qué deseas?", { delay: 1000 })
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
            return ctxFn.gotoFlow(revendedorAromatizacionConsultaFlow);
          case "2":
            return ctxFn.gotoFlow(revendedorAromatizacionPedidoFlow);
          case "9":
            return ctxFn.gotoFlow(revendedorFlow);
        }
      } else {
        return ctxFn.fallBack("Debes seleccionar una opción válida");
      }
    }
  );

export {
  revendedorAromatizacionFlow,
  revendedorAromatizacionConsultaFlow,
  revendedorAromatizacionPedidoRecibidoFlow,
  revendedorAromatizacionPedidoFlow,
};
