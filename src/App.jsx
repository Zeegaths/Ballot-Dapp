import { Box, Container, Flex, Text } from "@radix-ui/themes";
import { configureWeb3Modal } from "./connection";
import "@radix-ui/themes/styles.css";
import Header from "./component/Header";
import DelegateVote from "./component/DelegateVote";
import VoteComponent from "./component/Vote";

configureWeb3Modal();

function App() {   

    return (
        <Container>
            <Header />
            <main className="mt-6">
                <Box mb="4">
                    <DelegateVote />
                </Box>
                <Flex wrap={"wrap"} gap={"6"}>
                   <VoteComponent/>
                </Flex>
            </main>
        </Container>
    );
}

export default App;