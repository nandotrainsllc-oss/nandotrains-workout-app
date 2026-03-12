import { useState, useEffect } from 'react';

// ─── CONFIG ───────────────────────────────────────────────
const BRAND = 'NANDOTRAINS_';
const IG_HANDLE = '@Nandotrains_';
const IG_URL = 'https://instagram.com/Nandotrains_';
const IG_DM_URL = 'https://ig.me/m/Nandotrains_';
const SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
// EmailJS – create free account at emailjs.com, fill these in:
const EJS_SERVICE = 'service_rlxlsh1';
const EJS_TEMPLATE = 'template_o7qql4t';
const EJS_KEY = 'Mm1eq8Mh2oxxKZdeR';
// ──────────────────────────────────────────────────────────

// ─── STYLES ───────────────────────────────────────────────
const S = {
  app: {
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#f0f0f0',
    fontFamily: "'Segoe UI',sans-serif",
  },
  wrap: { maxWidth: 720, margin: '0 auto', padding: '0 20px' },
  hero: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '60px 20px',
  },
  badge: {
    display: 'inline-block',
    background: '#fff',
    color: '#0a0a0a',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 3,
    padding: '6px 16px',
    borderRadius: 2,
    marginBottom: 28,
    textTransform: 'uppercase',
  },
  h1: {
    fontSize: 'clamp(2.2rem,6vw,3.8rem)',
    fontWeight: 900,
    lineHeight: 1.1,
    margin: '0 0 20px',
    letterSpacing: -1,
  },
  card: {
    background: '#111',
    border: '1px solid #222',
    borderRadius: 8,
    padding: '40px 36px',
    marginBottom: 24,
  },
  lbl: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#aaa',
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  inp: {
    width: '100%',
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: 4,
    padding: '13px 16px',
    color: '#f0f0f0',
    fontSize: 15,
    boxSizing: 'border-box',
    outline: 'none',
  },
  sel: {
    width: '100%',
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: 4,
    padding: '13px 16px',
    color: '#f0f0f0',
    fontSize: 15,
    boxSizing: 'border-box',
    outline: 'none',
  },
  g2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  btn: {
    background: '#fff',
    color: '#0a0a0a',
    border: 'none',
    borderRadius: 4,
    padding: '16px 40px',
    fontSize: 16,
    fontWeight: 800,
    cursor: 'pointer',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  err: { color: '#ff6b6b', fontSize: 13, marginTop: 6 },
  ttl: {
    fontSize: 'clamp(1.6rem,4vw,2.2rem)',
    fontWeight: 900,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
};

const dot = (a, d) => ({
  width: a ? 28 : 10,
  height: 10,
  borderRadius: 5,
  background: d ? '#fff' : a ? '#fff' : '#333',
  transition: 'all .3s',
});
function ProgressBar({ step }) {
  const idx = [
    'landing',
    'lead',
    'questionnaire',
    'generating',
    'results',
    'confirm',
  ].indexOf(step);
  return (
    <div
      style={{
        display: 'flex',
        gap: 6,
        marginBottom: 32,
        justifyContent: 'center',
      }}
    >
      {[1, 2, 3].map((s, i) => (
        <div key={i} style={dot(idx === s, idx > s)} />
      ))}
    </div>
  );
}

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: '1px solid #222',
        borderRadius: 8,
        marginBottom: 12,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          background: open ? '#1a1a1a' : '#111',
          border: 'none',
          padding: '18px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          color: '#fff',
        }}
      >
        <span style={{ fontWeight: 800, fontSize: 15 }}>{title}</span>
        <span
          style={{
            fontSize: 20,
            color: '#888',
            transform: open ? 'rotate(45deg)' : 'rotate(0)',
            transition: 'transform .25s',
          }}
        >
          +
        </span>
      </button>
      {open && (
        <div
          style={{
            background: '#0f0f0f',
            padding: 20,
            borderTop: '1px solid #1a1a1a',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

const secHdr = (t) => (
  <div
    style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}
  >
    <div
      style={{ height: 2, width: 20, background: '#fff', borderRadius: 2 }}
    />
    <span
      style={{
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: 2,
        color: '#fff',
        textTransform: 'uppercase',
      }}
    >
      {t}
    </span>
  </div>
);

function renderLines(lines) {
  const isOL = (l) =>
    l.includes('|') && /[\u{1F300}-\u{1FFFF}🔺💪📈⚡✅🔥⬆️🧠🗓️💡]/u.test(l);
  const olLines = lines.filter(isOL);
  if (olLines.length >= 2)
    return (
      <div>
        <style>{`
        @keyframes roseParticle{0%{transform:translateY(0) scale(1);opacity:.9}100%{transform:translateY(-80px) scale(.2);opacity:0}}
        @keyframes roseGlow{0%,100%{box-shadow:0 0 12px rgba(183,110,121,.3);border-color:rgba(183,110,121,.4)}50%{box-shadow:0 0 28px rgba(212,175,55,.4);border-color:rgba(212,175,55,.5)}}
        @keyframes roseShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @keyframes roseEmoji{0%,100%{transform:scale(1) rotate(-4deg);filter:drop-shadow(0 0 4px rgba(212,175,55,.6))}50%{transform:scale(1.2) rotate(4deg);filter:drop-shadow(0 0 12px rgba(183,110,121,.9))}}
      `}</style>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}
        >
          {olLines.map((line, j) => {
            const [e, l, d] = line.split('|').map((p) => p.trim());
            const pc = ['#D4AF37', '#B76E79', '#C9956C', '#E8C4B8'];
            return (
              <div
                key={j}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  background:
                    'linear-gradient(145deg,rgba(183,110,121,.1),rgba(212,175,55,.05))',
                  border: '1px solid rgba(183,110,121,.35)',
                  borderRadius: 12,
                  padding: '20px 18px',
                  animation: `roseGlow 2.8s ease-in-out ${j * 0.4}s infinite`,
                }}
                onMouseEnter={(e2) => {
                  e2.currentTarget.style.background =
                    'linear-gradient(145deg,rgba(183,110,121,.22),rgba(212,175,55,.12))';
                }}
                onMouseLeave={(e2) => {
                  e2.currentTarget.style.background =
                    'linear-gradient(145deg,rgba(183,110,121,.1),rgba(212,175,55,.05))';
                }}
              >
                {[...Array(4)].map((_, pi) => (
                  <div
                    key={pi}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: `${15 + pi * 22}%`,
                      width: 3,
                      height: 6,
                      borderRadius: '50%',
                      background: pc[pi % 4],
                      filter: 'blur(1px)',
                      animation: `roseParticle ${1.8 + pi * 0.4}s ease-in ${
                        pi * 0.5
                      }s infinite`,
                    }}
                  />
                ))}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '15%',
                    right: '15%',
                    height: 1,
                    background:
                      'linear-gradient(90deg,transparent,#B76E79,#D4AF37,#B76E79,transparent)',
                    opacity: 0.7,
                  }}
                />
                <div
                  style={{
                    fontSize: 28,
                    marginBottom: 10,
                    display: 'inline-block',
                    animation: `roseEmoji 2.2s ease-in-out ${
                      j * 0.3
                    }s infinite`,
                  }}
                >
                  {e}
                </div>
                <div
                  style={{
                    fontWeight: 900,
                    fontSize: 13,
                    marginBottom: 8,
                    background:
                      'linear-gradient(90deg,#D4AF37,#B76E79,#D4AF37)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    animation: 'roseShift 3s linear infinite',
                  }}
                >
                  {l}
                </div>
                <div
                  style={{ fontSize: 13, color: '#c9a0a8', lineHeight: 1.65 }}
                >
                  {d}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  return lines.map((line, j) => {
    const isDay = /^Day\s*\d|^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/i.test(line);
    const isBullet = /^[-•]/.test(line);
    const isEx = /\d+\s*[x×]\s*\d+|\d+\s*sets/i.test(line);
    if (isDay)
      return (
        <div
          key={j}
          style={{
            background: '#1a1a1a',
            borderLeft: '3px solid #fff',
            borderRadius: '0 4px 4px 0',
            padding: '8px 14px',
            marginBottom: 8,
            fontWeight: 700,
            color: '#fff',
            fontSize: 14,
          }}
        >
          {line}
        </div>
      );
    if (isEx)
      return (
        <div
          key={j}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '7px 0',
            borderBottom: '1px solid #1a1a1a',
            fontSize: 14,
            color: '#ddd',
          }}
        >
          <span>{line.replace(/\d+\s*[x×]\s*\d+.*/, '').trim()}</span>
          <span
            style={{
              color: '#fff',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              marginLeft: 12,
            }}
          >
            {(line.match(/\d+\s*[x×]\s*[\d–\-]+[\w\s]*/) || [''])[0]}
          </span>
        </div>
      );
    if (isBullet)
      return (
        <div
          key={j}
          style={{
            display: 'flex',
            gap: 10,
            padding: '5px 0',
            fontSize: 14,
            color: '#bbb',
            lineHeight: 1.6,
          }}
        >
          <span style={{ color: '#555', marginTop: 2 }}>›</span>
          <span>{line.replace(/^[-•]\s*/, '')}</span>
        </div>
      );
    return (
      <p
        key={j}
        style={{
          fontSize: 14,
          color: '#aaa',
          lineHeight: 1.7,
          margin: '4px 0',
        }}
      >
        {line}
      </p>
    );
  });
}

