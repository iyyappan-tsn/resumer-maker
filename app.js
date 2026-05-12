/* ============================================================
   Resume Maker — app.js
   Developer: Iyyappan S
   ============================================================ */

// ── STATE ──────────────────────────────────────────────────
let selectedTemplate = null;
let expCount = 0;
let eduCount = 0;

// ── NAVIGATION ─────────────────────────────────────────────
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) { el.classList.add('active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
}

// ── STEP NAVIGATION ─────────────────────────────────────────
function goStep(n) {
  if (n === 3) buildPreview();
  document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.toggle('active', i < n);
  });
  const target = document.getElementById('step-' + n);
  if (target) { target.classList.add('active'); window.scrollTo({ top: 60, behavior: 'smooth' }); }
}

// ── TEMPLATE SELECTION ──────────────────────────────────────
function selectTemplate(name) {
  selectedTemplate = name;
  document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
  const card = document.getElementById('tpl-' + name);
  if (card) card.classList.add('selected');
  document.getElementById('next-1').disabled = false;
}

// ── ADD EXPERIENCE BLOCK ────────────────────────────────────
function addExp() {
  expCount++;
  const id = expCount;
  const container = document.getElementById('exp-container');
  const div = document.createElement('div');
  div.className = 'exp-block';
  div.id = 'exp-' + id;
  div.innerHTML = `
    <button class="remove-btn" onclick="removeBlock('exp-${id}')">×</button>
    <div class="form-row">
      <div class="form-group"><label>Job Title</label><input type="text" id="exp-title-${id}" placeholder="Software Engineer"/></div>
      <div class="form-group"><label>Company</label><input type="text" id="exp-company-${id}" placeholder="Google"/></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Start Date</label><input type="text" id="exp-start-${id}" placeholder="Jan 2022"/></div>
      <div class="form-group"><label>End Date</label><input type="text" id="exp-end-${id}" placeholder="Present"/></div>
    </div>
    <div class="form-group full">
      <label>Description / Achievements (use new lines for bullets)</label>
      <textarea id="exp-desc-${id}" rows="3" placeholder="• Built scalable REST APIs serving 10M+ requests/day&#10;• Led a team of 4 engineers to deliver project on time"></textarea>
    </div>
  `;
  container.appendChild(div);
}

// ── ADD EDUCATION BLOCK ─────────────────────────────────────
function addEdu() {
  eduCount++;
  const id = eduCount;
  const container = document.getElementById('edu-container');
  const div = document.createElement('div');
  div.className = 'edu-block';
  div.id = 'edu-' + id;
  div.innerHTML = `
    <button class="remove-btn" onclick="removeBlock('edu-${id}')">×</button>
    <div class="form-row">
      <div class="form-group"><label>Degree / Course</label><input type="text" id="edu-degree-${id}" placeholder="B.Tech Computer Science"/></div>
      <div class="form-group"><label>Institution</label><input type="text" id="edu-school-${id}" placeholder="Anna University"/></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Year</label><input type="text" id="edu-year-${id}" placeholder="2018 – 2022"/></div>
      <div class="form-group"><label>Score / GPA (optional)</label><input type="text" id="edu-score-${id}" placeholder="8.5 CGPA"/></div>
    </div>
  `;
  container.appendChild(div);
}

