import {
  ConnectWallet,
  Web3Button,
  useAddress,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react";
import {
  Container,
  Flex,
  Box,
  Text,
  SimpleGrid,
  Heading,
  Skeleton,
  Card,
  CardBody,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const address = useAddress();
  const contractAddress = "0xa33e398ff57D6615fC531FC9616cda175DE9F5f7";
  const { contract } = useContract(contractAddress);
  const { data: totoalCoffee, isLoading: loadingTotalCoffee } = useContractRead(
    contract,
    "getTotallCoffee"
  );
  const { data: recentCoffee, isLoading: loadingRecentCoffee } =
    useContractRead(contract, "getAllCoffee");

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };
  const clearValues = () => {
    setName("");
    setMessage("");
  };

  return (
    <Container maxW={"1200px"} w={"full"}>
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        py={"20px"}
        height={"80px"}
      >
        <Box>
          <Text fontWeight={"bold"}>But Me A Coffee</Text>
        </Box>
        <ConnectWallet />
      </Flex>
      <SimpleGrid columns={2} spacing={10} mt={"40px"}>
        <Box>
          <Card>
            <CardBody>
              <Heading mb={"20px"}>Buy a coffee</Heading>
              <Flex direction={"row"}>
                <Text>Total Coffees: </Text>
                <Skeleton
                  isLoaded={!loadingTotalCoffee}
                  width={"20px"}
                  ml={"5px"}
                >
                  {totoalCoffee?.toString()}
                </Skeleton>
              </Flex>
              <Text fontSize={"2xl"} py={"10px"}>
                Name:
              </Text>
              <Input
                placeholder="Mahsatech"
                maxLength={16}
                value={name}
                onChange={handleNameChange}
              />
              <Text fontSize={"2xl"} mt={"10px"} py={"10px"}>
                Message:
              </Text>
              <Input
                placeholder="Hello"
                maxLength={80}
                value={message}
                onChange={handleMessageChange}
              />
              <Box mt={"20px"}>
                {address ? (
                  <Web3Button
                    contractAddress={contractAddress}
                    action={(contract) => {
                      contract.call("buyCoffee", [message, name], {
                        value: ethers.utils.parseEther("0.01"),
                      });
                    }}
                    onSuccess={clearValues}
                  >
                    {"Buy a coffee 0.01 ETH"}
                  </Web3Button>
                ) : (
                  <Text>Please connect you wallet </Text>
                )}
              </Box>
            </CardBody>
          </Card>
        </Box>
        <Box>
          <Card maxH={"60vh"} overflow={"scroll"}>
            <CardBody>
              <Text fontWeight={"bold"}>Recent Messages:</Text>
              {!loadingRecentCoffee ? (
                <Box>
                  {recentCoffee &&
                    recentCoffee.map((coffee, index) => {
                      return (
                        <Card key={index} my={"10px"}>
                          <CardBody>
                            <Text fontSize={"2xl"}>{coffee[1]}</Text>
                            <Text>From: {coffee[2]}</Text>
                          </CardBody>
                        </Card>
                      );
                    })}
                </Box>
              ) : (
                <Stack>
                  <Skeleton height={"100px"} />
                  <Skeleton height={"100px"} />
                  <Skeleton height={"100px"} />
                </Stack>
              )}
            </CardBody>
          </Card>
        </Box>
      </SimpleGrid>
    </Container>
  );
}