function PlanDisplay({ plan }) {
  if (!plan) return null;
  const lines = plan.split('\n').filter(Boolean);
  const sections = [];
  let cur = null;
  for (const l of lines) {
    if (/^[A-Z][A-Z\s]{4,}/.test(l)) {
      if (cur) sections.push(cur);
      cur = { title: l.replace(/:$/, '').trim(), lines: [] };
    } else {
      if (!cur) cur = { title: null, lines: [] };
      cur.lines.push(l);
    }
  }
  if (cur) sections.push(cur);
  const isPhase = (t) => t && /WEEKS?\s*\d/i.test(t) && /SCHEDULE/i.test(t);
  const pLabels = [
    'Weeks 1–4: Foundation',
    'Weeks 5–8: Build',
    'Weeks 9–12: Push',
  ];
  const phases = [];
  const phSet = new Set();
  sections.forEach((s, i) => {
    if (isPhase(s.title)) {
      phases.push({ label: pLabels[phases.length] || s.title, lines: s.lines });
      phSet.add(i);
    }
  });
  let inserted = false;
  const out = [];
  sections.forEach((s, i) => {
    if (phSet.has(i)) {
      if (!inserted) {
        out.push(
          <div key="pg" style={{ marginBottom: 28 }}>
            {secHdr('Weekly Schedule')}
            {phases.map((p, pi) => (
              <Accordion key={pi} title={p.label}>
                {renderLines(p.lines.length ? p.lines : ['Coming soon.'])}
              </Accordion>
            ))}
          </div>
        );
        inserted = true;
      }
    } else if (s.title || s.lines.length) {
      out.push(
        <div key={i} style={{ marginBottom: 28 }}>
          {s.title && secHdr(s.title)}
          {renderLines(s.lines)}
        </div>
      );
    }
  });
  return <>{out}</>;
}

