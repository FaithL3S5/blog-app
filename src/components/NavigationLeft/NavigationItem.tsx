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
    <>
      {/* Map through menuIcons and render link for each menu item */}
      {menuIcons.map((item, index) => (
        <React.Fragment key={index}>
          {/* Icon link */}
          <ChakraLink
            display="block"
            key={"menuIcon-" + index}
            as={Link}
            href={item.href}
          >
            {/* Icon */}
            <Flex align="center" justify="right" height="60px" pt={2}>
              {item.icon &&
                React.createElement(item.icon, { fontSize: "large" })}
            </Flex>
          </ChakraLink>

          {/* Text link */}
          <ChakraLink
            display="block"
            key={"menuText-" + index}
            as={Link}
            href={item.href}
          >
            {/* Text */}
            <Flex height="60px" align="center">
              <Text fontWeight={checkCurrentPath(item.href, item.text)}>
                {item.text}
              </Text>
            </Flex>
          </ChakraLink>
        </React.Fragment>
      ))}
    </>
  );
};
export default NavigationItem;
