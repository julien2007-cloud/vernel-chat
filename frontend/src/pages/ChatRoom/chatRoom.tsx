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
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import {
  callOutline,
  chevronBackOutline,
  informationCircleOutline,
  videocamOutline,
} from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const contentRef = useRef<HTMLIonContentElement>(null);
  const hasScrolled = useRef(false);

  // Always show the newest message: jump to the bottom when the chat opens,
  // then scroll smoothly when new messages arrive
  useEffect(() => {
    if (messages.length === 0) return;
    const duration = hasScrolled.current ? 300 : 0;
    hasScrolled.current = true;
    requestAnimationFrame(() => contentRef.current?.scrollToBottom(duration));
  }, [messages]);

  useEffect(() => {
    hasScrolled.current = false;
    setLoading(true);
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
      } finally {
        setLoading(false);
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

  // text lets the "Say hi" chips send a message without typing
  const sendMessage = async (text: string = chatMessage) => {
    const token = localStorage.getItem("token");
    console.log(text);
    if (!text.trim()) return;
    try {
      const result = await fetch(`${baseUrl}/postMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipientId: friendId, message: text.trim() }),
      });
      if (!result.ok) {
        throw new Error(`Request failed with status ${result.status}`);
      }
      await result.json();
      setChatmessage("");
      getMessages();

      // const result_data = await fetch(
      //   `${baseUrl}/outstandingMessages/${friendId}`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );
      // if (!result.ok) {
      
      //   throw new Error(`Request failed with status ${result.status}`);
      // }
      // const result_data_outstanding = await result_data.json();
      // console.log(result_data_outstanding);
      console.log("Data saved to outstanding DB");
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
      <IonHeader className="ion-no-border">
        <IonToolbar className="chat-toolbar">
        <IonItem className="header-bar" lines="none">
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
                <div>&nbsp;</div>
              )}
            </div>
            <div>Active Now</div>
          </div>
          <IonIcon src={callOutline} />
          <IonIcon src={videocamOutline} />
          <IonIcon src={informationCircleOutline} />
        </IonItem>
        </IonToolbar>
      </IonHeader>

      <IonContent ref={contentRef} className="chat-content">
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
          ) : loading ? null : (() => {
            const raw = friendName[0]?.user__first_name ?? "";
            const firstName = raw ? raw[0].toUpperCase() + raw.slice(1) : "";
            return (
            <div className="chat-empty">
              <IonImg src={avatar} className="chat-empty-avatar" />
              <div className="chat-empty-name">
                {friendName[0]?.user__first_name} {friendName[0]?.user__last_name}
              </div>
              <div className="chat-empty-sub">You're connected on Vernel Chat</div>
              <div className="chat-empty-hint">
                Say hi to {firstName || "your friend"} to start the conversation
              </div>
              <div className="chat-empty-chips">
                {[
                  "👋 Hi!",
                  `Hey ${firstName || "there"}!`,
                  "How are you?",
                ].map((starter) => (
                  <button
                    key={starter}
                    className="chat-empty-chip"
                    onClick={() => sendMessage(starter)}
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
            );
          })()}
        </div>
      </IonContent>

      <IonFooter className="ion-no-border chat-footer">
      <IonItem className="input-area" lines="none">
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