// ─── PDF GENERATOR ────────────────────────────────────────
async function generatePDF(lead, quiz, plan) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210,
    M = 20,
    TW = W - M * 2;
  let y = 0;
  const NP = () => {
    doc.addPage();
    y = 20;
  };
  const chk = (h = 15) => {
    if (y + h > 275) NP();
  };

  // helpers
  const txt = (t, x, size, color, style = 'normal') => {
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.setFont('helvetica', style);
    doc.text(t, x, y);
  };
  const ln = (h = 7) => {
    y += h;
  };

  // ── COVER ──
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, 210, 297, 'F');
  // gold accent bar
  doc.setFillColor(255, 165, 0);
  doc.rect(0, 0, 210, 4, 'F');
  y = 60;
  doc.setFontSize(11);
  doc.setTextColor(255, 165, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('⚡ PERSONALIZED TRAINING PROGRAM ⚡', W / 2, y, 'center');
  ln(14);
  doc.setFontSize(32);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('YOUR 12-WEEK', W / 2, y, 'center');
  ln(14);
  doc.text('WORKOUT PLAN', W / 2, y, 'center');
  ln(20);
  doc.setFontSize(13);
  doc.setTextColor(180, 180, 180);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'A personalized starter program built around your goals,',
    W / 2,
    y,
    'center'
  );
  ln(7);
  doc.text('schedule, and equipment.', W / 2, y, 'center');
  ln(24);
  doc.setFontSize(18);
  doc.setTextColor(255, 165, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(BRAND, W / 2, y, 'center');
  ln(6);
  doc.setFontSize(12);
  doc.setTextColor(120, 120, 120);
  doc.text(IG_HANDLE, W / 2, y, 'center');
  ln(30);
  // divider
  doc.setDrawColor(255, 165, 0);
  doc.setLineWidth(0.5);
  doc.line(M, y, W - M, y);
  ln(12);
  doc.setFontSize(11);
  doc.setTextColor(160, 160, 160);
  doc.setFont('helvetica', 'normal');
  doc.text(`Prepared for: ${lead.email}`, W / 2, y, 'center');
  ln(7);
  doc.text(
    `Generated: ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`,
    W / 2,
    y,
    'center'
  );
  // bottom bar
  doc.setFillColor(255, 165, 0);
  doc.rect(0, 293, 210, 4, 'F');

  // ── PROFILE PAGE ──
  NP();
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, 210, 297, 'F');
  doc.setFillColor(255, 165, 0);
  doc.rect(0, 0, 210, 4, 'F');
  doc.setFontSize(9);
  doc.setTextColor(255, 165, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('YOUR PROFILE', M, y);
  ln(10);
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('About You', M, y);
  ln(12);
  const profileRows = [
    ['Goal', quiz.goal],
    ['Experience', quiz.experience],
    ['Training Days', quiz.days],
    ['Location', quiz.location],
    ['Session Length', quiz.sessionLength],
    ['Focus Muscles', quiz.focusMuscles || 'Overall'],
    ['Injuries', quiz.injuries || 'None'],
    ['Equipment', quiz.equipment || 'Standard gym'],
  ];
  profileRows.forEach(([k, v]) => {
    if (!v) return;
    chk(10);
    doc.setFontSize(9);
    doc.setTextColor(255, 165, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(k.toUpperCase(), M, y);
    doc.setFontSize(11);
    doc.setTextColor(220, 220, 220);
    doc.setFont('helvetica', 'normal');
    doc.text(String(v), M + 50, y);
    ln(9);
  });
  doc.setFillColor(255, 165, 0);
  doc.rect(0, 293, 210, 4, 'F');

  // ── PLAN PAGES ──
  const planSections = plan.split('\n\n').filter(Boolean);
  NP();
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, 210, 297, 'F');
  doc.setFillColor(255, 165, 0);
  doc.rect(0, 0, 210, 4, 'F');
  for (const section of planSections) {
    const sLines = section.split('\n').filter(Boolean);
    if (!sLines.length) continue;
    const heading = /^[A-Z][A-Z\s]{4,}/.test(sLines[0]);
    if (heading) {
      chk(20);
      doc.setFontSize(9);
      doc.setTextColor(255, 165, 0);
      doc.setFont('helvetica', 'bold');
      doc.text(sLines[0], M, y);
      ln(8);
      sLines.slice(1).forEach((l) => {
        chk(8);
        renderPDFLine(doc, l, M, y, TW);
        ln(7);
      });
    } else {
      sLines.forEach((l) => {
        chk(8);
        renderPDFLine(doc, l, M, y, TW);
        ln(7);
      });
    }
    ln(4);
    if (y > 250) NP();
  }

  // ── CTA PAGE ──
  NP();
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, 210, 297, 'F');
  doc.setFillColor(30, 144, 255);
  doc.rect(0, 0, 210, 4, 'F');
  y = 50;
  doc.setFontSize(9);
  doc.setTextColor(30, 144, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('READY TO LEVEL UP?', W / 2, y, 'center');
  ln(12);
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('This plan is your foundation.', W / 2, y, 'center');
  ln(11);
  doc.text('Coaching is your accelerator.', W / 2, y, 'center');
  ln(18);
  doc.setFontSize(12);
  doc.setTextColor(170, 170, 170);
  doc.setFont('helvetica', 'normal');
  const ctaLines = [
    'Having a plan is great — having a coach in your corner',
    'is what actually drives real results.',
    '',
    'Follow me on Instagram for daily tips and motivation,',
    'or DM me directly if you want a custom program.',
  ];
  ctaLines.forEach((l) => {
    doc.text(l, W / 2, y, 'center');
    ln(7);
  });
  ln(16);
  doc.setFontSize(14);
  doc.setTextColor(30, 144, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(IG_HANDLE, W / 2, y, 'center');
  ln(10);
  doc.setFontSize(11);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.text('DM me the word PLAN to get started.', W / 2, y, 'center');
  doc.setFillColor(30, 144, 255);
  doc.rect(0, 293, 210, 4, 'F');

  return doc.output('datauristring');
}

function renderPDFLine(doc, line, x, y, tw) {
  const isDay = /^Day\s*\d|^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/i.test(line);
  const isEx = /\d+\s*[x×]\s*\d+|\d+\s*sets/i.test(line);
  if (isDay) {
    doc.setFontSize(10);
    doc.setTextColor(255, 200, 100);
    doc.setFont('helvetica', 'bold');
    doc.text(line, x, y);
  } else if (isEx) {
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.setFont('helvetica', 'normal');
    doc.text(line.substring(0, 80), x + 4, y);
  } else {
    doc.setFontSize(10);
    doc.setTextColor(170, 170, 170);
    doc.setFont('helvetica', 'normal');
    const wrapped = doc.splitTextToSize(line, tw);
    doc.text(wrapped[0] || '', x, y);
  }
}

// ─── EMAIL SENDER ─────────────────────────────────────────
async function sendEmail(lead, quiz) {
  if (!window.emailjs) {
    await new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src =
        'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      s.onload = res;
      s.onerror = rej;
      document.head.appendChild(s);
    });
    window.emailjs.init(EJS_KEY);
  }

  const params = {
    to_email: lead.email,
    to_name: lead.email.split('@')[0],
    ig_handle: '@' + lead.instagram,
    goal: quiz.goal || 'Not specified',
    days: quiz.days || 'Not specified',
    location: quiz.location || 'Not specified',
    experience: quiz.experience || 'Not specified',
    ig_url: IG_URL,
    ig_dm: IG_DM_URL,
    brand: BRAND,
  };

  console.log('Sending email with params:', params);
  const result = await window.emailjs.send(EJS_SERVICE, EJS_TEMPLATE, params);
  console.log('EmailJS result:', result);
  return result;
}

