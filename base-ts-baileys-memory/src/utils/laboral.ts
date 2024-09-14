function esHorarioValido() {
    const fecha = new Date();
    const dia = fecha.getDay();
    const hora = fecha.getHours();

    // Aseguramos que las variables de entorno sean números válidos
    const HORA_INICIO_FIN_SEMANA = parseInt(process.env.HORA_INICIO_FIN_SEMANA) || 0;
    const HORA_FIN_FIN_SEMANA = parseInt(process.env.HORA_FIN_FIN_SEMANA) || 23;
    const HORA_INICIO_SEMANA = parseInt(process.env.HORA_INICIO_SEMANA) || 0;
    const HORA_FIN_SEMANA = parseInt(process.env.HORA_FIN_SEMANA) || 23;

    return (
      dia === 0 || // Es domingo
      (dia === 6 &&
        (hora < HORA_INICIO_FIN_SEMANA || hora > HORA_FIN_FIN_SEMANA)) || // Es sábado y la hora es antes o después
      (dia >= 1 &&
        dia <= 5 &&
        (hora < HORA_INICIO_SEMANA || hora > HORA_FIN_SEMANA)) // Es día de semana y la hora es antes o después del horario
    );
}

export { esHorarioValido };