import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="lp">
      <style>{`
        * { box-sizing: border-box; }
        .lp{
          min-height: 100vh;
          background: transparent;
          color: var(--text);
          padding: 28px 24px 60px;
        }

        .container{
          max-width: 1120px;
          margin: 0 auto;
        }

        .badge{
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: var(--text-sm);
          color: var(--muted);
          border: 1px solid var(--border);
          padding: 8px 12px;
          border-radius: 999px;
          background: #fff;
        }

        .dot{
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 4px var(--accent-soft);
        }

        .hero{
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 22px;
          align-items: start;
        }

        .h1{
          font-size: var(--title-xl);
          line-height: 1.02;
          letter-spacing: -0.02em;
          margin: 10px 0 12px;
        }

        .sub{
          margin: 0;
          max-width: 58ch;
          font-size: var(--text-base);
          line-height: 1.65;
          color: var(--muted);
        }

        .ctaRow{
          margin-top: 22px;
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
        }

        .btn{
          border: 1px solid #0f172a;
          background: #0f172a;
          color: white;
          padding: 12px 16px;
          border-radius: 12px;
          font-weight: 650;
          font-size: 14px;
          cursor: pointer;
          transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease;
          box-shadow: 0 10px 20px rgba(2,6,23,0.10);
        }
        .btn:hover{
          transform: translateY(-2px);
          box-shadow: 0 16px 32px rgba(2,6,23,0.14);
        }
        .btn:active{
          transform: translateY(0) scale(0.98);
          box-shadow: 0 10px 18px rgba(2,6,23,0.10);
        }

        .link{
          color: var(--muted);
          font-size: 14px;
          text-decoration: none;
          border-bottom: 1px solid rgba(15,23,42,0.2);
          padding-bottom: 2px;
        }
        .link:hover{ color: var(--text); }

        .panel{
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 18px;
          background: #f8fafc;
          box-shadow: none;
        }

        .panelTitle{
          margin: 0 0 10px;
          font-size: var(--text-xs);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted-2);
        }

        .list{
          margin: 0;
          padding-left: 18px;
          color: var(--muted);
          line-height: 1.7;
          font-size: var(--text-sm);
        }

        .section{
          margin-top: 32px;
        }

        .sectionHeader{
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .sectionTitle{
          margin: 0;
          font-size: var(--title-lg);
          letter-spacing: -0.01em;
        }

        .sectionSub{
          margin: 0;
          color: var(--muted);
          font-size: var(--text-sm);
        }

        .steps{
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
        }

        .step{
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 14px;
          background: #fff;
          transition: transform 140ms ease, box-shadow 140ms ease;
        }
        .step:hover{
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(2,6,23,0.08);
        }

        .stepSmall{
          font-size: var(--text-xs);
          color: var(--muted-2);
          margin: 0 0 6px;
        }
        .stepTitle{
          margin: 0 0 6px;
          font-size: var(--text-base);
          color: var(--text);
        }
        .stepDesc{
          margin: 0;
          font-size: var(--text-sm);
          color: var(--muted);
          line-height: 1.55;
        }

        .note{
          margin-top: 18px;
          color: var(--muted-2);
          font-size: var(--text-xs);
        }

        @media (max-width: 900px){
          .hero{ grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="container">
        <div className="badge">
          <span className="dot" />
          Educational demo · TB X-ray classifier
        </div>

        <div className="hero">
          <div>
            <h1 className="h1">
              Tuberculosis Screening
            </h1>

            <p className="sub">
              Upload a chest X-ray and get an AI-assisted prediction for TB-related patterns.
              Built for learning and portfolio demos. Not a clinical tool.
            </p>

            <div className="ctaRow">
              <button className="btn" onClick={() => navigate("/diagnosis")}>
                Get Started
              </button>

              <a className="link" href="#how">
                How it works
              </a>
            </div>
          </div>

          <div className="panel">
            <p className="panelTitle">What you’ll see</p>
            <ul className="list">
              <li>Prediction label + confidence</li>
              <li>Short explanation (optional)</li>
              <li>Upload history (past results)</li>
            </ul>
            <div className="note">
              Educational use only. Not medical advice.
            </div>
          </div>
        </div>

        <div id="how" className="section">
          <div className="sectionHeader">
            <h2 className="sectionTitle">How it works</h2>
            <p className="sectionSub">A simple three‑step flow from upload to prediction.</p>
          </div>
          <div className="steps">
            <div className="step">
              <p className="stepSmall">Step 1</p>
              <p className="stepTitle">Upload X-ray</p>
              <p className="stepDesc">Choose a chest X-ray image (JPG/PNG).</p>
            </div>

            <div className="step">
              <p className="stepSmall">Step 2</p>
              <p className="stepTitle">AI inference</p>
              <p className="stepDesc">The backend runs the model and returns a result.</p>
            </div>

            <div className="step">
              <p className="stepSmall">Step 3</p>
              <p className="stepTitle">View results</p>
              <p className="stepDesc">See prediction + confidence and save to history.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
