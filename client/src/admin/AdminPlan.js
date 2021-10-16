import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const AdminPlan = ({ currentUser }) => {
  const [plans, setPlans] = useState(null);
  const [email, setEmail] = useState(null);

  const handleChange = (evt) => {
    setEmail(evt.target.value);
  };

  useEffect(() => {
    fetch("/plans")
      .then((res) => res.json())
      .then((json) => {
        console.log(json, "admin plan data");
        setPlans(json);
      })
      .catch((e) => console.log(e));
  }, []);

  const deletePlanFunc = (plan_id) => {
    //alert(`going to DELETE fishing plan ${plan_id}`);
    fetch(`/admin/plan/${plan_id}`, {
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

  const sendEmailFunc = (participantsList) => {
    //TODO: complete this function!
    //alert(`going to send email to ${participantsList} , email: ${email}`);

    fetch("/admin/sendemail", {
      method: "POST",
      body: JSON.stringify({
        participants: participantsList,
        content: email,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.text())
      .then((text) => console.log(text))
      .catch((error) => console.log(error));
  };

  return (
    <Wrapper>
      <h3>Admin Fishing Plan Page</h3>
      <ul>
        {plans &&
          plans.map((plan) => {
            const planDetailPath = `/plans/${plan._id}`;
            const planEditPath = `/plans/edit/${plan._id}`;
            return (
              <PlanLi>
                <h3>{plan.title}</h3>
                <p>FishingPlanId: {plan._id}</p>
                <p>Description: {plan.description}</p>
                <p>AuthorID: {plan.author}</p>
                <p>Participants Number: {plan.people} people</p>
                <p>
                  Current Participants Number:
                  {plan.participants.length}
                </p>
                <Link to={planDetailPath}>
                  <button>View</button>
                </Link>
                <Link to={planEditPath}>
                  <button>Edit</button>
                </Link>
                <DeleteBtn
                  onClick={() => {
                    deletePlanFunc(plan._id);
                  }}
                >
                  Delete
                </DeleteBtn>
                <div>
                  <form
                    onSubmit={() => {
                      sendEmailFunc(plan.participants);
                    }}
                  >
                    <label>Send Email To Author</label>
                    <textarea
                      rows="3"
                      name="body"
                      type="text"
                      value={email}
                      onChange={handleChange}
                      required
                    ></textarea>

                    <button>Send</button>
                  </form>
                </div>
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
  background-color: gray;
  color: white;
`;
const Wrapper = styled.div`
  font-family: monospace;
`;
const DeleteBtn = styled.button`
  color: red;
`;
export default AdminPlan;
