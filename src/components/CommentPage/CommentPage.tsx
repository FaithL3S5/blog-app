import { getComments, getSpecificPost } from "@/reusables/ApiCall";
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
} from "@chakra-ui/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommentIcon from "@mui/icons-material/Comment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

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

type CommentPageProps = {
  scrollToTop: () => void;
};

const CommentPage: React.FC<CommentPageProps> = ({ scrollToTop }) => {
  // State variables to manage component state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<Comments[]>([]);
  const [oriPost, setOriPost] = useState<OriginalPost>({
    id: 0,
    user_id: 0,
    title: "",
    body: "",
  });

  // Next.js router instance
  const router = useRouter();

  useEffect(() => {
    // Fetch data when router is ready
    if (router.isReady) {
      // Extract postId from the URL
      const postId = parseInt(router.asPath.split("/")[2], 10);

      // Fetch the original post
      getSpecificPost(postId)
        .then((data: any) => {
          if (data.message) return;
          setOriPost(data);

          // Fetch comments for the post
          getComments(postId)
            .then((data) => {
              setComments(data);
              setIsLoading(false);
            })
            .catch((error: any) => console.error(error));
        })
        .catch((error: any) => console.error(error));
    }
  }, [router.isReady]);

  return (
    <>
      {/* Navigation link to go back to the post list */}
      <ChakraLink as={Link} href={`/`} _hover={{ textDecoration: "none" }}>
        <HStack position="sticky" py={2} top="0" bg="#1a202c" zIndex="100">
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
            {comments.map((item, index) => (
              <Box key={index} id="postContent" borderBottom="1px solid gray">
                <Box mt={3} mb={4}>
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
            <Center mt={5}>
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
