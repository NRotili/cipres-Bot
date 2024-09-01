import { addKeyword, EVENTS } from "@builderbot/bot";
import { revendedorAromatizacionConsultaFlow } from "./revendedorAromatizacion.flow";

// const revendedorAromatizacionConsultaAsesorFlow = addKeyword(EVENTS.ACTION)
    


const revendedorAromatizacionConsultaHorariosFlow = addKeyword(EVENTS.ACTION)
    .addAnswer(["🕥 Lunes a Viernes de 8hs a 18hs",
        "🕥 Sábados de 8:30hs a 13hs."], {delay: 1000})
    .addAnswer(["IMPORTANTE ⚠️",
        "Compras de mayoristas y revendedores únicamente podrán ser efectuadas de Lunes a Viernes. Sin excepción.", "Te esperamos en 📍 Urquiza 721, Villa Constitución"])
    .addAnswer(['Otra consulta? 🤔','1️⃣. Sí', '2️⃣. No'], {delay: 1000, capture: true},
    async (ctx, ctxFn) => {
        const bodyText: string = ctx.body.toLowerCase();
        const keywords: string[] = ['1', 'sí', 'si', '2', 'no'];
        const containsKeyword = keywords.some(keyword => bodyText.includes(keyword));
        if (containsKeyword) {
            switch (bodyText) {
                case '1':
                case 'sí':
                    return ctxFn.gotoFlow(revendedorAromatizacionConsultaFlow);
                case '2':
                case 'no':
                    return ctxFn.endFlow();
            }
        } else {
            return ctxFn.fallBack("Tienes que seleccionar una de las opciones disponibles 😁");
        }
    });


const revendedorAromatizacionConsultaMetodologiaFlow = addKeyword(EVENTS.ACTION)
    .addAnswer(["Somos Distribuidores Oficiales de Saphirus🥇",
        "Forma parte de nuestro staff de revendedores y emprende tu propio negocio 🙌🏽"], {delay: 1000})
    .addAnswer([
        "🛍️ Compra mínima de $30.000 para apertura de cuenta.",
        "💰 Forma de pago: Efectivo | Transferencia con un 5% de recargo.",
        "🕥 Las compras se realizan: de Lunes a viernes de 8 hs a 18 hs. (no se atienden revendedores los días sábados).",
        "📋 Se debe solicitar Planilla para Pedidos solo para envíos fuera de la ciudad de Villa Constitución.",
        "🛒 Armado del pedido: entre 48/72 hs.",
        "🚛 Envío: a cargo del cliente (comisionista/cadete).",
        "🧑🏽‍💻 Asesoramiento y cotizaciones: de Lunes a Viernes de 8 hs. a 18 hs. en 📍 Urquiza 721, Villa Constitución."
    ], {delay: 1000})
    .addAnswer(['Otra consulta? 🤔','1️⃣. Sí', '2️⃣. No'], {delay: 1000, capture: true},
    async (ctx, ctxFn) => {
        const bodyText: string = ctx.body.toLowerCase();
        const keywords: string[] = ['1', 'sí', 'si', '2', 'no'];
        const containsKeyword = keywords.some(keyword => bodyText.includes(keyword));

        if (containsKeyword) {
            switch (bodyText) {
                case '1':
                case 'sí':
                    return ctxFn.gotoFlow(revendedorAromatizacionConsultaFlow);
                case '2':
                case 'no':
                    return ctxFn.endFlow();
            }
        } else {
            return ctxFn.fallBack("Tienes que seleccionar una de las opciones disponibles 😁");
        }
    });

const revendedorAromatizacionConsultaPreciosFlow = addKeyword(EVENTS.ACTION)
    .addAnswer("Podes visitar en nuestro sitio web el catálogo exclusivo para revendedores! 😉", {delay: 1000})
    .addAnswer("https://catalogos.cipresdigital.com.ar/catalogo/revendedor/AROMATIZACION", {delay: 1000})
    .addAnswer(['Otra consulta?','1️⃣. Sí', '2️⃣. No'], {delay: 1000, capture: true},
    async (ctx, ctxFn) => {
        const bodyText: string = ctx.body.toLowerCase();
        const keywords: string[] = ['1', 'sí', 'si', '2', 'no'];
        const containsKeyword = keywords.some(keyword => bodyText.includes(keyword));

        if (containsKeyword) {
            switch (bodyText) {
                case '1':
                case 'sí':
                    return ctxFn.gotoFlow(revendedorAromatizacionConsultaFlow);
                case '2':
                case 'no':
                    return ctxFn.endFlow("Gracias por tu consulta! 😊");
            }
        } else {
            return ctxFn.fallBack("Tienes que seleccionar una de las opciones");
        }
    });

export { revendedorAromatizacionConsultaMetodologiaFlow, revendedorAromatizacionConsultaPreciosFlow, revendedorAromatizacionConsultaHorariosFlow };