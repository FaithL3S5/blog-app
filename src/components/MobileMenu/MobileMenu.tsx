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
  onOpen: () => void;
  firstField: React.MutableRefObject<HTMLInputElement | null>;
  menuIcons: MenuIcons[];
};

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onOpen,
  onClose,
  firstField,
  menuIcons,
}) => {
  const router = useRouter();

  const checkCurrentPath = (href: string, text: string) => {
    const regex = new RegExp("posts", "i");

    const pathName = router.asPath.replace(/[^a-zA-Z]/g, "");

    const localHref = href.replace(/[^a-zA-Z]/g, "");

    if (pathName === localHref) {
      return "bold";
    }

    if (text === "Users Posts" && regex.test(pathName)) {
      return "bold";
    }

    return "medium";
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
        <DrawerHeader borderBottomWidth="1px">Main menu</DrawerHeader>

        <DrawerBody>
          <Stack fontSize={20} fontWeight="bold">
            {menuIcons.map((item, index) => (
              <ChakraLink
                display="block"
                key={index}
                as={Link}
                href={item.href}
              >
                <HStack>
                  <Flex align="center" justify="right" height="60px">
                    <Box pt={2}>
                      {item.icon &&
                        React.createElement(item.icon, { fontSize: "large" })}
                    </Box>
                  </Flex>
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
