import { Box, Button, Card, Flex, Text, TextField } from "@radix-ui/themes";
import Proposal from "./Proposal";
import useProposals from "../hooks/useProposals";
import { useWeb3ModalAccount, useWeb3ModalProvider,} from "@web3modal/ethers/react";
import { isSupportedChain } from "../utils";
import { getProvider } from "../constants/providers";
import { getProposalsContract } from "../constants/contracts";
import { toast } from "react-toastify";

const DelegateVote = ({ to, handleDelegate }) => {

    const { loading, data: proposals } = useProposals();
    const { chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider();

    const handlDelegate = async (to) => {
        if (!isSupportedChain(chainId)) return console.error("Wrong network");
        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();

        const contract = getProposalsContract(signer);

        try {
            const transaction = await contract.delegate(to);
            console.log("transaction: ", transaction);
            const receipt = await transaction.wait();

            console.log("receipt: ", receipt);

            if (receipt.status) {
                return toast.success("delegation successfull!");
            }

            toast.error("delegation failed!");
        } catch (error) {
            console.log(error);
            let errorText;
            if (error.reason === "You already voted") {
                errorText = "You already voted";
            } else if (error.reason === "Self-delegation is disallowed.") {
                errorText = "Self-delegation is disallowed";
            } else if (error.reason === "Found loop in delegation..") {
                errorText = "Found loop in delegation.";
            } else {
                errorText = "An unknown error occured";
            }

            console.error("error: ", errorText);
        }
    };

    return (
        <Card size="2" style={{ width: 425 }}>
            <Flex gap="" align="center">
                <Box width={"100%"}>
                    <Flex direction="column" gap="3">
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Delegate&apos;s Address
                            </Text>
                            <TextField.Input placeholder="Enter Delegate's Address" />
                        </label>
                        <Button onClick={() => handlDelegate(to)}>
                            Delegate vote
                        </Button>
                    </Flex>
                </Box>
            </Flex>
        </Card>
    );
};

export default DelegateVote;
