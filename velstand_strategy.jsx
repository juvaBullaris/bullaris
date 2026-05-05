import { useState } from "react";

const SECTIONS = ["overview", "strategy", "go-to-market", "platform", "roadmap", "financials"];

const NAV_LABELS = {
  overview: "Overview",
  strategy: "Business Strategy",
  "go-to-market": "Go-To-Market",
  platform: "Platform Architecture",
  roadmap: "Tech Roadmap",
  financials: "Financials",
};

export default function App() {
  const [active, setActive] = useState("overview");

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#F7F4EF", minHeight: "100vh", color: "#1a1a1a" }}>
      {/* TOP NAV */}
      <div style={{
        background: "#0F2544",
        padding: "0",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 20px rgba(0,0,0,0.3)"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 0 }}>
          <div style={{ padding: "16px 28px", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ color: "#C8A96E", fontWeight: 900, fontSize: 18, letterSpacing: 1, fontFamily: "Georgia, serif" }}>VELSTAND</span>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, display: "block", letterSpacing: 2, textTransform: "uppercase", marginTop: 2 }}>Business Plan</span>
          </div>
          <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
            {SECTIONS.map(s => (
              <button key={s} onClick={() => setActive(s)} style={{
                background: active === s ? "rgba(200,169,110,0.15)" : "transparent",
                border: "none",
                borderBottom: active === s ? "3px solid #C8A96E" : "3px solid transparent",
                color: active === s ? "#C8A96E" : "rgba(255,255,255,0.55)",
                padding: "18px 20px",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "Georgia, serif",
                letterSpacing: 0.5,
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}>{NAV_LABELS[s]}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        {active === "overview" && <Overview />}
        {active === "strategy" && <Strategy />}
        {active === "go-to-market" && <GoToMarket />}
        {active === "platform" && <Platform />}
        {active === "roadmap" && <Roadmap />}
        {active === "financials" && <Financials />}
      </div>
    </div>
  );
}

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: "#C8A96E", textTransform: "uppercase", marginBottom: 10, fontFamily: "Georgia, serif" }}>{eyebrow}</div>
      <h1 style={{ fontSize: 38, fontWeight: 900, color: "#0F2544", margin: "0 0 12px", lineHeight: 1.15 }}>{title}</h1>
      <div style={{ width: 48, height: 3, background: "#C8A96E", marginBottom: 16 }} />
      {subtitle && <p style={{ fontSize: 17, color: "#555", lineHeight: 1.75, maxWidth: 700, margin: 0 }}>{subtitle}</p>}
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #E8E2D9",
      borderRadius: 6,
      padding: "28px 32px",
      ...style
    }}>{children}</div>
  );
}

function SectionTitle({ children }) {
  return <h2 style={{ fontSize: 20, fontWeight: 900, color: "#0F2544", margin: "0 0 16px", paddingBottom: 8, borderBottom: "2px solid #E8E2D9" }}>{children}</h2>;
}

function Tag({ children, color = "#0F2544" }) {
  return (
    <span style={{
      display: "inline-block", fontSize: 11, fontWeight: 700,
      letterSpacing: 2, textTransform: "uppercase",
      background: color === "#C8A96E" ? "rgba(200,169,110,0.15)" : "rgba(15,37,68,0.08)",
      color: color, padding: "4px 10px", borderRadius: 3, marginRight: 6, marginBottom: 6
    }}>{children}</span>
  );
}

function MetricRow({ label, value, highlight = false }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "12px 0", borderBottom: "1px solid #F0EBE3"
    }}>
      <span style={{ fontSize: 14, color: "#666" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: highlight ? "#C8A96E" : "#0F2544" }}>{value}</span>
    </div>
  );
}

// ─── OVERVIEW ────────────────────────────────────────────────────────────────

