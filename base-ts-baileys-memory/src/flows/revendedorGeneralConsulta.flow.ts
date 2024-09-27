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
  .addAction(async (ctx, { flowDynamic, blacklist, state }) => {
    config();
    blacklist.add(ctx.from);
    stop(ctx);
    try {
      const myState = state.getMyState();

      const response = await axios.put(
        process.env.URL_WEB + "wsp/listaEspera/" + myState.id,
        {
          status: "1",
          consulta: ctx.body,
          tipo: "Revendedor - General - Consulta",
        }
      );
      await flowDynamic([{
        body: "Ya hemos recibido tu consulta, un agente se pondrá en contacto contigo a la brevedad.",
        delay: 2000
      }]);
      await flowDynamic([{
        body: "Tu posición en la lista de espera es: *" +
        response.data.cantEsperando +
        "*, por favor aguarda a ser atendido. 😁",
        delay: 3000
      }]);
    } catch (error) {
      console.log("Error al cargar consulta Rev Gen: "+error);
    }

  });

const revendedorGeneralConsultaHorariosFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic }) => {
    reset(ctx, flowDynamic, 300000);

    await flowDynamic([{
      body: "Nuestros horarios son: \n\n🕥 Lunes a Viernes de 8hs a 18hs\n🕥 Sábados de 8:30hs a 13hs.",
      delay: 2000
    }]);

    await flowDynamic([{
      body: "IMPORTANTE ⚠️\nCompras de mayoristas y revendedores únicamente podrán ser efectuadas de Lunes a Viernes. Sin excepción.\nTe esperamos en 📍 Urquiza 721, Villa Constitución",
      delay: 2000
    }]);

    await flowDynamic([{
      body: "Otra consulta? 🤔 \n\n1️⃣. Sí\n2️⃣. No",
      delay: 1000
    }]);
  })
  .addAction({ capture: true }, async (ctx, ctxFn) => {
    const bodyText: string = ctx.body.toLowerCase();
    const keywords: string[] = ["1", "2"];
    const containsKeyword = keywords.some((keyword) =>
      bodyText.includes(keyword)
    );

    if (containsKeyword) {
      switch (bodyText) {
        case "1":
          return ctxFn.gotoFlow(revendedorGeneralConsultaFlow);
        case "2":
          return ctxFn.gotoFlow(finalFlow);
      }
    } else {
      return ctxFn.fallBack("Tienes que seleccionar una de las opciones");
    }
  });

const revendedorGeneralConsultaMetodologiaFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic }) => {
    reset(ctx, flowDynamic, 300000);

    await flowDynamic([{
      body:"Nuestra metodología es la siguiente: ",
      delay: 1000
    }]);

    await flowDynamic([{
      body: "🛍️ *Compra inicial* de *$70.000*, para apertura de cuenta\n💰 *Forma de pago*: Efectivo | Transferencia con un 5% de recargo.\n🕥 *Las compras se realizan*: de Lunes a Viernes de 8 hs a 18 hs. (no se atienden revendedores los días sábados).\n📦 *Realizamos envíos*: días y horarios a coordinar.\n\nVALOR DE ENVÍO\n📍Villa Constitucion: compras mayores a $70.000 envío SIN CARGO | compras menores envío $1500\n📍Empalme/Pavón: compras mayores a $80.000 envío SIN CARGO | compras menores envío $2500\n📍San Nicolás/Arroyo: compras mayores a $100.000 envío SIN CARGO | compras menores envío $5000\n📋 Asesoramiento y cotizaciones: de Lunes a Viernes de 8 hs. a 18 hs. en 📍 Urquiza 721, Villa Constitución.",
      delay: 6000
    }]);

    await flowDynamic([{
      body: "Otra consulta? 🤔\n\n1️⃣. Sí\n2️⃣. No",
      delay: 1000
    }]);

  })
  .addAction({ capture: true }, async (ctx, ctxFn) => {
    const bodyText: string = ctx.body.toLowerCase();
      const keywords: string[] = ["1", "2"];
      const containsKeyword = keywords.some((keyword) =>
        bodyText.includes(keyword)
      );

      if (containsKeyword) {
        switch (bodyText) {
          case "1":
            return ctxFn.gotoFlow(revendedorGeneralConsultaFlow);
          case "2":
            return ctxFn.gotoFlow(finalFlow);
        }
      } else {
        return ctxFn.fallBack(
          "Tienes que seleccionar una de las opciones disponibles 😁"
        );
      }
  });

const revendedorGeneralConsultaPreciosFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic }) => {
    reset(ctx, flowDynamic, 300000);

    await flowDynamic([{
      body: "Te comparto el enlace para que accedas a nuestro catálogo exclusivo para revendedores generales! 😉",
      delay:2000
    }])

    await flowDynamic([{
      body: "https://catalogos.cipresdigital.com.ar/catalogo/revendedor/Reventa",
      delay: 1000
    }])

    await flowDynamic([{
      body: "Otra consulta? 🤔\n\n1️⃣. Sí\n2️⃣. No",
      delay: 2000
    }]);
  })
  .addAction({ capture: true }, async (ctx, ctxFn) => {
    const bodyText: string = ctx.body.toLowerCase();
    const keywords: string[] = ["1", "2"];
    const containsKeyword = keywords.some((keyword) =>
      bodyText.includes(keyword)
    );

    if (containsKeyword) {
      switch (bodyText) {
        case "1":
          return ctxFn.gotoFlow(revendedorGeneralConsultaFlow);
        case "2":
          return ctxFn.gotoFlow(finalFlow);
      }
    } else {
      return ctxFn.fallBack("Tienes que seleccionar una de las opciones");
    }
  });

export {
  revendedorGeneralConsultaMetodologiaFlow,
  revendedorGeneralConsultaPreciosFlow,
  revendedorGeneralConsultaHorariosFlow,
  revendedorGeneralConsultaAsesorFlow,
};
