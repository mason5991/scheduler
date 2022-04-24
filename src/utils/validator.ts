export const validateProtocol = (protocol: string) => {
  const acceptProtocols = ['http', 'https'];
  return acceptProtocols.includes(protocol);
};

export default {
  validateProtocol,
};
