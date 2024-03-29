const abbreviationsObject = {

  'Arizona Cardinals': 'ARI',
  'Atlanta Falcons': 'ATL',
  'Baltimore Ravens': 'BAL',
  'Buffalo Bills': 'BUF',
  'Carolina Panthers': 'CAR',
  'Chicago Bears': 'CHI',
  'Cincinnati Bengals': 'CIN',
  'Cleveland Browns': 'CLE',
  'Dallas Cowboys': 'DAL',
  'Denver Broncos': 'DEN',
  'Detroit Lions': 'DET',
  'Green Bay Packers': 'GB',
  'Houston Texans': 'HOU',
  'Indianapolis Colts': 'IND',
  'Jacksonville Jaguars': 'JAX',
  'Kansas City Chiefs': 'KC',
  'Miami Dolphins': 'MIA',
  'Minnesota Vikings': 'MIN',
  'New England Patriots': 'NE',
  'New Orleans Saints': 'NO',
  'New York Giants': 'NYG',
  'New York Jets': 'NYJ',
  'Las Vegas Raiders': 'LV',
  'Philadelphia Eagles': 'PHI',
  'Pittsburgh Steelers': 'PIT',
  'Los Angeles Chargers': 'LAC',
  'San Francisco 49ers': 'SF',
  'Seattle Seahawks': 'SEA',
  'Los Angeles Rams': 'LAR',
  'Tampa Bay Buccaneers': 'TB',
  'Tennessee Titans': 'TEN',
  'Washington Commanders': 'WAS',
  'Atlanta Hawks': 'ATL',
  'Boston Celtics': 'BOS',
  'Charlotte Hornets': 'CHA',
  'Chicago Bulls': 'CHI',
  'Cleveland Cavaliers': 'CLE',
  'Dallas Mavericks': 'DAL',
  'Denver Nuggets': 'DEN',
  'Detroit Pistons': 'DET',
  'Golden State Warriors': 'GSW',
  'Houston Rockets': 'HOU',
  'Indiana Pacers': 'IND',
  'Los Angeles Clippers': 'LAC',
  'Los Angeles Lakers': 'LAL',
  'Memphis Grizzlies': 'MEM',
  'Miami Heat': 'MIA',
  'Milwaukee Bucks': 'MIL',
  'Minnesota Timberwolves': 'MIN',
  'New Orleans Pelicans': 'NOH',
  'New York Knicks': 'NYK',
  'Brooklyn Nets': 'BKN',
  'Oklahoma City Thunder': 'OKC',
  'Orlando Magic': 'ORL',
  'Philadelphia 76ers': 'PHI',
  'Phoenix Suns': 'PHO',
  'Portland Trail Blazers': 'POR',
  'Sacramento Kings': 'SAC',
  'San Antonio Spurs': 'SAS',
  'Toronto Raptors': 'TOR',
  'Utah Jazz': 'UTH',
  'Washington Wizards': 'WAS',
  'Arizona Diamondbacks': 'ARI',
  'Atlanta Braves': 'ATL',
  'Baltimore Orioles': 'BAL',
  'Boston Red Sox': 'BOS',
  'Chicago Cubs': 'CHC',
  'Chicago White Sox': 'CHW',
  'Cincinnati Reds': 'CIN',
  'Cleveland Guardians': 'CLE',
  'Colorado Rockies': 'COL',
  'Detroit Tigers': 'DET',
  'Florida Marlins': 'FLA',
  'Houston Astros': 'HOU',
  'Kansas City Royals': 'KAN',
  'Los Angeles Angels': 'LAA',
  'Los Angeles Dodgers': 'LAD',
  'Miami Marlins': 'MIA',
  'Milwaukee Brewers': 'MIL',
  'Minnesota Twins': 'MIN',
  'New York Mets': 'NYM',
  'New York Yankees': 'NYY',
  'Oakland Athletics': 'OAK',
  'Philadelphia Phillies': 'PHI',
  'Pittsburgh Pirates': 'PIT',
  'San Diego Padres': 'SD',
  'San Francisco Giants': 'SF',
  'Seattle Mariners': 'SEA',
  'St. Louis Cardinals': 'STL',
  'Tampa Bay Rays': 'TB',
  'Texas Rangers': 'TEX',
  'Toronto Blue Jays': 'TOR',
  'Washington Nationals': 'WAS',
  'Abilene Christian Wildcats': 'ACU',
  'Air Force Falcons': 'AF',
  'Akron Zips': 'AKR',
  'Alabama Crimson Tide': 'UA',
  'Alabama A&M Bulldogs': 'AAMU',
  'Alabama St Hornets': 'ASU',
  'Albany Great Danes': 'ALB',
  'Alcorn St Braves': 'ASU',
  'American Eagles': 'AU',
  'Appalachian St Mountaineers': 'ASU',
  'Arizona Wildcats': 'U of A',
  'Arizona St Sun Devils': 'ASU',
  'Arkansas Razorbacks': 'U of A',
  'Arkansas St Red Wolves': 'ASU',
  'Arkansas-Pine Bluff Golden Lions': 'UAPB',
  'Army Knights': 'USMA',
  'Auburn Tigers': 'AU',
  'Austin Peay Governors': 'APSU',
  'Ball State Cardinals': 'BSU',
  'Baylor Bears': 'BU',
  'Bellarmine Knights': 'BU',
  'Belmont Bruins': 'BEL',
  'Bethune-Cookman Wildcats': 'BCU',
  'Binghamton Bearcats': 'BU',
  'Boise St Broncos': 'BSU',
  'Boston College Eagles': 'BC',
  'Boston Univ. Terriers': 'BU',
  'Bowling Green Falcons': 'BGSU',
  'Bradley Braves': 'BU',
  'BYU Cougars': 'BYU',
  'Brown Bears': 'BU',
  'Bryant Bulldogs': 'BU',
  'Bucknell Bison': 'BU',
  'Buffalo Bulls': 'UB',
  'Butler Bulldogs': 'BU',
  'Cal Poly Mustangs': 'POLY',
  'CSU Bakersfield Roadrunners': 'CSUB',
  'Cal St Fullerton Titans': 'CSUF',
  'CSU Northridge Matadors': 'CSUN',
  'California Golden Bears': 'Cal',
  'Cal Baptist Lancers': 'CBU',
  'Campbell Fighting Camels': 'CAM',
  'Canisius Golden Griffins': 'CAN',
  'Central Arkansas Bears': 'UCA',
  'Central Connecticut St Blue Devils': 'CCSU',
  'Central Michigan Chippewas': 'CMU',
  'Charleston Cougars': 'C of C',
  'Charleston Southern Buccaneers': 'CSU',
  'Charlotte 49ers': 'CHAR',
  'Chattanooga Mocs': 'UTC',
  'Chicago St Cougars': 'CSU',
  'Cincinnati Bearcats': 'UC',
  'The Citadel Bulldogs': 'CIT',
  'Clemson Tigers': 'CLEM',
  'Cleveland St Vikings': 'CSU',
  'Coastal Carolina Chanticleers': 'CCU',
  'Colgate Raiders': 'CU',
  'Colorado Buffaloes': 'CU',
  'Colorado St Rams': 'CSU',
  'Columbia Lions': 'COM',
  'UConn Huskies': 'UConn',
  'Coppin St Eagles': 'CSU',
  'Cornell Big Red': 'COR',
  'Creighton Bluejays': 'CU',
  'Dartmouth Big Green': 'DART',
  'Davidson Wildcats': 'DAV',
  'Dayton Flyers': 'DAY',
  'Delaware Fightin Blue Hens': 'UD',
  'Delaware St Hornets': 'DESU',
  'Denver Pioneers': 'UD',
  'DePaul Blue Demons': 'DEP',
  'Detroit Mercy Titans': 'UDM',
  'Drake Bulldogs': 'DU',
  'Drexel Dragons': 'DREX',
  'Duke Blue Devils': 'DUKE',
  'Duquesne Dukes': 'DUQ',
  'East Carolina Pirates': 'ECU',
  'East Tennessee St Buccaneers': 'ETSU',
  'Eastern Illinois Panthers': 'EIU',
  'Eastern Kentucky Colonels': 'EKU',
  'Eastern Michigan Eagles': 'EMU',
  'Eastern Washington Eagles': 'EWU',
  'Elon Phoenix': 'ELON',
  'Evansville Purple Aces': 'UE',
  'Fairfield Stags': 'FU',
  'Fairleigh Dickinson Knights': 'FDU',
  'Florida Gators': 'UF',
  'Florida A&M Rattlers': 'FAMU',
  'Florida Atlantic Owls': 'FAU',
  'Florida Gulf Coast Eagles': 'FGC',
  'Florida Int\'l Golden Panthers': 'FIU',
  'Florida St Seminoles': 'FSU',
  'Fordham Rams': 'FORD',
  'Fort Wayne Mastodons': 'IPFW',
  'Fresno St Bulldogs': 'CSUF',
  'Furman Paladins': 'FU',
  'Gardner-Webb Bulldogs': 'GWU',
  'George Mason Patriots': 'GMU',
  'George Washington Colonials': 'GW',
  'Georgetown Hoyas': 'GU',
  'Georgia Bulldogs': 'UGA',
  'Georgia Southern Eagles': 'GSU',
  'Georgia St Panthers': 'GSU',
  'Georgia Tech Yellow Jackets': 'GT',
  'Gonzaga Bulldogs': 'GU',
  'Grambling St Tigers': 'GSU',
  'Grand Canyon Antelopes': 'GCU',
  'Green Bay Phoenix': 'UWGB',
  'Hampton Pirates': 'HU',
  'Hartford Hawks': 'UHA',
  'Harvard Crimson': 'HAR',
  'Hawai\'i Rainbow Warriors': 'UH',
  'High Point Panthers': 'HP',
  'Hofstra Pride': 'HOF',
  'Holy Cross Crusaders': 'HC',
  'Houston Cougars': 'U of H',
  'Houston Baptist Huskies': 'HCU',
  'Howard Bison': 'HU',
  'Idaho Vandals': 'U of I',
  'Idaho St Bengals': 'ISU',
  'Illinois Fighting Illini': 'U of I',
  'Illinois St Redbirds': 'ISU',
  'UIC Flames': 'UIC',
  'Incarnate Word Cardinals': 'UIW',
  'Indiana Hoosiers': 'IU',
  'Indiana St Sycamores': 'ISU',
  'Iona Gaels': 'IC',
  'Iowa Hawkeyes': 'UI',
  'Iowa St Cyclones': 'ISU',
  'IUPUI Jaguars': 'IUPUI',
  'Jackson St Tigers': 'JSU',
  'Jacksonville Dolphins': 'JAC',
  'Jacksonville St Gamecocks': 'JSU',
  'James Madison Dukes': 'JMU',
  'Kansas Jayhawks': 'KU',
  'Kansas St Wildcats': 'KSU',
  'Kennesaw St Owls': 'KENN',
  'Kent State Golden Flashes': 'KSU',
  'Kentucky Wildcats': 'UK',
  'La Salle Explorers': 'LU',
  'Lafayette Leopards': 'LC',
  'Lamar Cardinals': 'LU',
  'Lehigh Mountain Hawks': 'LU',
  'Liberty Flames': 'LIB',
  'Lindenwood Lions': 'LU',
  'Lipscomb Bisons': 'LIP',
  'Little Rock Trojans': 'UALR',
  'Long Beach St 49ers': 'LBSU',
  'LIU Sharks': 'LIU',
  'Longwood Lancers': 'LONG',
  'Louisiana Ragin\' Cajuns': 'LA',
  'Louisiana Tech Bulldogs': 'LTU',
  'UL Monroe Warhawks': 'ULM',
  'Louisville Cardinals': 'U of L',
  'Loyola (Chi) Ramblers': 'L-IL',
  'Loyola (MD) Greyhounds': 'L-MD',
  'Loyola Marymount Lions': 'LMU',
  'LSU Tigers': 'LSU',
  'Maine Black Bears': 'UM',
  'Manhattan Jaspers': 'MAN',
  'Marist Red Foxes': 'MAR',
  'Marquette Golden Eagles': 'MU',
  'Marshall Thundering Herd': 'MU',
  'Maryland Terrapins': 'UMD',
  'Maryland-Eastern Shore Hawks': 'UMES',
  'Massachusetts Minutemen': 'UMass',
  'McNeese Cowboys': 'MSU',
  'Memphis Tigers': 'UM',
  'Mercer Bears': 'MER',
  'Merrimack Warriors': 'MC',
  'Miami Hurricanes': 'UM',
  'Miami (OH) RedHawks': 'MU',
  'Michigan Wolverines': 'UM',
  'Michigan St Spartans': 'MSU',
  'Middle Tennessee Blue Raiders': 'MTSU',
  'Milwaukee Panthers': 'UWM',
  'Minnesota Golden Gophers': 'U of M',
  'Mississippi St Bulldogs': 'MSU',
  'Miss Valley St Delta Devils': 'MVSU',
  'Missouri Tigers': 'MU',
  'Missouri St Bears': 'MSU',
  'Monmouth Hawks': 'MU',
  'Montana Grizzlies': 'UM',
  'Montana St Fighting Bobcats': 'MSU',
  'Morehead St Eagles': 'MSU',
  'Morgan St Bears': 'MSU',
  'Mount St. Mary\'s Mountaineers': 'MSMU',
  'Murray St Racers': 'MSU',
  'N.J.I.T. Highlanders': 'NJIT',
  'Navy Midshipmen': 'USNA',
  'NC St Wolfpack': 'NCST',
  'Nebraska Cornhuskers': 'UNL',
  'Nevada Wolf Pack': 'UNR',
  'New Hampshire Wildcats': 'UNH',
  'New Mexico Lobos': 'UNM',
  'New Mexico St Aggies': 'NMSU',
  'New Orleans Privateers': 'UNO',
  'Niagara Purple Eagles': 'NU',
  'Nicholls St Colonels': 'NSU',
  'Norfolk St Spartans': 'NSU',
  'North Alabama Lions': 'UNA',
  'North Carolina Tar Heels': 'UNC',
  'North Carolina A&T Aggies': 'NC A&T',
  'North Carolina Central Eagles': 'NCCU',
  'North Dakota Fighting Hawks': 'UND',
  'North Dakota St Bison': 'NDSU',
  'North Florida Ospreys': 'UNF',
  'North Texas Mean Green': 'UNT',
  'Northeastern Huskies': 'NU',
  'Northern Arizona Lumberjacks': 'NAU',
  'Northern Colorado Bears': 'UNC',
  'Northern Illinois Huskies': 'NIU',
  'Northern Iowa Panthers': 'UNI',
  'Northern Kentucky Norse': 'NKU',
  'Northwestern Wildcats': 'NU',
  'Northwestern St Demons': 'NSU',
  'Notre Dame Fighting Irish': 'ND',
  'Oakland Golden Grizzlies': 'OU',
  'Ohio Bobcats': 'OU',
  'Ohio State Buckeyes': 'OSU',
  'Oklahoma Sooners': 'OU',
  'Oklahoma St Cowboys': 'OSU',
  'Old Dominion Monarchs': 'ODU',
  'Ole Miss Rebels': 'UM',
  'Omaha Mavericks': 'UNO',
  'Oral Roberts Golden Eagles': 'ORU',
  'Oregon Ducks': 'UO',
  'Oregon St Beavers': 'OSU',
  'Pacific Tigers': 'PAC',
  'Penn State Nittany Lions': 'PSU',
  'Pennsylvania Quakers': 'PENN',
  'Pepperdine Waves': 'PU',
  'Pittsburgh Panthers': 'PITT',
  'Portland Pilots': 'UP',
  'Portland St Vikings': 'PSU',
  'Prairie View A&M Panthers': 'PVAMU',
  'Presbyterian Blue Hose': 'PC',
  'Princeton Tigers': 'PRIN',
  'Providence Friars': 'PROV',
  'Purdue Boilermakers': 'PU',
  'Queens University Royals': 'QUC',
  'Quinnipiac Bobcats': 'QU',
  'Radford Highlanders': 'RU',
  'Rhode Island Rams': 'URI',
  'Rice Owls': 'RU',
  'Richmond Spiders': 'RICH',
  'Rider Broncs': 'RU',
  'Robert Morris Colonials': 'RMU',
  'Rutgers Scarlet Knights': 'RU',
  'Sacramento St Hornets': 'CSUS',
  'Sacred Heart Pioneers': 'SHU',
  'Saint Joseph\'s Hawks': 'SJU',
  'Saint Louis Billikens': 'SLU',
  'Saint Mary\'s Gaels': 'SMC',
  'Saint Peter\'s Peacocks': 'SPC',
  'Sam Houston St Bearkats': 'SHSU',
  'Samford Bulldogs': 'SU',
  'San Diego Toreros': 'USD',
  'San Diego St Aztecs': 'SDSU',
  'San Francisco Dons': 'USF',
  'San José St Spartans': 'SJSU',
  'Santa Clara Broncos': 'SCU',
  'Seattle Redhawks': 'SEA',
  'Seton Hall Pirates': 'SHU',
  'Siena Saints': 'SC',
  'SIU-Edwardsville Cougars': 'SIUE',
  'South Alabama Jaguars': 'USA',
  'South Carolina Gamecocks': 'USC',
  'South Carolina St Bulldogs': 'SCSU',
  'South Carolina Upstate Spartans': 'USCUS',
  'South Dakota Coyotes': 'USD',
  'South Dakota St Jackrabbits': 'SDSU',
  'South Florida Bulls': 'USF',
  'SE Missouri St Redhawks': 'SEMO',
  'SE Louisiana Lions': 'SELU',
  'Southern Jaguars': 'SUBR',
  'Southern Illinois Salukis': 'SIU',
  'Southern Indiana Screaming Eagles': 'USI',
  'SMU Mustangs': 'SMU',
  'Southern Mississippi Golden Eagles': 'USM',
  'Southern Utah Thunderbirds': 'SUU',
  'St. Bonaventure Bonnies': 'STBN',
  'St. Francis BKN Terriers': 'SFC',
  'St. Francis (PA) Red Flash': 'SFU',
  'St. John\'s Red Storm': 'STJ',
  'St. Thomas (MN) Tommies': 'UST',
  'Stanford Cardinal': 'SU',
  'Stephen F. Austin Lumberjacks': 'SFA',
  'Stetson Hatters': 'STET',
  'Stonehill Skyhawks': 'SC',
  'Stony Brook Seawolves': 'SB',
  'Syracuse Orange': 'SU',
  'Tarleton St Texans': 'TSU',
  'Temple Owls': 'TEM',
  'Tennessee Volunteers': 'UT',
  'Tennessee St Tigers': 'TSU',
  'Tennessee Tech Golden Eagles': 'TTU',
  'Tennessee-Martin Skyhawks': 'UTM',
  'Texas Longhorns': 'UT',
  'Texas A&M Aggies': 'TAMU',
  'Texas A&M-Commerce Lions': 'TAMUC',
  'Texas A&M-CC Islanders': 'TAMU-CC',
  'TCU Horned Frogs': 'TCU',
  'Texas Southern Tigers': 'TSU',
  'Texas State Bobcats': 'TSU',
  'Texas Tech Red Raiders': 'TTU',
  'UT-Arlington Mavericks': 'UTA',
  'UT Rio Grande Valley Vaqueros': 'UTRGV',
  'UTSA Roadrunners': 'UTSA',
  'Toledo Rockets': 'U of T',
  'Towson Tigers': 'TU',
  'Troy Trojans': 'TU',
  'Tulane Green Wave': 'TU',
  'Tulsa Golden Hurricane': 'TU',
  'UAB Blazers': 'UAB',
  'UC Davis Aggies': 'UCD',
  'UC Irvine Anteaters': 'UCI',
  'UC Riverside Highlanders': 'UCR',
  'UC San Diego Tritons': 'UCSD',
  'UC Santa Barbara Gauchos': 'UCSB',
  'UCF Knights': 'UCF',
  'UCLA Bruins': 'UCLA',
  'UMass Lowell River Hawks': 'UML',
  'UMBC Retrievers': 'UMBC',
  'UMKC Kangaroos': 'UMKC',
  'UNC Asheville Bulldogs': 'UNCA',
  'UNC Greensboro Spartans': 'UNCG',
  'UNC Wilmington Seahawks': 'UNCW',
  'UNLV Rebels': 'UNLV',
  'USC Trojans': 'USC',
  'USC Upstate Spartans': 'USCU',
  'Utah Utes': 'U of U',
  'Utah State Aggies': 'USU',
  'Utah Tech Trailblazers': 'UT',
  'Utah Valley Wolverines': 'UVU',
  'UTEP Miners': 'UTEP',
  'Valparaiso Beacons': 'VAL',
  'Vanderbilt Commodores': 'VU',
  'VCU Rams': 'VCU',
  'Vermont Catamounts': 'UVM',
  'Villanova Wildcats': 'VILL',
  'Virginia Cavaliers': 'UVA',
  'VMI Keydets': 'VMI',
  'Virginia Tech Hokies': 'VT',
  'Wagner Seahawks': 'WC',
  'Wake Forest Demon Deacons': 'WF',
  'Washington Huskies': 'UW',
  'Washington St Cougars': 'WSU',
  'Weber St Wildcats': 'WSU',
  'West Virginia Mountaineers': 'WVU',
  'Western Carolina Catamounts': 'WCU',
  'Western Illinois Leathernecks': 'WIU',
  'Western Kentucky Hilltoppers': 'WKU',
  'Western Michigan Broncos': 'WMY',
  'Wichita St Shockers': 'WSU',
  'William & Mary Tribe': 'W&M',
  'Winthrop Eagles': 'WIN',
  'Wisconsin Badgers': 'UW',
  'Wofford Terriers': 'WC',
  'Wright St Raiders': 'WRST',
  'Wyoming Cowboys': 'UW',
  'Xavier Musketeers': 'XAV',
  'Yale Bulldogs': 'YALE',
  'Youngstown St Penguins': 'YSU',
  Over: 'O',
  Under: 'U'
};

export { abbreviationsObject };
