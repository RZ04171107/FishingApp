import React from "react";
import styled from "styled-components";

const Footer = () => {
  return (
    <div>
      <FooterGray>
        <Div>
          <span>&copy; FishingApp - Ingrid </span>
          <a href="https://github.com/RZ04171107">GitHub</a>
        </Div>
      </FooterGray>
    </div>
  );
};
const FooterGray = styled.footer`
  position: relative;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: rgb(85, 85, 85);
  color: white;
  text-align: center;
`;

const Div = styled.div`
  font-size: 20px;
  padding: 15px;
  font-family: monospace;
`;

export default Footer;
