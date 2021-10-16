import React, { useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import "./assets/stars.css";

const initialReviewState = {
  body: "",
  rating: "",
};

const SpotDetail = ({ currentUser }) => {
  const [state, setState] = useState(null);
  const { _id } = useParams();
  const editFSPath = `/spots/edit/${_id}`;
  const newplanPath = `/spots/${_id}/newplan`;
  let history = useHistory();
  const [review, setReview] = useState(initialReviewState);

  const user = currentUser;

  const handleChange = (evt) => {
    setReview({ ...review, [evt.target.name]: evt.target.value });
    //console.log(review);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    fetch(`/fishingspots/${_id}/reviews`, {
      method: "POST",
      body: JSON.stringify(review),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.text())
      .then((text) => console.log(text))
      .catch((error) => console.log(error));

    // after sending post request, reload the current page
    window.location.reload();
  };

  useEffect(() => {
    fetch(`/fishingspots/${_id}`)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        setState(json);
      })
      .catch((e) => console.log(e));
  }, []);

  const deleteReviewFunc = (reviewId) => {
    console.log(reviewId);

    fetch(`/fishingspots/${_id}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.text())
      .then((text) => console.log(text))
      .catch((e) => console.log(e));

    // after deleting the review, reload the current page
    window.location.reload();
  };

  const deleteFishingspotFunc = (evt) => {
    evt.preventDefault();

    fetch(`/fishingspots/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.text())
      .then((text) => console.log(text))
      .catch((e) => console.log(e));

    //after deleting the fishing spot, should navigate to SpotList page
    history.push("/spots");
    window.location.reload();
  };

  return (
    <Wrapper>
      {state && (
        <Row>
          <Column>
            <div>
              <Img src={state.image} className="card-img-top" alt="..." />
              <h5>{state.title}</h5>
              <p>{state.description}</p>
              <p>{state.location}</p>
              <p>Submitted by {state.author.username}</p>
              <p>
                Max {state.people} can fish together at {state.title}
              </p>
              {
                //add authorization: only shows when currentUser is the author of the fishingspot,
                user && state.author._id === user._id && (
                  <>
                    <Link to={editFSPath}>
                      <Button>Edit Fishingspot</Button>
                    </Link>
                    <Button onClick={deleteFishingspotFunc}>
                      Delete Fishingspot
                    </Button>
                  </>
                )
              }
              {
                //only login user can create new fishing plan:
                user && (
                  <Link to={newplanPath}>
                    <Button>Create FishingPlan</Button>
                  </Link>
                )
              }
            </div>
          </Column>

          <Column>
            {user && (
              <ReviewForm>
                <h3>Leave a review</h3>
                <div>
                  <label>Rating</label>
                  <input
                    className="form-range"
                    name="rating"
                    type="range"
                    min="1"
                    max="5"
                    value={review.rating}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>Review</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="body"
                    type="text"
                    value={review.body}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div>
                  <Button onClick={handleSubmit}>Submit</Button>
                </div>
              </ReviewForm>
            )}

            <div>
              {state.reviews.map((review) => {
                return (
                  <ReviewCard>
                    <div>
                      <h5 key={review.author.username}>
                        {review.author.username}
                      </h5>
                      <p
                        className="starability-result"
                        key={review.rating}
                        data-rating={review.rating}
                      >
                        Rating:{review.rating}
                      </p>
                      <p key={review.body}>Review:{review.body}</p>
                    </div>
                    {user && review.author._id === user._id && (
                      <Button onClick={() => deleteReviewFunc(review._id)}>
                        Delete
                      </Button>
                    )}
                  </ReviewCard>
                );
              })}
            </div>
          </Column>
        </Row>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  font-family: monospace;
`;
const Img = styled.img`
  max-width: 40vw;
  border-radius: 10px;
`;
const Row = styled.div`
  display: flex;
`;
const Column = styled.div`
  //flex: 50%auto;
  padding: 10px;
  margin: 10px;
  max-width: 40vw;
`;
const ReviewForm = styled.form`
  padding: 10px;
  margin: 0 0 0 50px;
`;
const ReviewCard = styled.div`
  margin: 10px 0 10px 50px;
  padding: 10px;
`;

const Button = styled.button`
  margin: 5px;
`;
export default SpotDetail;
