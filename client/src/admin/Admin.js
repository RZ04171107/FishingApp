import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Admin = ({ currentUser }) => {
  return (
    <Wrapper>
      <h3>Hello Ingrid, welcome back!</h3>
      <ul>
        <Li>
          <Link to="/admin/fs">Fishing Spot</Link>
        </Li>
        <Li>
          <Link to="/admin/plan">Fishing plan</Link>
        </Li>
        <Li>
          <Link to="/admin/user">User</Link>
        </Li>
      </ul>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  font-family: monospace;
  min-height: 80vh;
  background-color: lightgray;
  color: white;
  margin: 0 0 30px 0;
  padding: 20px;
`;
const Li = styled.li`
  margin-top: 20px;
  text-decoration: none;
  font-size: 20px;
`;
export default Admin;
