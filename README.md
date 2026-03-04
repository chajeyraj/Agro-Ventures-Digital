# 🌿 Agro Ventures Digital - Expense Tracker

A modern, cross-platform **Expense Tracker** application built with **React Native**, **Expo**, and **Supabase**. Manage your farm finances with style using a glassmorphism UI design.

## ✨ Features

- **📱 Cross-Platform**: Works on iOS, Android, and Web
- **🔐 Secure Authentication**: Email/password signup and login with Supabase Auth
- **💰 Expense Management**: Add, view, delete, and track expenses
- **🏷️ Custom Categories**: Create and manage custom expense categories
- **📊 Smart Filtering**: Filter expenses by category for detailed tracking
- **🎨 Modern UI**: Glassmorphism design with smooth animations
- **🌐 Real-time Sync**: Data synced instantly across devices
- **🟢 Olive Theme**: Premium green color scheme perfect for agricultural apps

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Expo CLI** (recommended for development)

### 1️⃣ Clone or Download the Project

```bash
# Clone the repository
git clone <your-repo-url>
cd "Agro Ventures Digital"

# Or navigate to the project directory
cd "d:\my project\Agro Ventures Digital"
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Set Up Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or use an existing one
3. Note your **Project URL** and **Anon Key** from Project Settings > API

### 4️⃣ Create Database Tables

1. In Supabase Dashboard, go to **SQL Editor**
2. Copy and paste the following SQL and run it:

```sql
-- 1. Create expenses table
create table expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  amount numeric not null,
  category text not null,
  created_at timestamp with time zone default now()
);

-- 2. Create categories table
create table categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  created_at timestamp with time zone default now(),
  unique(user_id, name)
);

-- 3. Enable Row Level Security (RLS)
alter table expenses enable row level security;
alter table categories enable row level security;

-- 4. Create RLS Policies for Expenses
create policy "Users can view their own expenses." on expenses for select using (auth.uid() = user_id);
create policy "Users can insert their own expenses." on expenses for insert with check (auth.uid() = user_id);
create policy "Users can delete their own expenses." on expenses for delete using (auth.uid() = user_id);

-- 5. Create RLS Policies for Categories
create policy "Users can view their own categories." on categories for select using (auth.uid() = user_id);
create policy "Users can insert their own categories." on categories for insert with check (auth.uid() = user_id);
```

### 5️⃣ Configure Environment Variables

1. In your project root, create a `.env` file:

```bash
cp .env.example .env
```

2. Update `.env` with your Supabase credentials:

```env
# Required: Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional: Google Gemini API Key (for AI features)
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
```

### 6️⃣ Configure Supabase Auth Settings

1. In Supabase Dashboard, go to **Authentication > Providers > Email**
2. **Toggle OFF** "Confirm email" option (allows instant login without email verification)
3. Save changes

### 7️⃣ Run the Application

#### For Web:
```bash
npm run web
```
Opens at `http://localhost:8081`

#### For iOS/Android (using Expo Go):
```bash
npm start
```
Then press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web browser
- Scan QR code with Expo Go app on your phone

#### For Development:
```bash
npm run dev
```

---

## 📋 Environment Variables Reference

Create a `.env` file in the project root with these variables:

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key for client-side access | `eyJhbGc...` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_GEMINI_API_KEY` | Google Gemini API key for AI features | `your-api-key` |

### How to Find Your Credentials

1. **Supabase URL & Key**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project
   - Click **Settings > API**
   - Copy **Project URL** and **anon (public)** key

2. **Google Gemini API Key**:
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Create an API key
   - Add to `.env`

---

## 📁 Project Structure

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

---

## 🔧 Available Scripts

```bash
# Start development server
npm start           # Starts Expo dev server
npm run dev         # Alias for npm start

# Web development
npm run web         # Runs app in web browser
npm run build       # Builds web production version
npm run preview     # Preview production build

# Other utilities
npm run lint        # Check TypeScript types
npm run clean       # Clean build artifacts
```

---

## 🎯 Usage Guide

### Register a New Account

1. Launch the app
2. Click **Register** tab
3. Enter email and password
4. Click **Register**
5. You'll be redirected to the login screen

### Login

1. Enter your email and password
2. Click **Login**
3. You'll see your expenses dashboard

### Add an Expense

1. On the Home screen, click **+ Add Expense**
2. Fill in:
   - **Title**: Expense description
   - **Amount**: Cost amount
   - **Category**: Select existing or type new category
3. Click **Add**

### Delete an Expense

1. On the Home screen, find the expense
2. Click the **trash icon** next to it
3. Confirm deletion

### Filter Expenses

1. Use the category filter buttons at the top
2. Click **All** to see all expenses
3. Click a category to filter by that category

---

## 🐛 Troubleshooting

### "Unable to resolve" Error
**Solution**: Clear cache and reinstall:
```bash
npm run clean
npm install
npm start
```

### "Failed to fetch" Error
**Solution**: 
- Check that Supabase tables are created (run SQL queries)
- Verify `.env` file has correct credentials
- Ensure email confirmation is disabled in Supabase

### "Cannot connect to Supabase"
**Solution**:
- Verify `EXPO_PUBLIC_SUPABASE_URL` is correct
- Check `EXPO_PUBLIC_SUPABASE_ANON_KEY` is valid
- Make sure your Supabase project is active

### Blank Login/Register Screen
**Solution**:
- Refresh the app (press `r` in terminal)
- Check browser console for errors
- Verify all dependencies installed: `npm install`

---

## 📱 Building for Production

### Web Build
```bash
npm run build
```
Output: `dist/` folder ready for deployment

### iOS/Android Build
```bash
# Using EAS (Expo Application Services)
eas build --platform ios
eas build --platform android

# Or build locally (requires Xcode/Android SDK)
expo build:ios
expo build:android
```

---

## 🔒 Security Notes

- The `EXPO_PUBLIC_*` prefix means variables are exposed to the client (safe for public keys)
- Never commit `.env` to version control (included in `.gitignore`)
- Use Row Level Security (RLS) in Supabase to protect user data
- Store sensitive keys (like API keys) securely

---

## 📚 Tech Stack

- **Frontend**: React Native Web, React 19
- **Mobile**: Expo 55, React Native
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS with react-native-web
- **Navigation**: React Navigation
- **Icons**: Lucide React Native
- **State Management**: React Context API
- **Language**: TypeScript

---

## 🤝 Contributing

Feel free to submit issues and pull requests!

---

## 📄 License

This project is open source. Use it freely for personal or commercial projects.

---

## 💡 Tips & Best Practices

1. **Keep `.env` secure**: Never share your Supabase keys
2. **Regular backups**: Download your data from Supabase regularly
3. **Test on device**: Use Expo Go to test on real devices
4. **Monitor usage**: Check Supabase dashboard for API usage

---

## 📞 Support

Have questions? Check:
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Native Documentation](https://reactnative.dev/)

---

**Happy tracking! 🌾**
