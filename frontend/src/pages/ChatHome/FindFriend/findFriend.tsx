import {
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  useIonRouter,
  IonButton,
  IonIcon,
  IonImg,
  IonLabel,
} from "@ionic/react";
import { chevronBackOutline, construct } from "ionicons/icons";
import avatar from "../../../images/avatar.png";
import React, { useEffect, useState } from "react";

const FindFriend: React.FC = () => {
  const [newUseradded, setnewUseradded] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const router = useIonRouter();
  const [addedUsers, setAddedUsers] = useState<string[]>([]);
  const relocateHome = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/chatHome", "back");
  };
  interface User {
    user_id: string;
    user__first_name: string;
    user__last_name: string;
  }
  useEffect(() => {
    const getExistingusers = async () => {
      try {
        const token = localStorage.getItem("token");
        const result = await fetch("http://localhost:5000/findallUsers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!result.ok) {
          throw new Error(`Request failed with status ${result.status}`);
        }

        const all_addable_users = await result.json();
        console.log(all_addable_users.users);
        setUsers(all_addable_users.users);
      } catch (error) {
        console.log(error);
      }
    };

    getExistingusers();
  }, []);

  const handleAdd = async (userId: string) => {
    setAddedUsers((prev) => [...prev, userId]);
    try {
      const token = localStorage.getItem("token");
      const result = await fetch("http://localhost:5000/createConnection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: userId }),
      });
      if (!result.ok) {
        throw new Error(`Request failed with status ${result.status}`);
      }
      console.log(
        "Go to homescreen and start a chat with user with Id",
        userId
      );
    } catch (error) {
      console.log(error);
    }
  };
  const message_added_user = (userId: string) => {
    console.log("I want to message a user with ID ", userId);
    router.push(`/chatRoom/${userId}`, "forward");
  };
  // const ready_to_chat = async (userId: string) => {
  //   console.log(
  //     "Create connection with this pparticular user with id ",
  //     userId
  //   );
  //   try {
  //     const result = await fetch("http:localhost:5000/createConnection", {
  //       method: "POST",
  //       body: userId,
  //     });
  //     if (!result.ok) {
  //       throw new Error(`Request failed with status ${result.status}`);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   router.push("/chatRoom", "forward", "replace");
  // };

  return (
    <IonPage>
      <IonHeader>
        <IonItem>
          <IonButton onClick={relocateHome}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>

          <IonInput placeholder="Search a new friend here" />
        </IonItem>{" "}
      </IonHeader>
      <IonContent>
        <div style={{ paddingTop: "20px" }}>
          {users.length > 0 ? (
            users.map((user) => {
              return (
                <IonItem
                  lines="none"
                  key={user.user_id}
                  className="chat-list-item"
                >
                  <IonImg src={avatar} className="chat-avatar" slot="start" />

                  <div>
                    {user.user__first_name} {user.user__last_name}
                  </div>

                  <div slot="end">
                    {addedUsers.includes(user.user_id) ? (
                      <IonButton
                        onClick={() => {
                          message_added_user(user.user_id);
                        }}
                      >
                        Message
                      </IonButton>
                    ) : (
                      <IonButton
                        onClick={() => {
                          handleAdd(user.user_id);
                          // console.log(user.user_id);
                          // setnewUseradded(true);
                        }}
                      >
                        Add friend
                      </IonButton>
                    )}
                    {/* {newUseradded == false ? (
                      <IonButton
                        onClick={() => {
                          // console.log(user.user_id);
                          // setnewUseradded(true);
                          handleAdd(user.user_id);
                        }}
                      >
                        Add friend
                      </IonButton>
                    ) : (
                      <IonButton>Message</IonButton>
                    )} */}
                  </div>
                </IonItem>
              );
            })
          ) : (
            <div
              style={{ textAlign: "center", padding: "20px", color: "gray" }}
            >
              No users found
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};
export default FindFriend;
