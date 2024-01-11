import Layout from "@/components/Layout/Layout";
import UsersPage from "@/components/UsersPage/UsersPage";
import { useEffect, useRef } from "react";

export default function Users() {
  // Create a ref for the middle box to be used in scrolling
  const middleBoxRef = useRef<HTMLDivElement | null>(null);

  // Function to scroll to the top of the middle box
  const scrollToTop = () => {
    if (middleBoxRef.current) {
      middleBoxRef.current.scrollTop = 0;
    }
  };

  // Attach a scroll event listener to the middle box on component mount
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

    // Clean up the event listener when the component unmounts
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, []); // Empty dependency array ensures the effect runs only on mount and unmount

  // Render the component with Layout and UsersPage components
  return (
    <>
      <Layout middleBoxRef={middleBoxRef}>
        <UsersPage scrollToTop={scrollToTop} />
      </Layout>
    </>
  );
}
