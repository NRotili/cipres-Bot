import { addKeyword, EVENTS } from "@builderbot/bot";
import { stop } from "~/utils/idle-custom";
import axios from "axios";
import { config } from "dotenv";
config();

const finalFlow = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { state, flowDynamic }) => {
    stop(ctx);

    const myState = state.getMyState();
    if (myState.status === "0") {
      try {
        const response = await axios.get(
          process.env.URL_WEB + "wsp/finChat/" + myState.id
        );
      } catch (error) {
        console.log(`Error al finalizar Chat: ${error}`);
      }
    }
    await flowDynamic([{
      body: "Espero haberte ayudado. 😁\nCualquier otra cosa que necesites, aquí estaré. 😊",
      delay: 3000,
    }]);
    await flowDynamic([{
      body: "¡Hasta la próxima! 👋",
      delay: 3000,
    }]);
  })
  .addAction(async (ctx, { endFlow }) => {
    return endFlow();
  });


export { finalFlow };
