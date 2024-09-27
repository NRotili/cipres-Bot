import { createBot, createProvider, createFlow } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { welcomeFlow } from './flows/welcome.flow'
import { empresaConsultaFlow, empresaFlow, empresaPedidoFlow } from './flows/empresa.flow'
import { backFlow } from './flows/back.flow'
import { revendedorAromatizacionConsultaFlow,  revendedorAromatizacionPedidoFlow, revendedorAromatizacionPedidoRecibidoFlow } from './flows/revendedorAromatizacion.flow'
import { revendedorAromatizacionConsultaAsesorFlow, revendedorAromatizacionConsultaHorariosFlow, revendedorAromatizacionConsultaMetodologiaFlow, revendedorAromatizacionConsultaPreciosFlow } from './flows/revendedorAromatizacionConsulta.flow'
import { idleFlow, stop } from './utils/idle-custom'
import { revendedorGeneralConsultaFlow, revendedorGeneralPedidoFlow } from './flows/revendedorGeneral.flow'
import { revendedorGeneralConsultaAsesorFlow, revendedorGeneralConsultaHorariosFlow, revendedorGeneralConsultaMetodologiaFlow, revendedorGeneralConsultaPreciosFlow } from './flows/revendedorGeneralConsulta.flow'
import { consumidorFinalConsultaFlow, consumidorFinalPedidoFlow } from './flows/consumidorFinal.flow'
import { consumidorFinalConsultaAsesorFlow, consumidorFinalConsultaEnviosFlow, consumidorFinalConsultaHorariosFlow, consumidorFinalConsultaPreciosFlow } from './flows/consumidorFinalConsulta.flow'
import { audioFlow } from './flows/audio.flow'
import { config } from 'dotenv'
import { finalFlow } from './flows/final.flow'
import { mensajeFueraHorarioFlow } from './flows/fueraHorarioFlow'
import { BotContext } from '@builderbot/bot/dist/types';

config()

const PORT = process.env.PORT ?? 3008

// const mainFlow = addKeyword<Provider, Database>(EVENTS.WELCOME)
//     .addAction(async (ctx, ctxFn) => {
//         const bodyText: string = ctx.body.toLowerCase();

//         const keywords: string[] = ['hola', 'buenos días', 'buenas tardes', 'buenas noches'];
//         const containsKeyword = keywords.some(keyword => bodyText.includes(keyword));
//         if (containsKeyword) {
//             return ctxFn.gotoFlow(welcomeFlow)
//         }

//     })

const main = async () => {
    const adapterFlow = createFlow([
        audioFlow,
        finalFlow,
        welcomeFlow, 
        empresaFlow,
        empresaConsultaFlow, 
        empresaPedidoFlow,
        revendedorAromatizacionPedidoFlow,
        revendedorAromatizacionPedidoRecibidoFlow,
        revendedorAromatizacionConsultaFlow,
        revendedorAromatizacionConsultaAsesorFlow,
        revendedorAromatizacionConsultaMetodologiaFlow,
        revendedorAromatizacionConsultaPreciosFlow,
        revendedorAromatizacionConsultaHorariosFlow,
        revendedorGeneralPedidoFlow,
        revendedorGeneralConsultaAsesorFlow, revendedorGeneralConsultaFlow, revendedorGeneralConsultaHorariosFlow, revendedorGeneralConsultaMetodologiaFlow, revendedorGeneralConsultaPreciosFlow, consumidorFinalConsultaFlow, consumidorFinalConsultaHorariosFlow, consumidorFinalConsultaPreciosFlow, consumidorFinalConsultaEnviosFlow, consumidorFinalConsultaAsesorFlow,
        backFlow, idleFlow, mensajeFueraHorarioFlow,consumidorFinalPedidoFlow])
    
    const adapterProvider = createProvider(Provider)
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') {
                //create new object BotContext
                bot.blacklist.add(number)
                const ctx: BotContext = { from: number, body: 'blacklist' }
                stop(ctx);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    httpServer(+PORT)
}

main()
