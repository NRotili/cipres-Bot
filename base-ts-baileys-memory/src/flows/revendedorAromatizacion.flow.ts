import { addKeyword, EVENTS } from "@builderbot/bot";
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
import { backFlow } from "./back.flow";

const revendedorAromatizacionConsultaFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic, state }) => {
    await state.update({ tipo: "Revendedor - Aromatización" });
    reset(ctx, flowDynamic, 300000);
  })
  .addAnswer("Ok! Selecciona la opción...", { delay: 1000 })
  .addAnswer(
    [
      "1️⃣. Metodología",
      "2️⃣. Precios",
      "3️⃣. Horarios",
      "4️⃣. Asesor",
      "5️⃣. Pedido",
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
        "5",
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
          case "5":
            if (esHorarioValido()) {
              return ctxFn.gotoFlow(mensajeFueraHorarioFlow);
            } else {
              return ctxFn.gotoFlow(revendedorAromatizacionPedidoFlow);
            }
          case "9":
            return ctxFn.gotoFlow(backFlow);
        }
      } else {
        return ctxFn.fallBack("Debes seleccionar una opción válida.\n1️⃣. Metodología\n2️⃣. Precios\n3️⃣. Horarios\n4️⃣. Asesor\n5️⃣. Pedido\n9️⃣. Volver");
      }
    }
  );

const revendedorAromatizacionPedidoRecibidoFlow = addKeyword(EVENTS.DOCUMENT)
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

      await flowDynamic([{
        body: "Gracias por tu pedido! 🤗 \nTe estoy derivando con nuestro personal de atención. 😎",
        delay: 2000
      }]);
      await flowDynamic([{
        body: "Tu posición en la lista de espera es: *" + response.data.cantEsperando + "*, por favor aguarda a ser atendido. 😁",
        delay: 3000
      }]);

    } catch (error) {
      console.log("Error al recibir pedido desde Rev Ar: "+error);
    }

  });

const revendedorAromatizacionPedidoFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { blacklist }) => {
    stop(ctx);
    blacklist.add(ctx.from);
  })
  .addAnswer(
    "Te vamos a enviar un excel para que lo completes con tus datos y el pedido. 💪🏽\nPor favor, envíanos el archivo completado y sin modificar el formato para procesar tu pedido. 🙏",
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

export {
  revendedorAromatizacionConsultaFlow,
  revendedorAromatizacionPedidoRecibidoFlow,
  revendedorAromatizacionPedidoFlow,
};
