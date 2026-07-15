export interface Dua {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
}

export interface DuaCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  duas: Dua[];
}

export const DUA_CATEGORIES: DuaCategory[] = [
  {
    id: 'quran',
    nameAr: 'أدعية القرآن',
    nameEn: 'Quran Duas',
    icon: 'book-open',
    duas: [
      {
        id: 'q1',
        arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        transliteration: "Rabbana atina fid-dunya hasanatan wa fil akhirati hasanatan wa qina 'adhaban-nar",
        translation: 'Our Lord, give us in this world that which is good and in the Hereafter that which is good, and save us from the punishment of the Fire.',
        reference: 'Quran 2:201',
      },
      {
        id: 'q2',
        arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً إِنَّكَ أَنتَ الْوَهَّابُ',
        transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana milladunka rahmah innaka antal wahhab",
        translation: 'Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower.',
        reference: 'Quran 3:8',
      },
      {
        id: 'q3',
        arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
        transliteration: "Rabbi ishrah li sadri wa yassir li amri",
        translation: 'My Lord, expand for me my breast [with assurance] and ease for me my task.',
        reference: 'Quran 20:25-26',
      },
      {
        id: 'q4',
        arabic: 'رَبِّ زِدْنِي عِلْمًا',
        transliteration: "Rabbi zidni 'ilma",
        translation: 'My Lord, increase me in knowledge.',
        reference: 'Quran 20:114',
      },
      {
        id: 'q5',
        arabic: 'رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
        transliteration: "Rabbana ighfir lana dhunubana wa israfana fi amrina wa thabbit aqdamana wansurna 'alal qawmil kafirin",
        translation: 'Our Lord, forgive us our sins and the excess in our affairs and plant firmly our feet and give us victory over the disbelieving people.',
        reference: 'Quran 3:147',
      },
      {
        id: 'q6',
        arabic: 'لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
        transliteration: "La ilaha illa anta subhanak inni kuntu minadh-dhalimin",
        translation: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
        reference: "Quran 21:87 — Dua of Prophet Yunus (Jonah)",
      },
    ],
  },
  {
    id: 'daily',
    nameAr: 'أدعية يومية',
    nameEn: 'Daily Duas',
    icon: 'sun',
    duas: [
      {
        id: 'd1',
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
        transliteration: 'Bismillahir-Rahmanir-Rahim',
        translation: 'In the name of Allah, the Most Gracious, the Most Merciful.',
        reference: 'Said before every action',
      },
      {
        id: 'd2',
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
        transliteration: "Allahumma inni as'alukal-'afiyata fid-dunya wal-akhirah",
        translation: 'O Allah, I ask You for well-being in this world and the next.',
        reference: 'Ibn Majah',
      },
      {
        id: 'd3',
        arabic: 'اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي',
        transliteration: "Allahumma aslih li dini alladhi huwa 'ismatu amri, wa aslih li dunyaya allati fiha ma'ashi",
        translation: 'O Allah, set right for me my religion which is the safeguard of my affairs. Set right for me my worldly affairs in which is my livelihood.',
        reference: 'Muslim',
      },
    ],
  },
  {
    id: 'ramadan',
    nameAr: 'أدعية رمضان',
    nameEn: 'Ramadan Duas',
    icon: 'moon',
    duas: [
      {
        id: 'r1',
        arabic: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
        transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
        translation: 'O Allah, You are the Pardoner and You love to pardon, so pardon me.',
        reference: "Tirmidhi — Dua for Laylatul Qadr",
      },
      {
        id: 'r2',
        arabic: 'اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
        transliteration: "Allahumma laka sumtu wa 'ala rizqika aftart",
        translation: 'O Allah, for You I have fasted and upon Your provision I break my fast.',
        reference: 'Abu Dawud — Dua for breaking fast',
      },
      {
        id: 'r3',
        arabic: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ',
        transliteration: "Dhahaba az-zama' wa ibtallatil 'uruqu wa thabatal ajru inshaAllah",
        translation: 'The thirst is gone, the veins are moistened, and the reward is established, if Allah wills.',
        reference: 'Abu Dawud — Dua after breaking fast',
      },
    ],
  },
  {
    id: 'prophets',
    nameAr: 'أدعية الأنبياء',
    nameEn: "Prophets' Duas",
    icon: 'star',
    duas: [
      {
        id: 'pr1',
        arabic: 'رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ',
        transliteration: "Rabbi inni lima anzalta ilayya min khayrin faqir",
        translation: 'My Lord, indeed I am, for whatever good You would send down to me, in need.',
        reference: "Quran 28:24 — Dua of Musa (Moses)",
      },
      {
        id: 'pr2',
        arabic: 'رَبِّ هَبْ لِي مِن لَّدُنكَ ذُرِّيَّةً طَيِّبَةً إِنَّكَ سَمِيعُ الدُّعَاءِ',
        transliteration: "Rabbi hab li milladunka dhurriyyatan tayyibah innaka sami'ud-du'a'",
        translation: 'My Lord, grant me from Yourself a good offspring. Indeed, You are the Hearer of supplication.',
        reference: "Quran 3:38 — Dua of Zakariya",
      },
      {
        id: 'pr3',
        arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
        transliteration: "Rabbij'alni muqimas-salati wa min dhurriyyati Rabbana wa taqabbal du'a'",
        translation: 'My Lord, make me an establisher of prayer, and from my descendants. Our Lord, and accept my supplication.',
        reference: "Quran 14:40 — Dua of Ibrahim",
      },
    ],
  },
];
