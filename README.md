# Sentiment Spark Insight

Build a professional, production-oriented frontend for **AssistIQ — Customer Sentiment and Escalation Agent**, an AI-powered customer support platform.

**Important architecture requirements:**
- Use React, TypeScript and Vite.
- Use Tailwind CSS and reusable UI components.
- The custom backend will be developed separately using Python FastAPI.
- Use the existing backend API later through a configurable API base URL.
- Do not use Supabase, Lovable Cloud database, or another backend as a replacement for FastAPI.
- Do not hardcode fake AI responses into the final integration.
- For the initial UI, use clearly identified mock data and a mock API service that can be replaced with real API calls.

**Pages to create:**
1. Home page with product introduction, key features, statistics and navigation.
2. AI Web Chat page with a polished chat interface, message timestamps, loading indicators, error states, conversation history and escalation notifications.
3. Customer Support Portal with customer issues, ticket status, priority, issue details and conversation history.
4. Human Support Dashboard with escalated tickets, customer sentiment, issue priority, conversation details and resolution status.
5. About page explaining AssistIQ and its architecture.

**Chat functionality:**
- Allow customers to type and submit messages.
- Display user and assistant messages distinctly.
- Show a loading indicator while waiting for the assistant.
- Display API errors clearly and allow retrying.
- Support conversation IDs and multiple conversation histories.
- Display intent, sentiment, priority and escalation status when returned by the backend.
- Provide a human handoff status when escalation is triggered.

**Design requirements:**
- Modern SaaS product design with a consistent design system.
- Clean layout, professional typography, accessible colors and responsive behavior.
- Include a sidebar or navigation bar, reusable cards, status badges, forms, tables and empty states.
- Make it work on desktop, tablet and mobile.
- Avoid excessive gradients, unnecessary animations and clutter.

**Code quality requirements:**
- Organize the application into pages, components, services, types and utilities.
- Create a centralized API service using fetch or Axios.
- Read the backend URL from a Vite environment variable named VITE_API_BASE_URL.
- Define TypeScript interfaces for chat requests, chat responses, conversations and tickets.
- Keep API calls separate from UI components.
- Include loading, success, empty and error states.
- Create an .env.example file without secrets.
- Use mock data only until the FastAPI backend is connected.
- Do not claim features are functional unless they have been tested.

First create the page layouts, navigation, reusable components and responsive design. Then verify that the application runs and explain the generated folder structure.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/dbd80d68-8ced-4e4e-9049-04bc0032d799).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
