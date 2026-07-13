import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

function showError(err) {
  const root = document.getElementById("root");
  root.innerHTML = `<div style="padding:24px;font-family:monospace;white-space:pre-wrap;color:#a00;background:#fff;">
    <h2>Something broke:</h2>
    <p>${(err && err.message) || err}</p>
    <pre>${(err && err.stack) || ""}</pre>
  </div>`;
}

window.addEventListener("error", (e) => showError(e.error || e.message));
window.addEventListener("unhandledrejection", (e) => showError(e.reason));

try {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (err) {
  showError(err);
}
