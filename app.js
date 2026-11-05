/**
 * ZERO LATENCY (ATTACKTRACE) — Interactive Frontend Controller
 * CybersecTools-inspired Dark SOC Interface
 */

document.addEventListener('DOMContentLoaded', () => {
  initSearchPalette();
  initCategoryFilters();
  initTerminalSandbox();
  initContactForm();
  initMobileNav();
  initScrollAnimations();
});

/* ==========================================================================
   1. COMMAND PALETTE (⌘K / Ctrl+K Search)
   ========================================================================== */
const searchableModules = [
  {
    title: 'Time-Travel Threat Replayer',
    category: 'Autonomous Forensics',
    badge: 'Dual-Directional',
    desc: 'Bi-directional incident playback across dynamic windows with step-by-step state reversal.',
    link: '#capabilities'
  },
  {
    title: 'Dual-Bounding Correlation Engine',
    category: 'Threat Correlation',
    badge: 'Microsecond',
    desc: 'Actor grouping by sliding time delta (Δt) and host graph clustering with 0% noise.',
    link: '#capabilities'
  },
  {
    title: 'Atomic SOAR Remediation',
    category: 'SOAR Mitigation',
    badge: 'Reversible',
    desc: 'Automated containment execution with idempotent rollback scripts (iptables, kill, unshadow).',
    link: '#capabilities'
  },
  {
    title: 'Calibrated MITRE ATT&CK Heuristics',
    category: 'MITRE ATT&CK',
    badge: '14 Tactics',
    desc: 'High-confidence mapping for T1110, T1059, T1078, T1021 with zero false-positive tuning.',
    link: '#capabilities'
  },
  {
    title: 'Multi-Format Streaming Ingestion',
    category: 'Streaming Ingestion',
    badge: 'Universal',
    desc: 'High-throughput parsing of Linux Syslog RFC 5424, Apache Access, JSON, and Windows Event logs.',
    link: '#capabilities'
  },
  {
    title: 'Triple-Format Dossier Exporter',
    category: 'Autonomous Forensics',
    badge: 'Executive & SOC',
    desc: 'Instant generation of Markdown executive summaries, JSON forensic ledgers, and MITRE Navigator layers.',
    link: '#capabilities'
  },
  {
    title: 'attacktrace demo (Simulated Killchain)',
    category: 'CLI Command',
    badge: 'Sandbox',
    desc: 'Execute real-world multi-stage attack scenarios (Windows APT, Linux Web Breach, Cloud SSH).',
    link: '#sandbox'
  },
  {
    title: 'attacktrace status (Engine Health)',
    category: 'CLI Command',
    badge: 'Diagnostics',
    desc: 'Query pipeline telemetry, SQLite record counts, active memory pools, and test suites.',
    link: '#sandbox'
  },
  {
    title: 'attacktrace mitigate --rollback (SOAR)',
    category: 'CLI Command',
    badge: 'Containment',
    desc: 'Trigger or revert containment actions atomically against any identified incident.',
    link: '#sandbox'
  },
  {
    title: 'Enterprise SOC Demo & Pricing',
    category: 'Commercial',
    badge: 'Inbound',
    desc: 'Review community, pro ($499/mo), and enterprise defense tiers, or request customized pilots.',
    link: '#pricing'
  },
  {
    title: 'Live Web SOC Console (FastAPI + D3.js)',
    category: 'Web Portal',
    badge: 'localhost:8000',
    desc: 'Open the interactive D3.js attack graph and real-time incident inspection dashboard.',
    link: 'http://127.0.0.1:8000/dashboard',
    external: true
  }
];

