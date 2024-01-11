import {
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Person } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import dynamic from "next/dynamic";
import React, { MutableRefObject, ReactNode, useRef } from "react";
import MobileMenu from "../MobileMenu/MobileMenu";
import NavigationItem from "../NavigationLeft/NavigationItem";

const ReactTwitchEmbedVideo = dynamic(
  () => import("react-twitch-embed-video"),
  {
    ssr: false,
  }
);

type LayoutProps = {
  children: ReactNode;
  middleBoxRef?: MutableRefObject<HTMLDivElement | null>;
};

const Layout: React.FC<LayoutProps> = ({ children, middleBoxRef }) => {
  // icons needed for the left menu
  const menuIcons = [
    { icon: HomeIcon, text: "Users Posts", href: "/" },
    { icon: Person, text: "Users Mgmt.", href: "/users?" },
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = useRef<HTMLInputElement | null>(null);

  return (
    // [3, null, 5] has same effect as {sm: 3, md: 5}
    // this is used to separate the columns to 3
    <>
      <SimpleGrid columns={{ base: 1, md: 3 }} minChildWidth="250px">
        {/* left menu */}
        <Box
          display={{ base: "none", md: "block" }}
          height="100vh"
          p="1.6rem 6rem 2rem"
          position="sticky"
          top="0"
          overflowY="auto"
          cursor="default"
          css={{
            scrollbarWidth: "thin",
            scrollbarColor: "#555555 #333333",
          }}
          _webkit-scrollbar={{ width: "8px" }}
          _webkit-scrollbar-thumb={{ backgroundColor: "#555555" }}
        >
          <SimpleGrid columns={2} fontSize={20} spacingX={2}>
            <Flex align="center" justify="right" height="60px">
              <Image
                boxSize="2.4rem"
                objectFit="cover"
                src="/images/icons/icon-72x72.png"
                alt="Blog App Logo"
              />
            </Flex>
            <Flex height="60px" align="center">
              <Text fontWeight="bold">Faith&apos;s Blog App</Text>
            </Flex>
            <NavigationItem menuIcons={menuIcons} />
          </SimpleGrid>
        </Box>
        <Flex align="center" display={{ base: "flex", md: "none" }} m={5}>
          <Box>
            <IconButton
              aria-label="Open menu"
              variant="outlined"
              icon={<MenuIcon />}
              onClick={onOpen}
            />
            <MobileMenu
              isOpen={isOpen}
              onClose={onClose}
              onOpen={onOpen}
              firstField={firstField}
              menuIcons={menuIcons}
            />
          </Box>
          <Flex justify="center" flexGrow={1}>
            <HStack>
              <Image
                boxSize="2.4rem"
                objectFit="cover"
                src="/images/icons/icon-72x72.png"
                alt="Blog App Logo"
              />
              <Text ml={3} fontSize="larger" fontWeight="bold">
                Faith&apos;s Blog App
              </Text>
            </HStack>
          </Flex>
        </Flex>

        {/* middle menu (posts) */}
        <Box
          ref={middleBoxRef}
          height="100vh"
          p="1rem 1rem 2rem"
          borderX={{ base: "none", md: "1px solid gray" }}
          overflowY="auto"
          css={{
            scrollbarWidth: "thin",
            scrollbarColor: "#555555 #333333",
          }}
          _webkit-scrollbar={{ width: "8px" }}
          _webkit-scrollbar-thumb={{ backgroundColor: "#555555" }}
        >
          {children}
        </Box>

        {/* right menu (Live now) */}
        <Box
          display={{ base: "none", md: "block" }}
          height="100vh"
          width="27rem"
          p="2rem 4rem 2rem"
          position="sticky"
          top="0"
          overflowY="auto"
          css={{
            scrollbarWidth: "thin",
            scrollbarColor: "#555555 #333333",
          }}
          _webkit-scrollbar={{ width: "8px" }}
          _webkit-scrollbar-thumb={{ backgroundColor: "#555555" }}
        >
          <Box float="left">
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Live now
            </Text>
            <Box>
              <ReactTwitchEmbedVideo
                width="100%"
                height="500px"
                channel="faith_l3s5"
              />
            </Box>
          </Box>
        </Box>
      </SimpleGrid>
    </>
  );
};
export default Layout;
