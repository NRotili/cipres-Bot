import { addKeyword, EVENTS } from "@builderbot/bot";
import { stop } from "~/utils/idle-custom";
import axios from "axios";
import { config } from "dotenv";
config();

const finalFlow = addKeyword(EVENTS.ACTION)
  .addAnswer(
    [
      "Espero haberte ayudado. 😁",
      "Cualquier otra cosa que necesites, aquí estaré. 😊",
    ],
    { delay: 2000 }
  )
  .addAction(async (ctx, { state, endFlow }) => {
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

    return endFlow("Hasta luego! 👋");
  });

export { finalFlow };
