import { Flex } from "@radix-ui/themes";
import GiveRightToVoteComponent from "./GiveRightToVoteComponent";
import useIsChairPerson from "../hooks/useIsChairPerson";

export default function Header() {
    const isChairPerson = useIsChairPerson();
    return(
        
            <Flex gap={"4"} align={"center"} justify={"between"}>
            <div>Ballot</div>
            <Flex gap={"4"} align={"center"}>

                {isChairPerson && <GiveRightToVoteComponent />}
                <w3m-button />
            </Flex>
            </Flex>
        
    );
}
