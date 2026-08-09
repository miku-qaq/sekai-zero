import type { Metadata } from "next";
import { dormantSectors } from "@/content/links";
import { sitePath } from "@/lib/site-path";
import { LinkTerminal } from "../components/link-terminal";
import { PageMasthead } from "../components/page-masthead";
import { SiteFooter } from "../components/site-footer";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "航线终端",
  description:
    "SEKAI / 00 的站内频道、建造装备与公开联系入口，每条航线都记录愿意返回的理由。",
};

export default function LinksPage() {
  return (
    <main id="main-content" className="subpage-main">
      <PageMasthead
        episode="FILE 02"
        eyebrow="ROUTE TERMINAL / COORDINATES ONLINE"
        title="我在互联网留下的航线。"
        lead="不是常用网站大全，也不是一堵没有灵魂的 Logo 墙。每个入口都带着一条我为什么愿意回来、它与这座世界有什么关系的批注。"
        motif="↗"
        tone="violet"
        meta={[
          { label: "当前航线", value: "本站 / 工具 / 联系" },
          { label: "筛选方式", value: "分类 / 搜索 / 随机跃迁" },
          { label: "录入原则", value: "真实关系优先" },
        ]}
      />

      <section
        className="route-index section-shell section-pad"
        aria-labelledby="route-title"
      >
        <div className="section-heading horizontal-heading">
          <div>
            <p className="section-index">01 / ACTIVE ROUTES</p>
            <h2 id="route-title">选择今天要去的频道。</h2>
          </div>
          <p>
            可以按分类筛选、搜索理由与标签，或者让终端替你随机选择一条已确认的航线。
          </p>
        </div>
        <LinkTerminal />
      </section>

      <section className="dormant-section section-pad" aria-labelledby="dormant-title">
        <div className="section-shell">
          <div className="section-heading horizontal-heading">
            <div>
              <p className="section-index">02 / DORMANT SECTORS</p>
              <h2 id="dormant-title">还没有点亮的星域。</h2>
            </div>
            <p>
              邮件联系已经点亮；收藏、朋友与社交主页仍然保持诚实空白，等真实内容确认后再上线。
            </p>
          </div>
          <div className="dormant-grid">
            {dormantSectors.map((sector) => (
              <article key={sector.title}>
                <div>
                  <span className="dormant-dot" aria-hidden="true" />
                  {sector.code}
                </div>
                <h3>{sector.title}</h3>
                <p>{sector.copy}</p>
                <span className="dormant-status">WAITING FOR REAL COORDINATES</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="subpage-next section-shell" aria-labelledby="next-title">
        <span>下一站 / ROUTE 03</span>
        <h2 id="next-title">想知道这座网站为什么这样设计？</h2>
        <a className="button button-primary" href={sitePath("/projects/")}>
          读取制作档案 <span aria-hidden="true">↗</span>
        </a>
      </section>
      <SiteFooter />
    </main>
  );
}
