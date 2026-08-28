import type { Metadata } from "next";
import { linkEntries } from "@/content/links";
import { JourneyNavigation } from "../components/journey-navigation";
import { LinkTerminal } from "../components/link-terminal";
import { PageMasthead } from "../components/page-masthead";
import { SiteFooter } from "../components/site-footer";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "导航终端",
  description:
    "Mikureina 喜欢的 Bilibili、Apple、Steam 与 Nintendo Switch，以及 Stanford 学习资料、项目源码和联系入口。",
};

export default function LinksPage() {
  return (
    <main id="main-content" className="subpage-main">
      <PageMasthead
        currentHref="/links/"
        title="我愿意再次打开的入口。"
        lead="这里收录我真正喜欢的 Bilibili、Apple、Steam 与 Nintendo Switch，也连接 Stanford 学习资料、项目源码与联系方式。每个入口都会说明它为什么出现在这里。"
        meta={[
          {
            label: "已收录",
            value: `${String(linkEntries.length).padStart(2, "0")} 个入口`,
          },
          { label: "个人收藏", value: "Bilibili / Apple / Steam / NS" },
          { label: "可以使用", value: "分类 / 搜索 / 随机推荐" },
        ]}
      />

      <section
        className="route-index section-shell section-pad"
        aria-labelledby="route-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="section-index">01 / NAVIGATION TERMINAL</p>
            <h2 id="route-title">选择今天想打开的入口。</h2>
          </div>
          <p>按分类筛选或搜索关键词；随机推荐只会高亮一张卡片，由你决定是否打开。</p>
        </div>
        <LinkTerminal />
      </section>

      <JourneyNavigation currentHref="/links/" />
      <SiteFooter />
    </main>
  );
}
