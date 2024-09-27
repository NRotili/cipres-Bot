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
import { formatWithOptions } from "util";

const revendedorAromatizacionConsultaFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic, state }) => {
    await state.update({ tipo: "Revendedor - Aromatización" });
    reset(ctx, flowDynamic, 300000);

    await flowDynamic([{
      body: "Ok! Selecciona la opción...",
      delay: 500
    }]);

    await flowDynamic([{
      body: "1️⃣. Metodología\n2️⃣. Precios\n3️⃣. Horarios\n4️⃣. Asesor\n5️⃣. Pedido\n9️⃣. Volver",
      delay: 3000
    }]);
  })
  .addAction({ capture: true }, async (ctx, ctxFn) => {
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
        return ctxFn.fallBack("Debes seleccionar una opción válida.\n\n1️⃣. Metodología\n2️⃣. Precios\n3️⃣. Horarios\n4️⃣. Asesor\n5️⃣. Pedido\n9️⃣. Volver");
      }
  });

const revendedorAromatizacionPedidoRecibidoFlow = addKeyword(EVENTS.DOCUMENT)
  .addAction(async (ctx, { flowDynamic, state }) => {
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
        delay: 3000
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
  .addAction(async (ctx, { blacklist, flowDynamic }) => {
    stop(ctx);
    blacklist.add(ctx.from);

    await flowDynamic([{
      body: "Te vamos a enviar un excel para que lo completes con tus datos y el pedido. 💪🏽\n\nPor favor, envíanos el archivo completado y sin modificar el formato para procesar tu pedido. 🙏",
      delay:3000,
      media: "https://catalogos.cipresdigital.com.ar/doc/PEDIDOS%20%20(NO%20cambiar%20el%20formato%20EXCEL).xls"
    }]);

    await flowDynamic([{
      body: "Una vez que lo tengas listo, envialo por acá así te derivamos con nuestro personal. 😉",
      delay: 2000
    }]);
  })
  .addAction({capture:true},async (ctx, ctxFn) => {
    return ctxFn.gotoFlow(revendedorAromatizacionPedidoRecibidoFlow);
  });

export {
  revendedorAromatizacionConsultaFlow,
  revendedorAromatizacionPedidoRecibidoFlow,
  revendedorAromatizacionPedidoFlow,
};
