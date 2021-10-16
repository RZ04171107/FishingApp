import React, { useEffect, useState } from "react";
import styled from "styled-components";

const AdminUser = ({ currentUser }) => {
  const [users, setUsers] = useState(null);
  const user = currentUser;

  useEffect(() => {
    fetch("/admin/user")
      .then((res) => res.json())
      .then((json) => {
        console.log(json, "admin users data");
        setUsers(json);
      })
      .catch((e) => console.log(e));
  }, []);

  const deleteUserFunc = (user_id) => {
    //alert(`goint to delete user ${user_id}`);
    fetch(`/admin/user/${user_id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.text())
      .then((text) => console.log(text))
      .catch((e) => console.log(e));
    //reload the current page after deleting the user
    window.location.reload();
  };

  return (
    <Wrapper>
      <h3>Admin User Page:</h3>
      {user.isAdmin && (
        <ul>
          {users &&
            users.map((user) => {
              return (
                !user.isAdmin && (
                  <InfoLi>
                    <h5>Username: {user.username}</h5>
                    <p>Email: {user.email}</p>
                    <p>UserID: {user._id}</p>
                    <p>FishingSpot Submitted: {user.fishingspots.length}</p>
                    <p>FishingPlan Submitted: {user.plans.length}</p>
                    <DeleteBtn onClick={() => deleteUserFunc(user._id)}>
                      Delete User
                    </DeleteBtn>
                  </InfoLi>
                )
              );
            })}
        </ul>
      )}
    </Wrapper>
  );
};

const InfoLi = styled.li`
  border: lightgray 4px solid;
  margin: 25px 0;
  padding: 10px;
  background-color: gray;
  color: white;
`;
const Wrapper = styled.div`
  font-family: monospace;
`;
const DeleteBtn = styled.button`
  color: red;
`;
export default AdminUser;
