import React, { useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";

const initialState = {
  title: "",
  description: "",
  people: "",
};

const NewPlan = ({ currentUser }) => {
  const { _id } = useParams(); //_id is for the fishingspot
  const user = currentUser;
  const [spot, setSpot] = useState(null);

  const [state, setState] = useState(initialState);
  let history = useHistory();

  const handleChange = (evt) => {
    setState({ ...state, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    console.log("STATE: ", state);

    //TODO: change to post fishingspots/:id/plans/new
    fetch(`/fishingspots/${_id}/plans/new`, {
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

    history.push("/plans");
    window.location.reload();
  };

  useEffect(() => {
    console.log("in newplan, fishingspot id:", _id);
    console.log("In newplan.js,  current user:", user);
    console.log("In newplan.js, fishingspot:", spot);
  }, []);

  // useEffect(() => {
  //   fetch(`/fishingspots/${_id}`)
  //     .then((res) => res.json())
  //     .then((json) => {
  //       //console.log(json);
  //       setSpot(json);
  //     })
  //     .catch((e) => console.log(e));
  // }, []);

  return (
    <div>
      Create a new fishing plan
      <form onSubmit={handleSubmit}>
        <div>
          <label>Fishing Plan Title: </label>
          <input
            name="title"
            type="text"
            value={state.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Participants:</label>
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

        <button>Submit Fishing Plan</button>
      </form>
    </div>
  );
};

export default NewPlan;
