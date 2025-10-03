# DayFlow - Daily Notes & Planning App

A focused daily planning application that helps you organize your day into three clear sections: meetings, todos, and routines. Built with React, Vite, and Tailwind CSS.

## Features

- **Three-Section Layout**: Organize your day with dedicated sections for meetings, todos, and routines
- **Meeting Management**: Schedule meetings with times, titles, and descriptions; track status (upcoming/active/completed)
- **Smart Todo List**: Add tasks with priority levels (high/medium/low), check off completed items, and clear finished tasks
- **Routine Tracking**: Build daily habits with streak counting and completion animations
- **Date Navigation**: Navigate between days to plan ahead or review past activities
- **Local Storage**: All data persists automatically in browser storage
- **Quick Add**: Rapidly add items with inline forms in each section
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to view the app.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Technology Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animation library
- **React Router** - Navigation
- **date-fns** - Date utilities
- **Lucide React** - Icon system
- **React Toastify** - Toast notifications

## Project Structure

```
src/
├── components/
│   ├── atoms/          # Basic UI components
│   ├── molecules/      # Composite components
│   ├── organisms/      # Complex feature components
│   ├── pages/          # Page components
│   └── ui/             # State components (Loading, Error, Empty)
├── services/           # Data services and API layer
├── utils/              # Utility functions
└── App.jsx             # Main app component
```

## Features in Detail

### Meetings Section
- Add meetings with specific times
- Include titles and optional descriptions
- Track meeting status: upcoming, active, or completed
- Quick add functionality for rapid scheduling
- Delete meetings when plans change

### Todos Section
- Create tasks with descriptive text
- Assign priority levels: high, medium, or low
- Check off completed tasks
- Clear all completed todos at once
- Color-coded priority badges for quick scanning

### Routine Section
- Track daily habits consistently
- Build streaks by completing routines daily
- Visual streak counter with fire emoji
- Celebration animations on completion
- Persistent routine items across all days

### Date Navigation
- Navigate to previous/next days
- Quick "Today" button to return to current date
- Visual date display showing day of week and full date
- Smooth transitions between dates

## Data Persistence

All data is stored locally in browser localStorage, organized by date. Each date has its own note containing:
- Array of meetings with times and details
- Array of todos with priorities and completion status
- Array of routines with streak tracking

## License

MIT