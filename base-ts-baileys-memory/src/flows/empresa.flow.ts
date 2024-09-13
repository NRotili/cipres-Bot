import { addKeyword, EVENTS } from "@builderbot/bot";
import { backFlow } from "./back.flow";
import { reset, stop } from "~/utils/idle-custom";
import axios from "axios";
import { config } from "dotenv";
config();

const empresaConsultaFlow = addKeyword(EVENTS.ACTION)
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
        process.env.URL_WEB + "wsp/listaEspera/" + myState.id,
        {
          tipo: "Empresa - Consulta",
          status: "1",
          consulta: ctx.body,
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

const empresaPedidoFlow = addKeyword(EVENTS.ACTION)
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
          status: "1",
          consulta: "Pedido",
          tipo: "Empresa - Pedido",
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

const empresaFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic }) => {
    reset(ctx, flowDynamic, 300000);
  })
  .addAnswer("Perfecto, qué deseas realizar?", { delay: 1000 })
  .addAnswer(
    ["1️⃣. Consulta", "2️⃣. Pedido", "9️⃣. Volver"],
    { delay: 1000, capture: true },
    async (ctx, ctxFn) => {
      const bodyText: string = ctx.body.toLowerCase();
      const keywords: string[] = [
        "1",
        "consulta",
        "2",
        "pedido",
        "9",
        "volver",
      ];
      const containsKeyword = keywords.some((keyword) =>
        bodyText.includes(keyword)
      );

      if (containsKeyword) {
        switch (bodyText) {
          case "1":
          case "consulta":
            return ctxFn.gotoFlow(empresaConsultaFlow);
          case "2":
          case "pedido":
            return ctxFn.gotoFlow(empresaPedidoFlow);
          case "9":
          case "volver":
            return ctxFn.gotoFlow(backFlow);
        }
      } else {
        return ctxFn.fallBack("Debes seleccionar una opción válida");
      }
    }
  );

export { empresaFlow, empresaConsultaFlow, empresaPedidoFlow };
