// pages/payment.js
import { useState, useEffect } from "react";

export default function Payment() {
  const [iframeUrl, setIframeUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const startPayment = async () => {
    setLoading(true);
    const res = await fetch("/api/paymob", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 1999 }),
    });
    const data = await res.json();
    const url = `https://accept.paymob.com/api/acceptance/iframes/YOUR_IFRAME_ID?payment_token=${data.payment_key}`;
    setIframeUrl(url);
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      {/* Animated neon grid background */}
      <canvas id="neonGrid" style={styles.canvas}></canvas>

      <div style={styles.card}>
        <div style={styles.companyName}>EDUSTARHUB</div>
        <h1 style={styles.title}>⚡ TechPay Checkout</h1>
        <p style={styles.subtitle}>Secure futuristic payments powered by Paymob</p>

        {!iframeUrl && (
          <>
            <button
              onClick={startPayment}
              style={styles.button}
              disabled={loading}
            >
              {loading ? "Initializing..." : "Pay 19.99 EGP"}
            </button>
            {loading && <div style={styles.spinner}></div>}
          </>
        )}

        {iframeUrl && (
          <div style={styles.iframeContainer}>
            <iframe
              src={iframeUrl}
              style={styles.iframe}
              title="Paymob Checkout"
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
}

// ------------------- STYLES -------------------
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0d0d0d",
    fontFamily: "'Orbitron', sans-serif",
    color: "#00ffff",
    overflow: "hidden",
    position: "relative",
  },

  canvas: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
  },

  card: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "500px",
    background: "rgba(18,18,18,0.85)",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 0 40px rgba(0,255,255,0.3), 0 0 20px rgba(255,0,255,0.1)",
    textAlign: "center",
    border: "2px solid #00ffff",
    animation: "pulse 2s infinite alternate",
  },

  companyName: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#00ffff",
    textShadow: "0 0 8px #00ffff, 0 0 20px #00ffff88",
    marginBottom: "15px",
    letterSpacing: "3px",
  },

  title: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "10px",
    textShadow: "0 0 15px #00ffff, 0 0 30px #00ffff55",
  },

  subtitle: {
    fontSize: "14px",
    marginBottom: "30px",
    color: "#00ffff88",
  },

  button: {
    width: "100%",
    padding: "16px",
    background: "linear-gradient(90deg, #00ffff, #6f00ff)",
    color: "#0d0d0d",
    border: "none",
    borderRadius: "14px",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 0 20px #00ffff88, 0 0 30px #6f00ff55",
    transition: "0.3s all",
    animation: "glow 2s infinite alternate",
  },

  iframeContainer: {
    marginTop: "25px",
    borderRadius: "16px",
    overflow: "hidden",
    border: "2px solid #00ffff",
    boxShadow: "0 0 25px #00ffff44",
    height: "620px",
  },

  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
  },

  spinner: {
    margin: "20px auto",
    width: "36px",
    height: "36px",
    border: "4px solid #00ffff33",
    borderTop: "4px solid #00ffff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

// ------------------- ANIMATIONS -------------------
if (typeof window !== "undefined") {
  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(`
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `);
  styleSheet.insertRule(`
    @keyframes glow {
      0% { box-shadow: 0 0 15px #00ffff88, 0 0 30px #6f00ff55; }
      100% { box-shadow: 0 0 30px #00ffffaa, 0 0 50px #6f00ff88; }
    }
  `);
  styleSheet.insertRule(`
    @keyframes pulse {
      0% { border-color: #00ffff; }
      50% { border-color: #6f00ff; }
      100% { border-color: #00ffff; }
    }
  `);

  // ------------------- NEON GRID CANVAS -------------------
  const canvas = document.getElementById("neonGrid");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const gridSize = 50;
    const lines = [];

    for (let x = 0; x < width; x += gridSize) lines.push({ x, y: 0, speed: Math.random()*0.5+0.2 });
    for (let y = 0; y < height; y += gridSize) lines.push({ x: 0, y, speed: Math.random()*0.5+0.2 });

    function animate() {
      ctx.fillStyle = "rgba(13,13,13,0.2)";
      ctx.fillRect(0,0,width,height);

      ctx.strokeStyle = "#00ffff33";
      ctx.lineWidth = 1;

      lines.forEach(l => {
        if (l.x === 0) { // horizontal
          ctx.beginPath();
          ctx.moveTo(0,l.y);
          ctx.lineTo(width,l.y);
          ctx.stroke();
          l.y += l.speed;
          if (l.y > height) l.y = 0;
        } else { // vertical
          ctx.beginPath();
          ctx.moveTo(l.x,0);
          ctx.lineTo(l.x,height);
          ctx.stroke();
          l.x += l.speed;
          if (l.x > width) l.x = 0;
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  }
}
