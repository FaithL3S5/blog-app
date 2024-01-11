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
  // Hooks for managing state
  const toast = useToast();
  const router = useRouter();

  // Initial data for a new user
  const emptyUser = {
    id: 0,
    name: "",
    email: "",
    gender: "male",
    status: "active",
  };

  // State variables
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchStatus, setSearchStatus] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [userIdToProcess, setUserIdToProcess] = useState<number>(0);
  const [userToSearch, setUserToSearch] = useState<string>("");
  const [operation, setOperation] = useState<string>("add");
  const [listedUser, setListedUser] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(emptyUser);

  // Chakra UI hooks for modal and drawer
  const drawerDisclosure = useDisclosure();
  const modalDisclosure = useDisclosure();
  const firstField = useRef<HTMLInputElement | null>(null);

  // Hooks for handling URL search parameters
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = navRouter();
  const [query] = useDebounce(userToSearch, 750);

  // Initial data fetch on component mount
  useEffect(() => {
    getUsers(1)
      .then((data) => {
        setListedUser(data);
        setIsLoading(false);
      })
      .catch((error: any) => console.error(error));
  }, []);

  // Effect to handle search queries and update URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`);

    const findUser = async () => {
      setIsLoading(true);
      setListedUser([]);
      searchUser(query)
        .then((data) => {
          if (data) setListedUser(data);
          setIsLoading(false);
        })
        .catch((error: any) => console.error(error));
    };

    findUser();
    // eslint-disable-next-line
  }, [query]);

  // Effect to set the user search state from URL on component mount
  useEffect(() => {
    if (router.isReady) {
      const params = new URLSearchParams(searchParams);
      const currentQuery = params.get("q") || "";
      setUserToSearch(currentQuery);
    }
    // eslint-disable-next-line
  }, [router.isReady]);

  // Event handler for user search input change
  const handleUserToSearch: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const value = event.target.value;
    setUserToSearch(value);

    if (value) {
      setSearchStatus(true);
    } else {
      setSearchStatus(false);
    }
  };

  // Event handler for pagination change
  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    if (currentPage === value) return;

    setIsLoading(true);
    setCurrentPage(value);
    getUsers(value)
      .then((data) => {
        setListedUser(data);
        setIsLoading(false);
      })
      .catch((error: any) => console.error(error));
  };

  // Event handler for adding a new user
  const handleAddUser = () => {
    setCurrentUser(emptyUser);
    setOperation("add");
    drawerDisclosure.onOpen();
  };

  // Event handler for updating an existing user
  const handleUpdateUser = (user: User) => {
    setCurrentUser(user);
    setOperation("edit");
    drawerDisclosure.onOpen();
  };

  // Event handler for deleting a user
  const handleDeleteUser = () => {
    deleteUser(userIdToProcess)
      .then(() => {
        setListedUser([]);
        setIsLoading(true);
        getUsers(1)
          .then((data) => {
            setListedUser(data);
            setIsLoading(false);
            modalDisclosure.onClose();
            toast({
              title: `User deleted (id: ${userIdToProcess})`,
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
    // Main container for the users page
    <Box
      pt="0.5rem"
      pb="2rem"
      fontSize={16}
      id="postContainer"
      overflowY="auto"
    >
      {/* UserForm component for adding and editing users */}
      <UserForm
        isOpen={drawerDisclosure.isOpen}
        onClose={drawerDisclosure.onClose}
        firstField={firstField}
        user={currentUser}
        operation={operation}
        loadingNewData={setIsLoading}
        setListedUser={setListedUser}
      />
      {/* Flex container for "Add" button and user search input */}
      <Flex>
        {/* "Add" button for adding a new user */}
        <Button
          colorScheme="teal"
          isLoading={isLoading}
          onClick={handleAddUser}
          pr={5}
          mb={5}
        >
          Add
        </Button>
        <Spacer mx={3} />
        {/* Input field for searching users */}
        <Input
          borderColor="gray"
          type="text"
          value={userToSearch}
          onChange={handleUserToSearch}
          disabled={isLoading}
          placeholder="Search user..."
          _placeholder={{ color: "gray" }}
        />
      </Flex>
      {/* Loading spinner when data is still loading */}
      {isLoading && (
        <Flex justify="center" align="center">
          <Spinner />
        </Flex>
      )}
      {/* Display listed users */}
      {listedUser.length > 0 &&
        listedUser.map((item, index, array) => {
          return (
            <React.Fragment key={index}>
              {/* User card for each listed user */}
              <Card mb={5}>
                <CardBody>
                  {/* Responsive layout for small screens */}
                  <Flex
                    display={{ base: "flex", md: "none" }}
                    align="center"
                    justify="center"
                    direction="column"
                  >
                    {/* Avatar and basic user information */}
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
                    {/* Actions: Update and Delete buttons */}
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

                  {/* Grid layout for larger screens */}
                  <SimpleGrid
                    display={{ base: "none", md: "grid" }}
                    columns={1}
                    spacing={3}
                  >
                    {/* Same user information layout as in the Flex container */}
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
                    {/* Actions: Update and Delete buttons */}
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
                        onClick={() => {
                          setUserIdToProcess(item.id);
                          modalDisclosure.onOpen();
                        }}
                      >
                        Delete
                      </Button>
                    </Flex>
                  </SimpleGrid>
                </CardBody>
              </Card>
            </React.Fragment>
          );
        })}
      {/* Pagination and loading spinner for user list */}
      {!isLoading && listedUser.length > 0 && (
        <>
          <Card
            display={searchStatus ? "none" : "flex"}
            bgColor="white"
            align="center"
            justify="center"
          >
            <CardBody>
              {/* Pagination component */}
              <Pagination
                count={50}
                variant="outlined"
                page={currentPage}
                onChange={handleChangePage}
                disabled={isLoading}
              />
              {/* Loading spinner for pagination */}
              {isLoading && (
                <Center>
                  <Spinner color="black" />
                </Center>
              )}
            </CardBody>
          </Card>
          {/* Scroll to top button */}
          <Center cursor="pointer" mt={5} onClick={scrollToTop}>
            <Text>Go back up</Text>
          </Center>
        </>
      )}
      {/* Display message when no users are found */}
      {!isLoading && listedUser.length < 1 && (
        <Center>
          <Text>No user was found</Text>
        </Center>
      )}

      {/* Modal for user deletion confirmation */}
      <Modal isOpen={modalDisclosure.isOpen} onClose={modalDisclosure.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure about this action? It is irreversible!
          </ModalBody>

          <ModalFooter>
            {/* Close and Delete buttons */}
            <Button colorScheme="blue" mr={3} onClick={modalDisclosure.onClose}>
              Close
            </Button>
            <Button
              variant="solid"
              colorScheme="red"
              onClick={() => handleDeleteUser()}
            >
              DELETE
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
export default UsersPage;
