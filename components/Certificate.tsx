"use client";

import { forwardRef } from "react";

interface CertificateProps {
  studentName: string;
  courseName: string;
  date: string;
  certificateId: string;
  qrDataUrl?: string;
}

const Certificate = forwardRef<HTMLDivElement, CertificateProps>(
  ({ studentName, courseName, date, certificateId, qrDataUrl }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: 1200,
          height: 850,
          background: "linear-gradient(135deg, #0a0e1a 0%, #131a2c 55%, #0a0e1a 100%)",
          position: "relative",
          fontFamily: "Georgia, 'Times New Roman', serif",
          color: "#eef1f7",
          padding: 0,
          overflow: "hidden",
        }}
      >
        {/* watermark pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.05,
            backgroundImage:
              "repeating-linear-gradient(45deg, #d4af37 0, #d4af37 1px, transparent 1px, transparent 40px)",
          }}
        />

        {/* outer gold border */}
        <div
          style={{
            position: "absolute",
            inset: 24,
            border: "2px solid #d4af37",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 34,
            border: "1px solid rgba(212,175,55,0.4)",
          }}
        />

        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "70px 90px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 22, letterSpacing: 4, color: "#d4af37", fontWeight: 700 }}>
            &lt;/&gt; CODETUTOR
          </div>
          <div style={{ fontSize: 14, letterSpacing: 6, color: "#8a93a8", marginTop: 6 }}>
            PROGRAMMING LEARNING PLATFORM
          </div>

          <div style={{ fontSize: 40, fontWeight: 700, marginTop: 44, letterSpacing: 2 }}>
            CERTIFICATE OF COMPLETION
          </div>
          <div style={{ width: 120, height: 2, background: "#d4af37", margin: "20px 0" }} />

          <div style={{ fontSize: 16, color: "#a8b0c0" }}>This certificate is proudly presented to</div>

          <div
            style={{
              fontSize: 46,
              fontWeight: 700,
              color: "#f3d78a",
              marginTop: 18,
              fontFamily: "'Brush Script MT', cursive, Georgia, serif",
            }}
          >
            {studentName || "Student Name"}
          </div>

          <div style={{ fontSize: 16, color: "#a8b0c0", marginTop: 22, maxWidth: 640, lineHeight: 1.7 }}>
            for successfully completing the <strong style={{ color: "#eef1f7" }}>{courseName}</strong>{" "}
            and demonstrating dedication, consistency, and proficiency throughout the entire learning
            program.
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginTop: 60,
              alignItems: "flex-end",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 13, color: "#8a93a8" }}>Date</div>
              <div style={{ fontSize: 15, borderTop: "1px solid #444", paddingTop: 6, marginTop: 4, minWidth: 160 }}>
                {date}
              </div>
            </div>

            {qrDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- dynamic base64 QR data URL, not a static asset
              <img src={qrDataUrl} alt="Verification QR" width={80} height={80} style={{ opacity: 0.9 }} />
            )}

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, color: "#8a93a8" }}>Certificate ID</div>
              <div style={{ fontSize: 15, borderTop: "1px solid #444", paddingTop: 6, marginTop: 4, minWidth: 160 }}>
                {certificateId}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 34, fontSize: 13, color: "#6b7386" }}>
            Issued By CodeTutor Platform · codetutor.dev
          </div>
        </div>
      </div>
    );
  }
);

Certificate.displayName = "Certificate";
export default Certificate;