function initSearchPalette() {
  const modalBackdrop = document.getElementById('search-modal-backdrop');
  const openTrigger = document.getElementById('open-search-modal');
  const searchInput = document.getElementById('search-modal-input');
  const resultsList = document.getElementById('search-results-list');

  if (!modalBackdrop || !searchInput || !resultsList) return;

  function renderResults(query = '') {
    const q = query.trim().toLowerCase();
    const filtered = q === '' 
      ? searchableModules 
      : searchableModules.filter(m => 
          m.title.toLowerCase().includes(q) ||
          m.desc.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          m.badge.toLowerCase().includes(q)
        );

    if (filtered.length === 0) {
      resultsList.innerHTML = `
        <li style="padding: 2rem 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
          No matching modules or commands found for "<span style="color: var(--text-primary); font-weight: 700;">${escapeHtml(query)}</span>"
        </li>
      `;
      return;
    }

    resultsList.innerHTML = filtered.map((item, idx) => `
      <li class="search-result-item ${idx === 0 ? 'selected' : ''}" data-link="${item.link}" data-ext="${item.external ? 'true' : 'false'}">
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
            <span style="font-weight: 700; color: var(--text-primary); font-size: 0.92rem;">${escapeHtml(item.title)}</span>
            <span class="badge" style="font-size: 0.65rem; padding: 2px 6px; background: var(--bg-input); border-radius: 4px; color: var(--text-muted); border: 1px solid var(--border-subtle);">${escapeHtml(item.badge)}</span>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted); line-height: 1.4;">${escapeHtml(item.desc)}</div>
        </div>
        <span style="font-size: 0.68rem; font-family: var(--font-mono); color: var(--text-primary); background: var(--bg-input); padding: 4px 8px; border-radius: 4px; border: 1px solid var(--border-subtle);">
          ${escapeHtml(item.category)}
        </span>
      </li>
    `).join('');

    // Attach click triggers to result rows
    resultsList.querySelectorAll('.search-result-item').forEach(el => {
      el.addEventListener('click', () => {
        const link = el.getAttribute('data-link');
        const isExt = el.getAttribute('data-ext') === 'true';
        closeModal();
        if (isExt) {
          window.open(link, '_blank');
        } else if (link.startsWith('#')) {
          const target = document.querySelector(link);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.href = link;
        }
      });
    });
  }

  function openModal() {
    modalBackdrop.classList.add('active');
    searchInput.value = '';
    renderResults();
    setTimeout(() => searchInput.focus(), 60);
  }

  function closeModal() {
    modalBackdrop.classList.remove('active');
  }

  if (openTrigger) {
    openTrigger.addEventListener('click', openModal);
  }

  // Keyboard shortcuts: ⌘K, Ctrl+K, ESC
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modalBackdrop.classList.contains('active')) {
        closeModal();
      } else {
        openModal();
      }
    } else if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  searchInput.addEventListener('input', (e) => {
    renderResults(e.target.value);
  });
}

