import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonPage,
  IonIcon,
  IonImg,
  IonToggle,
  useIonRouter,
  useIonAlert,
} from "@ionic/react";
import {
  arrowBackOutline,
  chevronForwardOutline,
  logOutOutline,
  moonOutline,
  notificationsOutline,
  personOutline,
  sunnyOutline,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import avatar from "../../images/avatar.png";
import { unregisterPushNotifications } from "../../services/fcm/fcm";
import { getTheme, setTheme } from "../../services/theme/theme";
import "./Settings.css";

interface Profile {
  user__first_name: string;
  user__last_name: string;
  user_email: string;
}

const Settings: React.FC = () => {
  const router = useIonRouter();
  const [presentAlert] = useIonAlert();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [darkMode, setDarkMode] = useState(getTheme() === "dark");
  const baseUrl = import.meta.env.VITE_API_URL;

  const toggleDarkMode = (on: boolean) => {
    setDarkMode(on);
    setTheme(on ? "dark" : "light");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const getProfile = async () => {
      try {
        const result = await fetch(`${baseUrl}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!result.ok) return;
        const data = await result.json();
        setProfile(data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getProfile();
  }, []);

  const logout = async () => {
    const token = localStorage.getItem("token");
    if (token) await unregisterPushNotifications(token);
    localStorage.removeItem("token");
    router.push("/loginUser", "root", "replace");
  };

  const confirmLogout = () =>
    presentAlert({
      header: "Log out?",
      message: "You won't get message notifications on this device.",
      buttons: [
        { text: "Cancel", role: "cancel" },
        { text: "Log out", role: "destructive", handler: () => void logout() },
      ],
    });

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="settings-toolbar">
          <div className="settings-title-row">
            <button
              className="settings-back"
              aria-label="Back"
              onClick={() => router.push("/chatHome", "back", "pop")}
            >
              <IonIcon icon={arrowBackOutline} />
            </button>
            <h1 className="settings-title">Settings</h1>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="settings-page">
        <div className="settings-profile">
          <IonImg src={avatar} className="settings-avatar" />
          <div className="settings-profile-text">
            <div className="settings-name">
              {profile
                ? `${profile.user__first_name} ${profile.user__last_name}`
                : "Loading…"}
            </div>
            <div className="settings-email">{profile?.user_email ?? ""}</div>
          </div>
        </div>

        <div className="settings-group">
          <div className="settings-row">
            <IonIcon icon={personOutline} className="settings-row-icon" />
            <div className="settings-row-text">
              <div className="settings-row-title">Account</div>
              <div className="settings-row-sub">{profile?.user_email ?? ""}</div>
            </div>
            <IonIcon icon={chevronForwardOutline} className="settings-chevron" />
          </div>
          <div className="settings-row">
            <IonIcon icon={notificationsOutline} className="settings-row-icon" />
            <div className="settings-row-text">
              <div className="settings-row-title">Notifications</div>
              <div className="settings-row-sub">Message alerts are on</div>
            </div>
            <IonIcon icon={chevronForwardOutline} className="settings-chevron" />
          </div>
        </div>

        <div className="settings-group">
          <div className="settings-section-label">Display</div>
          <div
            className="settings-row settings-tappable"
            onClick={() => toggleDarkMode(!darkMode)}
          >
            <IonIcon
              icon={darkMode ? moonOutline : sunnyOutline}
              className="settings-row-icon"
            />
            <div className="settings-row-text">
              <div className="settings-row-title">Dark mode</div>
              <div className="settings-row-sub">{darkMode ? "On" : "Off"}</div>
            </div>
            <IonToggle
              className="settings-toggle"
              checked={darkMode}
              aria-label="Dark mode"
              onClick={(e) => e.stopPropagation()}
              onIonChange={(e) => toggleDarkMode(e.detail.checked)}
            />
          </div>
        </div>

        <div className="settings-group">
          <button className="settings-row settings-logout" onClick={confirmLogout}>
            <IonIcon icon={logOutOutline} className="settings-row-icon" />
            <div className="settings-row-text">
              <div className="settings-row-title">Log out</div>
            </div>
          </button>
        </div>

        <div className="settings-footer">Vernel Chat</div>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
