import React, { useState } from "react";
import UploadImage from "../components/ImageUpload";
import { useOutletContext } from "react-router-dom";
import { supabase } from "../services/supabaseClient";




function getPredictionTheme(label = "") {
  const text = label.toLowerCase();
  const isNegative =
    text.includes("no tb") ||
    text.includes("no tuberculosis") ||
    text.includes("no cancer") ||
    text.includes("normal") ||
    text.includes("negative");
  const isPositive = text.includes("tb") || text.includes("tuberculosis") || text.includes("positive");

  if (isNegative) {
    return {
      color: "#16A34A",
      soft: "rgba(22,163,74,0.15)",
      border: "rgba(22,163,74,0.25)",
      gradient: "linear-gradient(90deg, #16A34A, #22C55E)",
    };
  }

  if (isPositive) {
    return {
      color: "#DC2626",
      soft: "rgba(220,38,38,0.16)",
      border: "rgba(220,38,38,0.28)",
      gradient: "linear-gradient(90deg, #DC2626, #F97316)",
    };
  }

  return {
    color: "#16A34A",
    soft: "rgba(22,163,74,0.15)",
    border: "rgba(22,163,74,0.25)",
    gradient: "linear-gradient(90deg, #16A34A, #22C55E)",
  };
}

function getPredictionSummary(label = "", confidence) {
  const text = label.toLowerCase();
  const pct = typeof confidence === "number" ? Math.round(confidence * 100) : null;
  const pctText = pct === null ? "" : ` (${pct}% confidence)`;

  const isNegative =
    text.includes("no tb") ||
    text.includes("no tuberculosis") ||
    text.includes("no cancer") ||
    text.includes("normal") ||
    text.includes("negative");
  const isPositive = text.includes("tb") || text.includes("tuberculosis") || text.includes("positive");

  if (isNegative) {
    return `The AI suggests that: this X-ray looks more consistent with normal patterns${pctText}.`;
  }

  if (isPositive) {
    return `The AI suggests that: this X-ray shows patterns consistent with tuberculosis${pctText}.`;
  }

  return `The AI suggests that: this X-ray is closer to "${label}"${pctText}.`;
}

