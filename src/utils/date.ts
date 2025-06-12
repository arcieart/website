export const getDate = (timestamp: number) => new Date(timestamp * 1000);

export const getTimestamp = (): number => {
    return Math.floor(Date.now() / 1000);
  };

  export const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(timestamp * 1000));
  };