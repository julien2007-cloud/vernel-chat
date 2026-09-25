import {
  IonContent,
  IonHeader,
  IonItem,
  IonPage,
  IonIcon,
  IonImg,
  IonFooter,
  IonInput,
  IonButton,
  useIonRouter,
} from "@ionic/react";
import {
  callOutline,
  chevronBackOutline,
  informationCircleOutline,
  videocamOutline,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import avatar from "../../images/avatar.png";
import { useParams } from "react-router";
import "./chatRoom.css";

const ChatRoom: React.FC = () => {
  const router = useIonRouter();
  interface Message {
    message: string;
    timestamp: string;
    sender_id: string;
  }
  interface Connection_user_name {
    id: string;
    user__first_name: string;
    user__last_name: string;
  }
  const baseUrl = import.meta.env.VITE_API_URL;
  const { friendId } = useParams<{ friendId: string }>();
  const [friendName, setfriendName] = useState<Connection_user_name[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatMessage, setChatmessage] = useState<string>("");
  const token = localStorage.getItem("token");
  useEffect(() => {
    const token = localStorage.getItem("token");

    const getMessages = async () => {
      try {
        const result = await fetch(`${baseUrl}/getAllmessages/${friendId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await result.json();

        setfriendName(data.connection_name);
        if (data.messages.length == 0) {
          console.log("No messages availables");
        } else {
          console.log("There are messages");
          setMessages(data.messages);
        }
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [friendId]);


  const getMessages = async () => {
    try {
      const result = await fetch(`${baseUrl}/getAllmessages/${friendId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await result.json();

      if (data.messages.length == 0) {
        console.log("No messages availables");
      } else {
        console.log("There are messages");
        console.log(messages);
        setMessages(data.messages);
        setfriendName(data.connection_name);
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };


  const sendMessage = async () => {
    const token = localStorage.getItem("token");
    console.log(chatMessage);
    try {
      const result = await fetch(`${baseUrl}/postMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipientId: friendId, message: chatMessage }),
      });
      if (!result.ok) {
        throw new Error(`Request failed with status ${result.status}`);
      }
      const data = await result.json();
      setChatmessage(data.messages);
      getMessages();
    } catch (error) {
      console.log(error);
    }
  };



  const relocateHome = () => {
    console.log("Sending you back to the home page");
    router.push("/chatHome", "back", "pop");
  };

  
  const formatMessageTime = (timestamp: string) => {
    const messageDate = new Date(timestamp);
    const now = new Date();

    const isToday = messageDate.toDateString() === now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();

    const time = messageDate.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    if (isToday) return time;
    if (isYesterday) return `Yesterday, ${time}`;

    const dateStr = messageDate.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
    return `${dateStr}, ${time}`;
  };
  return (
    <IonPage>
      <IonContent>
        <IonItem className="header-bar">
          <IonButton onClick={relocateHome}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>

          <IonImg src={avatar} />
          <div>
            <div>
              {friendName.length > 0 ? (
                <div>
                  {friendName[0].user__first_name}{" "}
                  {friendName[0].user__last_name}
                </div>
              ) : (
                <div>No messages availabe. Start a message with Doku</div>
              )}
            </div>
            <div>Active Now</div>
          </div>
          <IonIcon src={callOutline} />
          <IonIcon src={videocamOutline} />
          <IonIcon src={informationCircleOutline} />
        </IonItem>

        <div className="chat-area">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div id={message.sender_id} key={index}>
                {message.sender_id == friendId ? (
                  <>
                    <IonItem className="friend-message">
                      {" "}
                      <div>{message.message} </div>
                    </IonItem>
                    <div className="msg-time">
                      {formatMessageTime(message.timestamp)}
                    </div>
                  </>
                ) : (
                  <>
                    <IonItem className="user-message">
                      <div>{message.message}</div>
                    </IonItem>
                    <div className="msg-time">
                      {formatMessageTime(message.timestamp)}
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <div>
              <div>
                {friendName.length > 0 ? (
                  <div>
                    Start a conversation with {friendName[0].user__first_name}{" "}
                    {friendName[0].user__last_name}
                  </div>
                ) : (
                  <div>No messages availabe. Start a message with Doku</div>
                )}
              </div>
            </div>
          )}
        </div>
      </IonContent>

      <IonItem className="input-area">
        <IonInput
          placeholder="Type message here"
          value={chatMessage}
          onIonInput={(e) => {
            setChatmessage(e.detail.value ?? "");
          }}
        />

        <IonButton
          onClick={() => {
            sendMessage();
          }}
        >
          Send
        </IonButton>
      </IonItem>
    </IonPage>
  );
};
export default ChatRoom;
