import * as React from "react";

interface ContactEmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export function ContactEmailTemplate({ name, email, message }: ContactEmailTemplateProps) {
  return (
    <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", backgroundColor: "#0a0a0a", color: "#ededed", padding: "32px" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", border: "1px solid #262626", borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #262626", fontSize: "12px", color: "#a1a1aa", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          hoceinir.ir / contact
        </div>
        <div style={{ padding: "24px" }}>
          <h1 style={{ fontSize: "18px", margin: "0 0 16px" }}>
            New contact message from {name}
          </h1>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", lineHeight: "1.6" }}>
            <tr>
              <td style={{ padding: "8px 0", color: "#a1a1aa", width: "90px" }}>name</td>
              <td style={{ padding: "8px 0" }}>{name}</td>
            </tr>
            <tr>
              <td style={{ padding: "8px 0", color: "#a1a1aa", width: "90px" }}>email</td>
              <td style={{ padding: "8px 0" }}>
                <a href={`mailto:${email}`} style={{ color: "#22d3ee" }}>
                  {email}
                </a>
              </td>
            </tr>
            <tr>
              <td style={{ padding: "8px 0", color: "#a1a1aa", width: "90px", verticalAlign: "top" }}>message</td>
              <td style={{ padding: "8px 0", whiteSpace: "pre-wrap" }}>{message}</td>
            </tr>
          </table>
          <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px dashed #262626", fontSize: "12px", color: "#71717a" }}>
            reply-to: {email}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactEmailTemplate;
