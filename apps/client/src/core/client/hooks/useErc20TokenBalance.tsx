import { ApiRequest, ApiResponse } from "@/types";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function useErc20TokenBalance() {
  const { address } = useAccount();

  const [apiData, setApiData] = useState<ApiResponse>({
    balance: "",
    decimals: "",
    name: "",
    symbol: "",
    wallet: "",
  });

  async function checkTokenBalance(contractAddress: string) {
    if (!address || !contractAddress) {
      throw Error("IMPLEMENT ERROR HANDLING");
    }
    const res = await fetch(
      `http://localhost:3001/erc20balances?${new URLSearchParams({
        wallet: address,
        contractAddress: contractAddress,
      })}`
    );
    const data: ApiResponse = await res.json();

    console.log(data);

    setApiData({ ...data, wallet: address });
  }

  return { checkTokenBalance, apiData };
}
