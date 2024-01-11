import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider, createTheme } from "@mui/material";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={createTheme()}>
      <ChakraProvider>
        <Head>
          <title>Blog App by Faith&#95;L3S5</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/images/icons/favicon.png" />
        </Head>
        <Component {...pageProps} />
      </ChakraProvider>
    </ThemeProvider>
  );
}
