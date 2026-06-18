# AI Customer Support Chatbot

An intelligent, context-aware customer support solution built with Next.js 16, Google Gemini AI, and Scalekit. This application empowers businesses to create custom AI chatbots trained on their specific data, capable of handling customer queries with a personalized touch.

## 🚀 Key Features

- **🤖 AI-Powered Intelligence**: Leverages **Google Generative AI (Gemini)** for natural, accurate, and context-aware responses.
- **📚 Custom Knowledge Base**: Train the bot on your specific business information for tailored functionality.
- **🎭 Customizable Personality**: Adjust the bot's communication tone and personality traits to match your brand voice.
- **🔐 Secure Authentication**: Enterprise-grade authentication powered by **Scalekit**.
- **💻 Embeddable Widget**: Easily integrate the customer support chat widget into any website.
- **⚡ Modern & Fast**: Built on the latest **Next.js 16 (App Router)** and **React 19** for optimal performance.
- **🎨 Beautiful UI**: Styled with **Tailwind CSS v4** and **Motion** for smooth animations and a premium feel.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via Mongoose)
- **AI / LLM**: [Google Generative AI SDK](https://github.com/google/google-api-nodejs-client)
- **Authentication**: [Scalekit SDK](https://scalekit.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm**, **yarn**, **pnpm**, or **bun**
- **MongoDB** connection string
- **Google AI Studio** API Key
- **Scalekit** Environment URL, Client ID, and Secret

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/ai-customer-support-chatbot.git
    cd ai-customer-support-chatbot
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Environment Setup:**

    Create a `.env.local` file in the root directory and add the following variables:

    ```env
    # Application
    NEXT_PUBLIC_API_URI=http://localhost:3000

    # Authentication (Scalekit)
    SCALEKIT_ENVIRONMENT_URL=your_scalekit_env_url
    SCALEKIT_CLIENT_ID=your_scalekit_client_id
    SCALEKIT_CLIENT_SECRET=your_scalekit_client_secret

    # Database
    MONGODB_URI=your_mongodb_connection_string

    # AI (Google Gemini)
    # Ensure your Google AI API key is configured where the SDK expects it,
    # or add a specific variable if your implementation uses one (e.g., GOOGLE_API_KEY).
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📂 Project Structure

```
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router pages and API routes
│   │   ├── (user)/      # User-facing routes
│   │   ├── api/         # Backend API endpoints
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Landing page
│   ├── components/      # Reusable React components
│   │   ├── Feature.tsx
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   └── ...
│   ├── lib/             # Utility functions and configurations
│   │   ├── db.ts        # Database connection
│   │   ├── env.ts       # Environment variable validation
│   │   └── scalekit.ts  # Scalekit configuration
│   └── models/          # Mongoose database models
│       └── business.model.ts
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation
```

## 🔌 API Reference

The application exposes several API endpoints for internal use:

- `/api/auth`: Handles user authentication flows.
- `/api/business`: Manages business profiles and settings.
- `/api/chat`: Processes chat messages using Google Gemini.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
