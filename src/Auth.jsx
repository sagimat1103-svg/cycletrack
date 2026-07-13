import { useState } from "react";
import { Moon } from "lucide-react";
import { supabase } from "./supabaseClient";
import { colors, card, button, input, col } from "./theme";

export default function Auth() {
  const [mode, setMode] = useState("signin"); // 'signin' | 'signup' | 'reset'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Check your email to confirm your account, then log in.");
        setMode("signin");
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setMessage("Password reset email sent — check your inbox.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Moon size={28} style={{ color: colors.gold }} />
          <h1 style={{ fontFamily: "'Fraunces', serif", color: colors.primaryDark, fontSize: 26, fontWeight: 600, margin: "8px 0 4px" }}>
            Cycle Tracker
          </h1>
          <p style={{ fontSize: 13, color: colors.muted, margin: 0 }}>
            {mode === "signup" ? "Create an account to start tracking" : mode === "reset" ? "Reset your password" : "Log in to your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ ...card, ...col, gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, color: colors.ink, display: "block", marginBottom: 4 }}>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={input} placeholder="you@example.com" />
          </div>

          {mode !== "reset" && (
            <div>
              <label style={{ fontSize: 13, color: colors.ink, display: "block", marginBottom: 4 }}>Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={input}
                placeholder="At least 6 characters"
              />
            </div>
          )}

          {error && <p style={{ color: colors.coral, fontSize: 13, margin: 0 }}>{error}</p>}
          {message && <p style={{ color: colors.sage, fontSize: 13, margin: 0 }}>{message}</p>}

          <button type="submit" disabled={loading} style={{ ...button.primary, opacity: loading ? 0.6 : 1 }}>
            {loading ? "Please wait…" : mode === "signup" ? "Sign up" : mode === "reset" ? "Send reset email" : "Log in"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: colors.muted }}>
          {mode === "signin" && (
            <>
              <button type="button" onClick={() => { setMode("signup"); setError(null); setMessage(null); }} style={{ background: "none", border: "none", color: colors.primary, fontWeight: 600, padding: 0 }}>
                Create an account
              </button>
              <span style={{ margin: "0 8px" }}>·</span>
              <button type="button" onClick={() => { setMode("reset"); setError(null); setMessage(null); }} style={{ background: "none", border: "none", color: colors.inkSoft, padding: 0 }}>
                Forgot password?
              </button>
            </>
          )}
          {mode !== "signin" && (
            <button type="button" onClick={() => { setMode("signin"); setError(null); setMessage(null); }} style={{ background: "none", border: "none", color: colors.primary, fontWeight: 600, padding: 0 }}>
              Back to log in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