function removeBlock(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// ── COLLECT FORM DATA ────────────────────────────────────────
function collectData() {
  const experiences = [];
  document.querySelectorAll('.exp-block').forEach(block => {
    const id = block.id.replace('exp-', '');
    experiences.push({
      title:   val('exp-title-' + id),
      company: val('exp-company-' + id),
      start:   val('exp-start-' + id),
      end:     val('exp-end-' + id),
      desc:    val('exp-desc-' + id),
    });
  });

  const education = [];
  document.querySelectorAll('.edu-block').forEach(block => {
    const id = block.id.replace('edu-', '');
    education.push({
      degree: val('edu-degree-' + id),
      school: val('edu-school-' + id),
      year:   val('edu-year-' + id),
      score:  val('edu-score-' + id),
    });
  });

  return {
    name:      val('f-name'),
    title:     val('f-title'),
    email:     val('f-email'),
    phone:     val('f-phone'),
    location:  val('f-location'),
    linkedin:  val('f-linkedin'),
    summary:   val('f-summary'),
    skills:    val('f-skills').split(',').map(s => s.trim()).filter(Boolean),
    certs:     val('f-certs'),
    experiences,
    education,
  };
}

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

// ── BUILD PREVIEW ────────────────────────────────────────────
function buildPreview() {
  const data = collectData();
  const out  = document.getElementById('resume-output');
  out.innerHTML = renderTemplate(selectedTemplate, data);
}

// ── RENDER TEMPLATES ─────────────────────────────────────────
function renderTemplate(tpl, d) {
  switch(tpl) {
    case 'modern':    return renderModern(d);
    case 'minimal':   return renderMinimal(d);
    case 'executive': return renderExecutive(d);
    default:          return renderClassic(d);
  }
}

function contactLine(d) {
  return [d.email, d.phone, d.location, d.linkedin].filter(Boolean).join(' &nbsp;|&nbsp; ');
}

// CLASSIC
function renderClassic(d) {
  return `<div class="resume-doc resume-classic">
    <div class="r-header">
      <div class="r-name">${esc(d.name) || 'Your Name'}</div>
      <div class="r-title">${esc(d.title) || 'Professional Title'}</div>
      <div class="r-contact">${contactLine(d)}</div>
    </div>
    ${d.summary ? `<div class="r-section-title">Summary</div><p class="r-summary">${esc(d.summary)}</p>` : ''}
    ${renderExpSection(d, 'classic')}
    ${renderEduSection(d, 'classic')}
    ${renderSkillsSection(d, 'classic')}
    ${d.certs ? `<div class="r-section-title">Certifications & Awards</div><p class="r-summary">${esc(d.certs)}</p>` : ''}
  </div>`;
}

// MODERN (sidebar)
function renderModern(d) {
  const skills = d.skills.map(s => `<span class="r-skill-tag">${esc(s)}</span>`).join('');
  return `<div class="resume-doc resume-modern">
    <div class="r-sidebar">
      <div class="r-name">${esc(d.name) || 'Your Name'}</div>
      <div class="r-title">${esc(d.title) || 'Professional Title'}</div>
      <div class="r-sidebar-section">
        <h4>Contact</h4>
        ${d.email ? `<p>✉ ${esc(d.email)}</p>` : ''}
        ${d.phone ? `<p>📱 ${esc(d.phone)}</p>` : ''}
        ${d.location ? `<p>📍 ${esc(d.location)}</p>` : ''}
        ${d.linkedin ? `<p>🔗 ${esc(d.linkedin)}</p>` : ''}
      </div>
      ${d.skills.length ? `<div class="r-sidebar-section"><h4>Skills</h4><div class="r-skills-list">${skills}</div></div>` : ''}
      ${d.certs ? `<div class="r-sidebar-section"><h4>Certifications</h4><p>${esc(d.certs)}</p></div>` : ''}
    </div>
    <div class="r-main">
      ${d.summary ? `<div class="r-section-title">Profile</div><p class="r-summary">${esc(d.summary)}</p>` : ''}
      ${renderExpSection(d, 'modern')}
      ${renderEduSection(d, 'modern')}
    </div>
  </div>`;
}

// MINIMAL
function renderMinimal(d) {
  return `<div class="resume-doc resume-minimal">
    <div class="r-header">
      <div class="r-name">${esc(d.name) || 'Your Name'}</div>
      <div class="r-title">${esc(d.title) || 'Professional Title'}</div>
      <div class="r-contact">${contactLine(d)}</div>
    </div>
    ${d.summary ? `<div class="r-section-title">About</div><p class="r-summary">${esc(d.summary)}</p>` : ''}
    ${renderExpSection(d, 'minimal')}
    ${renderEduSection(d, 'minimal')}
    ${renderSkillsSection(d, 'minimal')}
    ${d.certs ? `<div class="r-section-title">Certifications</div><p class="r-summary">${esc(d.certs)}</p>` : ''}
  </div>`;
}

// EXECUTIVE
function renderExecutive(d) {
  const right = [d.email, d.phone, d.location, d.linkedin].filter(Boolean).join('<br/>');
  return `<div class="resume-doc resume-executive">
    <div class="r-header">
      <div class="r-header-left">
        <div class="r-name">${esc(d.name) || 'Your Name'}</div>
        <div class="r-title">${esc(d.title) || 'Professional Title'}</div>
      </div>
      <div class="r-header-right">${right}</div>
    </div>
    ${d.summary ? `<div class="r-section-title">Executive Summary</div><p class="r-summary">${esc(d.summary)}</p>` : ''}
    ${renderExpSection(d, 'executive')}
    ${renderEduSection(d, 'executive')}
    ${renderSkillsSection(d, 'executive')}
    ${d.certs ? `<div class="r-section-title">Certifications & Achievements</div><p class="r-summary">${esc(d.certs)}</p>` : ''}
  </div>`;
}

function renderExpSection(d) {
  if (!d.experiences.length) return '';
  const jobs = d.experiences.map(e => `
    <div class="r-job">
      <div class="r-job-header">
        <span class="r-job-title">${esc(e.title)}</span>
        <span class="r-job-date">${esc(e.start)}${e.end ? ' – ' + esc(e.end) : ''}</span>
      </div>
      <div class="r-job-company">${esc(e.company)}</div>
      ${e.desc ? `<div class="r-job-desc">${esc(e.desc)}</div>` : ''}
    </div>`).join('');
  return `<div class="r-section-title">Experience</div>${jobs}`;
}

function renderEduSection(d) {
  if (!d.education.length) return '';
  const edus = d.education.map(e => `
    <div class="r-job">
      <div class="r-job-header">
        <span class="r-job-title">${esc(e.degree)}</span>
        <span class="r-job-date">${esc(e.year)}</span>
      </div>
      <div class="r-job-company">${esc(e.school)}${e.score ? ' &nbsp;·&nbsp; ' + esc(e.score) : ''}</div>
    </div>`).join('');
  return `<div class="r-section-title">Education</div>${edus}`;
}

function renderSkillsSection(d) {
  if (!d.skills.length) return '';
  const tags = d.skills.map(s => `<span class="r-skill-tag">${esc(s)}</span>`).join('');
  return `<div class="r-section-title">Skills</div><div class="r-skills-list">${tags}</div>`;
}

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── DOWNLOAD RESUME ──────────────────────────────────────────
function downloadResume() {
  const data  = collectData();
  const name  = data.name || 'Resume';
  const html  = document.getElementById('resume-output').innerHTML;

  const fullHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>${name} - Resume</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Plus Jakarta Sans',sans-serif;background:#fff;color:#222;font-size:13px;}
:root{--navy:#1a2744;--navy-light:#243258;--blue:#2563eb;--blue-light:#3b82f6;--accent:#0ea5e9;--gray-50:#f1f5f9;--gray-100:#e2e8f0;--gray-200:#cbd5e1;--gray-300:#94a3b8;--gray-500:#64748b;--gray-700:#334155;}
.resume-doc{font-family:'Plus Jakarta Sans',sans-serif;padding:40px 48px;max-width:780px;margin:0 auto;font-size:13px;line-height:1.6;color:#222;}
.resume-classic .r-header{background:var(--navy);color:#fff;margin:-40px -48px 28px;padding:32px 48px;}
.resume-classic .r-name{font-size:28px;font-weight:800;margin-bottom:4px;}
.resume-classic .r-title{font-size:14px;opacity:0.8;margin-bottom:10px;}
.resume-classic .r-contact{font-size:12px;opacity:0.75;display:flex;gap:16px;flex-wrap:wrap;}
.resume-classic .r-section-title{font-size:12px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;color:var(--blue);border-bottom:2px solid var(--blue);padding-bottom:4px;margin:20px 0 12px;}
.resume-modern{display:flex;padding:0;}
.resume-modern .r-sidebar{width:220px;background:var(--navy);color:#fff;padding:32px 24px;flex-shrink:0;min-height:700px;}
.resume-modern .r-main{flex:1;padding:32px;}
.resume-modern .r-name{font-size:22px;font-weight:800;margin-bottom:4px;}
.resume-modern .r-title{font-size:12px;opacity:0.75;margin-bottom:20px;}
.resume-modern .r-sidebar-section{margin-bottom:22px;}
.resume-modern .r-sidebar-section h4{font-size:10px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;opacity:0.6;margin-bottom:8px;}
.resume-modern .r-sidebar-section p,.resume-modern .r-sidebar-section li{font-size:12px;opacity:0.88;margin-bottom:4px;list-style:none;}
.resume-modern .r-section-title{font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:var(--navy);border-left:3px solid var(--blue);padding-left:8px;margin:18px 0 10px;}
.resume-minimal .r-header{text-align:center;margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid #ddd;}
.resume-minimal .r-name{font-size:30px;font-weight:800;color:var(--navy);margin-bottom:4px;}
.resume-minimal .r-title{font-size:14px;color:var(--blue);margin-bottom:8px;}
.resume-minimal .r-contact{font-size:12px;color:var(--gray-500);display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}
.resume-minimal .r-section-title{font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--gray-500);margin:20px 0 10px;}
.resume-executive .r-header{display:flex;align-items:center;justify-content:space-between;margin:-40px -48px 28px;padding:28px 48px;background:linear-gradient(135deg,var(--navy),var(--navy-light));color:#fff;}
.resume-executive .r-header-left .r-name{font-size:26px;font-weight:800;margin-bottom:4px;}
.resume-executive .r-header-left .r-title{font-size:13px;opacity:0.75;}
.resume-executive .r-header-right{text-align:right;font-size:12px;opacity:0.8;line-height:1.8;}
.resume-executive .r-section-title{font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:var(--navy);background:var(--gray-50);padding:4px 10px;border-radius:4px;display:inline-block;margin:18px 0 10px;}
.r-job{margin-bottom:14px;}
.r-job-header{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;}
.r-job-title{font-weight:700;font-size:13px;}
.r-job-date{font-size:12px;color:var(--gray-500);}
.r-job-company{font-size:12px;color:var(--blue);margin-bottom:5px;}
.r-job-desc{font-size:12px;color:#444;white-space:pre-wrap;}
.r-skills-list{display:flex;flex-wrap:wrap;gap:6px;}
.r-skill-tag{background:var(--gray-50);border:1px solid var(--gray-100);font-size:11px;font-weight:600;padding:3px 10px;border-radius:999px;color:var(--gray-700);}
.resume-modern .r-skill-tag{background:rgba(255,255,255,0.15);border-color:rgba(255,255,255,0.2);color:#fff;}
.r-summary{font-size:13px;color:#444;line-height:1.7;margin-bottom:4px;}
@media print{body{background:#fff;}@page{margin:0;}}
</style>
</head>
<body>${html}</body>
</html>`;

  const blob = new Blob([fullHTML], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = name.replace(/\s+/g, '_') + '_Resume.html';
  a.click();
  URL.revokeObjectURL(url);
}

// ── ATS CHECKER ──────────────────────────────────────────────
async function checkATS() {
  const resumeText = document.getElementById('ats-resume').value.trim();
  const jdText     = document.getElementById('ats-jd').value.trim();

  if (!resumeText) {
    alert('Please paste your resume text first.');
    return;
  }

  showLoading('Analysing your resume with AI...');

  const prompt = buildATSPrompt(resumeText, jdText);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.content?.map(c => c.text || '').join('') || '';

    hideLoading();
    renderATSResult(text);
  } catch (err) {
    hideLoading();
    renderATSError(err.message);
  }
}

function buildATSPrompt(resume, jd) {
  return `You are an expert ATS (Applicant Tracking System) resume analyser. Analyse the resume below and provide detailed feedback.

RESUME:
"""
${resume}
"""

${jd ? `JOB DESCRIPTION:\n"""\n${jd}\n"""` : 'No job description provided — do a general ATS analysis.'}

Respond ONLY in this exact JSON format (no markdown, no backticks, no extra text):
{
  "score": <number 0-100>,
  "rating": "<Excellent|Good|Fair|Needs Work>",
  "summary": "<2-sentence overall assessment>",
  "errors": [
    {"type": "error", "text": "<critical issue>"},
    ...
  ],
  "warnings": [
    {"type": "warn", "text": "<moderate issue>"},
    ...
  ],
  "good": [
    {"type": "good", "text": "<what is done well>"},
    ...
  ],
  "tips": [
    {"type": "tip", "text": "<actionable improvement suggestion>"},
    ...
  ],
  "keywords_missing": ["<keyword1>", "<keyword2>", ...],
  "keywords_found": ["<keyword1>", "<keyword2>", ...]
}

Be specific and actionable. Provide at least 2-3 items in each array. Focus on real ATS issues like: missing keywords, formatting problems, lack of quantifiable achievements, missing sections, passive language, generic phrases, file format issues, and keyword density.`;
}

function renderATSResult(rawText) {
  let data;
  try {
    const clean = rawText.replace(/```json|```/g, '').trim();
    data = JSON.parse(clean);
  } catch(e) {
    renderATSError('Could not parse AI response. Please try again.');
    return;
  }

  const resultBox  = document.getElementById('ats-result');
  const scoreBox   = document.getElementById('ats-score-box');
  const contentBox = document.getElementById('ats-content');

  const scoreColor = data.score >= 75 ? '#22c55e' : data.score >= 50 ? '#f59e0b' : '#ef4444';

  scoreBox.innerHTML = `
    <div>
      <div class="ats-score-number" style="color:${scoreColor}">${data.score}</div>
      <div class="ats-score-label">out of 100</div>
    </div>
    <div>
      <div class="ats-score-title">${data.rating} ATS Score</div>
      <p style="font-size:13px;opacity:0.8;margin-top:6px;line-height:1.5">${esc(data.summary)}</p>
    </div>
  `;

  let html = '';

  if (data.errors?.length) {
    html += `<div class="ats-section"><h4>🚨 Critical Issues (Fix These First)</h4>`;
    data.errors.forEach(e => { html += `<div class="ats-item error">⚠ ${esc(e.text)}</div>`; });
    html += `</div>`;
  }

  if (data.warnings?.length) {
    html += `<div class="ats-section"><h4>⚠️ Warnings</h4>`;
    data.warnings.forEach(e => { html += `<div class="ats-item warn">◆ ${esc(e.text)}</div>`; });
    html += `</div>`;
  }

  if (data.good?.length) {
    html += `<div class="ats-section"><h4>✅ What's Working Well</h4>`;
    data.good.forEach(e => { html += `<div class="ats-item good">✓ ${esc(e.text)}</div>`; });
    html += `</div>`;
  }

  if (data.tips?.length) {
    html += `<div class="ats-section"><h4>💡 Suggestions to Improve</h4>`;
    data.tips.forEach(e => { html += `<div class="ats-item tip">→ ${esc(e.text)}</div>`; });
    html += `</div>`;
  }

  if (data.keywords_missing?.length) {
    html += `<div class="ats-section"><h4>🔍 Keywords to Add</h4><div class="r-skills-list">`;
    data.keywords_missing.forEach(k => { html += `<span class="r-skill-tag" style="border-color:#ef4444;color:#ef4444">${esc(k)}</span>`; });
    html += `</div></div>`;
  }

  if (data.keywords_found?.length) {
    html += `<div class="ats-section"><h4>✅ Keywords Found</h4><div class="r-skills-list">`;
    data.keywords_found.forEach(k => { html += `<span class="r-skill-tag" style="border-color:#22c55e;color:#22c55e">${esc(k)}</span>`; });
    html += `</div></div>`;
  }

  contentBox.innerHTML = html;
  resultBox.classList.remove('hidden');
  resultBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderATSError(msg) {
  const resultBox = document.getElementById('ats-result');
  document.getElementById('ats-score-box').innerHTML = '';
  document.getElementById('ats-content').innerHTML = `
    <div class="ats-item error">
      ⚠ Could not complete analysis: ${esc(msg)}<br/>
      <small>Make sure you are connected to the internet. If this is a CORS error when running locally, open index.html via a local server (e.g. <code>npx serve .</code>) or deploy to GitHub Pages.</small>
    </div>`;
  resultBox.classList.remove('hidden');
}

// ── LOADING ──────────────────────────────────────────────────
function showLoading(msg) {
  document.getElementById('loading-msg').textContent = msg || 'Loading...';
  document.getElementById('loading-overlay').classList.remove('hidden');
}
function hideLoading() {
  document.getElementById('loading-overlay').classList.add('hidden');
}

// ── INIT ─────────────────────────────────────────────────────
(function init() {
  // Add one experience and education block by default
  addExp();
  addEdu();
  // Select classic by default
  selectTemplate('classic');
})();
