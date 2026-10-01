import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Login from "./pages/Login/Login";
import "@ionic/react/css/core.css";
import "./theme/variables.css";
import Signup from "./pages/Signup/Signup";
import ChatHome from "./pages/ChatHome/chatHome";
import ChatRoom from "./pages/ChatRoom/chatRoom";
import FindFriend from "./pages/ChatHome/FindFriend/findFriend";
import { initPushNotifications } from "./services/fcm/fcm";
import { useEffect } from "react";
setupIonicReact();
const App: React.FC = () => {
  useEffect(() => {
    initPushNotifications();
  }, []);
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/loginUser">
            <Login />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/chatHome">
            <ChatHome />
          </Route>
          <Route exact path="/chatHome/findFriend">
            <FindFriend />
          </Route>
          <Route exact path="/chatRoom/:friendId">
            <ChatRoom />{" "}
          </Route>
          <Route exact path="/">
            <Redirect to="/loginUser" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
