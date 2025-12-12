# Big Ten Spotting Grid

A professional football spotting board application designed for Big Ten Conference teams. This React-based web application allows coaches, scouts, and analysts to create and print player spotting boards with team branding and improved readability.

## Features

### 🏈 **Team Support**
- **Illinois Fighting Illini** - Illinois Orange (#E84A27)
- **Indiana Hoosiers** - Indiana Crimson (#990000)
- **Iowa Hawkeyes** - Iowa Black (#000000)
- **Maryland Terrapins** - Maryland Red (#E03A3E)
- **Michigan Wolverines** - Michigan Blue (#00274C)
- **Michigan State Spartans** - Michigan State Green (#18453B)
- **Minnesota Golden Gophers** - Minnesota Maroon (#7A0019)
- **Missouri State Bears** - Missouri State Maroon (#8B0000)
- **Nebraska Cornhuskers** - Nebraska Red (#E31837)
- **Northwestern Wildcats** - Northwestern Purple (#4E2A84)
- **Ohio State Buckeyes** - Ohio State Scarlet (#BB0000)
- **Penn State Nittany Lions** - Penn State Blue (#041E42)
- **Purdue Boilermakers** - Purdue Gold (#CEB888)
- **Rutgers Scarlet Knights** - Rutgers Scarlet (#D21034)
- **USC Trojans** - USC Gold (#FFC72C)
- **Wisconsin Badgers** - Wisconsin Red (#C5050C)

### 🎨 **Enhanced Features**
- **Dynamic Font Sizing** - Automatically adjusts text size for optimal readability
- **Bold Text Styling** - All player names and positions are displayed in bold for maximum visibility
- **Text Overflow Support** - Full player names are visible without truncation
- **Team Branding** - Custom colors and logos throughout the interface
- **Print-Ready** - Optimized for printing and PDF generation
- **Responsive Design** - Works on desktop and mobile devices

### 📊 **Spotting Board Features**
- **10x10 Grid Layout** - Traditional football spotting board format
- **Position-Based Organization** - Offense (green) and Defense (red) sections
- **Manual Position Override** - Use `"flip": "y"` to manually place players on opposite side
- **Special Teams Support** - Kickers, Punters, and Long Snappers properly categorized
- **Player Information** - Jersey numbers, positions, and phonetic names
- **Team Logo Integration** - Team logos displayed in headers and empty cells

## Usage

### 1. **Select Your Team**
- Choose from the dropdown of Big Ten Conference teams
- Each team includes official branding and colors

### 2. **Input Player Data**
- Paste your roster JSON data in the provided field
- Format: `{"players": [{"number": 1, "position": "QB", "name": "John Doe", "phonetic_name": "JOHN DOE"}]}`

#### **Manual Position Override (Flip System)**
You can manually override a player's automatic categorization by adding a `"flip"` property:
- **Normal**: Player appears on offense/defense based on their position
- **Flipped**: Add `"flip": "y"` or `"flip": "true"` to put the player on the opposite side

#### **Special Teams Roles**
You can specify special teams roles for players by adding a `"special_teams"` array:
- **KR**: Kick Return (🟡 Yellow circle)
- **KC**: Kick Coverage (🟠 Orange circle)
- **PR**: Punt Return (🟣 Purple circle)
- **PC**: Punt Coverage (🔵 Blue circle)
- **FGB**: Field Goal Block (🔴 Red-Orange circle)
- **FG**: Field Goal Kick (🟢 Green circle)

**Examples:**
```json
{
  "players": [
    {
      "number": 1,
      "position": "QB",
      "name": "John Doe",
      "phonetic_name": "JOHN DOE"
    },
    {
      "number": 2,
      "position": "CB",
      "name": "Jane Smith",
      "phonetic_name": "JANE SMITH",
      "flip": "y",
      "special_teams": ["KR", "PR"]
    },
    {
      "number": 3,
      "position": "WR",
      "name": "Bob Johnson",
      "phonetic_name": "BOB JOHNSON",
      "flip": "true",
      "special_teams": ["P"]
    },
    {
      "number": 4,
      "position": "K",
      "name": "Mike Wilson",
      "phonetic_name": "MIKE WILSON",
      "special_teams": ["KC", "FG"]
    }
  ]
}
```
In this example:
- Player #1 (QB) appears on offense (green) - normal behavior
- Player #2 (CB) appears on offense (green) instead of defense (red) - flipped with `"flip": "y"`, plus has yellow and purple circles for KR/PR
- Player #3 (WR) appears on defense (red) instead of offense (green) - flipped with `"flip": "true"`, plus has blue circle for PC
- Player #4 (K) appears on defense (red) - normal behavior, plus has orange and green circles for KC/FG

### 3. **Generate Board**
- Click "Generate Board" to create your spotting board
- The application automatically organizes players by position and number

### 4. **Print or Save**
- Use the "Print/Save as PDF" button
- Optimized for both printing and digital sharing

## Technical Details

### **Built With**
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **CSS-in-JS** - Inline styles for maximum compatibility
- **ESLint** - Code quality and consistency

### **Font Sizing Algorithm**
The application uses intelligent font sizing to maximize readability:
- **Base Size**: 12px for optimal visibility
- **Dynamic Scaling**: Automatically adjusts based on name length
- **Minimum Size**: 8px to ensure all text remains readable
- **Bold Styling**: All text uses bold font weight for maximum contrast

### **Text Overflow Handling**
- **Overflow: Visible** - Text extends beyond cell boundaries when needed
- **No Height Restrictions** - Natural text flow for complete name visibility
- **Enhanced Contrast** - More opaque backgrounds for better readability

## Development

### **Getting Started**
```bash
cd spotting-board
npm install
npm run dev
```

### **Building for Production**
```bash
npm run build
npm run preview
```

### **Deploying**
```bash
npm run deploy
```

## File Structure

```
spotting-board/
├── public/
│   ├── logos/           # Team logo SVGs
│   ├── missouri_state.png
│   └── big10spottergridlogo.png
├── src/
│   ├── App.jsx         # Main application component
│   ├── App.css         # Application styles
│   └── main.jsx        # Application entry point
└── README.md           # This file
```

## Contributing

This application is designed for Big Ten Conference teams. To add new teams:

1. Add team name to `bigTenTeams` array
2. Add logo mapping in `getTeamLogo()` function
3. Add team color in `getTeamColor()` function
4. Place team logo in `public/logos/` directory

## License

This project is designed for educational and professional use within the Big Ten Conference community.

---

**Big Ten Spotting Grid** - Professional football analysis made simple.
