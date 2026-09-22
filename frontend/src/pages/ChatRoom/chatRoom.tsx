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

const ChatRoom: React.FC = () => {
  const router = useIonRouter();
  interface Message {
    message: string;
    timestamp: string;
  }
  const baseUrl = import.meta.env.VITE_API_URL;
  const { friendId } = useParams<{ friendId: string }>();
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
      const result = await fetch(
        `http://localhost:5000/getAllmessages/${friendId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await result.json();
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

  const sendMessage = async () => {
    const token = localStorage.getItem("token");
    console.log(chatMessage);
    try {
      const result = await fetch("http://localhost:5000/postMessage", {
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

  return (
    <IonPage>
      <IonHeader>
        <IonItem>
          <IonButton onClick={relocateHome}>
            <IonIcon icon={chevronBackOutline} />
          </IonButton>

          <IonImg src={avatar} />
          <div>
            <div>Julien Addy</div>
            <div>Active Now</div>
          </div>
          <IonIcon src={callOutline} />
          <IonIcon src={videocamOutline} />
          <IonIcon src={informationCircleOutline} />
        </IonItem>
      </IonHeader>
      <IonContent>
        <div>
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <IonItem key={index}>
                {message.message}{" "}
                {new Date(message.timestamp).toLocaleTimeString()}
              </IonItem>
            ))
          ) : (
            <div>No messages availabe. Start a message with Doku</div>
          )}
        </div>
      </IonContent>

      <IonFooter>
        <IonItem>
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
      </IonFooter>
    </IonPage>
  );
};
export default ChatRoom;
