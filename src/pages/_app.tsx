import theme from "@/styles/themes";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider, createTheme } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={createTheme()}>
      <ChakraProvider theme={theme}>
        <RecoilRoot>
          <Head>
            <title>Blog App by Faith&#95;L3S5</title>
          </Head>
          <Component {...pageProps} />
        </RecoilRoot>
      </ChakraProvider>
    </ThemeProvider>
  );
}
