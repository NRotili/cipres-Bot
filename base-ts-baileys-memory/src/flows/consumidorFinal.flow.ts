import { addKeyword, EVENTS } from "@builderbot/bot";
import { backFlow } from "./back.flow";
import {
  consumidorFinalConsultaAsesorFlow,
  consumidorFinalConsultaEnviosFlow,
  consumidorFinalConsultaHorariosFlow,
  consumidorFinalConsultaPreciosFlow,
} from "./consumidorFinalConsulta.flow";
import { reset } from "~/utils/idle-custom";
import { mensajeFueraHorarioFlow } from "./fueraHorarioFlow";
import { esHorarioValido } from "~/utils/laboral";

const consumidorFinalConsultaFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic, state }) => {
    await state.update({ tipo: "Consumidor Final" });
    reset(ctx, flowDynamic, 300000);
  })
  .addAnswer("Qué consulta te interesa? 🤔", { delay: 1000 })
  .addAnswer(
    ["1️⃣. Precios", "2️⃣. Horarios", "3️⃣. Envíos", "4️⃣. Asesor" ,"9️⃣. Volver"],
    { delay: 1000, capture: true },
    async (ctx, ctxFn) => {
      const bodyText: string = ctx.body.toLowerCase();
      const keywords: string[] = [
        "1",
        "precios",
        "2",
        "horarios",
        "3",
        "envíos",
        "4",
        "asesor",
        "9",
        "volver",
      ];
      const containsKeyword = keywords.some((keyword) =>
        bodyText.includes(keyword)
      );

      if (containsKeyword) {
        switch (bodyText) {
          case "1":
          case "precios":
            return ctxFn.gotoFlow(consumidorFinalConsultaPreciosFlow);
          case "2":
          case "horarios":
            return ctxFn.gotoFlow(consumidorFinalConsultaHorariosFlow);
          case "3":
          case "envíos":
            return ctxFn.gotoFlow(consumidorFinalConsultaEnviosFlow);
          case "4":
          case "asesor":
            if (esHorarioValido()) {
              return ctxFn.gotoFlow(mensajeFueraHorarioFlow);
            } else {
              return ctxFn.gotoFlow(consumidorFinalConsultaAsesorFlow);
            }
          case "9":
          case "volver":
            return ctxFn.gotoFlow(backFlow);
        }
      } else {
        return ctxFn.fallBack("Debes seleccionar una opción válida");
      }
    }
  );

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
            return ctxFn.gotoFlow(consumidorFinalConsultaFlow);
          case "2":
          case "pedido":
            await ctxFn.flowDynamic(
              "Mientras un agente se conecta, por favor ingresa tu pedido"
            );
            break;
          case "9":
          case "volver":
            return ctxFn.gotoFlow(backFlow);
        }
      } else {
        return ctxFn.fallBack("Debes seleccionar una opción válida");
      }
    }
  );

export { consumidorFinalFlow, consumidorFinalConsultaFlow };
