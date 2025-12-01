// Game Data - Levels and Word Mazes
const gameData = {
    levels: [
        {
            id: 1,
            title: 'Level 1: Basic Connections',
            difficulty: 'Easy',
            description: 'Connect related words from start to finish',
            grid: [
                ['cat', 'lion', 'hunter', 'man', 'village'],
                ['cabs', 'car', 'safari', 'gun', 'movie'],
                ['mechanic', 'tyre', 'jeep', 'car', 'star'],
                ['repair', 'rubber', 'school', 'wheel', 'hollywood'],
                ['man', 'pencil', 'page', 'circle', 'box'],
                ['teacher', 'artist', 'paint', 'shape', 'pizza'],
                ['school', 'poor', 'house', 'kitchen', 'food'],
                ['exam', 'job', 'profession', 'doctor', 'apple'],
                ['fail', 'life', 'office', 'police', 'orange'],
                ['ant', 'bat', 'commute', 'subway', 'newyork']
            ],
            // correct path: cat -> lion -> hunter -> safari -> jeep -> car -> wheel -> circle -> box -> pizza -> food apple -> doctor -> profession -> office -> commute -> subway -> newyork
            path: [
                { row: 0, col: 0 }, // cat (start)
                { row: 0, col: 1 }, // lion
                { row: 0, col: 2 }, // hunter
                { row: 1, col: 2 }, // safari
                { row: 2, col: 2 }, // jeep
                { row: 2, col: 3 }, // car
                { row: 3, col: 3 }, // wheel
                { row: 4, col: 3 }, // circle
                { row: 4, col: 4 }, // box
                { row: 5, col: 4 }, // pizza
                { row: 6, col: 4 }, // food
                { row: 7, col: 4 }, // apple
                { row: 7, col: 3 }, // doctor
                { row: 7, col: 2 }, // profession
                { row: 8, col: 2 }, // office
                { row: 9, col: 2 }, // commute
                { row: 9, col: 3 }, // subway
                { row: 9, col: 4 }  // newyork (end)
            ],
            startWord: 'cat',
            endWord: 'newyork',
            startPos: { row: 0, col: 0 },
            endPos: { row: 9, col: 4 }
        },
        // {
        //     id: 2,
        //     title: 'Level 2: Deeper Connections',
        //     difficulty: 'Medium',
        //     description: 'Find the hidden path through more abstract connections',
        //     grid: [
        //         ['ocean', 'water', 'liquid', 'flow', 'river', 'stone', 'heavy', 'burden', 'weight', 'mass'],
        //         ['wave', 'beach', 'sand', 'desert', 'dry', 'thirsty', 'drink', 'glass', 'cup', 'handle'],
        //         ['blue', 'sky', 'cloud', 'white', 'snow', 'cold', 'freeze', 'ice', 'winter', 'season'],
        //         ['salt', 'taste', 'flavor', 'sweet', 'candy', 'sugar', 'spoon', 'fork', 'knife', 'blade'],
        //         ['tide', 'moon', 'night', 'dark', 'shadow', 'light', 'lamp', 'bright', 'shine', 'glow']
        //     ],
        //     path: [0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9],
        //     startWord: 'ocean',
        //     endWord: 'glow',
        //     startPos: { row: 0, col: 0 },
        //     endPos: { row: 4, col: 9 }
        // }
    ],

    // Check if two words are related - only the correct path is allowed
    areWordsRelated(word1, word2, currentPath = []) {
        // No validation - let users click any word
        // Path validation happens only when submitting the final path
        return true;
    }
};
