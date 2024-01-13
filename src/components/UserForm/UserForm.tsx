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
  // State to manage loading state and form data
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formUser, setFormUser] = useState<User>({
    id: user.id,
    name: user.name,
    email: user.email,
    gender: user.gender,
    status: user.status,
  });

  // Effect to update formUser when user prop changes
  useEffect(() => {
    setFormUser({
      id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      status: user.status,
    });
  }, [user]);

  // Toast hook for displaying notifications
  const toast = useToast();

  // Function to validate email format
  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Function to handle form submission
  const handleSubmit = () => {
    setIsLoading(true);

    let emptyFields = [];

    // Validate form fields
    if (formUser.name === "") emptyFields.push("name");
    if (formUser.email === "" || !isValidEmail(formUser.email))
      emptyFields.push("email");

    if (emptyFields.length > 0) {
      // Display error toast for invalid fields
      toast({
        title: `Invalid values detected on: ${emptyFields.join(", ")}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    // Perform CRUD operation based on the operation prop
    switch (operation) {
      case "add":
        // Logic for adding a new user
        postUser(formUser)
          .then(() => {
            // Refresh the user list and display success toast
            setListedUser([]);
            loadingNewData(true);
            getUsers(1)
              .then((data) => {
                setListedUser(data);
                loadingNewData(false);
                toast({
                  title: "New user added",
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                });
              })
              .catch((error: any) => {
                toast({
                  title: "An error occurred when sending the request",
                  status: "error",
                  duration: 9000,
                  isClosable: true,
                });
                console.error(error);
              });
          })
          .catch((error: any) => {
            toast({
              title: "An error occurred when sending the request",
              status: "error",
              duration: 9000,
              isClosable: true,
            });
            console.error(error);
          });
        break;
      case "edit":
        // Logic for editing an existing user
        putUser(formUser)
          .then(() => {
            // Refresh the user list and display success toast
            setListedUser([]);
            loadingNewData(true);
            getUsers(1)
              .then((data) => {
                setListedUser(data);
                loadingNewData(false);
                toast({
                  title: "User updated",
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                });
              })
              .catch((error: any) => {
                toast({
                  title: "An error occurred when sending the request",
                  status: "error",
                  duration: 9000,
                  isClosable: true,
                });
                console.error(error);
              });
          })
          .catch((error: any) => {
            toast({
              title: "An error occurred when sending the request",
              status: "error",
              duration: 9000,
              isClosable: true,
            });
            console.error(error);
          });
        break;
      default:
        // Display error toast for unknown operation
        toast({
          title: "Error occurred when sending the data",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        break;
    }

    setIsLoading(false);

    // Close the form drawer
    onClose();
  };

  // Function to handle form field changes
  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    // Update formUser state with the changed field
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
            {/* Form fields for user input */}
            <Box>
              <FormLabel htmlFor="username">Name</FormLabel>
              <Input
                ref={firstField}
                id="name"
                name="name"
                placeholder="Please enter user name"
                value={formUser.name}
                maxLength={200}
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
                maxLength={200}
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

        {/* Form submission buttons */}
        <DrawerFooter borderTopWidth="1px">
          <Button
            variant="outline"
            mr={3}
            onClick={onClose}
            isLoading={isLoading}
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
