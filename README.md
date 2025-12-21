# Twitter Growth Tracker

A clean and interactive web application to visualize and manage your Twitter follower growth data.

## Features

- 📊 **Interactive Charts**: Visualize follower growth with dual-axis charts showing new followers, unfollows, and total count
- 📅 **Date Filtering**: Filter data by date range with an intuitive calendar picker
- ✏️ **Data Editing**: Add, edit, or delete daily statistics directly in the UI
- 📁 **CSV Import**: Import your Twitter Analytics data from CSV files
- 🎨 **Modern UI**: Clean, dark-themed interface with responsive design

## Run Locally

**Prerequisites:** Node.js (v18 or higher)

1. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

2. Run the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Build for Production

```bash
pnpm build
# or
npm run build
```

## How to Use

1. Visit [analytics.x.com](https://analytics.x.com)
2. Select your desired date range
3. Download the CSV file
4. Click "Import CSV" in the app to load your data
5. View your growth trends and edit data as needed

## Tech Stack

- **React 19** with TypeScript
- **Recharts** for data visualization
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **date-fns** for date handling
- **Vite** for build tooling
