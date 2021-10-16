import React from "react";
import { Link } from "react-router-dom";
import { useUpdateUser } from "../CurrentUserContext";
import styled from "styled-components";
import "./Navbar.css";

const Navbar = ({ currentUser }) => {
  const { logoutFunc } = useUpdateUser();

  const user = currentUser;

  const handleLogout = (evt) => {
    evt.preventDefault();
    logoutFunc();
    window.location.reload();
  };

  return (
    <div className="topnav">
      <a href="#">FishingApp</a>
      <a href="/">Home</a>
      <a href="/spots">Fishing Spots</a>
      <a href="/plans">Fishing Plans</a>
      <a href="/map">Map</a>
      {user && <a href="/newspot">New Fishing Spot</a>}

      {user ? (
        <>
          <a onClick={handleLogout}>Logout</a>

          <a href="/profile">Hello, {user.username}</a>
          {user.isAdmin && <a href="/admin">Admin</a>}
        </>
      ) : (
        <>
          <a href="/register">Register</a>
          <a href="/login">Login</a>
        </>
      )}
    </div>
  );
};

export default Navbar;