// ─── SHEET SAVER ──────────────────────────────────────────
async function saveToSheet(lead, quiz, plan) {
  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        email: lead.email,
        instagram: lead.instagram,
        ...quiz,
        planSummary: plan.slice(0, 600),
        pdfSent: true,
      }),
    });
  } catch (e) {
    console.log('Sheet skip', e);
  }
}

// ─── SCREENS ──────────────────────────────────────────────
function Landing({ onStart }) {
  return (
    <div style={S.hero}>
      <span style={S.badge}>Free Tool</span>
      <h1 style={S.h1}>
        Your Free
        <br />
        <span style={{ borderBottom: '3px solid #fff' }}>
          12-Week Workout Plan
        </span>
      </h1>
      <p
        style={{
          fontSize: 'clamp(1rem,2.5vw,1.2rem)',
          color: '#aaa',
          maxWidth: 520,
          margin: '0 auto 40px',
          lineHeight: 1.7,
        }}
      >
        Answer a few questions and get a personalized training plan — emailed
        straight to your inbox as a PDF.
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          justifyContent: 'center',
          marginBottom: 44,
        }}
      >
        {[
          'Personalized to your goals',
          'PDF emailed to you instantly',
          'Progressive overload built-in',
          'Beginner & intermediate friendly',
        ].map((p) => (
          <span
            key={p}
            style={{
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: 20,
              padding: '8px 18px',
              fontSize: 13,
              color: '#ccc',
            }}
          >
            ✓ {p}
          </span>
        ))}
      </div>
      <button style={S.btn} onClick={onStart}>
        Get My Free Plan →
      </button>
      <p style={{ fontSize: 12, color: '#555', marginTop: 16 }}>
        No credit card. No spam. PDF delivered free.
      </p>
    </div>
  );
}

function LeadForm({ onNext }) {
  const [email, setEmail] = useState('');
  const [ig, setIg] = useState('');
  const [err, setErr] = useState('');
  const go = () => {
    if (!email.includes('@')) return setErr('Enter a valid email.');
    if (!ig.trim()) return setErr('Enter your Instagram handle.');
    setErr('');
    onNext({ email, instagram: ig.trim().replace(/^@/, '') });
  };
  return (
    <div style={{ ...S.hero, minHeight: 'auto', paddingTop: 80 }}>
      <div style={S.wrap}>
        <ProgressBar step="lead" />
        <div style={S.card}>
          <p style={{ ...S.badge, marginBottom: 20 }}>Step 1 of 2</p>
          <h2 style={S.ttl}>Where should we send your PDF?</h2>
          <p style={{ color: '#888', marginBottom: 32, lineHeight: 1.6 }}>
            We'll email your full 12-week plan as a PDF straight to your inbox.
          </p>
          <div style={{ marginBottom: 20 }}>
            <label style={S.lbl}>Email Address</label>
            <input
              style={S.inp}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: 28 }}>
            <label style={S.lbl}>Instagram Handle</label>
            <input
              style={S.inp}
              placeholder="@yourhandle"
              value={ig}
              onChange={(e) => setIg(e.target.value)}
            />
          </div>
          {err && <p style={S.err}>{err}</p>}
          <button style={{ ...S.btn, width: '100%' }} onClick={go}>
            Continue →
          </button>
          <p
            style={{
              fontSize: 12,
              color: '#555',
              marginTop: 14,
              textAlign: 'center',
            }}
          >
            Your info is safe. We hate spam too.
          </p>
        </div>
      </div>
    </div>
  );
}

