import {
  IonPage,
  IonContent,
  IonInput,
  IonItem,
  IonButton,
  IonRouterLink,
  useIonRouter,
  IonLabel,
} from "@ionic/react";
import "./Signup.css";
import { useState } from "react";
const Signup: React.FC = () => {
  const router = useIonRouter();

  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmedPassword, setConfirmedpassword] = useState("");
  const [isSame, setIssame] = useState(false);
  const [misMatch, setMismatch] = useState(false);
  const signupCompleted = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (confirmedPassword == password) {
          const new_user_object = {
            firstname: firstName,
            lastname: lastName,
            email: email,
            password: password,
          };
          const push_new_user_result = await fetch(
            "http://localhost:5000/addUser",
            {
              method: "POST",
              body: JSON.stringify(new_user_object),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (!push_new_user_result.ok) {
            throw new Error(
              `Request failed with status ${push_new_user_result.status}`
            );
          } 
        const json = await push_new_user_result.json();
        console.log("Sign up completed", json);
        localStorage.setItem("token",json.token)
        router.push("/chatHome", "forward", "replace");
      } else {
        setMismatch(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <IonPage>
      <IonContent>
        <div className="main-container">
          <div
            style={{
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            Create account
          </div>
          <div style={{ fontSize: "14px", fontWeight: "300" }}>
            Join vernel today. It takes less that a minute
          </div>
          <IonItem lines="none">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div className="fieldBox">
                <div style={{ fontSize: "13px", fontWeight: "300" }}>
                  FIRST NAME
                </div>
                <IonInput
                  placeholder="Julien"
                  className="signup-input"
                  value={firstName}
                  onIonInput={(e) => {
                    setFirstname(e.detail.value ?? "");
                  }}
                />
              </div>
              <div className="fieldBox">
                <div style={{ fontSize: "13px", fontWeight: "300" }}>
                  LAST NAME{" "}
                </div>
                <IonInput
                  value={lastName}
                  onIonInput={(e) => {
                    setLastname(e.detail.value ?? "");
                  }}
                  placeholder="Addy"
                  className="signup-input"
                />
              </div>
            </div>
          </IonItem>
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

          <IonItem lines="none">
            <div className="fieldBox-others">
              <div style={{ fontSize: "13px", fontWeight: "300" }}>
                CONFIRM PASSWORD
              </div>
              <div>{isSame ? <div>Passwords don't match</div> : null}</div>
              <IonInput
                placeholder="Repeat your password"
                className="signup-input"
                value={confirmedPassword}
                onIonInput={(e) => {
                  setConfirmedpassword(e.detail.value ?? "");
                  if (e.detail.value !== password) {
                    setIssame(true);
                  } else {
                    setIssame(false);
                  }
                }}
              />
            </div>
          </IonItem>

          <IonButton onClick={signupCompleted}>Sign Up</IonButton>
          <div>
            {misMatch ? <div>Your passwords still don't match</div> : null}
          </div>
          <p>Already have an account?</p>
          <IonRouterLink routerLink="/Login">Log In</IonRouterLink>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