function Overview() {
  return (
    <div>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0F2544 0%, #1B3E6B 60%, #0F2544 100%)",
        borderRadius: 8, padding: "52px 56px", marginBottom: 32,
        position: "relative", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 280, height: 280,
          border: "1px solid rgba(200,169,110,0.2)",
          borderRadius: "50%"
        }} />
        <div style={{
          position: "absolute", top: 20, right: 20,
          width: 180, height: 180,
          border: "1px solid rgba(200,169,110,0.1)",
          borderRadius: "50%"
        }} />
        <div style={{ fontSize: 11, letterSpacing: 4, color: "#C8A96E", textTransform: "uppercase", marginBottom: 16 }}>Employee Financial Wellness — Denmark</div>
        <h1 style={{ fontSize: 44, fontWeight: 900, color: "#fff", margin: "0 0 8px", lineHeight: 1.1 }}>Velstand</h1>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", margin: "0 0 28px", fontStyle: "italic" }}>
          From Danish: "prosperity" — a B2B financial wellness benefits broker and platform
        </p>
        <p style={{ fontSize: 16, color: "rgba(255,255,255,0.8)", maxWidth: 620, lineHeight: 1.8, margin: 0 }}>
          A proven US model — employer-funded financial wellness as a competitive benefit — brought to Denmark's unserved market of 22,000+ SMEs and startups, built from a brokerage into a SaaS platform.
        </p>
      </div>

      {/* Stat bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[
          { n: "€94.6B", l: "Global market by 2026" },
          { n: "<5%", l: "Danish employers offering this" },
          { n: "DKK 509K", l: "Avg Danish salary (taxable)" },
          { n: "90%", l: "Workforce with occupational pension" },
        ].map(({ n, l }) => (
          <Card key={l} style={{ textAlign: "center", padding: "22px 16px" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#C8A96E", marginBottom: 6 }}>{n}</div>
            <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{l}</div>
          </Card>
        ))}
      </div>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <Card>
          <SectionTitle>The Opportunity</SectionTitle>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8, marginBottom: 16 }}>
            In the US, <strong>85% of large employers</strong> now offer structured financial wellness benefits. The model is proven: employer pays a per-employee monthly fee; employees get financial education, tools, and coaching. Companies like Origin ($400M valuation) and Brightside were built on this single insight.
          </p>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.8, margin: 0 }}>
            In Denmark, this product does not exist as a packaged, standalone service. HR departments think in traditional terms — salary, pension, gym membership. <strong>The gap is structural and wide open.</strong>
          </p>
        </Card>
        <Card>
          <SectionTitle>Why Denmark Is Ready</SectionTitle>
          <div>
            {[
              ["Complex pension landscape", "3-pillar system most employees don't understand"],
              ["High marginal taxes (55–60%)", "Tax optimisation is genuinely valuable and complex"],
              ["New 'top-top tax' from 2026", "Creates urgent need for financial planning advice"],
              ["Tight talent market", "HR directors actively seeking differentiated benefits"],
              ["Financially sophisticated workforce", "DKK 509K average salary — real investable income"],
            ].map(([a, b]) => (
              <div key={a} style={{ padding: "10px 0", borderBottom: "1px solid #F0EBE3", display: "flex", gap: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C8A96E", marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0F2544" }}>{a}</div>
                  <div style={{ fontSize: 13, color: "#888" }}>{b}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Business evolution */}
      <Card>
        <SectionTitle>The Business in Three Phases</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
          {[
            { phase: "Phase 1", title: "Brokerage", period: "Months 1–12", color: "#0F2544", desc: "Sell manually. You are the product. Build the partner ecosystem, land the first 8–10 employer clients, generate €200K+ in Year 1 revenue, and accumulate the data and insight needed to build the platform." },
            { phase: "Phase 2", title: "Platform", period: "Months 10–24", color: "#1B3E6B", desc: "Launch the Velstand platform: an employee-facing app + employer dashboard. Turn the manual delivery into software. Each new client now costs a fraction of Phase 1 to onboard. MRR becomes predictable." },
            { phase: "Phase 3", title: "Scale", period: "Year 3+", color: "#C8A96E", desc: "Expand to Sweden and Norway using the same playbook. Partner with payroll providers for distribution. Build toward a Series A. The platform becomes the moat; the brokerage becomes the sales channel." },
          ].map(({ phase, title, period, color, desc }, i) => (
            <div key={phase} style={{
              padding: "24px",
              borderRight: i < 2 ? "1px solid #E8E2D9" : "none",
              background: i === 0 ? "rgba(15,37,68,0.03)" : i === 1 ? "rgba(27,62,107,0.03)" : "rgba(200,169,110,0.06)"
            }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color, textTransform: "uppercase", marginBottom: 8 }}>{phase} · {period}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#0F2544", marginBottom: 12 }}>{title}</div>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.75, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── STRATEGY ────────────────────────────────────────────────────────────────

function Strategy() {
  return (
    <div>
      <PageHeader
        eyebrow="Business Strategy"
        title="How Velstand Makes Money"
        subtitle="A broker-first model that transitions to SaaS — low startup cost, high recurring revenue, and a defensible platform moat built on real client data."
      />

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        <Card>
          <SectionTitle>Revenue Model</SectionTitle>
          {[
            { tier: "Financial Wellness Starter", fee: "DKK 150–250 / employee / month", desc: "Monthly financial literacy workshop (live or digital), curated resource library, Q&A access. Entry-level offer for cost-conscious buyers.", tag: "Entry" },
            { tier: "Financial Wellness Core", fee: "DKK 350–550 / employee / month", desc: "Everything in Starter + quarterly 1:1 sessions with a licensed advisor, investment account access, personalised goal-setting dashboard.", tag: "Core" },
            { tier: "Financial Wellness Partner", fee: "DKK 600–900 / employee / month", desc: "Everything in Core + annual tax optimisation review, pension top-up strategy, equity/bonus planning, annual financial health report per employee.", tag: "Premium" },
          ].map(({ tier, fee, desc, tag }) => (
            <div key={tier} style={{ padding: "18px 0", borderBottom: "1px solid #F0EBE3" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0F2544" }}>{tier}</div>
                <Tag color={tag === "Core" ? "#C8A96E" : "#0F2544"}>{tag}</Tag>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#C8A96E", marginBottom: 6 }}>{fee}</div>
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.7 }}>{desc}</div>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: "14px 16px", background: "rgba(15,37,68,0.04)", borderRadius: 4, borderLeft: "3px solid #0F2544" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0F2544", marginBottom: 4 }}>+ One-time Setup Fee</div>
            <div style={{ fontSize: 13, color: "#666" }}>DKK 15,000–25,000 per employer client. Covers integration, onboarding materials, first workshop, and HR manager training.</div>
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card style={{ background: "#0F2544" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#C8A96E", textTransform: "uppercase", marginBottom: 12 }}>Your Role</div>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.8, margin: 0 }}>
              You are the <strong style={{ color: "#fff" }}>commercial front-end</strong>. You sell, onboard, and manage the client relationship. Licensed partners deliver the regulated financial advice. This keeps you outside licensing requirements while you own the distribution.
            </p>
          </Card>
          <Card>
            <SectionTitle>Additional Revenue Streams</SectionTitle>
            {[
              ["Referral fees from partners", "0.5–2% of AUM directed to investment partners"],
              ["Workshop licensing", "Sell recorded content library to smaller employers"],
              ["Platform SaaS fee (Phase 2)", "DKK 50–120/employee/month for platform access"],
              ["Employer analytics upgrade", "DKK 5–10K/month for advanced workforce data"],
            ].map(([a, b]) => (
              <div key={a} style={{ padding: "10px 0", borderBottom: "1px solid #F0EBE3" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0F2544" }}>{a}</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{b}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <Card>
          <SectionTitle>The Partner Ecosystem</SectionTitle>
          <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, marginBottom: 16 }}>
            You build the distribution. Partners build the product. This is the broker model — and it's how you get to market in months, not years.
          </p>
          {[
            { role: "Licensed Financial Advisor", desc: "Delivers 1:1 sessions and formal investment advice. Sources: local IFA firms, Nordnet advisors, PFA, or a boutique wealth manager. You pay them a per-session fee or revenue share.", critical: true },
            { role: "Financial Education Platform", desc: "Powers the content library, workshops, and learning modules. Partner with a European provider (Nudge Global, Salary Finance content layer, or build with existing Danish fintech content).", critical: true },
            { role: "Pension Specialist", desc: "A licensed pension advisor who can navigate Denmark's complex 3-pillar system. This is a major differentiator — most employees have no idea how to optimise their pension contributions.", critical: false },
            { role: "Payroll Provider (Year 2)", desc: "Lessor, Dataløn, or Intect — integration with Danish payroll unlocks data flows and opens their SME client base as a distribution channel.", critical: false },
          ].map(({ role, desc, critical }) => (
            <div key={role} style={{ padding: "12px 0", borderBottom: "1px solid #F0EBE3" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#0F2544" }}>{role}</div>
                {critical && <span style={{ fontSize: 10, background: "rgba(200,169,110,0.2)", color: "#C8A96E", padding: "2px 7px", borderRadius: 3, fontWeight: 700, letterSpacing: 1 }}>DAY 1</span>}
              </div>
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </Card>

        <Card>
          <SectionTitle>Competitive Positioning</SectionTitle>
          <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, marginBottom: 16 }}>
            The Danish benefits landscape leaves a clear gap at the intersection of financial education and workplace delivery.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  {["", "Velstand", "Banks/Pension", "Generic HR platforms", "Large consultancies"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: "left", background: h === "Velstand" ? "#0F2544" : "#F7F4EF", color: h === "Velstand" ? "#C8A96E" : "#888", borderBottom: "2px solid #E8E2D9", fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Employer-packaged benefit", "✓", "✗", "✗", "✓"],
                  ["Affordable for SMEs", "✓", "✗", "✓", "✗"],
                  ["Danish pension expertise", "✓", "✓", "✗", "✓"],
                  ["Employee-facing tools", "✓", "✗", "✗", "✗"],
                  ["Dedicated platform", "✓", "✗", "✗", "✗"],
                  ["Tax optimisation angle", "✓", "✓", "✗", "✓"],
                  ["Startup-friendly pricing", "✓", "✗", "✓", "✗"],
                ].map(([feat, ...vals]) => (
                  <tr key={feat} style={{ background: "transparent" }}>
                    <td style={{ padding: "8px 10px", fontSize: 12, color: "#555", borderBottom: "1px solid #F0EBE3" }}>{feat}</td>
                    {vals.map((v, i) => (
                      <td key={i} style={{ padding: "8px 10px", textAlign: "left", borderBottom: "1px solid #F0EBE3", background: i === 0 ? "rgba(15,37,68,0.03)" : "transparent" }}>
                        <span style={{ color: v === "✓" ? (i === 0 ? "#C8A96E" : "#2A7A2A") : "#ccc", fontWeight: v === "✓" ? 700 : 400 }}>{v}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card>
        <SectionTitle>The ROI Conversation — Your Sales Script</SectionTitle>
        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, marginBottom: 20 }}>
          You don't sell wellness. You sell a measurable financial return. This is where your Economics background turns into a sales superpower. Before every meeting with an HR Director, run this model for their company:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { label: "Cost of one lost employee", value: "DKK 150,000–300,000", sub: "Recruitment, onboarding, productivity loss" },
            { label: "Cost of Velstand Core / year (100 employees)", value: "DKK 540,000 / year", sub: "DKK 450/employee/month × 100 × 12" },
            { label: "Break-even point", value: "2 retained employees", sub: "If 2 people stay who would have left, the program pays for itself" },
          ].map(({ label, value, sub }) => (
            <div key={label} style={{ background: "#F7F4EF", borderRadius: 6, padding: "18px 20px", border: "1px solid #E8E2D9" }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: "#888", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#0F2544", marginBottom: 6 }}>{value}</div>
              <div style={{ fontSize: 12, color: "#999" }}>{sub}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: "14px 18px", background: "rgba(200,169,110,0.1)", borderRadius: 4, borderLeft: "3px solid #C8A96E" }}>
          <p style={{ fontSize: 13, color: "#555", lineHeight: 1.7, margin: 0 }}>
            <strong>The pitch:</strong> "The average cost of replacing one employee in Denmark is DKK 150,000–300,000. If this program retains two people this year who would otherwise have left for a competitor's benefits package, it has paid for itself — at a company of 100 people. Every employee retained beyond that is pure ROI." Build this spreadsheet and bring it to every sales meeting.
          </p>
        </div>
      </Card>
    </div>
  );
}

// ─── GO TO MARKET ─────────────────────────────────────────────────────────────

function GoToMarket() {
  return (
    <div>
      <PageHeader
        eyebrow="Go-To-Market"
        title="From Zero to First 10 Clients"
        subtitle="A step-by-step playbook for the first 12 months — structured as concrete tasks, not vague strategy."
      />

      <div style={{ marginBottom: 20 }}>
        {[
          {
            period: "Month 1–2",
            title: "Foundation",
            color: "#0F2544",
            steps: [
              { task: "Register company", detail: "ApS structure. ~DKK 40,000 minimum capital. Fully digital at virk.dk. Choose a name — 'Velstand' is available and positions well." },
              { task: "Legal consultation", detail: "1 hour with a Danish lawyer (~DKK 3,000). Confirm you can operate as a benefits broker without a financial advisory license. You are facilitating and packaging, not advising." },
              { task: "Sign first advisory partner", detail: "Approach 3–5 independent Danish financial advisors or small IFA firms. Pitch: you bring them employer clients; they deliver the sessions. Revenue share: 30–40% of the per-session fee." },
              { task: "Sign first content partner", detail: "Approach Nudge Global (UK-based, has European clients) or a comparable digital financial education platform. Negotiate a white-label or co-branded reseller agreement." },
              { task: "Build the sales deck", detail: "One deck. 12 slides. Problem → Danish market context → your solution → three tiers → the ROI model → case study slot (placeholder for now) → pricing → next steps." },
            ]
          },
          {
            period: "Month 2–4",
            title: "First Clients",
            color: "#1B3E6B",
            steps: [
              { task: "Target list: 50 companies", detail: "Copenhagen-based. Tech, SaaS, consulting, or pharma. 50–300 employees. Use LinkedIn Sales Navigator. Filter by: HR Director or People Lead title, company headcount, recent job postings (signals growth + HR activity)." },
              { task: "Offer the 'Financial Wellness Audit'", detail: "A free, 10-question anonymous survey you run for a company's employees — reports back how financially stressed the workforce is. Results are almost always alarming enough to open the buying conversation. This is your lead magnet." },
              { task: "Pilot at 50% discount", detail: "Land 2 pilot clients at DKK 200/employee/month (below normal pricing) in exchange for a written case study after 3 months and permission to use their company name in your sales deck." },
              { task: "Referral partnerships", detail: "Meet 3 Copenhagen law firms and accountancy firms serving SMEs. Offer them a referral fee (DKK 5,000 per signed client) or a reciprocal referral arrangement. These firms are asked constantly for HR recommendations." },
              { task: "LinkedIn content engine", detail: "One post per week. Alternating format: Week 1 = hard data post ('Did you know 56% of Danish employees are financially stressed?'), Week 2 = educational post ('3 things about Denmark's pension system your employees don't know')." },
            ]
          },
          {
            period: "Month 5–9",
            title: "Build the Machine",
            color: "#2A5A9F",
            steps: [
              { task: "Systematize delivery", detail: "Document every step of the employer onboarding. Create a playbook: pre-launch email templates, first workshop agenda, 30/60/90 day check-in schedule. This makes it replicable without you doing everything manually." },
              { task: "Collect and publish case studies", detail: "From your pilot clients. Even basic data: '82% of employees completed the financial assessment. Average session NPS: 8.7/10. HR Director quote.' This is worth more than any other marketing at this stage." },
              { task: "HR Director community", detail: "People & Culture Directors in Denmark have a tight community. Attend one HR Denmark event. Speak if possible. One well-connected HR Director who becomes an advocate is worth 5 cold outreach campaigns." },
              { task: "Build the Financial Wellness Score tool", detail: "A simple web-based questionnaire (15 questions, 10 minutes) any Danish company can use to self-assess workforce financial health. Built with Typeform or Tally, connected to a simple results page. Free. Generates qualified inbound leads." },
              { task: "Begin platform specification", detail: "Start defining what the Velstand platform needs to do, based on real feedback from clients in months 1–6. Document every pain point in the manual delivery — each one is a feature." },
            ]
          },
          {
            period: "Month 10–12",
            title: "Towards Platform",
            color: "#C8A96E",
            steps: [
              { task: "Hire or contract a developer", detail: "First technical resource. An experienced freelance full-stack developer (React + Node or similar) on a project basis. Budget: DKK 80,000–150,000 for an MVP. Use the Platform Architecture section to brief them." },
              { task: "Approach payroll providers", detail: "Contact Lessor, Dataløn, and Intect. Initial goal is an integration conversation, not a partnership. Their APIs are the key to unlocking seamless onboarding and long-term distribution." },
              { task: "Reach 10 employer clients", detail: "At 10 clients averaging 80 employees at DKK 350/employee/month = DKK 280,000 MRR = DKK 3.36M ARR. This is the milestone that makes the business fundable." },
              { task: "Consider fundraising", detail: "At DKK 3M+ ARR with 10 clients and a product roadmap, you are a credible Series Seed candidate. Danish pre-seed investors (SEED Capital, The Founders, Heartcore) are active in this space." },
            ]
          },
        ].map(({ period, title, color, steps }) => (
          <Card key={period} style={{ marginBottom: 16, borderLeft: `4px solid ${color}` }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 18 }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: "#999", textTransform: "uppercase" }}>{period}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color }}>— {title}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {steps.map(({ task, detail }) => (
                <div key={task} style={{ display: "flex", gap: 12, padding: "12px 14px", background: "#F7F4EF", borderRadius: 4 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${color}`, flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0F2544", marginBottom: 4 }}>{task}</div>
                    <div style={{ fontSize: 12, color: "#666", lineHeight: 1.65 }}>{detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ background: "#0F2544" }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#C8A96E", textTransform: "uppercase", marginBottom: 12 }}>The Danish Tax Angle — Your Unique Sales Lever</div>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.8, margin: 0 }}>
          From 2026, Denmark introduces a new 'top-top tax' — a 5% additional levy on income above DKK 2.59M, raising the marginal rate to ~60.5%. This creates immediate, tangible demand for tax optimisation advice among high earners. Additionally, Denmark's annuity pension deduction cap of DKK 63,100 per year means there is meaningful money to be structured efficiently for every mid-to-high earner. <strong style={{ color: "#C8A96E" }}>This is your foot in the door with any employer whose workforce includes people earning DKK 700K+ — and that's most Copenhagen tech companies.</strong>
        </p>
      </Card>
    </div>
  );
}

// ─── PLATFORM ─────────────────────────────────────────────────────────────────

function Platform() {
  return (
    <div>
      <PageHeader
        eyebrow="Platform Architecture"
        title="What Velstand Needs to Build"
        subtitle="A two-sided platform: an employee-facing app for financial wellness, and an employer-facing dashboard for HR analytics and program management."
      />

      {/* Architecture diagram */}
      <Card style={{ marginBottom: 20 }}>
        <SectionTitle>System Architecture Overview</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 0, alignItems: "stretch" }}>
          {/* Left: Employee side */}
          <div style={{ padding: "20px", border: "2px solid #0F2544", borderRadius: "6px 0 0 6px", background: "rgba(15,37,68,0.03)" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#0F2544", textTransform: "uppercase", marginBottom: 16 }}>Employee App (Mobile + Web)</div>
            {[
              ["Financial Wellness Score", "Onboarding assessment, personalised baseline"],
              ["Financial Dashboard", "Net worth snapshot, goals, pension overview"],
              ["Education Library", "Courses, articles, videos by life stage"],
              ["Advisor Booking", "Schedule 1:1 with licensed advisor"],
              ["Tax & Pension Tools", "Optimisation calculators, scenario modelling"],
              ["Goal Tracker", "Emergency fund, house savings, retirement projections"],
            ].map(([name, desc]) => (
              <div key={name} style={{ padding: "8px 0", borderBottom: "1px solid #E8E2D9" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0F2544" }}>{name}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{desc}</div>
              </div>
            ))}
          </div>

          {/* Middle: Core */}
          <div style={{ width: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0F2544", padding: "20px 16px" }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#C8A96E", textTransform: "uppercase", marginBottom: 16, textAlign: "center" }}>Velstand Core API</div>
            {[
              "Auth & Multi-tenancy",
              "User Profiles",
              "Content Engine",
              "Advisor Matching",
              "Analytics Engine",
              "Notification Service",
              "Partner API Layer",
              "Payroll Integrations",
            ].map(item => (
              <div key={item} style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(200,169,110,0.2)",
                borderRadius: 4, padding: "6px 10px", marginBottom: 6, fontSize: 11, color: "#fff",
                width: "100%", textAlign: "center"
              }}>{item}</div>
            ))}
          </div>

          {/* Right: Employer side */}
          <div style={{ padding: "20px", border: "2px solid #C8A96E", borderLeft: "none", borderRadius: "0 6px 6px 0", background: "rgba(200,169,110,0.03)" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#C8A96E", textTransform: "uppercase", marginBottom: 16 }}>Employer Dashboard (Web)</div>
            {[
              ["Programme Management", "Add/remove employees, set tier, manage billing"],
              ["Workforce Wellness Analytics", "Anonymised financial stress indicators by team"],
              ["Engagement Metrics", "Usage, session completion, NPS scores"],
              ["Content Customisation", "Brand the platform, add company-specific content"],
              ["Advisor Scheduling", "Book group workshops, manage advisor calendar"],
              ["ROI Report", "Auto-generated quarterly: cost vs. retention impact"],
            ].map(([name, desc]) => (
              <div key={name} style={{ padding: "8px 0", borderBottom: "1px solid #E8E2D9" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#C8A96E" }}>{name}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <Card>
          <SectionTitle>Tech Stack Recommendation</SectionTitle>
          <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, marginBottom: 16 }}>
            Chosen for: fast development speed, strong Danish developer talent pool, GDPR compliance readiness, and scalability to Series A.
          </p>
          {[
            { layer: "Frontend (Employee App)", choice: "React Native (iOS + Android) + Next.js (web)", reason: "One codebase for mobile and web. Large talent pool in Denmark." },
            { layer: "Frontend (Employer Dashboard)", choice: "Next.js + Tailwind CSS", reason: "Fast to build, easy to maintain, server-side rendering for analytics." },
            { layer: "Backend API", choice: "Node.js + TypeScript + Express / Fastify", reason: "Widely available Danish developers. Strong ecosystem for fintech integrations." },
            { layer: "Database", choice: "PostgreSQL (primary) + Redis (caching)", reason: "Relational structure for multi-tenancy. Redis for session management and real-time features." },
            { layer: "Auth", choice: "Auth0 or Supabase Auth", reason: "Enterprise SSO (needed for corporate clients), MFA, GDPR compliance built-in." },
            { layer: "Cloud Infrastructure", choice: "AWS EU-West (Ireland) or Azure North Europe", reason: "GDPR data residency in EU. Both have strong Copenhagen developer communities." },
            { layer: "Content Delivery", choice: "Contentful or Sanity (headless CMS)", reason: "Non-technical team can update educational content without developer involvement." },
            { layer: "Analytics", choice: "Mixpanel (user analytics) + Metabase (employer dashboards)", reason: "Mixpanel for product analytics. Metabase for building the employer ROI reports." },
            { layer: "Payments", choice: "Stripe (subscription billing)", reason: "Best-in-class recurring billing, dunning management, and invoice generation." },
            { layer: "Communication", choice: "SendGrid (email) + OneSignal (push)", reason: "Transactional email and push notifications for engagement reminders." },
          ].map(({ layer, choice, reason }) => (
            <div key={layer} style={{ padding: "10px 0", borderBottom: "1px solid #F0EBE3" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#C8A96E", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>{layer}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F2544", marginBottom: 2 }}>{choice}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{reason}</div>
            </div>
          ))}
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <SectionTitle>Key Integrations</SectionTitle>
            {[
              { name: "Danish Payroll APIs", detail: "Lessor, Dataløn, Intect — for salary data and payroll-deducted contributions. This is the long-term distribution moat.", priority: "Year 2" },
              { name: "PensionsInfo.dk", detail: "Denmark's official pension overview platform. API integration allows employees to see all their pension data in one place inside Velstand.", priority: "MVP" },
              { name: "SKAT (Danish Tax Authority)", detail: "Read access to tax cards and income data (with user consent) enables the tax optimisation tools — a major differentiator.", priority: "Phase 2" },
              { name: "Open Banking (PSD2)", detail: "Connect employee bank accounts (with consent) for net worth tracking and spending insights. Use a provider like Nordigen/GoCardless.", priority: "Phase 2" },
              { name: "Advisor Calendar (Calendly / custom)", detail: "Seamless booking of 1:1 sessions with licensed advisors, visible within the app.", priority: "MVP" },
              { name: "HR Systems (BambooHR, Personio)", detail: "Auto-sync employee roster for employer clients. Reduces admin burden on HR teams significantly.", priority: "Year 2" },
            ].map(({ name, detail, priority }) => (
              <div key={name} style={{ padding: "10px 0", borderBottom: "1px solid #F0EBE3" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0F2544" }}>{name}</div>
                  <Tag color={priority === "MVP" ? "#C8A96E" : "#0F2544"}>{priority}</Tag>
                </div>
                <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{detail}</div>
              </div>
            ))}
          </Card>

          <Card style={{ background: "rgba(15,37,68,0.03)", border: "1px solid #0F2544" }}>
            <SectionTitle>GDPR Architecture Principles</SectionTitle>
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, marginBottom: 12 }}>
              Financial and HR data requires exceptional GDPR discipline. Build these in from Day 1 — retrofitting is 10x more expensive.
            </p>
            {[
              "All financial data encrypted at rest (AES-256) and in transit (TLS 1.3)",
              "Employer analytics are anonymised — no individual data visible to HR without employee consent",
              "Data residency: all data stored in EU servers exclusively",
              "Right to deletion: employee can export and delete all data in-app",
              "Consent management: granular opt-in for each data type at onboarding",
              "Data Processing Agreement (DPA) signed with every employer client",
            ].map(item => (
              <div key={item} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid #E8E2D9", fontSize: 12, color: "#555" }}>
                <span style={{ color: "#C8A96E", fontWeight: 900 }}>✓</span>
                {item}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── ROADMAP ─────────────────────────────────────────────────────────────────

function Roadmap() {
  const [selected, setSelected] = useState(0);

  const phases = [
    {
      phase: "Phase 0",
      label: "Pre-Build",
      period: "Months 1–9",
      color: "#888",
      goal: "Validate before you build. Use manual delivery to learn exactly what to build.",
      deliverables: [
        { item: "Company website + landing page", effort: "1 week", type: "Marketing" },
        { item: "Financial Wellness Audit (Typeform survey)", effort: "3 days", type: "Sales tool" },
        { item: "Sales deck + ROI calculator spreadsheet", effort: "1 week", type: "Sales tool" },
        { item: "Partner agreements (advisor + content)", effort: "4–6 weeks", type: "Legal" },
        { item: "Manual employer onboarding process", effort: "2 weeks", type: "Operations" },
        { item: "Employee assessment questionnaire", effort: "1 week", type: "Product" },
        { item: "Product requirements doc (PRD) v1", effort: "Ongoing from month 6", type: "Product" },
      ],
      tech: "No custom software. Use: Typeform, Notion, Calendly, Stripe (for billing), Google Slides, Airtable for client management.",
      milestone: "8–10 signed employer clients. DKK 200K+ MRR. Clear product spec from real usage pain points.",
    },
    {
      phase: "Phase 1",
      label: "MVP",
      period: "Months 10–16",
      color: "#0F2544",
      goal: "Replace the manual process with software. Focus ruthlessly on the two things that matter most: the employee experience and the employer dashboard.",
      deliverables: [
        { item: "Velstand web app (employee-facing)", effort: "8 weeks", type: "Core" },
        { item: "Financial Wellness Score assessment", effort: "3 weeks", type: "Core" },
        { item: "Basic financial dashboard (net worth overview)", effort: "4 weeks", type: "Core" },
        { item: "Educational content library (curated, not custom)", effort: "3 weeks", type: "Core" },
        { item: "Advisor booking integration (Calendly API)", effort: "1 week", type: "Core" },
        { item: "Employer admin dashboard (employee management)", effort: "5 weeks", type: "Core" },
        { item: "Engagement metrics for employers", effort: "3 weeks", type: "Core" },
        { item: "Stripe subscription billing integration", effort: "2 weeks", type: "Infrastructure" },
        { item: "Auth0 authentication + SSO", effort: "2 weeks", type: "Infrastructure" },
        { item: "GDPR consent management flow", effort: "1 week", type: "Compliance" },
        { item: "PensionsInfo.dk API integration", effort: "3 weeks", type: "Integration" },
      ],
      tech: "React/Next.js frontend. Node.js API. PostgreSQL. Auth0. Stripe. Deployed on AWS EU-West.",
      milestone: "All existing clients migrated to platform. New clients onboarded in <1 hour (vs 1 week manually). NPS >8.",
    },
    {
      phase: "Phase 2",
      label: "Growth Features",
      period: "Months 17–24",
      color: "#1B3E6B",
      goal: "Make the platform defensible. Add the features that create lock-in and differentiation from any hypothetical competitor.",
      deliverables: [
        { item: "Mobile app (React Native — iOS + Android)", effort: "10 weeks", type: "Core" },
        { item: "Open Banking integration (PSD2 via Nordigen)", effort: "6 weeks", type: "Core" },
        { item: "Danish tax optimisation calculator", effort: "6 weeks", type: "Core" },
        { item: "Pension contribution optimiser", effort: "5 weeks", type: "Core" },
        { item: "AI-powered financial insights (personalised)", effort: "8 weeks", type: "Core" },
        { item: "Goal-setting and progress tracking", effort: "4 weeks", type: "Core" },
        { item: "Employer ROI auto-report (PDF generation)", effort: "3 weeks", type: "Employer" },
        { item: "Team-level wellness analytics (anonymised)", effort: "4 weeks", type: "Employer" },
        { item: "Content customisation (employer branding)", effort: "2 weeks", type: "Employer" },
        { item: "Danish payroll API integrations (Lessor, Dataløn)", effort: "8 weeks", type: "Integration" },
        { item: "HR system integrations (BambooHR, Personio)", effort: "6 weeks", type: "Integration" },
        { item: "Multi-language support (Danish + English)", effort: "2 weeks", type: "Infrastructure" },
      ],
      tech: "React Native for mobile. Open Banking via Nordigen. AI layer using Anthropic API for personalised insights. Metabase for employer analytics.",
      milestone: "Series Seed fundable. 25+ employer clients. DKK 700K+ MRR. Mobile app live. Payroll integration active.",
    },
    {
      phase: "Phase 3",
      label: "Scale",
      period: "Year 3+",
      color: "#C8A96E",
      goal: "Nordic expansion. Platform becomes the product. Brokerage becomes the sales channel.",
      deliverables: [
        { item: "Sweden localisation (pension + tax rules)", effort: "12 weeks", type: "Expansion" },
        { item: "Norway localisation", effort: "12 weeks", type: "Expansion" },
        { item: "Marketplace: employer can add/remove benefit modules", effort: "10 weeks", type: "Platform" },
        { item: "Third-party partner integrations (insurance, mortgage)", effort: "Ongoing", type: "Platform" },
        { item: "Employer benchmarking (industry wellness comparisons)", effort: "6 weeks", type: "Platform" },
        { item: "Velstand for Brokers (white-label for HR consultancies)", effort: "8 weeks", type: "Platform" },
        { item: "API for enterprise HR systems (Workday, SAP)", effort: "10 weeks", type: "Enterprise" },
      ],
      tech: "Full platform architecture. Multiple country configs. Enterprise SSO. White-label infrastructure.",
      milestone: "Series A. 100+ employer clients across 3 Nordic markets. Platform generating majority of revenue.",
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Technology Roadmap"
        title="Building Velstand in Four Phases"
        subtitle="A deliberate sequence: validate manually first, then build. Every feature on this roadmap exists because a real client needed it."
      />

      {/* Phase selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {phases.map(({ phase, label, period, color }, i) => (
          <button key={phase} onClick={() => setSelected(i)} style={{
            background: selected === i ? color : "#fff",
            border: `2px solid ${selected === i ? color : "#E8E2D9"}`,
            borderRadius: 6, padding: "16px 14px", cursor: "pointer", textAlign: "left",
            transition: "all 0.2s",
          }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: selected === i ? "rgba(255,255,255,0.7)" : "#999", textTransform: "uppercase", marginBottom: 6 }}>{phase}</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: selected === i ? "#fff" : color, marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 11, color: selected === i ? "rgba(255,255,255,0.6)" : "#aaa" }}>{period}</div>
          </button>
        ))}
      </div>

      {/* Phase detail */}
      {(() => {
        const p = phases[selected];
        return (
          <div>
            <Card style={{ borderLeft: `4px solid ${p.color}`, marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "baseline", marginBottom: 12 }}>
                <div style={{ fontSize: 11, letterSpacing: 3, color: p.color, textTransform: "uppercase" }}>{p.phase} · {p.period}</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0F2544", marginBottom: 8 }}>Goal</div>
              <p style={{ fontSize: 14, color: "#555", lineHeight: 1.75, margin: "0 0 16px" }}>{p.goal}</p>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0F2544", marginBottom: 8 }}>Tech Stack for This Phase</div>
              <div style={{ background: "#F7F4EF", borderRadius: 4, padding: "12px 16px", fontSize: 13, color: "#555", lineHeight: 1.7, marginBottom: 16 }}>{p.tech}</div>
              <div style={{ padding: "12px 16px", background: `rgba(${p.color === "#C8A96E" ? "200,169,110" : "15,37,68"},0.08)`, borderRadius: 4, borderLeft: `3px solid ${p.color}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: p.color, textTransform: "uppercase", marginBottom: 4 }}>Phase Milestone</div>
                <div style={{ fontSize: 13, color: "#555" }}>{p.milestone}</div>
              </div>
            </Card>

            <Card>
              <SectionTitle>Deliverables ({p.deliverables.length} items)</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {p.deliverables.map(({ item, effort, type }) => {
                  const typeColors = { Core: p.color, Infrastructure: "#2A5A9F", Integration: "#1B3E6B", Compliance: "#888", "Sales tool": "#C8A96E", Marketing: "#C8A96E", Legal: "#888", Operations: "#555", Product: "#0F2544", Employer: "#2A5A9F", Expansion: "#C8A96E", Platform: "#0F2544", Enterprise: "#1B3E6B" };
                  const tc = typeColors[type] || "#888";
                  return (
                    <div key={item} style={{ display: "flex", gap: 12, padding: "12px 14px", background: "#F7F4EF", borderRadius: 4, border: "1px solid #E8E2D9" }}>
                      <div style={{ width: 3, background: tc, borderRadius: 2, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#0F2544", lineHeight: 1.4 }}>{item}</div>
                          <Tag color={tc}>{type}</Tag>
                        </div>
                        <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>⏱ {effort}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        );
      })()}
    </div>
  );
}

// ─── FINANCIALS ───────────────────────────────────────────────────────────────

function Financials() {
  return (
    <div>
      <PageHeader
        eyebrow="Financial Projections"
        title="The Numbers"
        subtitle="Conservative projections based on the broker model in Year 1 transitioning to a platform model from Year 2. All figures in DKK."
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
        {[
          { year: "Year 1", rev: "DKK 2.1M", margin: "45–55%", clients: "8–10 employers", model: "Broker", color: "#0F2544" },
          { year: "Year 2", rev: "DKK 5.0M+", margin: "55–65%", clients: "25–30 employers", model: "Broker + Platform", color: "#1B3E6B" },
          { year: "Year 3", rev: "DKK 12M+", margin: "65–75%", clients: "60+ employers (3 markets)", model: "Platform-first", color: "#C8A96E" },
        ].map(({ year, rev, margin, clients, model, color }) => (
          <Card key={year} style={{ borderTop: `4px solid ${color}` }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color, textTransform: "uppercase", marginBottom: 8 }}>{year} · {model}</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#0F2544", marginBottom: 4 }}>{rev}</div>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>Net margin: {margin}</div>
            <MetricRow label="Employer clients" value={clients} />
            <MetricRow label="Avg employees / client" value="80" />
            <MetricRow label="Avg fee / employee / month" value={year === "Year 1" ? "DKK 320" : year === "Year 2" ? "DKK 380" : "DKK 420"} />
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <Card>
          <SectionTitle>Year 1 Revenue Build-Up</SectionTitle>
          {[
            ["2 pilot clients (50% discount) × 80 emp × DKK 200 × 8 months", "DKK 256,000"],
            ["4 Core clients × 80 emp × DKK 350 × 6 months avg", "DKK 672,000"],
            ["2 Partner clients × 60 emp × DKK 700 × 4 months avg", "DKK 336,000"],
            ["8 setup fees × DKK 18,000 avg", "DKK 144,000"],
            ["Workshop fees + content licensing", "DKK 80,000"],
            ["Advisor referral commissions", "DKK 60,000"],
          ].map(([label, value]) => (
            <MetricRow key={label} label={label} value={value} />
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", marginTop: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: "#0F2544" }}>Year 1 Total</span>
            <span style={{ fontSize: 15, fontWeight: 900, color: "#C8A96E" }}>DKK ~1,548,000</span>
          </div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Conservative base. Upsides: larger clients, faster adoption, earlier Partner tier closes push toward DKK 2.1M.</div>
        </Card>

        <Card>
          <SectionTitle>Startup Cost Breakdown</SectionTitle>
          {[
            ["Company registration (ApS)", "DKK 40,000"],
            ["Legal consultation + DPA templates", "DKK 15,000"],
            ["Website + landing page", "DKK 10,000"],
            ["Financial Wellness Audit tool (Typeform etc.)", "DKK 2,000"],
            ["Sales tools (Sales Navigator, CRM)", "DKK 15,000 / year"],
            ["Partner setup (advisor + content)", "DKK 0 (rev share model)"],
            ["Marketing (LinkedIn ads, events)", "DKK 30,000"],
            ["Operating buffer (6 months personal)", "DKK 100,000+"],
          ].map(([label, value]) => (
            <MetricRow key={label} label={label} value={value} />
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", marginTop: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: "#0F2544" }}>Total to start</span>
            <span style={{ fontSize: 15, fontWeight: 900, color: "#C8A96E" }}>DKK ~212,000</span>
          </div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Very low capital requirement. No product to build in Year 1 — your time is the primary investment.</div>
        </Card>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <SectionTitle>Platform Investment (Phase 1 MVP)</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { item: "Freelance full-stack developer (MVP)", cost: "DKK 80,000–150,000", detail: "6–10 weeks of build time. Scope: employee web app + employer dashboard. MVP only — no mobile yet." },
            { item: "Infrastructure & tooling (year 1)", cost: "DKK 20,000–35,000", detail: "AWS / Vercel hosting, Auth0, Stripe, Contentful, analytics tools. Scales with usage." },
            { item: "Design (UX/UI)", cost: "DKK 20,000–40,000", detail: "Freelance designer for the employee app and employer dashboard. Invest here — the app's quality drives employee adoption." },
          ].map(({ item, cost, detail }) => (
            <div key={item} style={{ padding: "18px 20px", background: "#F7F4EF", borderRadius: 6, border: "1px solid #E8E2D9" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F2544", marginBottom: 6 }}>{item}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#C8A96E", marginBottom: 8 }}>{cost}</div>
              <div style={{ fontSize: 12, color: "#666", lineHeight: 1.65 }}>{detail}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: "14px 18px", background: "rgba(15,37,68,0.05)", borderRadius: 4 }}>
          <strong style={{ fontSize: 14, color: "#0F2544" }}>Total platform MVP investment: DKK 120,000–225,000</strong>
          <span style={{ fontSize: 13, color: "#666", marginLeft: 12 }}>Funded from Year 1 broker revenues — no external capital required to build the MVP.</span>
        </div>
      </Card>

      <Card style={{ background: "#0F2544", border: "none" }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "#C8A96E", textTransform: "uppercase", marginBottom: 16 }}>The Long-Term Value Creation Story</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
          {[
            { title: "Why the broker margin is strong", body: "You pay partners 30–40% of the per-session advisory fee. The content/education layer costs are largely fixed. With 100+ employees per client and DKK 350/month average fee, gross margin per client is 60%+ once the partner model is operating smoothly." },
            { title: "Why the platform margin is stronger", body: "Once the platform is built, adding a new employer client costs almost nothing in incremental delivery. The DKK 50–120/employee SaaS fee (Phase 2) runs at 80%+ gross margin. This is why the transition from broker to platform is the strategic imperative." },
            { title: "Why this is fundable at Series Seed", body: "At 25 employer clients, DKK 5M ARR, and a deployed platform: you have recurring revenue, low churn (switching costs are high once employees are onboarded), a clear expansion path to Sweden/Norway, and a market with no local competitor. That is a fundable story." },
          ].map(({ title, body }) => (
            <div key={title}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#C8A96E", marginBottom: 8 }}>{title}</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