export default function DiagnosisPage() {
  const [statusMessage, setStatusMessage] = useState("");
  const [lastImageUrl, setLastImageUrl] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const predictionTheme = aiResult ? getPredictionTheme(aiResult.label) : null;


  const { session } = useOutletContext() || {};
  const userId = session?.user?.id;


  async function handleUploadComplete(imageUrl, scanId ) {

    setLastImageUrl(imageUrl);
    setStatusMessage("Upload complete. Running AI...");
    setAiResult(null);

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      console.log(res);

      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        setStatusMessage(data.error || "AI request failed");
        return;
      }

      setAiResult(data);
      setStatusMessage("AI result ready.");

      if (scanId) {
  await supabase
    .from("scans")
    .update({
      prediction_label: data.label,
      prediction_score: data.confidence,
      prediction_json: data.probs,
      status: "done",
    })
    .eq("id", scanId);
}


    } catch (e) {
      setStatusMessage("AI request crashed: " + e.message);
    }
  }

  const styles = {
    page: {
      width: "100%",
      padding: "28px 24px 60px",
      background: "#FFFFFF",
    },
    container: {
      width: "100%",
      maxWidth: 1120,
      margin: "0 auto",
    },
    pill: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "8px 12px",
      borderRadius: 999,
      border: "1px solid #E6EBF2",
      background: "#F8FAFF",
      color: "#334155",
      fontSize: "var(--text-sm)",
      fontWeight: 600,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 999,
      background: "#22C55E",
      boxShadow: "0 0 0 3px rgba(34,197,94,0.15)",
    },
    // Main area
    mainWrap: {
      marginTop: 24,
    },
    mainGrid: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: 20,
      alignItems: "start",
    },
    uploadCol: {
      display: "grid",
      gap: 16,
    },
    section: {
      display: "grid",
      gap: 12,
    },
    mainCardHeader: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 16,
      marginBottom: 12,
    },
    mainCardH2: {
      margin: 0,
      fontSize: "var(--title-lg)",
      fontWeight: 900,
      color: "#0F172A",
      letterSpacing: -0.2,
    },
    helper: {
      margin: 0,
      fontSize: "var(--text-xs)",
      color: "#64748B",
    },

    // Messages: not “another box”, just a soft strip
    message: {
      padding: "6px 0",
      color: "#0F172A",
      fontWeight: 700,
      fontSize: "var(--text-sm)",
    },

    previewCol: {
      display: "grid",
      gap: 12,
    },
    previewRow: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: 20,
      alignItems: "start",
    },
    previewHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },
    previewTitle: {
      fontSize: "var(--text-xs)",
      fontWeight: 800,
      color: "#64748B",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
    imageFrame: {
      borderRadius: 16,
      border: "1px solid #E2E8F0",
      background: "#FFFFFF",
      padding: 12,
      minHeight: 240,
      display: "grid",
      placeItems: "center",
    },
    imagePlaceholder: {
      textAlign: "center",
      color: "#64748B",
      fontSize: "var(--text-sm)",
      lineHeight: 1.6,
    },

    img: {
      width: "100%",
      maxWidth: "100%",
      maxHeight: 360,
      borderRadius: 14,
      border: "none",
      boxShadow: "0 10px 22px rgba(15, 23, 42, 0.08)",
    },

    results: {
      padding: 16,
      background: "#FFFFFF",
      border: "1px solid #E2E8F0",
      borderRadius: 16,
      boxShadow: "0 10px 22px rgba(15, 23, 42, 0.08)",
      display: "grid",
      gap: 12,
    },
    resultsHeader: {
      fontSize: "var(--text-xs)",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      fontWeight: 800,
      color: "#64748B",
    },
    resultsSummary: {
      fontSize: "var(--text-sm)",
      color: "#334155",
      lineHeight: 1.6,
    },
    resultRow: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: 12,
      alignItems: "start",
    },
    resultGroup: {
      display: "grid",
      gap: 6,
    },
    meterWrap: {
      display: "grid",
      gap: 8,
    },
    resultLabel: {
      fontSize: "var(--text-xs)",
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      color: "#64748B",
      fontWeight: 800,
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    resultDot: (color, soft) => ({
      width: 8,
      height: 8,
      borderRadius: 999,
      background: color || "#16A34A",
      boxShadow: `0 0 0 4px ${soft || "rgba(22,163,74,0.15)"}`,
    }),
    resultValue: (color) => ({
      fontSize: "var(--title-lg)",
      fontWeight: 900,
      color: color || "#0F172A",
    }),
    meter: {
      height: 8,
      borderRadius: 999,
      background: "#E2E8F0",
      overflow: "hidden",
    },
    meterFill: (value, gradient) => ({
      height: "100%",
      width: `${Math.min(100, Math.max(0, value))}%`,
      background: gradient || "linear-gradient(90deg, #16A34A, #22C55E)",
      borderRadius: 999,
    }),
    explanation: { color: "#64748B", fontSize: "var(--text-sm)", lineHeight: 1.6 },
    emptyText: {
      fontSize: "var(--text-sm)",
      color: "#64748B",
      lineHeight: 1.6,
    },

    footerNote: {
      marginTop: 14,
      fontSize: "var(--text-xs)",
      color: "#94A3B8",
      lineHeight: 1.5,
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.pill}>
          <span style={styles.dot} />
          <span>Educational demo · TB X-ray classifier</span>
        </div>

        <div style={styles.mainWrap}>
          <div style={styles.mainGrid}>
            <div style={styles.uploadCol}>
              <div style={styles.section}>
                <div style={styles.mainCardHeader}>
                  <h2 style={styles.mainCardH2}>Upload X-ray Image</h2>
                  <p style={styles.helper}>JPG / PNG recommended</p>
                </div>

                <UploadImage userId={userId} onUploadComplete={handleUploadComplete} />
              </div>

              {statusMessage && <div style={styles.message}>{statusMessage}</div>}

              <div style={styles.previewCol}>
                <div style={styles.previewHeader}>
                  <div style={styles.previewTitle}>Latest X-ray</div>
                </div>
                <div style={styles.previewRow}>
                  <div style={styles.imageFrame}>
                    {lastImageUrl ? (
                      <img src={lastImageUrl} alt="Uploaded X-ray" style={styles.img} />
                    ) : (
                      <div style={styles.imagePlaceholder}>
                        <strong>No upload yet</strong>
                        <br />
                        Choose a chest X-ray to preview the image and model output.
                      </div>
                    )}
                  </div>

                  <div style={styles.results}>
                    <div style={styles.resultsHeader}>Prediction summary</div>
                    {aiResult ? (
                  <>
                    <div style={styles.resultRow}>
                      <div style={styles.resultGroup}>
                        <div style={styles.resultLabel}>
                          <span
                            style={styles.resultDot(
                              predictionTheme ? predictionTheme.color : undefined,
                              predictionTheme ? predictionTheme.soft : undefined
                            )}
                          />
                          Prediction
                        </div>
                        <div
                          style={styles.resultValue(
                            predictionTheme ? predictionTheme.color : undefined
                          )}
                        >
                          {aiResult.label}
                        </div>
                      </div>
                      <div style={styles.resultGroup}>
                        <div style={styles.resultLabel}>Confidence</div>
                        <div style={styles.resultValue()}>
                          {Math.round(aiResult.confidence * 100)}%
                        </div>
                        <div style={styles.meterWrap}>
                          <div style={styles.meter}>
                            <div
                              style={styles.meterFill(
                                aiResult.confidence * 100,
                                predictionTheme ? predictionTheme.gradient : undefined
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={styles.resultsSummary}>
                      {getPredictionSummary(aiResult.label, aiResult.confidence)}
                    </div>
                        {aiResult.explanation && (
                          <div style={styles.explanation}>{aiResult.explanation}</div>
                        )}
                      </>
                    ) : (
                      <div style={styles.emptyText}>
                        No prediction yet. Run a prediction to see results and confidence.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.footerNote}>
            Educational use only. Not medical advice. Do not use for diagnosis or
            treatment decisions.
          </div>
        </div>
      </div>
    </div>
  );
}
