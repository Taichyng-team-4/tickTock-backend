import catchAsync from "../utils/catchAsync.js";

export const getHome = catchAsync((req, res, next) => {
  res.status(200).json({
    code: 200,
    status: "success",
    data: {
      // Banner
      banner: [
        {
          id: "活動Id",
          image: "/banner/XXX.img",
        },
      ],
      // 類別
      category: [
        {
          enName: "music",
          name: "音樂",
          image: "/image/XXX.png",
        },
      ],
      // 系統公告
      announcement: [
        {
          id: "uuid-123-456-888", // 系統公告 ID : uuid <文字型態>
          title: "系統公告 Title#1", // 系統公告 Title <文字型態>
          contents: "系統公告 內容#1 ....", // 系統公告 內容 <文字型態>
          publishStartTime: "2023/03/01 00:00:00 GMT+8", // 公告開始時間 日期時間 <文字型態>
          publishEndTime: "2023/06/18 18:00:00 GMT+8", // 公告結束時間 日期時間 <文字型態>
        },
        {
          id: "uuid-123-456-999", // 系統公告 ID : uuid <文字型態>
          title: "系統公告 Title#2", // 系統公告 Title <文字型態>
          contents: "系統公告 內容#2 ....", // 系統公告 內容 <文字型態>
          publishStartTime: "2023/03/01 00:00:00 GMT+8", // 公告開始時間 日期時間 <文字型態>
          publishEndTime: "2023/06/18 18:00:00 GMT+8", // 公告結束時間 日期時間 <文字型態>
        },
      ],
      // News 最新消息
      news: [
        {
          id: "uuid-123-456-888", // 系統公告 ID : uuid <文字型態>
          title: "最新消息 Title#1", // 系統公告 Title <文字型態>
          contents: "最新消息 內容#1 ....", // 系統公告 內容 <文字型態>
          publishStartTime: "2023/03/01 00:00:00 GMT+8", // 公告開始時間 日期時間 <文字型態>
          publishEndTime: "2023/06/18 18:00:00 GMT+8", // 公告結束時間 日期時間 <文字型態>
        },
        {
          id: "uuid-123-456-999", // 系統公告 ID : uuid <文字型態>
          title: "最新消息 Title#2", // 系統公告 Title <文字型態>
          contents: "最新消息 內容#2 ....", // 系統公告 內容 <文字型態>
          publishStartTime: "2023/03/01 00:00:00 GMT+8", // 公告開始時間 日期時間 <文字型態>
          publishEndTime: "2023/06/18 18:00:00 GMT+8", // 公告結束時間 日期時間 <文字型態>
        },
      ],
      // 確認是否有 News
      hasNews: false,
      // 合作夥伴
      partners: [
        {
          id: "partnerNo1", // 合作夥伴 ID <文字型態>
          name: "合作夥伴 名稱", // 合作夥伴 名稱 <文字型態>
          homeLink: "https://www.hexschool.com/1", // 合作夥伴 官網 連結 <文字型態>
          image: "https://aaa.bbb.ccc/image1.png", // 合作夥伴 圖示鏈結
        },
      ],
    },
  });
});

export const getPartner = catchAsync((req, res, next) => {
  res.status(200).json({
    code: 200,
    status: "success",
    data: [
      {
        partnerId: "partnerNo1", // 合作夥伴 ID <文字型態>
        partnerName: "合作夥伴 名稱", // 合作夥伴 名稱 <文字型態>
        partnerHomeLink: "https://www.hexschool.com/1", // 合作夥伴 官網 連結 <文字型態>
        partnerImage: "https://aaa.bbb.ccc/image1.png", // 合作夥伴 圖示鏈結
      },
      {
        partnerId: "partnerNo2", // 合作夥伴 ID <文字型態>
        partnerName: "合作夥伴 名稱#2", // 合作夥伴 名稱 <文字型態>
        partnerHomeLink: "https://www.hexschool.com/2", // 合作夥伴 官網 連結 <文字型態>
        partnerImage: "https://aaa.bbb.ccc/image2.png", // 合作夥伴 圖示鏈結
      },
    ],
  });
});

export const getFaqs = catchAsync((req, res, next) => {
  res.status(200).json({
    code: 200,
    status: "success",
    data: [
      {
        faqCategory: "系統類", // 常見問題類別 <文字型態>
        list: [
          {
            faqId: "FAQ-S-0001", // 常見問題編號 <文字型態>
            faqDescription: "常見問題敘述S#1", // 常見問題敘述 <文字型態>
            faqSolution: "問題解決方法S#1", // 問題解決方法 <文字型態>
          },
          {
            faqId: "FAQ-S-0002", // 常見問題編號 <文字型態>
            faqDescription: "常見問題敘述S#2", // 常見問題敘述 <文字型態>
            faqSolution: "問題解決方法S#2", // 問題解決方法 <文字型態>
          },
        ],
      },
      {
        faqCategory: "票務類", // 常見問題類別 <文字型態>
        list: [
          {
            faqId: "FAQ-T-0001", // 常見問題編號 <文字型態>
            faqDescription: "常見問題敘述T#1", // 常見問題敘述 <文字型態>
            faqSolution: "問題解決方法T#1", // 問題解決方法 <文字型態>
          },
          {
            faqId: "FAQ-T-0002", // 常見問題編號 <文字型態>
            faqDescription: "常見問題敘述T#2", // 常見問題敘述 <文字型態>
            faqSolution: "問題解決方法T#2", // 問題解決方法 <文字型態>
          },
        ],
      },
    ],
  });
});
