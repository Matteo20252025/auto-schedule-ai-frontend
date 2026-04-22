# auto-schedule-ai-frontend 🖥️
### CRM Dashboard for AutoSchedule AI

Frontend interface for the AutoSchedule AI system — a real-time CRM built to manage WhatsApp conversations, appointments, and client queues for appointment-based businesses.

![Dashboard Preview](focoia_frontend)

---

## 📋 Overview

This dashboard gives business owners full visibility and control over the AI scheduling system. Monitor incoming contacts, today's appointments, and the conversation queue — all in one place.

---

## 🚀 Features

- **Live contact queue** — see clients waiting for a response in real time
- **Daily appointment view** — overview of all bookings scheduled for today
- **Contacts management** — full client list with conversation history
- **Appointments panel** — browse, filter and manage all scheduled appointments
- **Calendar view** — visual agenda for each professional
- **Multi-professional support** — scoped per clinic/business

---

## 🧠 Architecture

Connects directly to the AutoSchedule AI backend:
- Reads appointment and contact data from **Supabase**
- Reflects real-time state managed by the **N8N workflows**
- No manual input required — the AI handles scheduling, the dashboard just displays it

---

## ⚙️ Tech Stack

- **React + Vite** — fast, modern frontend tooling
- **Tailwind CSS** — utility-first styling
- **Supabase** — real-time database and backend
- **PostCSS / ESLint** — code quality and styling pipeline


---

## 🔗 Related

- [AutoSchedule AI Backend](https://github.com/Matteo20252025/auto-schedule-ai) — N8N workflows, WhatsApp agent, and scheduling logic
- [Full Case Study](docsAutoSchedule_AI_Case_StudyEN)

---

## 🧠 Author

Built by Matteo Sabino — focused on AI agents, automation, and real-world system design.
