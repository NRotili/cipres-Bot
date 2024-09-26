import { EVENTS, addKeyword } from '@builderbot/bot'
import { BotContext, TFlow } from '@builderbot/bot/dist/types';

// Object to store timers for each user
const timers = {};

// Flow for handling inactivity sin terminar flujo
const idleFlow = addKeyword(EVENTS.ACTION).addAction(
    async (_, { flowDynamic }) => {
        await flowDynamic("Hola? Estás ahí? Parece que te has ido 😢");
    }
);

// Function to start the inactivity timer for a user
const start = (ctx: BotContext, flowDynamic, ms: number) => {
    timers[ctx.from] = setTimeout( async () => {
        await flowDynamic("Hola? Estás ahí? Parece que te has ido 😢");
    }, ms);
}

// Function to reset the inactivity timer for a user
const reset = (ctx: BotContext, flowDynamic, ms: number) => {
    stop(ctx);
    if (timers[ctx.from]) {
        clearTimeout(timers[ctx.from]);
    }
    start(ctx, flowDynamic, ms);
}

// Function to stop the inactivity timer for a user
const stop = (ctx: BotContext) => {
    if (timers[ctx.from]) {
        clearTimeout(timers[ctx.from]);
    }
}

export {
    start,
    reset,
    stop,
    idleFlow,
}