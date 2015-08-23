window.pixEngine = window.pixEngine || {};

(function() {
  var cultures = {
    "spanish": {
      mnames: ["Jose", "Juan", "Carlos", "Amadeo", "Javier", "Alejandro", "Hector", "Ignacio", "Sergio", "Valerio", "Gerardo", "Rafa", "Marcos", "Julio"],
      fnames: ["Sheila", "Maria", "Ana", "Marta", "Isabel", "Virginia", "Sofia", "Elena", "Ruth", "Alicia", "Sara", "Irene", "Carmen", "Sandra"],
      surnames: ["Garcia", "Perez", "Lopez", "Jimenez", "Alvarez", "Aristegui", "Valdes", "Hita", "Herrera", "Martin", "Arias", "Martin", "Hortaleza", "Esteban"]
    },
    "anglosaxon": {
      mnames: ["John", "Jim", "Peter", "Oliver", "Tom", "Robert", "Bob", "James", "Gordon", "Ryan", "River", "Jeremy", "Alex", "Charlie"],
      fnames: ["Sheila", "Ann", "Susan", "Caroline", "Olive", "Diana", "Mary", "Lesley", "Nathaly", "Emily", "Sarah", "Cynthia", "Liz", "Hannah"],
      surnames: ["Smith", "Wilson", "Johnson", "ODoherty", "Watt", "Weatherley", "Dohan", "Lought", "Templey", "Poulsen", "Stone", "Watson", "Benley"]
    },
    "arabic": {
      mnames: ["Mohammad", "Ali", "Akil", "Salman", "Basil", "Omar", "Hassan", "Abdul", "Abdala", "Osama", "Zinedine"],
      fnames: ["Hadiya", "Zahara", "Zulema", "Fatima", "Chaiza", "Sara", "Asha", "Aisha"],
      surnames: ["Bin Ragul", "Naser", "Khoury", "Nazari", "Touma", "Salib", "Assaf", "Boutros", "Awad", "Araffat", "Hussein", "Hommeini"]
    },
    "eastAsian": {
      mnames: ["Yu", "Kim", "Mao", "Wei", "Weo", "Akira", "Daichi", "Haru", "Hiro", "Hisao", "Kazuo", "Kenji", "Makoto", "Nobu", "Shin", "Taeko"],
      fnames: ["Fang", "Xiu Yiu", "Li", "Aiko", "Akemi", "Chie", "Fumiko", "Hana", "Hiroko", "Kaori", "Kazumi", "Maiko", "Megumi", "Ren"],
      surnames: ["Ga", "Gyeon", "Bok", "Sang", "Song", "Momoi", "Chang", "Young", "Soo", "Hanzo", "Wong", "Lee", "Wong", "Sato", "Suzuki", "Takahasi", "Tanaka", "Watanabe", "Ito", "Yamamoto", "Nakamura", "Kato"]
    },
    "germanic": {
      mnames: ["Klaus", "Otto", "Peter", "Mathias", "Alexander", "Jurgen", "William", "Daniel"],
      fnames: ["Olivia", "Katharina"],
      surnames: ["Mattaus", "Hildenburg", "Kinski", "Klinsman", "Müller", "Rummenige", "Bruhl"]
    },
    "generic": {
      mnames: ["Xabier", "Moses", "Kit", "Ariel", "Gianlucca", "Mario", "Ivan", "Boris", "Marcus", "Tony", "Marc", "Michael", "Luiggi", "Gael", "Pierre", "Tom", "Boris", "Ivan", "Abraham", "Alexei", "Albert", "Vlad", "David", "Igor", "Leo", "Leon", "Nestor", "Paul", "Erik"],
      fnames: ["Sarah", "Mary", "Olivia", "Isabella", "Sheila", "Catia", "Alina", "Veronica", "Diana", "Irina", "Clara", "Cristina", "Marina", "Olga"],
      surnames: ["Northman", "Gruber", "Mayer", "Jensen", "Nielsen", "Ivanov", "Bernard", "Martin", "Leroy", "Murphy", "Rossi", "Peeters", "Bernal", "Valdes", "Muller", "Cambridge", "Crownwell", ""]
    }

  };
  var culturesArray = ["spanish", "anglosaxon", "arabic", "eastAsian", "generic"];

  window.pixEngine.nameGenerator = function(culture, sex) {
    if (!culture || !(culture in cultures)) {
      culture = window.tr.utils.getRandomCulture();
    }
    if (sex !== 0 && sex !== 1) {
      sex = Math.floor(Math.random() * 2);
    }
    var name = "";
    if (sex === 0) {
      name = cultures[culture].mnames[Math.floor(Math.random() * cultures[culture].mnames.length)];
    } else {
      name = cultures[culture].fnames[Math.floor(Math.random() * cultures[culture].fnames.length)];
    }

    return name + ' ' +
      cultures[culture].surnames[Math.floor(Math.random() * cultures[culture].surnames.length)];
  };
  window.pixEngine.getRandomCulture = function() {
    var pos = Math.floor(Math.random() * culturesArray.length);
    return culturesArray[pos];
  };
})();