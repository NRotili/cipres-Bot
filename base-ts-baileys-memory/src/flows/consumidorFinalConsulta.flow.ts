import { addKeyword, EVENTS } from "@builderbot/bot";
import { consumidorFinalConsultaFlow } from "./consumidorFinal.flow";
import { reset, stop } from "~/utils/idle-custom";
import { finalFlow } from "./final.flow";
import axios from "axios";
import { config } from "dotenv";
import { waitT } from "~/utils/presenceUpdate";

const consumidorFinalConsultaAsesorFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic }) => {
    reset(ctx, flowDynamic, 300000);
  })
  .addAnswer(
    "Perfecto, esperamos tu consulta para derivarte con nuestros asesores... 🧐",
    { capture: true, delay: 1000 }
  )
  .addAction(async (ctx, { provider, flowDynamic, blacklist, state }) => {
    blacklist.add(ctx.from);
    stop(ctx);
    config();
    try {
      const myState = state.getMyState();
      const response = await axios.put(
        process.env.URL_WEB + "wsp/listaEspera/" + myState.id,
        {
          status: "1",
          consulta: ctx.body,
          tipo: "Consumidor Final - Consulta",
        }
      );

      await flowDynamic([
        {
          body: "Ya hemos recibido tu consulta, un agente se pondrá en contacto contigo a la brevedad.",
          delay: 2000
        },
      ]);
      await flowDynamic([
        {
          body:
            "Tu posición en la lista de espera es: *" +
            response.data.cantEsperando +
            "*, por favor aguarda a ser atendido. 😁",
          delay: 3000,
        },
      ]);
    } catch (error) {
      console.log("Error al cargar consulta desde CF: " + error);
    }
  });

const consumidorFinalConsultaEnviosFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic }) => {
    reset(ctx, flowDynamic, 300000);

    await flowDynamic([
      {
        body:
          "📦 PEDIDOS Y ENVIOS\n🛒 COMPRAS minoristas\n• Servicio de cadetería a cargo del cliente en el instante.\n• O nosotros enviamos tu pedido por un costo adicional de $1.500 solo por la mañana en días específicos de la semana (consultar).\n♻️ DEVOLUCIÓN BIDONES\nPara que no abone doble viaje se adjunta en el ticket de compra el valor del mismo para poder canjearlo cuando desee. El comprobante deberá ser presentado junto con el bidón vacío en perfecto estado para la devolución del dinero.\n🚛 ENVIO GRATIS\nPara compras superiores a $15.000 👉🏽 entregas por la mañana, coordinando un día de la semana.\n📲 REALICE SU PEDIDO Y RETIRE POR NUESTRO LOCAL\nBrindamos también la posibilidad de armarle su pedido para ser retirado sin demoras por nuestro local de 📍Urquiza 721, Villa Constitución de 🕚 Lunes a Viernes de 8 a 18 y Sábados de 8:30 a 13.",
          delay:4000
      },
    ]);
    await flowDynamic([{
        body: "Otra consulta? 🤔\n\n1️⃣. Sí\n2️⃣. No",
        delay: 2000
    }]);
  })
  .addAction({capture:true},async (ctx, ctxFn) => {
    const bodyText: string = ctx.body.toLowerCase();
      const keywords: string[] = ["1", "2"];
      const containsKeyword = keywords.some((keyword) =>
        bodyText.includes(keyword)
      );

      if (containsKeyword) {
        switch (bodyText) {
          case "1":
            return ctxFn.gotoFlow(consumidorFinalConsultaFlow);
          case "2":
            return ctxFn.gotoFlow(finalFlow);
        }
      } else {
        return ctxFn.fallBack(
          "Debes seleccionar una opción válida.\n\n1️⃣. Sí\n2️⃣. No"
        );
      }
  });

const consumidorFinalConsultaPreciosFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { provider, flowDynamic }) => {
    reset(ctx, flowDynamic, 300000);

    await flowDynamic([{
        body: "Te comparto el link para que puedas acceder a nuestro catalogo online exclusivo para clientes! 😉",
        delay: 2000
    }])
    await flowDynamic([{
        body: "https://catalogos.cipresdigital.com.ar/catalogo/consfinal/Consumidor.Final",
        delay: 2000
    }])
    await flowDynamic([{
        body: "Otra consulta? 🤔\n\n1️⃣. Sí\n2️⃣. No",
        delay: 2000
    }]);
  })
  .addAction({capture:true},async (ctx, ctxFn) => {
    const bodyText: string = ctx.body.toLowerCase();
    const keywords: string[] = ["1", "2"];
    const containsKeyword = keywords.some((keyword) =>
      bodyText.includes(keyword)
    );

    if (containsKeyword) {
      switch (bodyText) {
        case "1":
          return ctxFn.gotoFlow(consumidorFinalConsultaFlow);
        case "2":
          return ctxFn.gotoFlow(finalFlow);
      }
    } else {
      return ctxFn.fallBack(
        "Parece que esa opción no es válida. 🤯\n\n 1️⃣. Sí\n 2️⃣. No"
      );
    }
  });


const consumidorFinalConsultaHorariosFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic }) => {
    reset(ctx, flowDynamic, 300000);

    await flowDynamic([{
        body: "🕥 Nuestros horarios de atención son:\n\n🕥 Lunes a Viernes de 8hs a 18hs\n🕥 Sábados de 8:30hs a 13hs.",
        delay: 2000
    }])

    await flowDynamic([{
        body: "IMPORTANTE ⚠️\n\nCompras de mayoristas y revendedores únicamente podrán ser efectuadas de Lunes a Viernes. Sin excepción.\n\nTe esperamos en 📍 Urquiza 721, Villa Constitución",
        delay: 4000
    }])

    await flowDynamic([{
        body: "Otra consulta? 🤔\n\n1️⃣. Sí\n2️⃣. No",
        delay: 2000
    }]);
  })
  .addAction({capture:true},async (ctx, ctxFn) => {
    const bodyText: string = ctx.body.toLowerCase();
    const keywords: string[] = ["1", "2"];
    const containsKeyword = keywords.some((keyword) =>
      bodyText.includes(keyword)
    );

    if (containsKeyword) {
      switch (bodyText) {
        case "1":
          return ctxFn.gotoFlow(consumidorFinalConsultaFlow);
        case "2":
          return ctxFn.gotoFlow(finalFlow);
      }
    } else {
      return ctxFn.fallBack(
        "Tienes que seleccionar una de las opciones.\n\n 1️⃣. Sí\n 2️⃣. No"
      );
    }
  });

export {
  consumidorFinalConsultaHorariosFlow,
  consumidorFinalConsultaPreciosFlow,
  consumidorFinalConsultaEnviosFlow,
  consumidorFinalConsultaAsesorFlow,
};
