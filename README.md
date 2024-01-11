# Faith's Blog App

## Description

Simple Blog with Users Management App utilizing Next JS, TypeScript, and Chakra UI.

REST APIs are sourced from https://gorest.co.in

## Installation

To set up the project locally, follow these steps:

- Clone the repository: git clone https://github.com/FaithL3S5/blog-app.git
- Navigate to the project directory: cd blog-app
- Install the dependencies: npm install
- Setup the env variables accordingly
- Start the development server: npm run dev

## Scripts

- npm run start: Starts the server.
- npm run dev: Starts the development server.
- npm run build: Builds the application for production.
- npm run lint: Lints the project files.

## Features

The application offers the following features:

- Post Browsing: Allows you to browse contents that you and other users posted.
- User Management: Allows you to add, edit, and delete users.
- User Search Functionality: Enables you to search through available users list for management.
- Responsive Design: The application is mobile-friendly and adapts to various screen sizes.

## Dependencies

The project uses several dependencies:

    "dependencies": {
    "@chakra-ui/next-js": "^2.2.0",
    "@chakra-ui/react": "^2.8.2",
    "@emotion/react": "^11.11.3",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.15.3",
    "@mui/material": "^5.15.3",
    "axios": "^1.6.5",
    "dotenv": "^16.3.1",
    "framer-motion": "^10.17.9",
    "next": "14.0.4",
    "react": "^18",
    "react-dom": "^18",
    "react-twitch-embed-video": "^3.0.3",
    "use-debounce": "^10.0.0"
    },

    "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.0.4",
    "typescript": "^5"
    }

## Limitations

- I am having trouble implementing persistent search query so the search state will be reset everytime you change pages or refresh the website
- The twitch embed (on the right side with text "Live now") may reload everytime you change pages or refresh the website. Unfortunately, this is the nature of the library and not much can be done by my side.

## Contributing

Contributions to expand and improve the documentation are welcome!

Reach me out from the contacts available from my personal website https://faith-personal-web.vercel.app
