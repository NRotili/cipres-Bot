const waitT = (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(ms)
        }, ms)
    })
}

export { waitT }