function Questionnaire({ onNext }) {
  const [f, setF] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
    experience: '',
    goal: '',
    days: '',
    location: '',
    equipment: '',
    focusMuscles: '',
    injuries: '',
    sessionLength: '',
  });
  const [err, setErr] = useState('');
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const go = () => {
    const req = [
      'age',
      'gender',
      'experience',
      'goal',
      'days',
      'location',
      'sessionLength',
    ];
    for (const k of req)
      if (!f[k]) return setErr('Fill in all required fields.');
    setErr('');
    onNext(f);
  };
  const Sel = ({ k, label, opts }) => (
    <div style={{ marginBottom: 20 }}>
      <label style={S.lbl}>{label}</label>
      <select
        style={S.sel}
        value={f[k]}
        onChange={(e) => set(k, e.target.value)}
      >
        <option value="">Select...</option>
        {opts.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
  return (
    <div style={{ paddingTop: 60, paddingBottom: 80 }}>
      <div style={S.wrap}>
        <ProgressBar step="questionnaire" />
        <div style={S.card}>
          <p style={S.badge}>Step 2 of 2</p>
          <h2 style={S.ttl}>Tell us about yourself</h2>
          <p style={{ color: '#888', marginBottom: 32, lineHeight: 1.6 }}>
            This helps us build a plan that actually fits your life.
          </p>
          <div style={S.g2}>
            <div style={{ marginBottom: 20 }}>
              <label style={S.lbl}>Age *</label>
              <input
                style={S.inp}
                type="number"
                placeholder="e.g. 25"
                value={f.age}
                onChange={(e) => set('age', e.target.value)}
              />
            </div>
            <Sel
              k="gender"
              label="Gender *"
              opts={['Male', 'Female', 'Other / Prefer not to say']}
            />
          </div>
          <div style={S.g2}>
            <div style={{ marginBottom: 20 }}>
              <label style={S.lbl}>Weight (lbs/kg)</label>
              <input
                style={S.inp}
                placeholder="e.g. 180 lbs"
                value={f.weight}
                onChange={(e) => set('weight', e.target.value)}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={S.lbl}>Height</label>
              <input
                style={S.inp}
                placeholder="e.g. 5'10"
                value={f.height}
                onChange={(e) => set('height', e.target.value)}
              />
            </div>
          </div>
          <Sel
            k="experience"
            label="Training Experience *"
            opts={['Beginner (0–1 year)', 'Intermediate (1–3 years)']}
          />
          <Sel
            k="goal"
            label="Primary Goal *"
            opts={['Fat Loss', 'Muscle Gain', 'General Fitness & Health']}
          />
          <Sel
            k="days"
            label="Training Days Per Week *"
            opts={['3 days/week', '4 days/week', '5 days/week']}
          />
          <Sel
            k="location"
            label="Workout Location *"
            opts={['Gym', 'Home', 'Both']}
          />
          <div style={{ marginBottom: 20 }}>
            <label style={S.lbl}>Equipment Available</label>
            <input
              style={S.inp}
              placeholder="e.g. Dumbbells, barbell, full gym..."
              value={f.equipment}
              onChange={(e) => set('equipment', e.target.value)}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={S.lbl}>Muscle Groups to Focus On</label>
            <input
              style={S.inp}
              placeholder="e.g. Chest, arms, legs..."
              value={f.focusMuscles}
              onChange={(e) => set('focusMuscles', e.target.value)}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={S.lbl}>Injuries or Limitations</label>
            <input
              style={S.inp}
              placeholder="e.g. Bad knees, or none"
              value={f.injuries}
              onChange={(e) => set('injuries', e.target.value)}
            />
          </div>
          <Sel
            k="sessionLength"
            label="Preferred Session Length *"
            opts={['30–45 min', '45–60 min', '60–75 min']}
          />
          {err && <p style={S.err}>{err}</p>}
          <button
            style={{ ...S.btn, width: '100%', marginTop: 8 }}
            onClick={go}
          >
            Generate My 12-Week Plan →
          </button>
        </div>
      </div>
    </div>
  );
}

function Generating({ statusMsg }) {
  const steps = [
    'Analyzing your goals...',
    'Selecting your workout split...',
    'Building 12 weeks of programming...',
    'Creating your PDF...',
    'Sending to your inbox...',
  ];
  const [cur, setCur] = useState(0);
  useEffect(() => {
    const iv = setInterval(
      () => setCur((c) => Math.min(c + 1, steps.length - 1)),
      1200
    );
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={S.hero}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 24 }}>⚡</div>
        <h2 style={S.ttl}>Building Your Plan</h2>
        <p style={{ color: '#888', marginBottom: 40 }}>
          Creating your PDF and sending it to your inbox — give us ~20 seconds.
        </p>
        <div style={{ maxWidth: 340, margin: '0 auto' }}>
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 0',
                opacity: i <= cur ? 1 : 0.2,
                transition: 'opacity .4s',
              }}
            >
              <span style={{ fontSize: 16 }}>
                {i < cur ? '✓' : i === cur ? '›' : '○'}
              </span>
              <span style={{ color: i < cur ? '#aaa' : '#fff', fontSize: 14 }}>
                {s}
              </span>
            </div>
          ))}
        </div>
        {statusMsg && (
          <p style={{ color: '#FF6A00', marginTop: 24, fontSize: 13 }}>
            {statusMsg}
          </p>
        )}
      </div>
    </div>
  );
}

