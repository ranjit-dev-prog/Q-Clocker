# Q Clocker ITSM User & Operations Guide

## 1. Role-Based User Personas

| Role | Primary Responsibilities |
|---|---|
| **Requester (Employee)** | Submits service requests and incidents, views public technician updates, responds to clarification requests, confirms resolution. |
| **Service Desk Technician** | Triages incoming tickets, engages live stopwatch timers, transitions statuses, logs internal notes, creates engineering tasks. |
| **IT Manager / Team Lead** | Monitors team queue, handles escalations, re-assigns tickets, reviews breached SLAs, approves changes and workarounds. |
| **System Administrator** | Configures service catalog categories, subcategories, default SLA policies, and priority matrices. |

---

## 2. Technician Operations Guide

### 2.1 Managing an Assigned Ticket
1. Navigate to **ITSM & Ticketing** in the main navigation.
2. Filter the view by clicking the **Assigned to Me** quick filter pill.
3. Click **Manage** on the target ticket to open the comprehensive modal.
4. Click **Transition Status** $\rightarrow$ select `IN_PROGRESS` $\rightarrow$ provide a brief reason.
5. Click **Start Stopwatch** to begin tracking active investigation time.

### 2.2 Adding Public Replies vs Internal Notes
- **Public Customer Reply**: Enter text in the conversation compose box and leave the **Internal Note** checkbox unchecked. Both the requester and IT staff can see this update.
- **Confidential Internal Technician Note**: Check the **Internal Note (Hidden from Requester)** checkbox. The note will be highlighted with an amber border and lock icon. It is strictly filtered out and never exposed to the requester.

### 2.3 Creating Downstream Engineering Tasks
When an incident requires complex infrastructure remediation:
1. Open the **Linked Tasks** tab.
2. Click **Create Task** (or **Link Existing**).
3. Specify title, description, priority, assignee, and target deadline.
4. The system spawns an operational task linked directly to the ticket reference number.

### 2.4 Resolving an Incident
1. Click **Transition Status** $\rightarrow$ select `RESOLVED`.
2. Enter detailed **Resolution Notes** (mandatory).
3. Specify the **Root Cause Analysis (RCA)** and select the **Resolution Category**.
4. Confirm resolution. The SLA status is set to `COMPLETED` and the requester is notified.

---

## 3. Requester Self-Service Guide

### 3.1 Creating a Service Ticket
1. Click **Create Ticket** on the top toolbar.
2. Enter a descriptive **Subject Line** and detailed problem description.
3. Select the appropriate **Category** and **Subcategory**.
4. Select the **Impact** (how many users/departments are affected) and **Urgency** (how soon work is stopped).
5. The live preview box will display your calculated priority tier and guaranteed SLA resolution window.
6. Click **Log Service Ticket** to submit.

### 3.2 Replying & Confirming
- When the technician requests clarification (`PENDING_USER`), post a comment to automatically resume the ticket.
- Once marked `RESOLVED`, review the resolution notes. If the problem recurs, click **Reopen Ticket** within 72 hours with a short explanation.
