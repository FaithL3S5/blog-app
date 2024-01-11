import { getUsers, postUser, putUser } from "@/reusables/ApiCall";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Input,
  Select,
  Stack,
  useToast,
} from "@chakra-ui/react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
};

type UserFormProps = {
  isOpen: boolean;
  onClose: () => void;
  firstField: React.MutableRefObject<HTMLInputElement | null>;
  user: User;
  operation: string;
  loadingNewData: Dispatch<React.SetStateAction<boolean>>;
  setListedUser: Dispatch<SetStateAction<User[]>>;
};

const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  firstField,
  user,
  operation,
  setListedUser,
  loadingNewData,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formUser, setFormUser] = useState<User>({
    id: user.id,
    name: user.name,
    email: user.email,
    gender: user.gender,
    status: user.status,
  });

  useEffect(() => {
    setFormUser({
      id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      status: user.status,
    });
  }, [user]);

  const toast = useToast();

  function isValidEmail(email: string): boolean {
    // Regular expression for a basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  }

  const handleSubmit = () => {
    setIsLoading(true);

    let emptyFields = [];

    if (formUser.name === "") emptyFields.push("name");
    if (formUser.email === "" || !isValidEmail(formUser.email))
      emptyFields.push("email");
    if (emptyFields.length > 0) {
      toast({
        title: `Invalid values detected on: ${emptyFields.join(", ")}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    switch (operation) {
      case "add":
        postUser(formUser)
          .then(() => {
            setListedUser([]);
            loadingNewData(true);
            getUsers(1)
              .then((data) => {
                setListedUser(data);
                loadingNewData(false);
                toast({
                  title: `New user added`,
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                });
              })
              .catch((error: any) => console.error(error));
          })
          .catch((error: any) => console.error(error));

        break;
      case "edit":
        putUser(formUser)
          .then(() => {
            setListedUser([]);
            loadingNewData(true);
            getUsers(1)
              .then((data) => {
                setListedUser(data);
                loadingNewData(false);
                toast({
                  title: `User updated`,
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                });
              })
              .catch((error: any) => console.error(error));
          })
          .catch((error: any) => console.error(error));
        break;
      default:
        toast({
          title: `Error occurred when sending the data`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        break;
    }

    setIsLoading(false);

    onClose();
  };

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormUser((prevFormUser) => ({
      ...prevFormUser,
      [name]: value,
    }));
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="left"
      initialFocusRef={firstField}
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          {formUser.id > 0 ? "Edit User" : "Add User"}
        </DrawerHeader>

        <DrawerBody>
          <Stack spacing="24px">
            <Box>
              <FormLabel htmlFor="username">Name</FormLabel>
              <Input
                ref={firstField}
                id="name"
                name="name"
                placeholder="Please enter user name"
                value={formUser.name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </Box>

            <Box>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input
                type="email"
                id="email"
                name="email"
                value={formUser.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </Box>

            <Box>
              <FormLabel htmlFor="gender">Gender</FormLabel>
              <Select
                id="gender"
                name="gender"
                value={formUser.gender}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Select>
            </Box>

            <Box>
              <FormLabel htmlFor="status">Status</FormLabel>
              <Select
                id="status"
                name="status"
                value={formUser.status}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </Box>
          </Stack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button
            variant="outline"
            mr={3}
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            isLoading={isLoading}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
export default UserForm;
