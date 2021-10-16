import React, { useEffect, useState, useHistory } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const AdminFS = () => {
  const [spots, setSpots] = useState(null);

  useEffect(() => {
    fetch("/fishingspots")
      .then((res) => res.json())
      .then((json) => {
        console.log(json, "admin fs data");
        setSpots(json);
      })
      .catch((e) => console.log(e));
  }, []);

  const deleteFishingspotFunc = (fs_id) => {
    //alert(`delete fs ${fs_id}`);
    fetch(`/admin/fs/${fs_id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.text())
      .then((text) => console.log(text))
      .catch((e) => console.log(e));

    window.location.reload();
  };

  return (
    <Wrapper>
      <h3>Admin Fishingspot Page</h3>
      <ul>
        {spots &&
          spots.map((spot) => {
            const fsDetailPath = `/spots/${spot._id}`;
            const fsEditPath = `/spots/edit/${spot._id}`;
            return (
              <SpotLi>
                <h4>Title: {spot.title}</h4>
                <p>Location: {spot.location}</p>
                <p>
                  Lng:{spot.geometry.coordinates[0]} | Lat:
                  {spot.geometry.coordinates[1]}
                </p>
                <p>Author ID:{spot.author}</p>
                <p>Description: {spot.description}</p>
                <p>Max {spot.people} people</p>
                <Link to={fsDetailPath}>
                  <button>Detail</button>
                </Link>
                <Link to={fsEditPath}>
                  <button>Edit</button>
                </Link>
                <DeleteBtn
                  onClick={() => {
                    deleteFishingspotFunc(spot._id);
                  }}
                >
                  Delete
                </DeleteBtn>
              </SpotLi>
            );
          })}
      </ul>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  font-family: monospace;
`;
const DeleteBtn = styled.button`
  color: red;
`;
const SpotLi = styled.li`
  border: lightgray 5px solid;
  margin: 25px 0;
  padding: 10px;
  color: white;
  background-color: gray;
`;
export default AdminFS;
