import Layout from "@/components/Layout/Layout";
import PostPage from "@/components/PostPage/PostPage";
import { getUsers } from "@/reusables/ApiCall";
import { useEffect, useRef, useState } from "react";

type DefaultUser = {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
};

export default function Home() {
  // default user (always logged in)
  const [defaultUser, setDefaultUser] = useState<DefaultUser>({
    id: 0,
    name: "",
    email: "",
    gender: "",
    status: "",
  });

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

    getUsers(1)
      .then((data) => setDefaultUser(data[0]))
      .catch((error: any) => console.error(error));

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
        <PostPage scrollToTop={scrollToTop} defaultUser={defaultUser} />
      </Layout>
    </>
  );
}
