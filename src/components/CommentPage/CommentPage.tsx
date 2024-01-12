import { defaultUserState } from "@/atoms/DefaultUserAtom";
import {
  createComment,
  getComments,
  getPosts,
  getSpecificPost,
} from "@/reusables/ApiCall";
import {
  Avatar,
  Box,
  Center,
  Link as ChakraLink,
  Flex,
  HStack,
  SimpleGrid,
  Spinner,
  Text,
  Textarea,
  Button,
  Divider,
  useTab,
  useToast,
  Stack,
} from "@chakra-ui/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommentIcon from "@mui/icons-material/Comment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

type User = {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
};

type OriginalPost = {
  id: number;
  user_id: number;
  title: string;
  body: string;
};

type Comments = {
  id: number;
  post_id: number;
  name: string;
  email: string;
  body: string;
};

type CommentForm = {
  name: string;
  email: string;
  body: string;
};

type CommentPageProps = {
  scrollToTop: () => void;
};

const CommentPage: React.FC<CommentPageProps> = ({ scrollToTop }) => {
  // chakra ui toast
  const toast = useToast();

  // Get default user value
  const defaultUser = useRecoilValue(defaultUserState);

  // State variables to manage component state
  const [postId, setPostId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<Comments[]>([]);
  const [oriPost, setOriPost] = useState<OriginalPost>({
    id: 0,
    user_id: 0,
    title: "",
    body: "",
  });
  const [formToSend, setFormToSend] = useState<CommentForm>({
    name: defaultUser.name,
    email: defaultUser.email,
    body: "",
  });

  // empty user object to check if user exist
  const emptyUser = {
    id: 0,
    name: "",
    email: "",
    gender: "",
    status: "",
  };

  // Next.js router instance
  const router = useRouter();

  useEffect(() => {
    // Fetch data when router is ready
    if (router.isReady) {
      // Extract postId from the URL
      const localPostId = parseInt(router.asPath.split("/")[2], 10);
      setPostId(() => parseInt(router.asPath.split("/")[2], 10));

      // Fetch the original post
      getSpecificPost(localPostId)
        .then((data: any) => {
          if (data.message) return;
          setOriPost(data);

          // Fetch comments for the post
          getComments(localPostId)
            .then((data) => {
              setComments(data);
              setIsLoading(false);
            })
            .catch((error: any) => console.error(error));
        })
        .catch((error: any) => console.error(error));
    }
    // eslint-disable-next-line
  }, [router.isReady]);

  // function to check objects equality
  function areObjectsEqual(obj1: any, obj2: any): boolean {
    // Check if both objects are defined
    if (obj1 === undefined || obj2 === undefined) {
      return false;
    }

    // Check if both objects have the same keys
    const obj1Keys = Object.keys(obj1);
    const obj2Keys = Object.keys(obj2);

    if (
      obj1Keys.length !== obj2Keys.length ||
      !obj1Keys.every((key) => obj2Keys.includes(key))
    ) {
      return false;
    }

    // Check if the values for each key are equal
    return obj1Keys.every((key) => obj1[key] === obj2[key]);
  }

  // Function to handle input change in the form
  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    const { name, value } = event.target;

    setFormToSend((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle post button click
  const handlePost: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    setIsLoading(true);

    // Check for empty fields
    let emptyFields = [];
    if (!formToSend.name) emptyFields.push("name");
    if (!formToSend.email) emptyFields.push("email");
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
    createComment(oriPost.id, formToSend)
      .then(() => {
        // Clear the form
        setFormToSend({
          name: "",
          email: "",
          body: "",
        });

        // Fetch and display posts for the first page
        getComments(postId)
          .then((data) => {
            setComments(data);
            setIsLoading(false);
            toast({
              title: `Your comment has been posted`,
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
    <>
      {/* Navigation link to go back to the post list */}
      <ChakraLink as={Link} href={`/`} _hover={{ textDecoration: "none" }}>
        <HStack py={3} borderY="1px solid gray">
          <Box mt={2}>
            <ArrowBackIcon />
          </Box>
          <Text fontSize={16} fontWeight="bold">
            &nbsp; Go back to post list
          </Text>
        </HStack>
      </ChakraLink>
      {/* Display post content and comments when not loading */}
      {!isLoading && (
        <SimpleGrid pt="0.5rem" pb="2rem" columns={1} fontSize={16}>
          {/* Original post content */}
          <Box id="postContent" borderBottom="1px solid gray">
            {/* Original post details */}
            <Box mt={3}>
              <Box>
                <Text fontWeight="bold" mt={2}>
                  {oriPost.title}
                </Text>
                <Text mt={2}>{oriPost.body}</Text>
              </Box>
            </Box>
            {/* Comment section header */}
            <HStack my={2}>
              <Box color="gray" mt={2}>
                <CommentIcon />
              </Box>
              <Text fontSize={14} color="gray">
                &nbsp; See what others think of this post below
              </Text>
            </HStack>
          </Box>

          {/* Display individual comments */}
          <Box id="postContainer" overflowY="auto">
            {/* Add comment section */}
            <HStack
              display={
                areObjectsEqual(defaultUser, emptyUser) ? "none" : "flex"
              }
              my={2}
            >
              <Textarea
                name="body"
                fontSize={14}
                color="gray"
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Share your thoughts of this post..."
                _placeholder={{ color: "gray" }}
              />
              <Button
                mt={3}
                mb={3}
                float="right"
                colorScheme="blue"
                onClick={handlePost}
                isLoading={isLoading}
              >
                Post
              </Button>
            </HStack>
            <Center
              display={
                areObjectsEqual(defaultUser, emptyUser) ? "flex" : "none"
              }
              borderY="1px solid gray"
              py={3}
            >
              <Text textAlign="center" color="orangered">
                You need to check the Home Page first before posting comment
              </Text>
            </Center>
            {comments.map((item, index) => (
              <Box key={index} id="postContent" borderY="1px solid gray">
                <Box display={{ base: "none", md: "block" }} mt={3} mb={4}>
                  <Flex mb={3}>
                    {/* Display commenter's avatar */}
                    <Avatar boxSize="2.4rem" mr={3} name={item.name} />
                    <Flex align="center" justify="left">
                      {/* Display commenter's name and email */}
                      <Text fontWeight="bold" fontSize={14}>
                        {item.name}
                      </Text>
                      <Text fontSize={14}>
                        &nbsp; &#x2022; {item.email.toString()}
                      </Text>
                    </Flex>
                  </Flex>
                  {/* Display comment body */}
                  <Box>
                    <Text>{item.body}</Text>
                  </Box>
                </Box>
                <Box display={{ base: "block", md: "none" }} mt={3} mb={4}>
                  <HStack mb={3}>
                    {/* Display commenter's avatar */}
                    <Avatar boxSize="2.4rem" mr={3} name={item.name} />
                    <Stack align="left" justify="left" spacing={1}>
                      {/* Display commenter's name and email */}
                      <Text fontWeight="bold" fontSize={14}>
                        {item.name}
                      </Text>
                      <Text fontSize={14}>{item.email.toString()}</Text>
                    </Stack>
                  </HStack>
                  {/* Display comment body */}
                  <Box>
                    <Text>{item.body}</Text>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Go back to top button */}
          {comments.length > 0 && (
            <Center cursor="pointer" mt={5} onClick={scrollToTop}>
              <Text>Go back up</Text>
            </Center>
          )}

          {/* Display message when no comments are found */}
          {comments.length < 1 && (
            <Center
              display={
                areObjectsEqual(defaultUser, emptyUser) ? "none" : "flex"
              }
              borderY="1px solid gray"
              py={3}
            >
              <Text>No comment was found</Text>
            </Center>
          )}
        </SimpleGrid>
      )}
      {/* Display loading spinner when data is being fetched */}
      {isLoading && (
        <Flex justify="center" align="center">
          <Spinner color="white" />
        </Flex>
      )}
    </>
  );
};
export default CommentPage;
