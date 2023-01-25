import type { ApiResponse } from "@/types";
import { useAccount } from "wagmi";

export default function ERC20TokenInfo(props: { apiData: ApiResponse }) {
  const { address } = useAccount();
  const { name, symbol, balance, wallet } = props.apiData;
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Token Information</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{name}</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Symbol</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{symbol}</dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Balance</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {parseFloat(balance).toFixed(4)} /
                <>
                  {wallet === address ? (
                    <div className="inline ml-[0.5ch] text-gray-500 italic font-bold hover:underline cursor-pointer">Transfer</div>
                  ) : (
                    ""
                  )}
                </>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
