import React, { useState, useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import styled from "styled-components";
const initialState = {
  title: "",
  description: "",
  people: "",
};

const EditPlan = ({ currentUser }) => {
  const { _id } = useParams();
  const [state, setState] = useState(initialState);
  const planDetailPath = `/plans/${_id}`;
  let history = useHistory();
  const user = currentUser;

  const handleChange = (evt) => {
    setState({ ...state, [evt.target.name]: evt.target.value });
  };

  useEffect(() => {
    fetch(`/plans/${_id}`)
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
      fetch(`/admin/plan/edit/${_id}`, {
        method: "PUT",
        body: JSON.stringify(state),
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => res.text())
        .then((text) => console.log(text))
        .catch((error) => console.log(error));
      history.push("/admin/plan");
    } else {
      fetch(`/plans/edit/${_id}`, {
        method: "PUT",
        body: JSON.stringify(state),
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => res.text())
        .then((text) => console.log(text))
        .catch((error) => console.log(error));
      history.push(planDetailPath);
    }
    window.location.reload();
  };

  return (
    <Wrapper>
      <h3>Edit plan page:</h3>
      {user && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title</label>
            <input
              name="title"
              type="text"
              value={state.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Participants Number</label>
            <input
              name="people"
              type="number"
              value={state.people}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              name="description"
              type="text"
              value={state.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div>
            {user.isAdmin === true ? (
              <AdminBtn>Update </AdminBtn>
            ) : (
              <button>Update FishingPlan</button>
            )}
          </div>
        </form>
      )}
    </Wrapper>
  );
};

const AdminBtn = styled.button`
  background-color: gray;
  color: white;
  font-size: 20px;
  margin: 10px;
`;
const Wrapper = styled.div`
  font-family: monospace;
  font-size: 18px;
  margin: 20px;
  padding: 20px;
`;

export default EditPlan;
