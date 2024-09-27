import { addKeyword, EVENTS } from "@builderbot/bot";
import axios from "axios";
import { config } from "dotenv";
import { reset } from "~/utils/idle-custom";
import { finalFlow } from "./final.flow";

const mensajeFueraHorarioFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic }) => {
    await flowDynamic([{
      body: "En estos momentos el local se encuentra cerrado. 😥",
      delay: 2000,
    }]);

    await flowDynamic([{
      body: "Pero podes dejarnos tu mensaje y cuando volvamos a estar disponible, nos ponemos en contacto! 😉",
      delay: 3000,
    }]);

    await flowDynamic([{
      body: "Dejanos tu inquietud en *1 mensaje*. 😁",
      delay: 3000,
    }]);
    reset(ctx, flowDynamic, 300000);
  })
  .addAction({capture: true},async (ctx, { flowDynamic, state, gotoFlow }) => {
    await state.update({ status: "1" });
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
      await flowDynamic([{
        body: "Tu mensaje ha sido recibido, nos pondremos en contacto pronto!. 😁",
        delay: 2000
      }]);

    } catch (error) {
      console.log("Error desde fueraHorarioFlow: "+error);
    }
    
    return gotoFlow(finalFlow);

  });

  export { mensajeFueraHorarioFlow };