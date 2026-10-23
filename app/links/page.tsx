import type { Metadata } from "next";
import { linkCategories, linkEntries } from "@/content/links";
import { JourneyNavigation } from "../components/journey-navigation";
import { LinkTerminal } from "../components/link-terminal";
import { PageMasthead } from "../components/page-masthead";
import { SiteFooter } from "../components/site-footer";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "导航终端",
  description:
    "Mikureina 的常用网站导航：影音娱乐、游戏世界、社区收藏、购物数码、学习资料与本站相关入口。",
};

export default function LinksPage() {
  return (
    <main id="main-content" className="subpage-main navigation-page">
      <PageMasthead
        currentHref="/links/"
        title="我愿意再次打开的入口。"
        lead="娱乐、购物与学习，我常去的地方都在这里。"
        meta={[
          {
            label: "已收录",
            value: `${String(linkEntries.length).padStart(2, "0")} 个入口`,
          },
          {
            label: "分类整理",
            value: `${String(linkCategories.length).padStart(2, "0")} 个分区`,
          },
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
            <h2 id="route-title">常用网站，分门别类。</h2>
          </div>
        </div>
        <LinkTerminal />
      </section>

      <JourneyNavigation currentHref="/links/" />
      <SiteFooter />
    </main>
  );
}
