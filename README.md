# SMART Train Schedule

A modern, responsive web application for viewing Sonoma-Marin Area Rail Transit (SMART) train schedules and ferry connections.

## 🚆 Features

- **Real-time Schedule Display**: View current and upcoming train departures
- **Interactive Route Planning**: Select departure and arrival stations with easy station swapping
- **Ferry Integration**: See connecting ferry schedules to San Francisco
- **Service Alerts**: Stay informed about service disruptions and schedule changes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: Built with screen readers and keyboard navigation in mind
- **Weekend/Weekday Schedules**: Toggle between different schedule types
- **Next Train Highlighting**: Easily identify the next available train

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom SMART branding
- **UI Components**: Radix UI primitives with shadcn/ui
- **Build Tool**: Vite for fast development and building
- **Routing**: React Router DOM
- **State Management**: React hooks with optimized performance
- **Code Quality**: ESLint, TypeScript strict mode

## 🚀 Quick Start

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-train-schedule
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📱 Usage

1. **Select Your Route**: Choose your departure and arrival stations from the dropdown menus
2. **Choose Schedule Type**: Toggle between weekday and weekend schedules
3. **View Results**: See all available trains with departure and arrival times
4. **Ferry Connections**: When traveling to Larkspur, ferry connection information is automatically displayed
5. **Service Alerts**: Check for any service disruptions or schedule changes

## 🎨 Design System

The application uses SMART's official brand colors:
- **SMART Green**: `#114533` - Primary brand color
- **SMART Gold**: `#E48E25` - Secondary accent color

The design follows modern web standards with:
- Consistent spacing and typography
- Accessible color contrast ratios
- Responsive breakpoints for all device sizes
- Smooth animations and transitions

## 📊 Data Structure

Train schedule data is organized by:
- **Stations**: 14 stations from Windsor to Larkspur
- **Directions**: Northbound and Southbound
- **Schedule Types**: Weekday and Weekend/Holiday
- **Ferry Connections**: Integrated Larkspur-San Francisco ferry schedules

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   ├── TrainScheduleApp.tsx  # Main application component
│   ├── RouteSelector.tsx     # Station selection interface
│   ├── ScheduleResults.tsx   # Schedule display
│   └── ...
├── data/                # Static schedule data
│   ├── stations.ts      # Station definitions
│   ├── weekdaySchedule.ts   # Weekday timetables
│   └── weekendSchedule.ts   # Weekend timetables
├── lib/                 # Utility functions
│   ├── scheduleUtils.ts # Schedule processing logic
│   └── utils.ts         # General utilities
├── types/               # TypeScript type definitions
└── pages/               # Page components
```

## ♿ Accessibility

This application is built with accessibility in mind:
- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes
- Focus management

## 📈 Performance

- **Pre-processed Data**: Schedule data is pre-calculated for fast lookups
- **Memoized Components**: React.memo used to prevent unnecessary re-renders
- **Optimized Bundle**: Tree-shaking and code splitting
- **Efficient Algorithms**: O(1) station lookups and optimized filtering

## 🚧 Future Enhancements

- [ ] Progressive Web App (PWA) capabilities
- [ ] Offline schedule caching
- [ ] Real-time delay information
- [ ] Push notifications for service alerts
- [ ] User preferences and favorite routes
- [ ] Multi-language support

## 🤝 Contributing

We welcome contributions to improve the SMART Train Schedule application! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For questions, suggestions, or support:
- Visit [SMART Train Official Website](https://sonomamarintrain.org/)
- Follow SMART on social media for service updates

---

Built with ❤️ for the SMART Train community
