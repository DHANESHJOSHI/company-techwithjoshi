import React from 'react'
import Marquee from "react-fast-marquee";
import { useCMS } from '@/hooks/useCMS';

function Partnar4() {
  const { data: cmsAbout } = useCMS("about");
  const alliesText = cmsAbout?.trustedAlliesText || "We collaborate with more than 10+ Trusted Allies";

  return (
    <div className="home4-trusted-client-area sec-mar">
    <p>{alliesText}</p>
    <div className="marque-wrap">
      <div className="marquee_text">
        <Marquee>

        
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-01.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-02.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-03.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-04.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-05.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-01.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-02.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-03.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-04.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-05.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-01.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-02.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-03.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-04.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-05.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-01.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-02.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-03.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-04.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-05.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-01.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-02.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-03.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-04.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-05.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-01.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-02.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-03.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-04.svg" alt="" />
        </div>
        <div className="single-client">
          <img className="img-fluid" src="assets/img/home-4/client-05.svg" alt="" />
        </div>
        </Marquee>
      </div>
    </div>
  </div>
  )
}

export default Partnar4
