import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonPage,
  IonItem,
  IonIcon,
  IonInput,
  IonImg,
  IonLabel,
  useIonRouter,
} from "@ionic/react";
import { personAddOutline, search, settingsOutline } from "ionicons/icons";
import avatar from "../../images/avatar.png";
import "./chatHome.css";
import React, { useEffect, useState } from "react";

// const ChatHome: React.FC = () => {
//   const router = useIonRouter();
//   const token = localStorage.getItem("token");
//   const baseUrl = import.meta.env.VITE_API_URL;
//   const [friendsArray, setfriendsArray] = useState<friend[]>([]);

//   // interface friend {
//   //   id: string;
//   //   firstName: string;
//   //   lastName: string;
//   // }
//   interface friend {
//     user_id: string;
//     user__first_name: string;
//     user__last_name: string;
//   }
//   useEffect(() => {
//     const getAllfriends = async () => {
//       try {
//         const result = await fetch(
//           `${baseUrl}/getAllconnectedfriends`,
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (!result.ok) {
//           console.error("Failed to fetch friends:", result.status);
//         }
//         const data = await result.json();
//         setfriendsArray(data.message);
//         console.log(data);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     getAllfriends();
//   }, []);
//   const navigateChatscreen = (friendId: string) => {
//     console.log("Navigating you to chat screen");
//     console.log(friendId);
//     router.push(`chatRoom/${friendId}`, "forward");
//   };

//   return (
//     <IonPage>
//       <IonContent className="main-page">
//         <IonItem lines="none">
//           <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
//             <div
//               style={{
//                 background: "#0084FF",
//                 width: "10px",
//                 height: "10px",
//                 borderRadius: "5px",
//               }}
//             ></div>
//             <div
//               style={{
//                 fontSize: "24px",
//                 color: "#111827",
//                 fontWeight: "bolder",
//               }}
//             >
//               Vernel Chat
//             </div>
//           </div>{" "}
//           {/* <IonIcon slot="end" icon={personAddOutline} /> */}
//           <IonRouterLink slot="end" routerLink="chatHome/findFriend">
//             Find friend
//           </IonRouterLink>
//         </IonItem>
//         <IonItem lines="none">
//           <IonIcon icon={search} />
//           <IonInput placeholder="Search Chat" />
//         </IonItem>
//         <div className="messages-block">
//           {friendsArray.length > 0 ? (
//             friendsArray.map((friend) => {
//               return (
//                 <IonItem
//                   lines="none"
//                   key={friend.user_id}
//                   onClick={() => {
//                     navigateChatscreen(friend.user_id);
//                   }}
//                   className="chat-list-item"
//                 >
//                   <IonImg src={avatar} className="chat-avatar" slot="start" />
//                   <div className="online-dot"></div>

//                   <IonLabel className="chat-text">
//                     <h5 className="chat-name">
//                       {friend.user__first_name} {friend.user__last_name}
//                     </h5>
//                     {/* <p>Let's meet tommorow </p> */}
//                   </IonLabel>

//                   <div className="chat-meta" slot="end">
//                     <p className="chat-time">2m</p>
//                     <div className="chat-badge" style={{ fontSize: "10px" }}>
//                       3
//                     </div>
//                   </div>
//                 </IonItem>
//               );
//             })
//           ) : (
//             <div
//               style={{ textAlign: "center", padding: "20px", color: "gray" }}
//             >
//               Go to Find friend page to add a new user
//             </div>
//           )}
//         </div>
//       </IonContent>
//     </IonPage>
//   );
// };

// export default ChatHome;

const ChatHome: React.FC = () => {
  const router = useIonRouter();
  const token = localStorage.getItem("token");
  const [friendsArray, setfriendsArray] = useState<friend[]>([]);
  const [searchText, setSearchText] = useState("");
  const baseUrl = import.meta.env.VITE_API_URL;
  // interface friend {
  //   id: string;
  //   firstName: string;
  //   lastName: string;
  // }
  interface friend {
    user_id: string;
    user__first_name: string;
    user__last_name: string;
    unread_count: number;
  }
  useEffect(() => {
    const getAllfriends = async () => {
      try {
        const result = await fetch(`${baseUrl}/getAllconnectedfriends`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        // Expired token, or one signed by a different server -> log in again
        if (result.status === 401 || result.status === 403) {
          localStorage.removeItem("token");
          router.push("/loginUser", "root", "replace");
          return;
        }
        if (!result.ok) {
          console.error("Failed to fetch friends:", result.status);
          return;
        }
        const data = await result.json();
        setfriendsArray(data.message ?? []);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllfriends();
  }, []);
  const navigateChatscreen = (friendId: string) => {
    console.log("Navigating you to chat screen");
    console.log(friendId);
    router.push(`chatRoom/${friendId}`, "forward");
  };

  const query = searchText.trim().toLowerCase();
  const visibleFriends = friendsArray.filter((friend) =>
    `${friend.user__first_name} ${friend.user__last_name}`
      .toLowerCase()
      .includes(query)
  );

  return (
    <IonPage>
      <IonHeader className="ion-no-border home-header">
        <IonToolbar className="home-toolbar">
          <div className="home-title-row">
            <div className="home-brand">
              <span className="home-brand-dot" />
              <h1 className="home-title">Vernel Chat</h1>
            </div>
            <div className="home-actions">
              <button
                className="find-friend-btn"
                onClick={() => router.push("/chatHome/findFriend", "forward")}
              >
                <IonIcon icon={personAddOutline} />
                <span>Find friend</span>
              </button>
              <button
                className="icon-btn"
                aria-label="Settings"
                onClick={() => router.push("/settings", "forward")}
              >
                <IonIcon icon={settingsOutline} />
              </button>
            </div>
          </div>
          <div className="search-bar">
            <IonIcon icon={search} />
            <IonInput
              className="search-friend-input"
              placeholder="Search chats"
              value={searchText}
              onIonInput={(e) => setSearchText(e.detail.value ?? "")}
              clearInput
            />
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="main-page">
        <div className="messages-block">
          {friendsArray.length > 0 && visibleFriends.length === 0 ? (
            <div className="empty-state">No chats match "{searchText}"</div>
          ) : friendsArray.length > 0 ? (
            visibleFriends.map((friend) => {
              return (
                <IonItem
                  lines="none"
                  key={friend.user_id}
                  onClick={() => {
                    navigateChatscreen(friend.user_id);
                  }}
                  className="chat-list-item"
                >
                  <IonImg src={avatar} className="chat-avatar" slot="start" />
                  <div className="online-dot"></div>

                  <IonLabel className="chat-text">
                    <h5 className="chat-name">
                      {friend.user__first_name} {friend.user__last_name}
                    </h5>
                    {/* <p>Let's meet tommorow </p> */}
                  </IonLabel>

                  <div className="chat-meta" slot="end">
                    <p className="chat-time">2m</p>
                    {friend.unread_count > 0 ? (
                      <div className="chat-badge" style={{ fontSize: "10px" }}>
                        {friend.unread_count}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </IonItem>
              );
            })
          ) : (
            <div className="empty-state">
              Tap Find friend to start a new chat
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ChatHome;
