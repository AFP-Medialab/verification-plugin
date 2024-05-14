const engines = {
  bing: {
    url: {
      target:
        "https://www.bing.com/images/search?q=imgurl:{imgUrl}&view=detailv2" +
        "&iss=sbi&FORM=IRSBIQ&redirecturl=https%3A%2F%2Fwww.bing.com" +
        "%2Fimages%2Fdiscover%3Fform%3DHDRSC2#enterInsights",
    },
    image: {
      target: "https://www.bing.com/",
      isExec: true,
    },
  },
  googlelens: {
    url: {
      target: "https://lens.google.com/uploadbyurl?url={url}",
    },
    image: {
      target: "https://lens.google.com/upload",
      isExec: true,
    },
  },
  yandex: {
    url: {
      target: "https://yandex.com/images/search?url={imgUrl}&rpt=imageview",
    },
    image: {
      target: "https://yandex.com/images/",
      isExec: true,
    },
  },
  baidu: {
    url: {
      target: "https://www.baidu.com/",
      isExec: true,
    },
    image: {
      target: "https://www.baidu.com/",
      isExec: true,
    },
  },
  tineye: {
    url: { target: "https://www.tineye.com/search/?&url={imgUrl}" },
    image: {
      target: "https://www.tineye.com/",
      isExec: true,
    },
  },
};

export { engines };
