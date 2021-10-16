import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
const initialState = {
  title: "",
  location: "",
  image: "",
  description: "",
  people: "",
};

const NewSpot = () => {
  const [state, setState] = useState(initialState);
  let history = useHistory();

  const handleChange = (evt) => {
    setState({ ...state, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    fetch("/fishingspots/new", {
      method: "POST",
      body: JSON.stringify(state),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((e) => console.log(e));

    history.push("/spots");
    window.location.reload();
  };

  return (
    <Wrapper>
      <div className="row">
        <h1 className="text-center">New Fishingspot</h1>
        <div className="col-6 offset-3">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                className="form-control"
                name="title"
                type="text"
                value={state.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input
                className="form-control"
                name="location"
                type="text"
                value={state.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Image Url</label>
              <input
                className="form-control"
                name="image"
                type="text"
                value={state.image}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Max people</label>
              <input
                className="form-control"
                name="people"
                type="number"
                value={state.people}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                type="text"
                value={state.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <button className="btn btn-success">Add Fishingspot</button>
            </div>
          </form>
        </div>
      </div>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  font-family: monospace;
  margin: 15px;
`;
export default NewSpot;
