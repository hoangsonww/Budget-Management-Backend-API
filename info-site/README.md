# Budget Management API - Overview Wiki Page

This directory contains the comprehensive overview/wiki page for the Budget Management API project.

## Files

- **`../index.html`** - Main HTML file (located in project root)
- **`styles.css`** - Complete styling with dark theme
- **`script.js`** - Interactive features and animations

## Features

### 🎨 Design
- Modern dark theme with gradient accents
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Professional glassmorphism effects

### 📊 Mermaid Diagrams
The page includes beautiful, interactive Mermaid diagrams that render automatically:
- **Microservices Architecture** - Shows all 9 services and their interactions
- **Service Communication Flow** - Illustrates data flow between components
- **Project Structure** - Mind map of directory organization
- **Deployment Strategies** - Blue-Green and Canary deployment visualizations

### ⚡ Interactive Features
- Smooth scrolling navigation
- Scroll-to-top button
- Code snippet copy functionality
- Active navigation highlighting
- Animated statistics counters
- Parallax effects
- Mobile-responsive menu
- Keyboard navigation support

### 📚 Content Sections
1. **Hero Section** - Eye-catching introduction with live demo links
2. **Quick Stats** - Key project metrics
3. **Overview** - Project purpose and capabilities
4. **Architecture** - Detailed system architecture with diagrams
5. **Features** - 9+ core features with descriptions
6. **Project Structure** - Directory organization
7. **Setup Instructions** - Step-by-step getting started guide
8. **API Documentation** - All endpoints organized by service
9. **Deployment** - Multiple deployment strategies explained
10. **Testing** - QA and testing information
11. **Resources** - Links to documentation and demos
12. **Author** - About section with contact links

## Usage

### Local Development
Simply open `index.html` in a browser:
```bash
# From project root
open index.html
# or
firefox index.html
# or
chrome index.html
```

### With Local Server
For best results, serve with a local server:
```bash
# Python 3
python -m http.server 8000

# Node.js (with http-server)
npx http-server

# PHP
php -S localhost:8000
```

Then navigate to: `http://localhost:8000`

### Integration with Project
The page is designed to work as:
- Project homepage
- Documentation portal
- Developer onboarding guide
- API reference

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** - No dependencies
- **Mermaid.js** - Diagram rendering (CDN)
- **Font Awesome** - Icons (CDN)
- **Google Fonts** - Inter font family

## Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #4CAF50;
    --secondary-color: #2196F3;
    --accent-color: #FF9800;
    /* ... */
}
```

### Content
Modify `index.html` sections to update:
- Feature descriptions
- API endpoints
- Setup instructions
- Links and URLs

### JavaScript
Customize behaviors in `script.js`:
- Animation speeds
- Scroll thresholds
- Interactive features

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

## Performance

- Optimized for fast loading
- Lazy loading for images
- Efficient animations
- Minimal dependencies (only CDNs)

## Accessibility

- Semantic HTML5
- ARIA labels where needed
- Keyboard navigation
- Screen reader friendly
- Proper heading hierarchy

## Future Enhancements

Potential additions:
- [ ] Search functionality
- [ ] Light/Dark theme toggle
- [ ] Interactive code playground
- [ ] Live API status dashboard
- [ ] Changelog section
- [ ] Video tutorials
- [ ] Service worker for offline access

## Contributing

To update the overview page:
1. Edit HTML/CSS/JS files
2. Test across browsers
3. Ensure mobile responsiveness
4. Verify Mermaid diagrams render
5. Check all links work

## License

Same as the main project - MIT License

## Author

Created by Son Nguyen ([@hoangsonww](https://github.com/hoangsonww))
- Website: [sonnguyenhoang.com](https://sonnguyenhoang.com)
- Email: hoangson091104@gmail.com

---

Built with ❤️ for the Budget Management API project
