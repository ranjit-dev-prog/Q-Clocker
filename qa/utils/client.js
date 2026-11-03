/**
 * Enterprise QA Test Harness Client & Assertion Engine
 * Q Clocker - Enterprise Workforce & Operations ERP
 */

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

class QaResultTracker {
  constructor() {
    this.results = [];
    this.defects = [];
  }

  record(testCase) {
    this.results.push({
      testId: testCase.testId,
      module: testCase.module,
      scenario: testCase.scenario,
      type: testCase.type || 'POSITIVE',
      expected: testCase.expected,
      actual: testCase.actual,
      status: testCase.status, // PASS, FAIL, BLOCKED
      durationMs: testCase.durationMs || 0,
      evidence: testCase.evidence || '',
      defectId: testCase.defectId || null,
    });
  }

  recordDefect(defect) {
    this.defects.push({
      id: defect.id,
      title: defect.title,
      module: defect.module,
      severity: defect.severity, // CRITICAL, HIGH, MEDIUM, LOW
      priority: defect.priority, // P0, P1, P2, P3
      reproSteps: defect.reproSteps,
      expected: defect.expected,
      actual: defect.actual,
      status: defect.status || 'OPEN',
      fix: defect.fix || '',
    });
  }

  getSummary() {
    const total = this.results.length;
    const passed = this.results.filter((r) => r.status === 'PASS').length;
    const failed = this.results.filter((r) => r.status === 'FAIL').length;
    const blocked = this.results.filter((r) => r.status === 'BLOCKED').length;
    return {
      total,
      passed,
      failed,
      blocked,
      passRate: total > 0 ? ((passed / total) * 100).toFixed(2) + '%' : '0%',
      defectsTotal: this.defects.length,
      defectsP0: this.defects.filter((d) => d.priority === 'P0').length,
      defectsP1: this.defects.filter((d) => d.priority === 'P1').length,
      defectsP2: this.defects.filter((d) => d.priority === 'P2').length,
      defectsP3: this.defects.filter((d) => d.priority === 'P3').length,
    };
  }

  generateMarkdownTable() {
    let md = '| Test ID | Module | Scenario | Type | Expected | Actual | Status | Latency |\n';
    md += '|---|---|---|---|---|---|---|---|\n';
    for (const r of this.results) {
      const cleanExpected = (r.expected || '').replace(/\|/g, '\\|');
      const cleanActual = (r.actual || '').replace(/\|/g, '\\|');
      md += `| ${r.testId} | ${r.module} | ${r.scenario} | ${r.type} | ${cleanExpected} | ${cleanActual} | **${r.status}** | ${r.durationMs}ms |\n`;
    }
    return md;
  }
}

const tracker = new QaResultTracker();

async function apiRequest(method, path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
  const headers = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof Buffer)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const start = performance.now();
  try {
    const res = await fetch(url, {
      method,
      headers,
      body,
    });
    const durationMs = Math.round(performance.now() - start);

    const contentType = res.headers.get('content-type') || '';
    let data = null;
    let text = '';
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      text = await res.text();
    }

    return {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries()),
      data,
      text,
      durationMs,
    };
  } catch (err) {
    const durationMs = Math.round(performance.now() - start);
    return {
      ok: false,
      status: 0,
      statusText: err.message,
      headers: {},
      data: null,
      text: err.message,
      error: err,
      durationMs,
    };
  }
}

module.exports = {
  BASE_URL,
  tracker,
  apiRequest,
};

