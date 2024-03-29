import Layout from "@/components/Layout/Layout";
import PostPage from "@/components/PostPage/PostPage";
import { getUsers } from "@/reusables/ApiCall";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { defaultUserState } from "@/atoms/DefaultUserAtom";
import { useToast } from "@chakra-ui/react";

export default function Home() {
  // chakra ui toast
  const toast = useToast();

  // State to store the default user information
  const [defaultUser, setDefaultUser] = useRecoilState(defaultUserState);

  // Create a ref for the middle box to be used in scrolling
  const middleBoxRef = useRef<HTMLDivElement | null>(null);

  // Function to scroll to the top of the middle box
  const scrollToTop = () => {
    if (middleBoxRef.current) {
      middleBoxRef.current.scrollTop = 0;
    }
  };

  // Attach a scroll event listener to the middle box and fetch default user on component mount
  useEffect(() => {
    // Get the current reference to the middle box
    const currentRef = middleBoxRef.current;

    // Define the scroll event handler
    const handleScroll = () => {
      // You can add additional logic here if you want to show/hide the scroll-to-top button based on scroll position
      // For now, we're just showing it when scrolling
    };

    // Add the event listener to the middle box
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }

    // Fetch the default user when the component mounts
    getUsers(1)
      .then((data) => {
        setDefaultUser(data[0]);
        localStorage.setItem("defaultUser", JSON.stringify(data[0]));
      })
      .catch((error: any) => {
        toast({
          title: "An error occurred when sending the request",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        console.error(error);
      });

    // Clean up the event listener and any other cleanup logic when the component unmounts
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
    // eslint-disable-next-line
  }, []); // Empty dependency array ensures the effect runs only on mount and unmount

  // Render the component with Layout and PostPage components
  return (
    <>
      <Layout middleBoxRef={middleBoxRef}>
        <PostPage scrollToTop={scrollToTop} defaultUser={defaultUser} />
      </Layout>
    </>
  );
}
