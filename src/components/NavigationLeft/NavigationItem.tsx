import { Link as ChakraLink, Flex, Text } from "@chakra-ui/react";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

type MenuIcon = {
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  text: string;
  href: string;
};

type NavigationItemProps = {
  menuIcons: MenuIcon[];
};

const NavigationItem: React.FC<NavigationItemProps> = ({ menuIcons }) => {
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
    <>
      {menuIcons.map((item, index) => (
        <>
          <ChakraLink
            display="block"
            key={"menuIcon-" + index}
            as={Link}
            href={item.href}
          >
            <Flex align="center" justify="right" height="60px" pt={2}>
              {item.icon &&
                React.createElement(item.icon, { fontSize: "large" })}
            </Flex>
          </ChakraLink>
          <ChakraLink
            display="block"
            key={"menuText-" + index}
            as={Link}
            href={item.href}
          >
            <Flex height="60px" align="center">
              <Text fontWeight={checkCurrentPath(item.href, item.text)}>
                {item.text}
              </Text>
            </Flex>
          </ChakraLink>
        </>
      ))}
    </>
  );
};
export default NavigationItem;
