// Periodic Table Elements Data
// This file contains all the elements we'll use in our game

const elements = [
    { symbol: "H", name: "Hydrogen", frenchName: "Hydrogène", atomicNumber: 1, atomicWeight: 1.008, hint: "The lightest element" },
    { symbol: "He", name: "Helium", frenchName: "Hélium", atomicNumber: 2, atomicWeight: 4.003, hint: "Used in balloons" },
    { symbol: "Li", name: "Lithium", frenchName: "Lithium", atomicNumber: 3, atomicWeight: 6.941, hint: "Used in batteries" },
    { symbol: "Be", name: "Beryllium", frenchName: "Béryllium", atomicNumber: 4, atomicWeight: 9.012, hint: "Very lightweight metal" },
    { symbol: "B", name: "Boron", frenchName: "Bore", atomicNumber: 5, atomicWeight: 10.811, hint: "Used in glass making" },
    { symbol: "C", name: "Carbon", frenchName: "Carbone", atomicNumber: 6, atomicWeight: 12.011, hint: "Found in diamonds and graphite" },
    { symbol: "N", name: "Nitrogen", frenchName: "Azote", atomicNumber: 7, atomicWeight: 14.007, hint: "Makes up most of our atmosphere" },
    { symbol: "O", name: "Oxygen", frenchName: "Oxygène", atomicNumber: 8, atomicWeight: 15.999, hint: "Essential for breathing" },
    { symbol: "F", name: "Fluorine", frenchName: "Fluor", atomicNumber: 9, atomicWeight: 18.998, hint: "Used in toothpaste" },
    { symbol: "Ne", name: "Neon", frenchName: "Néon", atomicNumber: 10, atomicWeight: 20.180, hint: "Glows in bright signs" },
    { symbol: "Na", name: "Sodium", frenchName: "Sodium", atomicNumber: 11, atomicWeight: 22.990, hint: "Found in table salt" },
    { symbol: "Mg", name: "Magnesium", frenchName: "Magnésium", atomicNumber: 12, atomicWeight: 24.305, hint: "Burns with a bright white light" },
    { symbol: "Al", name: "Aluminum", frenchName: "Aluminium", atomicNumber: 13, atomicWeight: 26.982, hint: "Used to make cans" },
    { symbol: "Si", name: "Silicon", frenchName: "Silicium", atomicNumber: 14, atomicWeight: 28.086, hint: "Used in computer chips" },
    { symbol: "P", name: "Phosphorus", frenchName: "Phosphore", atomicNumber: 15, atomicWeight: 30.974, hint: "Glows in the dark" },
    { symbol: "S", name: "Sulfur", frenchName: "Soufre", atomicNumber: 16, atomicWeight: 32.065, hint: "Smells like rotten eggs" },
    { symbol: "Cl", name: "Chlorine", frenchName: "Chlore", atomicNumber: 17, atomicWeight: 35.453, hint: "Used to clean swimming pools" },
    { symbol: "Ar", name: "Argon", frenchName: "Argon", atomicNumber: 18, atomicWeight: 39.948, hint: "Noble gas used in light bulbs" },
    { symbol: "K", name: "Potassium", frenchName: "Potassium", atomicNumber: 19, atomicWeight: 39.098, hint: "Found in bananas" },
    { symbol: "Ca", name: "Calcium", frenchName: "Calcium", atomicNumber: 20, atomicWeight: 40.078, hint: "Strengthens bones and teeth" },
    { symbol: "Fe", name: "Iron", frenchName: "Fer", atomicNumber: 26, atomicWeight: 55.845, hint: "Magnetic metal, rusts easily" },
    { symbol: "Cu", name: "Copper", frenchName: "Cuivre", atomicNumber: 29, atomicWeight: 63.546, hint: "Reddish metal used in wires" },
    { symbol: "Zn", name: "Zinc", frenchName: "Zinc", atomicNumber: 30, atomicWeight: 65.38, hint: "Used to galvanize steel" },
    { symbol: "Ag", name: "Silver", frenchName: "Argent", atomicNumber: 47, atomicWeight: 107.868, hint: "Precious metal for jewelry" },
    { symbol: "Sn", name: "Tin", frenchName: "Étain", atomicNumber: 50, atomicWeight: 118.710, hint: "Used to make cans" },
    { symbol: "Au", name: "Gold", frenchName: "Or", atomicNumber: 79, atomicWeight: 196.967, hint: "Most precious metal" },
    { symbol: "Hg", name: "Mercury", frenchName: "Mercure", atomicNumber: 80, atomicWeight: 200.592, hint: "Liquid metal at room temperature" },
    { symbol: "Pb", name: "Lead", frenchName: "Plomb", atomicNumber: 82, atomicWeight: 207.2, hint: "Heavy metal, used in old pipes" },
    { symbol: "U", name: "Uranium", frenchName: "Uranium", atomicNumber: 92, atomicWeight: 238.029, hint: "Radioactive, used in nuclear power" }
];

// Function to get a random element
function getRandomElement() {
    const randomIndex = Math.floor(Math.random() * elements.length);
    return elements[randomIndex];
}

// Function to calculate Levenshtein distance (edit distance) between two strings
function levenshteinDistance(str1, str2) {
    const matrix = [];
    
    // Create matrix
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    // Fill matrix
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

// Function to check if an answer is correct (with flexibility for typos and French)
function checkAnswer(userAnswer, correctElement) {
    // Clean the user's answer
    const cleanUserAnswer = userAnswer.toLowerCase().trim();
    
    // Get possible correct answers
    const englishName = correctElement.name.toLowerCase();
    const frenchName = correctElement.frenchName.toLowerCase();
    
    // Check for exact matches first
    if (cleanUserAnswer === englishName || cleanUserAnswer === frenchName) {
        return true;
    }
    
    // Check for close matches (allow 1 character difference for words longer than 4 characters)
    const maxDistance = Math.max(1, Math.floor(englishName.length * 0.15)); // Allow 15% error rate, minimum 1
    
    if (levenshteinDistance(cleanUserAnswer, englishName) <= maxDistance) {
        return true;
    }
    
    if (levenshteinDistance(cleanUserAnswer, frenchName) <= maxDistance) {
        return true;
    }
    
    return false;
}

// Function to get element by symbol (useful for hints or additional features)
function getElementBySymbol(symbol) {
    return elements.find(element => element.symbol === symbol);
} 