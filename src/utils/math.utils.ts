export const range = (min: number, max: number, round = true): number => {
    const raw = Math.random() * (max - min) + min;

    return round
        ? Math.floor(raw)
        : raw;
};
