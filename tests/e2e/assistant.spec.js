import {
  test,
  expect
} from './fixtures';

const MediaType = {
  video: "video",
  image: "image",
  none: "none",
};

const LinkResult = {
  negative: "ErrorOutlineOutlinedIcon",
  mention: "SentimentSatisfiedIcon",
  positive: "CheckCircleOutlineIcon",
  none: null
};

const MediaVideoStatus = {
  iframe: 0,
  video: 1,
  noEmbed: 2,
};

const MediaServices = {
  analysisVideo: "navbar_analysis_video",
  analysisImage: "navbar_analysis_image",
  keyframes: "navbar_keyframes",
  thumbnails: "navbar_thumbnails",
  magnifier: "navbar_magnifier",
  metadata: "navbar_metadata",
  videoRights: "navbar_rights",
  forensic: "navbar_forensic",
  ocr: "navbar_ocr",
  videoDownload: "assistant_video_download_action",
  videoDownloadGeneric: "assistant_video_download_generic",
  videoDownloadTiktok: "assistant_video_download_tiktok",
};


// These tests are inherantly flakey because the different services may take different amounts of time to run
// Unless we can provide a timeout which will guarantee that they come back, some of the tests may randomly fail


[
  // Negative Source Credibility
  {
    url: "https://www.breitbart.com/europe/2024/02/12/german-government-expects-10-million-migrants-to-flee-ukraine-if-russia-wins-war-report",
    mediaType: MediaType.image,
    imageGridIndex: 0,
    services: [MediaServices.metadata, MediaServices.magnifier, MediaServices.forensic, MediaServices.ocr],
    namedEntities: {
      Person: [
        "Gerald Knaus",
        "Roderich Kiesewetter",
        "Heiko Teggatz",
        "Olaf Scholz",
        "Frank", // This should be Frank-Walter Steinmeir, but the named entity recognition does not handle hyphens well
        "Walter Steinmeier"
      ],
      Location: [
        "Ukraine",
        "Russia",
        "Germany",
        "Berlin",
        "Western Europe",
        "Europe",
        "Syria",
        "Turkey",
        "Poland",
        "Middle East",
        "Africa",
        "Canada"
      ],
      Organization: [
        "EU",
        "Bundestag",
        "Christian Democratic Union",
        "CDU",
        "NATO",
        "The UN Refugee Agency",
        "UNHCR",
        "Chairman of the German Police Union",
        "West",
        "Germany’s Federal Office for Migration and Refugees and Federal Institute for Population Research"
      ]
    },
    domainAnalyses: {
      warning: ["OpenSources", "GDI-Ads", "IFFY", "StratCom"],
      mentions: ["DBKF"]
    },
    extractedURLAnalyses: {
        "https://www.unhcr.org/us/emergencies/ukraine-emergency": null,
        "https://www.breitbart.com/europe/2024/01/06/illegal-migrant-arrivals-highest-since-2015-migrant-crisis-says-germany/": LinkResult.negative,
        "https://www.politico.eu/article/germany-migration-president-frank-walter-steinmeier-breaking-point/": null,
        "https://www.breitbart.com/europe/2023/07/14/half-of-ukrainian-refugees-in-germany-want-to-stay-forever/": LinkResult.negative,
        "https://www.theglobeandmail.com/politics/article-displaced-ukrainians-want-to-settle-permanently-in-canada/": null,
        "https://www.welt.de/politik/deutschland/article250007304/Ukraine-Bei-einem-Zerfall-der-Ukraine-droht-eine-Massenflucht.html?icid=search.product.onsitesearch" : LinkResult.positive,
        "https://x.com/BreitbartNews": LinkResult.mention,
        "https://twitter.com/KurtZindulka": null,
    },
    credibilitySignals: {
      topic: ["Security, Defense and Well-being", "Politics", "International Relations"],
      genre: ["Objective reporting"],
      persuasionTechniques: [
        "Appeal to Authority",
        "Appeal to fear/prejudice",
        "Appeal to Popularity",
        "Exaggeration or minimisation",
        "Loaded language",
        "Repetition"
      ],
      subjectivity: ["None detected"]
    }
  },
  {
    url: "https://www.breitbart.com/clips/2024/03/24/vp-harris-we-do-not-intend-to-ban-tiktok",
    mediaType: MediaType.image,
    imageGridIndex: 0,
    services: [MediaServices.metadata, MediaServices.magnifier, MediaServices.forensic, MediaServices.ocr],
    namedEntities: {
      Person: [
        "Kamala Harris"
      ],
      Organization: [
        "TikTok"
      ],
      UserID: [
        "pamkeyNEN"
      ]
    },
    domainAnalyses: {
      warning: ["OpenSources", "GDI-Ads", "IFFY", "StratCom"],
      mentions: ["DBKF"]
    },
    extractedURLAnalyses: {
        "https://x.com/BreitbartNews": LinkResult.mention,
        "https://twitter.com/pamkeyNEN": null,
    },
    credibilitySignals: {
      topic: ["Law and Justice System", "Politics"],
      genre: ["Satire"], // Questionable...
      persuasionTechniques: [
        "Appeal to Authority",
        "Doubt",
        "Repetition"
      ],
      subjectivity: ["None detected"]
    }
  },
  // Positive source credibility
  {
    url: "https://pesacheck.org/tagged/burkina-faso",
    mediaType: MediaType.image,
    imageGridIndex: 0,
    services: [MediaServices.metadata, MediaServices.magnifier, MediaServices.forensic, MediaServices.ocr],
    namedEntities: {
      Person: [
        "Citizens"
      ]
    },
    domainAnalyses: {
      factChecker: ["Duke Reporters' Lab"]
    },
    extractedURLAnalyses: {
        "https://pesacheck.org/about": LinkResult.positive,
    },
    credibilitySignals: {
      topic: [
        "Law and Justice System",
        "Crime and Punishment", // Not highlighted
        "Politics"
      ],
      genre: ["Satire"], // I don't think so...
      persuasionTechniques: [
        "Appeal to Authority",
        "Loaded language",
      ],
      subjectivity: ["None detected"]
    }
  },
  // All three source types
  {
    url: "https://demagog.cz/vyrok/23170",
    mediaType: MediaType.image,
    imageGridIndex: 0,
    services: [MediaServices.metadata, MediaServices.magnifier, MediaServices.forensic, MediaServices.ocr],
    namedEntities: {
      // There should definitely be some named entities in here, e.g. Andreje Babiše, but maybe the service doesn't
      // work in Czech?
    },
    domainAnalyses: {
      factChecker: ["Meta", "Duke Reporters' Lab"]
    },
    extractedURLAnalyses: {
        "https://twitter.com/DemagogCZ": LinkResult.positive,
        "https://www.facebook.com/journalismproject/programs/third-party-fact-checking": LinkResult.mention,
        "https://drive.google.com/drive/folders/1J6nkGqAan4B5tet7dG5I9rRxHGyUwHGq": LinkResult.negative,
        "https://web.archive.org/web/20230323215342/https:/www.ustavnysud.sk/c/document_library/get_file?uuid=67bda80c-2905-43c2-a802-7796b0c14c31&groupId=10182": LinkResult.negative
    },
    credibilitySignals: {
      topic: [
        "Law and Justice System",
        "Crime and Punishment", // Not highlighted
        "Politics"
      ],
      genre: ["Objective reporting"],
      persuasionTechniques: [
        "Appeal to Authority",
        "Appeal to Hypocrisy",
        "Appeal to time",
        "Appeal to values",
        "Conversation killer",
        "Doubt",
        "Guilt by association",
        "Loaded language",
        "Name calling or labeling",
        "Questioning the reputation",
      ],
      // TODO: Maybe try to test _which_ sentences are subjective?
      subjectivity: ["Subjective sentences detected (4/60)"]
    }
  },
  // Stratcom, DBKF, GDI-Ads
  {
    url: "https://www.pi-news.net/2024/01/deutscher-terror-ueberlebender-greift-politik-medien-und-schwulenverband-scharf-an",
    mediaType: MediaType.image,
    imageGridIndex: 0,
    services: [MediaServices.metadata, MediaServices.magnifier, MediaServices.forensic, MediaServices.ocr],
    namedEntities: {
      Person: [
        "Abdullah Al Haj Hasan",
        "Thomas L.",
        "Oliver L.",
        "Thomas", // This is the same Thomas as above
        "Zufallsopfer", // Not a person: "Accidental victims". I don't know why they capitalised here
        "Bundeskanzlerin Merkel", // This is fine as long as it doesn't think Bundeskanzlerin is a first name
        "Manfred Rouhs"
      ],
      Location: [
        "Dresden",
        "Westdeutschland",
        "Jugendknast",
        "Verbrechens",
        "Krefeld",
        "Köln",
        "Deutschland",
        "Stadt Dresden",
        "Berlin"
      ],
      Organization: [
        "MANFRED",
        "Homosexuelle“", // Shouldn't have the smart quote
        "Ring“", // Shouldn't have the smart quote, and should be "Weissen Ring"
        "PI",
        "NEWS",
        "Vereins Signal",
        "SIGNAL"
      ]
    },
    domainAnalyses: {
      // Fails
    },
    extractedURLAnalyses: {
      // Fails
    },
    credibilitySignals: {
      topic: [
        "Religious, Ethical and Cultural",
        "Fairness, Equality and Rights",
        "Crime and Punishment",
      ],
      genre: ["Objective reporting"],
      persuasionTechniques: [
        "Appeal to Authority",
        "Appeal to fear/prejudice",
        "Appeal to Hypocrisy",
        "Appeal to Popularity",
        "Appeal to values",
        "Conversation killer",
        "Doubt",
        "Exaggeration or minimisation",
        "Loaded language",
        "Name calling or labeling",
        "Obfuscation - vagueness or confusion",
        "Questioning the reputation",
        "Slogans",
      ],
      // TODO: Maybe try to test _which_ sentences are subjective?
      subjectivity: ["Subjective sentences detected (10/33)"]
    }
  },
  // Duke Reporters' Lab
  {
    url: "https://www.factamedia.com",
    mediaType: MediaType.image,
    imageGridIndex: 0,
    services: [MediaServices.metadata, MediaServices.magnifier, MediaServices.forensic, MediaServices.ocr],
    namedEntities: {
      // Don't check named entities because the articles are not stable
    },
    domainAnalyses: {
      factChecker: ["Duke Reporters' Lab"]
    },
    extractedURLAnalyses: {
      // Don't check extracted URLs because the articles are not stable
    },
    credibilitySignals: {
      // Don't check credibility signals because the articles are not stable
    }
  },
  // IFFY index
  {
    url: "https://911truth.org/rationality-9-11-asking-questions-response-michael-shermer",
    mediaType: MediaType.image,
    imageGridIndex: 0,
    services: [MediaServices.metadata, MediaServices.magnifier, MediaServices.forensic, MediaServices.ocr],
    namedEntities: {
      Person: [
        // Healthy skepticism is not a person
      ],
      Organization: [
        "New York Times",
        "BBC",
        "Conspiracy Theories And Real Reporters Former",
        "LTE",
        "Europhysics News",
      ]
    },
    domainAnalyses: {
      warning: ["IFFY"]
    },
    extractedURLAnalyses: {
      "https://911truth.org/category/case-for-complicity/": LinkResult.negative,
      "https://911truth.org/category/case-for-complicity/begin-questioning/": LinkResult.negative,
      "https://911truth.org/author/mb/": LinkResult.negative,
      "https://911truth.org/bbc-clairvoyant-collapse/": LinkResult.negative,
      "https://911truth.org/seismic-signal-emitted-wave-plane-impact-collapse-towers/": LinkResult.negative,
      "https://911truth.org/leftist-reporters-deny-conspiracy-theories/": LinkResult.negative,
      "https://911truth.org/former-nist-employee-speaks-lte-europhysics-news/": LinkResult.negative,
      "https://911truth.org/tag/wtc/": LinkResult.negative,
      "https://911truth.org/9-11-first-responders-forced-to-fight-for-healthcare-funds-again/": LinkResult.negative,
      "https://911truth.org/us-judge-condemns-fbi-while-ordering-release-of-man-in-newburgh-four-terror-sting/": LinkResult.negative,
      "https://911truth.org/author/mb/": LinkResult.negative,
      "https://911truth.org/": LinkResult.negative,
      "https://michaelshermer.substack.com/p/the-truth-about-911-truth": null,
      "https://ine.uaf.edu/wtc7": null,
      "https://www.facebook.com/sharer.php?u=https%3A%2F%2F911truth.org%2Frationality-9-11-asking-questions-response-michael-shermer%2F": null,
      "https://www.reddit.com/submit?url=https://911truth.org/rationality-9-11-asking-questions-response-michael-shermer/&title=Rationality, 9/11, and the Art of Asking Questions: A Response to Michael Shermer and other “Professional” Debunkers": LinkResult.negative,
      "https://www.youtube.com/@911TruthOrg": null
    },
    credibilitySignals: {
      topic: ["Religious, Ethical and Cultural"],
      genre: ["Opinionated News"],
      persuasionTechniques: [
        "Appeal to Authority",
        "Appeal to fear/prejudice;",
        "Doubt",
        "False dilemma or no choice",
        "Flag Waving",
        "Loaded language",
        "Name calling or labeling",
        "Obfuscation - vagueness or confusion",
        "Repetition",
      ],
      subjectivity: ["Subjective sentences detected (12/19)"],
    }
  },
  // Public interest news foundation
  {
    url: "https://www.blogpreston.co.uk/2024/07/dozens-of-road-changes-planned-between-preston-and-south-ribble-to-encourage-cycling-walking-and-public-transport-use",
    mediaType: MediaType.image,
    imageGridIndex: 0,
    services: [MediaServices.metadata, MediaServices.magnifier, MediaServices.forensic, MediaServices.ocr],
    namedEntities: {
      Person: [
        // None of these are actually people. They should be locations
        // Cop Lane
        // Coote Lane
        // Watkin Lane
        // Lane
        // Marshall’s Brow
      ],
      Location: [
        "Preston",
        "A582", // Debatable
        "Lostock Hall",
        "Penwortham",
        "Manchester Road",
        "Leyland Road",
        "Croston Road",
        "Lancashire County Council", // Organization
        "County Hall",
        "Passengers", // People
        "Moss Lane",
        "Westfield",
        // "St"
        "Paul’s Park", // Should be St. Paul's park
        "Church Lane", // Why can it pick up Church Lane but not any of the above lanes?
        "Fowler Road",
        "Chain House Lane",
        "Penwortham Way",
        "New Lane",
        "Millbrook Way",
        "Fir Trees Road",
        "Brydeck Avenue",
        "Buller Avenue",
        "Hawkhurst Road",
        "Talbot Road",
        "Riverside Road",
        // "Riverside Road Leyland Road", // Two separate roads, appear as "Leyland Road/Riverside Road" in raw text
        "Fish House Bridge",
        "Valley Road",
      ],
      Organization: [
        // "School Lane", // Another location
        "Penwortham Methodist Church",
      ]
    },
    domainAnalyses: {
      factChecker: ["Public Interest News Foundation"]
    },
    extractedURLAnalyses: {
      // "https://twitter.com/share": LinkResult.negative, // Extracted, but doesn't appear in the page?!
      "https://www.blogpreston.co.uk": LinkResult.positive,
      "https://www.blogpreston.co.uk/photos/": LinkResult.positive,
      "https://www.blogpreston.co.uk/category/preston-news/": LinkResult.positive,
      "https://www.blogpreston.co.uk/category/preston-news/preston-redevelopment/": LinkResult.positive,
      "https://www.blogpreston.co.uk/category/preston-proud/": LinkResult.positive,
      // "https://www.blogpreston.co.uk/preston-guide/": LinkResult.positive, // Duplicated on page, so can't resolve
      "https://www.blogpreston.co.uk/category/events-in-preston/": LinkResult.positive,
      "https://www.blogpreston.co.uk/about/": LinkResult.positive,
      "https://www.blogpreston.co.uk/contact/": LinkResult.positive,
      // "https://www.blogpreston.co.uk/advertise/": LinkResult.positive,
      "https://www.blogpreston.co.uk/author/paul-faulkner-bbc-local-democracy-reporting-serv/": LinkResult.positive,
      "https://www.blogpreston.co.uk/category/south-ribble-locations/lostock-hall/": LinkResult.positive,
      "https://www.blogpreston.co.uk/category/south-ribble-locations/penwortham-preston/": LinkResult.positive,
      "https://www.blogpreston.co.uk/category/preston-news/": LinkResult.positive,
      "https://www.blogpreston.co.uk/category/preston-news/transport-2/roads-transport-2/": LinkResult.positive,
      "https://www.blogpreston.co.uk/category/south-ribble-news/": LinkResult.positive,
      "https://www.blogpreston.co.uk/category/preston-news/transport-2/": LinkResult.positive,
      "https://www.blogpreston.co.uk/category/preston-news/": LinkResult.positive,
      "https://www.blogpreston.co.uk/2024/07/195-objections-to-manchester-road-zebra-crossing-redesign-snubbed-as-plans-forced-ahead/": LinkResult.positive,
      // Extracted as https://www.facebook.com/login/?next=https://www.facebook.com/blogpreston
      // This seems to be flakey behaviour:
      // The first time it will extract it as normal, and then it'll resolve to the "login" URL
      // I guess this is a facebook think rather than an us thing.
      // "http://facebook.com/blogpreston": null,
      "http://twitter.com/blogpreston": null,
      "https://instagram.com/blog.preston/": null,
      "https://lancashire.citizenspace.com/environment-and-planning/stcsurvey/": null,
      "https://whatsapp.com/channel/0029VaFnaP3HgZWdNB6IR41U": null,
      "http://eepurl.com/irNrXU": null,
      "http://flickr.com/11253414@N04/54119224627": null,
      "http://flickr.com/11253414@N04/54120533300": null,
    },
    credibilitySignals: {
      topic: [
        "Economy and Resources",
        "Crime and Punishment",
        "Security, Defense and Well-being",
        "Politics",
      ],
      genre: ["Objective reporting"],
      persuasionTechniques: [
        "Appeal to fear/prejudice",
        "Doubt",
        "False dilemma or no choice",
        "Loaded language",
        "Name calling or labeling",
        "Obfuscation - vagueness or confusion",
        "Repetition",
      ],
      subjectivity: [
        // Failed to load
      ],
    }
  },
  // Hamilton 2.0
  {
    url: "https://x.com/bycongwang/status/1671156635887349761",
    mediaType: MediaType.image,
    services: [MediaServices.analysisImage, MediaServices.magnifier, MediaServices.forensic, MediaServices.ocr],
    namedEntities: {
      Location: [
        "Tchad"
      ],
      Organization: [
        // None identified
        // I'd have said "la Communauté chinoise résidant au Tchad" -> "The Chinese comunity resident in Chad"
        // might count as an organisation?
      ]
    },
    domainAnalyses: {
      mentions: ["Hamilton 2.0"]
    },
    credibilitySignals: {
      topic: [
        "Religious, Ethical and Cultural",
        "Security, Defense and Well-being", // Is it?
        "International Relations",
      ],
      genre: ["Objective reporting"],
      persuasionTechniques: [
        // flagging a tweet as "(1/6)" is not loaded language
      ],
      subjectivity: ["None detected"],
    }
  },
  {
    url: "https://t.me/s/sovfedofficial/5",
    mediaType: MediaType.none,
    services: [],
    namedEntities: {
      // Running this through google translate, there's definitely some named entities in here, although none are detected
      // I guess named entities doesn't work for every language
    },
    domainAnalyses: {
      mentions: ["Hamilton 2.0"]
    },
    credibilitySignals: {
      topic: [
        "Law and Justice System",
        "Politics"
      ],
      genre: ["Opinionated News"],
      persuasionTechniques: [
        "Appeal to values",
        "Consequential oversimplification",
        "Doubt",
        "Loaded language"
      ],
      subjectivity: [
        // Again, the translated text seems pretty subjective, so I guess this doesn't work for Russion either?
      ],
    }
  },
  // Bundesverband Digitalpublisher und Zeitungsverleger (BDZV)
  {
    url: "https://www.das-parlament.de/wirtschaft/haushalt/der-entwurf-ist-beschlossen-doch-fragen-bleiben-offen",
    mediaType: MediaType.image, // TODO: Change to none once #645 gets merged into main
    services: [MediaServices.metadata, MediaServices.magnifier, MediaServices.forensic, MediaServices.ocr],
    namedEntities: {
      Person: [
        "Christian Lindner",
        // "Monatelang", // "For months"
        // "Lindner", // Christian Lindner
        "Olaf Scholz",
        "Robert Habeck",
        // "Habeck", // Robert Habeck
        // "Haushaltsentwurf", // Budget draft
        "Finanzminister Lindner",
        "Dennis Rohde",
        "Christian Kindler",
        "Boris Pistorius",
        "Omid Nouripour",
        "Hubertus Heil",
        "Fraktionschef Rolf Mützenich",
        // "Streitthema Schuldenbremse", // "The controversial topic of the debt brake"
        "Fraktionsvize Christoph Meyer",
        "Peter Boehringer",
        // "Haushaltspolitisch", // Budget policy
        "Helge Braun",
        "Christian Haase"
      ],
      Location: [
        "Milliardenhöhe",
        "Lockerungsübungen",
        "Kindergeldes",
        "Kinderzuschlags",
        "Ampel",
        "Rekordniveau",
        "Ukraine",
        "Schuldenbremse",
        "Bodensatz",
        "GMA",
        "Haushaltsplan",
        "Leserei",
        "Globale Minderausgabe",
        "Risiken",
        "Zuschüssen",
        "Darlehen",
        "Haushaltsausschusses",
        "Luftikus",
        "Monaten",
      ],
      Organization: [
        "FDP",
        "Haushaltsstaatssekretär Wolf",
        "Sozialdemokraten",
        "SPD",
        "Kürzungen",
        "Nato",
        "Sondervermögen Bundeswehr",
        "Schuldenbremse SPD",
        "Mützenich",
        "Maßnahmenpaket",
        "AfD",
        "gehört",
        "Einzelplänen",
        "Deutsche Bahn AG",
        "Autobahn GmbH",
        "Bundestag",
        "Die Union",
        "CDU",
        "RBB",
      ]
    },
    domainAnalyses: {
      factChecker: ["Bundesverband Digitalpublisher und Zeitungsverleger"]
    },
    credibilitySignals: {
      topic: [
        "Economy and Resources",
        "Law and Justice System",
        "Security",
        "Defense and Well-being",
        "Politics",
      ],
      genre: ["Objective reporting"],
      persuasionTechniques: [
        "Appeal to Authority",
        "Appeal to fear/prejudice",
        "Appeal to Hypocrisy",
        "Appeal to Popularity",
        "Appeal to values",
        "Consequential oversimplification",
        "Conversation killer",
        "Doubt",
        "Guilt by association",
        "Loaded language",
        "Name calling or labeling",
        "Questioning the reputation",
      ],
      subjectivity: [
        "Subjective sentences detected (9/80)"
      ],
    }
  },
  {
    url: "https://x.com/AZUelzen/status/1579020567738712066",
    mediaType: MediaType.none,
    services: [],
    namedEntities: {
      URL: [] // There's one here that's undefined.
    },
    domainAnalyses: {
      factChecker: ["Bundesverband Digitalpublisher und Zeitungsverleger"]
    },
    extractedURLAnalyses: {
      "https://www.az-online.de/politik/spd-cdu-auszaehlung-wahl-in-niedersachsen-ergebnisse-hochrechnungen-prognosen-landtagswahl-2022-weil-althusmann-ministerpraesident-zr-91836603.html": LinkResult.positive
    },
    credibilitySignals: {
      topic: [
        "Politics"
      ],
      genre: ["Objective reporting"],
      persuasionTechniques: [
        "Name calling or labeling" // From the translation, I don't think so
      ],
      subjectivity: [
        "None detected"
      ],
    }
  },
  // Deepfake Image
  {
    url: "https://pbs.twimg.com/media/F9CTQ2SXQAEYnPO.jpg",
    mediaType: MediaType.image,
    services: [MediaServices.magnifier, MediaServices.forensic, MediaServices.ocr],
    hasScrapedText: false,
    deepFakeImageScores: {"https://www.newtral.es/foto-hombre-ninos-gaza/20231030/": "0.82"}
  },
  // Extra Breitbart
  {
    url: "https://www.breitbart.com/politics/2024/04/15/exclusive-tim-scott-prejudiced-trump-trial-an-injustice-driving-black-voters-to-gop-they-want-fair-justice-system/",
    mediaType: MediaType.image,
    imageGridIndex: 0,
    services: [MediaServices.metadata, MediaServices.magnifier, MediaServices.forensic, MediaServices.ocr],
    namedEntities: {
      Person: [
        "Tim Scott",
        "Donald Trump",
        "Joe Biden",
        // "Trump ", // Same guy
        // "Scott",  // Same guy
        // "Trump.” Scott",
        // "Bragg—the", // It's missed District Attorney Alvin Bragg
        "Lady Justice", // This one's debatable since Lady Justice isn't really a "person", but I'll allow it
        "Juan Merchan",
        // "May", // This is a month not a person
        // "American,” Scott", // No
        // "Donald Trump,” Scott", // No. Smart quotes seem to really confuse the named entity recognition
      ],
      Location: [
        "New York",
        // "District Attorney Alvin Bragg", // Should be a person
        "America",
        "United States—the", // Again hyphens... I think these are mdashes
        "United States—is",
      ],
      Organization: [
        "Breitbart News",
        "Democrats", // In this case, the context of the word makes it more like people
        "Republican Party",
        "Democrat", // Not really an organisation
        "Democratic Party", // Also not really an organisation
      ]
    },
    domainAnalyses: {
      warning: ["OpenSources", "GDI-Ads", "IFFY", "StratCom"],
      mentions: ["DBKF"]
    },
    extractedURLAnalyses: {
      // There's no links in the article text, so the rest could be flakey
    },
    credibilitySignals: {
      topic: [
        "Religious, Ethical and Cultural",
        "Fairness, Equality and Rights",
        "Law and Justice System",
        "Politics",
      ],
      genre: ["Objective reporting"], // I strongly disagree with this, but that's certainly the genre it's going for...
      persuasionTechniques: [
        "Appeal to Authority",
        "Appeal to fear/prejudice",
        "Causal oversimplification",
        "Conversation killer",
        "Doubt",
        "Exaggeration or minimisation",
        "False dilemma or no choice",
        "Flag Waving",
        "Loaded language",
        "Name calling or labeling",
        "Red herring",
        "Repetition",
      ],
      subjectivity: [
        "Subjective sentences detected (16/47)"
      ],
    }
  },
  // Generic
  {
    url: "https://www.bbc.co.uk/sport/tennis/66041547",
    mediaType: MediaType.image,
    imageGridIndex: 0,
    services: [MediaServices.metadata, MediaServices.magnifier, MediaServices.forensic, MediaServices.ocr],
    namedEntities: {
      Person: [
        "Grigor Dimitrov",
        "Sho Shimabukuro",
        "Katie Boulter",
        "Daria Saville",
        "Suella Braverman",
        "Lucy Frazer",
        "Sally Bolton",
        "Casper Ruud",
        "Marin Cilic",
        // "Katie Boulter", // Missed
        // "Dimitrov", // Same guy
        // "Rain", // Wilson? I don't think so
      ],
      Location: [
        "Wimbledon",
        // "Boulter", // This is a person
        "Downing Street",
        // "Grand National" Not a location
      ],
      Organization: [
        "Just Stop Oil",
        "All England Club",
        "AELTC",
        // "Centre Court View",// No. Not even really a location, in context
        // "Australian Saville",// Person "Daria Saville"
        "BBC Sport",
        // "Shimabukuro", Person "Sho Shimabukuro"
        "Metropolitan Police",
      ]
    },
    domainAnalyses: {
      factChecker: ["Public Interest News Foundation"]
    },
    extractedURLAnalyses: {
      // There's no links in the article text, so the rest could be flakey
    },
    credibilitySignals: {
      topic: [
      "Economy and Resources",
      "Religious, Ethical and Cultural",
      "Crime and Punishment",
      "Security, Defense and Well-being",
      "Politics",
      ],
      genre: ["Objective reporting"], // I strongly disagree with this, but that's certainly the genre it's going for...
      persuasionTechniques: [
        "Appeal to fear/prejudice",
        "Conversation killer",
        "Doubt",
        "Exaggeration or minimisation",
        "False dilemma or no choice", // I think no
        "Loaded language",
        "Name calling or labeling",
        "Red herring",
        "Repetition",
        "Slogans", // I think no
      ],
      subjectivity: [
        "Subjective sentences detected (2/34)"
      ],
    }
  },
  {
    url: "https://www.bbc.co.uk/news/av/world-europe-54923014",
    mediaType: MediaType.image,
    imageGridIndex: 0,
    services: [MediaServices.metadata, MediaServices.magnifier, MediaServices.forensic, MediaServices.ocr],
    namedEntities: {
      Person: [
        "Mehdi Mammadov",
        "Orla Guerin",
        "Goktay Koraltan",
        "Claire Read",
      ],
      Location: [
        "Nagorno", // Actually, this should be hyphenated with Karaback
        "Karabakh",
        "Azerbaijan",
        "Armenia",
        // "Azerbaijani", // No
      ],
    },
    domainAnalyses: {
      factChecker: ["Public Interest News Foundation"]
    },
    extractedURLAnalyses: {
      // "https://www.bbc.co.uk/news/world-europe-54324772": LinkResult.positive // Seems to have been missed
    },
    credibilitySignals: {
      topic: [
      "Religious, Ethical and Cultural",
      "Crime and Punishment",
      "Security, Defense and Well-being",
      "International Relations",
      ],
      genre: ["Opinionated News"], // Is it? I don't think so, really
      persuasionTechniques: [
        "Loaded language", // Not really
        "Name calling or labeling", // "Azerbaijani soldier" isn't really a name
      ],
      subjectivity: [
        "Subjective sentences detected (1/5)" // Not sure about this one
      ],
    }
  },
  // Facebook
  // Fails: https://www.facebook.com/sheffieldstar/posts/pfbid02QjULn8jvSegQ93FNdnoGAApgSsQjvMX5WD2eRG5bDNQzSmefX1v5ax7G9YEVrj5xl
  {
    url: "https://www.facebook.com/sheffieldstar/videos/out-in-sheffield-with-john-burkhill-and-his-many-many-fans/458905073200654",
    mediaType: MediaType.video,
    videoGridIndex: 0,
    services: [MediaServices.analysisVideo, MediaServices.keyframes, MediaServices.videoDownload, MediaServices.videoDownloadGeneric],
    namedEntities: {
      Person: ["John Burkhill"]
    },
    extractedURLAnalyses: {
      // Fails
    },
    credibilitySignals: {
      topic: [
      "Politics", // No?
      ],
      genre: ["Satire"], // It's not
      persuasionTechniques: [
        "Appeal to Popularity" // Not really
      ],
      subjectivity: [
        "None detected"
      ],
    }
  },
  // Instagram
  {
    url: "https://www.instagram.com/bill_posters_uk/p/CVAksOjMuQu/?img_index=1",
    mediaType: MediaType.video,
    services: [MediaServices.videoDownloadGeneric],
    namedEntities: {
      Person: [
        // "Misa", // Not a person
        "Marcel Duchamp",
        "Marina Abramović",
        "Mark Zuckerberg",
        "Kim Kardashian",
        "Morgan Freeman",
        "Donald Trump",
        "Bill Posters",
        "Daniel Howe",
        // "Path Galleries", // Not a person (Should be a location)
      ],
      Location: [
        "London",
        // "Path Galleries", // Missed
      ],
      Organization: [
        "PUBLIC FACES",
        // Misses BIG DADA
      ],
      Hashtag: [
        "#misart",
        "#misaartmarket",
        "#billposters",
      ],
      UserID: [
        "misa",
        "dapper_labs",
        "vdpenelope_",
        "pathgalleries",
        "anika",
        "johann",
        "deeep_artfair",
      ]
    },
    extractedURLAnalyses: {
      // Fails
    },
    credibilitySignals: {
      topic: [
        "Economy and Resources",
        "Religious, Ethical and Cultural",
        "Fairness, Equality and Rights",
        "Security, Defense and Well-being",
        "Politics",
      ],
      genre: ["Satire"], // I don't think so
      persuasionTechniques: [
        // I'm not sure about any of these, tbh...
        "Doubt",
        "Loaded language",
        "Name calling or labeling",
        "Repetition",
        "Slogans",
      ],
      subjectivity: ["Subjective sentences detected (1/9)"]
    }
  },
  {
    url: "https://www.instagram.com/reel/CvstPHSg6Yd/?utm_source=ig_web_copy_link&igshid=MzRlODBiNWFlZA==",
    mediaType: MediaType.video,
    services: [MediaServices.videoDownloadGeneric],
    namedEntities: {
      Person: [
        "Nicky Youre",
      ],
      Hashtag: [
        "#reeloftheweek",
      ],
      UserID: [
        "louietheraccoon",
      ]
    },
    extractedURLAnalyses: {
      // Fails
    },
    credibilitySignals: {
      topic: [
        "Religious, Ethical and Cultural",
        "Politics",
      ],
      genre: ["Satire"], // I don't think so
      persuasionTechniques: [
        "Repetition", // No
      ],
      subjectivity: ["None detected"]
    }
  },
  // Twitter
  {
    url: "https://twitter.com/NatGeo/status/1285094685485289472",
    mediaType: MediaType.none,
    namedEntities: {
      Organization: [
        // "sun", // Should be a location, if anything?
      ],
      URL: [
        // Another one of those undefined URLs
      ]
    },
    extractedURLAnalyses: {
      "https://on.natgeo.com/3eOgJRg": LinkResult.none
    },
    credibilitySignals: {
      topic: [
        "Security, Defense and Well-being",
      ],
      genre: ["Satire"], // I don't think so
      persuasionTechniques: [
        "Appeal to fear/prejudice",
        "Repetition", // No
      ],
      subjectivity: ["None detected"]
    }
  },
  {
    url: "https://twitter.com/ProfMarkMaslin/status/1679016022190313473",
    mediaType: MediaType.none,
    namedEntities: {
      Organization: [
        // "Global", // No
      ],
      URL: [
        // Another one of those undefined URLs
      ]
    },
    extractedURLAnalyses: {
      // Fails
    },
    credibilitySignals: {
      topic: [
        "Economy and Resources",
      ],
      genre: ["Opinionated News"], // I don't think so
      persuasionTechniques: [
        "Appeal to fear/prejudice",
        "Exaggeration or minimisation",
        "Loaded language",
        "Repetition",
      ],
      subjectivity: ["None detected"]
    }
  },
  // Mastodon
  {
    url: "https://fosstodon.org/@davidwilby/109313349220686853",
    mediaType: MediaType.none,
    credibilitySignals: {
      topic: [
        // These are not correct
        "Security, Defense and Well-being",
        "Health and Safety"
      ],
      genre: ["Satire"], // I don't think so (Seems to be the default when it doesn't know?)
      persuasionTechniques: [
        // None of these!
        // "Loaded language",
        // "Name calling or labeling",
        // "Repetition"
      ],
      subjectivity: ["Subjective sentences detected (1/2)"] // "Toot toot." is not a subjective sentence
    }
  },
  // Telegram
  // Fails: https://t.me/s/testshef4/23
  {
    url: "https://t.me/s/testshef4/40",
    mediaType: MediaType.none,
    credibilitySignals: {
      topic: [
        // These are not correct
        "Security, Defense and Well-being", // Not sure
      ],
      genre: ["Satire"], // I don't think so (Seems to be the default when it doesn't know?)
      persuasionTechniques: [
        // None of these!
        // "Doubt",
        // "Loaded language",
      ],
      subjectivity: ["None detected"] // "Toot toot." is not a subjective sentence
    }
  },
  // Fails: https://www.t.me/c/1787134414/2015
  // Fails: http://www.t.me/AllesAusserMainstream/17936
  // Fails: https://www.t.me/coronavirushilfe/196900
  // I think we need JS to access this: https://web.archive.org/web/20220827111538/https://t.me/Kees71234/34
  // Using the https://web.archive.org/web/20220428051112/https://t.me/s/Kees71234/34 version just gives a lot of
  // duplicated profile pictures.
  // Fails: https://www.t.me/WASDIEMEDIENNICHTZEIGEN/3160
  // Fails: https://archive.vn/o/TeDIW/https://t.me/ATTILAHILDMANN/26291
  // Fails: https://www.t.me/Kulturstudio/20514
  {
    url: "https://www.t.me/QUERDENKEN_711/1088",
    mediaType: MediaType.none,
    extractedURLAnalyses: {
      // "http://spreadshirt.de": ?? // Missing
      "https://t.co/4AkKRFywd8?amp=1": LinkResult.none,
      "https://t.me/QUERDENKEN711": LinkResult.none,
      "https://t.me/QUERDENKEN711_aktiv": LinkResult.none,
      "https://t.me/QUERDENKEN_711": LinkResult.none,
      "https://twitter.com/Crazyca07572857/status/1334513909022208001?s=20": LinkResult.none,
    },
    credibilitySignals: {
      topic: [
        "Religious, Ethical and Cultural", // Tenuous
        "Security, Defense and Well-being" // Don't think so, possibly debatable, but highly contextual
      ],
      genre: ["Satire"], // I don't think so (Seems to be the default when it doesn't know?)
      persuasionTechniques: [
        "Appeal to Hypocrisy",
        "Guilt by association",
        "Loaded language",
        "Name calling or labeling",
        "Questioning the reputation", // Maybe this one, but not the others, I don't think
        "Repetition",
      ],
      subjectivity: ["Subjective sentences detected (2/2)"] // "Toot toot." is not a subjective sentence
    }
  },
  {
    url: "https://www.t.me/rian_ru/181445",
    mediaType: MediaType.video,
    videoGridIndex: 0,
    services: [MediaServices.metadata, MediaServices.videoDownload],
    domainAnalyses: {
      mentions: ["DBKF", "Hamilton 2.0"]
    },
    credibilitySignals: {
      topic: [
        "Crime and Punishment",
        "Security, Defense and Well-being"
      ],
      genre: ["Satire"], // I guess not (Seems to be the default when it doesn't know?)
      persuasionTechniques: [
        "Loaded language",
      ],
      subjectivity: ["None detected"] // "Toot toot." is not a subjective sentence
    }
  },
  {
    url: "https://web.archive.org/web/20230921084048/https://t.me/KremlinPeresmeshnik/17860",
    domainAnalyses: {
      warning: ["StratCom"] // Is this web.archive.org or t.me/KremlinPeresmeshnik?
    },
    namedEntities: {
      Person: [
        // Seems to find a URL
      ],
      Location: ["Copy"], // Not a location
      URL: [] // Another empty URL
    },
    mediaType: MediaType.none,
    credibilitySignals: {
      topic: [
        "Security, Defense and Well-being",
        "Politics"
      ],
      genre: ["Opinionated News"], // I guess not (Seems to be the default when it doesn't know?)
      persuasionTechniques: [
        "Loaded language",
      ],
      subjectivity: ["None detected"]
    }
  },
  {
    url: "https://www.t.me/WendezeitHannover/15379",
    mediaType: MediaType.video,
    services: [MediaServices.metadata, MediaServices.videoDownload],
    // Currently fails due to https://github.com/GateNLP/we-verify-app-assistant/issues/201
    // deepFakeVideoScores: {
    //   "https://factcheck.afp.com/doc.afp.com.34HC6MY": "0.95",
    // },
    namedEntities: {
      Location: [
        "Bundesrepublik Deutschland",
        "Berlin"
      ], // Not a location
      URL: [] // Another empty URL
    },
    credibilitySignals: {
      topic: [
        "Security, Defense and Well-being",
        "Politics"
      ],
      genre: ["Opinionated News"], // I guess not (Seems to be the default when it doesn't know?)
      persuasionTechniques: [
        "Loaded language",
        "Name calling or labeling",
        "Slogans"
      ],
      subjectivity: ["Subjective sentences detected (1/2)"]
    }
  },
  // vk
  {
    url: "https://vk.com/wall-57424472_432130",
    mediaType: MediaType.image,
    imageGridIndex: 0,
    services: [MediaServices.magnifier, MediaServices.metadata, MediaServices.forensic, MediaServices.ocr],
    credibilitySignals: {
      topic: [
        "Crime and Punishment",
        "Security, Defense and Well-being"
      ],
      genre: ["Objective reporting"],
      persuasionTechniques: [
        "Conversation killer",
        "Doubt",
        "Loaded language",
        "Name calling or labeling",
      ],
      subjectivity: ["Subjective sentences detected (1/5)"]
    }
  },
  // Worked first time but now fails. Retry later?
  // {
  //   url: "https://vk.com/wall-133169189_46229",
  //   mediaType: MediaType.none,
  //   credibilitySignals: {
  //     topic: [
  //       "Economy and Resources",
  //       "Religious, Ethical and Cultural"
  //     ],
  //     genre: ["Satire"], // Unlikely given track record
  //     persuasionTechniques: [
  //       "Appeal to Hypocrisy",
  //       "Appeal to values",
  //       "Doubt",
  //       "Exaggeration or minimisation",
  //       "Loaded language",
  //       "Name calling or labeling",
  //       "Slogans",
  //     ],
  //     subjectivity: ["Subjective sentences detected (3/10)"]
  //   }
  // },
  // Hangs: https://vk.com/video561960677_456241269
  // Fails: https://vk.com/wall623312115_141404
  // Fails: https://vk.com/video-211789668_456239323?list=e1f1c6e5197baac8cb
  // Fails: https://vk.com/video-52620949_456272679?list=3cac315e4618b0ced9
  // Fails: https://vk.com/wall634116626_1884?fbclid=IwAR3Y1XdjMQ6ix_PPuoab8hjUOUoYRQ927qCGnpTTiA0LXrWMiDrNN__91xQ
  // Fails: https://vk.com/wall621851320_118223?fbclid=IwAR3qda9A_OzbVzQ2sMjVA9IhwhVGmoS5y57soGOt7FHcTdhLZ1NFRTocJrU
  {
    //  Not actually that useful.
    // The extracted text is "video_watermark1671035262327.mp4", which makes me think the video isn't loading properly
    url: "https://m.vk.com/video-158918739_456243237?list=6859800277e72a8906&from=wall-158918739_122513",
    mediaType: MediaType.video,
    services: [MediaServices.videoDownloadGeneric],
  },
  // Now seems to fail too
  // {
  //   url: "https://vk.com/revolt7?w=wall599120238_107624",
  //   mediaType: MediaType.none,
  //   credibilitySignals: {
  //     topic: [
  //       "Security, Defense and Well-being",
  //     ],
  //     genre: ["Opinionated News"], // I guess not (Seems to be the default when it doesn't know?)
  //     persuasionTechniques: [
  //       "Causal oversimplification",
  //       "Conversation killer",
  //       "Doubt",
  //       "Loaded language",
  //     ],
  //     subjectivity: ["None detected"]
  //   }
  // },
  {
    url: "https://vk.com/video-218745699_456240191",
    mediaType: MediaType.video,
    services: [MediaServices.videoDownloadGeneric],
    credibilitySignals: {
      topic: [
        "Security, Defense and Well-being",
        "Politics"
      ],
      genre: ["Satire"], // I guess not (Seems to be the default when it doesn't know?)
      persuasionTechniques: [
        // I somehow doubt these
        "Repetition",
        "Slogans",
        "Loaded language",
      ],
      subjectivity: ["None detected"]
    }
  },
  // rutube - I'm guessing there should be a video here, but there's not...
  {
    url: "https://rutube.ru/video/884815b7a9e674dd27bf36cc51d3b0d9/?r=wd&t=1409",
    mediaType: MediaType.image,
    imageGridIndex: 0,
    services: [MediaServices.magnifier, MediaServices.metadata, MediaServices.forensic, MediaServices.ocr],
    domainAnalyses: {
      //  Seems a bit harsh if this is basically just "Russion YouTube", although I'm not sure if that's actually the case
      warning: ["StratCom"]
    },
    extractedURLAnalyses: {
      // There's lots, but I'm not sure if any of them are actually stable
    },
    credibilitySignals: {
      topic: [
        // Empty?!
      ],
      genre: ["Opinionated News"], // How can it know if there's no topic
      persuasionTechniques: [
        "Doubt",
        "Loaded language",
        "Questioning the reputation",
        "Repetition",
        "Slogans",
      ],
      subjectivity: ["Subjective sentences detected (1/5)"]
    }
  },

  // Twitter image post
  {
    url: "https://twitter.com/vesinfiltro/status/1253122594976468993/photo/1",
    mediaType: MediaType.image,
    services: [MediaServices.analysisImage, MediaServices.magnifier, MediaServices.forensic, MediaServices.ocr]
  },
  // Twitter video post
  {
    url: "https://twitter.com/NatGeo/status/1334635273888514048/video/1",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.video,
    services: [MediaServices.metadata, MediaServices.videoDownload]
  },
  // Youtube video
  {
    url: "https://www.youtube.com/watch?v=UXrkN0iQmZQ",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.iframe,
    services: [MediaServices.analysisVideo, MediaServices.keyframes, MediaServices.thumbnails, MediaServices.videoRights],
    hasScrapedText: false
  },
  // Youtube shorts
  {
    url: "https://www.youtube.com/shorts/RMGOds6SxF0",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.noEmbed,
    services: [MediaServices.videoDownloadGeneric, MediaServices.keyframes],
    hasScrapedText: false
  },
  // Facebook post with video
  {
    url: "https://www.facebook.com/natgeo/videos/10157990199633951",
    videoGridIndex: 0,
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.video,
    services: [MediaServices.analysisVideo, MediaServices.keyframes, MediaServices.videoDownload, MediaServices.videoDownloadGeneric]
  },
  // Telegram post with video
  {
    url: "https://t.me/WeAreBREITBART/13745",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.video,
    services: [MediaServices.metadata, MediaServices.videoDownload]
  },
  // Telegram post with video - Fails, goes to the group page
  // {
  //   url: "https://t.me/disclosetv/13970",
  //   mediaType: MediaType.video,
  //   mediaStatus: MediaVideoStatus.video,
  //   services: [MediaServices.metadata, MediaServices.videoDownload]
  // },
  // Instagram post with an image
  {
    url: "https://www.instagram.com/p/CI2b-3usJoH/",
    mediaType: MediaType.image,
    services: [MediaServices.magnifier, MediaServices.forensic, MediaServices.ocr]
  },
  // Instagram post with a video reel
  {
    url: "https://www.instagram.com/p/C8JwcyOiFDD/",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.noEmbed,
    services: [MediaServices.videoDownloadGeneric]
  },
  // TikTok video post
  // TO BE DELETED?: Stopped testing tiktok endpoint as we are no longer able to scrape them
  // {
  //   url: "https://www.tiktok.com/@deeptomcruise/video/7223086851236646149",
  //   mediaType: MediaType.video,
  //   mediaStatus: MediaVideoStatus.noEmbed,
  //   services: [MediaServices.videoDownloadTiktok]
  // },
  // VK link with images
  // MF: If you look at the post, it's definitely a video. The only image is the avatar of OP, which isn't loaded
  // because the backend loads the _post_ rather than the _page_, so the avatar isn't seen.
  {
    url: "https://vk.com/wall-57424472_432185",
    mediaType: MediaType.noEmbed,
    services: [MediaServices.videoDownloadGeneric]
  },
  // VK link with embedded video
  {
    url: "https://vk.com/video-221416054_456296074",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.noEmbed,
    services: [MediaServices.videoDownloadGeneric]
  },
  // Vimeo video post
  {
    url: "https://vimeo.com/389685467",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.iframe,
    services: [MediaServices.videoDownloadGeneric],
    hasScrapedText: false
  },
  // Dailymotion video post
  {
    url: "https://www.dailymotion.com/video/x91gv4a",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.iframe,
    services: [MediaServices.videoDownloadGeneric],
    hasScrapedText: false
  },
  // Mastodon link with youtube video link
  {
    url: "https://mstdn.social/@BBC/105203076554056414",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.video,
    services: [MediaServices.videoDownload],
  },
  // Mastodon link with embedded video
  {
    url: "https://mstdn.social/@dtnsshow/112728823075224415",
    mediaType: MediaType.video,
    mediaStatus: MediaVideoStatus.video,
    services: [MediaServices.videoDownload, MediaServices.metadata]
  },
].forEach(({
  url,
  videoGridIndex,
  imageGridIndex,
  mediaType,
  mediaStatus,
  services,
  hasScrapedText = true,
  namedEntities = {},
  domainAnalyses = {},
  extractedURLAnalyses = {},
  credibilitySignals = {},
  deepFakeImageScores = {},
  deepFakeVideoScores = {},
}) => {
  test(`Test assistant media services for url: ${url}`, async ({
    page,
    extensionId
  }) => {

    // Navigate to the assistant page
    await page.goto(`chrome-extension://${extensionId}/popup.html#/app/assistant/`);
    // Accept local storage usage
    await page.getByText("Accept").click();

    // Component to display media should not be displayed at the start
    await expect(page.getByTestId("url-media-results")).not.toBeVisible();

    // Choose to enter url instead of uploading a file
    await page.getByTestId("assistant-webpage-link").click();
    await page.locator("[data-testid='assistant-url-selected-input'] input").fill(url);
    await page.getByTestId("assistant-url-selected-analyse-btn").click();

    // Expecting a media post with images or video
    if (mediaType != MediaType.none) {
      await expect(page.getByTestId("url-media-results")).toBeVisible();
    }
    else {
      await expect(page.getByTestId("url-media-results")).not.toBeVisible();
    }

    // If multiple images/videos exist, click on the media grid first
    if (Number.isInteger(videoGridIndex))
      await page.getByTestId("assistant-media-grid-video-" + videoGridIndex).click();

    if (Number.isInteger(imageGridIndex))
      await page.getByTestId("assistant-media-grid-image-" + imageGridIndex).click();


    // Check that media exists for image and video posts and that all expected services are shown
    switch (mediaType) {
      case MediaType.image:
        await expect(page.getByTestId("assistant-media-image")).toBeVisible();
        await checkMediaServices(page, services)
        break;
      case MediaType.video:
        await expect(page.getByTestId("assistant-media-video-container")).toBeVisible();
        if (mediaStatus !== null && mediaStatus !== undefined) {
          switch (mediaStatus) {
            case MediaVideoStatus.iframe:
              await expect(page.getByTestId("assistant-media-video-iframe")).toBeVisible();
              break;
            case MediaVideoStatus.video:
              await expect(page.getByTestId("assistant-media-video-tag")).toBeVisible();
              break;
            case MediaVideoStatus.noEmbed:
              await expect(page.getByTestId("assistant-media-video-noembed")).toBeVisible();
              break;

          }
        }
        await checkMediaServices(page, services)
        break;
      case MediaType.none:
        await expect(page.getByTestId("assistant-media-video-container")).not.toBeVisible();
        break;
    }

    if (hasScrapedText) {
      await expect(page.getByTestId("assistant-text-scraped-text")).toBeVisible();
      // Named entities
      for (const entityType in namedEntities) {
        if (namedEntities[entityType].length > 0){
          await page.getByTestId(entityType+"-dropdown").click();
          for (const entity in namedEntities[entityType]) {
            await expect(page.getByTestId(namedEntities[entityType][entity])).toBeVisible();
          }
        }
      }
      // Page URL domain analysis
      if (Object.keys(domainAnalyses).length > 0){
        await page.getByTestId("url-domain-analysis-button").click({timeout: 120000})
        for (const sourceCred in domainAnalyses) {
          const sourceCredResults = page.getByTestId("sourceCred-"+sourceCred);
          for (const lookupInx in domainAnalyses[sourceCred]) {
            await expect(sourceCredResults.getByTestId("source-"+domainAnalyses[sourceCred][lookupInx])).toBeVisible()
          }
        }
      }
      // Extracted URL domain analysis
      if (Object.keys(extractedURLAnalyses).length > 0){
        for (const url in extractedURLAnalyses) {
          await expect(page.getByTestId("url-domain-analysis").locator("[href=\""+url+"\"]")).toBeVisible();
          const resultRow = page.getByTestId("url-domain-analysis").locator("div.MuiGrid2-container").filter({ has: page.locator(`text="${url}"`) });

          if (extractedURLAnalyses[url] != null) {
            await expect(resultRow.locator(">div")).toHaveCount(3);
            await expect(resultRow.getByTestId(extractedURLAnalyses[url])).toBeVisible();
          }
          else {
            await expect(resultRow.locator(">div")).toHaveCount(2);
          }
        }
      }
      // Credibility signals
      // TODO: Check the highlighted sections and clickable menu
      if (Object.keys(credibilitySignals).length > 0){
        for (const signal in credibilitySignals) {
          for (const foundIndex in credibilitySignals[signal]) {
            await expect(page.getByTestId(signal+"-result")).toContainText(credibilitySignals[signal][foundIndex]);
          }
        }
      }
    }
    if (Object.keys(deepFakeImageScores).length > 0){
      for (const claimUrl in deepFakeImageScores) {
        await expect(page.getByTestId("dbkf_image_warning_"+claimUrl)).toContainText(deepFakeImageScores[claimUrl]);
      }
    }
    if (Object.keys(deepFakeVideoScores).length > 0){
      for (const claimUrl in deepFakeVideoScores) {
        await expect(page.getByTestId("dbkf_video_warning_"+claimUrl)).toContainText(deepFakeVideoScores[claimUrl]);
      }
    }
  });
});

async function checkMediaServices(page, availableServices) {
  // Checks that expected services are shown
  for (const serviceId of availableServices) {
    await expect(page.getByTestId(serviceId)).toBeVisible();
  }

  // Ensure disabled services are not showing
  for (const serviceKey in MediaServices) {
    const serviceId = MediaServices[serviceKey];
    if (!availableServices.includes(serviceId))
      await expect(page.getByTestId(serviceId)).not.toBeVisible();
  }

}
