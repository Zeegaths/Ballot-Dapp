import { useCallback } from "react";
import { isSupportedChain } from "../utils";
import { isAddress } from "ethers";
import { getProvider } from "../constants/providers";
import { getProposalsContract } from "../constants/contracts";
import {
    useWeb3ModalAccount,
    useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { toast } from "react-toastify";

const useDelegateVote = (address) => {
    const { chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    return useCallback(async () => {
        if (!isSupportedChain(chainId)) return toast.error("Wrong network");
        if (!isAddress(address)) return toast.error("Invalid address");
        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();

        const contract = getProposalsContract(signer);

        try {
            const estimatedGas = await contract.delegate.estimateGas(
                address
            );
            // console.log("estimatedGas: ", estimatedGas);

            // const feeData = await readWriteProvider.getFeeData();

            // console.log("feeData: ", feeData);

            // const gasFee = estimatedGas * feeData.gasPrice;

            // console.log("estimated: ", gasFee);

            const transaction = await contract.delegate(address, {
                gasLimit: estimatedGas,
            });
            console.log("transaction: ", transaction);
            const receipt = await transaction.wait();

            console.log("receipt: ", receipt);

            if (receipt.status) {
                return toast.success("Delegate Vote successfull!");
            }

            toast.error("Delegate Vote failed!");
        } catch (error) {
            toast.error(error);
            let errorText;
            if (error.reason === "Self-delegation is disallowed.") {
                errorText = "Self-delegation is disallowed";
            } else if (error.reason === "You already voted.") {
                errorText = "You have already voted";
            } else if (error.reason === "Found loop in delegation.") {
                errorText = "Found loop in delegation.";
            } else {
                errorText = "An unknown error occured";
            }
            toast.error(`error: , ${errorText}`);
            
        }
    }, [address, chainId, walletProvider]);
};

export default useDelegateVote;
