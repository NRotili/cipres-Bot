import { addKeyword, EVENTS } from "@builderbot/bot";
import { revendedorGeneralConsultaFlow } from "./revendedorGeneral.flow";
import { reset, stop } from "~/utils/idle-custom";
import axios from "axios";
import { config } from "dotenv";
import { finalFlow } from "./final.flow";

const revendedorGeneralConsultaAsesorFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic }) => {
    reset(ctx, flowDynamic, 300000);
  })
  .addAnswer(
    "Perfecto, esperamos tu consulta para derivarte con nuestros asesores... 🧐",
    { capture: true, delay: 1000 }
  )
  .addAction(async (ctx, { flowDynamic, blacklist }) => {
    config();
    try {
      const response = await axios.post(
        process.env.URL_WEB + "wsp/listaEspera",
        {
          nombre: ctx.name,
          consulta: ctx.body,
          telefono: ctx.from,
          tipo: "Empresa - Consulta",
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

const revendedorGeneralConsultaHorariosFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic }) => {
    reset(ctx, flowDynamic, 300000);
  })
  .addAnswer(
    ["🕥 Lunes a Viernes de 8hs a 18hs", "🕥 Sábados de 8:30hs a 13hs."],
    { delay: 1000 }
  )
  .addAnswer([
    "IMPORTANTE ⚠️",
    "Compras de mayoristas y revendedores únicamente podrán ser efectuadas de Lunes a Viernes. Sin excepción.",
    "Te esperamos en 📍 Urquiza 721, Villa Constitución",
  ])
  .addAnswer(
    ["Otra consulta? 🤔", "1️⃣. Sí", "2️⃣. No"],
    { delay: 1000, capture: true },
    async (ctx, ctxFn) => {
      const bodyText: string = ctx.body.toLowerCase();
      const keywords: string[] = ["1", "sí", "si", "2", "no"];
      const containsKeyword = keywords.some((keyword) =>
        bodyText.includes(keyword)
      );

      if (containsKeyword) {
        switch (bodyText) {
          case "1":
          case "sí":
            return ctxFn.gotoFlow(revendedorGeneralConsultaFlow);
          case "2":
          case "no":
            return ctxFn.gotoFlow(finalFlow);
        }
      } else {
        return ctxFn.fallBack("Tienes que seleccionar una de las opciones");
      }
    }
  );

const revendedorGeneralConsultaMetodologiaFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic }) => {
    reset(ctx, flowDynamic, 300000);
  })
  .addAnswer(
    [
      "🛍️ Compra inicial de $50.000",
      "🛍️ Mensualmente se deberá respetar ese mínimo de compra.",
      "💰 Forma de pago: Contado/Efectivo.",
      "🕥 Las compras se realizan: de Lunes a Viernes de 8 hs a 18 hs. (no se atienden revendedores/compras mayoristas los días sábados).",
      "📦 Realizamos envíos: consultar condiciones (zonas / valor / fecha de entrega).",
      "📋 Asesoramiento y cotizaciones: de Lunes a Viernes de 8 hs. a 18 hs. en 📍 Urquiza 721, Villa Constitución.",
    ],
    { delay: 1000 }
  )
  .addAnswer(
    ["Otra consulta? 🤔", "1️⃣. Sí", "2️⃣. No"],
    { delay: 1000, capture: true },
    async (ctx, ctxFn) => {
      const bodyText: string = ctx.body.toLowerCase();
      const keywords: string[] = ["1", "sí", "si", "2", "no"];
      const containsKeyword = keywords.some((keyword) =>
        bodyText.includes(keyword)
      );

      if (containsKeyword) {
        switch (bodyText) {
          case "1":
          case "sí":
            return ctxFn.gotoFlow(revendedorGeneralConsultaFlow);
          case "2":
          case "no":
            return ctxFn.gotoFlow(finalFlow);
        }
      } else {
        return ctxFn.fallBack(
          "Tienes que seleccionar una de las opciones disponibles 😁"
        );
      }
    }
  );

const revendedorGeneralConsultaPreciosFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic }) => {
    reset(ctx, flowDynamic, 300000);
  })
  .addAnswer(
    "Te comparto el enlace para que accedas a nuestro catálogo exclusivo para revendedores generales! 😉",
    { delay: 1000 }
  )
  .addAnswer(
    "https://catalogos.cipresdigital.com.ar/catalogo/revendedor/Reventa",
    { delay: 1000 }
  )
  .addAnswer(
    ["Otra consulta?", "1️⃣. Sí", "2️⃣. No"],
    { delay: 1000, capture: true },
    async (ctx, ctxFn) => {
      const bodyText: string = ctx.body.toLowerCase();
      const keywords: string[] = ["1", "sí", "si", "2", "no"];
      const containsKeyword = keywords.some((keyword) =>
        bodyText.includes(keyword)
      );

      if (containsKeyword) {
        switch (bodyText) {
          case "1":
          case "sí":
            return ctxFn.gotoFlow(revendedorGeneralConsultaFlow);
          case "2":
          case "no":
            return ctxFn.gotoFlow(finalFlow);
        }
      } else {
        return ctxFn.fallBack("Tienes que seleccionar una de las opciones");
      }
    }
  );

export {
  revendedorGeneralConsultaMetodologiaFlow,
  revendedorGeneralConsultaPreciosFlow,
  revendedorGeneralConsultaHorariosFlow,
  revendedorGeneralConsultaAsesorFlow,
};
