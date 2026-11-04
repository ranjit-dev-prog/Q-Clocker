# Q Clocker Priority Matrix & SLA Calculation Engine

## 1. ITIL Priority Calculation Matrix

The system dynamically computes the incident priority and target SLA using a two-dimensional matrix combining **Business Impact** and **Operational Urgency**:

| Impact \ Urgency | Critical (Complete Outage) | High (Degraded Performance) | Medium (Workaround Available) | Low (Minor Inconvenience) |
|---|---|---|---|---|
| **Critical (Enterprise-wide)** | **P1 - Critical** (4h SLA) | **P1 - Critical** (4h SLA) | **P2 - High** (8h SLA) | **P3 - Medium** (24h SLA) |
| **High (Department-wide)** | **P1 - Critical** (4h SLA) | **P2 - High** (8h SLA) | **P3 - Medium** (24h SLA) | **P3 - Medium** (24h SLA) |
| **Medium (Single Team)** | **P2 - High** (8h SLA) | **P3 - Medium** (24h SLA) | **P3 - Medium** (24h SLA) | **P4 - Low** (72h SLA) |
| **Low (Single User)** | **P3 - Medium** (24h SLA) | **P3 - Medium** (24h SLA) | **P4 - Low** (72h SLA) | **P4 - Low** (72h SLA) |

---

## 2. SLA Windows & Commitments

| Priority Code | Priority Label | First Response Target | Resolution Target | Escalation Escalator |
|---|---|---|---|---|
| **P1** | **Critical** | $\le 1$ hour (60 mins) | $\le 4$ hours | IT Operations Manager + Super Admin |
| **P2** | **High** | $\le 2$ hours (120 mins) | $\le 8$ hours | Tier 2 Lead |
| **P3** | **Medium** | $\le 4$ hours (240 mins) | $\le 24$ hours | Tier 1 Lead |
| **P4** | **Low** | $\le 8$ hours (480 mins) | $\le 72$ hours | Standard Queue |

---

## 3. Dynamic SLA Calculation & Pause Algorithm

### 3.1 Initial Calculation
Upon ticket creation:
$$\text{firstResponseDueAt} = \text{createdAt} + (\text{responseHours} \times 3600 \times 1000)$$
$$\text{resolutionDueAt} = \text{createdAt} + (\text{resolutionHours} \times 3600 \times 1000)$$

### 3.2 Live Progress & Warning Thresholds
At any point in time $t_{\text{now}}$:
1. **Effective Active Time**:
   $$\text{activeMs} = \max\left(0, t_{\text{now}} - t_{\text{created}} - (\text{slaPauseDurationSeconds} \times 1000)\right)$$
2. **Remaining Allowed Time**:
   $$\text{remainingMs} = \text{totalAllowedMs} - \text{activeMs}$$
3. **Percentage Consumed**:
   $$\text{percentageConsumed} = \min\left(100, \left\lfloor \frac{\text{activeMs}}{\text{totalAllowedMs}} \times 100 \right\rfloor\right)$$
4. **Status Evaluation**:
   - If $\text{activeMs} > \text{totalAllowedMs} \implies \text{slaStatus} = \text{BREACHED}$, $\text{slaBreached} = \text{true}$.
   - Else if $\text{percentageConsumed} \ge 75\% \implies \text{slaStatus} = \text{APPROACHING\_BREACH}$.
   - Else $\implies \text{slaStatus} = \text{WITHIN\_SLA}$.

### 3.3 SLA Pause & Resume
When a ticket enters `PENDING_USER`, `PENDING_VENDOR`, or `ON_HOLD`:
- $\text{slaPausedAt} = t_{\text{now}}$
- $\text{slaStatus} = \text{PAUSED}$
- Clock countdown halts.

When transitioning back to active work (`IN_PROGRESS`):
- $\Delta t_{\text{pause}} = \left\lfloor \frac{t_{\text{now}} - \text{slaPausedAt}}{1000} \right\rfloor$
- $\text{slaPauseDurationSeconds} \leftarrow \text{slaPauseDurationSeconds} + \Delta t_{\text{pause}}$
- $\text{slaPausedAt} = \text{null}$
- $\text{resolutionDueAt} \leftarrow \text{resolutionDueAt} + (\Delta t_{\text{pause}} \times 1000)$
- $\text{slaStatus} = \text{WITHIN\_SLA}$

