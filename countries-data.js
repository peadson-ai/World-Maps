// Complete World Dataset: All 197 Countries (193 UN Members + Vatican City, Palestine, Taiwan, Kosovo)
// Includes accurate land/total area (km²), capital, continent, flag layout, colors, emblems, and fun facts.

(function () {
  // Compact tuple format for all 197 countries:
  // [id, name, continent, capital, areaKm2, population, layout, colors, emblemSpec, shapeType, funFact]
  //
  // Layouts supported by our Vector Flag Compiler:
  // - "h2": 2 equal horizontal stripes [top, bottom]
  // - "h3": 3 equal horizontal stripes [top, mid, bottom]
  // - "h3-wide": 3 horizontal stripes, middle is 2x height (Spain, Laos, Cambodia, Lebanon, Latvia)
  // - "h3-top": 3 horizontal stripes, top is 2x height (Colombia, Ecuador, Rwanda)
  // - "h3-fim": 3 horizontal stripes with thin white fimbriation around middle (Kenya, Botswana, Gambia, Uzbekistan, Eswatini, Suriname, North Korea)
  // - "h4": 4 horizontal stripes (Mauritius, Comoros, Central African Republic)
  // - "h5": 5 horizontal stripes (Thailand, Costa Rica, Cabo Verde, Uganda)
  // - "v2": 2 vertical stripes [left, right] (Algeria, Malta, Vatican City, Pakistan-style)
  // - "v2-benin": Left vertical band + 2 horizontal bands on right (Benin, Madagascar, Guinea-Bissau)
  // - "v3": 3 equal vertical stripes [left, mid, right] (France, Italy, Mexico, Nigeria, Peru, Belgium, etc.)
  // - "v3-wide": Canadian pale [left, wide-mid, right] (Canada, Saint Vincent, Barbados)
  // - "stripes-canton": Horizontal alternating stripes + top-left canton (USA, Greece, Malaysia, Liberia, Uruguay, Togo)
  // - "canton": Solid or two-tone field + top-left canton (Chile, Taiwan, Samoa, Tonga, Myanmar-old)
  // - "nordic": Nordic cross off-center (Sweden, Denmark, Norway, Finland, Iceland)
  // - "cross": Centered cross (Switzerland, Georgia, Dominican Republic, Jamaica-style)
  // - "uk": Union Jack (United Kingdom)
  // - "uk-ensign": Blue/Red ensign with Union Jack canton (Australia, New Zealand, Fiji, Tuvalu)
  // - "triangle": Horizontal stripes with hoist triangle (Czechia, Philippines, Cuba, Bahamas, Jordan, Palestine, Sudan, South Sudan, Djibouti, Mozambique, Zimbabwe, Timor-Leste, Guyana, Sao Tome, Eritrea)
  // - "diagonal": Diagonal band from bottom-left to top-right (Tanzania, DR Congo, Rep. Congo, Namibia, Trinidad & Tobago, Brunei, Solomon Islands, Saint Kitts, Marshall Islands)
  // - "split-diag": Diagonally split two-color field (Bhutan, Papua New Guinea)
  // - "saltire": Diagonal X cross (Jamaica, Burundi, Grenada, Scotland)
  // - "seychelles": Radiating diagonal bands from bottom-left corner (Seychelles)
  // - "y-pall": Y-shaped pall (South Africa, Vanuatu)
  // - "diamond": Solid field with central diamond (Brazil, Saint Vincent)
  // - "qatar": Serrated vertical hoist band (Qatar, Bahrain)
  // - "nepal": Double crimson pennant with white sun and moon (Nepal)
  // - "solid": Solid field with central or offset emblem (Japan, China, Turkey, Vietnam, Bangladesh, Palau, Morocco, Somalia, Albania, Kazakhstan, Kyrgyzstan, Saudi Arabia, Brazil, etc.)

  const RAW_COUNTRIES = [
    // ================= NORTH AMERICA & CARIBBEAN (23) =================
    ["us", "United States", "North America", "Washington, D.C.", 9833520, "335M", "stripes-canton", ["#B22234", "#FFFFFF", "#3C3B6E"], ["stars-grid", 21, 27, 16, "#FFFFFF", 13], "usa", "Has 50 stars for the 50 states and 13 stripes for the original 13 colonies!"],
    ["ca", "Canada", "North America", "Ottawa", 9984670, "40M", "v3-wide", ["#FF0000", "#FFFFFF", "#FF0000"], ["maple", 50, 50, 22, "#FF0000"], "canada", "Second largest country on Earth, famous for its 11-pointed red maple leaf flag!"],
    ["mx", "Mexico", "North America", "Mexico City", 1964375, "129M", "v3", ["#006847", "#FFFFFF", "#CE1126"], ["circle-crest", 50, 50, 12, "#6B4423"], "mexico", "Features a golden eagle perched on a prickly pear cactus in the center!"],
    ["gt", "Guatemala", "North America", "Guatemala City", 108889, "18M", "v3", ["#4997D0", "#FFFFFF", "#4997D0"], ["circle-crest", 50, 50, 12, "#4A7729"], "compact", "Its sky-blue stripes represent the Pacific and Atlantic oceans on either side!"],
    ["bz", "Belize", "North America", "Belmopan", 22966, "410K", "h3-wide", ["#CE1126", "#003F87", "#CE1126"], ["circle-crest", 50, 50, 20, "#FFFFFF"], "elongated-ns", "Home to the second-largest coral barrier reef in the world!"],
    ["hn", "Honduras", "North America", "Tegucigalpa", 112492, "10.6M", "h3", ["#00BCE4", "#FFFFFF", "#00BCE4"], ["stars-grid", 50, 50, 11, "#00BCE4"], "compact", "Five turquoise stars in the middle represent the five Central American nations!"],
    ["sv", "El Salvador", "North America", "San Salvador", 21041, "6.3M", "h3", ["#0F47AF", "#FFFFFF", "#0F47AF"], ["circle-crest", 50, 50, 11, "#F6B40E"], "compact", "Known as the 'Land of Volcanoes' and the smallest country in Central America!"],
    ["ni", "Nicaragua", "North America", "Managua", 130373, "7M", "h3", ["#0067C6", "#FFFFFF", "#0067C6"], ["triangle-emblem", 50, 50, 12, "#F6B40E"], "compact", "Features a rainbow and five volcanoes inside a golden triangle at the center!"],
    ["cr", "Costa Rica", "North America", "San José", 51100, "5.2M", "h5", ["#002B7F", "#FFFFFF", "#CE1126", "#FFFFFF", "#002B7F"], ["circle-crest", 32, 50, 10, "#F6B40E"], "coastal", "Over a quarter of Costa Rica's land is protected rainforest and national parks!"],
    ["pa", "Panama", "North America", "Panama City", 75417, "4.4M", "cross", ["#FFFFFF", "#DA121A", "#072357"], ["star", 25, 25, 9, "#072357"], "elongated-ew", "Home to the famous Panama Canal that connects the Atlantic and Pacific Oceans!"],
    ["cu", "Cuba", "North America", "Havana", 109884, "11.1M", "triangle", ["#002A8F", "#FFFFFF", "#002A8F", "#CF142B"], ["star", 16, 50, 10, "#FFFFFF", 5], "elongated-ew", "Called the 'Lone Star' flag with three blue stripes, two white stripes, and a red triangle!"],
    ["jm", "Jamaica", "North America", "Kingston", 10991, "2.8M", "jamaica", ["#009B3A", "#000000", "#FED100"], null, "elongated-ew", "The only national flag in the world that has no red, white, or blue in it!"],
    ["ht", "Haiti", "North America", "Port-au-Prince", 27750, "11.7M", "h2", ["#00209F", "#D21034"], ["circle-crest", 50, 50, 14, "#FFFFFF"], "compact", "Shares the Caribbean island of Hispaniola with the Dominican Republic!"],
    ["do", "Dominican Republic", "North America", "Santo Domingo", 48671, "11.3M", "cross", ["#002D62", "#CE1126", "#FFFFFF"], ["circle-crest", 50, 50, 10, "#006847"], "compact", "Features a bold white cross dividing alternating blue and red rectangles!"],
    ["bs", "Bahamas", "North America", "Nassau", 13943, "412K", "triangle", ["#00778B", "#FFC72C", "#00778B", "#000000"], null, "archipelago", "Aquamarine stripes represent the Caribbean sea and golden yellow stands for sandy beaches!"],
    ["bb", "Barbados", "North America", "Bridgetown", 430, "282K", "v3", ["#00267F", "#FFC726", "#00267F"], ["trident", 50, 50, 18, "#000000"], "island", "Features Poseidon's broken black trident head in the center golden stripe!"],
    ["tt", "Trinidad and Tobago", "North America", "Port of Spain", 5130, "1.5M", "diagonal", ["#CE1126", "#000000", "#FFFFFF"], null, "island", "A bold black diagonal band bordered in white crosses a fiery red field!"],
    ["ag", "Antigua and Barbuda", "North America", "Saint John's", 442, "94K", "triangle", ["#0072C6", "#FFFFFF", "#000000", "#CE1126"], ["sun", 50, 32, 14, "#FCD116"], "island", "A rising golden sun shines inside a V-shaped frame of black, blue, and white!"],
    ["dm", "Dominica", "North America", "Roseau", 751, "73K", "cross", ["#006B3F", "#FCD116", "#000000"], ["circle", 50, 50, 16, "#D41C30"], "island", "Features the rare purple Sisserou parrot inside a circle of ten green stars!"],
    ["gd", "Grenada", "North America", "Saint George's", 344, "126K", "saltire", ["#007A5E", "#FCD116", "#CE1126"], ["star", 50, 50, 11, "#FCD116"], "island", "Known as the 'Island of Spice', its flag even includes a tiny nutmeg symbol!"],
    ["kn", "Saint Kitts and Nevis", "North America", "Basseterre", 261, "48K", "diagonal", ["#009E49", "#CE1126", "#000000", "#FCD116"], ["star", 50, 50, 9, "#FFFFFF"], "island", "Smallest sovereign country in the Americas, with two white stars for hope and liberty!"],
    ["lc", "Saint Lucia", "North America", "Castries", 616, "180K", "solid", ["#66CCFF"], ["triangle-emblem", 50, 54, 24, "#FCD116"], "island", "The twin triangles in the center represent the island's famous volcanic Piton peaks!"],
    ["vc", "Saint Vincent and the Grenadines", "North America", "Kingstown", 389, "104K", "v3-wide", ["#00267F", "#FCD116", "#007C2E"], ["diamond-gems", 50, 55, 14, "#007C2E"], "island", "Three green diamonds in the center form a 'V' for Vincent—the Gems of the Antilles!"],

    // ================= SOUTH AMERICA (12) =================
    ["br", "Brazil", "South America", "Brasília", 8515767, "216M", "diamond", ["#009739", "#FEDD00", "#012169"], ["globe", 50, 50, 21, "#012169"], "brazil", "The starry blue globe on Brazil's flag shows the constellations over Rio de Janeiro!"],
    ["ar", "Argentina", "South America", "Buenos Aires", 2780400, "46M", "h3", ["#74ACDF", "#FFFFFF", "#74ACDF"], ["sun", 50, 50, 13, "#F6B40E"], "argentina", "Features the golden 'Sun of May' with 32 rays in the middle stripe!"],
    ["co", "Colombia", "South America", "Bogotá", 1141748, "52M", "h3-top", ["#FCD116", "#003893", "#CE1126"], null, "compact", "The top yellow stripe takes up half the flag, representing gold and sunshine!"],
    ["pe", "Peru", "South America", "Lima", 1285216, "34M", "v3", ["#D91023", "#FFFFFF", "#D91023"], ["circle-crest", 50, 50, 11, "#D91023"], "elongated-ns", "Home to Machu Picchu in the high Andes Mountains and the Amazon River headwaters!"],
    ["ve", "Venezuela", "South America", "Caracas", 916445, "29M", "h3", ["#FCD116", "#00247D", "#CF142B"], ["stars-grid", 50, 50, 14, "#FFFFFF"], "compact", "Features an arc of eight white stars across the middle blue stripe!"],
    ["cl", "Chile", "South America", "Santiago", 756102, "19.6M", "canton", ["#FFFFFF", "#D52B1E", "#0039A6"], ["star", 17, 25, 11, "#FFFFFF"], "elongated-ns", "Stretches over 4,300 km north-to-south along the Andes and Pacific coast!"],
    ["ec", "Ecuador", "South America", "Quito", 283561, "18M", "h3-top", ["#FFD100", "#0072CE", "#EF3340"], ["circle-crest", 50, 50, 13, "#6B4423"], "compact", "Named after the Equator, which runs right through the country!"],
    ["bo", "Bolivia", "South America", "Sucre / La Paz", 1098581, "12.4M", "h3", ["#D52B1E", "#F9E300", "#007934"], ["circle-crest", 50, 50, 11, "#F9E300"], "compact", "Home to Salar de Uyuni, the world's largest mirror-like salt flat!"],
    ["py", "Paraguay", "South America", "Asunción", 406752, "6.8M", "h3", ["#D52B1E", "#FFFFFF", "#0038A8"], ["circle-crest", 50, 50, 11, "#F6B40E"], "compact", "The only national flag in the world with two different emblems on its front and back!"],
    ["uy", "Uruguay", "South America", "Montevideo", 176215, "3.4M", "stripes-canton", ["#FFFFFF", "#0038A8", "#FFFFFF"], ["sun", 18, 27, 13, "#FCD116", 9], "compact", "Nine stripes of white and blue with the golden Sun of May in the top-left corner!"],
    ["gy", "Guyana", "South America", "Georgetown", 214969, "813K", "triangle", ["#009E49", "#FCD116", "#009E49", "#CE1126"], null, "compact", "Known as 'The Golden Arrowhead' for its sharp yellow and red triangles on green!"],
    ["sr", "Suriname", "South America", "Paramaribo", 163820, "623K", "h3-fim", ["#377E3F", "#B40A2D", "#377E3F"], ["star", 50, 50, 13, "#ECC81D"], "compact", "Over 90% of Suriname is covered by pristine tropical rainforest!"],

    // ================= EUROPE (45) =================
    ["ru", "Russia", "Europe / Asia", "Moscow", 17098242, "144M", "h3", ["#FFFFFF", "#0039A6", "#D52B1E"], null, "russia", "The largest country on Earth by land area—spanning 11 time zones!"],
    ["ua", "Ukraine", "Europe", "Kyiv", 603550, "38M", "h2", ["#0057B7", "#FFD700"], null, "ukraine", "Represents a bright blue sky above golden fields of wheat!"],
    ["fr", "France", "Europe", "Paris", 551695, "68M", "v3", ["#002395", "#FFFFFF", "#ED2939"], null, "france", "Known as 'Le Tricolore', its vertical blue, white, and red stripes inspired many flags!"],
    ["es", "Spain", "Europe", "Madrid", 505992, "48M", "h3-wide", ["#AA151B", "#F1BF00", "#AA151B"], ["circle-crest", 32, 50, 12, "#AA151B"], "spain", "The middle yellow stripe is twice as tall as each red stripe!"],
    ["se", "Sweden", "Europe", "Stockholm", 450295, "10.5M", "nordic", ["#006AA7", "#FECC02"], null, "sweden", "Features the Nordic Cross shifted toward the flagpole in bright yellow on blue!"],
    ["no", "Norway", "Europe", "Oslo", 385207, "5.5M", "nordic", ["#BA0C2F", "#FFFFFF", "#00205B"], null, "elongated-ns", "Famous for its deep coastal fjords, Northern Lights, and blue-in-white Nordic cross!"],
    ["de", "Germany", "Europe", "Berlin", 357022, "84M", "h3", ["#000000", "#DD0000", "#FFCE00"], null, "germany", "Has three bold horizontal stripes of black, red, and gold!"],
    ["fi", "Finland", "Europe", "Helsinki", 338424, "5.6M", "nordic", ["#FFFFFF", "#002F6C"], null, "elongated-ns", "Blue stands for Finland's 188,000 lakes and white represents winter snow!"],
    ["pl", "Poland", "Europe", "Warsaw", 312696, "37M", "h2", ["#FFFFFF", "#DC143C"], null, "compact", "Simple and bold: pure white on top for peace and crimson red below!"],
    ["it", "Italy", "Europe", "Rome", 301340, "59M", "v3", ["#009246", "#FFFFFF", "#CE2B37"], null, "italy", "Italy is shaped like a high-heeled boot kicking the island of Sicily!"],
    ["gb", "United Kingdom", "Europe", "London", 242495, "68M", "uk", ["#012169", "#FFFFFF", "#C8102E"], null, "uk", "The Union Jack combines three crosses: England, Scotland, and Saint Patrick!"],
    ["ro", "Romania", "Europe", "Bucharest", 238397, "19M", "v3", ["#002B7F", "#FCD116", "#CE1126"], null, "compact", "Home to the Carpathian Mountains and the medieval castles of Transylvania!"],
    ["by", "Belarus", "Europe", "Minsk", 207600, "9.2M", "h3-top", ["#D22730", "#009739", "#009739"], ["v-ornament", 8, 50, 12, "#FFFFFF"], "compact", "Features a traditional red-and-white woven rushnyk pattern along the hoist side!"],
    ["gr", "Greece", "Europe", "Athens", 131957, "10.3M", "stripes-canton", ["#0D5EAF", "#FFFFFF", "#0D5EAF"], ["swiss-cross", 18.5, 27.7, 18, "#FFFFFF", 9], "greece", "Has 9 blue and white stripes symbolizing the Aegean Sea and sky!"],
    ["bg", "Bulgaria", "Europe", "Sofia", 110879, "6.4M", "h3", ["#FFFFFF", "#00966E", "#D62612"], null, "compact", "White stands for peace, green for fertile forests, and red for courage!"],
    ["is", "Iceland", "Europe", "Reykjavik", 103000, "390K", "nordic", ["#02529C", "#FFFFFF", "#DC1E35"], null, "iceland", "Blue for the ocean and mountains, white for geysers and ice, and red for volcanic fire!"],
    ["hu", "Hungary", "Europe", "Budapest", 93028, "9.6M", "h3", ["#CE2939", "#FFFFFF", "#477050"], null, "compact", "The Danube River splits its capital city into Buda and Pest!"],
    ["pt", "Portugal", "Europe", "Lisbon", 92212, "10.4M", "v2", ["#006600", "#FF0000"], ["wheel", 38, 50, 15, "#FFCC00"], "elongated-ns", "Features a golden navigation sphere (armillary sphere) from the Age of Discovery!"],
    ["at", "Austria", "Europe", "Vienna", 83871, "9.1M", "h3", ["#ED2939", "#FFFFFF", "#ED2939"], null, "elongated-ew", "One of the oldest national flag designs in the world, dating back to 1191!"],
    ["cz", "Czechia", "Europe", "Prague", 78865, "10.8M", "triangle", ["#FFFFFF", "#D7141A", "#D7141A", "#11457E"], null, "compact", "White over red with a deep blue triangle extending halfway across the flag!"],
    ["ie", "Ireland", "Europe", "Dublin", 70273, "5.2M", "v3", ["#169B62", "#FFFFFF", "#FF883E"], null, "island", "Known as the Emerald Isle—its flag has green, white for peace, and orange!"],
    ["lt", "Lithuania", "Europe", "Vilnius", 65300, "2.8M", "h3", ["#FDB913", "#006A44", "#C1272D"], null, "compact", "Yellow stands for golden sun and fields, green for forests, and red for bravery!"],
    ["lv", "Latvia", "Europe", "Riga", 64559, "1.8M", "h3-wide", ["#9E3039", "#FFFFFF", "#9E3039"], ["rect-band", 50, 50, 8, "#FFFFFF"], "compact", "Famous for its deep carmine 'Latvian red' color divided by a thin white stripe!"],
    ["hr", "Croatia", "Europe", "Zagreb", 56594, "3.8M", "h3", ["#FF0000", "#FFFFFF", "#171796"], ["shield", 50, 50, 14, "#FF0000"], "coastal", "Features a famous red-and-white checkerboard shield in the center!"],
    ["ba", "Bosnia and Herzegovina", "Europe", "Sarajevo", 51209, "3.2M", "diagonal", ["#002395", "#FECB00", "#002395"], ["stars-grid", 50, 50, 15, "#FFFFFF"], "compact", "A bright yellow right triangle accompanied by a diagonal line of white stars!"],
    ["sk", "Slovakia", "Europe", "Bratislava", 49037, "5.4M", "h3", ["#FFFFFF", "#0B4EA2", "#EE1C25"], ["shield", 32, 50, 14, "#EE1C25"], "elongated-ew", "Its coat of arms shows a white double cross atop three blue mountain peaks!"],
    ["ee", "Estonia", "Europe", "Tallinn", 45227, "1.36M", "h3", ["#0072CE", "#000000", "#FFFFFF"], null, "compact", "Blue sky, black forest soil, and white winter snow—a serene winter landscape flag!"],
    ["dk", "Denmark", "Europe", "Copenhagen", 42951, "5.9M", "nordic", ["#C8102E", "#FFFFFF"], null, "archipelago", "The 'Dannebrog' holds the Guinness World Record as the oldest continuously used national flag!"],
    ["ch", "Switzerland", "Europe", "Bern", 41285, "8.8M", "solid", ["#DA291C", "#FFFFFF"], ["swiss-cross", 50, 50, 28, "#FFFFFF"], "switzerland", "One of only two square country flags in the world, featuring a bold white cross!"],
    ["nl", "Netherlands", "Europe", "Amsterdam", 41850, "17.9M", "h3", ["#AE1C28", "#FFFFFF", "#21468B"], null, "compact", "The oldest tricolor flag in the world, famous for windmills, canals, and tulips!"],
    ["md", "Moldova", "Europe", "Chișinău", 33846, "2.5M", "v3", ["#0046AE", "#FFD200", "#CC092F"], ["circle-crest", 50, 50, 12, "#8B5A2B"], "elongated-ns", "Blue, yellow, and red vertical stripes with a golden eagle in the center!"],
    ["be", "Belgium", "Europe", "Brussels", 30528, "11.7M", "v3", ["#000000", "#FDDA24", "#EF3340"], null, "compact", "Vertical stripes of black, yellow, and red taken from the historic Duchy of Brabant!"],
    ["al", "Albania", "Europe", "Tirana", 28748, "2.8M", "solid", ["#E41E20", "#000000"], ["star", 50, 50, 20, "#000000"], "elongated-ns", "Features a bold black double-headed eagle in the center of a bright red field!"],
    ["mk", "North Macedonia", "Europe", "Skopje", 25713, "1.8M", "seychelles", ["#D20000", "#FFE600", "#D20000", "#FFE600", "#D20000"], ["sun", 50, 50, 18, "#FFE600"], "compact", "A radiant golden sun with eight rays beams outward across a red background!"],
    ["si", "Slovenia", "Europe", "Ljubljana", 20273, "2.1M", "h3", ["#FFFFFF", "#005CE6", "#ED1C24"], ["shield", 28, 34, 10, "#005CE6"], "compact", "Its shield shows Mount Triglav, Slovenia's highest peak, and three golden stars!"],
    ["me", "Montenegro", "Europe", "Podgorica", 13812, "616K", "solid", ["#C40308", "#D4AF37"], ["circle-crest", 50, 50, 18, "#D4AF37"], "compact", "A crimson flag framed in gold with a golden double-headed eagle in the center!"],
    ["xk", "Kosovo", "Europe", "Pristina", 10887, "1.8M", "solid", ["#244AA5", "#D0A650"], ["diamond", 50, 54, 18, "#D0A650"], "compact", "Shows a golden map silhouette of Kosovo beneath an arc of six white stars!"],
    ["lu", "Luxembourg", "Europe", "Luxembourg", 2586, "660K", "h3", ["#EF3340", "#FFFFFF", "#00A3E0"], null, "compact", "Similar to the Dutch flag, but uses a bright sky-blue bottom stripe!"],
    ["ad", "Andorra", "Europe", "Andorra la Vella", 468, "80K", "v3", ["#10069F", "#FEDD00", "#D50032"], ["shield", 50, 50, 12, "#D4AF37"], "compact", "Nestled high in the Pyrenees mountains between France and Spain!"],
    ["mt", "Malta", "Europe", "Valletta", 316, "535K", "v2", ["#FFFFFF", "#CF142B"], ["swiss-cross", 14, 22, 9, "#CCCCCC"], "island", "Displays the silver George Cross in the top-left corner of its white and red halves!"],
    ["li", "Liechtenstein", "Europe", "Vaduz", 160, "39K", "h2", ["#002B7F", "#CE1126"], ["circle-crest", 22, 26, 10, "#FCD116"], "elongated-ns", "Added a golden prince's crown in 1937 after discovering its flag matched Haiti's at the Olympics!"],
    ["sm", "San Marino", "Europe", "San Marino", 61, "34K", "h2", ["#FFFFFF", "#5EB6E4"], ["circle-crest", 50, 50, 13, "#F6B40E"], "compact", "World's oldest constitutional republic, perched on the slopes of Mount Titano!"],
    ["mc", "Monaco", "Europe", "Monaco", 2.02, "39K", "h2", ["#CE1126", "#FFFFFF"], null, "coastal", "Second smallest country in the world, famous for its Mediterranean harbor and Grand Prix!"],
    ["va", "Vatican City", "Europe", "Vatican City", 0.49, "764", "v2", ["#FFE000", "#FFFFFF"], ["circle-crest", 75, 50, 15, "#D4AF37"], "compact", "The smallest country in the world at just 0.49 km², and one of only two square flags!"],
    ["rs", "Serbia", "Europe", "Belgrade", 88361, "6.6M", "h3", ["#C6363C", "#0C4076", "#FFFFFF"], ["shield", 34, 50, 15, "#C6363C"], "elongated-ns", "Red, blue, and white horizontal tricolor with the Serbian eagle crest!"],

    // ================= ASIA (49) =================
    ["cn", "China", "Asia", "Beijing", 9596960, "1.41B", "solid", ["#EE1C25", "#FFFF00"], ["star", 20, 30, 15, "#FFFF00"], "china", "Has one big golden star surrounded by four smaller stars in the upper corner!"],
    ["in", "India", "Asia", "New Delhi", 3287263, "1.43B", "h3", ["#FF9933", "#FFFFFF", "#138808"], ["wheel", 50, 50, 13, "#000080"], "india", "Features the 24-spoke navy blue Ashoka Chakra wheel in the center!"],
    ["kz", "Kazakhstan", "Asia", "Astana", 2724900, "20M", "solid", ["#00AFCA", "#FEC50C"], ["sun", 50, 48, 17, "#FEC50C"], "elongated-ew", "Largest landlocked country in the world, featuring a golden sun and soaring steppe eagle!"],
    ["sa", "Saudi Arabia", "Asia", "Riyadh", 2149690, "36M", "solid", ["#006C35", "#FFFFFF"], ["circle-crest", 50, 55, 16, "#FFFFFF"], "compact", "Deep green flag inscribed in white Arabic calligraphy above a curved sword!"],
    ["id", "Indonesia", "Asia", "Jakarta", 1904569, "277M", "h2", ["#FF0000", "#FFFFFF"], null, "indonesia", "Made up of over 17,000 islands stretching across Southeast Asia!"],
    ["ir", "Iran", "Asia", "Tehran", 1648195, "89M", "h3", ["#239F40", "#FFFFFF", "#DA0000"], ["circle-crest", 50, 50, 11, "#DA0000"], "compact", "Green, white, and red stripes with a stylized red tulip emblem in the center!"],
    ["mn", "Mongolia", "Asia", "Ulaanbaatar", 1564116, "3.4M", "v3", ["#C4272F", "#015197", "#C4272F"], ["sun", 17, 50, 13, "#F9CF02"], "elongated-ew", "Known as the 'Land of the Eternal Blue Sky', featuring the golden Soyombo symbol!"],
    ["pk", "Pakistan", "Asia", "Islamabad", 881913, "240M", "v2", ["#FFFFFF", "#01411C"], ["crescent-star", 62, 50, 20, "#FFFFFF"], "elongated-ns", "Dark green field with a white vertical stripe on the hoist and a white crescent and star!"],
    ["tr", "Turkey", "Europe / Asia", "Ankara", 783562, "85M", "solid", ["#E30A17", "#FFFFFF"], ["crescent-star", 48, 50, 22, "#FFFFFF"], "turkey", "Bridges Europe and Asia and features a bold white crescent moon and star on red!"],
    ["mm", "Myanmar", "Asia", "Naypyidaw", 676578, "54M", "h3", ["#FECB00", "#34B233", "#EA2839"], ["star", 50, 50, 22, "#FFFFFF"], "elongated-ns", "Yellow, green, and red stripes topped with a giant five-pointed white star!"],
    ["af", "Afghanistan", "Asia", "Kabul", 652230, "42M", "v3", ["#000000", "#D32011", "#007A36"], ["circle-crest", 50, 50, 14, "#FFFFFF"], "compact", "A mountainous landlocked country at the crossroads of Central and South Asia!"],
    ["ye", "Yemen", "Asia", "Sana'a", 527968, "34M", "h3", ["#CE1126", "#FFFFFF", "#000000"], null, "compact", "Located at the southern tip of the Arabian Peninsula along the Red Sea!"],
    ["th", "Thailand", "Asia", "Bangkok", 513120, "71M", "h5", ["#A51931", "#F4F5F8", "#2D2A4A", "#F4F5F8", "#A51931"], null, "elongated-ns", "Five horizontal stripes of red, white, and a double-thick navy blue center band!"],
    ["tm", "Turkmenistan", "Asia", "Ashgabat", 488100, "6.5M", "solid", ["#00843D", "#D22630"], ["crescent-star", 55, 32, 14, "#FFFFFF"], "compact", "Features an intricate vertical red carpet stripe with five traditional woven motifs!"],
    ["uz", "Uzbekistan", "Asia", "Tashkent", 447400, "36M", "h3-fim", ["#0099B5", "#FFFFFF", "#1EB53A"], ["crescent-star", 20, 17, 10, "#FFFFFF"], "elongated-ew", "Sky blue, white, and green separated by thin red lines with a crescent and 12 stars!"],
    ["iq", "Iraq", "Asia", "Baghdad", 438317, "45M", "h3", ["#CE1126", "#FFFFFF", "#000000"], ["stars-grid", 50, 50, 11, "#007A3D"], "compact", "Home to ancient Mesopotamia between the Tigris and Euphrates rivers!"],
    ["jp", "Japan", "Asia", "Tokyo", 377975, "124M", "solid", ["#FFFFFF", "#BC002D"], ["circle", 50, 50, 28, "#BC002D"], "japan", "Called the 'Hinomaru' (Circle of the Sun), representing the Land of the Rising Sun!"],
    ["vn", "Vietnam", "Asia", "Hanoi", 331212, "99M", "solid", ["#DA251D", "#FFFF00"], ["star", 50, 50, 24, "#FFFF00"], "elongated-ns", "A large five-pointed golden star shines in the middle of a bright red flag!"],
    ["my", "Malaysia", "Asia", "Kuala Lumpur", 330803, "34M", "stripes-canton", ["#CC0001", "#FFFFFF", "#010066"], ["crescent-star", 21, 27, 14, "#FFCC00", 14], "archipelago", "Called 'Stripes of Glory' with 14 alternating stripes and a 14-point yellow star!"],
    ["om", "Oman", "Asia", "Muscat", 309500, "4.6M", "h3", ["#FFFFFF", "#DB161B", "#008000"], ["shield", 16, 24, 12, "#DB161B"], "coastal", "Includes a red vertical bar on the left and the national khanjar dagger emblem!"],
    ["ph", "Philippines", "Asia", "Manila", 300000, "117M", "triangle", ["#0038A8", "#CE1126", "#CE1126", "#FFFFFF"], ["sun", 16, 50, 11, "#FCD116"], "archipelago", "An archipelago of over 7,600 islands with a golden 8-rayed sun in a white triangle!"],
    ["la", "Laos", "Asia", "Vientiane", 236800, "7.6M", "h3-wide", ["#CE1126", "#002868", "#CE1126"], ["circle", 50, 50, 18, "#FFFFFF"], "elongated-ns", "The white disk in the middle represents a full moon shining over the Mekong River!"],
    ["kg", "Kyrgyzstan", "Asia", "Bishkek", 199951, "7M", "solid", ["#E8112D", "#FFEF00"], ["sun", 50, 50, 22, "#FFEF00"], "elongated-ew", "A 40-rayed golden sun surrounds the circular crown of a traditional yurt tent!"],
    ["sy", "Syria", "Asia", "Damascus", 185180, "23M", "h3", ["#CE1126", "#FFFFFF", "#000000"], ["stars-grid", 50, 50, 12, "#007A3D"], "compact", "Features red, white, and black horizontal bands with stars in the white stripe!"],
    ["kh", "Cambodia", "Asia", "Phnom Penh", 181035, "17M", "h3-wide", ["#032EA1", "#E00025", "#032EA1"], ["circle-crest", 50, 50, 17, "#FFFFFF"], "compact", "Features the iconic white towers of Angkor Wat right in the center of the flag!"],
    ["bd", "Bangladesh", "Asia", "Dhaka", 148460, "173M", "solid", ["#006A4E", "#F42A41"], ["circle", 45, 50, 25, "#F42A41"], "compact", "A red sun rises over lush green fields—shifted slightly left so it looks centered when flying!"],
    ["np", "Nepal", "Asia", "Kathmandu", 147516, "31M", "nepal", ["#DC143C", "#003893", "#FFFFFF"], ["sun", 32, 68, 12, "#FFFFFF"], "elongated-ew", "Home to Mount Everest and the ONLY national flag in the world that isn't four-sided!"],
    ["tj", "Tajikistan", "Asia", "Dushanbe", 143100, "10M", "h3-wide", ["#CC0000", "#FFFFFF", "#006600"], ["sun", 50, 50, 12, "#F8C300"], "compact", "Displays a golden crown beneath an arc of seven stars in the white middle stripe!"],
    ["kp", "North Korea", "Asia", "Pyongyang", 120538, "26M", "h3-fim", ["#024FA2", "#ED1C27", "#024FA2"], ["star", 32, 50, 15, "#ED1C27"], "elongated-ns", "Red center panel bordered in white and blue with a red star in a white circle!"],
    ["kr", "South Korea", "Asia", "Seoul", 100210, "51M", "solid", ["#FFFFFF", "#CD2E3A", "#0047A0"], ["taegeuk", 50, 50, 24, "#CD2E3A"], "korea", "The red and blue Taegeuk circle in the center represents universal balance and harmony!"],
    ["jo", "Jordan", "Asia", "Amman", 89342, "11.3M", "triangle", ["#000000", "#FFFFFF", "#007A3D", "#CE1126"], ["star", 15, 50, 8, "#FFFFFF"], "compact", "Home to the rose-red rock city of Petra and a 7-pointed white star on its flag!"],
    ["az", "Azerbaijan", "Asia", "Baku", 86600, "10.1M", "h3", ["#00B5E2", "#EF3340", "#509E2F"], ["crescent-star", 50, 50, 13, "#FFFFFF"], "compact", "Blue, red, and green stripes with a white crescent and an eight-pointed star!"],
    ["ae", "United Arab Emirates", "Asia", "Abu Dhabi", 83600, "9.5M", "v2-benin", ["#FF0000", "#00732F", "#FFFFFF", "#000000"], null, "coastal", "Home to the Burj Khalifa, the tallest building in the world!"],
    ["ge", "Georgia", "Asia / Europe", "Tbilisi", 69700, "3.7M", "cross", ["#FFFFFF", "#FF0000", "#FFFFFF"], ["swiss-cross", 20, 24, 8, "#FF0000"], "elongated-ew", "Known as the Five-Cross Flag—one big red St. George's cross and four smaller crosses!"],
    ["lk", "Sri Lanka", "Asia", "Sri Jayawardenepura Kotte", 65610, "22M", "v2", ["#FFBE29", "#8D153A"], ["circle-crest", 64, 50, 18, "#FFBE29"], "island", "Called the 'Lion Flag', featuring a golden lion holding a sword alongside green and orange bands!"],
    ["tw", "Taiwan", "Asia", "Taipei", 36193, "23.5M", "canton", ["#FE0000", "#FE0000", "#000095"], ["sun", 21, 26, 13, "#FFFFFF"], "island", "Called 'Blue Sky, White Sun, and a Wholly Red Earth' with a 12-rayed white sun!"],
    ["bt", "Bhutan", "Asia", "Thimphu", 38394, "787K", "split-diag", ["#FFCC33", "#FF4E12"], ["circle-crest", 50, 50, 18, "#FFFFFF"], "compact", "Features 'Druk', the white Thunder Dragon, holding jewels in its claws across a diagonal split!"],
    ["am", "Armenia", "Asia / Europe", "Yerevan", 29743, "3M", "h3", ["#D90012", "#0033A0", "#F2A800"], null, "compact", "Red for the Armenian highlands, blue for peaceful skies, and apricot-orange for creativity!"],
    ["il", "Israel", "Asia", "Jerusalem", 22145, "9.8M", "h3-wide", ["#0038B8", "#FFFFFF", "#0038B8"], ["star", 50, 50, 16, "#0038B8"], "elongated-ns", "White flag with two blue stripes and the six-pointed Star of David in the center!"],
    ["kw", "Kuwait", "Asia", "Kuwait City", 17818, "4.3M", "triangle", ["#007A3D", "#FFFFFF", "#CE1126", "#000000"], null, "compact", "Green, white, and red stripes with a black trapezoid on the hoist side!"],
    ["tl", "Timor-Leste", "Asia", "Dili", 14874, "1.36M", "triangle", ["#DA291C", "#DA291C", "#DA291C", "#000000"], ["star", 13, 50, 9, "#FFFFFF"], "island", "Features overlapping yellow and black triangles pointing across a red field!"],
    ["qa", "Qatar", "Asia", "Doha", 11586, "2.7M", "qatar", ["#FFFFFF", "#8A1538"], null, "peninsula", "Has a nine-point serrated zigzag edge and is the widest flag by proportion in the world!"],
    ["lb", "Lebanon", "Asia", "Beirut", 10452, "5.3M", "h3-wide", ["#ED1C24", "#FFFFFF", "#ED1C24"], ["maple", 50, 50, 17, "#00A651"], "elongated-ns", "Displays an evergreen green Cedar of Lebanon tree in the wide white center stripe!"],
    ["cy", "Cyprus", "Europe / Asia", "Nicosia", 9251, "1.26M", "solid", ["#FFFFFF", "#D57800"], ["diamond", 50, 46, 20, "#D57800"], "island", "Shows a copper-orange map outline of the island above two green olive branches!"],
    ["ps", "Palestine", "Asia", "Ramallah / East Jerusalem", 6020, "5.4M", "triangle", ["#000000", "#FFFFFF", "#007A3D", "#CE1126"], null, "elongated-ns", "Features the pan-Arab colors of black, white, and green with a red hoist triangle!"],
    ["bn", "Brunei", "Asia", "Bandar Seri Begawan", 5765, "452K", "diagonal", ["#F7E017", "#FFFFFF", "#000000"], ["circle-crest", 50, 50, 16, "#CF1126"], "compact", "Bright yellow field cut by white and black diagonal stripes and a red royal crest!"],
    ["bh", "Bahrain", "Asia", "Manama", 786, "1.5M", "qatar", ["#FFFFFF", "#CE1126"], null, "island", "An island nation in the Persian Gulf whose flag has five white serrated triangles!"],
    ["sg", "Singapore", "Asia", "Singapore", 734, "5.9M", "h2", ["#EF3340", "#FFFFFF"], ["crescent-star", 23, 25, 13, "#FFFFFF"], "island", "Red and white halves with a white crescent moon and a circle of five stars!"],
    ["mv", "Maldives", "Asia", "Malé", 300, "521K", "solid", ["#D21034", "#007E3A"], ["crescent-star", 50, 50, 16, "#FFFFFF"], "archipelago", "A chain of 1,192 coral islands in the Indian Ocean, with a white crescent on green and red!"],

    // ================= AFRICA (54) =================
    ["dz", "Algeria", "Africa", "Algiers", 2381741, "45M", "v2", ["#006233", "#FFFFFF"], ["crescent-star", 50, 50, 22, "#D21034"], "algeria", "The largest country in Africa, split vertically in green and white with a red crescent!"],
    ["cd", "DR Congo", "Africa", "Kinshasa", 2344858, "102M", "diagonal", ["#007FFF", "#CE1021", "#F7D618"], ["star", 20, 26, 13, "#F7D618"], "compact", "Sky-blue flag with a red-and-yellow diagonal band and a large yellow star!"],
    ["sd", "Sudan", "Africa", "Khartoum", 1886068, "48M", "triangle", ["#D21034", "#FFFFFF", "#000000", "#007229"], null, "compact", "Home to more ancient pyramids (in Meroë) than any other country on Earth!"],
    ["ly", "Libya", "Africa", "Tripoli", 1759540, "6.9M", "h3-wide", ["#E70013", "#000000", "#239E46"], ["crescent-star", 50, 50, 14, "#FFFFFF"], "compact", "Red, black, and green stripes with a glowing white crescent and star in the center!"],
    ["td", "Chad", "Africa", "N'Djamena", 1284000, "18M", "v3", ["#002664", "#FECB00", "#C60C30"], null, "elongated-ns", "Named after Lake Chad, with blue for the sky and water, yellow for the Sahara, and red for progress!"],
    ["ne", "Niger", "Africa", "Niamey", 1267000, "27M", "h3", ["#E05206", "#FFFFFF", "#0DB02B"], ["circle", 50, 50, 12, "#E05206"], "compact", "Features a bright orange sun circle in the middle white stripe!"],
    ["ao", "Angola", "Africa", "Luanda", 1246700, "36M", "h2", ["#CC092F", "#000000"], ["crescent-star", 50, 50, 18, "#FFCB00"], "compact", "Red over black with a golden half-gear wheel, machete, and star in the center!"],
    ["ml", "Mali", "Africa", "Bamako", 1240192, "23M", "v3", ["#14B53A", "#FCD116", "#CE1126"], null, "compact", "Home to the historic desert trading city of Timbuktu!"],
    ["za", "South Africa", "Africa", "Pretoria / Cape Town", 1221037, "60M", "y-pall", ["#E03C31", "#001489", "#007749", "#FFB81C"], null, "south-africa", "Has six different colors meeting in a 'Y' shape symbolizing unity and convergence!"],
    ["et", "Ethiopia", "Africa", "Addis Ababa", 1104300, "126M", "h3", ["#078930", "#FCDD09", "#DA121A"], ["star", 50, 50, 17, "#0F47AF"], "compact", "Its green, yellow, and red colors inspired pan-African flags across the entire continent!"],
    ["mr", "Mauritania", "Africa", "Nouakchott", 1030700, "4.8M", "h3-wide", ["#D01C1F", "#00A95C", "#D01C1F"], ["crescent-star", 50, 50, 18, "#FFD700"], "compact", "Features an upward-pointing golden crescent and star on emerald green between red bands!"],
    ["eg", "Egypt", "Africa", "Cairo", 1002450, "112M", "h3", ["#CE1126", "#FFFFFF", "#000000"], ["circle-crest", 50, 50, 11, "#C09300"], "egypt", "Home to the Great Pyramids and the golden Eagle of Saladin on its flag!"],
    ["tz", "Tanzania", "Africa", "Dodoma", 947303, "67M", "diagonal", ["#1EB53A", "#00A3DD", "#000000", "#FCD116"], null, "compact", "Home to Mount Kilimanjaro and the Serengeti, with a diagonal black-and-gold stripe!"],
    ["ng", "Nigeria", "Africa", "Abuja", 923768, "223M", "v3", ["#008751", "#FFFFFF", "#008751"], null, "nigeria", "Green stripes represent lush forests and agriculture, and white stands for peace!"],
    ["na", "Namibia", "Africa", "Windhoek", 825615, "2.6M", "diagonal", ["#003580", "#009543", "#D21034", "#FFFFFF"], ["sun", 20, 26, 13, "#FFCE00"], "elongated-ns", "Home to the ancient Namib Desert, with a 12-rayed golden sun in the top-left corner!"],
    ["mz", "Mozambique", "Africa", "Maputo", 801590, "33M", "triangle", ["#007168", "#000000", "#FCE100", "#D21034"], ["star", 16, 50, 11, "#FCE100"], "elongated-ns", "Features an open book inside a yellow star on a red hoist triangle!"],
    ["zm", "Zambia", "Africa", "Lusaka", 752612, "20M", "solid", ["#198A00", "#DE2010"], ["star", 80, 26, 12, "#EF7D00"], "compact", "Lush green field with an orange African fish eagle soaring above red, black, and orange stripes!"],
    ["ss", "South Sudan", "Africa", "Juba", 644329, "11M", "triangle", ["#000000", "#DA121A", "#078930", "#0F47AF"], ["star", 16, 50, 10, "#FCDD09"], "compact", "The world's youngest country (independent in 2011), with a golden star on a blue triangle!"],
    ["so", "Somalia", "Africa", "Mogadishu", 637657, "18M", "solid", ["#4189DD", "#FFFFFF"], ["star", 50, 50, 22, "#FFFFFF"], "coastal", "Sky-blue flag with a large five-pointed white star of unity in the center!"],
    ["cf", "Central African Republic", "Africa", "Bangui", 622984, "5.7M", "h4", ["#003082", "#FFFFFF", "#289728", "#FFCE00"], ["star", 18, 14, 9, "#FFCE00"], "compact", "Combines four horizontal stripes crossed vertically down the middle by a bright red band!"],
    ["mg", "Madagascar", "Africa", "Antananarivo", 587041, "30M", "v2-benin", ["#FFFFFF", "#FC3D32", "#007E3A"], null, "elongated-ns", "Fourth largest island in the world, home to lemurs and giant baobab trees!"],
    ["bw", "Botswana", "Africa", "Gaborone", 581730, "2.6M", "h3-fim", ["#6DA9D2", "#000000", "#6DA9D2"], null, "compact", "Sky blue for rain and water, with a black-and-white center stripe inspired by zebras!"],
    ["ke", "Kenya", "Africa", "Nairobi", 580367, "55M", "h3-fim", ["#000000", "#BB0000", "#006600"], ["shield", 50, 50, 18, "#BB0000"], "kenya", "Features a traditional Maasai shield and two crossed white spears in the center!"],
    ["cm", "Cameroon", "Africa", "Yaoundé", 475442, "28M", "v3", ["#007A5E", "#CE1126", "#FCD116"], ["star", 50, 50, 12, "#FCD116"], "elongated-ns", "Green, red, and yellow vertical stripes with a single golden star of unity in the center!"],
    ["ma", "Morocco", "Africa", "Rabat", 446550, "37M", "solid", ["#C1272D", "#006233"], ["star", 50, 50, 20, "#006233"], "compact", "Deep red flag featuring an interwoven green five-pointed star (Seal of Solomon)!"],
    ["zw", "Zimbabwe", "Africa", "Harare", 390757, "16.6M", "triangle", ["#006400", "#FFD200", "#D40000", "#FFFFFF"], ["star", 15, 50, 11, "#D40000"], "compact", "Home to Victoria Falls, with the golden Zimbabwe Bird perched on a red star!"],
    ["cg", "Republic of the Congo", "Africa", "Brazzaville", 342000, "6.1M", "diagonal", ["#009543", "#DC241F", "#FBDE4A"], null, "compact", "Divided diagonally from bottom-left to top-right into green, yellow, and red!"],
    ["ci", "Ivory Coast", "Africa", "Yamoussoukro", 322463, "29M", "v3", ["#F77F00", "#FFFFFF", "#009E60"], null, "compact", "Vertical stripes of orange, white, and green—the exact reverse order of Ireland's flag!"],
    ["bf", "Burkina Faso", "Africa", "Ouagadougou", 274200, "23M", "h2", ["#EF2B2D", "#009E49"], ["star", 50, 50, 15, "#FCD116"], "compact", "Red over green with a bright yellow guiding star right in the middle!"],
    ["ga", "Gabon", "Africa", "Libreville", 267668, "2.4M", "h3", ["#009E60", "#FCD116", "#3A75C4"], null, "compact", "Green for equatorial forests, yellow for the Equator sun, and blue for the Atlantic Ocean!"],
    ["gn", "Guinea", "Africa", "Conakry", 245857, "14M", "v3", ["#CE1126", "#FCD116", "#009460"], null, "compact", "Vertical stripes of red, yellow, and green along the West African coast!"],
    ["ug", "Uganda", "Africa", "Kampala", 241550, "48M", "h5", ["#000000", "#FCDC04", "#D90000", "#000000", "#FCDC04"], ["circle", 50, 50, 14, "#FFFFFF"], "compact", "Six stripes of black, yellow, and red with a Grey Crowned Crane in the center circle!"],
    ["gh", "Ghana", "Africa", "Accra", 238533, "34M", "h3", ["#CE1126", "#FCD116", "#006B3F"], ["star", 50, 50, 14, "#000000"], "compact", "Features the famous 'Black Star of Africa' in the center of red, gold, and green stripes!"],
    ["sn", "Senegal", "Africa", "Dakar", 196722, "18M", "v3", ["#00853F", "#FDEF42", "#E31B23"], ["star", 50, 50, 12, "#00853F"], "compact", "Located at the westernmost point of mainland Africa, with a green star on yellow!"],
    ["tn", "Tunisia", "Africa", "Tunis", 163610, "12.4M", "solid", ["#E70013", "#FFFFFF"], ["circle", 50, 50, 22, "#FFFFFF"], "elongated-ns", "Red flag with a white central circle holding a red crescent moon and star!"],
    ["mw", "Malawi", "Africa", "Lilongwe", 118484, "21M", "h3", ["#000000", "#CE1126", "#339E35"], ["sun", 50, 22, 13, "#CE1126"], "elongated-ns", "Shows a red rising sun of dawn in the top black stripe above red and green!"],
    ["er", "Eritrea", "Africa", "Asmara", 117600, "3.7M", "triangle", ["#4189DD", "#12AD2B", "#12AD2B", "#EA0437"], ["circle-crest", 22, 50, 13, "#FFC726"], "coastal", "A large red triangle stretches all the way across the flag between green and blue triangles!"],
    ["bj", "Benin", "Africa", "Porto-Novo", 114763, "13.7M", "v2-benin", ["#008751", "#FCD116", "#E8112D"], null, "elongated-ns", "Green vertical band on the left with yellow and red horizontal bands on the right!"],
    ["lr", "Liberia", "Africa", "Monrovia", 111369, "5.4M", "stripes-canton", ["#BF0A30", "#FFFFFF", "#002868"], ["star", 18, 25, 11, "#FFFFFF", 11], "coastal", "Has 11 red and white stripes and a single big white star inside a blue square!"],
    ["SL", "Sierra Leone", "Africa", "Freetown", 71740, "8.8M", "h3", ["#1EB53A", "#FFFFFF", "#0072C6"], null, "compact", "Bright green, white, and blue horizontal stripes representing mountains, peace, and harbor!"],
    ["tg", "Togo", "Africa", "Lomé", 56785, "9M", "stripes-canton", ["#006A4E", "#FFCE00", "#D21034"], ["star", 18, 28, 11, "#FFFFFF", 5], "elongated-ns", "Five alternating stripes of green and yellow with a white star on a red square!"],
    ["gw", "Guinea-Bissau", "Africa", "Bissau", 36125, "2.1M", "v2-benin", ["#CE1126", "#FCD116", "#009E49"], ["star", 16, 50, 11, "#000000"], "compact", "Red hoist band with a black star alongside yellow and green horizontal stripes!"],
    ["ls", "Lesotho", "Africa", "Maseru", 30355, "2.3M", "h3", ["#00209F", "#FFFFFF", "#009543"], ["triangle-emblem", 50, 50, 12, "#000000"], "compact", "Known as the 'Kingdom in the Sky' because all of its land sits high in the mountains!"],
    ["gq", "Equatorial Guinea", "Africa", "Malabo", 28051, "1.7M", "triangle", ["#3E9A00", "#FFFFFF", "#E32118", "#0073CE"], ["circle-crest", 55, 50, 11, "#009A3E"], "compact", "Green, white, and red stripes with a blue hoist triangle and a silk-cotton tree crest!"],
    ["bi", "Burundi", "Africa", "Gitega", 27834, "13.2M", "saltire", ["#CE1126", "#1EB53A", "#FFFFFF"], ["circle", 50, 50, 16, "#FFFFFF"], "compact", "A white diagonal cross divides red and green quarters around three red-and-green stars!"],
    ["rw", "Rwanda", "Africa", "Kigali", 26338, "14M", "h3-top", ["#00A1DE", "#FAD201", "#20603D"], ["sun", 78, 24, 12, "#E5BE01"], "compact", "Known as the 'Land of a Thousand Hills', with a 24-rayed golden sun in the sky-blue band!"],
    ["dj", "Djibouti", "Africa", "Djibouti", 23200, "1.1M", "triangle", ["#6AB2E7", "#12AD2B", "#12AD2B", "#FFFFFF"], ["star", 15, 50, 10, "#D7141A"], "compact", "Light blue over green with a white triangle and a five-pointed red star!"],
    ["sz", "Eswatini", "Africa", "Mbabane / Lobamba", 17364, "1.2M", "h3-fim", ["#3E5EB9", "#B10C0C", "#3E5EB9"], ["shield", 50, 50, 16, "#FFFFFF"], "compact", "Blue, yellow, and crimson bands featuring a black-and-white Nguni shield and spears!"],
    ["gm", "Gambia", "Africa", "Banjul", 11295, "2.7M", "h3-fim", ["#CE1126", "#0C1C8C", "#3A7728"], null, "elongated-ew", "Shaped along the winding Gambia River, symbolized by the blue middle stripe!"],
    ["cv", "Cabo Verde", "Africa", "Praia", 4033, "598K", "h5", ["#003893", "#FFFFFF", "#CF2027", "#FFFFFF", "#003893"], ["stars-grid", 36, 62, 13, "#F7D116"], "archipelago", "Ten golden stars in a circle represent the ten volcanic islands of Cabo Verde!"],
    ["km", "Comoros", "Africa", "Moroni", 2235, "852K", "h4", ["#FFC61E", "#FFFFFF", "#CE1126", "#3A75C4"], ["crescent-star", 16, 50, 11, "#FFFFFF"], "archipelago", "Four colorful stripes and a green triangle represent the four main islands!"],
    ["mu", "Mauritius", "Africa", "Port Louis", 2040, "1.3M", "h4", ["#EA2839", "#1A206D", "#FFD500", "#00A551"], null, "island", "Called the 'Four Bands' flag with vibrant horizontal stripes of red, blue, yellow, and green!"],
    ["st", "Sao Tome and Principe", "Africa", "São Tomé", 964, "231K", "triangle", ["#12AD2B", "#FFCE00", "#12AD2B", "#D21034"], ["stars-grid", 58, 50, 11, "#000000"], "island", "Two black stars in the yellow middle stripe stand for the country's two main islands!"],
    ["sc", "Seychelles", "Africa", "Victoria", 459, "107K", "seychelles", ["#003F87", "#FCD856", "#D62828", "#FFFFFF", "#007A3D"], null, "archipelago", "Five colorful diagonal beams radiate out from the bottom-left corner like rays of energy!"],

    // ================= OCEANIA (14) =================
    ["au", "Australia", "Oceania", "Canberra", 7692024, "26.6M", "uk-ensign", ["#00008B", "#FFFFFF", "#FF0000"], ["southern-cross", 72, 52, 24, "#FFFFFF"], "australia", "Features the Southern Cross constellation of stars that shines in the southern sky!"],
    ["pg", "Papua New Guinea", "Oceania", "Port Moresby", 462840, "10.3M", "split-diag", ["#CE1126", "#000000"], ["southern-cross", 26, 68, 16, "#FFFFFF"], "island", "Divided diagonally into red and black with a golden Raggiana Bird-of-Paradise and Southern Cross!"],
    ["nz", "New Zealand", "Oceania", "Wellington", 268021, "5.2M", "uk-ensign", ["#00247D", "#CC142B", "#FFFFFF"], ["southern-cross", 74, 52, 22, "#CC142B"], "nz", "Has four red stars with white borders representing the Southern Cross constellation!"],
    ["sb", "Solomon Islands", "Oceania", "Honiara", 28896, "740K", "diagonal", ["#0051BA", "#215B33", "#FCD116", "#FCD116"], ["stars-grid", 18, 25, 12, "#FFFFFF"], "archipelago", "A yellow diagonal stripe divides blue water and green land with five white stars!"],
    ["fj", "Fiji", "Oceania", "Suva", 18272, "936K", "uk-ensign", ["#68BFE5", "#FFFFFF", "#CE1126"], ["shield", 74, 50, 15, "#FFFFFF"], "archipelago", "Uses a distinctive Pacific sky-blue background with the Fijian shield on the right!"],
    ["vu", "Vanuatu", "Oceania", "Port Vila", 12189, "334K", "y-pall", ["#D21034", "#009543", "#000000", "#FDCE12"], ["circle-crest", 16, 50, 10, "#FDCE12"], "archipelago", "A black and gold 'Y' pattern represents the shape of the Vanuatu island chain!"],
    ["ws", "Samoa", "Oceania", "Apia", 2842, "225K", "canton", ["#CE1126", "#CE1126", "#002B7F"], ["southern-cross", 21, 25, 13, "#FFFFFF"], "island", "Red flag with a deep blue rectangle in the corner holding the five stars of the Southern Cross!"],
    ["ki", "Kiribati", "Oceania", "Tarawa", 811, "133K", "h2", ["#CE1126", "#003F87"], ["sun", 50, 46, 18, "#FCD116"], "archipelago", "Shows a golden frigatebird flying over a rising sun and blue-and-white ocean waves!"],
    ["to", "Tonga", "Oceania", "Nuku'alofa", 747, "107K", "canton", ["#C10000", "#C10000", "#FFFFFF"], ["swiss-cross", 20, 25, 12, "#C10000"], "archipelago", "Bright red flag with a white corner box holding a bold red cross!"],
    ["fm", "Micronesia", "Oceania", "Palikir", 702, "115K", "solid", ["#75B2DD", "#FFFFFF"], ["stars-grid", 50, 50, 18, "#FFFFFF"], "archipelago", "Pacific light blue with four white stars arranged like the points of a compass!"],
    ["pw", "Palau", "Oceania", "Ngerulmud", 459, "18K", "solid", ["#4AADD6", "#FFDE00"], ["circle", 44, 50, 25, "#FFDE00"], "island", "Looks like Japan's flag in ocean colors—a golden full moon shining over the blue Pacific!"],
    ["mh", "Marshall Islands", "Oceania", "Majuro", 181, "42K", "diagonal", ["#003893", "#003893", "#DD7500", "#FFFFFF"], ["sun", 22, 32, 14, "#FFFFFF"], "archipelago", "Orange and white diagonal rays expand across deep blue beside a 24-point white star!"],
    ["tv", "Tuvalu", "Oceania", "Funafuti", 26, "11.4K", "uk-ensign", ["#5B97B1", "#FCD116", "#CE1126"], ["stars-grid", 72, 55, 18, "#FCD116"], "archipelago", "Nine golden stars on sky blue arranged in the exact map positions of Tuvalu's nine coral atolls!"],
    ["nr", "Nauru", "Oceania", "Yaren", 21, "12.7K", "h3-fim", ["#002B7F", "#FFC61E", "#002B7F"], ["star", 25, 72, 11, "#FFFFFF"], "island", "A yellow Equator line across deep blue with a 12-pointed white star just south of the Equator!"]
  ];

  // Distinctive SVG Country Outline Templates (100x100 bounding box)
  const OUTLINE_PATHS = {
    usa: "M 10,28 L 35,26 L 62,27 L 82,22 L 92,18 L 95,28 L 88,42 L 85,56 L 78,72 L 73,82 L 68,72 L 52,70 L 45,84 L 36,72 L 20,66 L 8,52 L 6,36 Z",
    canada: "M 8,32 L 22,14 L 48,10 L 72,8 L 90,24 L 94,48 L 84,68 L 76,78 L 62,74 L 40,72 L 15,68 L 6,48 Z",
    mexico: "M 12,18 L 42,20 L 58,42 L 74,64 L 92,62 L 88,76 L 72,86 L 52,78 L 34,54 L 18,38 L 12,26 Z",
    brazil: "M 32,12 L 58,10 L 82,24 L 92,38 L 84,60 L 66,82 L 52,94 L 44,78 L 36,60 L 14,44 L 18,24 Z",
    argentina: "M 42,8 L 64,12 L 72,28 L 62,48 L 54,72 L 48,94 L 36,88 L 34,58 L 36,28 Z",
    uk: "M 44,10 L 60,14 L 58,34 L 68,54 L 74,76 L 60,88 L 34,88 L 38,68 L 32,48 L 38,26 Z",
    france: "M 46,10 L 72,18 L 88,36 L 78,66 L 74,84 L 46,88 L 24,78 L 28,46 L 16,32 Z",
    germany: "M 42,10 L 64,14 L 78,32 L 72,56 L 76,78 L 58,90 L 32,86 L 24,62 L 26,34 Z",
    italy: "M 24,10 L 52,8 L 58,24 L 66,48 L 86,70 L 78,82 L 66,72 L 58,88 L 44,92 L 48,68 L 34,42 L 20,24 Z",
    spain: "M 14,18 L 62,16 L 90,26 L 84,54 L 68,78 L 36,88 L 24,72 L 26,38 L 12,32 Z",
    sweden: "M 54,8 L 68,14 L 62,38 L 58,66 L 48,92 L 36,90 L 38,58 L 44,28 Z",
    switzerland: "M 22,36 L 52,22 L 84,32 L 90,54 L 72,74 L 42,78 L 14,66 L 12,48 Z",
    ukraine: "M 18,28 L 52,18 L 86,28 L 94,48 L 76,72 L 54,82 L 36,68 L 12,56 L 10,38 Z",
    russia: "M 6,36 L 24,22 L 54,18 L 82,20 L 96,32 L 92,54 L 78,66 L 52,68 L 26,64 L 8,54 Z",
    japan: "M 68,12 L 82,18 L 76,36 L 68,58 L 52,74 L 32,88 L 22,82 L 36,64 L 54,48 L 62,28 Z",
    korea: "M 36,14 L 68,20 L 76,46 L 72,78 L 48,88 L 28,80 L 26,48 Z",
    china: "M 14,34 L 38,24 L 66,28 L 86,14 L 92,34 L 84,58 L 72,78 L 48,82 L 24,66 L 10,50 Z",
    india: "M 38,8 L 56,14 L 66,32 L 86,36 L 72,56 L 56,82 L 48,94 L 38,76 L 26,52 L 18,38 L 32,24 Z",
    indonesia: "M 8,42 L 28,46 L 48,38 L 68,42 L 92,48 L 90,64 L 64,66 L 36,64 L 12,56 Z",
    turkey: "M 10,36 L 44,32 L 86,34 L 92,52 L 84,66 L 46,68 L 14,64 L 8,48 Z",
    australia: "M 14,38 L 36,22 L 58,24 L 66,14 L 84,32 L 90,56 L 78,80 L 58,76 L 38,72 L 16,74 L 10,54 Z",
    nz: "M 64,12 L 76,26 L 68,48 L 54,66 L 38,88 L 26,82 L 42,60 L 58,38 Z",
    "south-africa": "M 18,32 L 46,24 L 78,26 L 88,46 L 76,74 L 46,86 L 24,82 L 14,56 Z",
    egypt: "M 16,18 L 72,18 L 84,34 L 86,84 L 20,84 L 16,52 Z",
    nigeria: "M 16,24 L 54,18 L 86,24 L 84,56 L 62,84 L 38,82 L 16,66 Z",
    kenya: "M 24,14 L 68,16 L 84,42 L 72,82 L 46,88 L 24,62 Z",
    algeria: "M 28,10 L 66,10 L 88,42 L 72,86 L 44,90 L 14,56 L 20,28 Z",
    iceland: "M 14,34 L 44,20 L 84,26 L 90,54 L 74,76 L 34,78 L 12,60 Z",
    greece: "M 26,14 L 74,16 L 68,38 L 58,64 L 66,86 L 40,90 L 28,66 L 22,38 Z",
    compact: "M 22,20 L 54,14 L 82,24 L 88,52 L 76,80 L 46,86 L 18,74 L 14,44 Z",
    "elongated-ns": "M 38,8 L 62,12 L 68,38 L 64,68 L 54,92 L 36,88 L 32,58 L 34,28 Z",
    "elongated-ew": "M 8,36 L 38,26 L 72,28 L 92,42 L 86,64 L 54,72 L 22,68 L 6,52 Z",
    island: "M 32,22 L 66,18 L 82,42 L 72,74 L 42,82 L 20,64 L 22,38 Z",
    archipelago: "M 16,32 L 38,24 L 44,42 L 26,52 Z M 52,22 L 78,28 L 84,52 L 62,58 Z M 34,64 L 66,66 L 72,84 L 42,86 Z",
    coastal: "M 18,18 L 68,14 L 86,36 L 74,56 L 56,64 L 44,86 L 22,78 L 14,46 Z",
    peninsula: "M 36,12 L 64,14 L 72,46 L 62,84 L 42,86 L 30,52 Z"
  };

  function buildMorphLayers(layout, colors, emblemSpec) {
    const layers = [];
    const c0 = colors[0] || "#0055A4";
    const c1 = colors[1] || "#FFFFFF";
    const c2 = colors[2] || c0;
    const c3 = colors[3] || c1;
    const c4 = colors[4] || c0;

    if (layout === "h2") {
      layers.push({ type: "rect", x: 0, y: 0, w: 100, h: 50, color: c0 });
      layers.push({ type: "rect", x: 0, y: 50, w: 100, h: 50, color: c1 });
    } else if (layout === "h3") {
      layers.push({ type: "rect", x: 0, y: 0, w: 100, h: 33.4, color: c0 });
      layers.push({ type: "rect", x: 0, y: 33.3, w: 100, h: 33.4, color: c1 });
      layers.push({ type: "rect", x: 0, y: 66.6, w: 100, h: 33.4, color: c2 });
    } else if (layout === "h3-wide") {
      layers.push({ type: "rect", x: 0, y: 0, w: 100, h: 25, color: c0 });
      layers.push({ type: "rect", x: 0, y: 25, w: 100, h: 50, color: c1 });
      layers.push({ type: "rect", x: 0, y: 75, w: 100, h: 25, color: c2 });
    } else if (layout === "h3-top") {
      layers.push({ type: "rect", x: 0, y: 0, w: 100, h: 50, color: c0 });
      layers.push({ type: "rect", x: 0, y: 50, w: 100, h: 25, color: c1 });
      layers.push({ type: "rect", x: 0, y: 75, w: 100, h: 25, color: c2 });
    } else if (layout === "h3-fim") {
      layers.push({ type: "rect", x: 0, y: 0, w: 100, h: 30, color: c0 });
      layers.push({ type: "rect", x: 0, y: 30, w: 100, h: 5, color: "#FFFFFF" });
      layers.push({ type: "rect", x: 0, y: 35, w: 100, h: 30, color: c1 });
      layers.push({ type: "rect", x: 0, y: 65, w: 100, h: 5, color: "#FFFFFF" });
      layers.push({ type: "rect", x: 0, y: 70, w: 100, h: 30, color: c2 });
    } else if (layout === "h4") {
      layers.push({ type: "rect", x: 0, y: 0, w: 100, h: 25, color: c0 });
      layers.push({ type: "rect", x: 0, y: 25, w: 100, h: 25, color: c1 });
      layers.push({ type: "rect", x: 0, y: 50, w: 100, h: 25, color: c2 });
      layers.push({ type: "rect", x: 0, y: 75, w: 100, h: 25, color: c3 });
    } else if (layout === "h5") {
      layers.push({ type: "rect", x: 0, y: 0, w: 100, h: 17, color: c0 });
      layers.push({ type: "rect", x: 0, y: 17, w: 100, h: 17, color: c1 });
      layers.push({ type: "rect", x: 0, y: 34, w: 100, h: 32, color: c2 });
      layers.push({ type: "rect", x: 0, y: 66, w: 100, h: 17, color: c3 });
      layers.push({ type: "rect", x: 0, y: 83, w: 100, h: 17, color: c4 });
    } else if (layout === "v2") {
      layers.push({ type: "rect", x: 0, y: 0, w: 50, h: 100, color: c0 });
      layers.push({ type: "rect", x: 50, y: 0, w: 50, h: 100, color: c1 });
    } else if (layout === "v2-benin") {
      layers.push({ type: "rect", x: 0, y: 0, w: 100, h: 50, color: c1 });
      layers.push({ type: "rect", x: 0, y: 50, w: 100, h: 50, color: c2 });
      layers.push({ type: "rect", x: 0, y: 0, w: 36, h: 100, color: c0 });
    } else if (layout === "v3") {
      layers.push({ type: "rect", x: 0, y: 0, w: 33.4, h: 100, color: c0 });
      layers.push({ type: "rect", x: 33.3, y: 0, w: 33.4, h: 100, color: c1 });
      layers.push({ type: "rect", x: 66.6, y: 0, w: 33.4, h: 100, color: c2 });
    } else if (layout === "v3-wide") {
      layers.push({ type: "rect", x: 0, y: 0, w: 25, h: 100, color: c0 });
      layers.push({ type: "rect", x: 25, y: 0, w: 50, h: 100, color: c1 });
      layers.push({ type: "rect", x: 75, y: 0, w: 25, h: 100, color: c2 });
    } else if (layout === "stripes-canton") {
      const count = (emblemSpec && emblemSpec[5]) || 13;
      layers.push({ type: "stripes-h", count: count, color1: c0, color2: c1 });
      layers.push({ type: "rect", x: 0, y: 0, w: 42, h: 54, color: c2 });
    } else if (layout === "canton") {
      layers.push({ type: "rect", x: 0, y: 0, w: 100, h: 50, color: c0 });
      layers.push({ type: "rect", x: 0, y: 50, w: 100, h: 50, color: c1 });
      layers.push({ type: "rect", x: 0, y: 0, w: 38, h: 50, color: c2 });
    } else if (layout === "nordic") {
      layers.push({ type: "rect", x: 0, y: 0, w: 100, h: 100, color: c0 });
      if (colors.length >= 3) {
        layers.push({ type: "cross", x: 36, y: 50, thickness: 22, color: c1 });
        layers.push({ type: "cross", x: 36, y: 50, thickness: 11, color: c2 });
      } else {
        layers.push({ type: "cross", x: 36, y: 50, thickness: 18, color: c1 });
      }
    } else if (layout === "cross") {
      layers.push({ type: "rect", x: 0, y: 0, w: 100, h: 50, color: c0 });
      layers.push({ type: "rect", x: 0, y: 50, w: 100, h: 50, color: c1 });
      layers.push({ type: "cross", x: 50, y: 50, thickness: 18, color: c2 });
    } else if (layout === "uk") {
      layers.push({ type: "rect", x: 0, y: 0, w: 100, h: 100, color: c0 });
      layers.push({ type: "uk-saltire", color1: c1, color2: c2 });
      layers.push({ type: "cross", x: 50, y: 50, thickness: 24, color: c1 });
      layers.push({ type: "cross", x: 50, y: 50, thickness: 14, color: c2 });
    } else if (layout === "uk-ensign") {
      layers.push({ type: "rect", x: 0, y: 0, w: 100, h: 100, color: c0 });
      layers.push({ type: "rect", x: 0, y: 0, w: 45, h: 50, color: "#012169" });
      layers.push({ type: "emblem", shape: "swiss-cross", x: 22, y: 25, r: 22, color: "#FFFFFF" });
      layers.push({ type: "emblem", shape: "swiss-cross", x: 22, y: 25, r: 14, color: "#C8102E" });
    } else if (layout === "triangle") {
      const count = (emblemSpec && emblemSpec[5]) || 0;
      if (count > 0) {
        layers.push({ type: "stripes-h", count: count, color1: c0, color2: c1 });
      } else {
        layers.push({ type: "rect", x: 0, y: 0, w: 100, h: 33.4, color: c0 });
        layers.push({ type: "rect", x: 0, y: 33.3, w: 100, h: 33.4, color: c1 });
        layers.push({ type: "rect", x: 0, y: 66.6, w: 100, h: 33.4, color: c2 });
      }
      layers.push({ type: "hoist-triangle", color: c3 });
    } else if (layout === "diagonal") {
      layers.push({ type: "rect", x: 0, y: 0, w: 100, h: 50, color: c0 });
      layers.push({ type: "rect", x: 0, y: 50, w: 100, h: 50, color: c1 });
      layers.push({ type: "diag-band", color1: c2, color2: c3 });
    } else if (layout === "split-diag") {
      layers.push({ type: "rect", x: 0, y: 0, w: 100, h: 100, color: c0 });
      layers.push({ type: "split-diag-poly", color: c1 });
    } else if (layout === "saltire" || layout === "jamaica") {
      layers.push({ type: "rect", x: 0, y: 0, w: 100, h: 100, color: c0 });
      layers.push({ type: "jamaica-saltire", color1: c1, color2: c2 });
    } else if (layout === "seychelles") {
      layers.push({ type: "seychelles-rays", colors: colors });
    } else if (layout === "y-pall") {
      layers.push({ type: "rect", x: 0, y: 0, w: 100, h: 50, color: c0 });
      layers.push({ type: "rect", x: 0, y: 50, w: 100, h: 50, color: c1 });
      layers.push({ type: "y-pall", color: c2, accent: c3 });
    } else if (layout === "diamond") {
      layers.push({ type: "rect", x: 0, y: 0, w: 100, h: 100, color: c0 });
      layers.push({ type: "diamond", x: 50, y: 50, w: 80, h: 72, color: c1 });
    } else if (layout === "qatar") {
      layers.push({ type: "rect", x: 0, y: 0, w: 32, h: 100, color: c0 });
      layers.push({ type: "rect", x: 32, y: 0, w: 68, h: 100, color: c1 });
      layers.push({ type: "serrated", color: c0 });
    } else if (layout === "nepal") {
      layers.push({ type: "rect", x: 0, y: 0, w: 100, h: 100, color: "#0f172a" });
      layers.push({ type: "nepal-pennant", color1: c0, color2: c1 });
      layers.push({ type: "emblem", shape: "crescent-star", x: 26, y: 30, r: 11, color: "#FFFFFF" });
    } else {
      // "solid"
      layers.push({ type: "rect", x: 0, y: 0, w: 100, h: 100, color: c0 });
    }

    if (emblemSpec) {
      layers.push({
        type: "emblem",
        shape: emblemSpec[0],
        x: emblemSpec[1],
        y: emblemSpec[2],
        r: emblemSpec[3],
        color: emblemSpec[4]
      });
    }

    return layers;
  }

  window.COUNTRIES_DATA = RAW_COUNTRIES.map((row) => {
    const [id, name, continent, capital, areaKm2, population, layout, colors, emblemSpec, shapeType, funFact] = row;
    return {
      id: id.toLowerCase(),
      name,
      continent,
      capital,
      areaKm2,
      population,
      funFact,
      colors,
      morphLayers: buildMorphLayers(layout, colors, emblemSpec),
      outlinePath: OUTLINE_PATHS[shapeType] || OUTLINE_PATHS.compact
    };
  });
})();
