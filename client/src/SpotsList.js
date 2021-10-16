import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCurrentUser, useUpdateUser } from "./CurrentUserContext";
import styled from "styled-components";

const SpotsList = () => {
  const [spots, setSpots] = useState(null);
  const { updateUser } = useUpdateUser();

  useEffect(() => {
    fetch("/fishingspots")
      .then((res) => res.json())
      .then((json) => {
        //console.log(json);
        setSpots(json);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <Wrapper>
      <h2>Here shows the fishing spot list:</h2>

      {spots &&
        spots.map((spot) => {
          const path = `/spots/${spot._id}`;
          return (
            <SpotDiv>
              <LeftDiv>
                <Img src={spot.image} key={spot.image} />
              </LeftDiv>

              <RightDiv>
                <div>
                  <h5 key={spot.title}>{spot.title}</h5>
                  <p key={spot.description}>{spot.description}</p>
                  <p>
                    <small key={spot.location}>{spot.location}</small>
                  </p>

                  <Link to={path}>
                    <button>View {spot.title}</button>
                  </Link>
                </div>
              </RightDiv>
            </SpotDiv>
          );
        })}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  font-family: monospace;
`;
const SpotDiv = styled.div`
  border: lightgray 4px solid;
  margin: 25px 0;
  padding: 10px;
  display: flex;
`;
const LeftDiv = styled.div`
  margin: 0 30px 0 0;
`;
const RightDiv = styled.div`
  padding: 20px;
`;
const Img = styled.img`
  max-height: 300px;
  max-width: 500px;
  border-radius: 8px;
`;
export default SpotsList;
