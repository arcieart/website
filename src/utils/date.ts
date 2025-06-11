export const getDate = (timestamp: number) => new Date(timestamp * 1000);

export const getTimestamp = (): number => {
    return Math.floor(Date.now() / 1000);
  };