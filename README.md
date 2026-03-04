#  Agro Ventures Digital - Expense Tracker

A modern, cross-platform **Expense Tracker** application built with **React Native**, **Expo**, and **Supabase**. Manage your farm finances with style using a glassmorphism UI design.

##  Features

- Cross-Platform: Works on iOS, Android, and Web
- Secure Authentication: Email/password signup and login with Supabase Auth
- Expense Management: Add, view, delete, and track expenses
- Custom Categories: Create and manage custom expense categories
- Smart Filtering: Filter expenses by category for detailed tracking
- Modern UI: Glassmorphism design with smooth animations
- Real-time Sync: Data synced instantly across devices
- Olive Theme: Premium green color scheme perfect for agricultural apps



##  Project Structure

```
Agro Ventures Digital/
├── src/
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   ├── theme.ts                # Color and styling constants
│   ├── constants.ts            # App constants
│   ├── types.ts                # TypeScript type definitions
│   ├── index.css               # Global styles
│   │
│   ├── components/
│   │   ├── Layout.tsx          # Main layout wrapper
│   │   ├── GlassCard.tsx       # Glassmorphism card component
│   │   └── SupabaseSetup.tsx   # Setup instruction component
│   │
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication context
│   │
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client setup
│   │   └── utils.ts            # Utility functions
│   │
│   └── screens/
│       ├── Auth.tsx            # Login/Register screen
│       ├── Home.tsx            # Expenses list screen
│       └── AddExpense.tsx       # Add expense screen
│
├── index.js                    # Root entry point for Expo
├── app.json                    # Expo configuration
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript configuration
├── .env                        # Environment variables (create this)
├── .env.example                # Environment variables template
└── README.md                   # This file
```
