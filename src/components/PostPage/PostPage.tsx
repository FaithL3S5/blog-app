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
} from "@chakra-ui/react";
import CommentIcon from "@mui/icons-material/Comment";
import { Pagination } from "@mui/material";
import Link from "next/link";
import React, { MouseEventHandler, useEffect, useState } from "react";

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

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    if (currentPage === value) return;

    setIsLoading(true);
    setCurrentPage(value);
    // Add logic here to fetch and display data for the new page
    getPosts(value)
      .then((data) => {
        setListedPost(data);
        setIsLoading(false);
      })
      .catch((error: any) => console.error(error));
  };

  useEffect(() => {
    getPosts(1)
      .then((data) => {
        setListedPost(data);
        setIsLoading(false);
      })
      .catch((error: any) => console.error(error));
  }, []);

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    const { name, value } = event.target;

    setFormToSend((prevFormUser) => ({
      ...prevFormUser,
      [name]: value,
    }));
  };

  const handlePost: MouseEventHandler<HTMLButtonElement> = (event) => {
    setIsLoading(true);

    let emptyFields = [];

    if (!formToSend.title) emptyFields.push("title");
    if (!formToSend.body) emptyFields.push("body");

    if (emptyFields.length > 0) return;

    createPost(defaultUser.id, formToSend)
      .then(() => {
        setFormToSend({
          user: defaultUser.id,
          title: "",
          body: "",
        });
        getPosts(1)
          .then((data) => {
            setListedPost(data);
            setIsLoading(false);
          })
          .catch((error: any) => console.error(error));
      })
      .catch((error: any) => console.error(error));
  };

  return (
    <SimpleGrid columns={1} fontSize={16}>
      <Box borderBottom="1px solid gray">
        <Flex>
          <Avatar boxSize="2.4rem" mr={3} name={defaultUser.name} />
          <VStack flex="1">
            <Input
              variant="outline"
              borderColor="gray"
              name="title"
              type="text"
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Your awesome title"
              _placeholder={{ color: "gray" }}
            />
            <Textarea
              variant="outline"
              borderColor="gray"
              name="body"
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Share something to the world..."
              _placeholder={{ color: "gray" }}
            />
          </VStack>
        </Flex>
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
      <Box id="postContainer" overflowY="auto">
        {isLoading && (
          <Flex justify="center" mt={3} align="center">
            <Spinner color="white" />
          </Flex>
        )}
        {!isLoading &&
          listedPost.map((item, index, array) => {
            return (
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
            );
          })}
        {listedPost.length > 0 && (
          <>
            <Card bgColor="white" align="center" justify="center">
              <CardBody>
                <Pagination
                  count={134}
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
        {!isLoading && listedPost.length < 1 && (
          <Center mt={5}>
            <Text>No post was found</Text>
          </Center>
        )}
      </Box>
    </SimpleGrid>
  );
};
export default PostPage;
