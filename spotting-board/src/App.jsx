import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [teamName, setTeamName] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [teamSearchTerm, setTeamSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTeamDropdown(false);
      }
    };

    if (showTeamDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTeamDropdown]);

  // Big Ten Conference Teams with logo mappings
  const bigTenTeams = [
    "Illinois Fighting Illini",
    "Indiana Hoosiers", 
    "Iowa Hawkeyes",
    "Maryland Terrapins",
    "Michigan Wolverines",
    "Michigan State Spartans",
    "Minnesota Golden Gophers",
    "Missouri State Bears",
    "Nebraska Cornhuskers",
    "Northwestern Wildcats",
    "Ohio State Buckeyes",
    "Oregon Ducks",
    "Penn State Nittany Lions",
    "Purdue Boilermakers",
    "Richmond Spiders",
    "Rutgers Scarlet Knights",
    "UCLA Bruins",
    "USC Trojans",
    "Washington Huskies",
    "William & Mary",
    "Wisconsin Badgers",
    "Florida International Panthers",
    "Youngstown State Penguins"
  ];

  // Function to calculate dynamic font size based on content length
  const getDynamicFontSize = (text, maxHeight = 24, baseFontSize = 12) => {
    if (!text) return baseFontSize;
    
    const length = text.length;
    const words = text.split(' ').length;
    
    // Smaller font sizes to match print layout
    if (length > 20 || words > 3) {
      return Math.max(8, baseFontSize - 4);
    } else if (length > 15 || words > 2) {
      return Math.max(8, baseFontSize - 4);
    } else if (length > 12 || words > 1) {
      return Math.max(8, baseFontSize - 4);
    } else if (length > 8) {
      return Math.max(8, baseFontSize - 4);
    }
    
    return Math.max(8, baseFontSize - 4);
  };

  // Function to split name into first and last name for better readability
  const splitNameForDisplay = (phoneticName) => {
    if (!phoneticName) return { firstName: '', lastName: '' };
    
    const words = phoneticName.trim().split(' ');
    if (words.length === 1) {
      return { firstName: words[0], lastName: '' };
    } else if (words.length === 2) {
      return { firstName: words[0], lastName: words[1] };
    } else {
      // For names with more than 2 parts, put first word as first name, rest as last name
      const firstName = words[0];
      const lastName = words.slice(1).join(' ');
      return { firstName, lastName };
    }
  };

  // Function to get team logo based on team name
  const getTeamLogo = (teamName) => {
    const logoMap = {
      "Illinois Fighting Illini": "./logos/Illinois.svg",
      "Indiana Hoosiers": "./logos/Indiana_(2025_Logo).svg",
      "Iowa Hawkeyes": "./logos/Iowa.svg",
      "Maryland Terrapins": "./logos/Maryland.svg",
      "Michigan Wolverines": "./logos/Michigan.svg",
      "Michigan State Spartans": "./logos/MichiganState.svg",
      "Minnesota Golden Gophers": "./logos/Minnesota.svg",
      "Missouri State Bears": "/spotting-grid/logos/missouri_state.png",
      "Nebraska Cornhuskers": "./logos/Nebraska_(2025_Logo).svg",
      "Northwestern Wildcats": "./logos/Northwestern_(2025_Logo).svg",
      "Ohio State Buckeyes": "./logos/OhioState.svg",
      "Oregon Ducks": "./logos/ORE_Primary.svg",
      "Penn State Nittany Lions": "./logos/PennState.svg",
      "Purdue Boilermakers": "./logos/Purdue.svg",
      "Richmond Spiders": "./logos/Richmond_Spiders_logo.svg.png",
      "Rutgers Scarlet Knights": "./logos/Rutgers.svg",
      "UCLA Bruins": "./logos/UCLA_Primary.svg",
      "USC Trojans": "./logos/USC_Primary.svg",
      "Washington Huskies": "./logos/Washington.svg",
      "William & Mary": "./logos/wm_logo.svg.png",
      "Wisconsin Badgers": "./logos/Wisconsin.svg",
      "Florida International Panthers": "./logos/fiu_logo_main.svg",
      "Youngstown State Penguins": "./logos/Youngstown_State_Penguins_logo.png"
    };
    return logoMap[teamName] || null;
  };

  // Function to get team color based on team name
  const getTeamColor = (teamName) => {
    const colorMap = {
      "Illinois Fighting Illini": "#E84A27", // Illinois Orange
      "Indiana Hoosiers": "#990000", // Indiana Crimson
      "Iowa Hawkeyes": "#000000", // Iowa Black
      "Maryland Terrapins": "#E03A3E", // Maryland Red
      "Michigan Wolverines": "#00274C", // Michigan Blue
      "Michigan State Spartans": "#18453B", // Michigan State Green
      "Minnesota Golden Gophers": "#7A0019", // Minnesota Maroon
      "Missouri State Bears": "#8B0000", // Missouri State Maroon
      "Nebraska Cornhuskers": "#E31837", // Nebraska Red
      "Northwestern Wildcats": "#4E2A84", // Northwestern Purple
      "Ohio State Buckeyes": "#BB0000", // Ohio State Scarlet
      "Oregon Ducks": "#154733", // Oregon Green
      "Penn State Nittany Lions": "#041E42", // Penn State Blue
      "Purdue Boilermakers": "#CEB888", // Purdue Gold
      "Richmond Spiders": "#DC143C", // Richmond Red
      "Rutgers Scarlet Knights": "#D21034", // Rutgers Scarlet
      "UCLA Bruins": "#2774AE", // UCLA Blue
      "USC Trojans": "#FFC72C", // USC Gold
      "Washington Huskies": "#4B2E83", // Washington Purple
      "William & Mary": "#115740", // William & Mary Green
      "Wisconsin Badgers": "#C5050C", // Wisconsin Red
      "Florida International Panthers": "#081E3F", // FIU Blue
      "Youngstown State Penguins": "#DC143C" // Youngstown State Red
    };
    return colorMap[teamName] || "#e74c3c"; // Default to current red if team not found
  };

  // Function to get special teams color based on role
  const getSpecialTeamsColor = (role) => {
    const colorMap = {
      "KR": "#FFD700", // Yellow for Kick Return
      "KC": "#FF8C00", // Orange for Kick Coverage
      "PR": "#9370DB", // Purple for Punt Return
      "PC": "#4169E1", // Blue for Punt Coverage
      "FGB": "#FF4500", // Red-Orange for Field Goal Block
      "FG": "#32CD32", // Green for Field Goal Kick
      "ST": "#000000"  // Black for General Special Teams
    };
    return colorMap[role] || "#808080"; // Default to gray if role not found
  };

  // Function to determine text color for good contrast
  const getContrastTextColor = (backgroundColor) => {
    // Special case: ST (black background) always uses white text
    if (backgroundColor === '#000000') {
      return '#FFFFFF';
    }
    
    // Convert hex to RGB
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light backgrounds, white for dark backgrounds
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  const filteredTeams = bigTenTeams.filter(team =>
    team.toLowerCase().includes(teamSearchTerm.toLowerCase())
  );

  const handleTeamSelect = (team) => {
    setTeamName(team);
    setTeamSearchTerm('');
    setShowTeamDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = JSON.parse(jsonInput);
      if (!Array.isArray(data.players)) throw new Error('Missing players array');
      setPlayers(data.players);
    } catch (err) {
      setError('Invalid JSON: ' + err.message);
      setPlayers([]);
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  // Build a map: number -> { offense: [], defense: [] }
  const boardMap = {};
  
  // Filter out players marked to ignore
  const activePlayers = players.filter(p => !(p.ignore === "y" || p.ignore === "Y" || p.ignore === "true" || p.ignore === "True" || p.ignore === "TRUE"));
  
  // First pass: categorize all players normally
  activePlayers.forEach((p) => {
    if (!boardMap[p.number]) boardMap[p.number] = { offense: [], defense: [] };
    
    // Check if player should be flipped to opposite side (manual override)
    const shouldFlip = p.flip === "y" || p.flip === "Y" || p.flip === "true" || p.flip === "True" || p.flip === "TRUE";
    
    // Determine if player is naturally offensive or defensive
    const isNaturallyOffensive = (() => {
      // Check exact matches first
      if (["QB","RB","WR","TE","OL","FB","OT","OG","C","LS"].includes(p.position)) {
        return true;
      }
      
      // Check for slash positions (e.g., "QB/WR", "RB/WR")
      if (p.position.includes('/')) {
        const positions = p.position.split('/');
        return positions.some(pos => ["QB","RB","WR","TE","OL","FB","OT","OG","C","LS"].includes(pos));
      }
      
      return false;
    })();
    
    // Apply flip logic: if flip is "y", put player on opposite side
    if (shouldFlip) {
      if (isNaturallyOffensive) {
        boardMap[p.number].defense.push(p);
      } else {
        boardMap[p.number].offense.push(p);
      }
    } else {
      // Normal categorization based on position
      if (isNaturallyOffensive) {
        boardMap[p.number].offense.push(p);
      } else {
        boardMap[p.number].defense.push(p);
      }
    }
  });

  // Second pass: auto-flip special teamers to resolve conflicts
  Object.entries(boardMap).forEach(([number, cell]) => {
    const specialTeamsPositions = ["K", "LS", "P", "SNP", "P/K", "K/P", "PK", "KP", "ST"];
    
    // Case 1: Players on both offense and defense sides
    const hasOffense = cell.offense.length > 0;
    const hasDefense = cell.defense.length > 0;
    
    if (hasOffense && hasDefense) {
      // Check offense side for special teamers
      const offenseSpecialTeamers = cell.offense.filter(p => 
        specialTeamsPositions.includes(p.position) && !p.flip // Don't auto-flip if manually set
      );
      
      // Check defense side for special teamers  
      const defenseSpecialTeamers = cell.defense.filter(p => 
        specialTeamsPositions.includes(p.position) && !p.flip // Don't auto-flip if manually set
      );
      
      // Log conflict detection
      if (offenseSpecialTeamers.length > 0 || defenseSpecialTeamers.length > 0) {
        console.log(`Number ${number} has offense/defense conflict:`, {
          offense: cell.offense.map(p => `${p.name} (${p.position})`),
          defense: cell.defense.map(p => `${p.name} (${p.position})`),
          specialTeamers: {
            offense: offenseSpecialTeamers.map(p => `${p.name} (${p.position})`),
            defense: defenseSpecialTeamers.map(p => `${p.name} (${p.position})`)
          }
        });
      }
      
      // Auto-flip logic: if we have special teamers on one side and regular players on the other,
      // flip the special teamers to create better separation
      if (offenseSpecialTeamers.length > 0 && cell.defense.some(p => !specialTeamsPositions.includes(p.position))) {
        // Move special teamers from offense to defense
        offenseSpecialTeamers.forEach(player => {
          const index = cell.offense.indexOf(player);
          if (index > -1) {
            cell.offense.splice(index, 1);
            cell.defense.push(player);
            console.log(`🔄 Auto-flipped ${player.name} (${player.position}) from offense to defense for number ${number}`);
          }
        });
      } else if (defenseSpecialTeamers.length > 0 && cell.offense.some(p => !specialTeamsPositions.includes(p.position))) {
        // Move special teamers from defense to offense
        defenseSpecialTeamers.forEach(player => {
          const index = cell.defense.indexOf(player);
          if (index > -1) {
            cell.defense.splice(index, 1);
            cell.offense.push(player);
            console.log(`🔄 Auto-flipped ${player.name} (${player.position}) from defense to offense for number ${number}`);
          }
        });
      }
    }
    
    // Case 2: Multiple defensive players with same number (including special teamers)
    if (cell.defense.length > 1) {
      const defensiveSpecialTeamers = cell.defense.filter(p => 
        specialTeamsPositions.includes(p.position) && !p.flip // Don't auto-flip if manually set
      );
      const regularDefensivePlayers = cell.defense.filter(p => 
        !specialTeamsPositions.includes(p.position)
      );
      
      // If we have both special teamers and regular defensive players, move special teamers to offense
      if (defensiveSpecialTeamers.length > 0 && regularDefensivePlayers.length > 0) {
        console.log(`Number ${number} has defensive conflict:`, {
          defense: cell.defense.map(p => `${p.name} (${p.position})`),
          specialTeamers: defensiveSpecialTeamers.map(p => `${p.name} (${p.position})`),
          regular: regularDefensivePlayers.map(p => `${p.name} (${p.position})`)
        });
        
        defensiveSpecialTeamers.forEach(player => {
          const index = cell.defense.indexOf(player);
          if (index > -1) {
            cell.defense.splice(index, 1);
            cell.offense.push(player);
            console.log(`🔄 Auto-flipped ${player.name} (${player.position}) from defense to offense for number ${number} (defensive conflict)`);
          }
        });
      }
    }
    
    // Case 3: Multiple offensive players with same number (including special teamers)
    if (cell.offense.length > 1) {
      const offensiveSpecialTeamers = cell.offense.filter(p => 
        specialTeamsPositions.includes(p.position) && !p.flip
      );
      const regularOffensivePlayers = cell.offense.filter(p => 
        !specialTeamsPositions.includes(p.position)
      );
      
      // If we have both special teamers and regular offensive players, move special teamers to defense
      // This creates separation (e.g., QB on offense, K on defense)
      if (offensiveSpecialTeamers.length > 0 && regularOffensivePlayers.length > 0) {
        console.log(`Number ${number} has offensive conflict:`, {
          offense: cell.offense.map(p => `${p.name} (${p.position})`),
          specialTeamers: offensiveSpecialTeamers.map(p => `${p.name} (${p.position})`),
          regular: regularOffensivePlayers.map(p => `${p.name} (${p.position})`)
        });
        
        offensiveSpecialTeamers.forEach(player => {
          const index = cell.offense.indexOf(player);
          if (index > -1) {
            cell.offense.splice(index, 1);
            cell.defense.push(player);
            console.log(`🔄 Auto-flipped ${player.name} (${player.position}) from offense to defense for number ${number} (offensive conflict)`);
          }
        });
      }
    }
    
    // Case 4: Only flip special teamers when there's a real conflict with defensive players
    if (hasOffense && hasDefense) {
      const offensiveSpecialTeamers = cell.offense.filter(p => 
        specialTeamsPositions.includes(p.position) && !p.flip
      );
      const defensiveSpecialTeamers = cell.defense.filter(p => 
        specialTeamsPositions.includes(p.position) && !p.flip
      );
      
      // Only flip defensive special teamers to offense if there are NON-special teams defensive players
      // This prevents flipping when both players are offensive (e.g., QB + K both on offense)
      const nonSpecialTeamsDefense = cell.defense.filter(p => !specialTeamsPositions.includes(p.position));
      
      if (defensiveSpecialTeamers.length > 0 && nonSpecialTeamsDefense.length > 0) {
        console.log(`Number ${number} has defensive special teamers with regular defensive players, moving special teamers to offense:`, {
          offense: cell.offense.map(p => `${p.name} (${p.position})`),
          defense: cell.defense.map(p => `${p.name} (${p.position})`),
          specialTeamers: defensiveSpecialTeamers.map(p => `${p.name} (${p.position})`),
          regularDefense: nonSpecialTeamsDefense.map(p => `${p.name} (${p.position})`)
        });
        
        defensiveSpecialTeamers.forEach(player => {
          const index = cell.defense.indexOf(player);
          if (index > -1) {
            cell.defense.splice(index, 1);
            cell.offense.push(player);
            console.log(`🔄 Auto-flipped ${player.name} (${player.position}) from defense to offense for number ${number} (defensive conflict)`);
          }
        });
      }
    }
  });

  // Log summary of auto-flipping results
  let totalAutoFlipped = 0;
  Object.entries(boardMap).forEach(([number, cell]) => {
    if (cell.offense.length > 0 && cell.defense.length > 0) {
      totalAutoFlipped++;
    }
  });
  if (totalAutoFlipped > 0) {
    console.log(`📊 Auto-flipping complete. ${totalAutoFlipped} numbers have players on both sides.`);
  }

  // Sort defense arrays to put special teams positions at the bottom
  Object.values(boardMap).forEach(cell => {
    cell.defense.sort((a, b) => {
      const specialTeamsPositions = ["K", "LS", "P", "SNP", "P/K", "K/P", "PK", "KP", "ST"];
      const aIsSpecialTeams = specialTeamsPositions.includes(a.position);
      const bIsSpecialTeams = specialTeamsPositions.includes(b.position);
      
      if (aIsSpecialTeams && !bIsSpecialTeams) return 1; // a goes after b
      if (!aIsSpecialTeams && bIsSpecialTeams) return -1; // a goes before b
      return 0; // keep original order for same type
    });
  });

  // Render a 10x10 grid
  const grid = [];
  console.log('Rendering grid, teamName:', teamName);
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const num = row * 10 + col;
      const cell = boardMap[num] || { offense: [], defense: [] };
      const hasPlayers = cell.offense.length > 0 || cell.defense.length > 0;
      if (!hasPlayers) {
        // Light grey cell for numbers with no players
        grid.push(
          <div key={num} className="grid-cell" style={{ 
            background: '#f0f0f0', 
            border: '1px solid #333',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {getTeamLogo(teamName) && (
              <img 
                src={getTeamLogo(teamName)} 
                alt={`${teamName} logo`}
                style={{
                  width: '40px',
                  height: '40px',
                  objectFit: 'contain',
                  opacity: 0.32,
                  filter: 'grayscale(100%)',
                  border: 'none',
                  outline: 'none'
                }}
              />
            )}
          </div>
        );
      } else {
        grid.push(
          <div key={num} className="grid-cell" style={{ 
            background: 'white', 
            border: '1px solid #333', 
            padding: 0, 
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '95px'
          }}>
            <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 14, marginTop: 2, height: 18, position: 'relative', zIndex: 1 }}>{num}</div>
            <div style={{ display: 'flex', flexDirection: 'column', height: 75, position: 'relative', overflow: 'hidden' }}>
              {/* Offense (dynamic height) */}
              <div style={{ 
                height: cell.offense.length > 0 && cell.defense.length === 0 ? '100%' : '50%',
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                padding: '1px 0' 
              }}>
                {cell.offense.length > 0 && (
                  <div style={{ 
                    background: (() => {
                      // Check if the offense array contains only special teams players
                      const specialTeamsPositions = ["K", "LS", "P", "SNP", "P/K", "K/P", "PK", "KP", "ST"];
                      const allOffenseSpecialTeams = cell.offense.every(p => specialTeamsPositions.includes(p.position));
                      const onlyOffenseSpecialTeams = allOffenseSpecialTeams && cell.offense.length > 0;
                      
                      if (onlyOffenseSpecialTeams) {
                        return 'rgba(255, 255, 200, 0.95)'; // Dull yellow for special teams only
                      } else {
                        return 'rgba(200, 247, 197, 0.95)'; // Green for regular offense
                      }
                    })(),
                    color: '#222', 
                    borderRadius: 2, 
                    margin: '0px 1px', 
                    padding: '1px 0', 
                    textAlign: 'center', 
                    fontSize: 8, 
                    fontWeight: 500, 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    wordWrap: 'break-word', 
                    overflow: 'visible', 
                    position: 'relative', 
                    zIndex: 1 
                  }}>
                    {cell.offense.map((p, i) => (
                      <div key={i} style={{ lineHeight: '1.0', padding: cell.offense.length > 1 ? '0px 1px' : '1px 1px' }}>
                        <div style={{ 
                          fontSize: cell.offense.length > 1 ? 7 : 7, 
                          fontWeight: 'bold', 
                          marginBottom: cell.offense.length > 1 ? 0 : 1, 
                          color: '#000',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '2px'
                        }}>
                          {p.position}
                          {/* Special Teams Circles - Smaller when 5+ to fit in one row */}
                          {p.special_teams && p.special_teams.length > 0 && (
                            <div style={{ display: 'flex', gap: p.special_teams.length >= 5 ? '1px' : '2px', flexWrap: 'nowrap' }}>
                              {p.special_teams.map((role, roleIndex) => (
                                <div
                                  key={roleIndex}
                                  style={{
                                    width: p.special_teams.length >= 5 ? '8px' : '12px',
                                    height: p.special_teams.length >= 5 ? '8px' : '12px',
                                    borderRadius: '50%',
                                    backgroundColor: getSpecialTeamsColor(role),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: p.special_teams.length >= 5 ? '4px' : '6px',
                                    fontWeight: 'bold',
                                    color: getContrastTextColor(getSpecialTeamsColor(role)),
                                    border: '1px solid #000',
                                    lineHeight: '1',
                                    flexShrink: 0
                                  }}
                                  title={role}
                                >
                                  {role}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div style={{ 
                          fontSize: getDynamicFontSize(p.phonetic_name), 
                          fontWeight: 'bold',
                          wordBreak: 'break-word', 
                          lineHeight: '1.1', 
                          maxHeight: 'none', 
                          overflow: 'visible', 
                          paddingBottom: '1px', 
                          paddingTop: '1px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: '20px',
                          color: '#000'
                        }}>
                          {(() => {
                            const { firstName, lastName } = splitNameForDisplay(p.phonetic_name);
                            return (
                              <>
                                {firstName && <div style={{ fontSize: getDynamicFontSize(firstName, 12, 10) }}>{firstName}</div>}
                                {lastName && <div style={{ fontSize: getDynamicFontSize(lastName, 12, 10) }}>{lastName}</div>}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Defense (dynamic height) */}
              <div style={{ 
                height: cell.defense.length > 0 && cell.offense.length === 0 ? '100%' : '50%',
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'flex-end', 
                padding: '0',
                margin: '0',
                alignItems: 'stretch'
              }}>
                {cell.defense.length > 0 && (
                  <div style={{ 
                    background: (() => {
                      // Check if the defense array contains only special teams players
                      const specialTeamsPositions = ["K", "LS", "P", "SNP", "P/K", "K/P", "PK", "KP", "ST"];
                      const allDefenseSpecialTeams = cell.defense.every(p => specialTeamsPositions.includes(p.position));
                      const onlyDefenseSpecialTeams = allDefenseSpecialTeams && cell.defense.length > 0;
                      
                      if (onlyDefenseSpecialTeams) {
                        return 'rgba(255, 255, 200, 0.95)'; // Dull yellow for special teams only
                      } else {
                        return 'rgba(247, 197, 197, 0.95)'; // Red for regular defense
                      }
                    })(),
                    color: '#222', 
                    borderRadius: 2, 
                    margin: '0px 1px', 
                    padding: '1px 0', 
                    textAlign: 'center', 
                    fontSize: 8, 
                    fontWeight: '500', 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'flex-end', 
                    wordWrap: 'break-word', 
                    overflow: 'visible', 
                    position: 'relative', 
                    zIndex: 1 
                  }}>
                    {cell.defense.map((p, i) => (
                      <div key={i} style={{ lineHeight: '1.0', padding: cell.defense.length > 1 ? '0px 1px' : '1px 1px' }}>
                        <div style={{ 
                          fontSize: cell.defense.length > 1 ? 7 : 7, 
                          fontWeight: 'bold', 
                          marginBottom: cell.defense.length > 1 ? 0 : 1, 
                          color: '#000',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '2px'
                        }}>
                          {p.position}
                          {/* Special Teams Circles - Smaller when 5+ to fit in one row */}
                          {p.special_teams && p.special_teams.length > 0 && (
                            <div style={{ display: 'flex', gap: p.special_teams.length >= 5 ? '1px' : '2px', flexWrap: 'nowrap' }}>
                              {p.special_teams.map((role, roleIndex) => (
                                <div
                                  key={roleIndex}
                                  style={{
                                    width: p.special_teams.length >= 5 ? '8px' : '12px',
                                    height: p.special_teams.length >= 5 ? '8px' : '12px',
                                    borderRadius: '50%',
                                    backgroundColor: getSpecialTeamsColor(role),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: p.special_teams.length >= 5 ? '4px' : '6px',
                                    fontWeight: 'bold',
                                    color: getContrastTextColor(getSpecialTeamsColor(role)),
                                    border: '1px solid #000',
                                    lineHeight: '1',
                                    flexShrink: 0
                                  }}
                                  title={role}
                                >
                                  {role}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div style={{ 
                          fontSize: getDynamicFontSize(p.phonetic_name), 
                          fontWeight: 'bold',
                          wordBreak: 'break-word', 
                          lineHeight: '1.1', 
                          maxHeight: 'none', 
                          overflow: 'visible', 
                          paddingBottom: '1px', 
                          paddingTop: '1px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minHeight: '20px',
                          color: '#000'
                        }}>
                          {(() => {
                            const { firstName, lastName } = splitNameForDisplay(p.phonetic_name);
                            return (
                              <>
                                {firstName && <div style={{ fontSize: getDynamicFontSize(firstName, 12, 10) }}>{firstName}</div>}
                                {lastName && <div style={{ fontSize: getDynamicFontSize(lastName, 12, 10) }}>{lastName}</div>}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      padding: 0,
      margin: 0
    }}>
      {/* Print-only styles */}
      {/* 
      ⚠️ CRITICAL PRINT LAYOUT RULES - NEVER BREAK THESE ⚠️
      
      These dimensions are PERFECT for single-page portrait printing:
      - Grid: Responsive (CSS Grid with 1fr units, adapts to paper size)
      - Page margins: 0 (edge-to-edge)
      - Table margins: 0 (no centering)
      
      🚫 NEVER CHANGE:
      - Grid height: calc(100vh - 200px) (responsive to paper size)
      - Grid width: 100% (fills available space)
      - CSS Grid: 10×10 with 1fr units (responsive sizing)
      - Page margins: 0 (any margins = wasted space)
      - Table margins: 0 (any centering = horizontal issues)
      
      ✅ ALWAYS MAINTAIN:
      - 10×10 grid (100 cells total)
      - Responsive dimensions (adapts to paper size)
      - Zero margins and padding
      - Print CSS matches screen CSS exactly
      
      If you need to adjust anything, ONLY modify:
      - Font sizes (within cells)
      - Special teams circle sizes
      - Content spacing (within cells)
      - Colors and styling
      
      NEVER touch the core dimensions above!
      */}
      <style>
        {`
          /* Print CSS - Updated to fix defensive section bottom alignment - v2.1 */
          @media print {
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            body { 
              margin: 0 !important; 
              padding: 0 !important; 
              background: white !important;
            }
            @page {
              margin: 0 !important;
              size: legal !important;
            }
            * { 
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .board-container { 
              page-break-inside: avoid;
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
              width: 100% !important;
              max-width: none !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              border: none !important;
              backdrop-filter: none !important;
            }
            .board-title {
              margin: 5px 0 !important;
              padding: 5px 0 !important;
              font-size: 1.2rem !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              gap: 16px !important;
            }
            .board-grid-wrapper {
              overflow: visible !important;
            }
            .board-grid {
              display: grid !important;
              grid-template-columns: repeat(10, 1fr) !important;
              grid-template-rows: repeat(10, 1fr) !important;
              width: 100% !important;
              max-width: 100% !important;
              height: calc(100vh - 200px) !important;
              margin: 0 !important;
              gap: 0px !important;
              border: 1px solid #333 !important;
            }
            .grid-cell {
              page-break-inside: avoid;
              padding: 0 !important;
              margin: 0 !important;
              border: 1px solid #333 !important;
              position: relative !important;
              /* Force cell to fill grid space properly */
              height: 100% !important;
              min-height: 95px !important;
              display: flex !important;
              flex-direction: column !important;
            }
            .grid-cell > div:first-child {
              height: 18px !important;
              margin-top: 2px !important;
              font-size: 14px !important;
            }
            .grid-cell > div:last-child {
              height: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              display: flex !important;
              flex-direction: column !important;
              box-sizing: border-box !important;
              /* Force to fill entire cell space */
              min-height: 75px !important;
              flex: 1 !important;
            }
            .grid-cell > div > div {
              margin: 0 !important;
              padding: 0 !important;
            }
            /* Offense section - matches screen behavior */
            .grid-cell > div:last-child > div:first-child {
              display: flex !important;
              flex-direction: column !important;
              justify-content: flex-start !important;
              padding: 1px 0 !important;
              box-sizing: border-box !important;
              min-height: 0 !important;
            }
            /* Defense section - PRESERVE JavaScript structure */
            .grid-cell > div:last-child > div:last-child {
              /* Let JavaScript handle this - no overrides */
            }
            /* When both offense and defense exist, they should be 50/50 */
            .grid-cell > div:last-child > div:first-child:not(:only-child) {
              flex: 1 !important;
            }
            .grid-cell > div:last-child > div:last-child:not(:only-child) {
              flex: 1 !important;
            }
            /* When only defense exists, it should take 100% */
            .grid-cell > div:last-child > div:last-child:only-child {
              flex: 1 !important;
              height: 100% !important;
            }
            /* When only offense exists, it should take 100% */
            .grid-cell > div:last-child > div:first-child:only-child {
              flex: 1 !important;
              height: 100% !important;
            }
            /* Defensive sections - PRESERVE JavaScript structure */
            .grid-cell > div:last-child > div:last-child > div {
              /* Let JavaScript handle this - no overrides */
            }
            /* Offensive sections - PRESERVE JavaScript structure */
            .grid-cell > div:last-child > div:first-child > div {
              /* Let JavaScript handle this - no overrides */
            }
            .grid-cell[style*="background: #f0f0f0"] {
              background: #f0f0f0 !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .grid-cell[style*="background: white"] {
              background: white !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .grid-cell div[style*="background: #c8f7c5"] {
              background: #c8f7c5 !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .grid-cell div[style*="background: #f7c5c5"] {
              background: #f7c5c5 !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .grid-cell div[style*="background: rgba(255, 255, 200"] {
              background: #ffffc8 !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .board-section {
              margin: 0 !important;
              padding: 0 !important;
            }
            .app-main {
              width: 100% !important;
              max-width: none !important;
              margin: 0 !important;
              padding: 0 !important;
            }
          }
          @media screen {
            .print-only { display: none; }
          }
        `}
      </style>

      {/* Header with Big Ten branding */}
      <header className="app-header no-print" style={{
        background: 'rgba(26, 37, 47, 0.7)',
        borderBottom: '3px solid rgba(231, 76, 60, 0.8)',
        padding: '20px 0',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="header-container" style={{ width: '70vw', maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div className="header-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="logo-container">
              <img 
                src={`${import.meta.env.BASE_URL}big10spottergridlogo.png`}
                alt="Big Ten Spotter Grid Logo" 
                className="b1g-logo"
                style={{
                  height: '160px',
                  width: 'auto',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="app-main" style={{ width: '70vw', maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {/* Form and UI (hidden when printing) */}
        <section className="form-section no-print" style={{ width: '100%', maxWidth: '100%' }}>
          <div className="form-container" style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            marginBottom: '24px',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            width: '100%',
            maxWidth: '100%'
          }}>
            <form className="spotting-board-form" onSubmit={handleSubmit}>
              <div className="team-selector-container" style={{ marginBottom: '16px', position: 'relative' }}>
                <label className="team-selector-label" style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: '#ffffff',
                  fontSize: '1.1rem',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
                  Team Name:
                </label>
                <div className="team-dropdown-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
                  <input 
                    className="team-search-input"
                    value={teamSearchTerm}
                    onChange={(e) => {
                      setTeamSearchTerm(e.target.value);
                      setShowTeamDropdown(true);
                      if (!e.target.value) setTeamName('');
                    }}
                    onFocus={() => setShowTeamDropdown(true)}
                    placeholder="Search Big Ten teams..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      boxSizing: 'border-box',
                      background: 'rgba(255,255,255,0.9)',
                      color: '#2c3e50'
                    }}
                  />
                  {teamName && (
                    <div className="team-selected-badge" style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: '#27ae60',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      ✓ Selected
                    </div>
                  )}
                  {showTeamDropdown && (
                    <div className="team-dropdown-menu" style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      background: 'rgba(255,255,255,0.95)',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderRadius: '6px',
                      maxHeight: '200px',
                      overflowY: 'auto',
                      zIndex: 1000,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}>
                      {filteredTeams.length > 0 ? (
                        filteredTeams.map((team, index) => (
                          <div
                            key={index}
                            className="team-option"
                            onClick={() => handleTeamSelect(team)}
                            style={{
                              padding: '10px 12px',
                              cursor: 'pointer',
                              borderBottom: '1px solid rgba(0,0,0,0.1)',
                              color: '#2c3e50',
                              transition: 'background 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px'
                            }}
                            onMouseOver={(e) => e.target.style.background = 'rgba(231, 76, 60, 0.1)'}
                            onMouseOut={(e) => e.target.style.background = 'transparent'}
                          >
                            {getTeamLogo(team) && (
                              <img 
                                src={getTeamLogo(team)} 
                                alt={`${team} logo`}
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  objectFit: 'contain'
                                }}
                              />
                            )}
                            {team}
                          </div>
                        ))
                      ) : (
                        <div className="no-teams-found" style={{
                          padding: '10px 12px',
                          color: '#7f8c8d',
                          fontStyle: 'italic'
                        }}>
                          No teams found
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {teamName && (
                  <div className="selected-team-display" style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    background: 'rgba(39, 174, 96, 0.2)',
                    borderRadius: '4px',
                    border: '1px solid rgba(39, 174, 96, 0.4)',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                  }}>
                    {getTeamLogo(teamName) && (
                      <img 
                        src={getTeamLogo(teamName)} 
                        alt={`${teamName} logo`}
                        style={{
                          width: '20px',
                          height: '20px',
                          objectFit: 'contain'
                        }}
                      />
                    )}
                    Selected: <strong>{teamName}</strong>
                  </div>
                )}
              </div>
              <div className="json-input-container" style={{ marginBottom: '16px' }}>
                <label className="json-input-label" style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold', 
                  color: '#ffffff',
                  fontSize: '1.1rem',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}>
                  Players JSON:
                </label>
                <textarea 
                  className="json-input-field"
                  value={jsonInput} 
                  onChange={e => setJsonInput(e.target.value)} 
                  rows={10} 
                  required 
                  placeholder='{"players": [{"number": 1, "position": "QB", "name": "John Doe", "phonetic_name": "JOHN DOE"}]}'
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    background: 'rgba(255,255,255,0.9)',
                    color: '#2c3e50'
                  }}
                />
              </div>
              <button 
                type="submit" 
                className="generate-board-button"
                disabled={!teamName}
                style={{
                  background: teamName ? 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' : 'rgba(127, 140, 141, 0.5)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: teamName ? 'pointer' : 'not-allowed',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s ease',
                  display: 'block',
                  margin: '0 auto'
                }}
                onMouseOver={(e) => teamName && (e.target.style.transform = 'translateY(-2px)')}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Generate Board
              </button>
            </form>
            {error && (
              <div className="error-message" style={{ 
                color: '#e74c3c', 
                marginTop: '16px', 
                padding: '12px',
                background: 'rgba(231, 76, 60, 0.2)',
                borderRadius: '6px',
                border: '1px solid rgba(231, 76, 60, 0.4)'
              }}>
                {error}
              </div>
            )}
            {players.length > 0 && (
              <div className="print-button-container" style={{ textAlign: 'center', marginTop: '16px' }}>
                <button 
                  className="print-pdf-button"
                  onClick={handlePrint} 
                  style={{
                    background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Print/Save as PDF
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Board (shown when printing) */}
        {players.length > 0 && (
          <section className="board-section">
            <div className="board-container" style={{
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(10px)'
            }}>
              <h2 className="board-title" style={{ 
                textAlign: 'center', 
                marginBottom: '20px',
                color: '#2c3e50',
                fontSize: '2rem',
                fontWeight: 'bold',
                borderBottom: `3px solid ${getTeamColor(teamName)}`,
                paddingBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px'
              }}>
                {/* Left side logos */}
                {getTeamLogo(teamName) && Array(4).fill(null).map((_, index) => (
                  <img 
                    key={`left-${index}`}
                    src={getTeamLogo(teamName)} 
                    alt={`${teamName} logo`}
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'contain'
                    }}
                  />
                ))}
                <span style={{ margin: '0 20px' }}>
                  {teamName}
                </span>
                {/* Right side logos */}
                {getTeamLogo(teamName) && Array(4).fill(null).map((_, index) => (
                  <img 
                    key={`right-${index}`}
                    src={getTeamLogo(teamName)} 
                    alt={`${teamName} logo`}
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'contain'
                    }}
                  />
                ))}
              </h2>
              <div className="board-grid-wrapper" style={{ overflowX: 'auto' }}>
                <div className="board-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(10, 1fr)',
                  gridTemplateRows: 'repeat(10, 1fr)',
                  width: '100%',
                  maxWidth: '800px',
                  height: 'min(800px, 90vh)',
                  margin: '0 auto',
                  gap: '0px',
                  border: '1px solid #333'
                }}>
                  {grid}
                </div>
              </div>
              
              {/* Bottom Title Bar */}
              <h2 className="board-title" style={{ 
                textAlign: 'center', 
                marginTop: '20px',
                color: '#2c3e50',
                fontSize: '2rem',
                fontWeight: 'bold',
                borderTop: `3px solid ${getTeamColor(teamName)}`,
                paddingTop: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px'
              }}>
                {/* Left side logos */}
                {getTeamLogo(teamName) && Array(6).fill(null).map((_, index) => (
                  <img 
                    key={`bottom-left-${index}`}
                    src={getTeamLogo(teamName)} 
                    alt={`${teamName} logo`}
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'contain'
                    }}
                  />
                ))}
                {/* Right side logos */}
                {getTeamLogo(teamName) && Array(6).fill(null).map((_, index) => (
                  <img 
                    key={`bottom-right-${index}`}
                    src={getTeamLogo(teamName)} 
                    alt={`${teamName} logo`}
                    style={{
                      width: '40px',
                      height: '40px',
                      objectFit: 'contain'
                    }}
                  />
                ))}
              </h2>
            </div>
          </section>
        )}

        {/* Footer with last updated and commit hash */}
        <footer className="app-footer no-print" style={{
          marginTop: '40px',
          padding: '20px',
          textAlign: 'center',
          color: '#ecf0f1',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <div>
              Last updated: {/* @ts-ignore */}
              {typeof __BUILD_TIME__ !== 'undefined' 
                ? new Date(__BUILD_TIME__).toLocaleString('en-US', { 
                    timeZone: 'America/New_York',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  }) + ' EST'
                : new Date().toLocaleString('en-US', { 
                    timeZone: 'America/New_York',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  }) + ' EST'}
            </div>
            <div style={{ 
              fontFamily: 'monospace',
              color: '#95a5a6',
              fontSize: '0.8rem'
            }}>
              Commit: {/* @ts-ignore */}
              {typeof __COMMIT_HASH__ !== 'undefined' ? __COMMIT_HASH__ : 'unknown'}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
