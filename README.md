# Lukas Kanopka - Personal Portfolio Website

A modern, responsive personal portfolio website built with RetroUI design system, featuring a retro-futuristic aesthetic with smooth animations and interactive elements.

## 🚀 Features

- **RetroUI Design System**: Custom implementation of RetroUI components with retro-futuristic styling
- **Responsive Design**: Fully responsive layout that works on all devices
- **Interactive Elements**: Smooth animations, hover effects, and interactive terminal simulation
- **Modern Web Technologies**: Built with vanilla HTML, CSS, and JavaScript
- **Professional Sections**: Hero, About, Projects, and Contact sections
- **Mobile-First**: Optimized for mobile devices with hamburger navigation

## 🎨 Design Highlights

- **Retro Terminal**: Interactive terminal simulation in the hero section
- **Neon Glow Effects**: CSS-based glow effects and animations
- **Monospace Typography**: JetBrains Mono font for that authentic coding feel
- **Color Palette**: Carefully selected retro colors (orange, teal, yellow) on dark background
- **Smooth Transitions**: Buttery smooth animations and transitions throughout

## 📁 Project Structure

```
PersonalWebsite/
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # Main stylesheet with RetroUI styling
├── scripts/
│   └── main.js            # JavaScript for interactivity
├── components/
│   └── button.css         # RetroUI button component
├── package.json           # Project configuration
└── README.md             # Project documentation
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and accessibility
- **CSS3**: Custom properties, Grid, Flexbox, animations
- **JavaScript (ES6+)**: Modern JavaScript features
- **RetroUI**: Custom implementation of RetroUI design system
- **Google Fonts**: JetBrains Mono for typography

## 🎯 Sections

### Hero Section
- Animated name with glow effects
- Interactive terminal simulation
- Call-to-action buttons
- Floating animation effects

### About Section
- Professional description
- Skills organized by category (Frontend, Backend, Tools)
- Interactive skill tags with hover effects

### Projects Section
- Featured project cards with status indicators
- Technology tags for each project
- Hover animations and effects
- Demo and source code links (placeholder)

### Contact Section
- Contact form with validation
- Social media links (GitHub, Email, LinkedIn)
- Professional contact information

## 🚀 Getting Started

### Quick Start (Simple)
1. **Clone or download** the project files
2. **Open** `index.html` directly in your web browser

### Development Setup (Recommended)
For the best development experience with live reloading:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npx live-server --port=3000 --open=/ --watch=. --ignore=node_modules
   # or
   npm run dev
   ```
   This will:
   - Start a local server at `http://localhost:3000`
   - Automatically open your browser
   - Enable live reloading when you make changes to files
   - Watch all files for changes (HTML, CSS, JS)

3. **Alternative commands**:
   ```bash
   # Start server without opening browser
   npm run serve
   
   # Same as npm run dev
   npm start
   ```

### Development Features
- **Live Reload**: Changes to any file automatically refresh the browser
- **Port 3000**: Consistent development port for easy access
- **Auto-Open**: Browser opens automatically when server starts
- **File Watching**: Monitors all project files for changes

### Troubleshooting
If you encounter 404 errors when running the development server, ensure you're using the correct command format:

**✅ Correct**: `npx live-server --port=3000 --open=/ --watch=. --ignore=node_modules`

**❌ Incorrect**: `npx live-server --port=3000 --open --watch=. --ignore=node_modules`

The `--open` flag requires a value (like `/`) to specify the path to open. Without it, live-server may interpret `--open` as a directory name, causing 404 errors.

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## ✨ Interactive Features

- **Mobile Navigation**: Hamburger menu for mobile devices
- **Smooth Scrolling**: Navigate between sections smoothly
- **Form Validation**: Contact form with client-side validation
- **Keyboard Navigation**: Ctrl+Arrow keys for section navigation
- **Notification System**: Toast notifications for user feedback
- **Terminal Animation**: Typewriter effect in the hero terminal

## 🎨 Color Palette

```css
--primary: #ff6b35      /* Orange */
--secondary: #4ecdc4    /* Teal */
--accent: #ffe66d       /* Yellow */
--background: #0f0f23   /* Dark Blue */
--surface: #1a1a2e      /* Dark Surface */
--text-primary: #ffffff /* White */
--text-secondary: #a0a0a0 /* Light Gray */
```

## 🔧 Customization

To customize the website for your own use:

1. **Update Personal Information**:
   - Change name in `index.html` (line 33)
   - Update GitHub link (line 156)
   - Modify email and LinkedIn links (lines 200-210)

2. **Customize Content**:
   - Edit the about section description
   - Update skills and technologies
   - Replace project information with your own

3. **Styling**:
   - Modify CSS custom properties in `styles/main.css`
   - Adjust colors, fonts, and spacing as needed

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to fork this project and customize it for your own portfolio. If you make improvements, pull requests are welcome!

## 📞 Contact

- **GitHub**: [https://github.com/LukasKanopka](https://github.com/LukasKanopka)
- **Email**: lukas@example.com
- **LinkedIn**: [https://linkedin.com/in/lukaskanopka](https://linkedin.com/in/lukaskanopka)

---

Built with ❤️ using RetroUI design system