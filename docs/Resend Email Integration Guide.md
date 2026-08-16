# Resend Email Integration Guide

A practical and production-oriented guide for integrating **Resend** with a Next.js application using TypeScript, React Email, Vercel, and environment variables.

---

## 1. Overview

[Resend](https://resend.com) is an email API designed for developers. It allows an application to send transactional emails such as:

- Contact form notifications
- Welcome emails
- Password reset emails
- Email verification
- Order confirmations
- Notifications
- Authentication emails
- System alerts

Resend is an **email delivery service**, not a traditional mailbox such as Gmail or Outlook.

A typical architecture looks like this:

```text
User
  │
  │ submits form
  ▼
Next.js Application
  │
  │ Resend API
  ▼
Resend
  │
  │ delivers email
  ▼
Your Inbox
(Gmail / Outlook / etc.)
```

Resend also provides a dashboard where sent emails, delivery status, and email details can be inspected.

Official documentation:

- Resend Docs
- Next.js Integration
- React Email
- API Keys
- Receiving Emails

---

# 2. Installation

Install the Resend Node.js SDK:

```bash
pnpm add resend
```

or:

```bash
npm install resend
```

When using React Email components, install the required React Email packages:

```bash
pnpm add @react-email/components @react-email/render
```

A typical project may therefore have:

```json
{
  "dependencies": {
    "resend": "...",
    "@react-email/components": "...",
    "@react-email/render": "..."
  }
}
```

---

# 3. Environment Variables

Never hard-code the Resend API key in application code.

Create a local environment file:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
CONTACT_EMAIL=your-email@example.com
```

For example:

```env
RESEND_API_KEY=re_123456789
CONTACT_EMAIL=hocein@example.com
```

The API key must remain server-side.

Do NOT use:

```env
NEXT_PUBLIC_RESEND_API_KEY=...
```

Anything prefixed with `NEXT_PUBLIC_` can become available to browser-side code and should not be used for secrets.

---

# 4. Vercel Environment Variables

Local `.env` files are not automatically available in Vercel.

For a Vercel deployment, add the variables through:

```text
Vercel
→ Project
→ Settings
→ Environment Variables
```

Add:

```text
RESEND_API_KEY
CONTACT_EMAIL
```

Make sure the variables are enabled for the correct environments:

- Production
- Preview
- Development

After changing production environment variables, redeploy the application.

A common production mistake is:

```ts
to: process.env.CONTACT_EMAIL ?? "onboarding@resend.dev"
```

If `CONTACT_EMAIL` does not exist in Vercel, the application silently falls back to:

```text
onboarding@resend.dev
```

This can make the application appear to work while sending emails to an unintended destination.

---

# 5. Fail Fast for Required Environment Variables

For important production configuration, silently falling back to a test address is usually a bad idea.

Instead:

```ts
const contactEmail = process.env.CONTACT_EMAIL;

if (!contactEmail) {
  throw new Error("CONTACT_EMAIL is not configured");
}
```

Likewise:

```ts
const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is not configured");
}
```

This makes configuration errors obvious.

A centralized configuration module can also be used:

```ts
// lib/env.ts

const requiredEnv = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const env = {
  RESEND_API_KEY: requiredEnv("RESEND_API_KEY"),
  CONTACT_EMAIL: requiredEnv("CONTACT_EMAIL"),
};
```

Then:

```ts
import { env } from "@/lib/env";

console.log(env.CONTACT_EMAIL);
```

Do not log the API key.

---

# 6. Creating the Resend Client

Create a server-side Resend client:

```ts
// lib/resend.ts

import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);
```

For stricter validation:

```ts
// lib/resend.ts

import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  throw new Error("RESEND_API_KEY is not configured");
}

export const resend = new Resend(apiKey);
```

This file must never be imported into client-side code.

---

# 7. Sending a Basic Email

A minimal example:

```ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const { data, error } = await resend.emails.send({
  from: "Portfolio <onboarding@resend.dev>",
  to: ["your-email@example.com"],
  subject: "Hello from my application",
  text: "This is a test email.",
});

if (error) {
  console.error(error);
}
```

For production, replace the Resend test sender with an address from a verified domain.

---

# 8. React Email

React Email allows email templates to be written using React components instead of manually writing large HTML strings.

Example:

```tsx
// emails/contact-email.tsx

import {
  Body,
  Container,
  Heading,
  Html,
  Section,
  Text,
} from "@react-email/components";

