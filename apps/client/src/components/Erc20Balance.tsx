import useErc20TokenBalance from "@/core/client/hooks/useErc20TokenBalance";
import dynamic from "next/dynamic";
const AddressInput = dynamic(() => import("@/components/AddressInput"), {
  ssr: false,
});
import ERC20TokenBalance from "./ERC20TokenInfo";

export default function Erc20Balance() {
  const { apiData, checkTokenBalance } = useErc20TokenBalance();
  return (
    <>
      <AddressInput checkTokenBalance={checkTokenBalance} />
      {apiData.balance ? <ERC20TokenBalance apiData={apiData} /> : ""}
    </>
  );
}
