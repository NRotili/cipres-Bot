import { addKeyword, EVENTS } from "@builderbot/bot";
import { revendedorAromatizacionConsultaFlow } from "./revendedorAromatizacion.flow";
import { reset, stop } from "~/utils/idle-custom";
import axios from "axios";
import { config } from "dotenv";
import { finalFlow } from "./final.flow";

const revendedorAromatizacionConsultaHorariosFlow = addKeyword(EVENTS.ACTION)
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
      const keywords: string[] = ["1", "2"];
      const containsKeyword = keywords.some((keyword) =>
        bodyText.includes(keyword)
      );
      if (containsKeyword) {
        switch (bodyText) {
          case "1":
            return ctxFn.gotoFlow(revendedorAromatizacionConsultaFlow);
          case "2":
            return ctxFn.gotoFlow(finalFlow);
        }
      } else {
        return ctxFn.fallBack(
          "Tienes que seleccionar una de las opciones disponibles 😁.\n1️⃣. Sí\n2️⃣. No"
        );
      }
    }
  );

const revendedorAromatizacionConsultaMetodologiaFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic }) => {
    reset(ctx, flowDynamic, 300000);
  })
  .addAction(async (ctx, { flowDynamic }) => {
    await flowDynamic([{
      body: "Somos Distribuidores Oficiales de Saphirus🥇\nForma parte de nuestro staff de revendedores y emprende tu propio negocio 🙌🏽",
      delay: 2000
    }]);

    await flowDynamic([{
      body: "🛍️ *Compra mínima* de *$50.000* para apertura de cuenta.\n💰 *Forma de pago*: Efectivo | Transferencia con un 5% de recargo.\n🕥 *Las compras se realizan*: de Lunes a viernes de 8 hs a 18 hs. (no se atienden revendedores los días sábados).\n📋 Se debe *solicitar Planilla para Pedidos* solo para envíos fuera de la ciudad de Villa Constitución.\n🛒 *Armado del pedido*: entre 48/72 hs.\n🚛 *Envío*: a cargo del cliente (comisionista/cadete).\n🧑🏽‍💻 *Asesoramiento y cotizaciones*: de Lunes a Viernes de 8 hs. a 18 hs. en 📍 Urquiza 721, Villa Constitución.",
      delay: 6000
    }]);
  })
  .addAnswer(
    ["Otra consulta? 🤔", "1️⃣. Sí", "2️⃣. No"],
    { delay: 1000, capture: true },
    async (ctx, ctxFn) => {
      const bodyText: string = ctx.body.toLowerCase();
      const keywords: string[] = ["1","2"];
      const containsKeyword = keywords.some((keyword) =>
        bodyText.includes(keyword)
      );

      if (containsKeyword) {
        switch (bodyText) {
          case "1":
            return ctxFn.gotoFlow(revendedorAromatizacionConsultaFlow);
          case "2":
            return ctxFn.gotoFlow(finalFlow);
        }
      } else {
        return ctxFn.fallBack(
          "Tienes que seleccionar una de las opciones disponibles 😁.\n1️⃣. Sí\n2️⃣. No"
        );
      }
    }
  );

const revendedorAromatizacionConsultaPreciosFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic }) => {
    reset(ctx, flowDynamic, 300000);
  })
  .addAnswer(
    "Podes visitar en nuestro sitio web el catálogo exclusivo para revendedores! 😉",
    { delay: 1000 }
  )
  .addAnswer(
    "https://catalogos.cipresdigital.com.ar/catalogo/revendedor/AROMATIZACION",
    { delay: 1000 }
  )
  .addAnswer(
    ["Otra consulta?", "1️⃣. Sí", "2️⃣. No"],
    { delay: 1000, capture: true },
    async (ctx, ctxFn) => {
      const bodyText: string = ctx.body.toLowerCase();
      const keywords: string[] = ["1", "2"];
      const containsKeyword = keywords.some((keyword) =>
        bodyText.includes(keyword)
      );

      if (containsKeyword) {
        switch (bodyText) {
          case "1":
            return ctxFn.gotoFlow(revendedorAromatizacionConsultaFlow);
          case "2":
            return ctxFn.gotoFlow(finalFlow);
        }
      } else {
        return ctxFn.fallBack("Tienes que seleccionar una de las opciones. \n1️⃣. Sí\n2️⃣. No");
      }
    }
  );

const revendedorAromatizacionConsultaAsesorFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic }) => {
    reset(ctx, flowDynamic, 300000);
  })
  .addAnswer(
    "Perfecto, esperamos tu consulta para derivarte con nuestros asesores... 🧐",
    { capture: true, delay: 1000 }
  )
  .addAction(async (ctx, { flowDynamic, blacklist, state }) => {
    config();
    blacklist.add(ctx.from);
    stop(ctx);
    try {
      const myState = state.getMyState();
      const response = await axios.put(
        process.env.URL_WEB + "wsp/listaEspera/"+ myState.id,
        {
          status: "1",
          consulta: ctx.body,
          tipo: "Revendedor - Aromatización - Consulta",
        }
      );
      await flowDynamic([{
        body: "Ya hemos recibido tu consulta, un agente se pondrá en contacto contigo a la brevedad.",
        delay: 2000
      }]);
      await flowDynamic([{
        body: "Tu posición en la lista de espera es: *" + response.data.cantEsperando + "*, por favor aguarda a ser atendido. 😁",
        delay: 3000
      }]);

    } catch (error) {
      console.log("Error al cargar consulta desde Rev Ar: "+error);
    }
   
  });

export {
  revendedorAromatizacionConsultaMetodologiaFlow,
  revendedorAromatizacionConsultaPreciosFlow,
  revendedorAromatizacionConsultaHorariosFlow,
  revendedorAromatizacionConsultaAsesorFlow,
};
