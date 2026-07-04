# JSON API Explorer

A polished mini Postman-style web app for sending GET requests and exploring JSON responses in a clean, interactive interface. JSON API Explorer is built with only HTML5, CSS3, and Vanilla JavaScript, making it a strong beginner-to-intermediate frontend project for a portfolio or internship showcase.

## Live Links

- GitHub Repository: [fazal305/json-api-explorer](https://github.com/fazal305/json-api-explorer)
- Live Demo: [https://fazal305.github.io/json-api-explorer/](https://fazal305.github.io/json-api-explorer/)

## Overview

JSON API Explorer helps users test public JSON APIs directly in the browser. Enter an API URL, fetch the response, inspect the formatted JSON, expand nested objects and arrays in a recursive tree view, search across keys and values, copy the full response, or download it as a `.json` file.

The design uses a modern dark neon/cyberpunk developer-tool style with glowing borders, soft shadows, readable spacing, and a responsive layout that works well on both desktop and mobile screens.

Sample API URL:

```text
https://jsonplaceholder.typicode.com/users
```

## Features

- API URL input field for GET requests
- Fetch JSON button with loading state
- Clear error messages for invalid URLs, failed requests, network issues, and non-JSON responses
- Pretty-printed JSON response panel
- Recursive JSON tree generated dynamically with JavaScript
- Expand and collapse nested object and array nodes
- Search across both JSON keys and values
- Highlighted search results in the raw JSON and tree view
- Match counter for search results
- Copy full JSON response to clipboard
- Download full JSON response as a file
- Clear/reset button
- Fully responsive layout for mobile, tablet, and desktop
- Professional dark neon UI suitable for a project portfolio

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API
- Clipboard API
- Blob API
- URL.createObjectURL

## Learning Outcomes

This project demonstrates practical frontend skills, including:

- Structuring a semantic HTML page
- Creating a responsive two-panel app layout
- Designing with CSS variables for consistent colors and spacing
- Building a modern dark UI with glow effects and polished hover states
- Fetching API data with `async/await`
- Validating URLs before making requests
- Handling loading, success, and error states
- Safely parsing and rendering JSON
- Recursively generating UI for nested arrays and objects
- Handling strings, numbers, booleans, null values, arrays, and objects
- Implementing client-side search and highlighted matches
- Using browser APIs for clipboard copy and file download

## Folder Structure

```text
JSON_API_Explorer/
  index.html
  styles.css
  script.js
  README.md
  LICENSE
  .gitignore
```

## How To Run Locally

Clone the repository:

```powershell
git clone https://github.com/fazal305/json-api-explorer.git
```

Open the project folder:

```powershell
cd json-api-explorer
```

Open `index.html` directly in your browser, or run a simple local server:

```powershell
python -m http.server 5500
```

Then visit:

```text
http://localhost:5500
```

## How To Use

1. Enter a JSON API URL in the input field.
2. Click `Fetch JSON`.
3. View the formatted response in the Pretty JSON panel.
4. Explore nested data in the Tree Explorer panel.
5. Use the search box to find keys or values.
6. Copy the full response or download it as a JSON file.
7. Use `Clear` to reset the app.

## Suggested Test APIs

```text
https://jsonplaceholder.typicode.com/users
https://jsonplaceholder.typicode.com/posts
https://jsonplaceholder.typicode.com/comments
```

## Future Improvements

- Add support for custom request headers
- Add POST, PUT, PATCH, and DELETE methods
- Show response status, response time, and response headers
- Save recent API URLs in localStorage
- Add JSON path copying for tree nodes
- Add compact and expanded tree controls
- Add light/dark theme switching
- Add export options for formatted and minified JSON

## License

This project is licensed under the [MIT License](LICENSE).
