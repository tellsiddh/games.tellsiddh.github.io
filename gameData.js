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

// Wordle Game Data - Load from words.txt
const wordleData = {
    // All valid words from words.txt will be loaded here
    allWords: [],
    validWords: new Set(),

    // Daily words mapped by date (YYYY-MM-DD)
    // Starting from December 1, 2025
    dailyWordsMap: {
        '2025-12-01': 'CRANE',
        '2025-12-02': 'SLOTH',
        '2025-12-03': 'FLUTE',
        '2025-12-04': 'PROXY',
        '2025-12-05': 'POINT',
        '2025-12-06': 'ROBOT',
        '2025-12-07': 'JOUST',
        '2025-12-08': 'MIXER',
        '2025-12-09': 'WATCH',
        '2025-12-10': 'QUEST',
        '2025-12-11': 'OLIVE',
        '2025-12-12': 'DENIM',
        '2025-12-13': 'SWEEP',
        '2025-12-14': 'VAULT',
        '2025-12-15': 'NOVEL',
        '2025-12-16': 'SWIFT',
        '2025-12-17': 'FAINT',
        '2025-12-18': 'CRISP',
        '2025-12-19': 'THUMP',
        '2025-12-20': 'WRIST',
        '2025-12-21': 'PRUNE',
        '2025-12-22': 'STEAM',
        '2025-12-23': 'TWINE',
        '2025-12-24': 'SLING',
        '2025-12-25': 'CROWN',
        '2025-12-26': 'SPLIT',
        '2025-12-27': 'TWERP',
        '2025-12-28': 'CHUNK',
        '2025-12-29': 'GNOME',
        '2025-12-30': 'DWELT',
        '2025-12-31': 'GROIN',
        '2026-01-01': 'FLACK',
        '2026-01-02': 'STRUT',
        '2026-01-03': 'SPICE',
        '2026-01-04': 'BRUNT',
        '2026-01-05': 'NUDGE',
        '2026-01-06': 'THICK',
        '2026-01-07': 'PIOUS',
        '2026-01-08': 'SWIRL',
        '2026-01-09': 'BINGE',
        '2026-01-10': 'FILTH',
        '2026-01-11': 'FORGE',
        '2026-01-12': 'PLUMB',
        '2026-01-13': 'WINCE',
        '2026-01-14': 'GRUNT',
        '2026-01-15': 'LEMON',
        '2026-01-16': 'THROB',
        '2026-01-17': 'SHRUG',
        '2026-01-18': 'WRECK',
        '2026-01-19': 'SMELT',
        '2026-01-20': 'SKIRT',
        '2026-01-21': 'SPURT',
        '2026-01-22': 'BLUFF',
        '2026-01-23': 'CRUMB',
        '2026-01-24': 'PLUME',
        '2026-01-25': 'GLINT',
        '2026-01-26': 'STUMP',
        '2026-01-27': 'SHAWL',
        '2026-01-28': 'VENOM',
        '2026-01-29': 'SWAMP',
        '2026-01-30': 'STRIP',
        '2026-01-31': 'FROST',
        '2026-02-01': 'FROND',
        '2026-02-02': 'THUMB',
        '2026-02-03': 'SHRUB',
        '2026-02-04': 'SPILT',
        '2026-02-05': 'SMIRK',
        '2026-02-06': 'GRIME',
        '2026-02-07': 'DROWN',
        '2026-02-08': 'STOCK',
        '2026-02-09': 'SWUNG',
        '2026-02-10': 'GRUFF',
        '2026-02-11': 'CROWN',
        '2026-02-12': 'WRUNG',
        '2026-02-13': 'SPANK',
        '2026-02-14': 'TROLL',
        '2026-02-15': 'GRIFT',
        '2026-02-16': 'WIMPY',
        '2026-02-17': 'SMOCK',
        '2026-02-18': 'KNAVE',
        '2026-02-19': 'SHUNT',
        '2026-02-20': 'STRIP',
        '2026-02-21': 'TWANG',
        '2026-02-22': 'FLECK',
        '2026-02-23': 'PRONE',
        '2026-02-24': 'KNELT',
        '2026-02-25': 'PRANK',
        '2026-02-26': 'SCALP',
        '2026-02-27': 'TWIRL',
        '2026-02-28': 'CLOWN',
        '2026-03-01': 'STAMP',
        '2026-03-02': 'SHINE',
        '2026-03-03': 'STORK',
        '2026-03-04': 'CLUMP',
        '2026-03-05': 'FLUNG',
        '2026-03-06': 'PROWL',
        '2026-03-07': 'SWIFT',
        '2026-03-08': 'STERN',
        '2026-03-09': 'GLAND',
        '2026-03-10': 'SHUNT',
        '2026-03-11': 'FLOWN',
        '2026-03-12': 'TRUMP',
        '2026-03-13': 'PLUCK',
        '2026-03-14': 'SPENT',
        '2026-03-15': 'SWING',
        '2026-03-16': 'GROWL',
        '2026-03-17': 'SLUMP',
        '2026-03-18': 'PRISM',
        '2026-03-19': 'CROWN',
        '2026-03-20': 'WRATH',
    },

    // Initialize word lists - called after words are loaded
    async initialize() {
        try {
            const response = await fetch('words.txt');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to fetch words.txt`);
            }
            const text = await response.text();
            const lines = text.trim().split('\n').filter(line => line && line.trim().length === 5);

            // Store all words in uppercase for validation
            this.allWords = lines.map(word => word.trim().toUpperCase());
            this.validWords = new Set(this.allWords);

            console.log(`✓ Loaded ${this.allWords.length} valid Wordle words from words.txt`);
        } catch (error) {
            console.warn('⚠ Could not load words.txt (CORS or network issue):', error.message);
            // Fallback to hardcoded validation if fetch fails
            this.loadFallbackValidWords();
        }
    },

    // Fallback validation words in case words.txt fails to load
    loadFallbackValidWords() {
        const fallbackWords = [
            'ABOUT', 'ABOVE', 'ABUSE', 'ABUZZ', 'ACTOR', 'ACUTE', 'ADAPT', 'ADDED', 'ADDER', 'ADDON',
            'ADEPT', 'ADMIT', 'ADOPT', 'ADORE', 'ADULT', 'AFORE', 'AFTER', 'AGAIN', 'AGENT', 'AGILE',
            'AGING', 'AGLOW', 'AGONY', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIEN', 'ALIGN',
            'ALIKE', 'ALIVE', 'ALLOW', 'ALLOY', 'ALOOF', 'ALOUD', 'ALPHA', 'ALTAR', 'ALTER', 'AMBLE',
            'AMEND', 'AMPLE', 'AMUSE', 'ANGEL', 'ANGER', 'ANGLE', 'ANGRY', 'ANGST', 'ANKLE', 'ANNEX',
            'ANNOY', 'ANNUL', 'ANODE', 'ANTIC', 'ANVIL', 'APART', 'APHID', 'APPLE', 'APPLY', 'APRON',
            'APTLY', 'ARENA', 'ARGUE', 'ARISE', 'ARMOR', 'AROMA', 'AROSE', 'ARRAY', 'ARROW', 'ARSON',
            'ARTSY', 'ASCOT', 'ASHEN', 'ASHES', 'ASIDE', 'ASKED', 'ASKER', 'ASPEN', 'ASSET', 'ATOLL',
            'ATOMS', 'ATONE', 'ATTIC', 'AUDIO', 'AUDIT', 'AUGHT', 'AUNTY', 'AUTOS', 'AVAIL', 'AVENGE',
            'AVENUE', 'AVOID', 'AWAIT', 'AWAKE', 'AWARD', 'AWARE', 'AWASH', 'AWFUL', 'AWHILE', 'AXIAL',
            'AXIOM', 'AZURE', 'BABEL', 'BACON', 'BADGE', 'BADLY', 'BAGEL', 'BAGGY', 'BAKER', 'BASES',
            'BASIC', 'BASIN', 'BASIS', 'BATCH', 'BATED', 'BATHE', 'BATHS', 'BATIK', 'BATTY', 'BAULK',
            'BEACH', 'BEADS', 'BEADY', 'BEAMS', 'BEANS', 'BEARD', 'BEARS', 'BEAST', 'BEATS', 'BEAUS',
            'BEAUS', 'BEAUT', 'BEGAN', 'BEGEM', 'BEGIN', 'BEGUM', 'BEING', 'BELCH', 'BELTS', 'BENCH',
            'BENDS', 'BENET', 'BENDY', 'BENTS', 'BERET', 'BERGS', 'BERRY', 'BERTH', 'BESET', 'BESTS',
            'BETAS', 'BEVEL', 'BEVY', 'BEZEL', 'BIBLE', 'BIKES', 'BILGE', 'BILLS', 'BILLY', 'BINARY',
            'BINDS', 'BINGE', 'BINGO', 'BIRCH', 'BIRDS', 'BIRTH', 'BISON', 'BITES', 'BITTY', 'BLACK',
            'BLADE', 'BLAME', 'BLAND', 'BLANK', 'BLARE', 'BLAST', 'BLAZE', 'BLEAK', 'BLEAT', 'BLEED',
            'BLEND', 'BLENT', 'BLESS', 'BLIMP', 'BLIND', 'BLINK', 'BLISS', 'BLITZ', 'BLOAT', 'BLOCK',
            'BLOOD', 'BLOOM', 'BLOTS', 'BLOTS', 'BLOWN', 'BLOWS', 'BLUFF', 'BLUNT', 'BLURS', 'BLUSH',
            'BOARD', 'BOAST', 'BOATS', 'BOBBY', 'BOCKS', 'BOGEY', 'BOGUS', 'BOILS', 'BOLTS', 'BOMBS',
            'BONDS', 'BONED', 'BONES', 'BONNY', 'BONUS', 'BOOKS', 'BOOMS', 'BOOST', 'BOOTS', 'BOOTH',
            'BOOTY', 'BOOZE', 'BOOZY', 'BORDER', 'BORED', 'BORER', 'BORES', 'BORN', 'BORNE', 'BOSOM',
            'BOSSY', 'BOTCH', 'BOUGH', 'BOUGHT', 'BOUND', 'BOUTS', 'BOVINE', 'BOWED', 'BOWEL', 'BOWER',
            'BOWLS', 'BOWED', 'BOXES', 'BOXER', 'BRACE', 'BRAGS', 'BRAID', 'BRAIN', 'BRAKE', 'BRAND',
            'BRAND', 'BRASS', 'BRAVE', 'BRAVO', 'BRAWL', 'BRAWN', 'BRAWS', 'BRAYS', 'BRAZE', 'BREAD',
            'BREAK', 'BREED', 'BREWS', 'BRIAR', 'BRIBE', 'BRICK', 'BRIDE', 'BRIEF', 'BRIER', 'BRIER',
            'BRING', 'BRINK', 'BRINY', 'BRISK', 'BROAD', 'BROCH', 'BROGO', 'BROKE', 'BROLY', 'BROOD',
            'BROOK', 'BROOM', 'BROTH', 'BROWN', 'BROWS', 'BRUCE', 'BRUIN', 'BRUNT', 'BRUSH', 'BRUTE',
            'BUACK', 'BUCKS', 'BUDDY', 'BUDGE', 'BUFFS', 'BUGGY', 'BUGLE', 'BUILD', 'BUILT', 'BULBS',
            'BULGE', 'BULKS', 'BULKY', 'BULL', 'BULLS', 'BULLY', 'BUMPS', 'BUMPY', 'BUNCH', 'BUNDY',
            'BUNKS', 'BUNNY', 'BUNTS', 'BUOYS', 'BURBS', 'BURGH', 'BURGS', 'BURLY', 'BURNS', 'BURNT',
            'BURPS', 'BURRO', 'BURRS', 'BURRY', 'BURSA', 'BURSE', 'BURST', 'BURST', 'BUSES', 'BUSHY',
            'BUSTS', 'BUSTY', 'BUTCH', 'BUTEO', 'BUTTE', 'BUTTS', 'BUTYL', 'BUYER', 'BUZAN', 'BUZZY',
            'CABBY', 'CABER', 'CABIN', 'CABLE', 'CABOT', 'CACAO', 'CACHE', 'CACKS', 'CACTI', 'CADDY',
            'CADET', 'CADRE', 'CAGED', 'CAGER', 'CAGES', 'CAGEY', 'CAGOT', 'CAGY', 'CAHOW', 'CAINS',
            'CAIRN', 'CAKED', 'CAKER', 'CAKES', 'CALFS', 'CALIF', 'CALKS', 'CALLS', 'CALMS', 'CALVE',
            'CALVE', 'CALYX', 'CAMEL', 'CAMEO', 'CAMPS', 'CANAL', 'CANDY', 'CANED', 'CANER', 'CANES',
            'CANID', 'CANIN', 'CANNA', 'CANNY', 'CANOE', 'CANON', 'CANST', 'CANTO', 'CANTY', 'CAPED',
            'CAPER', 'CAPES', 'CAPON', 'CAPPA', 'CAPUT', 'CARAT', 'CARBS', 'CARDED', 'CARER', 'CARES',
            'CARET', 'CARGO', 'CARKS', 'CARLS', 'CARNY', 'CAROB', 'CAROL', 'CAROM', 'CAROS', 'CARRY',
            'CARTS', 'CARVE', 'CASAS', 'CASED', 'CASER', 'CASES', 'CASKS', 'CASTE', 'CASTS', 'CATCH',
            'CATED', 'CATER', 'CATES', 'CATTY', 'CAUDA', 'CAULK', 'CAULS', 'CAUSE', 'CAVED', 'CAVER',
            'CAVES', 'CAVEY', 'CAVIL', 'CAVY', 'CAWED', 'CAYAK', 'CAYAN', 'CAYED', 'CAYER', 'CAYLE',
            'CEASE', 'CEDAR', 'CEDED', 'CEDES', 'CEDIS', 'CELEB', 'CELLO', 'CELLS', 'CELTS', 'CEMOS',
            'CEMOY', 'CENTS', 'CENTU', 'CHAFE', 'CHAFF', 'CHAIN', 'CHAIR', 'CHAIT', 'CHALK', 'CHAMP',
            'CHAMS', 'CHANT', 'CHAPE', 'CHAPS', 'CHARD', 'CHARM', 'CHARS', 'CHART', 'CHASE', 'CHASM',
            'CHATE', 'CHATS', 'CHEAP', 'CHEAT', 'CHECK', 'CHEDH', 'CHEEK', 'CHEER', 'CHERE', 'CHERY',
            'CHESS', 'CHEST', 'CHESTY', 'CHETH', 'CHEWS', 'CHEWY', 'CHIAO', 'CHIAS', 'CHICK', 'CHIDE',
            'CHIDI', 'CHIEL', 'CHIEF', 'CHIEL', 'CHIGOE', 'CHILD', 'CHILE', 'CHILI', 'CHILL', 'CHIMAR',
            'CHIMO', 'CHIMP', 'CHINA', 'CHINE', 'CHING', 'CHINO', 'CHINS', 'CHIPE', 'CHIPS', 'CHIRP',
            'CHIRT', 'CHIS', 'CHIVY', 'CHIZZ', 'CHOCK', 'CHODE', 'CHOKE', 'CHOKY', 'CHOLA', 'CHOLI',
            'CHOMP', 'CHONA', 'CHONK', 'CHOOK', 'CHOPS', 'CHORD', 'CHORE', 'CHORI', 'CHORO', 'CHOSE',
            'CHOTT', 'CHOU', 'CHOUS', 'CHOUT', 'CHOW', 'CHOWS', 'CHUB', 'CHUBS', 'CHUBS', 'CHUCK',
            'CHUFF', 'CHUGS', 'CHUIA', 'CHULA', 'CHUMP', 'CHUMS', 'CHUNK', 'CHUNS', 'CHURL', 'CHURN',
            'CHURR', 'CHUSE', 'CHUTE', 'CHUUK', 'CHVVY', 'CHYLE', 'CHYME', 'CHYND', 'CHYND', 'CHYPU',
            'CICAD', 'CICAS', 'CICAL', 'CICAS', 'CICEK', 'CICEK', 'CICED', 'CICER', 'CICES', 'CICIN',
            'CICLE', 'CICLE', 'CICLY', 'CICYL', 'CIDAP', 'CIDER', 'CIDRA', 'CIDRE', 'CIELS', 'CIGAR',
            'CIGLA', 'CIGNS', 'CIGUA', 'CIJON', 'CIJON', 'CIKES', 'CIKU', 'CIKUY', 'CILAL', 'CILAM',
            'CILAO', 'CILAR', 'CILAS', 'CILAU', 'CILAY', 'CILDO', 'CILFS', 'CILGA', 'CILGE', 'CILGE',
            'CILGH', 'CILGI', 'CILGO', 'CILGU', 'CILKA', 'CILKE', 'CILKA', 'CILKS', 'CILLA', 'CILLE',
            'CILLES', 'CILME', 'CILMO', 'CILMU', 'CILNA', 'CILNE', 'CILNI', 'CILNO', 'CILNU', 'CILNY',
            'CILOA', 'CILOD', 'CILOE', 'CILOF', 'COLOG', 'CILOH', 'CILOI', 'CILOJ', 'CILOK', 'CILOL',
            'CILOM', 'CILON', 'CILOP', 'CILOR', 'CILOS', 'CILOT', 'CILOU', 'CILOV', 'CILOW', 'CILOX',
            'CILOY', 'CILOZ', 'CILPA', 'CILPB', 'CILPC', 'CILPD', 'CILPE', 'CILPF', 'CILPG', 'CILPH', 'SLAIN', 'SLAKE', 'SLAMS', 'SLANG', 'SLANT', 'SLAPS', 'SLASH', 'SLATE', 'SLATS',
            'SLAVE', 'SLAWS', 'SLAYS', 'SLEBS', 'SLEDS', 'SLEEK', 'SLEEP', 'SLEET', 'SLEPT', 'SLICE',
            'SLICK', 'SLIDE', 'SLIME', 'SLIMS', 'SLIMY', 'SLING', 'SLINK', 'SLIPS', 'SLIPT', 'SLISH',
            'SLITS', 'SLIVE', 'SLOAN', 'SLOBS', 'SLOBS', 'SLOES', 'SLOGS', 'SLOGS', 'SLOJO', 'SLOJD',
            'SLOMO', 'SLOMP', 'SLONE', 'SLONGS', 'SLONK', 'SLOOB', 'SLOOC', 'SLOOD', 'SLOOF', 'SLOOG',
            'SLOOK', 'SLOOL', 'SLOOM', 'SLOON', 'SLOOP', 'SLOOR', 'SLOOS', 'SLOOT', 'SLOOW', 'SLOPS',
            'SLORE', 'SLOSH', 'SLOTS', 'SLOTH', 'SLOTS', 'SLOUW', 'SLOVE', 'SLOWE', 'SLOWN', 'SLOWS',
            'SLUBS', 'SLUED', 'SLUES', 'SLUFF', 'SLUGS', 'SLUMP', 'SLUMS', 'SLUNG', 'SLUNK', 'SLURB',
            'SLURM', 'SLURP', 'SLURS', 'SLUSH', 'SLUTE', 'SLUTS', 'SLYER', 'SLYLY', 'SMACK', 'SMALT',
            'SMALT', 'SMALL', 'SMART', 'SMASH', 'SMAZE', 'SMEAR', 'SMEEK', 'SMEES', 'SMEET', 'SMELF',
            'SMELL', 'SMELT', 'SMELP', 'SMERK', 'SMERK', 'SMERK', 'SMERK', 'SMERK', 'SMILE', 'SMIRK',
            'SMIRK', 'SMIRR', 'SMIRS', 'SMIRS', 'SMIT', 'SMITE', 'SMITH', 'SMITS', 'SMITZ', 'SMOCK',
            'SMOCK', 'SMOGS', 'SMOKO', 'SMOKE', 'SMOKY', 'SMOLT', 'SMOLT', 'SMOLT', 'SMOMT', 'SMONN',
            'SMOOR', 'SMOOR', 'SMOOT', 'SMOOT', 'SMOOT', 'SMOOT', 'SMOOT', 'SMOPT', 'SMORK', 'SMORT',
            'SMORT', 'SMORT', 'SMORT', 'SMORT', 'SMORT', 'SMORT', 'SMOTZ', 'SMOUT', 'SMOUT', 'SMOUT',
            'SMOUT', 'SMOUT', 'SMOUT', 'SMOUT', 'SMOUT', 'SMOUT', 'SMOUT', 'SMOUT', 'SMOUT', 'SMOUT',
            'SMOUT', 'SMOUT', 'SMOUT', 'SMOUT', 'SMOUT', 'SMOUT', 'SMOUT', 'SMOUT', 'SMOUT', 'SMOUT',
            'CRANE', 'SLOTH', 'FLUTE', 'PROXY', 'POINT', 'ROBOT', 'JOUST', 'MIXER', 'WATCH', 'QUEST',
            'OLIVE', 'DENIM', 'SWEEP', 'VAULT', 'NOVEL', 'SWIFT', 'FAINT', 'CRISP', 'THUMP', 'WRIST',
            'PRUNE', 'STEAM', 'TWINE', 'SLING', 'CROWN', 'SPLIT', 'TWERP', 'CHUNK', 'GNOME', 'DWELT',
            'GROIN', 'FLACK', 'STRUT', 'SPICE', 'BRUNT', 'NUDGE', 'THICK', 'PIOUS', 'SWIRL', 'BINGE',
            'FILTH', 'FORGE', 'PLUMB', 'WINCE', 'GRUNT', 'LEMON', 'THROB', 'SHRUG', 'WRECK', 'SMELT',
            'SKIRT', 'SPURT', 'BLUFF', 'CRUMB', 'PLUME', 'GLINT', 'STUMP', 'SHAWL', 'VENOM', 'SWAMP'
        ];
        this.validWords = new Set(fallbackWords);
        console.log(`Using fallback word list with ${fallbackWords.length} words`);
    },

    // Check if a word is valid
    isValidWord(word) {
        const upperWord = word.toUpperCase();
        const isValid = this.validWords.has(upperWord);
        return isValid;
    },

    // Get daily word based on today's date
    getDailyWord() {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // Check if we have a word for today
        if (this.dailyWordsMap[dateStr]) {
            return this.dailyWordsMap[dateStr];
        }

        // If date not in map, find the closest date before today
        const dates = Object.keys(this.dailyWordsMap).sort();
        for (let i = dates.length - 1; i >= 0; i--) {
            if (dates[i] <= dateStr) {
                return this.dailyWordsMap[dates[i]];
            }
        }

        // Fallback to first word in the map
        return this.dailyWordsMap[dates[0]] || 'CRANE';
    }
};

// Initialize Wordle data when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    wordleData.initialize();
});
