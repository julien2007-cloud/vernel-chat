import {
  IonInput,
  useIonRouter,
  IonPage,
  IonContent,
  IonItem,
  IonButton,
} from "@ionic/react";
import logo from "../../images/logo-bubble.png";
import { IonRouterLink } from "@ionic/react";
import "./Login.css";
import { useState } from "react";

// const Login: React.FC = () => {
//   const router = useIonRouter();
//   const [password, setPassword] = useState("");
//   const [email, setEmail] = useState("");
//   const baseUrl = import.meta.env.VITE_API_URL;
//   const loginCompleted = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     try {
//       const new_user_object = {
//         email: email,
//         password: password,
//       };
//       const push_new_user_result = await fetch(`${baseUrl}/loginUser`, {
//         method: "POST",
//         body: JSON.stringify(new_user_object),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       if (!push_new_user_result.ok) {
//         throw new Error(
//           `Request failed with status ${push_new_user_result.status}`
//         );
//       }
//       const json = await push_new_user_result.json();
//       console.log("Login completed", json);
//       localStorage.setItem("token", json.token);
//       router.push("/chatHome", "forward", "replace");
//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return (
//     <IonPage className="loginPage">
//       <IonContent>
//         <div className="main-container">
//           <img src={logo} alt="Logo" />
//           <p>Login to continue chatting</p>
//           <IonItem lines="none">
//             <div className="fieldBox-others">
//               <div style={{ fontSize: "13px", fontWeight: "300" }}>
//                 EMAIL ADDRESS
//               </div>
//               <IonInput
//                 placeholder="name@example.com"
//                 className="signup-input"
//                 value={email}
//                 onIonInput={(e) => {
//                   setEmail(e.detail.value ?? "");
//                 }}
//               />
//             </div>
//           </IonItem>
//           <IonItem lines="none">
//             {" "}
//             <div className="fieldBox-others">
//               <div style={{ fontSize: "13px", fontWeight: "300" }}>
//                 PASSWORD
//               </div>
//               <IonInput
//                 placeholder="At least 8 characters"
//                 className="signup-input"
//                 value={password}
//                 onIonInput={(e) => {
//                   setPassword(e.detail.value ?? "");
//                 }}
//               />
//             </div>
//           </IonItem>
//           <IonRouterLink> forgot password?</IonRouterLink>
//           <IonButton onClick={loginCompleted}>Login</IonButton>
//           <IonItem lines="none">
//             <p>New to Vernel? </p>{" "}
//             <IonRouterLink routerLink="/signup"> signup</IonRouterLink>
//           </IonItem>
//         </div>
//       </IonContent>
//     </IonPage>
//   );
// };

// export default Login;

const Login: React.FC = () => {
  const router = useIonRouter();
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token != null) {
  //     console.log(token);
  //     router.push("/chatHome", "forward", "push");
  //   } else {
  //     console.log("The user has to login");
  //   }
  // }, []);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const baseUrl = import.meta.env.VITE_API_URL;
  const loginCompleted = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const new_user_object = {
        email: email,
        password: password,
      };
      const push_new_user_result = await fetch(`${baseUrl}/loginUser`, {
        method: "POST",
        body: JSON.stringify(new_user_object),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!push_new_user_result.ok) {
        throw new Error(
          `Request failed with status ${push_new_user_result.status}`
        );
      }
      const json = await push_new_user_result.json();
      console.log("Login completed", json);
      localStorage.setItem("token", json.token);
      router.push("/chatHome", "forward", "replace");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <IonPage className="loginPage">
      <IonContent>
        <div className="main-container">
          <img src={logo} alt="Logo" />
          <h1>Welcome back</h1>
          <p>Login to continue chatting</p>
          <IonItem lines="none">
            <div className="fieldBox-others">
              <div style={{ fontSize: "13px", fontWeight: "300" }}>
                EMAIL ADDRESS
              </div>
              <IonInput
                placeholder="name@example.com"
                className="signup-input"
                value={email}
                onIonInput={(e) => {
                  setEmail(e.detail.value ?? "");
                }}
              />
            </div>
          </IonItem>
          <IonItem lines="none">
            {" "}
            <div className="fieldBox-others">
              <div style={{ fontSize: "13px", fontWeight: "300" }}>
                PASSWORD
              </div>
              <IonInput
                placeholder="At least 8 characters"
                className="signup-input"
                value={password}
                onIonInput={(e) => {
                  setPassword(e.detail.value ?? "");
                }}
              />
            </div>
          </IonItem>
          <IonRouterLink> forgot password?</IonRouterLink>
          <IonButton onClick={loginCompleted}>Login</IonButton>
          <IonItem lines="none">
            <p>New to Vernel? </p>{" "}
            <IonRouterLink routerLink="/signup"> signup</IonRouterLink>
          </IonItem>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
