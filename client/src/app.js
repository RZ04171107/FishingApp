import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Homepage from "./Homepage";
import SpotsList from "./SpotsList";
import SpotDetail from "./SpotDetail";
import NewSpot from "./NewSpot";
import EditSpot from "./EditSpot";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import Register from "./Register";
import Login from "./Login";
import Map from "./Map";
import { ProfilePage } from "./ProfilePage";
import NewPlan from "./NewPlan";
import PlanList from "./PlanList";
import PlanDetail from "./PlanDetail";
import EditPlan from "./EditPlan";
import Admin from "./admin/Admin";
import AdminFS from "./admin/AdminFS";
import AdminPlan from "./admin/AdminPlan";
import AdminUser from "./admin/AdminUser";

function App() {
  //const { logoutFunc, getAuth } = useUpdateUser();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/getauth")
      .then((res) => res.json())
      .then((json) => {
        console.log(json, "@@@@ APP @@@@");
        setUser(json.currentUser);
        console.log(user, "@@@@ APP CURRENT USER @@@@");
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <BrowserRouter>
      <Navbar currentUser={user} />
      <div class="container mt-5 ">
        <Switch>
          <Route exact path="/">
            <Homepage />
          </Route>
          <Route exact path="/spots">
            <SpotsList />
          </Route>
          <Route exact path="/plans">
            <PlanList />
          </Route>
          <Route exact path="/plans/:_id">
            <PlanDetail currentUser={user} />
          </Route>
          <Route exact path="/plans/edit/:_id">
            <EditPlan currentUser={user} />
          </Route>
          <Route exact path="/spots/:_id">
            <SpotDetail currentUser={user} />
          </Route>
          <Route exact path="/spots/edit/:_id">
            <EditSpot currentUser={user} />
          </Route>
          <Route exact path="/spots/:_id/newplan">
            <NewPlan currentUser={user} />
          </Route>
          <Route exact path="/newspot">
            <NewSpot />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/profile">
            <ProfilePage currentUser={user} />
          </Route>
          <Route exact path="/map">
            <Map />
          </Route>
          <Route exact path="/admin">
            <Admin currentUser={user} />
          </Route>
          <Route exact path="/admin/user">
            <AdminUser currentUser={user} />
          </Route>
          <Route exact path="/admin/fs">
            <AdminFS currentUser={user} />
          </Route>
          <Route exact path="/admin/plan">
            <AdminPlan currentUser={user} />
          </Route>
        </Switch>
      </div>
      <Footer />
    </BrowserRouter>
  );
}
export default App;
