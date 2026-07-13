import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import ProfileForm from "./ProfileForm";
import Dashboard from "./Dashboard";
import { colors } from "./theme";

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = loading, null = signed out
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveError, setSaveError] = useState(false);

  // Track auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Load profile + logs whenever the user changes
  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      setLogs({});
      return;
    }
    (async () => {
      setLoadingData(true);
      const userId = session.user.id;

      const { data: profileRow } = await supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle();
      setProfile(profileRow);

      const { data: logRows } = await supabase.from("period_logs").select("*").eq("user_id", userId);
      const logsByDate = {};
      (logRows || []).forEach((row) => {
        logsByDate[row.log_date] = {
          mood: row.mood,
          cramps: row.cramps,
          cravings: row.cravings,
          tiredness: row.tiredness,
          heaviness: row.heaviness,
          color: row.color,
        };
      });
      setLogs(logsByDate);
      setLoadingData(false);
    })();
  }, [session]);

  async function handleProfileSave(p) {
    setSavingProfile(true);
    const userId = session.user.id;
    const { data, error } = await supabase.from("profiles").upsert({ user_id: userId, ...p }).select().maybeSingle();
    setSavingProfile(false);
    if (error) {
      setSaveError(true);
      return;
    }
    setSaveError(false);
    setProfile(data);
    setEditingProfile(false);
  }

  async function handleDaySave(dateKey, entry) {
    const userId = session.user.id;
    const { error } = await supabase.from("period_logs").upsert(
      { user_id: userId, log_date: dateKey, ...entry },
      { onConflict: "user_id,log_date" }
    );
    if (error) {
      setSaveError(true);
      return;
    }
    setSaveError(false);
    setLogs((prev) => ({ ...prev, [dateKey]: entry }));
  }

  async function handleDayRemove(dateKey) {
    const userId = session.user.id;
    const { error } = await supabase.from("period_logs").delete().eq("user_id", userId).eq("log_date", dateKey);
    if (error) {
      setSaveError(true);
      return;
    }
    setSaveError(false);
    setLogs((prev) => {
      const next = { ...prev };
      delete next[dateKey];
      return next;
    });
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  if (session === undefined || (session && loadingData)) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}>
        <p style={{ color: colors.muted }}>Loading…</p>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  if (!profile || editingProfile) {
    return (
      <ProfileForm
        initial={profile}
        showCancel={!!profile}
        saving={savingProfile}
        onCancel={() => setEditingProfile(false)}
        onSave={handleProfileSave}
      />
    );
  }

  return (
    <Dashboard
      profile={profile}
      logs={logs}
      onEditProfile={() => setEditingProfile(true)}
      onDaySave={handleDaySave}
      onDayRemove={handleDayRemove}
      onSignOut={handleSignOut}
      saveError={saveError}
    />
  );
}
