export const getDate = (timestamp: number) => new Date(timestamp * 1000);

export const getTimestamp = (): number => {
    return Math.floor(Date.now() / 1000);
  };

  export const formatDate = (timestamp: number) => {
    return getDate(timestamp).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };