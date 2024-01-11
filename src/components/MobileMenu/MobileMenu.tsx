import {
  Box,
  Link as ChakraLink,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type MenuIcons = {
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  text: string;
  href: string;
};

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  menuIcons: MenuIcons[];
};

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  menuIcons,
}) => {
  // Next.js router instance
  const router = useRouter();

  // Function to determine the font weight of the menu item based on the current path
  const checkCurrentPath = (href: string, text: string) => {
    const regex = new RegExp("posts", "i");

    // Extract alphabetic characters from the current path
    const pathName = router.asPath.replace(/[^a-zA-Z]/g, "");

    // Extract alphabetic characters from the menu item's href
    const localHref = href.replace(/[^a-zA-Z]/g, "");

    // Check if the current path matches the menu item's href or contains "posts" (special case)
    if (pathName === localHref) {
      return "bold";
    }

    if (text === "Users Posts" && regex.test(pathName)) {
      return "bold";
    }

    return "medium";
  };

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        {/* Drawer header */}
        <DrawerHeader borderBottomWidth="1px">Main menu</DrawerHeader>

        {/* Drawer body containing the menu items */}
        <DrawerBody>
          {/* Stack to hold menu items */}
          <Stack fontSize={20} fontWeight="bold">
            {menuIcons.map((item, index) => (
              // Chakra UI link component with Next.js Link and menu item styling
              <ChakraLink
                display="block"
                key={index}
                as={Link}
                href={item.href}
              >
                <HStack>
                  {/* Icon */}
                  <Flex align="center" justify="right" height="60px">
                    <Box pt={2}>
                      {item.icon &&
                        React.createElement(item.icon, { fontSize: "large" })}
                    </Box>
                  </Flex>
                  {/* Text */}
                  <Flex key={`text` + index} height="60px" align="center">
                    <Text fontWeight={checkCurrentPath(item.href, item.text)}>
                      {item.text}
                    </Text>
                  </Flex>
                </HStack>
              </ChakraLink>
            ))}
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
export default MobileMenu;
