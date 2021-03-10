type TKPartnerInfos = {
  partnerName: string;
  urlLogo: string;
  urlRedirection: string;
};

const PARTNERS: Array<TKPartnerInfos> = [
  {
    partnerName: "UNHCR",
    urlLogo: "https://www.unhcr.org/assets/img/unhcr-logo.png",
    urlRedirection: "https://www.unhcr.org"
  },
  {
    partnerName: "CartONG",
    urlLogo:
      "https://www.cartong.org/sites/cartong/files/images/CartONG_logo_long_0_0_0.png",
    urlRedirection: "https://www.cartong.org"
  },
  {
    partnerName: "Syldavie",
    urlLogo:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Syldavian_lippu.jpg/1280px-Syldavian_lippu.jpg",
    urlRedirection: "https://fr.wikipedia.org/wiki/Syldavie"
  }
];

export { TKPartnerInfos };
export { PARTNERS };