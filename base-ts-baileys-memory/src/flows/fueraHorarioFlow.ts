import { addKeyword, EVENTS } from "@builderbot/bot";
import axios from "axios";
import { config } from "dotenv";
import { reset } from "~/utils/idle-custom";
import { finalFlow } from "./final.flow";

const mensajeFueraHorarioFlow = addKeyword(EVENTS.ACTION)
  .addAnswer("En estos momentos el local se encuentra cerrado. 😥", {
    delay: 2000,
  })
  .addAnswer(
    "Pero podes dejarnos tu mensaje y cuando volvamos a estar disponible, nos ponemos en contacto! 😉",
    { delay: 3000 }
  )
  .addAction(async (ctx, { flowDynamic, state }) => {
    reset(ctx, flowDynamic, 300000);
    await state.update({ status: "1" });
  })
  .addAnswer("Dejanos tu inquietud en *1 mensaje*. 😁", {
    capture: true,
    delay: 1000,
  })
  .addAction(async (ctx, { flowDynamic, state, gotoFlow }) => {
    config();
    try {
      const myState = state.getMyState();
      const response = await axios.put(
        process.env.URL_WEB + "wsp/listaEspera/" + myState.id,
        {
          tipo: myState.tipo + " - Fuera de horario",
          status: "1",
          consulta: ctx.body,
        }
      );
      await flowDynamic(
        "Tu mensaje ha sido recibido, nos pondremos en contacto pronto!. 😁"
      );


    } catch (error) {
      console.log("Error desde fueraHorarioFlow: "+error);
      await flowDynamic("Estamos teniendo problemas para recibir tu mensaje, intenta más tarde. 😥");
    }
    
    return gotoFlow(finalFlow);

  });

  export { mensajeFueraHorarioFlow };