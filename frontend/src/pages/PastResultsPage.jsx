import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

export default function PastResultsPage() {
  const { session } = useOutletContext() || {};
  const userId = session?.user?.id;
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [scans, setScans] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [confirmState, setConfirmState] = useState({
    open: false,
    mode: "selected",
    count: 0,
  });
  const [reportScan, setReportScan] = useState(null);

  const totalScans = scans.length;
  const latestScan = scans[0];
  const latestDate = latestScan ? new Date(latestScan.created_at).toLocaleString() : "—";
  const allSelected = totalScans > 0 && selectedIds.length === totalScans;

  const getPredictionTheme = (label = "") => {
    const text = label.toLowerCase();
    const isNegative =
      text.includes("no tb") ||
      text.includes("no tuberculosis") ||
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
      color: "#0F172A",
      soft: "rgba(15,23,42,0.08)",
      border: "rgba(15,23,42,0.2)",
      gradient: "linear-gradient(90deg, #0F172A, #334155)",
    };
  };

  const getPredictionSummary = (label = "", confidence) => {
    const text = label.toLowerCase();
    const pct = typeof confidence === "number" ? Math.round(confidence * 100) : null;
    const pctText = pct === null ? "" : ` (${pct}% confidence)`;

    const isNegative =
      text.includes("no tb") ||
      text.includes("no tuberculosis") ||
      text.includes("normal") ||
      text.includes("negative");
    const isPositive = text.includes("tb") || text.includes("tuberculosis") || text.includes("positive");

    if (isNegative) {
      return `The AI suggests that: this X-ray looks more consistent with normal patterns${pctText}.`;
    }

    if (isPositive) {
      return `The AI suggests that: this X-ray shows patterns consistent with tuberculosis${pctText}.`;
    }

    if (!label) {
      return "The AI report is not available yet. Please check back after processing finishes.";
    }

    return `The AI suggests that: this X-ray is closer to "${label}"${pctText}.`;
  };

  const statusTone = (status = "") => {
    const key = status.toLowerCase();
    if (key === "done") {
      return { bg: "rgba(22,163,74,0.12)", color: "#166534", border: "rgba(22,163,74,0.2)" };
    }
    if (key === "pending") {
      return { bg: "rgba(234,179,8,0.16)", color: "#92400E", border: "rgba(234,179,8,0.25)" };
    }
    if (key === "failed") {
      return { bg: "rgba(220,38,38,0.12)", color: "#991B1B", border: "rgba(220,38,38,0.2)" };
    }
    return { bg: "#F1F5F9", color: "#475569", border: "#E2E8F0" };
  };

  const styles = {
    page: {
      width: "100%",
      padding: "28px 24px 60px",
      background: "transparent",
    },
    container: {
      width: "100%",
      maxWidth: 1120,
      margin: "0 auto",
      display: "grid",
      gap: 20,
    },
    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontSize: "var(--text-sm)",
      color: "var(--muted)",
      border: "1px solid var(--border)",
      padding: "8px 12px",
      borderRadius: 999,
      background: "#fff",
      width: "fit-content",
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 50,
      background: "var(--accent)",
      boxShadow: "0 0 0 4px var(--accent-soft)",
    },
    hero: {
      display: "grid",
      gridTemplateColumns: "1.2fr 0.8fr",
      gap: 20,
      alignItems: "start",
    },
    h1: {
      margin: 0,
      fontSize: "var(--title-xl)",
      letterSpacing: -0.02,
      color: "var(--text)",
    },
    sub: {
      margin: "6px 0 0",
      color: "var(--muted)",
      fontSize: "var(--text-base)",
      lineHeight: 1.6,
    },
    stats: {
      border: "1px solid var(--border)",
      borderRadius: 18,
      padding: 16,
      background: "#fff",
      boxShadow: "var(--shadow)",
      display: "grid",
      gap: 12,
    },
    statRow: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
    },
    statCard: {
      border: "1px solid var(--border)",
      borderRadius: 14,
      padding: "10px 12px",
      background: "#F8FAFC",
      display: "grid",
      gap: 6,
    },
    statLabel: {
      fontSize: "var(--text-xs)",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "var(--muted-2)",
      fontWeight: 700,
    },
    statValue: {
      fontSize: "var(--title-md)",
      fontWeight: 800,
      color: "var(--text)",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: 16,
    },
    card: {
      border: "1px solid var(--border)",
      borderRadius: 18,
      padding: 14,
      background: "#fff",
      boxShadow: "0 12px 26px rgba(15, 23, 42, 0.06)",
      display: "grid",
      gap: 10,
    },
    cardSelected: {
      border: "1px solid rgba(37, 99, 235, 0.35)",
      boxShadow: "0 14px 30px rgba(37, 99, 235, 0.12)",
      background: "rgba(239, 246, 255, 0.6)",
    },
    cardHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    },
    cardTitle: {
      fontSize: "var(--text-sm)",
      fontWeight: 800,
      color: "var(--text)",
    },
    statusPill: (tone) => ({
      padding: "4px 10px",
      borderRadius: 999,
      fontSize: "var(--text-xs)",
      fontWeight: 700,
      background: tone.bg,
      color: tone.color,
      border: `1px solid ${tone.border}`,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
    }),
    dateText: {
      fontSize: "var(--text-xs)",
      color: "var(--muted-2)",
    },
    image: {
      width: "100%",
      height: 220,
      objectFit: "cover",
      borderRadius: 12,
      border: "1px solid var(--border)",
    },
    empty: {
      border: "1px dashed var(--border)",
      borderRadius: 16,
      padding: 16,
      background: "#F8FAFC",
      textAlign: "center",
      color: "var(--muted)",
      fontSize: "var(--text-sm)",
    },
    error: {
      color: "#DC2626",
      fontWeight: 700,
    },
    actions: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      padding: "10px 12px",
      borderRadius: 14,
      border: "1px solid var(--border)",
      background: "#fff",
      boxShadow: "var(--shadow)",
      fontSize: "var(--text-sm)",
      color: "var(--muted)",
    },
    actionsLeft: {
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    checkbox: {
      width: 16,
      height: 16,
      accentColor: "var(--accent)",
    },
    actionBtn: {
      padding: "8px 12px",
      borderRadius: 10,
      border: "1px solid var(--border)",
      background: "#F8FAFC",
      fontWeight: 700,
      color: "var(--text)",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
    },
    dangerBtn: {
      padding: "8px 12px",
      borderRadius: 10,
      border: "1px solid rgba(220,38,38,0.25)",
      background: "rgba(220,38,38,0.12)",
      fontWeight: 700,
      color: "#B91C1C",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
    },
    actionIcon: {
      width: 16,
      height: 16,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    },
    confirmOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(15, 23, 42, 0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 200,
      padding: 16,
    },
    confirmCard: {
      width: "100%",
      maxWidth: 420,
      borderRadius: 18,
      background: "#FFFFFF",
      border: "1px solid var(--border)",
      boxShadow: "0 24px 50px rgba(15, 23, 42, 0.2)",
      padding: 18,
      display: "grid",
      gap: 12,
    },
    confirmTitle: {
      margin: 0,
      fontSize: "var(--title-md)",
      fontWeight: 800,
      color: "var(--text)",
    },
    confirmText: {
      margin: 0,
      color: "var(--muted)",
      fontSize: "var(--text-sm)",
      lineHeight: 1.6,
    },
    confirmActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 10,
      marginTop: 6,
    },
    confirmBtn: {
      padding: "8px 14px",
      borderRadius: 10,
      border: "1px solid var(--border)",
      background: "#F8FAFC",
      fontWeight: 700,
      color: "var(--text)",
      cursor: "pointer",
    },
    confirmDanger: {
      padding: "8px 14px",
      borderRadius: 10,
      border: "1px solid rgba(220,38,38,0.25)",
      background: "rgba(220,38,38,0.12)",
      fontWeight: 700,
      color: "#B91C1C",
      cursor: "pointer",
    },
    reportOverlay: {
      position: "fixed",
      inset: 0,
      background: "rgba(15, 23, 42, 0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      zIndex: 210,
    },
    reportCard: {
      width: "100%",
      maxWidth: 920,
      borderRadius: 20,
      background: "#FFFFFF",
      border: "1px solid var(--border)",
      boxShadow: "0 28px 60px rgba(15, 23, 42, 0.2)",
      padding: 20,
      display: "grid",
      gap: 16,
    },
    reportHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
    },
    reportTitle: {
      margin: 0,
      fontSize: "var(--title-lg)",
      fontWeight: 800,
      color: "var(--text)",
    },
    reportClose: {
      border: "1px solid var(--border)",
      background: "#FFFFFF",
      borderRadius: 10,
      width: 32,
      height: 32,
      cursor: "pointer",
      fontSize: "var(--title-md)",
      color: "var(--muted-2)",
    },
    reportGrid: {
      display: "grid",
      gridTemplateColumns: "minmax(240px, 1fr) minmax(260px, 1fr)",
      gap: 18,
      alignItems: "start",
    },
    reportImage: {
      width: "100%",
      borderRadius: 16,
      border: "1px solid var(--border)",
      objectFit: "cover",
      maxHeight: 360,
    },
    reportPanel: {
      border: "1px solid var(--border)",
      borderRadius: 16,
      background: "#F8FAFC",
      padding: 16,
      display: "grid",
      gap: 12,
    },
    reportLabel: (theme) => ({
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 12px",
      borderRadius: 999,
      border: `1px solid ${theme.border}`,
      background: theme.soft,
      color: theme.color,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      fontSize: "var(--text-xs)",
    }),
    reportMetric: {
      display: "grid",
      gap: 6,
    },
    reportMetricLabel: {
      fontSize: "var(--text-xs)",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      color: "var(--muted-2)",
      fontWeight: 700,
    },
    reportMetricValue: {
      fontSize: "var(--title-md)",
      fontWeight: 800,
      color: "var(--text)",
    },
    reportBar: (theme, pct = 0) => ({
      width: "100%",
      height: 10,
      borderRadius: 999,
      background: "#E2E8F0",
      overflow: "hidden",
      position: "relative",
      marginTop: 4,
    }),
    reportBarFill: (theme, pct = 0) => ({
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: `${pct}%`,
      background: theme.gradient,
    }),
    reportSummary: {
      margin: 0,
      color: "var(--muted)",
      lineHeight: 1.6,
      fontSize: "var(--text-sm)",
    },
    reportProbs: {
      display: "grid",
      gap: 6,
      fontSize: "var(--text-sm)",
      color: "var(--muted-2)",
    },
    reportFoot: {
      fontSize: "var(--text-xs)",
      color: "var(--muted-2)",
    },
  };

  const handlePageClick = (event) => {
    if (event.target.closest("[data-selection-zone]")) return;
    setSelectedIds([]);
    setSelectionMode(false);
  };

  const toggleSelect = (id) => {
    if (!selectionMode) {
      setSelectionMode(true);
    }
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (!selectionMode) {
      setSelectionMode(true);
    }
    setSelectedIds(allSelected ? [] : scans.map((scan) => scan.id));
  };

  const handleCardClick = (scan) => {
    if (selectionMode) {
      toggleSelect(scan.id);
      return;
    }
    setReportScan(scan);
  };

  const openConfirm = (mode) => {
    if (deleting) return;
    if (mode === "selected" && selectedIds.length === 0) return;
    if (mode === "all" && totalScans === 0) return;
    setConfirmState({
      open: true,
      mode,
      count: mode === "selected" ? selectedIds.length : totalScans,
    });
  };

  const closeConfirm = () => {
    if (deleting) return;
    setConfirmState({ open: false, mode: "selected", count: 0 });
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0 || deleting) return;
    setDeleting(true);
    setErrorMsg("");

    const { error } = await supabase.from("scans").delete().in("id", selectedIds);

    if (error) {
      setErrorMsg(error.message);
      setDeleting(false);
      return;
    }

    setScans((prev) => prev.filter((scan) => !selectedIds.includes(scan.id)));
    setSelectedIds([]);
    setSelectionMode(false);
    setDeleting(false);
  };

  const handleDeleteAll = async () => {
    if (totalScans === 0 || deleting) return;
    setDeleting(true);
    setErrorMsg("");

    const { error } = await supabase.from("scans").delete().eq("user_id", userId);

    if (error) {
      setErrorMsg(error.message);
      setDeleting(false);
      return;
    }

    setScans([]);
    setSelectedIds([]);
    setSelectionMode(false);
    setDeleting(false);
  };

  const handleConfirmDelete = async () => {
    if (confirmState.mode === "selected") {
      await handleDeleteSelected();
    } else {
      await handleDeleteAll();
    }
    setConfirmState({ open: false, mode: "selected", count: 0 });
  };

  useEffect(() => {
    async function fetchScans() {
      if (!userId) {
        setLoading(false);
        setScans([]);
        return;
      }

      setLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("scans")
        .select("id, image_path, status, created_at, prediction_label, prediction_score, prediction_json")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) { setErrorMsg(error.message); setScans([]); setLoading(false); return; }

      setScans(data || []);
      setLoading(false);
    }

    fetchScans();
  }, [userId]);

  return (
    <div style={styles.page} onClick={handlePageClick}>
      <div style={styles.container}>
        <div style={styles.badge}>
          <span style={styles.dot} />
          Upload history · Past results
        </div>

        <div style={styles.hero}>
          <div>
            <h1 style={styles.h2}>Past Results</h1>
            <p style={styles.sub}>
              Review your previous X-ray uploads and their processing status.
            </p>
          </div>
          <div style={styles.stats}>
            <div style={styles.statRow}>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Total uploads</div>
                <div style={styles.statValue}>{totalScans}</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Latest upload</div>
                <div style={styles.statValue}>{latestDate}</div>
              </div>
            </div>
            <div style={styles.sub}>
              This history updates as soon as a new scan is uploaded.
            </div>
          </div>
        </div>

        {loading && <div style={styles.sub}>Loading...</div>}
        {errorMsg && <div style={styles.error}>{errorMsg}</div>}

        {!loading && !errorMsg && scans.length > 0 && (
          <div style={styles.actions} data-selection-zone>
            <div style={styles.actionsLeft}>
              {selectionMode ? (
                <>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    style={styles.checkbox}
                    aria-label="Select all scans"
                  />
                  <span>{selectedIds.length} selected</span>
                </>
              ) : (
                <span>Select scans to manage your history.</span>
              )}
            </div>
            <div style={styles.actionsLeft}>
              {selectionMode ? (
                <>
                  <button
                    type="button"
                    style={styles.actionBtn}
                    onClick={() => {
                      setSelectedIds([]);
                      setSelectionMode(false);
                    }}
                  >
                    <span style={styles.actionIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M5 5l14 14" />
                        <path d="M19 5L5 19" />
                      </svg>
                    </span>
                    Clear selection
                  </button>
                  <button
                    type="button"
                    style={styles.dangerBtn}
                    onClick={() => openConfirm("selected")}
                    disabled={deleting || selectedIds.length === 0}
                  >
                    <span style={styles.actionIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M4 7h16" />
                        <path d="M9 7V5h6v2" />
                        <rect x="6.5" y="7" width="11" height="12" rx="2" />
                        <path d="M10 11v5" />
                        <path d="M14 11v5" />
                      </svg>
                    </span>
                    {deleting ? "Deleting..." : "Delete selected"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  style={styles.actionBtn}
                  onClick={() => setSelectionMode(true)}
                >
                  <span style={styles.actionIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <rect x="4" y="4" width="16" height="16" rx="3" />
                      <path d="M8 12l2.5 2.5L16 9" />
                    </svg>
                  </span>
                  Select
                </button>
              )}
              <button
                type="button"
                style={styles.dangerBtn}
                onClick={() => openConfirm("all")}
                disabled={deleting || totalScans === 0}
              >
                <span style={styles.actionIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path d="M4 7h16" />
                    <path d="M9 7V5h6v2" />
                    <rect x="6.5" y="7" width="11" height="12" rx="2" />
                    <path d="M9 11h6" />
                    <path d="M9 15h6" />
                  </svg>
                </span>
                {deleting ? "Deleting..." : "Delete all"}
              </button>
            </div>
          </div>
        )}

        {!loading && !errorMsg && scans.length === 0 && (
          <div style={styles.empty}>No scans yet. Upload one from Diagnosis.</div>
        )}

        {!loading && !errorMsg && scans.length > 0 && (
          <div style={styles.grid}>
            {scans.map((scan, index) => (
              <div
                key={scan.id}
                style={{
                  ...styles.card,
                  ...(selectedIds.includes(scan.id) ? styles.cardSelected : {}),
                }}
                data-selection-zone
                role="button"
                onClick={() => handleCardClick(scan)}
              >
                <div style={styles.cardHeader}>
                  <div style={styles.cardHeader}>
                    {selectionMode && (
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(scan.id)}
                        onChange={() => toggleSelect(scan.id)}
                        onClick={(event) => event.stopPropagation()}
                        style={styles.checkbox}
                        aria-label={`Select scan ${totalScans - index}`}
                      />
                    )}
                    <div style={styles.cardTitle}>Scan {totalScans - index}</div>
                  </div>
                  <div style={styles.statusPill(statusTone(scan.status))}>{scan.status}</div>
                </div>
                <div style={styles.dateText}>
                  {new Date(scan.created_at).toLocaleString()}
                </div>
                <img src={scan.image_path} alt="Uploaded X-ray" style={styles.image} />
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmState.open && (
        <div style={styles.confirmOverlay} data-selection-zone onClick={closeConfirm}>
          <div style={styles.confirmCard} onClick={(event) => event.stopPropagation()}>
            <h3 style={styles.confirmTitle}>Confirm deletion</h3>
            <p style={styles.confirmText}>
              {confirmState.mode === "all"
                ? "This will remove all scans in your history."
                : `This will remove ${confirmState.count} selected scan(s).`}
            </p>
            <div style={styles.confirmActions}>
              <button type="button" style={styles.confirmBtn} onClick={closeConfirm}>
                Cancel
              </button>
              <button
                type="button"
                style={styles.confirmDanger}
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {reportScan && (() => {
        const label = reportScan.prediction_label || "";
        const confidence = typeof reportScan.prediction_score === "number" ? reportScan.prediction_score : null;
        const theme = getPredictionTheme(label);
        const pct = confidence === null ? 0 : Math.round(confidence * 100);
        const summary = getPredictionSummary(label, confidence);
        const probs = reportScan.prediction_json && typeof reportScan.prediction_json === "object"
          ? Object.entries(reportScan.prediction_json)
          : [];

        return (
          <div style={styles.reportOverlay} data-selection-zone onClick={() => setReportScan(null)}>
            <div style={styles.reportCard} onClick={(event) => event.stopPropagation()}>
              <div style={styles.reportHeader}>
                <h3 style={styles.reportTitle}>Scan report</h3>
                <button type="button" style={styles.reportClose} onClick={() => setReportScan(null)}>
                  ×
                </button>
              </div>
              <div style={styles.reportGrid}>
                <img src={reportScan.image_path} alt="Scan" style={styles.reportImage} />
                <div style={styles.reportPanel}>
                  <div style={styles.reportLabel(theme)}>
                    {label ? label.toUpperCase() : "PENDING"}
                  </div>
                  <div style={styles.reportMetric}>
                    <div style={styles.reportMetricLabel}>Confidence</div>
                    <div style={styles.reportMetricValue}>
                      {confidence === null ? "—" : `${pct}%`}
                    </div>
                    <div style={styles.reportBar(theme, pct)}>
                      <div style={styles.reportBarFill(theme, pct)} />
                    </div>
                  </div>
                  <p style={styles.reportSummary}>{summary}</p>
                  {probs.length > 0 && (
                    <div style={styles.reportProbs}>
                      {probs.map(([key, value]) => (
                        <div key={key}>
                          {key}: {Math.round(Number(value) * 100)}%
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={styles.reportFoot}>
                    Uploaded: {new Date(reportScan.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
