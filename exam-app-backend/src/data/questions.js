const examQuestions = {
  English: [
    {
      id: "eng1",
      question: "What is an oxymoron?",
      options: [
        "A figure of speech in which contradictory terms appear together",
        "A type of metaphor",
        "A rhetorical question",
        "A form of exaggeration"
      ],
      correctAnswer: "A figure of speech in which contradictory terms appear together"
    },
    {
      id: "eng2",
      question: "Which figure of speech involves exaggeration?",
      options: ["Hyperbole", "Litotes", "Metonymy", "Synecdoche"],
      correctAnswer: "Hyperbole"
    },
    {
      id: "eng3",
      question: "What does the word 'ubiquitous' mean?",
      options: ["Rare", "Found everywhere", "Ancient", "Modern"],
      correctAnswer: "Found everywhere"
    },
    {
      id: "eng4",
      question: "Which of the following is a synonym for 'happy'?",
      options: ["Melancholy", "Joyful", "Somber", "Tense"],
      correctAnswer: "Joyful"
    },
    {
      id: "eng5",
      question: "What is a simile?",
      options: [
        "A comparison using 'like' or 'as'",
        "An exaggeration",
        "A rhetorical question",
        "A statement with double meaning"
      ],
      correctAnswer: "A comparison using 'like' or 'as'"
    },
    {
      id: "eng6",
      question: "What is alliteration?",
      options: [
        "Repetition of initial consonant sounds",
        "Repetition of vowel sounds",
        "A sudden change in tone",
        "An unexpected twist"
      ],
      correctAnswer: "Repetition of initial consonant sounds"
    },
    {
      id: "eng7",
      question: "Identify the metaphor in the sentence: 'Time is a thief.'",
      options: [
        "It implies time steals moments from our lives",
        "It means time is unpredictable",
        "It suggests time is valuable",
        "There is no metaphor"
      ],
      correctAnswer: "It implies time steals moments from our lives"
    },
    {
      id: "eng8",
      question: "What is a hyperbole?",
      options: [
        "An extreme exaggeration",
        "A mild understatement",
        "A literal description",
        "A logical comparison"
      ],
      correctAnswer: "An extreme exaggeration"
    },
    {
      id: "eng9",
      question: "Which best describes irony?",
      options: [
        "A contrast between expectation and reality",
        "A direct comparison",
        "A pun",
        "A rhetorical question"
      ],
      correctAnswer: "A contrast between expectation and reality"
    },
    {
      id: "eng10",
      question: "What is onomatopoeia?",
      options: [
        "A word that imitates a sound",
        "A word with multiple meanings",
        "A compound word",
        "A formal term"
      ],
      correctAnswer: "A word that imitates a sound"
    }
  ],
  Maths: [
    {
      id: "math1",
      question: "What is the derivative of x^2?",
      options: ["2x", "x", "2", "x^2"],
      correctAnswer: "2x"
    },
    {
      id: "math2",
      question: "Solve for x: 2x + 3 = 7.",
      options: ["x = 1", "x = 2", "x = 3", "x = 4"],
      correctAnswer: "x = 2"
    },
    {
      id: "math3",
      question: "What is the area of a circle with radius r?",
      options: ["πr", "2πr", "πr^2", "2πr^2"],
      correctAnswer: "πr^2"
    },
    {
      id: "math4",
      question: "State the Pythagorean theorem.",
      options: ["a^2 + b^2 = c^2", "a + b = c", "a^2 - b^2 = c^2", "2a + 2b = c"],
      correctAnswer: "a^2 + b^2 = c^2"
    },
    {
      id: "math5",
      question: "Simplify: 2(3+4).",
      options: ["12", "14", "16", "10"],
      correctAnswer: "14"
    },
    {
      id: "math6",
      question: "What is the integral of 1/x dx?",
      options: ["ln|x|", "1/x", "x", "e^x"],
      correctAnswer: "ln|x|"
    },
    {
      id: "math7",
      question: "What is the value of sin(90°)?",
      options: ["0", "0.5", "1", "Undefined"],
      correctAnswer: "1"
    },
    {
      id: "math8",
      question: "Solve: x^2 - 5x + 6 = 0.",
      options: [
        "x = 2 and x = 3",
        "x = 1 and x = 6",
        "x = 2 and x = 4",
        "x = 3 and x = 4"
      ],
      correctAnswer: "x = 2 and x = 3"
    },
    {
      id: "math9",
      question: "What is the formula for the sum of an arithmetic series?",
      options: [
        "n/2*(first+last)",
        "n*(first+last)",
        "n/2*(first-last)",
        "first+last"
      ],
      correctAnswer: "n/2*(first+last)"
    },
    {
      id: "math10",
      question: "What is the slope of a line parallel to y = 3x + 2?",
      options: ["3", "-3", "0", "undefined"],
      correctAnswer: "3"
    }
  ],
  Chemistry: [
    {
      id: "chem1",
      question: "What is the atomic number of Oxygen?",
      options: ["6", "7", "8", "9"],
      correctAnswer: "8"
    },
    {
      id: "chem2",
      question: "What is the chemical formula for water?",
      options: ["H2O", "CO2", "O2", "NaCl"],
      correctAnswer: "H2O"
    },
    {
      id: "chem3",
      question: "What is the pH of pure water?",
      options: ["5", "7", "9", "3"],
      correctAnswer: "7"
    },
    {
      id: "chem4",
      question: "What is Avogadro's number?",
      options: ["6.022e23", "6.022e22", "3.1415", "9.81"],
      correctAnswer: "6.022e23"
    },
    {
      id: "chem5",
      question: "Which gas makes up the majority of Earth's atmosphere?",
      options: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"],
      correctAnswer: "Nitrogen"
    },
    {
      id: "chem6",
      question: "What type of bond involves the sharing of electrons?",
      options: ["Ionic", "Covalent", "Hydrogen", "Metallic"],
      correctAnswer: "Covalent"
    },
    {
      id: "chem7",
      question: "Which element is known for its high electronegativity?",
      options: ["Oxygen", "Fluorine", "Chlorine", "Nitrogen"],
      correctAnswer: "Fluorine"
    },
    {
      id: "chem8",
      question: "What is an isotope?",
      options: [
        "Atoms with the same number of protons but different number of neutrons",
        "Atoms with different protons",
        "A charged atom",
        "An atom with no electrons"
      ],
      correctAnswer: "Atoms with the same number of protons but different number of neutrons"
    },
    {
      id: "chem9",
      question: "What does the pH scale measure?",
      options: ["Acidity", "Temperature", "Pressure", "Density"],
      correctAnswer: "Acidity"
    },
    {
      id: "chem10",
      question: "Which element has the highest electronegativity?",
      options: ["Oxygen", "Fluorine", "Chlorine", "Neon"],
      correctAnswer: "Fluorine"
    }
  ],
  History: [
    {
      id: "hist1",
      question: "Who was the first President of the United States?",
      options: [
        "Abraham Lincoln",
        "George Washington",
        "Thomas Jefferson",
        "John Adams"
      ],
      correctAnswer: "George Washington"
    },
    {
      id: "hist2",
      question: "In which year did World War II end?",
      options: ["1940", "1945", "1950", "1939"],
      correctAnswer: "1945"
    },
    {
      id: "hist3",
      question: "Which empire built the Colosseum?",
      options: ["Greek", "Roman", "Ottoman", "Egyptian"],
      correctAnswer: "Roman"
    },
    {
      id: "hist4",
      question: "Who wrote the Communist Manifesto?",
      options: [
        "Karl Marx and Friedrich Engels",
        "Vladimir Lenin",
        "Adam Smith",
        "Mao Zedong"
      ],
      correctAnswer: "Karl Marx and Friedrich Engels"
    },
    {
      id: "hist5",
      question: "What ancient civilization built Machu Picchu?",
      options: ["Aztec", "Mayan", "Inca", "Olmec"],
      correctAnswer: "Inca"
    },
    {
      id: "hist6",
      question: "Who was known as the 'Maid of Orléans'?",
      options: [
        "Marie Antoinette",
        "Joan of Arc",
        "Catherine the Great",
        "Queen Elizabeth I"
      ],
      correctAnswer: "Joan of Arc"
    },
    {
      id: "hist7",
      question: "Which war was fought between the North and South regions in the United States?",
      options: [
        "World War I",
        "The Civil War",
        "The Revolutionary War",
        "The Vietnam War"
      ],
      correctAnswer: "The Civil War"
    },
    {
      id: "hist8",
      question: "What was the name of the ship that carried the Pilgrims to America in 1620?",
      options: ["Santa Maria", "Mayflower", "Endeavour", "Discovery"],
      correctAnswer: "Mayflower"
    },
    {
      id: "hist9",
      question: "Who was the British monarch during most of World War II?",
      options: [
        "Queen Elizabeth II",
        "King George VI",
        "Queen Victoria",
        "King Edward VIII"
      ],
      correctAnswer: "King George VI"
    },
    {
      id: "hist10",
      question: "Which ancient civilization is famous for its pyramids?",
      options: ["Mayan", "Roman", "Egyptian", "Inca"],
      correctAnswer: "Egyptian"
    }
  ],
  Biology: [
    {
      id: "bio1",
      question: "What is the powerhouse of the cell?",
      options: ["Nucleus", "Mitochondria", "Ribosome", "Chloroplast"],
      correctAnswer: "Mitochondria"
    },
    {
      id: "bio2",
      question: "What process do plants use to make food?",
      options: [
        "Respiration",
        "Photosynthesis",
        "Fermentation",
        "Digestion"
      ],
      correctAnswer: "Photosynthesis"
    },
    {
      id: "bio3",
      question: "What is the basic unit of life?",
      options: ["Atom", "Molecule", "Cell", "Organ"],
      correctAnswer: "Cell"
    },
    {
      id: "bio4",
      question: "Which molecule carries genetic information?",
      options: ["Protein", "Carbohydrate", "DNA", "Lipid"],
      correctAnswer: "DNA"
    },
    {
      id: "bio5",
      question: "Which organelle is responsible for protein synthesis?",
      options: [
        "Golgi apparatus",
        "Ribosome",
        "Endoplasmic reticulum",
        "Lysosome"
      ],
      correctAnswer: "Ribosome"
    },
    {
      id: "bio6",
      question: "What is a mutation?",
      options: [
        "A change in the DNA sequence",
        "Cell division",
        "Protein folding",
        "Energy production"
      ],
      correctAnswer: "A change in the DNA sequence"
    },
    {
      id: "bio7",
      question: "Which blood cells are responsible for oxygen transport?",
      options: [
        "White blood cells",
        "Red blood cells",
        "Platelets",
        "Plasma"
      ],
      correctAnswer: "Red blood cells"
    },
    {
      id: "bio8",
      question: "What is the largest organ in the human body?",
      options: ["Heart", "Liver", "Skin", "Brain"],
      correctAnswer: "Skin"
    },
    {
      id: "bio9",
      question: "What is homeostasis?",
      options: [
        "Cell division",
        "Maintaining stable internal conditions",
        "Energy production",
        "Hormone regulation"
      ],
      correctAnswer: "Maintaining stable internal conditions"
    },
    {
      id: "bio10",
      question: "Which system in the body defends against pathogens?",
      options: [
        "Respiratory",
        "Digestive",
        "Circulatory",
        "Immune"
      ],
      correctAnswer: "Immune"
    }
  ]
};

export default examQuestions;
