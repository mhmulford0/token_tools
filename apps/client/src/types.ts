export type ApiRequest = {
  contractAddress: string;
  wallet: string;
};

export type ApiResponse = {
  balance: string;
  decimals: string;
  name: string;
  symbol: string;
  wallet: string
};