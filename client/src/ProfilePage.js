import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const ProfilePage = ({ currentUser }) => {
  //const data = this.props;
  const user = currentUser;
  const [plans, setPlans] = useState(null);
  const [spots, setSpots] = useState(null);

  useEffect(() => {
    fetch("/user/plans")
      .then((res) => res.json())
      .then((json) => {
        console.log(json, "GET /user/plans");
        setPlans(json);
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    fetch("/user/fishingspots")
      .then((res) => res.json())
      .then((json) => {
        console.log(json, "GET /user/fishingspots");
        setSpots(json);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <Wrapper>
      {user ? (
        <div>
          <BasicInfoDiv>
            <div>username: {user.username}</div>
            <div>user id: {user._id}</div>
            <div>user email: {user.email}</div>
          </BasicInfoDiv>

          <div>
            Fishing Plans Submitted:
            <ul>
              {plans &&
                plans.map((plan) => {
                  const planDetailPath = `/plans/${plan._id}`;
                  return (
                    <PlanLi>
                      <h4>{plan.title}</h4>
                      <p>Description: {plan.description}</p>
                      <p>Participants Number: {plan.people} people</p>
                      <p>
                        Current Participants Number:
                        {plan.participants.length}
                      </p>
                      <Link to={planDetailPath}>
                        <button>Detail</button>
                      </Link>
                    </PlanLi>
                  );
                })}
            </ul>
          </div>

          <div>
            Fishing Spots Submitted:
            <ul>
              {spots &&
                spots.map((spot) => {
                  const path = `/spots/${spot._id}`;
                  return (
                    <SpotLi>
                      <h4 key={spot.title}>{spot.title}</h4>
                      <p key={spot.location}>{spot.location}</p>
                      <p key={spot.description}>{spot.description}</p>

                      <Link to={path}>
                        <button>Detail</button>
                      </Link>
                    </SpotLi>
                  );
                })}
            </ul>
          </div>
        </div>
      ) : (
        <div> No User Logged In</div>
      )}
    </Wrapper>
  );
};

const PlanLi = styled.li`
  border: lightgray 4px solid;
  margin: 25px 0;
  padding: 10px;
`;
const SpotLi = styled.li`
  border: lightgray 4px solid;
  margin: 25px 0;
  padding: 10px;
  color: darkblue;
`;
const BasicInfoDiv = styled.div`
  font-size: x-large;
  font-weight: bold;
  margin: 25px 0;
  padding: 10px;
`;
const Wrapper = styled.div`
  font-family: monospace;
`;
