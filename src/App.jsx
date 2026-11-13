import React from "react";

const github = "https://github.com/HaoyangJiang-WM";
export const PROFILE_PHOTO_SRC = "/haoyang-jiang.jpg";
const cv = "/Haoyang_Jiang_CV.pdf";
const scholar = "https://scholar.google.com/citations?user=q6923RoAAAAJ";
const email = "hjiang16@wm.edu";

const publications = [
  {
    title: "VTV-FM: Flow Matching through Variational Terminal-Velocity Closure",
    coauthors: "Yuheng Li, Di Yang, Yanhai Xiong, Haipeng Chen, and Yi He",
    venue: "NeurIPS 2026",
    summary: "We help generative models create images and physical simulations by learning curved paths that can speed up and slow down.",
    paper: "https://arxiv.org/abs/2610.00785",
    code: github + "/VTV-FM",
  },
  {
    title: "Physics-Refined Spatiotemporal Forecasting on Open-Boundary Hydrologic Graphs",
    coauthors: "Zhengui Wang, Shenghan Gao, Y. Joseph Zhang, Xingquan Zhu, and Yi He",
    venue: "IEEE ICDM 2026 · Best Paper Award",
    summary: "We use river measurements and physical laws to forecast flows farther ahead, even when upstream inflows are unknown.",
    paper: "https://arxiv.org/abs/2610.01765",
    code: github + "/OpenBoundary",
  },
  {
    title: "Boundary-Consistent Graph Neural Networks for Topological Flux Prediction",
    coauthors: "Bojian Qu, Xingquan Zhu, Jifu Tan, and Yi He",
    venue: "Transactions on Machine Learning Research, 2026",
    summary: "We help models predict fluid flow through a network by estimating what enters from outside the area we can observe.",
    paper: "https://openreview.net/forum?id=31gTIfhoH0",
  },
  {
    title: "Topology-aware Neural Flux Prediction Guided by Physics",
    coauthors: "Jindong Wang, Xingquan Zhu, and Yi He",
    venue: "ICML 2025",
    summary: "We teach models to account for flow direction and physical laws when predicting how water or traffic moves through a network.",
    paper: "https://proceedings.mlr.press/v267/jiang25i.html",
    code: github + "/PhysicsNFP",
  },
  {
    title: "Fredholm Integral Equations Neural Operator (FIE-NO) for Data-Driven Boundary Value Problems",
    coauthors: "and Yongzhi Qu",
    venue: "arXiv preprint, 2024",
    summary: "We train a model to predict how a physical system behaves inside an irregular shape from conditions along its edges.",
    paper: "https://arxiv.org/abs/2408.12389",
  },
  {
    title: "Transfer Operator Learning with Fusion Frame",
    coauthors: "and Yongzhi Qu",
    venue: "arXiv preprint, 2024",
    summary: "We help a model reuse what it learned from one set of physics simulations to solve related problems under new conditions.",
    paper: "https://arxiv.org/abs/2408.10458",
  },
];

function Profile() {
  return (
    <aside className="profile" aria-label="Profile">
      <img src={PROFILE_PHOTO_SRC} alt="Portrait of Haoyang Jiang" className="portrait" />
      <div>
        <h1>Haoyang Jiang</h1>
        <p className="affiliation">
          Ph.D. Candidate in Data Science<br />
          <a href="https://www.wm.edu/">William &amp; Mary</a>
        </p>
        <div className="profile-links" id="contact">
          <a href={"mailto:" + email}>{email}</a>
          <ul className="inline-links" aria-label="Academic profiles">
            <li><a href={cv}>CV</a></li>
            <li><a href={scholar}>Google Scholar</a></li>
            <li><a href={github}>GitHub</a></li>
            <li><a href="https://www.linkedin.com/in/haoyang-jiang-7573872a4/">LinkedIn</a></li>
          </ul>
        </div>
      </div>
    </aside>
  );
}

function Publication({ entry }) {
  return (
    <li className="publication">
      <h3><a href={entry.paper}>{entry.title}</a></h3>
      <p className="authors">
        <strong>Haoyang Jiang</strong>{entry.coauthors.startsWith("and ") ? " " : ", "}{entry.coauthors}
      </p>
      <p className="publication-details">
        <cite>{entry.venue}</cite>
        {entry.code && <a href={entry.code} aria-label={"Code for " + entry.title}>Code ↗</a>}
      </p>
      <p className="publication-summary">{entry.summary}</p>
    </li>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header" id="top">
        <div className="container header-row">
          <a className="wordmark" href="/">Haoyang Jiang</a>
          <nav aria-label="Main navigation">
            <a href="#research">Research</a>
            <a href="#publications">Publications</a>
            <a href="/neural-equation-demos/">Demos</a>
            <a href={cv}>CV</a>
          </nav>
        </div>
      </header>
      <main className="container layout" id="main" tabIndex={-1}>
        <Profile />
        <div className="content">
          <section id="research" aria-labelledby="research-title">
            <h2 id="research-title">Research</h2>
            <p>
              I am a Ph.D. candidate in Data Science at William &amp; Mary,
              advised by Prof. <a href="https://yhe15.people.wm.edu/">Yi He</a>.
              I develop machine learning methods for physical systems, with
              a focus on how boundary conditions and conservation laws can
              inform the way models learn.
            </p>
            <p>
              My current work spans graph learning for transport and hydrologic
              forecasting, neural operators for PDEs, and flow matching for
              scientific data. I am also interested in inverse problems in
              geophysics.
            </p>
            <p className="availability">
              <strong>
                I’m looking for full-time roles and internships, and I welcome research collaborations.
              </strong>
            </p>
          </section>
          <section id="news" aria-labelledby="news-title">
            <h2 id="news-title">News</h2>
            <ul className="news">
              <li><time dateTime="2026-10">Oct 2026</time><span>Our work on open-boundary hydrologic forecasting received the <a href="https://yhe15.people.wm.edu/publication.html">IEEE ICDM Best Paper Award</a>.</span></li>
              <li><time dateTime="2026-09">Sep 2026</time><span><a href="https://arxiv.org/abs/2610.00785">VTV-FM</a> was accepted at NeurIPS 2026.</span></li>
            </ul>
          </section>
          <section id="publications" aria-labelledby="publications-title">
            <h2 id="publications-title">Publications</h2>
            <ul className="publication-list">
              {publications.map((entry) => <Publication key={entry.title} entry={entry} />)}
            </ul>
          </section>
          <section id="projects" aria-labelledby="projects-title">
            <h2 id="projects-title">Demos</h2>
            <p><a href="/neural-equation-demos/">Neural Equation Demos</a> · Interactive comparisons of neural equation models against reference solutions.</p>
          </section>
        </div>
      </main>
      <footer className="site-footer">
        <div className="container footer-row">
          <span>© {new Date().getFullYear()} Haoyang Jiang</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}
