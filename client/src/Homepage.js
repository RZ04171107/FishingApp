import React from "react";
import styled from "styled-components";

const Homepage = () => {
  return (
    <Wrapper>
      <h4>Hello, I am Ingrid, author of this FishingApp</h4>
      <hr />
      <h5>Ready for some outdoor activities and bad CSS?</h5>
      <hr />
      <p>Let's go!</p>
      <Img src="https://i.pinimg.com/originals/cb/d0/ce/cbd0ce10299a622e86f2bd3da0cd16fd.jpg" />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 80vh;
  font-family: monospace;
`;
const Img = styled.img`
  border-radius: 10px;
  margin: 20px 0;
`;
export default Homepage;
