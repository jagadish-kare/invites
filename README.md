# Wedding Invitation Platform

A beautiful digital wedding invitation generator with customizable templates, photo galleries, and more.

## Features

- 🎊 Animated opening screen with floating particles
- 📸 Photo gallery with auto-play carousel
- 🗓️ Countdown timer and calendar
- 🗺️ Google Maps integration
- 📝 Guestbook for wishes
- 💝 Gift box with QR code support
- 📱 Fully responsive design

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Express.js, Node.js
- **Database**: JSON file-based (easily upgradeable to PostgreSQL/MongoDB)

## Local Development

```bash
# Install dependencies
npm install

# Run both frontend and backend
npm run dev

# Or run separately:
npm run dev:client  # Frontend at http://localhost:5173
npm run dev:server  # Backend at http://localhost:3000
```

## Production Build

```bash
# Build for production
npm run build

# Start production server
npm start           # Linux/Mac
npm run start:win   # Windows
```

## Deployment Options

### Option 1: Railway (Recommended - Free tier available)

1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new project → Deploy from GitHub
4. Railway will auto-detect and deploy

### Option 2: Render (Free tier available)

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new Web Service
4. Connect your repository
5. It will use `render.yaml` config

### Option 3: Docker

```bash
# Build image
docker build -t wedding-invitation .

# Run container
docker run -p 3000:3000 -v $(pwd)/uploads:/app/uploads wedding-invitation
```

### Option 4: VPS/Cloud Server

```bash
# Clone and install
git clone <your-repo>
cd invitation
npm install
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start dist-server/index.js --name wedding-invitation
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment | development |

## Project Structure

```
├── src/
│   ├── components/ui/     # Reusable UI components
│   ├── templates/         # Invitation templates
│   ├── pages/             # Route pages
│   ├── types/             # TypeScript types
│   └── styles/            # Global CSS
├── server/
│   └── index.ts           # Express server
├── dist/                  # Built frontend
├── dist-server/           # Built server
└── uploads/               # User uploads
```

## Adding New Templates

1. Create folder in `src/templates/YourTemplate/`
2. Create `index.tsx` implementing `TemplateProps`
3. Register in `InvitationPage.tsx`

## License

MIT
