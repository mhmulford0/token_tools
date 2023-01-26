import { classNames } from "@/core/client/classNames";
import type { ApiRequest } from "@/types";
import { useState } from "react";
import { useAccount } from "wagmi";

type Props = {
  checkTokenBalance: (contractAddress: string) => Promise<void>;
};

export default function AddressInput({ checkTokenBalance }: Props) {
  const { address } = useAccount();
  const [formData, setFormData] = useState<ApiRequest>({
    contractAddress: "",
    wallet: "",
  });
  const [formError, setFormError] = useState({
    error: "",
    message: "",
  });

  const isBtnDisabled = !address || formData.contractAddress.length !== 42;

  if (!address) {
    return <h1>Please connect Wallet</h1>;
  }

  return (
    <div className="mb-4 my-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-md prose text-center">
        <h2 className="text-white mt-6">Get ERC 20 Token Balance</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md prose prose-sm">
        <div className="bg-white pt-2 pb-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div>
            <label htmlFor="wallet" className="block font-medium text-gray-700">
              <h3>Wallet Address</h3>
            </label>
            <div className="mt-1">
              <input
                id="wallet"
                name="wallet"
                type="text"
                autoComplete="wallet"
                value={formData.wallet}
                required
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm"
                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              />
            </div>

            <div
              className="inline ml-[0.5ch] text-gray-500 italic font-bold text-sm hover:underline cursor-pointer"
              onClick={() => setFormData({ ...formData, wallet: address })}
            >
              Use My Address
            </div>
          </div>

          <div>
            <label htmlFor="contractAddress" className="block font-medium text-gray-700 mt-4">
              <h3>Contract Address</h3>
            </label>
            <div className="mt-1">
              <input
                id="contractAddress"
                name="contractAddress"
                type="text"
                autoComplete="contractAddress"
                required
                value={formData.contractAddress}
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm"
                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={classNames(
                isBtnDisabled
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700",
                "flex w-full justify-center rounded-md border border-transparent py-2 px-4 mt-2 text-sm font-medium text-white shadow-sm"
              )}
              disabled={isBtnDisabled}
              onClick={() => checkTokenBalance(formData.contractAddress)}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
