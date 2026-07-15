export interface Dhikr {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  reference: string;
}

export interface AdhkarCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  color: string;
  items: Dhikr[];
}

export const ADHKAR_CATEGORIES: AdhkarCategory[] = [
  {
    id: 'morning',
    nameAr: 'أذكار الصباح',
    nameEn: 'Morning Adhkar',
    icon: 'sun',
    color: '#F59E0B',
    items: [
      {
        id: 'm1',
        arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ\n\nاللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
        transliteration: "Ayat Al-Kursi (2:255)",
        translation: 'Allah! There is no god but He, the Living, the Self-subsisting, Supporter of all. No slumber can seize Him nor sleep. His are all things in the heavens and on earth.',
        count: 1,
        reference: 'Quran 2:255 — Recite once after Fajr',
      },
      {
        id: 'm2',
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration: "Asbahna wa asbahal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku walahul-hamd, wahuwa 'ala kulli shay'in qadir",
        translation: 'We have reached the morning and the dominion belongs to Allah. Praise be to Allah. There is no god but Allah, alone, without partner. His is the dominion and to Him belongs all praise, and He is over all things capable.',
        count: 1,
        reference: 'Abu Dawud — Recite in the morning',
      },
      {
        id: 'm3',
        arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
        transliteration: "Allahumma anta rabbi la ilaha illa ant, khalaqtani wa ana abduk, wa ana 'ala ahdika wa wa'dika mastata't, a'udhu bika min sharri ma sana't, abu'u laka bini'matika 'alayya wa abu'u bidhanbi faghfir li fa innahu la yaghfirudh-dhunuba illa ant",
        translation: 'O Allah, You are my Lord. There is no god but You. You created me and I am Your servant. I am on Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for none forgives sins but You.',
        count: 1,
        reference: 'Bukhari — Sayyid Al-Istighfar',
      },
      {
        id: 'm4',
        arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
        transliteration: 'Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu wa ilaikan-nushur',
        translation: 'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.',
        count: 1,
        reference: 'Tirmidhi — Recite in the morning',
      },
      {
        id: 'm5',
        arabic: 'رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
        transliteration: "Raditu billahi rabba, wa bil-islami dina, wa bi-Muhammadin sallallahu 'alayhi wa sallama nabiyya",
        translation: 'I am pleased with Allah as my Lord, Islam as my religion, and Muhammad (peace be upon him) as my Prophet.',
        count: 3,
        reference: "Abu Dawud — Whoever says this in the morning, it is a covenant with Allah that He will satisfy him on the Day of Judgment",
      },
      {
        id: 'm6',
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wahuwa 'ala kulli shay'in qadir",
        translation: 'There is no god but Allah, alone, without partner. His is the dominion and all praise belongs to Him and He is over all things capable.',
        count: 10,
        reference: 'Muslim — Recite 10 times in the morning',
      },
      {
        id: 'm7',
        arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
        transliteration: 'Subhanallahi wa bihamdihi',
        translation: 'Glory be to Allah and praise be to Him.',
        count: 100,
        reference: 'Muslim — Recite 100 times in the morning',
      },
      {
        id: 'm8',
        arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq",
        translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
        count: 3,
        reference: 'Muslim — Whoever says this in the evening, no harm shall touch him that night',
      },
    ],
  },
  {
    id: 'evening',
    nameAr: 'أذكار المساء',
    nameEn: 'Evening Adhkar',
    icon: 'moon',
    color: '#6366F1',
    items: [
      {
        id: 'e1',
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration: "Amsayna wa amsal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku walahul-hamd, wahuwa 'ala kulli shay'in qadir",
        translation: 'We have reached the evening and the dominion belongs to Allah. Praise be to Allah. There is no god but Allah, alone without partner.',
        count: 1,
        reference: 'Abu Dawud — Recite in the evening',
      },
      {
        id: 'e2',
        arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
        transliteration: "Allahumma anta rabbi la ilaha illa ant, khalaqtani wa ana abduk, wa ana 'ala ahdika wa wa'dika mastata't, a'udhu bika min sharri ma sana't, abu'u laka bini'matika 'alayya wa abu'u bidhanbi faghfir li fa innahu la yaghfirudh-dhunuba illa ant",
        translation: 'O Allah, You are my Lord. There is no god but You. You created me and I am Your servant. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me.',
        count: 1,
        reference: 'Bukhari — Sayyid Al-Istighfar (Evening version)',
      },
      {
        id: 'e3',
        arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
        transliteration: 'Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namutu wa ilaykal-masir',
        translation: 'O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the final return.',
        count: 1,
        reference: 'Tirmidhi — Recite in the evening',
      },
      {
        id: 'e4',
        arabic: 'اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّداً عَبْدُكَ وَرَسُولُكَ',
        transliteration: "Allahumma inni amsaytu ushiduk, wa ushhidu hamalata 'arshik, wa mala'ikatak, wa jami'a khalqik, annaka antallahu la ilaha illa anta wahdaka la sharika lak, wa anna Muhammadan 'abduka wa rasuluk",
        translation: 'O Allah, I call You to witness, and I call Your throne bearers, Your angels, and all Your creatures to witness that You are Allah, there is no god but You alone, without partner, and that Muhammad is Your servant and Your Messenger.',
        count: 4,
        reference: 'Abu Dawud — One who says this will be freed from Hellfire',
      },
      {
        id: 'e5',
        arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
        transliteration: 'Subhanallahi wa bihamdihi',
        translation: 'Glory be to Allah and praise be to Him.',
        count: 100,
        reference: 'Muslim — Recite 100 times in the evening',
      },
    ],
  },
  {
    id: 'sleep',
    nameAr: 'أذكار النوم',
    nameEn: 'Sleep Adhkar',
    icon: 'moon',
    color: '#8B5CF6',
    items: [
      {
        id: 's1',
        arabic: 'بِسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        transliteration: 'Bismika Allahumma amutu wa ahya',
        translation: 'In Your name, O Allah, I die and I live.',
        count: 1,
        reference: 'Bukhari — Recite when going to sleep',
      },
      {
        id: 's2',
        arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
        transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak",
        translation: 'O Allah, protect me from Your punishment on the day You resurrect Your servants.',
        count: 3,
        reference: 'Abu Dawud — Recite 3 times before sleeping',
      },
      {
        id: 's3',
        arabic: 'سُبْحَانَ اللَّهِ',
        transliteration: 'SubhanAllah',
        translation: 'Glory be to Allah.',
        count: 33,
        reference: 'Bukhari & Muslim — The Tasbeeh of Fatimah before sleep',
      },
      {
        id: 's4',
        arabic: 'الْحَمْدُ لِلَّهِ',
        transliteration: 'Alhamdulillah',
        translation: 'All praise is due to Allah.',
        count: 33,
        reference: 'Bukhari & Muslim — The Tahmeed of Fatimah before sleep',
      },
      {
        id: 's5',
        arabic: 'اللَّهُ أَكْبَرُ',
        transliteration: 'Allahu Akbar',
        translation: 'Allah is the Greatest.',
        count: 34,
        reference: 'Bukhari & Muslim — The Takbeer of Fatimah before sleep',
      },
      {
        id: 's6',
        arabic: 'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ',
        transliteration: "Allahumma aslamtu nafsi ilayk, wa fawwadtu amri ilayk, wa wajjahtu wajhi ilayk, wa alja'tu zahri ilayk, raghbatan wa rahbatan ilayk, la malja' wa la manja minka illa ilayk, amantu bikitabikal-ladhi anzalt, wa binabiyyikal-ladhi arsalt",
        translation: 'O Allah, I have submitted myself to You, entrusted my affairs to You, turned my face to You, and laid my back against You out of desire and fear of You. There is no refuge or safety except with You. I believe in Your Book which You have revealed and in Your Prophet whom You have sent.',
        count: 1,
        reference: 'Bukhari & Muslim — Recite before sleeping, it is the last statement',
      },
    ],
  },
  {
    id: 'prayer',
    nameAr: 'أذكار الصلاة',
    nameEn: 'Prayer Adhkar',
    icon: 'activity',
    color: '#2D7A4F',
    items: [
      {
        id: 'p1',
        arabic: 'سُبْحَانَ اللَّهِ',
        transliteration: 'SubhanAllah',
        translation: 'Glory be to Allah.',
        count: 33,
        reference: 'Muslim — After every prayer',
      },
      {
        id: 'p2',
        arabic: 'الْحَمْدُ لِلَّهِ',
        transliteration: 'Alhamdulillah',
        translation: 'All praise is due to Allah.',
        count: 33,
        reference: 'Muslim — After every prayer',
      },
      {
        id: 'p3',
        arabic: 'اللَّهُ أَكْبَرُ',
        transliteration: 'Allahu Akbar',
        translation: 'Allah is the Greatest.',
        count: 33,
        reference: 'Muslim — After every prayer',
      },
      {
        id: 'p4',
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku walahul-hamd, wahuwa 'ala kulli shay'in qadir",
        translation: 'There is no god but Allah, alone without partner. His is the dominion, to Him belongs all praise, and He is over all things capable.',
        count: 1,
        reference: 'Muslim — After the 99 tasbihat',
      },
      {
        id: 'p5',
        arabic: 'أَسْتَغْفِرُ اللَّهَ',
        transliteration: 'Astaghfirullah',
        translation: 'I seek forgiveness from Allah.',
        count: 3,
        reference: 'Muslim — Recite 3 times after Salaam',
      },
    ],
  },
  {
    id: 'wakeup',
    nameAr: 'أذكار الاستيقاظ',
    nameEn: 'Waking Up',
    icon: 'sunrise',
    color: '#EF4444',
    items: [
      {
        id: 'w1',
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        transliteration: 'Alhamdu lillahil-ladhi ahyana ba\'da ma amatana wa ilayhinnushur',
        translation: 'All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.',
        count: 1,
        reference: 'Bukhari — Upon waking up',
      },
      {
        id: 'w2',
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
        transliteration: "La ilaha illallahu wahdahu la sharika lah, lahul-mulku walahul-hamd, wahuwa 'ala kulli shay'in qadir, subhanallah, walhamdu lillah, wa la ilaha illallah, wallahu akbar, wa la hawla wa la quwwata illa billahil-'aliyyil-'azim",
        translation: 'There is no god but Allah, alone without partner, His is the dominion and to Him belongs all praise, and He is over all things capable. Glory be to Allah, praise be to Allah, there is no god but Allah, Allah is the Greatest, and there is no power or might except with Allah, the Most High, the Magnificent.',
        count: 1,
        reference: 'Bukhari — Upon waking up',
      },
    ],
  },
  {
    id: 'travel',
    nameAr: 'أذكار السفر',
    nameEn: 'Travel Adhkar',
    icon: 'map',
    color: '#059669',
    items: [
      {
        id: 't1',
        arabic: 'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنقَلِبُونَ',
        transliteration: "Allahu Akbar (3x), Subhanalladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun",
        translation: 'Allah is the Greatest (3x). Glory be to Him who has subjected this to us, and we could not have done it ourselves. And indeed, to our Lord we will return.',
        count: 1,
        reference: 'Muslim — When mounting a vehicle',
      },
      {
        id: 't2',
        arabic: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ',
        transliteration: "Allahumma inna nas'aluka fi safarina hadhal-birra wat-taqwa, wa minal-'amali ma tarda, Allahumma hawwin 'alayna safarana hadha wat wi 'anna bu'dah",
        translation: 'O Allah, we ask You on this journey for goodness and piety, and for deeds that are pleasing to You. O Allah, ease this journey for us and make its distance seem short.',
        count: 1,
        reference: 'Muslim — The Dua for travel',
      },
    ],
  },
];

export const TASBIH_PRESETS = [
  { label: 'سبحان الله', transliteration: 'SubhanAllah', target: 33 },
  { label: 'الحمد لله', transliteration: 'Alhamdulillah', target: 33 },
  { label: 'الله أكبر', transliteration: 'Allahu Akbar', target: 34 },
  { label: 'لا إله إلا الله', transliteration: 'La ilaha illallah', target: 100 },
  { label: 'أستغفر الله', transliteration: 'Astaghfirullah', target: 100 },
  { label: 'صلى الله على النبي', transliteration: 'Sallallahu Alayhi wa Sallam', target: 100 },
];
