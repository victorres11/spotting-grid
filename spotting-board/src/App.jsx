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
    "Penn State Nittany Lions",
    "Purdue Boilermakers",
    "Rutgers Scarlet Knights",
    "USC Trojans",
    "Wisconsin Badgers"
  ];

  // Function to calculate dynamic font size based on content length
  const getDynamicFontSize = (text, maxHeight = 24, baseFontSize = 12) => {
    if (!text) return baseFontSize;
    
    const length = text.length;
    const words = text.split(' ').length;
    
    // More aggressive font sizing for better visibility
    if (length > 20 || words > 3) {
      return Math.max(8, baseFontSize - 4);
    } else if (length > 15 || words > 2) {
      return Math.max(9, baseFontSize - 3);
    } else if (length > 12 || words > 1) {
      return Math.max(10, baseFontSize - 2);
    } else if (length > 8) {
      return Math.max(11, baseFontSize - 1);
    }
    
    return baseFontSize;
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
      "Penn State Nittany Lions": "./logos/PennState.svg",
      "Purdue Boilermakers": "./logos/Purdue.svg",
      "Rutgers Scarlet Knights": "./logos/Rutgers.svg",
      "USC Trojans": "./logos/USC_Primary.svg",
      "Wisconsin Badgers": "./logos/Wisconsin.svg"
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
      "Penn State Nittany Lions": "#041E42", // Penn State Blue
      "Purdue Boilermakers": "#CEB888", // Purdue Gold
      "Rutgers Scarlet Knights": "#D21034", // Rutgers Scarlet
      "USC Trojans": "#FFC72C", // USC Gold
      "Wisconsin Badgers": "#C5050C" // Wisconsin Red
    };
    return colorMap[teamName] || "#e74c3c"; // Default to current red if team not found
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
  players.forEach((p) => {
    if (!boardMap[p.number]) boardMap[p.number] = { offense: [], defense: [] };
    
    // Check if player should be flipped to opposite side
    const shouldFlip = p.flip === "y" || p.flip === "Y" || p.flip === "true" || p.flip === "True" || p.flip === "TRUE";
    
    // Determine if player is naturally offensive or defensive
    const isNaturallyOffensive = ["QB","RB","WR","TE","OL","FB","OT","OG","C"].includes(p.position);
    
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

  // Sort defense arrays to put special teams positions (K, LS, P) at the bottom
  Object.values(boardMap).forEach(cell => {
    cell.defense.sort((a, b) => {
      const aIsSpecialTeams = ["K", "LS", "P"].includes(a.position);
      const bIsSpecialTeams = ["K", "LS", "P"].includes(b.position);
      
      if (aIsSpecialTeams && !bIsSpecialTeams) return 1; // a goes after b
      if (!aIsSpecialTeams && bIsSpecialTeams) return -1; // a goes before b
      return 0; // keep original order for same type
    });
  });

  // Render a 10x10 grid
  const grid = [];
  console.log('Rendering grid, teamName:', teamName);
  for (let row = 0; row < 10; row++) {
    const cells = [];
    for (let col = 0; col < 10; col++) {
      const num = row * 10 + col;
      const cell = boardMap[num] || { offense: [], defense: [] };
      const hasPlayers = cell.offense.length > 0 || cell.defense.length > 0;
      if (!hasPlayers) {
        // Light grey cell for numbers with no players
        cells.push(
          <td key={num} style={{ 
            background: '#f0f0f0', 
            width: 100, 
            height: 100, 
            border: '1px solid #333',
            position: 'relative'
          }}>
            {getTeamLogo(teamName) && (
              <img 
                src={getTeamLogo(teamName)} 
                alt={`${teamName} logo`}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '40px',
                  height: '40px',
                  objectFit: 'contain',
                  opacity: 0.43,
                  filter: 'grayscale(100%)',
                  border: 'none',
                  outline: 'none'
                }}
              />
            )}
          </td>
        );
      } else {
        cells.push(
          <td key={num} style={{ background: 'white', width: 120, height: 140, border: '1px solid #333', verticalAlign: 'top', padding: 0, position: 'relative' }}>
            <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16, marginTop: 2, height: 20, position: 'relative', zIndex: 1 }}>{num}</div>
            <div style={{ display: 'flex', flexDirection: 'column', height: 115, position: 'relative' }}>
              {/* Offense (green, top half only) */}
              <div style={{ height: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1px 0' }}>
                {cell.offense.length > 0 && (
                  <div style={{ 
                    background: (() => {
                      // Check if the offense array contains only special teams players
                      const allOffenseSpecialTeams = cell.offense.every(p => ["K", "LS", "P"].includes(p.position));
                      const onlyOffenseSpecialTeams = allOffenseSpecialTeams && cell.offense.length > 0;
                      
                      if (onlyOffenseSpecialTeams) {
                        return 'rgba(255, 255, 200, 0.95)'; // Dull yellow for special teams only
                      } else {
                        return 'rgba(200, 247, 197, 0.95)'; // Green for regular offense
                      }
                    })(),
                    color: '#222', 
                    borderRadius: 2, 
                    margin: '1px 2px', 
                    padding: '2px 0 1px 0', 
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
                        <div style={{ fontSize: cell.offense.length > 1 ? 9 : 10, fontWeight: 'bold', marginBottom: cell.offense.length > 1 ? 0 : 1, color: '#000' }}>{p.position}</div>
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
              {/* Defense (red, bottom half only) */}
              <div style={{ height: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1px 0' }}>
                {cell.defense.length > 0 && (
                  <div style={{ 
                    background: (() => {
                      // Check if the defense array contains only special teams players
                      const allDefenseSpecialTeams = cell.defense.every(p => ["K", "LS", "P"].includes(p.position));
                      const onlyDefenseSpecialTeams = allDefenseSpecialTeams && cell.defense.length > 0;
                      
                      if (onlyDefenseSpecialTeams) {
                        return 'rgba(255, 255, 200, 0.95)'; // Dull yellow for special teams only
                      } else {
                        return 'rgba(247, 197, 197, 0.95)'; // Red for regular defense
                      }
                    })(),
                    color: '#222', 
                    borderRadius: 2, 
                    margin: '1px 2px', 
                    padding: '2px 0 1px 0', 
                    textAlign: 'center', 
                    fontSize: 8, 
                    fontWeight: '500', 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    wordWrap: 'break-word', 
                    overflow: 'visible', 
                    position: 'relative', 
                    zIndex: 1 
                  }}>
                    {cell.defense.map((p, i) => (
                      <div key={i} style={{ lineHeight: '1.0', padding: cell.defense.length > 1 ? '0px 1px' : '1px 1px' }}>
                        <div style={{ fontSize: cell.defense.length > 1 ? 9 : 10, fontWeight: 'bold', marginBottom: cell.defense.length > 1 ? 0 : 1, color: '#000' }}>{p.position}</div>
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
          </td>
        );
      }
    }
    grid.push(<tr key={row}>{cells}</tr>);
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      padding: 0,
      margin: 0
    }}>
      {/* Print-only styles */}
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            body { 
              margin: 0 !important; 
              padding: 0 !important; 
              background: white !important;
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
              margin: 10px 0 !important;
              padding: 10px 0 !important;
              font-size: 1.5rem !important;
            }
            .board-table-wrapper {
              overflow: visible !important;
            }
            .board-table {
              border-collapse: separate !important;
              border-spacing: 0px !important;
              width: 100% !important;
              max-width: none !important;
              margin: 0 !important;
              table-layout: fixed;
            }
            .board-table td {
              page-break-inside: avoid;
              width: 10% !important;
              height: 100px !important;
            }
            .board-table td[style*="background: #f0f0f0"] {
              background: #f0f0f0 !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .board-table td[style*="background: white"] {
              background: white !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .board-table div[style*="background: #c8f7c5"] {
              background: #c8f7c5 !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .board-table div[style*="background: #f7c5c5"] {
              background: #f7c5c5 !important;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .board-table div[style*="background: rgba(255, 255, 200"] {
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
                src="/big10spottergridlogo.png" 
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
                  color: '#ecf0f1',
                  fontSize: '1.1rem'
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
                    color: '#ecf0f1',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
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
                  color: '#ecf0f1',
                  fontSize: '1.1rem'
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
              <div className="board-table-wrapper" style={{ overflowX: 'auto' }}>
                <table className="board-table" style={{ 
                  borderCollapse: 'separate', 
                  borderSpacing: '0px',
                  margin: '0 auto'
                }}>
                  <tbody className="board-grid">{grid}</tbody>
                </table>
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
      </main>
    </div>
  );
}

export default App;
