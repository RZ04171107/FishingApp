import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const PlanList = () => {
  const [plans, setPlans] = useState(null);

  useEffect(() => {
    fetch("/plans")
      .then((res) => res.json())
      .then((json) => {
        //console.log(json, "data");
        setPlans(json);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <Wrapper>
      Here lists the fishing plans
      <ul>
        {plans &&
          plans.map((plan) => {
            const planDetailPath = `/plans/${plan._id}`;
            return (
              <PlanLi>
                <h3>{plan.title}</h3>
                <p>Description: {plan.description}</p>
                <p>Participants Number: {plan.people} people</p>
                <p>
                  Current Participants Number:
                  {plan.participants.length}
                </p>
                <Link to={planDetailPath}>
                  <button>View Detail</button>
                </Link>
              </PlanLi>
            );
          })}
      </ul>
    </Wrapper>
  );
};

const PlanLi = styled.li`
  border: lightgray 4px solid;
  margin: 25px 0;
  padding: 10px;
`;
const Wrapper = styled.div`
  font-family: monospace;
`;

export default PlanList;
