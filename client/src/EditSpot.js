import React, { useState, useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import styled from "styled-components";
const initialState = {
  title: "",
  location: "",
  image: "",
  description: "",
  people: "",
};

const EditSpot = ({ currentUser }) => {
  const { _id } = useParams();
  const [state, setState] = useState(initialState);
  const detailPath = `/spots/${_id}`;
  let history = useHistory();
  const user = currentUser;

  const handleChange = (evt) => {
    setState({ ...state, [evt.target.name]: evt.target.value });
  };

  useEffect(() => {
    fetch(`/fishingspots/${_id}`)
      .then((res) => res.json())
      .then((json) => {
        setState(json);
        console.log(json);
      })
      .catch((e) => console.log(e));
  }, []);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (user.isAdmin) {
      fetch(`/admin/fs/edit/${_id}`, {
        method: "PUT",
        body: JSON.stringify(state),
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => res.text())
        .then((text) => console.log(text))
        .catch((error) => console.log(error));
      history.push("/admin/fs");
    } else {
      fetch(`/fishingspots/edit/${_id}`, {
        method: "PUT",
        body: JSON.stringify(state),
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => res.text())
        .then((text) => console.log(text))
        .catch((error) => console.log(error));
      // after updating the fishing spot, navigate to SpotDetail page
      history.push(detailPath);
    }

    window.location.reload();
  };

  return (
    <Wrapper>
      <h3>Edit Fishingspot</h3>
      {user && (
        <form onSubmit={handleSubmit}>
          <RowDiv>
            <label>Title</label>
            <input
              name="title"
              type="text"
              value={state.title}
              onChange={handleChange}
              required
            />
          </RowDiv>

          <RowDiv>
            <label>Location</label>
            <input
              name="location"
              type="text"
              value={state.location}
              onChange={handleChange}
              required
            />
          </RowDiv>

          <RowDiv>
            <label>Image Url</label>
            <input
              name="image"
              type="text"
              value={state.image}
              onChange={handleChange}
              required
            />
          </RowDiv>

          <RowDiv>
            <label>Max people</label>
            <input
              name="people"
              type="number"
              value={state.people}
              onChange={handleChange}
              required
            />
          </RowDiv>

          <RowDiv>
            <label>Description</label>
            <textarea
              name="description"
              type="text"
              value={state.description}
              onChange={handleChange}
              required
            ></textarea>
          </RowDiv>

          <RowDiv>
            {user.isAdmin === true ? (
              <AdminBtn>Update Fishingspot</AdminBtn>
            ) : (
              <button>Update Fishingspot</button>
            )}
          </RowDiv>
        </form>
      )}
    </Wrapper>
  );
};

const RowDiv = styled.div`
  margin: 20px 0;
`;
const AdminBtn = styled.button`
  background-color: gray;
  color: white;
  font-size: 20px;
  margin: 10px;
`;
const Wrapper = styled.div`
  font-family: monospace;
`;
export default EditSpot;
