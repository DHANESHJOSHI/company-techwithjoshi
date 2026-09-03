import React from "react";
import Footer3 from "../footer/Footer3";
import Header from "../header/Header";
import useBodyClass from "@/hooks/useBodyClass";
import Head from "next/head";

function Layout({ children }) {
  useBodyClass("home-dark2");
  return (
    <>
      <Head>
        <title>
          TechWithJoshi - Enterprise Software Agency &amp; AI Solutions
        </title>
        <meta
          name="description"
          content="TechWithJoshi Enterprise Software Engineering, Artificial Intelligence Solutions, and Scalable Cloud Architectures."
        />
        <link rel="icon" href="/assets/img/sm-logo.svg" />
      </Head>
      <Header />
      {children}
      <Footer3 />
    </>
  );
}

export default Layout;
