export const formatResponse = (data: any) => {
  return {
    data,
    timestamp: new Date().toISOString(),
  };
};