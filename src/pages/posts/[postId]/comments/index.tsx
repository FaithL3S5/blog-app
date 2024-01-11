import CommentPage from "@/components/CommentPage/CommentPage";
import Layout from "@/components/Layout/Layout";
import { useEffect, useRef } from "react";

export default function Home() {
  const middleBoxRef = useRef<HTMLDivElement | null>(null);

  const scrollToTop = () => {
    if (middleBoxRef.current) {
      middleBoxRef.current.scrollTop = 0;
    }
  };

  // Attach a scroll event listener to the middle box
  useEffect(() => {
    const currentRef = middleBoxRef.current;

    const handleScroll = () => {
      // You can add additional logic here if you want to show/hide the scroll-to-top button based on scroll position
      // For now, we're just showing it when scrolling
    };

    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      // Clean up the event listener when the component unmounts
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <>
      <Layout middleBoxRef={middleBoxRef}>
        <CommentPage scrollToTop={scrollToTop} />
      </Layout>
    </>
  );
}
