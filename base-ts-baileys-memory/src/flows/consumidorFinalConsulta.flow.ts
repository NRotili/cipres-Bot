import { addKeyword, EVENTS } from "@builderbot/bot";
import { consumidorFinalConsultaFlow } from "./consumidorFinal.flow";
import { reset, stop } from "~/utils/idle-custom";
import { finalFlow } from "./final.flow";
import axios from "axios";
import { config } from "dotenv";

const consumidorFinalConsultaAsesorFlow = addKeyword(EVENTS.ACTION)
.addAction(async (ctx, { flowDynamic }) => {
    reset(ctx, flowDynamic, 300000);
  })
  .addAnswer(
    "Perfecto, esperamos tu consulta para derivarte con nuestros asesores... 🧐",
    { capture: true, delay: 1000 }
  )
  .addAction(async (ctx, { flowDynamic, blacklist, state }) => {
    config();
    try {
      const myState = state.getMyState();
      const response = await axios.put(
        process.env.URL_WEB + "wsp/listaEspera/"+ myState.id,
        {
          status: "1",
          consulta: ctx.body,
          tipo: "Consumidor Final - Consulta",
        }
      );
      await flowDynamic(
        "Ya hemos recibido tu consulta, un agente se pondrá en contacto contigo a la brevedad."
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


const consumidorFinalConsultaEnviosFlow = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { flowDynamic }) => {
        reset(ctx, flowDynamic, 300000);
    })
    .addAnswer([
        "📦 PEDIDOS Y ENVIOS ",
        "🛒 COMPRAS minoristas",
        "• Servicio de cadetería a cargo del cliente en el instante.",
        "• O nosotros enviamos tu pedido por un costo adicional de $1.500 solo por la mañana en días específicos de la semana (consultar).",
        "♻️ DEVOLUCIÓN BIDONES",
        "Para que no abone doble viaje se adjunta en el ticket de compra el valor del mismo para poder canjearlo cuando desee. El comprobante deberá ser presentado junto con el bidón vacío en perfecto estado para la devolución del dinero.",
        "🚛 ENVIO GRATIS",
        "Para compras superiores a $15.000 👉🏽 entregas por la mañana, coordinando un día de la semana.",
        "📲 REALICE SU PEDIDO Y RETIRE POR NUESTRO LOCAL",
        "Brindamos también la posibilidad de armarle su pedido para ser retirado sin demoras por nuestro local de 📍Urquiza 721, Villa Constitución de 🕚 Lunes a Viernes de 8 a 18 y Sábados de 8:30 a 13."
    ], {delay: 1000})
    .addAnswer(['Otra consulta? 🤔','1️⃣. Sí', '2️⃣. No'], {delay: 1000, capture: true},
    async (ctx, ctxFn) => {
        const bodyText: string = ctx.body.toLowerCase();
        const keywords: string[] = ['1', 'sí', 'si', '2', 'no'];
        const containsKeyword = keywords.some(keyword => bodyText.includes(keyword));

        if (containsKeyword) {
            switch (bodyText) {
                case '1':
                case 'sí':
                case 'si':
                    return ctxFn.gotoFlow(consumidorFinalConsultaFlow);
                case '2':
                case 'no':
                    return ctxFn.gotoFlow(finalFlow);
            }
        } else {
            return ctxFn.fallBack("Debes seleccionar una opción válida");
        }
    });

const consumidorFinalConsultaPreciosFlow = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { flowDynamic }) => {
        reset(ctx, flowDynamic, 300000);
    })
    .addAnswer("Te comparto el link para que puedas acceder a nuestro catalogo online exclusivo para clientes! 😉", {delay: 1000})
    .addAnswer("https://catalogos.cipresdigital.com.ar/catalogo/consfinal/Consumidor.Final", {delay: 1000})
    .addAnswer(['Otra consulta? 🤔','1️⃣. Sí', '2️⃣. No'], {delay: 1000, capture: true},
    async (ctx, ctxFn) => {
        const bodyText: string = ctx.body.toLowerCase();
        const keywords: string[] = ['1', 'sí', 'si', '2', 'no'];
        const containsKeyword = keywords.some(keyword => bodyText.includes(keyword));

        if (containsKeyword) {
            switch (bodyText) {
                case '1':
                case 'sí':
                case 'si':
                    return ctxFn.gotoFlow(consumidorFinalConsultaFlow);
                case '2':
                case 'no':
                    return ctxFn.gotoFlow(finalFlow);
            }
        } else {
            return ctxFn.fallBack("Parece que esa opción no es válida. 🤯");
        }
    });

const consumidorFinalConsultaHorariosFlow = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { flowDynamic }) => {
        reset(ctx, flowDynamic, 300000);
    })
    .addAnswer(["🕥 Lunes a Viernes de 8hs a 18hs",
        "🕥 Sábados de 8:30hs a 13hs."], {delay: 1000})
    .addAnswer(["IMPORTANTE ⚠️",
        "Compras de mayoristas y revendedores únicamente podrán ser efectuadas de Lunes a Viernes. Sin excepción.", "Te esperamos en 📍 Urquiza 721, Villa Constitución"])
    .addAnswer(['Otra consulta? 🤔','1️⃣. Sí', '2️⃣. No'], {delay: 1000, capture: true},
    async (ctx, ctxFn) => {
        const bodyText: string = ctx.body.toLowerCase();
        const keywords: string[] = ['1', 'sí', 'si', '2', 'no'];
        const containsKeyword = keywords.some(keyword => bodyText.includes(keyword));

        if (containsKeyword) {
            switch (bodyText) {
                case '1':
                case 'sí':
                case 'si':
                    return ctxFn.gotoFlow(consumidorFinalConsultaFlow);
                case '2':
                case 'no':
                    return ctxFn.gotoFlow(finalFlow);
            }
        } else {
            return ctxFn.fallBack("Tienes que seleccionar una de las opciones");
        }
    });



export { consumidorFinalConsultaHorariosFlow, consumidorFinalConsultaPreciosFlow, consumidorFinalConsultaEnviosFlow, consumidorFinalConsultaAsesorFlow };