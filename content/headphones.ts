export type HeadphoneCollectionEntry = {
  id: string;
  title: string;
  shortName: string;
  brand: "Apple" | "Sony";
  category: "头戴式" | "入耳式";
  edition: string | null;
  tone: "mint" | "violet";
  image: string | null;
  imageAlt: string;
  imageNote: string;
  sourceUrl: string;
};

/** 耳机独立归档，沿用已有藏品 ID，避免迁移后重复计数或丢失旧链接。 */
export const headphoneCollection: readonly HeadphoneCollectionEntry[] = [
  {
    id: "device-airpods-pro-3",
    title: "AirPods Pro 3",
    shortName: "AirPods Pro 3",
    brand: "Apple",
    category: "入耳式",
    edition: null,
    tone: "mint",
    // https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-pro-3-hero-select-202509?wid=976&hei=916&fmt=jpeg&qlt=90&.v=cmp4MmZ6OWxOeHNNTXh4SzlBNUpEb1RucE9zZTI5eEREaWZpY29lSld3eWVDYXovZDMyN1dXU211bjZoVlVUcWJGcXNRQnFCV0w3WVRjTExvdm1ic1YxRUxFRmRlWDBITzhnRmZ5OTRmaVdKTExiOEFsRmxtQ2Nua0tRSC83MkI
    image: "/devices/airpods-pro-3.jpg",
    imageAlt: "AirPods Pro 3 白色官方商品图，非本人实拍",
    imageNote: "官方商品图 · 非本人实拍",
    sourceUrl: "https://www.apple.com.cn/airpods-pro/",
  },
  {
    id: "device-airpods-max-2",
    title: "AirPods Max 2",
    shortName: "AirPods Max 2",
    brand: "Apple",
    category: "头戴式",
    edition: "午夜色",
    tone: "violet",
    // https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-max-select-202409-midnight_FV1?wid=976&hei=916&fmt=jpeg&qlt=90&.v=azQxRkVJKzd6V3J0aGNqWFhLMzBmdmVWNWdHYnp5cHkwMldsSElEOHpyd0cyWGRFNFZ5QTk3bFlteis2Q2NNaWpENFdPQTN0TWQ4ejhtTWxrUHVDeElGZGV2eWhZaEljUzNSeDlxcDVuWGszbTFldUtUQzN0ellEWHZ3UUFYSS8
    image: "/devices/airpods-max-2-midnight.jpg",
    imageAlt: "AirPods Max 2 午夜色官方商品图，非本人实拍",
    imageNote: "官方商品图 · 非本人实拍",
    sourceUrl: "https://www.apple.com.cn/airpods-max/",
  },
  {
    id: "headphone-sony-wh-1000xm5",
    title: "Sony WH-1000XM5",
    shortName: "WH-1000XM5",
    brand: "Sony",
    category: "头戴式",
    edition: "铂金银",
    tone: "mint",
    // https://www.sonystyle.com.cn/content/dam/sonystyle/products/headphone/wh_1000xm5/product/1000xm5_800x800_s2.jpg
    image: "/headphones/wh-1000xm5-silver.jpg",
    imageAlt: "Sony WH-1000XM5 铂金银官方商品图，非本人实拍",
    imageNote: "官方商品图 · 非本人实拍",
    sourceUrl:
      "https://www.sonystyle.com.cn/products/headphone/wh_1000xm5/wh_1000xm5_s.html",
  },
  {
    id: "headphone-sony-wh-1000xm6",
    title: "Sony WH-1000XM6",
    shortName: "WH-1000XM6",
    brand: "Sony",
    category: "头戴式",
    edition: "黑色",
    tone: "violet",
    // https://www.sonystyle.com.cn/content/dam/sonystyle/products/headphone/wh_1000xm6/product/wh_1000xm6_b1.jpg
    image: "/headphones/wh-1000xm6-black.jpg",
    imageAlt: "Sony WH-1000XM6 黑色官方商品图，非本人实拍",
    imageNote: "官方商品图 · 非本人实拍",
    sourceUrl:
      "https://www.sonystyle.com.cn/products/headphone/wh_1000xm6/wh_1000xm6_b.html",
  },
];