/* ==========================================================================
   2. CATEGORY FILTER TABS (CybersecTools Directory Filter)
   ========================================================================== */
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-tab');
  const toolCards = document.querySelectorAll('.tool-card');

  if (!filterBtns.length || !toolCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-category');

      toolCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease-in-out';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   3. INTERACTIVE TERMINAL SANDBOX
   ========================================================================== */
const terminalTabsData = {
  demo: {
    command: 'attacktrace demo --scenario windows_attack',
    output: `\x1b[36m[ZERO LATENCY]\x1b[0m Ingesting synthetic Windows APT telemetry...
[+] Loaded 14 telemetry events from data/scenarios/windows_attack.json
[+] Running Multi-Format Ingestion Adapter (Windows Event XML/Sysmon)...
[+] Correlating with Dual-Bounding Engine (Δt=300s, host=FINANCE-WKSTN-04)...
[+] Incident Reconstructed: \x1b[32mINC-2026-0881\x1b[0m
    • Severity: \x1b[31mCRITICAL\x1b[0m (Score: 94/100)
    • Stages: Initial Access -> Privilege Escalation -> Credential Dumping -> Exfiltration
    • MITRE TTPs: T1110.001 (Brute Force), T1059.001 (PowerShell), T1003.001 (LSASS)
[✔] Attack graph compiled in 4.2ms. View in live console at http://127.0.0.1:8000/dashboard`
  },
  status: {
    command: 'attacktrace status --json',
    output: `{
  "system": "ZERO LATENCY THREAT ENGINE",
  "version": "1.0.0",
  "test_suite": "137/137 PASSED (100% COVERAGE)",
  "sqlite_db": "attacktrace.db (WAL Mode)",
  "in_memory_cache": {
    "cached_events": 4120,
    "active_incidents": 7,
    "soar_actions_pending": 0
  },
  "latency_metrics": {
    "ingestion_p99": "0.18ms",
    "correlation_p99": "1.24ms",
    "graph_render_p99": "3.10ms"
  },
  "status": "HEALTHY_OPTIMAL"
}`
  },
  incidents: {
    command: 'attacktrace incidents --min-severity HIGH',
    output: `┌────────────────┬──────────┬──────────────┬──────────────────┬─────────────┐
│ Incident ID    │ Severity │ Actor / Host │ Primary TTP      │ Kill Chain  │
├────────────────┼──────────┼──────────────┼──────────────────┼─────────────┤
│ INC-2026-0881  │ CRITICAL │ 192.168.1.45 │ T1003 LSASS Dump │ 4 Stages    │
│ INC-2026-0882  │ HIGH     │ 10.0.4.19    │ T1059.004 Bash   │ 2 Stages    │
│ INC-2026-0885  │ CRITICAL │ 172.16.0.8   │ T1190 Exploit    │ 5 Stages    │
└────────────────┴──────────┴──────────────┴──────────────────┴─────────────┘
Found 3 high-severity incidents awaiting operator review.`
  },
  mitigate: {
    command: 'attacktrace mitigate --incident-id INC-2026-0881 --generate-rollback',
    output: `\x1b[33m[SOAR ENGINE]\x1b[0m Preparing deterministic containment bundle...
[+] Isolation Target: 192.168.1.45 (FINANCE-WKSTN-04)
[+] Generated Remediation Script: .mitigate/INC-2026-0881_apply.sh
    • iptables -I INPUT -s 192.168.1.45 -j DROP
    • kill -9 4819 (malicious powershell.exe)
[+] Generated Rollback Script: .mitigate/INC-2026-0881_rollback.sh
    • iptables -D INPUT -s 192.168.1.45 -j DROP
[✔] Safe containment scripts emitted. Zero infrastructure destruction.`
  }
};

function initTerminalSandbox() {
  const tabs = document.querySelectorAll('.term-tab');
  const codeEl = document.getElementById('terminal-code');
  const copyBtn = document.getElementById('term-copy-btn');

  if (!tabs.length || !codeEl) return;

  function setTab(tabKey) {
    const data = terminalTabsData[tabKey];
    if (!data) return;

    tabs.forEach(t => {
      if (t.getAttribute('data-tab') === tabKey) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    // Format ANSI escapes to HTML spans matching lite-black & cream-white theme
    let formatted = data.output
      .replace(/\x1b\[31m/g, '<span style="color: var(--status-rose); font-weight: bold;">')
      .replace(/\x1b\[32m/g, '<span style="color: #ffffff; font-weight: bold;">')
      .replace(/\x1b\[33m/g, '<span style="color: var(--status-amber); font-weight: bold;">')
      .replace(/\x1b\[36m/g, '<span style="color: var(--cream-white); font-weight: bold;">')
      .replace(/\x1b\[0m/g, '</span>');

    codeEl.innerHTML = `<span style="color: var(--cream-white); font-weight: 600;">$ ${escapeHtml(data.command)}</span>\n\n${formatted}`;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabKey = tab.getAttribute('data-tab');
      setTab(tabKey);
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const activeTabEl = document.querySelector('.term-tab.active');
      const activeKey = activeTabEl ? activeTabEl.getAttribute('data-tab') : 'demo';
      const cmd = terminalTabsData[activeKey] ? terminalTabsData[activeKey].command : '';
      
      navigator.clipboard.writeText(cmd).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1800);
      });
    });
  }

  // Initial load
  setTab('demo');
}

/* ==========================================================================
   4. CONTACT FORM & TICKET ISSUANCE
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const typeTabs = document.querySelectorAll('.type-tab');
  const successPanel = document.getElementById('success-panel');
  const ticketDisplay = document.getElementById('ticket-id-display');
  const copyTicketBtn = document.getElementById('copy-ticket-btn');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  let currentInquiryType = 'SOC Demo';

  typeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      typeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentInquiryType = tab.getAttribute('data-type') || tab.textContent.trim();
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('full-name')?.value.trim();
    const email = document.getElementById('work-email')?.value.trim();
    const organization = document.getElementById('org-name')?.value.trim() || 'N/A';
    const logVolume = document.getElementById('log-volume')?.value || '1 - 50 GB/day';
    const message = document.getElementById('message')?.value.trim();

    if (!fullName || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Transmitting to Zero Latency Core...';
    }

    const payload = {
      full_name: fullName,
      email: email,
      organization: organization,
      inquiry_type: currentInquiryType,
      log_volume: logVolume,
      message: message
    };

    let ticketId = 'INQ-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    // 1. Dispatch directly to sanjeevanv@karunya.edu.in via FormSubmit AJAX service
    try {
      await fetch('https://formsubmit.co/ajax/sanjeevanv@karunya.edu.in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Ticket_ID: ticketId,
          Inquiry_Type: currentInquiryType,
          Name: fullName,
          Email: email,
          Organization: organization,
          Telemetry_Volume: logVolume,
          Message: message,
          _subject: `[Zero Latency] ${currentInquiryType}: ${fullName} (${organization})`
        })
      });
    } catch (err) {
      console.log('Direct email dispatch note:', err);
    }

    // 2. Also dispatch to local FastAPI backend if online
    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const resData = await response.json();
        if (resData.ticket_id) {
          ticketId = resData.ticket_id;
        }
      }
    } catch (err) {
      console.log('Backend offline or standalone static mode; generated local ticket:', ticketId);
    }

    // 3. Configure direct email client link
    const emailClientBtn = document.getElementById('email-client-btn');
    if (emailClientBtn) {
      const mailtoSubject = encodeURIComponent(`[Zero Latency] ${currentInquiryType} - Ticket ${ticketId}`);
      const mailtoBody = encodeURIComponent(
        `Dear Sanjeevan,\n\nI submitted an inquiry through the Zero Latency portal.\n\nTicket ID: ${ticketId}\nInquiry Type: ${currentInquiryType}\nName: ${fullName}\nEmail: ${email}\nOrganization: ${organization}\nTelemetry Volume: ${logVolume}\n\nMessage:\n${message}\n`
      );
      emailClientBtn.href = `mailto:sanjeevanv@karunya.edu.in?subject=${mailtoSubject}&body=${mailtoBody}`;
    }

    // Save ticket to local history
    try {
      const history = JSON.parse(localStorage.getItem('zl_inquiries') || '[]');
      history.push({ ticketId, ...payload, date: new Date().toISOString() });
      localStorage.setItem('zl_inquiries', JSON.stringify(history));
    } catch (_) {}

    // Show success panel
    if (form && successPanel && ticketDisplay) {
      form.style.display = 'none';
      ticketDisplay.textContent = ticketId;
      successPanel.classList.add('active');
      successPanel.scrollIntoView({ behavior: 'smooth' });
    }
  });

  if (copyTicketBtn && ticketDisplay) {
    copyTicketBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(ticketDisplay.textContent.trim()).then(() => {
        copyTicketBtn.textContent = 'Copied!';
        setTimeout(() => { copyTicketBtn.textContent = 'Copy ID'; }, 1800);
      });
    });
  }
}

/* ==========================================================================
   5. MOBILE NAVIGATION TOGGLE
   ========================================================================== */
function initMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const nav = document.querySelector('.navbar nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isVisible = nav.style.display === 'block';
      nav.style.display = isVisible ? 'none' : 'block';
      toggle.textContent = isVisible ? '☰' : '✕';
    });
  }
}

/* ==========================================================================
   6. REACTBITS SCROLL REVEAL & INTERSECTION OBSERVER
   ========================================================================== */
function initScrollAnimations() {
  const revealTargets = document.querySelectorAll(
    '.tool-card, .metric-item, .pricing-card, .compare-table-wrap, .terminal-box, .trust-card, .form-card, .section-header'
  );

  if (!revealTargets.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target); // Trigger once smoothly
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  revealTargets.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

/* ==========================================================================
   UTILITY HELPERS
   ========================================================================== */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
