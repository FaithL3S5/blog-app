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

// need to use next dynamic to import the twitch embed lib
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
  // Icons needed for the left menu
  const menuIcons = [
    { icon: HomeIcon, text: "Users Posts", href: "/" },
    { icon: Person, text: "Users Mgmt.", href: "/users?" },
  ];

  // Chakra UI disclosure hook for mobile menu
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* Layout structure with three columns */}
      <SimpleGrid columns={{ base: 1, md: 3 }} minChildWidth="250px">
        {/* Left menu */}
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
              {/* Logo */}
              <Image
                boxSize="2.4rem"
                objectFit="cover"
                src="/images/icons/icon-72x72.png"
                alt="Blog App Logo"
              />
            </Flex>
            <Flex height="60px" align="center">
              {/* Blog app name */}
              <Text fontWeight="bold">Faith&apos;s Blog App</Text>
            </Flex>
            {/* Navigation items */}
            <NavigationItem menuIcons={menuIcons} />
          </SimpleGrid>
        </Box>

        {/* Mobile menu for smaller screens */}
        <Flex align="center" display={{ base: "flex", md: "none" }} m={5}>
          <Box>
            <IconButton
              aria-label="Open menu"
              variant="outlined"
              icon={<MenuIcon />}
              onClick={onOpen}
            />
            {/* MobileMenu component */}
            <MobileMenu
              isOpen={isOpen}
              onClose={onClose}
              menuIcons={menuIcons}
            />
          </Box>
          {/* Blog app name for smaller screens */}
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

        {/* Middle menu (Posts) */}
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

        {/* Right menu (Live Now) */}
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
            {/* Live Now section */}
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Live now
            </Text>
            <Box>
              {/* Twitch Embed Video */}
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