interface ContactEmailProps {
  name: string;
  email: string;
  message: string;
}

export function ContactEmail({
  name,
  email,
  message,
}: ContactEmailProps) {
  return (
    <Html>
      <Body>
        <Container>
          <Heading>
            New contact message from {name}
          </Heading>

          <Section>
            <Text>
              <strong>Name:</strong> {name}
            </Text>

            <Text>
              <strong>Email:</strong> {email}
            </Text>

            <Text>
              <strong>Message:</strong>
            </Text>

            <Text>{message}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
```

The template is now reusable and receives data through props.

---

# 9. Sending a React Email

A Next.js server route can send the component through Resend:

```ts
// app/api/contact/route.ts

import { Resend } from "resend";
import { ContactEmail } from "@/emails/contact-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, message } = body;

    const { data, error } = await resend.emails.send({
      from: "Portfolio <contact@yourdomain.com>",
      to: [process.env.CONTACT_EMAIL!],
      replyTo: email,
      subject: `New contact message from ${name}`,
      react: (
        <ContactEmail
          name={name}
          email={email}
          message={message}
        />
      ),
    });

    if (error) {
      console.error("Resend error:", error);

      return Response.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("Contact form error:", error);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

The exact rendering behavior depends on the React Email / Resend package versions used by the project. If the runtime reports:

```text
Failed to render React component.
Make sure to install @react-email/render
or @react-email/components.
```

install:

```bash
pnpm add @react-email/render @react-email/components
```

and rebuild the application.

---

# 10. Understanding `from`, `to`, and `replyTo`

These three fields are especially important.

```ts
await resend.emails.send({
  from: "Portfolio <contact@yourdomain.com>",
  to: ["you@example.com"],
  replyTo: visitorEmail,
  subject: "New contact message",
  react: <ContactEmail ... />,
});
```

They have different purposes.

## `from`

The sender shown by the receiving mail server.

Example:

```text
Portfolio <contact@yourdomain.com>
```

The domain should normally be verified in Resend for production sending.

## `to`

The person who receives the email.

For a portfolio contact form:

```text
your-email@example.com
```

## `replyTo`

The address that should receive replies.

For a contact form:

```text
replyTo: visitorEmail
```

This creates a very useful flow:

```text
Visitor
  │
  │ fills contact form
  ▼
Your website
  │
  ▼
Resend
  │
  ▼
Your Gmail
  │
  │ click Reply
  ▼
Visitor
```

The visitor does not need to know anything about Resend.

---

# 11. Recommended Contact Form Configuration

For a portfolio contact form, use:

```ts
await resend.emails.send({
  from: "Website Contact <contact@yourdomain.com>",
  to: [process.env.CONTACT_EMAIL!],
  replyTo: email,
  subject: `New contact message from ${name}`,
  react: (
    <ContactEmail
      name={name}
      email={email}
      message={message}
    />
  ),
});
```

This is preferable to:

```ts
from: email
```

Do not dynamically use arbitrary visitor email addresses as your `from` address.

Instead:

```text
From:
contact@yourdomain.com

To:
your-email@gmail.com

Reply-To:
visitor@gmail.com
```

This is a cleaner and safer email architecture.

---

# 12. Domain Verification

For development, Resend provides a test sender such as:

```text
onboarding@resend.dev
```

For production, use your own verified domain.

Example:

```text
contact@hoceinir.ir
```

The general process is:

```text
Resend Dashboard
    ↓
Domains
    ↓
Add Domain
    ↓
Add DNS records
    ↓
Verify domain
    ↓
Use domain in `from`
```

Your DNS provider may be:

- Cloudflare
- Namecheap
- GoDaddy
- Vercel
- Route 53
- Other DNS providers

The exact DNS records are provided by Resend and should be copied exactly.

Do not invent DNS values manually.

---

# 13. SPF, DKIM, and Domain Authentication

Email providers use DNS-based authentication mechanisms to determine whether a service is authorized to send email for a domain.

Important mechanisms include:

- SPF
- DKIM
- DMARC

Resend provides the DNS records necessary for domain verification and sending authentication.

The exact records depend on the domain and Resend configuration.

Do not copy DNS records from another project or domain.

---

# 14. Production Email Flow

A recommended production architecture is:

```text
                     ┌─────────────────┐
                     │    Visitor      │
                     └────────┬────────┘
                              │
                         Contact Form
                              │
                              ▼
                     ┌─────────────────┐
                     │    Next.js      │
                     │    API Route    │
                     └────────┬────────┘
                              │
                       Validate input
                              │
                              ▼
                     ┌─────────────────┐
                     │     Resend      │
                     └────────┬────────┘
                              │
                     Deliver email
                              │
                              ▼
                     ┌─────────────────┐
                     │   Your Inbox    │
                     │ Gmail/Outlook   │
                     └────────┬────────┘
                              │
                            Reply
                              │
                              ▼
                     ┌─────────────────┐
                     │     Visitor     │
                     └─────────────────┘
```

---

# 15. Form Validation

Never send arbitrary user input directly to Resend.

Validate:

- Name
- Email
- Message
- Maximum lengths
- Required fields

Example with Zod:

```ts
import { z } from "zod";

const contactSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(100),

  email: z
    .string()
    .email()
    .max(255),

  message: z
    .string()
    .min(5)
    .max(5000),
});
```

Then:

```ts
const result = contactSchema.safeParse(body);

if (!result.success) {
  return Response.json(
    { error: "Invalid form data" },
    { status: 400 }
  );
}

const { name, email, message } = result.data;
```

Validation should happen on the server even if the client already validates the form.

Client-side validation is for user experience.

Server-side validation is for security and correctness.

---

# 16. Protecting the Contact Form

A public contact endpoint can be abused by bots.

At minimum consider:

- Rate limiting
- CAPTCHA or Turnstile
- Honeypot fields
- Input validation
- Maximum message length
- Request logging
- IP-based throttling where appropriate

Do not assume:

```text
"I'm just sending an email"
```

means the endpoint is harmless.

A public endpoint that can send email is potentially an abuse vector.

---

# 17. Never Expose the API Key

Bad:

```tsx
"use client";

const resend = new Resend(
  process.env.NEXT_PUBLIC_RESEND_API_KEY
);
```

Do not do this.

The browser should never communicate directly with Resend using your private API key.

Correct:

```text
Browser
   ↓
Your API route / Server Action
   ↓
Resend
```

The API key stays on the server.

---

# 18. Server Actions vs API Routes

Both can be used.

## API Route

Example:

```text
app/api/contact/route.ts
```

Advantages:

- Explicit HTTP endpoint
- Easy integration with other clients
- Familiar architecture
- Easy webhook-style structure

## Server Action

A Server Action can also call Resend directly.

Example:

```ts
"use server";

import { resend } from "@/lib/resend";

export async function sendContactMessage(data: ContactData) {
  const result = await resend.emails.send({
    // ...
  });

  return result;
}
```

The important rule is the same:

```text
Resend code must execute server-side.
```

---

# 19. Error Handling

Resend's API calls can return an error.

Use:

```ts
const { data, error } = await resend.emails.send({
  // ...
});

if (error) {
  console.error("Resend error:", error);

  return Response.json(
    { error: "Failed to send email" },
    { status: 500 }
  );
}
```

Do not expose internal error details to the public user:

Bad:

```ts
return Response.json({
  error: error.message,
});
```

Better:

```ts
console.error(error);

return Response.json(
  {
    error: "Unable to send your message.",
  },
  {
    status: 500,
  }
);
```

Internal details belong in server logs.

---

# 20. Resend Dashboard

The Resend dashboard provides visibility into email sending.

The Emails section can be used to inspect sent emails and delivery status.

Typical statuses include states such as:

```text
Queued
Sent
Delivered
Bounced
Failed
```

The dashboard is useful for answering questions such as:

- Was the email sent?
- Was it delivered?
- What was the subject?
- What was the recipient?
- What content was sent?
- Did the email bounce?
- When was it sent?

The dashboard is therefore primarily an operational and debugging interface.

It is not intended to replace Gmail or Outlook as your normal mailbox.

---

# 21. Contact Form Example

A complete example:

```ts
// app/api/contact/route.ts

import { Resend } from "resend";
import { z } from "zod";
import { ContactEmail } from "@/emails/contact-email";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  message: z.string().min(5).max(5000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = schema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Invalid form data" },
        { status: 400 }
      );
    }

    const { name, email, message } = result.data;

    const contactEmail = process.env.CONTACT_EMAIL;

    if (!contactEmail) {
      throw new Error("CONTACT_EMAIL is not configured");
    }

    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <contact@yourdomain.com>",
      to: [contactEmail],
      replyTo: email,
      subject: `New contact message from ${name}`,
      react: (
        <ContactEmail
          name={name}
          email={email}
          message={message}
        />
      ),
    });

    if (error) {
      console.error("Resend error:", error);

      return Response.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        id: data?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API error:", error);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

# 22. Recommended Project Structure

A clean structure for a Next.js project:

```text
src/
├── app/
│   └── api/
│       └── contact/
│           └── route.ts
│
├── emails/
│   └── contact-email.tsx
│
├── lib/
│   ├── resend.ts
│   └── env.ts
│
└── components/
    └── contact-form.tsx
```

Responsibilities:

```text
contact-form.tsx
    ↓
Collect user input

route.ts
    ↓
Validate request
    ↓
Call Resend

contact-email.tsx
    ↓
Define email UI

resend.ts
    ↓
Create Resend client

env.ts
    ↓
Validate configuration
```

This separation prevents email logic from being scattered throughout UI components.

---

# 23. Development vs Production

## Development

It is acceptable to use:

```text
onboarding@resend.dev
```

for basic testing.

You may also use a test recipient supported by Resend.

## Production

Use:

```text
contact@yourdomain.com
```

from a verified domain.

Example:

```ts
from: "Portfolio <contact@hoceinir.ir>"
```

And:

```ts
to: [process.env.CONTACT_EMAIL!]
```

---

# 24. Testing Checklist

Before deploying a contact form, test:

```text
[ ] Form submits successfully
[ ] Empty name is rejected
[ ] Invalid email is rejected
[ ] Empty message is rejected
[ ] Very long message is rejected
[ ] Email is sent
[ ] Email appears in Resend
[ ] Email reaches your inbox
[ ] Subject is correct
[ ] Name is displayed correctly
[ ] Visitor email is displayed correctly
[ ] Message is displayed correctly
[ ] Reply-To is correct
[ ] Clicking Reply goes to the visitor
[ ] API key is not exposed to browser
[ ] Production environment variables exist
[ ] Production domain is verified
[ ] Spam protection is enabled
```

---

# 25. Common Problems

## Problem: `Failed to render React component`

Error:

```text
Failed to render React component.
Make sure to install @react-email/render
or @react-email/components.
```

Solution:

```bash
pnpm add @react-email/render @react-email/components
```

Then rebuild.

---

## Problem: Email goes to `onboarding@resend.dev`

Check environment variables.

For example:

```ts
to: process.env.CONTACT_EMAIL ?? "onboarding@resend.dev"
```

If:

```text
CONTACT_EMAIL
```

does not exist in Vercel, the fallback will be used.

Better:

```ts
const contactEmail = process.env.CONTACT_EMAIL;

if (!contactEmail) {
  throw new Error("CONTACT_EMAIL is not configured");
}
```

---

## Problem: Works locally but not on Vercel

Check:

```text
RESEND_API_KEY
CONTACT_EMAIL
```

in:

```text
Vercel → Project → Settings → Environment Variables
```

Then redeploy.

Remember:

```text
.env.local
```

on your computer does not automatically become:

```text
Vercel Environment Variables
```

---

## Problem: Email is sent but never arrives

Check:

1. Resend dashboard
2. Delivery status
3. Recipient address
4. Spam/Junk folder
5. Domain verification
6. DNS records
7. Sender address
8. Bounce/suppression information

Do not immediately assume that the API call succeeded means the human recipient saw the message.

---

## Problem: `from` address rejected

If using:

```ts
from: "contact@yourdomain.com"
```

make sure the domain is verified in Resend.

---

## Problem: Reply goes to the wrong address

Check:

```ts
replyTo: email
```

Do not confuse:

```ts
from
```

with:

```ts
replyTo
```

For a contact form, the recommended pattern is:

```text
From:
contact@yourdomain.com

To:
you@example.com

Reply-To:
visitor@example.com
```

---

# 26. Email Templates

Resend also supports hosted Templates.

Instead of sending the React component directly, a template can be stored in Resend and referenced when sending an email.

Conceptually:

```ts
await resend.emails.send({
  from: "App <contact@yourdomain.com>",
  to: ["user@example.com"],
  template: {
    id: "template-id",
    variables: {
      name: "John",
      product: "Example",
    },
  },
});
```

Templates are useful when:

- Non-developers need to edit emails
- Multiple applications share templates
- Email designs should be managed centrally
- You want versioned hosted templates

For a small developer-owned portfolio, React Email templates inside the repository are usually simpler.

---

# 27. React Email Best Practices

Email HTML is not the same as normal web HTML.

Email clients have inconsistent support for:

- CSS
- Flexbox
- Grid
- JavaScript
- External stylesheets
- Modern browser APIs

Prefer React Email components such as:

```tsx
<Html>
<Body>
<Container>
<Section>
<Row>
<Column>
<Text>
<Heading>
<Button>
<Link>
<Img>
```

Keep email layouts simple and test them across major email clients.

Do not assume:

```text
"If it works in Chrome, it works in Gmail."
```

That would be far too reasonable for the email ecosystem.

---

# 28. Attachments

Resend supports email attachments.

Conceptually:

```ts
await resend.emails.send({
  from: "App <contact@yourdomain.com>",
  to: ["user@example.com"],
  subject: "Your document",
  text: "Please find the document attached.",
  attachments: [
    {
      filename: "document.pdf",
      content: fileBuffer,
    },
  ],
});
```

For production applications, carefully consider:

- Maximum file size
- File type validation
- Malware scanning
- Memory usage
- Storage
- Serverless execution limits

Never trust the extension alone.

---

# 29. Receiving Emails

Sending and receiving are different concepts.

Most applications only need:

```text
Application
   ↓
Resend
   ↓
Your inbox
```

Resend also supports inbound email.

With Receiving, Resend can receive email sent to a receiving domain and notify your application through webhooks.

Example:

```text
Visitor
   │
   │ sends email
   ▼
yourdomain.com
   │
   ▼
Resend Receiving
   │
   ▼
Webhook
   │
   ▼
Next.js API Route
```

This is useful for:

- Support systems
- Ticketing systems
- Email-to-task workflows
- Processing incoming attachments
- Custom email clients
- Automated email processing

For a simple portfolio contact form, this is usually unnecessary.

---

# 30. Receiving Email Webhooks

A webhook can receive an event such as:

```text
email.received
```

Example Next.js route:

```ts
// app/api/webhooks/resend/route.ts

import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const event = await request.json();

  if (event.type === "email.received") {
    console.log("Received email:", event.data);
  }

  return Response.json({ received: true });
}
```

For production, webhook signatures should be verified.

Do not blindly trust incoming webhook requests.

---

# 31. Webhook Verification

Resend provides webhook verification mechanisms.

Conceptually:

```ts
const result = resend.webhooks.verify({
  payload,
  headers: {
    id: req.headers["svix-id"],
    timestamp: req.headers["svix-timestamp"],
    signature: req.headers["svix-signature"],
  },
  webhookSecret: process.env.RESEND_WEBHOOK_SECRET,
});
```

Only process the webhook after successful verification.

This protects the endpoint from arbitrary requests pretending to be Resend.

---

# 32. Retrieving Received Email Content

Inbound webhook events primarily provide metadata.

The full received email content can be retrieved through the Receiving API.

This can include:

- HTML
- Plain text
- Headers
- Attachments

This distinction matters:

```text
Webhook
    ↓
"You received email ID X"

Receiving API
    ↓
"Here is the actual email content"
```

This architecture is especially useful when attachments are involved.

---

# 33. Replying to Received Emails

When building a full inbound email system, email threading matters.

Email clients use message metadata such as:

```text
Message-ID
In-Reply-To
```

Resend supports replying to received emails in the same thread.

The received message's `message_id` can be used in the:

```text
In-Reply-To
```

header.

This is an advanced feature and is not required for a normal contact form.

---

# 34. API Key Security

Resend API keys are secrets.

Best practices:

```text
DO:
- Store keys in environment variables
- Keep keys server-side
- Use separate keys when appropriate
- Restrict permissions
- Rotate compromised keys
- Avoid logging keys

DO NOT:
- Commit keys to Git
- Put keys in frontend code
- Use NEXT_PUBLIC_ for secrets
- Paste keys into public issues
- Store keys in client-side localStorage
```

Resend supports different API key permissions, including full access and sending access.

For applications that only need to send emails, a restricted sending key can reduce the potential impact of a compromised key.

---

# 35. Separate Development and Production Keys

For larger projects, consider separate credentials:

```text
Development
    RESEND_API_KEY=re_dev_...

Production
    RESEND_API_KEY=re_prod_...
```

This reduces the risk of development code accidentally sending production emails.

Environment-specific keys also make debugging easier.

---

# 36. Logging and Observability

Do not log sensitive information unnecessarily.

Good:

```ts
console.error("Failed to send contact email", {
  error,
  timestamp: new Date().toISOString(),
});
```

Avoid:

```ts
console.log({
  apiKey,
  email,
  password,
  sensitiveData,
});
```

For a contact form, useful logs include:

- Request success/failure
- Resend email ID
- Error category
- Timestamp
- Application route

For example:

```ts
console.log("Contact email sent:", data?.id);
```

The email ID can help investigate delivery issues in the Resend dashboard.

---

# 37. Recommended Production Architecture for a Portfolio

For a personal portfolio, keep the architecture simple:

```text
Next.js
│
├── Contact Form
│
├── /api/contact
│       │
│       ├── Validate input
│       ├── Rate limit
│       ├── Send via Resend
│       └── Return response
│
├── /emails
│       └── contact-email.tsx
│
└── /lib
        ├── resend.ts
        └── env.ts
```

Environment:

```env
RESEND_API_KEY=...
CONTACT_EMAIL=...
```

Resend:

```text
Verified domain
       ↓
contact@yourdomain.com
```

Email:

```text
From:
contact@yourdomain.com

To:
your personal inbox

Reply-To:
visitor's email
```

This is enough for the vast majority of portfolio contact forms.

---

# 38. Recommended Contact Form Flow

The complete request should look like this:

```text
1. User opens portfolio
        ↓
2. User fills:
   - Name
   - Email
   - Message
        ↓
3. Browser sends request
        ↓
4. Server validates data
        ↓
5. Server checks rate limit
        ↓
6. Server renders React Email
        ↓
7. Resend API receives email
        ↓
8. Resend delivers email
        ↓
9. Email appears in owner's inbox
        ↓
10. Owner clicks Reply
        ↓
11. Reply goes to visitor's email
```

---

# 39. Minimal Production Checklist

Before considering the Resend integration complete:

```text
[ ] resend package installed
[ ] @react-email/components installed if needed
[ ] @react-email/render installed if needed
[ ] RESEND_API_KEY configured locally
[ ] RESEND_API_KEY configured in Vercel
[ ] CONTACT_EMAIL configured locally
[ ] CONTACT_EMAIL configured in Vercel
[ ] API key is server-side only
[ ] Domain verified in Resend
[ ] Production `from` address uses verified domain
[ ] `replyTo` points to visitor
[ ] Server-side validation implemented
[ ] Rate limiting or anti-spam protection implemented
[ ] Errors are handled
[ ] Secrets are not logged
[ ] Production deployment tested
[ ] Email delivery verified
[ ] Reply behavior tested
```

---

# 40. Useful Official Resources

- Resend Documentation: https://resend.com/docs
- Send Email with Next.js: https://resend.com/docs/send-with-nextjs
- React Email: https://resend.com/docs/knowledge-base/template-emails-with-react-email
- API Keys: https://resend.com/docs/dashboard/api-keys/introduction
- Receiving Emails: https://resend.com/docs/dashboard/receiving/introduction
- Email Templates: https://resend.com/docs/dashboard/templates/introduction
- Resend Examples: https://resend.com/docs/examples

---

# 41. Summary

For a Next.js portfolio contact form, the recommended setup is:

```text
                 ┌─────────────────────┐
                 │     Contact Form    │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Next.js Server    │
                 │                     │
                 │ Validate input      │
                 │ Rate limit          │
                 │ Render email        │
                 └──────────┬──────────┘
                            │
                     RESEND_API_KEY
                            │
                            ▼
                 ┌─────────────────────┐
                 │       Resend        │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │    Personal Inbox   │
                 │   Gmail / Outlook   │
                 └──────────┬──────────┘
                            │
                          Reply
                            │
                            ▼
                 ┌─────────────────────┐
                 │       Visitor       │
                 └─────────────────────┘
```

The core implementation is intentionally small:

```ts
await resend.emails.send({
  from: "Portfolio <contact@yourdomain.com>",
  to: [process.env.CONTACT_EMAIL!],
  replyTo: visitorEmail,
  subject: `New contact message from ${name}`,
  react: (
    <ContactEmail
      name={name}
      email={visitorEmail}
      message={message}
    />
  ),
});
```

The important production principles are:

1. Keep the Resend API key server-side.
2. Store configuration in environment variables.
3. Configure those variables separately in Vercel.
4. Verify your production domain.
5. Use a stable `from` address from your own domain.
6. Use `replyTo` for the visitor's address.
7. Validate and rate-limit public contact endpoints.
8. Use React Email for maintainable email templates.
9. Use the Resend dashboard for delivery monitoring and debugging.
10. Use Receiving/Webhooks only when the application actually needs inbound email processing.