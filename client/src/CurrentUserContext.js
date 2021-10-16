import React, { useContext } from "react";

const CurrentUserContext = React.createContext();
const UpdateUserContext = React.createContext();

//create a custom hook: useCurrentUser & useUpdateUser, then those hooks can be used in different components
export const useCurrentUser = () => {
  return useContext(CurrentUserContext);
};
export const useUpdateUser = () => {
  return useContext(UpdateUserContext);
};

export const CurrentUserProvider = ({ children }) => {
  //user will not update synchronously inside fetch by calling setUser, and loginFunc, logoutFunc, registerFunc should be used as onClick function, which means loginFunc, logoutFunc, registerFunc cannot be put inside useEffect hook. I donot know how to use useState hook for this situation, so here I just use a variable:user

  let user = null;

  //TODO: add some function here, for example, some func that can get the current logged in user
  const updateUser = (current) => {
    user = current;
  };

  const getAuth = () => {
    fetch("/getauth")
      .then((res) => res.json())
      .then((json) => {
        console.log("getAuth:", json);
      })
      .catch((e) => console.log(e));
  };

  //TODO: Maybe need multiple functions:
  const loginFunc = (state) => {
    fetch("/user/login", {
      method: "POST",
      body: JSON.stringify(state),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        } else {
          return res.json();
        }
      })
      .then((data) => {
        console.log("login res data:", data);
        updateUser(data.currentUser);
        console.log("LOGIN FROM CURRENTUSERCONTEXT.JS, currentuser", user);
      });
  };

  const logoutFunc = () => {
    fetch("/user/logout", {
      method: "POST",
      body: JSON.stringify(),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          //history.push("/error");
          throw new Error(res.status);
        } else {
          return res.json();
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((e) => console.log(e));

    //TODO: current user should set back to null
    updateUser(null);
    console.log("LOGOUT FUNC FROM CURRENTUSERCONTEXT.JS, current:", user);
  };

  const registerFunc = (state) => {
    fetch("/user/register", {
      method: "POST",
      body: JSON.stringify(state),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          //history.push("/error");
          throw new Error(res.status);
        }
        return res.json();
      })
      .then((data) => {
        console.log("register res data:", data);
        updateUser(data.currentUser);
        console.log("REGISTER FROM CURRENTUSERCONTEXT.JS, currentuser", user);
      });
  };

  return (
    <CurrentUserContext.Provider>
      <UpdateUserContext.Provider
        value={{ updateUser, logoutFunc, loginFunc, registerFunc, getAuth }}
      >
        {children}
      </UpdateUserContext.Provider>
    </CurrentUserContext.Provider>
  );
};
