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
      "https://www.blogpreston.co.uk/2024/10/what-prestonians-have-made-of-the-friargate-south-revamp-plans/": LinkResult.positive,
      "https://www.blogpreston.co.uk/2024/10/preston-christmas-lights-switch-on-set-to-welcome-in-festive-season-on-the-flag-market/": LinkResult.positive,
      "https://www.blogpreston.co.uk/2024/10/fireworks-displays-for-bonfire-night-2024-in-and-around-preston/": LinkResult.positive,
      "https://www.blogpreston.co.uk/2024/10/corporation-street-bus-gate-brings-in-nearly-1m-in-three-months-as-two-new-bus-lanes-for-city-remain-on-track/": LinkResult.positive,
      "https://www.blogpreston.co.uk/2024/10/preston-photographer-takes-city-down-memory-lane-with-selection-of-1980s-pictures/": LinkResult.positive,
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
        "Rheinischen",
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
  credibilitySignals = {}
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
