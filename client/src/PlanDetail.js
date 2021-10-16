import React, { useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import styled from "styled-components";

const PlanDetail = ({ currentUser }) => {
  const { _id } = useParams();
  const [plan, setPlan] = useState(null);
  const user = currentUser;
  let history = useHistory();
  const editFishingPlanPath = `/plans/edit/${_id}`;

  useEffect(() => {
    fetch(`/plans/${_id}`)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setPlan(json);
      })
      .catch((e) => console.log(e));
  }, []);

  const deleteFlanFunc = (evt) => {
    evt.preventDefault();
    fetch(`/plans/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.text())
      .then((text) => console.log(text))
      .catch((e) => console.log(e));
    //after deleting the fishing plan, should navigate to list page
    history.push("/plans");
    window.location.reload();
  };

  const participateFunc = (evt) => {
    evt.preventDefault();
    fetch(`/plans/${_id}/participate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.text())
      .then((data) => {
        console.log(data);
      })
      .catch((e) => console.log(e));

    window.location.reload();
  };

  return (
    <>
      {plan && (
        <Wrapper>
          <BasicDiv>
            <h3>{plan.title}</h3>
            <AuthorDiv>
              <p>
                Submitted by: {plan.author.username}, {plan.author.email}
              </p>
            </AuthorDiv>
            <p>Description: {plan.description}</p>
            <p>Number of Participants:{plan.people}</p>
            <div>
              Current Participants:
              <ul>
                {plan.participants.map((user) => {
                  return <p>{user.username}</p>;
                })}
              </ul>
            </div>
            {user &&
              (user._id === plan.author._id ? (
                <div>
                  <Link to={editFishingPlanPath}>
                    <button>Edit Plan</button>
                  </Link>

                  <button onClick={deleteFlanFunc}>Delete</button>
                </div>
              ) : (
                <div>
                  {plan.people !== plan.participants.length ? (
                    <button onClick={participateFunc}>Participate</button>
                  ) : (
                    <button
                      onClick={() => {
                        alert(
                          `Sorry, no space for activity ${plan.title} currently. `
                        );
                      }}
                    >
                      Sorry No Space
                    </button>
                  )}
                </div>
              ))}
          </BasicDiv>

          <FishingspotDiv>
            <SmallImg src={plan.location.image} />
            <h5>{plan.location.title}</h5>
            <p>{plan.location.description}</p>
            <p>{plan.location.location}</p>
          </FishingspotDiv>
        </Wrapper>
      )}
    </>
  );
};

const AuthorDiv = styled.div`
  color: darkblue;
`;

const FishingspotDiv = styled.div`
  border: lightgray 2px solid;
  margin: 20px;
  padding: 20px;
`;

const BasicDiv = styled.div`
  margin: 20px;
  padding: 20px;
`;

const SmallImg = styled.img`
  max-height: 250px;
  margin-bottom: 20px;
`;

const Wrapper = styled.div`
  display: flex;
  font-family: monospace;
`;

export default PlanDetail;
