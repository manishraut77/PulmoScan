import React from "react";

export default function AboutAI() {
  const metrics = [{ label: "Accuracy", value: "91%" }];

  const stack = [
    {
      name: "PyTorch",
      role: "Deep Learning",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M12 3c2.5 2.5 5 5.5 5 9 0 3.3-2.7 6-6 6s-6-2.7-6-6c0-3.2 2.2-5.6 4-7.4 1-1 2-2 3-3z" />
          <circle cx="16" cy="8" r="1.4" />
        </svg>
      ),
    },
    {
      name: "FastAPI",
      role: "Backend API",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
        </svg>
      ),
    },
    {
      name: "Python",
      role: "Core Language",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
    },
    {
      name: "Render",
      role: "Deployment",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
          <rect x="3" y="3" width="18" height="7" rx="2" />
          <rect x="3" y="14" width="18" height="7" rx="2" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
          <line x1="7" y1="18" x2="7.01" y2="18" />
        </svg>
      ),
    },
  ];

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
      gap: 22,
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
      gap: 24,
      alignItems: "start",
    },
    h1: {
      margin: "0 0 10px",
      fontSize: "var(--title-xl)",
      letterSpacing: -0.02,
      color: "var(--text)",
    },
    sub: {
      margin: 0,
      fontSize: "var(--text-base)",
      lineHeight: 1.65,
      color: "var(--muted)",
      maxWidth: 620,
    },
    panel: {
      border: "1px solid var(--border)",
      borderRadius: 20,
      padding: 18,
      background: "#fff",
      boxShadow: "var(--shadow)",
      display: "grid",
      gap: 12,
    },
    panelTitle: {
      margin: 0,
      fontSize: "var(--text-xs)",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--muted-2)",
      fontWeight: 700,
    },
    stackPanel: {
      border: "1px solid var(--border)",
      borderRadius: 20,
      padding: 18,
      background: "#fff",
      boxShadow: "var(--shadow)",
      display: "grid",
      gap: 12,
    },
    stackGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: 14,
    },
    stackCard: {
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: "14px 16px",
      background: "#F8FAFC",
      display: "grid",
      gap: 8,
      textAlign: "center",
    },
    stackIcon: {
      width: 42,
      height: 42,
      margin: "0 auto",
      color: "var(--text)",
    },
    stackName: {
      fontSize: "var(--text-base)",
      fontWeight: 800,
      color: "var(--text)",
    },
    stackSub: {
      color: "var(--muted-2)",
      fontWeight: 600,
      fontSize: "var(--text-xs)",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 16,
    },
    section: {
      border: "1px solid var(--border)",
      borderRadius: 18,
      padding: 18,
      background: "#fff",
      boxShadow: "0 12px 26px rgba(15, 23, 42, 0.06)",
      display: "grid",
      gap: 10,
    },
    sectionTitle: {
      margin: 0,
      fontSize: "var(--title-md)",
      fontWeight: 800,
      color: "var(--text)",
    },
    body: {
      margin: 0,
      color: "var(--muted)",
      fontSize: "var(--text-sm)",
      lineHeight: 1.6,
    },
    list: {
      margin: 0,
      paddingLeft: 18,
      color: "var(--muted)",
      lineHeight: 1.7,
      fontSize: "var(--text-sm)",
    },
    metricsPanel: {
      border: "1px solid var(--border)",
      borderRadius: 20,
      padding: 18,
      background: "#fff",
      boxShadow: "var(--shadow)",
      display: "grid",
      gap: 12,
    },
    metricsTitle: {
      margin: 0,
      fontSize: "var(--title-lg)",
      fontWeight: 800,
      color: "var(--text)",
    },
    metricsNote: {
      margin: 0,
      color: "var(--muted)",
      fontSize: "var(--text-sm)",
      lineHeight: 1.6,
    },
    metrics: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: 12,
    },
    metricCard: {
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: "14px 16px",
      background: "#F8FAFC",
      display: "grid",
      gap: 8,
    },
    metricLabel: {
      fontSize: "var(--text-xs)",
      color: "var(--muted-2)",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      fontWeight: 700,
    },
    metricValue: {
      fontSize: "var(--title-lg)",
      fontWeight: 900,
      color: "var(--text)",
    },
    footer: {
      fontSize: "var(--text-xs)",
      color: "var(--muted-2)",
      lineHeight: 1.6,
    },
    split: {
      gridColumn: "1 / -1",
    },
    note: {
      background: "linear-gradient(180deg, #F8FAFC, #FFFFFF)",
      border: "1px dashed var(--border)",
      borderRadius: 16,
      padding: 14,
      color: "var(--muted)",
      fontSize: "var(--text-sm)",
      lineHeight: 1.6,
    },
    flow: {
      margin: 0,
      paddingLeft: 18,
      color: "var(--muted)",
      lineHeight: 1.7,
      fontSize: "var(--text-sm)",
    },
    media: {
      maxWidth: 900,
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.badge}>
          <span style={styles.dot} />
          Educational demo · TB X-ray classifier
        </div>

        <div style={styles.hero}>
          <div>
            <h1 style={styles.h2}>About the AI Model</h1>
            <p style={styles.sub}>
              Learn about the deep learning model powering our chest X-ray analysis.
              This page summarizes the architecture, training approach, and the data
              flow from upload to prediction.
            </p>
          </div>

          <div style={styles.metricsPanel}>
            <h2 style={styles.metricsTitle}>Performance Metrics</h2>
            <p style={styles.metricsNote}>Our model is 91% accurate on held-out data.</p>
            <div style={styles.metrics}>
              {metrics.map((metric) => (
                <div key={metric.label} style={styles.metricCard}>
                  <div style={styles.metricLabel}>{metric.label}</div>
                  <div style={styles.metricValue}>{metric.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.stackPanel}>
          <p style={styles.panelTitle}>Technology Stack</p>
          <div style={styles.stackGrid}>
            {stack.map((item) => (
              <div key={item.name} style={styles.stackCard}>
                <div style={styles.stackIcon}>{item.icon}</div>
                <div style={styles.stackName}>{item.name}</div>
                <div style={styles.stackSub}>{item.role}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.grid}>
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Model Architecture</h2>
            <p style={styles.body}>
              Our chest X-ray analysis model uses a pre-trained ResNet18 architecture,
              a deep convolutional neural network (CNN) with 18 layers. It balances
              strong performance with efficient inference.
            </p>
            <p style={styles.body}>
              The final layer is modified to output two classes (NORMAL or TB), and
              the model is fine-tuned using transfer learning on chest X-ray images.
            </p>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Key Features</h2>
            <ul style={styles.list}>
              <li>Pre-trained ResNet18 backbone</li>
              <li>Binary classification output</li>
              <li>Transfer learning approach</li>
              <li>Optimized for medical imaging input</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Data Flow</h2>
            <ol style={styles.flow}>
              <li>Your image is uploaded to Supabase Storage.</li>
              <li>FastAPI fetches and preprocesses the image (224x224, normalized).</li>
              <li>The ResNet18 model outputs a prediction and confidence.</li>
              <li>Results are returned to the frontend and displayed.</li>
              <li>Predictions are saved to your scans record.</li>
            </ol>
          </section>

          <section style={{ ...styles.section, ...styles.split }}>
            <h2 style={styles.sectionTitle}>Limitations and Disclaimer</h2>
            <ul style={styles.list}>
              <li>This tool is for educational purposes only.</li>
              <li>AI predictions should never replace professional medical diagnosis.</li>
              <li>Model performance can vary across demographics and scanners.</li>
              <li>Image quality strongly impacts prediction accuracy.</li>
              <li>Always consult healthcare professionals for medical advice.</li>
            </ul>
            <div style={styles.note}>
              By using this application, you acknowledge these limitations and agree
              to use the tool responsibly.
            </div>
          </section>
        </div>

        <div style={styles.footer}>
          Educational use only. Not medical advice. Do not use for diagnosis or treatment
          decisions.
        </div>
      </div>
    </div>
  );

}
