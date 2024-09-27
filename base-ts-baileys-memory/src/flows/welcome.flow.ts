import { addKeyword, EVENTS } from "@builderbot/bot";
import { empresaFlow } from "./empresa.flow";
import { consumidorFinalConsultaFlow} from "./consumidorFinal.flow";
import { start } from "~/utils/idle-custom";
import axios from "axios";
import { config } from "dotenv";
import { revendedorAromatizacionConsultaFlow} from "./revendedorAromatizacion.flow";
import { revendedorGeneralConsultaFlow } from "./revendedorGeneral.flow";
import { waitT } from "~/utils/presenceUpdate";
config();

const welcomeFlow = addKeyword(EVENTS.WELCOME)
.addAction(async (ctx, {provider, state, flowDynamic}) => {
        start(ctx, flowDynamic, 300000)

        await flowDynamic("Hola "+ ctx.name + "!! Estás hablando con CIPRES!")
        await provider.vendor.sendPresenceUpdate('available', ctx.key.remoteJid)
        try {
            const response = await axios.post(
              process.env.URL_WEB + "wsp/listaEspera",
              {
                nombre: ctx.name,
                telefono: ctx.from,
                tipo: "Sin definir",
                status: "0",
              }
            );
            await state.update({id: response.data.id, status: "0"});
   
          } catch (error) {
            console.log(`Error al registrar en lista de espera desde welcomeFlow: ${error}`);
          }
    })
    .addAnswer("Espero estés muy bien! 😀", {delay: 2000})
    .addAnswer("Qué tipo de cliente eres? Por favor responde con el número de la opción! 🙏", {delay:500})
    .addAnswer(['1️⃣. Empresa/Institución/Club',
        '2️⃣. Revendedor Aromatización',
        '3️⃣. Revendedor General',
        '4️⃣. Consumidor Final'], {capture: true}, 
    async (ctx, ctxFn) => {
        const bodyText: string = ctx.body.toLowerCase();
        const keywords: string[] = ["1", "2", "3", "4"];
        const containsKeyword = keywords.some(keyword => bodyText.includes(keyword));
        if (containsKeyword) {

            switch (bodyText) {
                case '1':
                    return ctxFn.gotoFlow(empresaFlow);
                case '2':
                    return ctxFn.gotoFlow(revendedorAromatizacionConsultaFlow);
                case '3':
                    return ctxFn.gotoFlow(revendedorGeneralConsultaFlow);
                case '4':
                    return ctxFn.gotoFlow(consumidorFinalConsultaFlow);
            }
        } else {
            return ctxFn.fallBack("Ups, parece que tu respuesta no está entre mis opciones 😅.\n\n1️⃣. Empresa/Institución/Club\n2️⃣. Revendedor Aromatización\n3️⃣. Revendedor General\n4️⃣. Consumidor Final");
        }
    });


export { welcomeFlow };