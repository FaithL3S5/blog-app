import { createPost, getPosts } from "@/reusables/ApiCall";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Link as ChakraLink,
  Flex,
  HStack,
  Input,
  SimpleGrid,
  Spinner,
  Text,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import CommentIcon from "@mui/icons-material/Comment";
import { Pagination } from "@mui/material";
import Link from "next/link";
import React, {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";

type User = {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
};

type UserPost = {
  id: number;
  user_id: number;
  title: string;
  body: string;
};

type PostForm = {
  user: number;
  title: string;
  body: string;
};

type PostPageProps = {
  defaultUser: User;
  scrollToTop: () => void;
};

const PostPage: React.FC<PostPageProps> = ({ defaultUser, scrollToTop }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [listedPost, setListedPost] = useState<UserPost[]>([]);
  const [formToSend, setFormToSend] = useState<PostForm>({
    user: defaultUser.id,
    title: "",
    body: "",
  });

  // chakra ui toast
  const toast = useToast();

  // Function to handle page change in pagination
  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    if (currentPage === value) return;

    setIsLoading(true);
    setCurrentPage(value);

    // Fetch and display data for the new page
    getPosts(value)
      .then((data) => {
        setListedPost(data);
        setIsLoading(false);
      })
      .catch((error: any) => console.error(error));
  };

  // Fetch and display data when the component mounts
  useEffect(() => {
    getPosts(1)
      .then((data) => {
        setListedPost(data);
        setIsLoading(false);
      })
      .catch((error: any) => console.error(error));
  }, []);

  // Function to handle input change in the form
  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    const { name, value } = event.target;

    setFormToSend((prevFormUser) => ({
      ...prevFormUser,
      [name]: value,
    }));
  };

  // Function to handle post button click
  const handlePost: MouseEventHandler<HTMLButtonElement> = (event) => {
    setIsLoading(true);

    // Check for empty fields
    let emptyFields = [];
    if (!formToSend.title) emptyFields.push("title");
    if (!formToSend.body) emptyFields.push("body");

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

    // Create a new post
    createPost(defaultUser.id, formToSend)
      .then(() => {
        // Clear the form
        setFormToSend({
          user: defaultUser.id,
          title: "",
          body: "",
        });

        // Fetch and display posts for the first page
        getPosts(1)
          .then((data) => {
            setListedPost(data);
            setIsLoading(false);
            toast({
              title: `Your thread has been posted`,
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
    <SimpleGrid columns={1} fontSize={16}>
      {/* Form for creating a new post */}
      <Box borderBottom="1px solid gray">
        <Flex>
          <Avatar boxSize="2.4rem" mr={3} name={defaultUser.name} />
          <VStack flex="1">
            {/* Title input */}
            <Input
              variant="outline"
              borderColor="gray"
              name="title"
              type="text"
              value={formToSend.title}
              maxLength={200}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Your awesome title"
              _placeholder={{ color: "gray" }}
            />
            {/* Body textarea */}
            <Textarea
              variant="outline"
              borderColor="gray"
              name="body"
              value={formToSend.body}
              maxLength={500}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Share something with the world..."
              _placeholder={{ color: "gray" }}
            />
          </VStack>
        </Flex>
        {/* Post button */}
        <Button
          mt={3}
          mb={3}
          float="right"
          colorScheme="blue"
          disabled={isLoading}
          isLoading={isLoading}
          onClick={handlePost}
        >
          Post
        </Button>
      </Box>

      {/* Displaying the list of posts */}
      <Box id="postContainer" overflowY="auto">
        {/* Loading spinner */}
        {isLoading && (
          <Flex justify="center" mt={3} align="center">
            <Spinner color="white" />
          </Flex>
        )}

        {/* Render each post */}
        {!isLoading &&
          listedPost.length > 0 &&
          listedPost.map((item, index, array) => (
            <ChakraLink
              key={index}
              as={Link}
              href={`/posts/${item.id}/comments`}
              _hover={{ textDecoration: "none" }}
            >
              <Box id="postContent" borderBottom="1px solid gray">
                <Box mt={3}>
                  <Box>
                    <Text fontWeight="bold" mt={2}>
                      {item.title}
                    </Text>
                    <Text mt={2}>{item.body}</Text>
                  </Box>
                </Box>
                <HStack my={2}>
                  <Box color="gray" mt={2}>
                    <CommentIcon />
                  </Box>
                  <Text fontSize={14} color="gray">
                    &nbsp; Click to check the comments
                  </Text>
                </HStack>
              </Box>
            </ChakraLink>
          ))}

        {/* Pagination and loading spinner */}
        {!isLoading && listedPost.length > 0 && (
          <>
            {/* Pagination component */}
            <Card mt={3} bgColor="white" align="center" justify="center">
              <CardBody>
                <Pagination
                  count={50}
                  variant="outlined"
                  page={currentPage}
                  onChange={handleChangePage}
                  disabled={isLoading}
                />
                {/* Loading spinner */}
                {isLoading && (
                  <Center>
                    <Spinner color="black" />
                  </Center>
                )}
              </CardBody>
            </Card>

            {/* Go back to top button */}
            <Center cursor="pointer" mt={5} onClick={scrollToTop}>
              <Text>Go back up</Text>
            </Center>
          </>
        )}

        {/* No posts found message */}
        {!isLoading && listedPost.length < 1 && (
          <Center mt={5} borderY="1px solid gray" py={3}>
            <Text>No posts were found</Text>
          </Center>
        )}
      </Box>
    </SimpleGrid>
  );
};
export default PostPage;
