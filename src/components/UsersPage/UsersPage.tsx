import { deleteUser, getUsers, searchUser } from "@/reusables/ApiCall";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Divider,
  Flex,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spacer,
  Spinner,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import AddIcon from "@mui/icons-material/Add";
import { Pagination } from "@mui/material";
import {
  useRouter as navRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import UserForm from "../UserForm/UserForm";

type User = {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
};

type UsersPageProps = {
  scrollToTop: () => void;
};

const UsersPage: React.FC<UsersPageProps> = ({ scrollToTop }) => {
  const toast = useToast();
  const router = useRouter();

  const emptyUser = {
    id: 0,
    name: "",
    email: "",
    gender: "male",
    status: "active",
  };

  const [listedUser, setListedUser] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userToSearch, setUserToSearch] = useState<string>("");
  const [searchStatus, setSearchStatus] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User>(emptyUser);
  const [operation, setOperation] = useState<string>("add");

  const drawerDisclosure = useDisclosure();
  const modalDisclosure = useDisclosure();
  const firstField = useRef<HTMLInputElement | null>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = navRouter();
  const [query] = useDebounce(userToSearch, 750);

  useEffect(() => {
    getUsers(1)
      .then((data) => {
        setListedUser(data);
        setIsLoading(false);
      })
      .catch((error: any) => console.error(error));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("q", query);
      setSearchStatus(false);
    } else {
      params.delete("q");
      setSearchStatus(true);
    }
    replace(`${pathname}?${params.toString()}`);

    const findUser = async () => {
      setIsLoading(true);
      setListedUser([]);
      // // Add logic here to fetch and display data for the new page
      searchUser(query)
        .then((data) => {
          if (data) setListedUser(data);
          setIsLoading(false);
        })
        .catch((error: any) => console.error(error));
    };

    findUser();
  }, [query]);

  useEffect(() => {
    if (router.isReady) {
      // Code using query
      const params = new URLSearchParams(searchParams);
      const currentQuery = params.get("q") || "";
      // this will set the state before component is mounted
      setUserToSearch(currentQuery);
    }
  }, [router.isReady]);

  const handleUserToSearch: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const value = event.target.value;
    setUserToSearch(value);
  };

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    if (currentPage === value) return;

    setIsLoading(true);
    setCurrentPage(value);
    // Add logic here to fetch and display data for the new page
    getUsers(value)
      .then((data) => {
        setListedUser(data);
        setIsLoading(false);
      })
      .catch((error: any) => console.error(error));
  };

  const handleAddUser = () => {
    setCurrentUser(emptyUser);
    setOperation("add");
    drawerDisclosure.onOpen();
  };

  const handleUpdateUser = (user: User) => {
    setCurrentUser(user);
    setOperation("edit");
    drawerDisclosure.onOpen();
  };

  const handleDeleteUser = (user: User) => {
    deleteUser(user)
      .then(() => {
        setListedUser([]);
        setIsLoading(true);
        getUsers(1)
          .then((data) => {
            setListedUser(data);
            setIsLoading(false);
            modalDisclosure.onClose();
            toast({
              title: `User deleted (id: ${user.id})`,
              status: "success",
              duration: 9000,
              isClosable: true,
            });
          })
          .catch((error: any) => console.error(error));
      })
      .catch((error: any) => console.error(error));
  };

  return (
    <Box
      pt="0.5rem"
      pb="2rem"
      fontSize={16}
      id="postContainer"
      overflowY="auto"
    >
      <UserForm
        isOpen={drawerDisclosure.isOpen}
        onClose={drawerDisclosure.onClose}
        firstField={firstField}
        user={currentUser}
        operation={operation}
        loadingNewData={setIsLoading}
        setListedUser={setListedUser}
      />
      <Flex>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="teal"
          onClick={handleAddUser}
          pr={5}
          mb={5}
        >
          Add
        </Button>
        <Spacer mx={5} />
        <Input
          borderColor="gray"
          type="text"
          value={userToSearch}
          onChange={handleUserToSearch}
          placeholder="Search user..."
          _placeholder={{ color: "gray" }}
        />
      </Flex>
      {isLoading && (
        <Flex justify="center" align="center">
          <Spinner />
        </Flex>
      )}
      {listedUser.length > 0 &&
        listedUser.map((item, index, array) => {
          return (
            <>
              <Card mb={5}>
                <CardBody>
                  <Flex
                    display={{ base: "flex", md: "none" }}
                    align="center"
                    justify="center"
                    direction="column"
                  >
                    <Box mb={3}>
                      <Avatar boxSize="2.4rem" mr={3} name={item.name} />
                    </Box>
                    <Box>
                      <VStack spacing={1}>
                        <HStack>
                          <Text fontWeight="bold" fontSize={14}>
                            {item.name}
                          </Text>
                          <Text fontSize={14}>is a</Text>
                          <Badge
                            variant="solid"
                            colorScheme={
                              item.gender.toLowerCase() === "male"
                                ? "green"
                                : "pink"
                            }
                          >
                            {item.gender}
                          </Badge>
                        </HStack>
                        <HStack>
                          <Text fontSize={14}>{item.id}</Text>
                          <Text fontSize={14}>&nbsp; &#x2022; &nbsp;</Text>
                          <Badge
                            variant="solid"
                            colorScheme={
                              item.status.toLowerCase() === "active"
                                ? "cyan"
                                : "red"
                            }
                          >
                            {item.status}
                          </Badge>
                        </HStack>
                      </VStack>
                    </Box>
                    <Box>
                      <Text fontSize="14px">{item.email.toString()}</Text>
                    </Box>
                    <Divider borderColor="white" my={5} />
                    <Flex>
                      <Button
                        variant="solid"
                        colorScheme="purple"
                        size="sm"
                        onClick={() => handleUpdateUser(item)}
                        mr={10}
                      >
                        Update
                      </Button>
                      <Button
                        onClick={modalDisclosure.onOpen}
                        variant="solid"
                        colorScheme="red"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </Flex>
                  </Flex>

                  <SimpleGrid
                    display={{ base: "none", md: "grid" }}
                    columns={1}
                    spacing={3}
                  >
                    <Flex align="center">
                      <Box>
                        <Avatar boxSize="2.4rem" mr={3} name={item.name} />
                      </Box>
                      <Box flex="1">
                        <VStack align="left" justify="left" spacing={1}>
                          <Flex align="center" justify="left">
                            <Text fontWeight="bold" fontSize={14}>
                              {item.name}
                            </Text>
                            <Text fontSize={14}>&nbsp; &#x2022; {item.id}</Text>
                            <Spacer />
                            <Badge
                              variant="solid"
                              colorScheme={
                                item.status.toLowerCase() === "active"
                                  ? "cyan"
                                  : "red"
                              }
                            >
                              {item.status}
                            </Badge>
                          </Flex>
                          <HStack>
                            <Badge
                              variant="solid"
                              colorScheme={
                                item.gender.toLowerCase() === "male"
                                  ? "green"
                                  : "pink"
                              }
                            >
                              {item.gender}
                            </Badge>
                            <Text fontSize="14px">{item.email.toString()}</Text>
                          </HStack>
                        </VStack>
                      </Box>
                    </Flex>
                    <Divider borderColor="white" />
                    <Flex>
                      <Button
                        variant="solid"
                        colorScheme="purple"
                        size="sm"
                        onClick={() => handleUpdateUser(item)}
                      >
                        Update
                      </Button>
                      <Spacer />
                      <Button
                        variant="solid"
                        colorScheme="red"
                        size="sm"
                        onClick={modalDisclosure.onOpen}
                      >
                        Delete
                      </Button>
                    </Flex>
                  </SimpleGrid>
                </CardBody>
              </Card>
              <Modal
                isOpen={modalDisclosure.isOpen}
                onClose={modalDisclosure.onClose}
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Confirmation</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    Are you sure about this action? It is irreversible!
                  </ModalBody>

                  <ModalFooter>
                    <Button
                      colorScheme="blue"
                      mr={3}
                      onClick={modalDisclosure.onClose}
                    >
                      Close
                    </Button>
                    <Button
                      variant="solid"
                      colorScheme="red"
                      onClick={() => handleDeleteUser(item)}
                    >
                      DELETE
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </>
          );
        })}
      {listedUser.length > 0 && (
        <>
          <Card
            display={searchStatus ? "none" : "flex"}
            bgColor="white"
            align="center"
            justify="center"
          >
            <CardBody>
              <Pagination
                count={135}
                variant="outlined"
                page={currentPage}
                onChange={handleChangePage}
                disabled={isLoading}
              />
              {isLoading && (
                <Center>
                  <Spinner color="black" />
                </Center>
              )}
            </CardBody>
          </Card>
          <Center cursor="pointer" mt={5} onClick={scrollToTop}>
            <Text>Go back up</Text>
          </Center>
        </>
      )}
      {!isLoading && listedUser.length < 1 && (
        <Center cursor="pointer" mt={5} onClick={scrollToTop}>
          <Text>No user was found</Text>
        </Center>
      )}
    </Box>
  );
};
export default UsersPage;