function StatsBanner({ quiz }) {
  const [vis, setVis] = useState(false);
  const [parts, setParts] = useState([]);
  useEffect(() => {
    setTimeout(() => setVis(true), 100);
    setParts(
      [...Array(18)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        dur: 2.5 + Math.random() * 2,
        size: 3 + Math.random() * 5,
        color:
          Math.random() > 0.5
            ? '#FFD700'
            : Math.random() > 0.5
            ? '#FF6A00'
            : '#FF4500',
      }))
    );
  }, []);
  const stats = [
    { icon: '🎯', label: 'Goal', value: quiz.goal },
    { icon: '💪', label: 'Level', value: quiz.experience?.split(' ')[0] },
    {
      icon: '📅',
      label: 'Days/Week',
      value: quiz.days?.replace('/week', '').trim(),
    },
    { icon: '📍', label: 'Location', value: quiz.location },
    { icon: '⏱️', label: 'Per Session', value: quiz.sessionLength },
  ].filter((s) => s.value);
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 32,
        padding: '52px 32px 44px',
        background:
          'linear-gradient(160deg,#0a0a0a 0%,#1a0800 40%,#0a0500 100%)',
        border: '1px solid #FF6A0044',
      }}
    >
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatUp{0%{transform:translateY(0) scale(1);opacity:.9}100%{transform:translateY(-120px) scale(.3);opacity:0}}
        @keyframes flickerGlow{0%,100%{text-shadow:0 0 20px #FF6A00,0 0 60px #FF4500,0 0 100px #FFD700}50%{text-shadow:0 0 40px #FFD700,0 0 80px #FF6A00,0 0 140px #FF4500}}
        @keyframes auraFlare{0%,100%{opacity:.25;transform:scale(1)}50%{opacity:.45;transform:scale(1.08)}}
        @keyframes auraPulse{0%,100%{opacity:.15}50%{opacity:.35}}
        @keyframes cardGlow{0%,100%{box-shadow:0 0 0 transparent}50%{box-shadow:0 0 18px rgba(255,160,0,.25)}}
        @keyframes emojiFlare{0%,100%{transform:scale(1) rotate(-3deg)}50%{transform:scale(1.2) rotate(3deg)}}
        @keyframes ssTextShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
      `}</style>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        {parts.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              bottom: 0,
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 2,
              borderRadius: '50% 50% 30% 30%',
              background: p.color,
              filter: `blur(${p.size * 0.4}px)`,
              animation: `floatUp ${p.dur}s ease-in ${p.delay}s infinite`,
              opacity: 0.9,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 60% at 50% 100%,rgba(255,100,0,.2) 0%,transparent 70%)',
            animation: 'auraFlare 2.5s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 60% 40% at 50% 110%,rgba(255,200,0,.15) 0%,transparent 65%)',
            animation: 'auraPulse 2s ease-in-out .5s infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: 2,
            background:
              'linear-gradient(90deg,transparent,#FF6A00,#FFD700,#FF6A00,transparent)',
            filter: 'blur(2px)',
            opacity: 0.8,
          }}
        />
      </div>
      <div
        style={{
          textAlign: 'center',
          marginBottom: 36,
          position: 'relative',
          animation: vis ? 'fadeUp 0.7s ease forwards' : 'none',
          opacity: 0,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 5,
            color: '#FF6A00',
            textTransform: 'uppercase',
            marginBottom: 12,
            textShadow: '0 0 12px #FF6A00',
          }}
        >
          ⚡ Power Level Unlocked ⚡
        </div>
        <div
          style={{
            fontSize: 'clamp(1.8rem,5vw,2.8rem)',
            fontWeight: 900,
            letterSpacing: -1,
            lineHeight: 1.1,
            animation: 'flickerGlow 2.5s ease-in-out infinite',
          }}
        >
          <span
            style={{
              background:
                'linear-gradient(90deg,#FFD700,#FF6A00,#FF4500,#FFD700)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'ssTextShift 3s linear infinite',
            }}
          >
            12 Weeks.
          </span>
          <br />
          <span
            style={{ color: '#fff', textShadow: '0 0 30px rgba(255,160,0,.6)' }}
          >
            Your Power. Unleashed.
          </span>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {stats.map(({ icon, label, value }, i) => (
          <div
            key={label}
            style={{
              background:
                'linear-gradient(145deg,rgba(255,100,0,.08),rgba(255,50,0,.03))',
              border: '1px solid rgba(255,120,0,.3)',
              borderRadius: 12,
              padding: '18px 22px',
              textAlign: 'center',
              minWidth: 110,
              backdropFilter: 'blur(10px)',
              animation: vis
                ? `fadeUp 0.5s ease ${
                    0.15 + i * 0.1
                  }s forwards, cardGlow 2.5s ease-in-out ${i * 0.3}s infinite`
                : 'none',
              opacity: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(145deg,rgba(255,140,0,.18),rgba(255,80,0,.1))';
              e.currentTarget.style.borderColor = '#FFD700';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                'linear-gradient(145deg,rgba(255,100,0,.08),rgba(255,50,0,.03))';
              e.currentTarget.style.borderColor = 'rgba(255,120,0,.3)';
            }}
          >
            <div
              style={{
                fontSize: 26,
                marginBottom: 8,
                animation: 'emojiFlare 2s ease-in-out infinite',
                display: 'inline-block',
              }}
            >
              {icon}
            </div>
            <div
              style={{
                fontSize: 10,
                color: '#FF6A00',
                fontWeight: 800,
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginBottom: 5,
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 900,
                color: '#FFD700',
                textShadow: '0 0 10px rgba(255,200,0,.5)',
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfirmBanner({ email }) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg,rgba(0,80,0,.3),rgba(0,40,0,.2))',
        border: '1px solid rgba(0,200,100,.3)',
        borderRadius: 12,
        padding: '24px 28px',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
      }}
    >
      <div style={{ fontSize: 36 }}>📩</div>
      <div>
        <div
          style={{
            fontWeight: 800,
            fontSize: 15,
            color: '#00E676',
            marginBottom: 4,
          }}
        >
          PDF Sent to Your Inbox!
        </div>
        <div style={{ fontSize: 13, color: '#aaa', lineHeight: 1.6 }}>
          Your full 12-week plan has been emailed to{' '}
          <strong style={{ color: '#fff' }}>{email}</strong>. Check your spam
          folder if you don't see it within a minute.
        </div>
      </div>
    </div>
  );
}

function Results({ plan, lead, quiz, emailSent }) {
  if (!plan)
    return (
      <div style={S.hero}>
        <p style={{ color: '#888' }}>No plan generated. Please try again.</p>
      </div>
    );
  return (
    <div style={{ paddingTop: 60, paddingBottom: 100 }}>
      <div style={S.wrap}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span style={S.badge}>Your Plan is Ready</span>
          <h2
            style={{
              ...S.ttl,
              fontSize: 'clamp(1.8rem,5vw,2.8rem)',
              marginTop: 12,
            }}
          >
            Your 12-Week Program
          </h2>
          <p style={{ color: '#888', maxWidth: 480, margin: '12px auto 0' }}>
            Built specifically for your goals. Follow this consistently and you
            will see real results.
          </p>
        </div>

        {emailSent && <ConfirmBanner email={lead.email} />}

        <StatsBanner quiz={quiz} />

        <div style={{ ...S.card, marginBottom: 28 }}>
          <PlanDisplay plan={plan} />
        </div>

        {/* SSB CTA */}
        <div
          style={{
            position: 'relative',
            borderRadius: 16,
            overflow: 'hidden',
            marginTop: 40,
            padding: '52px 36px 44px',
            background:
              'linear-gradient(160deg,#0a0a0a 0%,#00080f 40%,#000d1a 100%)',
            border: '1px solid rgba(0,150,255,.25)',
            textAlign: 'center',
          }}
        >
          <style>{`
            @keyframes blueParticle{0%{transform:translateY(0) scale(1);opacity:.9}100%{transform:translateY(-110px) scale(.2);opacity:0}}
            @keyframes blueAura{0%,100%{opacity:.2;transform:scale(1)}50%{opacity:.4;transform:scale(1.06)}}
            @keyframes blueTextShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
            @keyframes blueFlicker{0%,100%{text-shadow:0 0 20px #00BFFF,0 0 60px #1E90FF,0 0 100px #00CED1}50%{text-shadow:0 0 40px #1E90FF,0 0 90px #00BFFF,0 0 140px #00CED1}}
            @keyframes btnBlueGlow{0%,100%{box-shadow:0 0 12px rgba(0,150,255,.4)}50%{box-shadow:0 0 28px rgba(0,191,255,.7)}}
          `}</style>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              overflow: 'hidden',
            }}
          >
            {[...Array(16)].map((_, i) => {
              const c = ['#00BFFF', '#1E90FF', '#00CED1', '#4169E1'];
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: `${(i / 16) * 100}%`,
                    width: 3 + Math.random() * 5,
                    height: 6 + Math.random() * 8,
                    borderRadius: '50%',
                    background: c[i % 4],
                    filter: 'blur(1.5px)',
                    animation: `blueParticle ${2 + (i % 4) * 0.5}s ease-in ${
                      (i % 5) * 0.4
                    }s infinite`,
                  }}
                />
              );
            })}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse 80% 60% at 50% 100%,rgba(0,150,255,.18) 0%,transparent 70%)',
                animation: 'blueAura 2.5s ease-in-out infinite',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '10%',
                right: '10%',
                height: 2,
                background:
                  'linear-gradient(90deg,transparent,#1E90FF,#00BFFF,#00CED1,#1E90FF,transparent)',
                filter: 'blur(2px)',
              }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 5,
                color: '#1E90FF',
                textTransform: 'uppercase',
                marginBottom: 12,
                textShadow: '0 0 12px #1E90FF',
              }}
            >
              ⚡ Next Level Awaits ⚡
            </div>
            <h3
              style={{
                fontSize: 'clamp(1.6rem,4vw,2.4rem)',
                fontWeight: 900,
                marginBottom: 16,
                lineHeight: 1.15,
                animation: 'blueFlicker 2.5s ease-in-out infinite',
              }}
            >
              <span
                style={{
                  background:
                    'linear-gradient(90deg,#00BFFF,#1E90FF,#00CED1,#00BFFF)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'blueTextShift 3s linear infinite',
                }}
              >
                This plan is your foundation.
              </span>
              <br />
              <span
                style={{
                  color: '#fff',
                  textShadow: '0 0 30px rgba(0,150,255,.5)',
                }}
              >
                Coaching is your accelerator.
              </span>
            </h3>
            <p
              style={{
                color: '#7ab8d4',
                maxWidth: 460,
                margin: '0 auto 36px',
                lineHeight: 1.75,
                fontSize: 15,
              }}
            >
              Having a plan is great. Having someone in your corner — checking
              your form, adjusting your program, and keeping you accountable —
              is what actually gets results.
            </p>
            <div
              style={{
                display: 'flex',
                gap: 14,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <a href={IG_URL} target="_blank" rel="noreferrer">
                <button
                  style={{
                    background: 'linear-gradient(135deg,#1E90FF,#00BFFF)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '16px 36px',
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: 'pointer',
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    animation: 'btnBlueGlow 2s ease-in-out infinite',
                  }}
                >
                  Follow {IG_HANDLE}
                </button>
              </a>
              <a href={IG_DM_URL} target="_blank" rel="noreferrer">
                <button
                  style={{
                    background: 'transparent',
                    color: '#00BFFF',
                    border: '1px solid rgba(0,191,255,.5)',
                    borderRadius: 6,
                    padding: '15px 28px',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0,150,255,.15)';
                    e.currentTarget.style.borderColor = '#00BFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(0,191,255,.5)';
                  }}
                >
                  DM for Coaching
                </button>
              </a>
            </div>
            <p style={{ fontSize: 12, color: '#1E4F6B', marginTop: 24 }}>
              📧 PDF delivered to {lead.email}
            </p>
          </div>
        </div>
        <p
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: '#333',
            marginTop: 32,
          }}
        >
          ⚠️ This plan is for educational purposes only. Consult a physician
          before starting any new exercise program.
        </p>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState('landing');
  const [lead, setLead] = useState({});
  const [quiz, setQuiz] = useState({});
  const [plan, setPlan] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleQuiz = async (data) => {
    setQuiz(data);
    setStep('generating');

    const prompt = `You are an expert personal trainer. Create a complete 12-week workout plan for this person:

Age: ${data.age} | Gender: ${data.gender} | Weight: ${data.weight} | Height: ${
      data.height
    }
Experience: ${data.experience} | Goal: ${data.goal}
Training Days/Week: ${data.days} | Location: ${data.location}
Equipment: ${data.equipment || 'standard gym equipment'}
Focus Muscles: ${data.focusMuscles || 'overall balanced development'}
Injuries/Limitations: ${data.injuries || 'none'}
Session Length: ${data.sessionLength}

Use EXACTLY these section headers in ALL CAPS. No markdown, no asterisks.

RECOMMENDED SPLIT
2 sentences explaining the split and why it suits this person.

PHASE BREAKDOWN
Weeks 1-4: [one short sentence, max 10 words, simple beginner language]
Weeks 5-8: [one short sentence, max 10 words, simple beginner language]
Weeks 9-12: [one short sentence, max 10 words, simple beginner language]

WEEKS 1-4 SCHEDULE
For every training day write:
Day X - [Muscle Group Focus]
Exercise Name - Xsets x Xreps - Xmin rest
List every exercise for each day. Do not skip any days.

WEEKS 5-8 SCHEDULE
Same format with progressed sets/reps. List every training day. Do not skip any days.

WEEKS 9-12 SCHEDULE
Same format with further progression. List every training day. Do not skip any days.

PROGRESSIVE OVERLOAD GUIDE
Write exactly 4 tips about how to add weight over time. Focus only on weight-based progression: when to increase weight, how much to add, and what to do when a weight gets easy. Keep it simple and beginner friendly. Use this exact format, one tip per line:
EMOJI | Short Bold Label | One simple actionable sentence max 12 words.

KEY COACHING TIPS
4 short practical tips. Each on its own line starting with a dash.`;

    try {
      // 1. Generate plan
      setStatusMsg('Generating your plan...');
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const json = await res.json();
      const text = json.content?.[0]?.text || 'Could not generate plan.';
      setPlan(text);

      // 2. Generate PDF
      setStatusMsg('Creating your PDF...');
      await new Promise((r) => setTimeout(r, 300));
      // load jsPDF
      if (!window.jspdf) {
        await new Promise((res2, rej) => {
          const sc = document.createElement('script');
          sc.src =
            'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
          sc.onload = res2;
          sc.onerror = rej;
          document.head.appendChild(sc);
        });
      }
      const pdfUri = await generatePDF(lead, data, text);

      // 3. Send email
      setStatusMsg('Sending PDF to your inbox...');
      try {
        await sendEmail(lead, data);
        setEmailSent(true);
      } catch (e) {
        console.warn('Email failed:', e);
        setEmailSent(false);
      }

      // 4. Save to sheet
      await saveToSheet(lead, data, text);
    } catch (e) {
      setPlan('Sorry, an error occurred. Please refresh and try again.');
    }
    setStatusMsg('');
    setStep('results');
  };

  return (
    <div style={S.app}>
      {/* NAV */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(10,10,10,.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #1a1a1a',
          zIndex: 100,
        }}
      >
        <span style={{ fontWeight: 900, fontSize: 16, letterSpacing: 2 }}>
          {BRAND}
        </span>
        {step !== 'landing' && step !== 'generating' && (
          <button
            onClick={() => setStep('landing')}
            style={{
              background: 'none',
              border: '1px solid #333',
              color: '#aaa',
              padding: '6px 14px',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            ← Start Over
          </button>
        )}
      </nav>

      {step === 'landing' && <Landing onStart={() => setStep('lead')} />}
      {step === 'lead' && (
        <LeadForm
          onNext={(d) => {
            setLead(d);
            setStep('questionnaire');
          }}
        />
      )}
      {step === 'questionnaire' && <Questionnaire onNext={handleQuiz} />}
      {step === 'generating' && <Generating statusMsg={statusMsg} />}
      {step === 'results' && (
        <Results plan={plan} lead={lead} quiz={quiz} emailSent={emailSent} />
      )}
    </div>
  );
}
