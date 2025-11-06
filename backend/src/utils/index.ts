export const formatResponse = (data: any) => {
  return {
    data,
    timestamp: new Date().toISOString(),
  };
};

export * from './password';
export * from './jwt';