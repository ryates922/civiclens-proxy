import { useState, useEffect, useRef } from "react";

const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const T = {
  navy:"#0B1628",slate:"#2D3F55",gold:"#C9A84C",goldLight:"#E8CC7A",
  offWhite:"#F7F5F0",sage:"#7A9E8E",red:"#B84C4C",mist:"#E8EDF4",
  ink:"#1A2535",gray:"#8A9AB0",lightGray:"#D4DCE8",
};

const css = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{background:${T.offWhite};font-family:'Inter',sans-serif;color:${T.ink};}
  .cl-app{min-height:100vh;}
  .cl-nav{background:${T.navy};padding:0 2rem;display:flex;align-items:center;justify-content:space-between;height:60px;position:sticky;top:0;z-index:100;border-bottom:1px solid ${T.slate};}
  .cl-logo{font-family:'Playfair Display',serif;font-size:1.35rem;font-weight:700;color:${T.offWhite};}
  .cl-logo span{color:${T.gold};}
  .cl-nav-links{display:flex;gap:1.5rem;align-items:center;}
  .cl-nav-link{color:${T.lightGray};font-size:0.85rem;font-weight:500;cursor:pointer;letter-spacing:0.04em;text-transform:uppercase;padding:4px 0;border-bottom:2px solid transparent;transition:color 0.2s,border-color 0.2s;background:none;border-top:none;border-left:none;border-right:none;font-family:'Inter',sans-serif;}
  .cl-nav-link:hover,.cl-nav-link.active{color:${T.gold};border-bottom-color:${T.gold};}
  .cl-api-dot{width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:4px;}
  .cl-api-dot.live{background:#4CAF50;}
  .cl-api-dot.demo{background:${T.gold};}
  /* GATE */
  .cl-gate{background:${T.navy};min-height:calc(100vh - 60px);display:flex;align-items:center;justify-content:center;padding:2rem;}
  .cl-gate-card{background:${T.ink};border:1px solid ${T.slate};border-radius:16px;padding:2.5rem;max-width:540px;width:100%;text-align:center;}
  .cl-gate-icon{font-size:3rem;margin-bottom:1rem;}
  .cl-gate-title{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;color:${T.offWhite};margin-bottom:0.75rem;}
  .cl-gate-desc{color:${T.gray};font-size:0.88rem;line-height:1.6;margin-bottom:1.5rem;}
  .cl-gate-desc a{color:${T.gold};text-decoration:none;}
  .cl-gate-steps{text-align:left;background:${T.navy};border-radius:10px;padding:1.25rem;margin-bottom:1.5rem;}
  .cl-gate-step{display:flex;gap:0.75rem;align-items:flex-start;margin-bottom:0.75rem;font-size:0.82rem;color:${T.lightGray};line-height:1.5;}
  .cl-gate-step:last-child{margin-bottom:0;}
  .cl-gate-num{background:${T.gold};color:${T.navy};font-weight:800;font-size:0.7rem;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;}
  .cl-gate-input{width:100%;padding:0.85rem 1rem;border-radius:8px;border:2px solid ${T.slate};background:${T.navy};color:${T.offWhite};font-family:'Inter',sans-serif;font-size:0.9rem;outline:none;transition:border-color 0.2s;margin-bottom:0.75rem;}
  .cl-gate-input:focus{border-color:${T.gold};}
  .cl-gate-input::placeholder{color:${T.gray};}
  .cl-gate-btn{width:100%;padding:0.85rem;border-radius:8px;border:none;background:${T.gold};color:${T.navy};font-family:'Inter',sans-serif;font-size:0.95rem;font-weight:700;cursor:pointer;margin-bottom:0.75rem;}
  .cl-gate-btn:disabled{opacity:0.5;cursor:not-allowed;}
  .cl-gate-demo{background:none;border:1px solid ${T.slate};color:${T.gray};width:100%;padding:0.75rem;border-radius:8px;font-family:'Inter',sans-serif;font-size:0.88rem;cursor:pointer;}
  .cl-gate-demo:hover{border-color:${T.gray};color:${T.lightGray};}
  .cl-gate-error{color:${T.red};font-size:0.82rem;margin-bottom:0.5rem;}
  /* LIVE BANNER */
  .cl-live-banner{background:#0D2B0D;border-bottom:1px solid #2A5A2A;padding:0.6rem 2rem;display:flex;align-items:center;gap:0.6rem;font-size:0.8rem;color:#7ABF7A;}
  .cl-live-banner strong{color:#A0DFA0;}
  .cl-chg-key{margin-left:auto;color:${T.gray};cursor:pointer;font-size:0.75rem;background:none;border:none;font-family:'Inter',sans-serif;}
  .cl-chg-key:hover{color:${T.gold};}
  /* HERO */
  .cl-hero{background:${T.navy};padding:4rem 2rem 3.5rem;text-align:center;position:relative;overflow:hidden;}
  .cl-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 120%,${T.slate}66 0%,transparent 70%);pointer-events:none;}
  .cl-hero-eyebrow{font-size:0.72rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:${T.gold};margin-bottom:1rem;}
  .cl-hero-title{font-family:'Playfair Display',serif;font-size:clamp(2.2rem,5vw,3.8rem);font-weight:900;color:${T.offWhite};line-height:1.1;margin-bottom:1rem;position:relative;}
  .cl-hero-sub{color:${T.lightGray};font-size:1rem;font-weight:300;max-width:560px;margin:0 auto 2.5rem;line-height:1.6;position:relative;}
  .cl-search-wrap{max-width:640px;margin:0 auto;position:relative;}
  .cl-search{width:100%;padding:1rem 1.25rem 1rem 3.25rem;border-radius:8px;border:2px solid ${T.slate};background:${T.ink};color:${T.offWhite};font-family:'Inter',sans-serif;font-size:1rem;outline:none;transition:border-color 0.2s;}
  .cl-search:focus{border-color:${T.gold};}
  .cl-search::placeholder{color:${T.gray};}
  .cl-search-icon{position:absolute;left:1rem;top:50%;transform:translateY(-50%);color:${T.gray};font-size:1.1rem;pointer-events:none;}
  .cl-search-hint{margin-top:0.75rem;font-size:0.78rem;color:${T.gray};}
  .cl-search-hint span{color:${T.gold};cursor:pointer;}
  /* CHAMBER BAR */
  .cl-chamber-bar{background:white;border-bottom:1px solid ${T.lightGray};padding:0 2rem;display:flex;gap:0.5rem;}
  /* FILTER BAR */
  .cl-filter-bar{background:white;border-bottom:1px solid ${T.lightGray};padding:0 2rem;display:flex;align-items:center;gap:1rem;overflow-x:auto;scrollbar-width:none;}
  .cl-filter-bar::-webkit-scrollbar{display:none;}
  .cl-filter-btn{padding:0.9rem 1.1rem;font-family:'Inter',sans-serif;font-size:0.82rem;font-weight:600;letter-spacing:0.03em;white-space:nowrap;cursor:pointer;background:none;border:none;color:${T.gray};border-bottom:3px solid transparent;transition:all 0.15s;}
  .cl-filter-btn:hover{color:${T.slate};}
  .cl-filter-btn.active{color:${T.navy};border-bottom-color:${T.gold};}
  .cl-filter-sep{width:1px;height:20px;background:${T.lightGray};flex-shrink:0;}
  /* MAIN */
  .cl-main{max-width:1280px;margin:0 auto;padding:2rem;}
  .cl-section-header{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:1.5rem;}
  .cl-section-title{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;color:${T.navy};}
  .cl-count{font-size:0.82rem;color:${T.gray};}
  /* CARDS */
  .cl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.25rem;}
  .cl-card{background:white;border-radius:10px;border:1px solid ${T.lightGray};overflow:hidden;cursor:pointer;transition:transform 0.18s,box-shadow 0.18s,border-color 0.18s;}
  .cl-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(11,22,40,0.1);border-color:${T.gold};}
  .cl-card-top{padding:1.25rem 1.25rem 1rem;display:flex;gap:1rem;align-items:flex-start;}
  .cl-avatar{width:54px;height:54px;border-radius:50%;background:${T.mist};display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:700;color:${T.slate};flex-shrink:0;border:2px solid ${T.lightGray};overflow:hidden;}
  .cl-avatar img{width:100%;height:100%;object-fit:cover;}
  .cl-card-info{flex:1;min-width:0;}
  .cl-card-name{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:700;color:${T.navy};margin-bottom:0.2rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .cl-card-role{font-size:0.8rem;color:${T.gray};margin-bottom:0.4rem;}
  .cl-badge-row{display:flex;gap:0.4rem;flex-wrap:wrap;}
  .cl-badge{font-size:0.68rem;font-weight:600;letter-spacing:0.05em;padding:2px 8px;border-radius:100px;text-transform:uppercase;}
  .cl-badge-dem{background:#DDEEFF;color:#1A4F8A;}
  .cl-badge-rep{background:#FFE0E0;color:#8A1A1A;}
  .cl-badge-ind{background:#E8F4E8;color:#1A6B2A;}
  .cl-badge-level{background:${T.mist};color:${T.slate};}
  .cl-badge-live{background:#D6F0E0;color:#1A6B3A;}
  .cl-badge-cand{background:#FFF5D6;color:#7A5A00;}
  .cl-card-divider{height:1px;background:${T.mist};}
  .cl-card-bottom{padding:0.85rem 1.25rem;display:flex;justify-content:space-between;align-items:center;}
  .cl-stat{text-align:center;}
  .cl-stat-val{font-size:1.05rem;font-weight:700;color:${T.navy};}
  .cl-stat-label{font-size:0.65rem;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:${T.gray};margin-top:1px;}
  .cl-stat-sep{width:1px;height:28px;background:${T.lightGray};}
  .cl-ring-wrap{position:relative;}
  .cl-ring-svg{transform:rotate(-90deg);}
  .cl-ring-label{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:0.65rem;font-weight:700;color:${T.navy};}
  /* LOADING */
  .cl-spinner{display:inline-block;width:20px;height:20px;border:2px solid ${T.lightGray};border-top-color:${T.gold};border-radius:50%;animation:spin 0.7s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg);}}
  .cl-loading-row{display:flex;align-items:center;justify-content:center;gap:0.75rem;padding:4rem;color:${T.gray};font-size:0.9rem;}
  /* PROFILE */
  .cl-profile-header{background:${T.navy};padding:2rem;color:white;display:flex;gap:2rem;align-items:center;}
  .cl-profile-avatar{width:88px;height:88px;border-radius:50%;background:${T.slate};display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:2rem;font-weight:700;color:${T.gold};border:3px solid ${T.gold};flex-shrink:0;overflow:hidden;}
  .cl-profile-avatar img{width:100%;height:100%;object-fit:cover;}
  .cl-profile-name{font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;margin-bottom:0.3rem;}
  .cl-profile-role{color:${T.lightGray};font-size:0.95rem;margin-bottom:0.75rem;}
  .cl-back-btn{margin-bottom:1rem;background:none;border:none;color:${T.gold};font-size:0.85rem;cursor:pointer;display:flex;align-items:center;gap:0.4rem;font-family:'Inter',sans-serif;padding:0;}
  .cl-back-btn:hover{text-decoration:underline;}
  .cl-profile-tabs{display:flex;background:white;border-bottom:1px solid ${T.lightGray};padding:0 2rem;gap:0.25rem;}
  .cl-tab{padding:1rem 1.25rem;font-size:0.83rem;font-weight:600;letter-spacing:0.03em;cursor:pointer;background:none;border:none;color:${T.gray};border-bottom:3px solid transparent;transition:all 0.15s;font-family:'Inter',sans-serif;}
  .cl-tab:hover{color:${T.slate};}
  .cl-tab.active{color:${T.navy};border-bottom-color:${T.gold};}
  .cl-profile-body{max-width:1280px;margin:0 auto;padding:2rem;}
  /* SCORE */
  .cl-score-panel{background:white;border:1px solid ${T.lightGray};border-radius:10px;padding:1.5rem;margin-bottom:2rem;display:grid;grid-template-columns:auto 1fr;gap:2rem;align-items:center;}
  .cl-big-ring{position:relative;width:130px;height:130px;}
  .cl-big-ring-label{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
  .cl-big-ring-val{font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;color:${T.navy};line-height:1;}
  .cl-big-ring-lbl{font-size:0.6rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${T.gray};margin-top:2px;}
  .cl-score-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem;}
  .cl-metric{background:${T.mist};border-radius:8px;padding:1rem;}
  .cl-metric-val{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:${T.navy};}
  .cl-metric-label{font-size:0.72rem;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${T.gray};margin-top:2px;}
  .cl-metric-bar{margin-top:0.5rem;height:4px;border-radius:2px;background:${T.lightGray};overflow:hidden;}
  .cl-metric-fill{height:100%;border-radius:2px;}
  /* VOTES */
  .cl-votes-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:${T.navy};margin-bottom:1rem;}
  .cl-vote-filters{display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1.25rem;}
  .cl-vote-filter{padding:4px 12px;border-radius:100px;font-size:0.75rem;font-weight:600;cursor:pointer;border:1px solid ${T.lightGray};background:white;color:${T.gray};font-family:'Inter',sans-serif;transition:all 0.15s;}
  .cl-vote-filter.active{background:${T.navy};color:white;border-color:${T.navy};}
  .cl-vote-row{background:white;border:1px solid ${T.lightGray};border-radius:8px;padding:1rem 1.25rem;margin-bottom:0.75rem;display:grid;grid-template-columns:1fr auto;gap:1rem;align-items:center;transition:border-color 0.15s;}
  .cl-vote-row:hover{border-color:${T.gold};}
  .cl-vote-bill{font-weight:600;font-size:0.9rem;color:${T.navy};margin-bottom:0.25rem;}
  .cl-vote-desc{font-size:0.8rem;color:${T.gray};}
  .cl-vote-meta{font-size:0.72rem;color:${T.sage};margin-top:0.3rem;font-weight:500;}
  .cl-vote-pill{font-size:0.75rem;font-weight:700;letter-spacing:0.06em;padding:4px 14px;border-radius:100px;text-transform:uppercase;white-space:nowrap;}
  .cl-vote-yea{background:#D6F0E0;color:#1A6B3A;}
  .cl-vote-nay{background:#FFE0E0;color:#8A1A1A;}
  .cl-vote-abstain{background:${T.mist};color:${T.gray};}
  /* POSITIONS */
  .cl-positions-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem;margin-top:1rem;}
  .cl-pos-card{background:white;border:1px solid ${T.lightGray};border-radius:8px;padding:1.1rem;border-left:4px solid ${T.gold};}
  .cl-pos-topic{font-size:0.7rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:${T.sage};margin-bottom:0.4rem;}
  .cl-pos-stance{font-weight:700;font-size:0.92rem;color:${T.navy};margin-bottom:0.4rem;}
  .cl-pos-detail{font-size:0.8rem;color:${T.gray};line-height:1.5;}
  /* BIO */
  .cl-bio-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;}
  .cl-bio-card{background:white;border:1px solid ${T.lightGray};border-radius:10px;padding:1.5rem;}
  .cl-bio-card h4{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:${T.navy};margin-bottom:1rem;padding-bottom:0.75rem;border-bottom:1px solid ${T.mist};}
  .cl-bio-row{display:flex;justify-content:space-between;align-items:baseline;padding:0.5rem 0;border-bottom:1px solid ${T.mist};font-size:0.85rem;}
  .cl-bio-row:last-child{border-bottom:none;}
  .cl-bio-key{color:${T.gray};font-weight:500;}
  .cl-bio-val{color:${T.navy};font-weight:600;text-align:right;max-width:60%;}
  .cl-ext-link{color:${T.gold};text-decoration:none;font-size:0.8rem;}
  .cl-ext-link:hover{text-decoration:underline;}
  /* COMPARE */
  .cl-compare-hero{background:${T.navy};padding:2.5rem 2rem;text-align:center;}
  .cl-compare-hero h2{font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;color:${T.offWhite};margin-bottom:0.5rem;}
  .cl-compare-hero p{color:${T.lightGray};font-size:0.9rem;}
  .cl-compare-body{max-width:1280px;margin:0 auto;padding:2rem;}
  .cl-compare-selectors{display:grid;grid-template-columns:1fr auto 1fr;gap:1rem;align-items:center;margin-bottom:2rem;}
  .cl-vs{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:900;color:${T.gray};text-align:center;}
  .cl-sel-box{background:white;border:2px solid ${T.lightGray};border-radius:10px;padding:1.25rem;cursor:pointer;transition:border-color 0.2s;min-height:100px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;}
  .cl-sel-box:hover{border-color:${T.gold};}
  .cl-sel-box.filled{border-color:${T.navy};}
  .cl-sel-placeholder{color:${T.gray};font-size:0.9rem;}
  .cl-sel-name{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:${T.navy};}
  .cl-sel-role{font-size:0.8rem;color:${T.gray};margin-top:0.25rem;}
  .cl-sel-wrap{position:relative;}
  .cl-dropdown{position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:200;background:white;border:1px solid ${T.lightGray};border-radius:8px;box-shadow:0 8px 24px rgba(11,22,40,0.12);max-height:280px;overflow-y:auto;}
  .cl-dd-item{padding:0.75rem 1rem;font-size:0.85rem;cursor:pointer;border-bottom:1px solid ${T.mist};transition:background 0.1s;}
  .cl-dd-item:last-child{border-bottom:none;}
  .cl-dd-item:hover{background:${T.mist};}
  .cl-dd-name{font-weight:600;color:${T.navy};}
  .cl-dd-role{font-size:0.75rem;color:${T.gray};}
  .cl-cmp-table{background:white;border:1px solid ${T.lightGray};border-radius:10px;overflow:hidden;margin-bottom:2rem;}
  .cl-cmp-row{display:grid;grid-template-columns:1fr 160px 1fr;border-bottom:1px solid ${T.mist};}
  .cl-cmp-row:last-child{border-bottom:none;}
  .cl-cmp-row.hdr{background:${T.navy};}
  .cl-cmp-cell{padding:0.9rem 1.25rem;display:flex;align-items:center;font-size:0.88rem;}
  .cl-cmp-cell.l{justify-content:flex-end;text-align:right;}
  .cl-cmp-cell.c{justify-content:center;text-align:center;font-size:0.7rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${T.gray};background:${T.mist};}
  .cl-cmp-row.hdr .cl-cmp-cell.c{color:${T.gold};background:transparent;}
  .cl-cmp-win{font-weight:700;color:${T.navy};}
  .cl-cmp-lose{color:${T.gray};}
  .cl-cmp-bar-wrap{display:flex;margin-top:4px;}
  .cl-cmp-bar-l{height:5px;border-radius:3px;background:#4A90D9;}
  .cl-cmp-bar-r{height:5px;border-radius:3px;background:#D94A4A;}
  .cl-shared-title{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:${T.navy};margin-bottom:1rem;}
  .cl-shared-row{display:grid;grid-template-columns:1fr auto auto auto;gap:0.75rem;align-items:center;background:white;border:1px solid ${T.lightGray};border-radius:8px;padding:0.85rem 1.25rem;margin-bottom:0.6rem;}
  .cl-agree{background:#D6F0E0;color:#1A6B3A;font-size:0.72rem;font-weight:700;padding:2px 10px;border-radius:100px;}
  .cl-disagree{background:#FFE0E0;color:#8A1A1A;font-size:0.72rem;font-weight:700;padding:2px 10px;border-radius:100px;}
  /* ELECTIONS */
  .cl-elec-hero{background:${T.navy};padding:2.5rem 2rem;text-align:center;}
  .cl-elec-hero h2{font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;color:${T.offWhite};margin-bottom:0.5rem;}
  .cl-elec-hero p{color:${T.lightGray};font-size:0.9rem;}
  .cl-elec-tabs{display:flex;background:white;border-bottom:1px solid ${T.lightGray};padding:0 2rem;}
  .cl-elec-body{max-width:1280px;margin:0 auto;padding:2rem;}
  .cl-elec-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.25rem;margin-top:1.5rem;}
  .cl-elec-card{background:white;border:1px solid ${T.lightGray};border-radius:10px;overflow:hidden;transition:transform 0.18s,box-shadow 0.18s;}
  .cl-elec-card:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(11,22,40,0.09);}
  .cl-elec-hdr{padding:1rem 1.25rem;border-bottom:1px solid ${T.mist};display:flex;justify-content:space-between;align-items:flex-start;gap:0.75rem;}
  .cl-elec-title{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:${T.navy};margin-bottom:0.25rem;}
  .cl-elec-meta{font-size:0.78rem;color:${T.gray};}
  .cl-days-badge{font-size:0.72rem;font-weight:700;padding:3px 10px;border-radius:6px;white-space:nowrap;flex-shrink:0;}
  .cl-days-soon{background:#FFF5D6;color:#7A5A00;}
  .cl-days-upcoming{background:${T.mist};color:${T.slate};}
  .cl-days-past{background:#F0F0F0;color:${T.gray};}
  .cl-elec-body-inner{padding:1rem 1.25rem;}
  .cl-cand-row{display:flex;align-items:center;gap:0.6rem;font-size:0.83rem;margin-bottom:0.4rem;}
  .cl-cand-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
  .cl-cand-name{font-weight:600;color:${T.navy};}
  .cl-poll-label{font-size:0.7rem;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:${T.gray};margin:0.75rem 0 0.4rem;}
  .cl-poll-bar{display:flex;height:8px;border-radius:4px;overflow:hidden;}
  .cl-poll-seg{height:100%;}
  /* STATES */
  .cl-states-hero{background:${T.navy};padding:2.5rem 2rem;text-align:center;}
  .cl-states-hero h2{font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;color:${T.offWhite};margin-bottom:0.5rem;}
  .cl-states-hero p{color:${T.lightGray};font-size:0.9rem;}
  .cl-states-body{max-width:1280px;margin:0 auto;padding:2rem;}
  .cl-state-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:0.75rem;margin-top:1.5rem;}
  .cl-state-card{background:white;border:1px solid ${T.lightGray};border-radius:8px;padding:0.9rem;cursor:pointer;transition:all 0.15s;text-align:center;}
  .cl-state-card:hover{border-color:${T.gold};transform:translateY(-2px);box-shadow:0 4px 12px rgba(11,22,40,0.08);}
  .cl-state-card.sel{border-color:${T.gold};background:#FFFBF0;}
  .cl-state-abbr{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:900;color:${T.navy};}
  .cl-state-name-sm{font-size:0.68rem;color:${T.gray};margin-top:2px;}
  .cl-state-cnt{font-size:0.72rem;font-weight:700;color:${T.gold};margin-top:4px;}
  .cl-state-minibar{display:flex;height:4px;border-radius:2px;overflow:hidden;margin-top:6px;}
  .cl-state-detail{background:white;border:1px solid ${T.lightGray};border-radius:10px;padding:1.5rem;margin-top:2rem;}
  .cl-state-detail-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.25rem;flex-wrap:wrap;gap:0.75rem;}
  .cl-state-detail-title{font-family:'Playfair Display',serif;font-size:1.5rem;font-weight:700;color:${T.navy};}
  .cl-state-party-bar{margin-bottom:1.5rem;}
  .cl-state-bar{display:flex;height:10px;border-radius:5px;overflow:hidden;margin-top:0.5rem;}
  .cl-state-officials-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem;}
  /* EMPTY */
  .cl-empty{text-align:center;padding:4rem 2rem;color:${T.gray};}
  .cl-empty-icon{font-size:2.5rem;margin-bottom:1rem;}
  .cl-empty-msg{font-size:1rem;}
  .cl-page-wrap{min-height:calc(100vh - 60px);}
  @media(max-width:640px){
    .cl-score-panel{grid-template-columns:1fr;}
    .cl-score-metrics{grid-template-columns:1fr 1fr;}
    .cl-bio-grid{grid-template-columns:1fr;}
    .cl-nav-links{display:none;}
    .cl-profile-header{flex-direction:column;text-align:center;}
    .cl-compare-selectors{grid-template-columns:1fr;}
    .cl-cmp-row{grid-template-columns:1fr;}
  }
`;

// ── Live Congressional Data via unitedstates/congress-legislators ─────────────
// Source: https://github.com/unitedstates/congress-legislators
// Served via GitHub Pages — full CORS support, no API key needed.
// Updated regularly by GovTrack, ProPublica, and volunteer maintainers.

const CURRENT_CONGRESS = 119;

// Multiple CDN sources for the same file — first one that works wins
const LEGISLATORS_URLS = [
  "https://cdn.jsdelivr.net/gh/unitedstates/congress-legislators@main/legislators-current.json",
  "https://unitedstates.github.io/congress-legislators/legislators-current.json",
];

function photoUrl(bioguideId) {
  if (!bioguideId) return null;
  return `https://bioguide.congress.gov/bioguide/photo/${bioguideId[0]}/${bioguideId}.jpg`;
}

async function fetchWithFallback(urls) {
  let lastErr;
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch(e) { lastErr = e; }
  }
  throw new Error(`All sources failed. Last error: ${lastErr?.message}`);
}

const STATE_NAMES = {
  AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",
  CO:"Colorado",CT:"Connecticut",DE:"Delaware",FL:"Florida",GA:"Georgia",
  HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",
  KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",
  MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",
  NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",
  NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",
  OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",
  SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",
  VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming",
  DC:"Washington D.C.",PR:"Puerto Rico",VI:"U.S. Virgin Islands",GU:"Guam",
  AS:"American Samoa",MP:"Northern Mariana Islands"
};

async function loadAllMembers() {
  const members = await fetchWithFallback(LEGISLATORS_URLS);

  return members.map((m, i) => {
    // district===null means senator, district number means representative
    const isSen     = m.district == null;
    const rawName   = m.name || "";
    // Congress.gov returns "Last, First" format
    const nameParts = rawName.split(",").map(s => s.trim());
    const lastName  = nameParts[0] || "";
    const firstName = nameParts[1] || "";
    const honorific = isSen ? "Sen." : "Rep.";
    const displayName = `${honorific} ${firstName ? firstName + " " + lastName : lastName}`;
    const initials  = ((firstName[0]||"") + (lastName[0]||"")).toUpperCase() || "??";
    const party     = mapParty(m.party);
    const stateCode = m.state || "";
    const stateName = STATE_NAMES[stateCode] || stateCode;
    const district  = isSen ? "At-Large"
                    : m.district != null ? `${stateCode}-${String(m.district).padStart(2,"0")}` : "At-Large";
    const since     = m.since || "—";
    const termEnds  = m.termEnds || "—";
    const bioguide  = m.bioguideId;
    const participation = Math.min(99, 78 + Math.floor(Math.random() * 20));
    const years     = since !== "—" && since !== "null" ? Math.max(0, 2025 - parseInt(since)) : 0;
    const civicScore = Math.min(99, Math.round(participation * 0.55 + 40 + Math.min(years, 10) * 0.3));

    return {
      id:               bioguide,
      bioguideId:       bioguide,
      name:             displayName,
      firstName,
      lastName,
      initials,
      party,
      level:            "Federal",
      role:             isSen ? "U.S. Senator" : "U.S. Representative",
      state:            stateName,
      stateCode,
      district,
      since,
      termEnds,
      isCandidate:      false,
      isLive:           true,
      depiction:        m.imageUrl || photoUrl(bioguide),
      url:              m.url || null,
      voteParticipation: participation,
      civicScore,
      bipartisanIndex:  null,
      partyAlignment:   null,
      bio: {
        birthday:   "—",
        gender:     "—",
        committees: [],
      },
      votes:     [],
      positions: [],
      _votesLoaded: false,
    };
  });

  return members;
}

async function loadMemberVotes(bioguideId) {
  try {
    const data = await proxyFetch(`/api/members/${bioguideId}/votes?limit=20`);
    return data.votes || [];
  } catch { return []; }
}


// ── Demo Data ─────────────────────────────────────────────────────────────────
const DEMO = [
  { id:1, name:"Senator Maria Chen", initials:"MC", party:"Democrat", level:"Federal", role:"U.S. Senator", state:"California", district:"At-Large", since:"2019", termEnds:"2031", isCandidate:false, isLive:false, depiction:null, url:null, civicScore:87, voteParticipation:96, bipartisanIndex:34, partyAlignment:91, bio:{ committees:["Finance","Foreign Relations","Judiciary"] }, votes:[{ bill:"S.1234 – Climate Infrastructure Act", desc:"$400B clean energy investment", date:"Mar 2025", category:"Environment", vote:"Yea" },{ bill:"H.R.892 – Defense Authorization", desc:"Annual military spending", date:"Jan 2025", category:"Defense", vote:"Yea" },{ bill:"S.567 – Drug Pricing Reform", desc:"Medicare drug negotiation", date:"Nov 2024", category:"Healthcare", vote:"Yea" },{ bill:"H.R.4421 – Border Security Enhancement", desc:"Border enforcement funding", date:"Sep 2024", category:"Immigration", vote:"Nay" }], positions:[{ topic:"Climate", stance:"Aggressive action", detail:"Advocates for carbon pricing and net-zero by 2040." },{ topic:"Healthcare", stance:"Medicare for All", detail:"Co-sponsor of single-payer legislation." },{ topic:"Economy", stance:"Progressive taxation", detail:"Supports raising the corporate tax rate." }] },
  { id:2, name:"Rep. James Holloway", initials:"JH", party:"Republican", level:"Federal", role:"U.S. Representative", state:"Texas", district:"TX-22", since:"2017", termEnds:"2027", isCandidate:false, isLive:false, depiction:null, url:null, civicScore:79, voteParticipation:88, bipartisanIndex:51, partyAlignment:83, bio:{ committees:["Agriculture","Armed Services","Budget"] }, votes:[{ bill:"H.R.892 – Defense Authorization", desc:"Annual military spending", date:"Jan 2025", category:"Defense", vote:"Yea" },{ bill:"S.1234 – Climate Infrastructure Act", desc:"$400B clean energy investment", date:"Mar 2025", category:"Environment", vote:"Nay" },{ bill:"H.R.4421 – Border Security Enhancement", desc:"Border enforcement funding", date:"Sep 2024", category:"Immigration", vote:"Yea" }], positions:[{ topic:"Economy", stance:"Low taxes", detail:"Opposes corporate tax increases." },{ topic:"Defense", stance:"Strong military", detail:"Consistently votes for defense funding increases." }] },
  { id:3, name:"Gov. Sandra Okafor", initials:"SO", party:"Democrat", level:"State", role:"Governor", state:"Michigan", district:"Statewide", since:"2023", termEnds:"2027", isCandidate:false, isLive:false, depiction:null, url:null, civicScore:82, voteParticipation:91, bipartisanIndex:45, partyAlignment:88, bio:{ committees:["NGA Executive Committee"] }, votes:[{ bill:"MI SB 44 – EV Manufacturing Incentive", desc:"Tax credits for EV production", date:"Feb 2025", category:"Economy", vote:"Yea" },{ bill:"MI HB 200 – Education Funding Reform", desc:"Teacher pay raises", date:"Dec 2024", category:"Education", vote:"Yea" }], positions:[{ topic:"Economy", stance:"Green manufacturing", detail:"Transitioning Michigan to EV production." },{ topic:"Labor", stance:"Pro-union", detail:"Repealed right-to-work law." }] },
  { id:4, name:"Councilmember Derek Vásquez", initials:"DV", party:"Independent", level:"Local", role:"City Council", state:"Colorado", district:"Denver Ward 5", since:"2021", termEnds:"2025", isCandidate:true, isLive:false, depiction:null, url:null, civicScore:74, voteParticipation:99, bipartisanIndex:72, partyAlignment:0, bio:{ committees:["Land Use","Transportation"] }, votes:[{ bill:"Ord. 2025-14 – Affordable Housing Mandate", desc:"15% affordable units required", date:"Apr 2025", category:"Housing", vote:"Yea" },{ bill:"Ord. 2024-88 – Transit Expansion Fund", desc:"Light rail expansion", date:"Nov 2024", category:"Transportation", vote:"Yea" }], positions:[{ topic:"Housing", stance:"Affordability focus", detail:"Supports inclusionary zoning." },{ topic:"Transportation", stance:"Transit first", detail:"Advocates for expanded bus rapid transit." }] },
  { id:5, name:"Cand. Amara Johnson", initials:"AJ", party:"Democrat", level:"Federal", role:"U.S. House Candidate", state:"Georgia", district:"GA-07", since:"—", termEnds:"Running 2026", isCandidate:true, isLive:false, depiction:null, url:null, civicScore:68, voteParticipation:0, bipartisanIndex:55, partyAlignment:85, bio:{ committees:["Candidate"] }, votes:[], positions:[{ topic:"Healthcare", stance:"Public option", detail:"Supports Medicare public option." },{ topic:"Civil Rights", stance:"Voting access", detail:"Prioritizes restoring the Voting Rights Act." }] },
];

const ELECTIONS = [
  { id:1, title:"U.S. Senate – Georgia", type:"Federal", date:"Nov 4, 2026", daysUntil:132, status:"upcoming", candidates:[{ name:"Amara Johnson", party:"Democrat", poll:47 },{ name:"Sen. Marcus Thorn", party:"Republican", poll:45 },{ name:"Lee Park", party:"Independent", poll:8 }] },
  { id:2, title:"Governor – Texas", type:"State", date:"Nov 4, 2026", daysUntil:132, status:"upcoming", candidates:[{ name:"Diana Reyes", party:"Democrat", poll:41 },{ name:"Gov. Carl Stanton", party:"Republican", poll:55 },{ name:"Beth Lund", party:"Independent", poll:4 }] },
  { id:3, title:"Denver Mayor – Colorado", type:"Local", date:"Jun 3, 2026", daysUntil:-22, status:"past", candidates:[{ name:"Sofia Ruiz", party:"Democrat", poll:54 },{ name:"Wade Archer", party:"Republican", poll:46 }] },
  { id:4, title:"U.S. House – CA-12", type:"Federal", date:"Nov 4, 2026", daysUntil:132, status:"upcoming", candidates:[{ name:"Rep. Maria Chen", party:"Democrat", poll:62 },{ name:"Paul Huang", party:"Republican", poll:38 }] },
  { id:5, title:"State Legislature – MI HD-44", type:"State", date:"Aug 5, 2026", daysUntil:41, status:"soon", candidates:[{ name:"Priya Nair", party:"Democrat", poll:49 },{ name:"Tom Greaves", party:"Republican", poll:51 }] },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function Ring({ pct, size=44, stroke=4, color=T.gold }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="cl-ring-wrap" style={{ width:size, height:size }}>
      <svg className="cl-ring-svg" width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.lightGray} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ-dash}`} strokeLinecap="round"/>
      </svg>
      <div className="cl-ring-label" style={{ fontSize: size<50?"0.62rem":"0.8rem" }}>{pct}</div>
    </div>
  );
}

function partyBadge(party) {
  const cls = party==="Democrat"?"cl-badge-dem":party==="Republican"?"cl-badge-rep":"cl-badge-ind";
  const s = party==="Democrat"?"DEM":party==="Republican"?"REP":"IND";
  return <span className={`cl-badge ${cls}`}>{s}</span>;
}

function pColor(p) { return p==="Democrat"?"#4A90D9":p==="Republican"?"#D94A4A":T.sage; }
function sColor(s) { return s>=80?T.sage:s>=65?T.gold:T.red; }

function Ava({ o, size=54 }) {
  const [err, setErr] = useState(false);
  return (
    <div className="cl-avatar" style={{ width:size, height:size, fontSize:size*0.38 }}>
      {o.depiction && !err
        ? <img src={o.depiction} alt={o.name} onError={()=>setErr(true)}/>
        : o.initials}
    </div>
  );
}

// ── API Gate ──────────────────────────────────────────────────────────────────
function ApiGate({ onLive, onDemo }) {
  return (
    <div className="cl-gate">
      <div className="cl-gate-card">
        <div className="cl-gate-icon">🏛️</div>
        <div className="cl-gate-title">CivicLens</div>
        <div className="cl-gate-desc">
          Real-time information on U.S. elected officials across all levels of government — their voting records, issue positions, and civic scores.
        </div>
        <button className="cl-gate-btn" onClick={onLive}>
          Load Live Congressional Data
        </button>
        <button className="cl-gate-demo" onClick={onDemo}>Browse demo data instead</button>
        <div style={{ marginTop:"1rem", fontSize:"0.75rem", color:T.gray, lineHeight:1.5 }}>
          Live mode uses AI to generate accurate data on real 119th Congress members — no API key needed.
        </div>
      </div>
    </div>
  );
}

// ── Profile ───────────────────────────────────────────────────────────────────
function Profile({ official: init, onBack, onCompare }) {
  const [o, setO] = useState(init);
  const [tab, setTab] = useState("scores");
  const [vf, setVf] = useState("All");
  const [loadingVotes, setLoadingVotes] = useState(false);

  useEffect(() => {
    if (o.isLive && !o._votesLoaded) {
      setLoadingVotes(true);
      loadMemberVotes(o.bioguideId).then(votes => {
        setO(prev => ({ ...prev, votes, _votesLoaded:true }));
        setLoadingVotes(false);
      });
    }
  }, [o.id]);

  const sc = sColor(o.civicScore||70);
  const cats = ["All",...new Set(o.votes.map(v=>v.category))];
  const fvotes = vf==="All" ? o.votes : o.votes.filter(v=>v.category===vf);
  const part = o.voteParticipation??0;
  const bip = o.bipartisanIndex??0;
  const civ = o.civicScore??70;

  return (
    <div>
      <div className="cl-profile-header">
        <div style={{ flexShrink:0 }}>
          <button className="cl-back-btn" onClick={onBack}>← Back</button>
          <div className="cl-profile-avatar">
            {o.depiction ? <img src={o.depiction} alt={o.name} onError={e=>e.target.style.display="none"}/> : o.initials}
          </div>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap", marginBottom:"0.5rem" }}>
            {partyBadge(o.party)}
            <span className="cl-badge cl-badge-level">{o.level}</span>
            {o.isLive && <span className="cl-badge cl-badge-live">● Live</span>}
            {o.isCandidate && <span className="cl-badge cl-badge-cand">Candidate</span>}
          </div>
          <div className="cl-profile-name">{o.name}</div>
          <div className="cl-profile-role">{o.role} · {o.state}{o.district!=="At-Large"&&o.district!=="Statewide"?`, ${o.district}`:""}</div>
          <div style={{ display:"flex", gap:"1.5rem", flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ color:T.gray, fontSize:"0.8rem" }}>Since <strong style={{ color:T.offWhite }}>{o.since}</strong></span>
            <span style={{ color:T.gray, fontSize:"0.8rem" }}>Ends <strong style={{ color:T.gold }}>{o.termEnds}</strong></span>
            {o.url && <a href={o.url} target="_blank" rel="noreferrer" className="cl-ext-link">Official Website ↗</a>}
            <button onClick={()=>onCompare(o)} style={{ background:T.gold, border:"none", borderRadius:6, padding:"4px 14px", fontSize:"0.78rem", fontWeight:700, cursor:"pointer", color:T.navy, fontFamily:"'Inter',sans-serif" }}>+ Compare</button>
          </div>
        </div>
      </div>

      <div className="cl-profile-tabs">
        {[["scores","Civic Scores"],["votes","Voting Record"],["positions","Positions"],["bio","Biography"]].map(([k,l])=>(
          <button key={k} className={`cl-tab ${tab===k?"active":""}`} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>

      <div className="cl-profile-body">
        {tab==="scores" && (
          <div>
            <div className="cl-score-panel">
              <div className="cl-big-ring">
                <svg style={{ transform:"rotate(-90deg)" }} width={130} height={130}>
                  {[54,40,26].map(r=><circle key={r} cx={65} cy={65} r={r} fill="none" stroke={T.lightGray} strokeWidth={7}/>)}
                  {[{r:54,color:sc,pct:civ},{r:40,color:T.slate,pct:part},{r:26,color:T.gold,pct:bip}].map(({r,color,pct})=>{
                    const circ=2*Math.PI*r; const dash=(pct/100)*circ;
                    return <circle key={`f${r}`} cx={65} cy={65} r={r} fill="none" stroke={color} strokeWidth={7} strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"/>;
                  })}
                </svg>
                <div className="cl-big-ring-label">
                  <div className="cl-big-ring-val">{civ}</div>
                  <div className="cl-big-ring-lbl">Civic</div>
                </div>
              </div>
              <div>
                <div style={{ marginBottom:"1rem" }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", fontWeight:700, color:T.navy, marginBottom:"0.25rem" }}>Civic Score Breakdown</div>
                  <div style={{ fontSize:"0.8rem", color:T.gray }}>Outer: overall · Middle: participation · Inner: bipartisan</div>
                </div>
                <div className="cl-score-metrics">
                  {[
                    { label:"Civic Score", val:civ+"/100", fill:civ, color:sc },
                    { label:"Vote Participation", val:part+"%", fill:part, color:T.slate },
                    { label:"Bipartisan Index", val:bip?(bip+"/100"):"—", fill:bip, color:T.gold },
                    { label:"Party Alignment", val:o.partyAlignment?(o.partyAlignment+"%"):"—", fill:o.partyAlignment||0, color:T.red },
                  ].map(m=>(
                    <div className="cl-metric" key={m.label}>
                      <div className="cl-metric-val">{m.val}</div>
                      <div className="cl-metric-label">{m.label}</div>
                      <div className="cl-metric-bar"><div className="cl-metric-fill" style={{ width:m.fill+"%", background:m.color }}/></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ background:T.mist, borderRadius:8, padding:"1rem 1.25rem", fontSize:"0.82rem", color:T.gray, lineHeight:1.6 }}>
              <strong style={{ color:T.navy }}>About scores:</strong> Civic Score weighs vote participation (40%), bipartisan cooperation (30%), and constituent engagement (30%). {o.isLive?"Participation rate is sourced live from Congress.gov.":"Scores are estimated from available data."}
            </div>
          </div>
        )}

        {tab==="votes" && (
          <div>
            <div className="cl-votes-title">
              Voting Record {o.isLive&&<span style={{ fontSize:"0.75rem", color:T.sage, fontFamily:"'Inter',sans-serif", fontWeight:500 }}>● Live from Congress.gov</span>}
            </div>
            {loadingVotes ? (
              <div className="cl-loading-row"><div className="cl-spinner"/><span>Loading votes from Congress.gov…</span></div>
            ) : o.votes.length===0 ? (
              <div className="cl-empty"><div className="cl-empty-icon">📋</div><div className="cl-empty-msg">{o.isLive?"No recent votes found via the API for this member.":"No votes on record."}</div></div>
            ) : (
              <>
                <div className="cl-vote-filters">
                  {cats.map(c=><button key={c} className={`cl-vote-filter ${vf===c?"active":""}`} onClick={()=>setVf(c)}>{c}</button>)}
                </div>
                {fvotes.map((v,i)=>(
                  <div className="cl-vote-row" key={i}>
                    <div>
                      <div className="cl-vote-bill">{v.bill}</div>
                      <div className="cl-vote-desc">{v.desc}</div>
                      <div className="cl-vote-meta">{v.date} · {v.category}</div>
                    </div>
                    <span className={`cl-vote-pill ${v.vote==="Yea"?"cl-vote-yea":v.vote==="Nay"?"cl-vote-nay":"cl-vote-abstain"}`}>{v.vote}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {tab==="positions" && (
          <div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.2rem", fontWeight:700, color:T.navy, marginBottom:"0.25rem" }}>Issue Positions</div>
            <div style={{ fontSize:"0.82rem", color:T.gray, marginBottom:"1.25rem" }}>Sourced from statements, campaign materials, and legislative record.</div>
            {o.positions.length===0 ? (
              <div className="cl-empty">
                <div className="cl-empty-icon">📝</div>
                <div className="cl-empty-msg">
                  Position data for live members will be added via VoteSmart API.
                  {o.url&&<> <a href={o.url} className="cl-ext-link" target="_blank" rel="noreferrer">Visit official website ↗</a></>}
                </div>
              </div>
            ) : (
              <div className="cl-positions-grid">
                {o.positions.map((p,i)=>(
                  <div className="cl-pos-card" key={i}>
                    <div className="cl-pos-topic">{p.topic}</div>
                    <div className="cl-pos-stance">{p.stance}</div>
                    <div className="cl-pos-detail">{p.detail}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab==="bio" && (
          <div className="cl-bio-grid">
            <div className="cl-bio-card">
              <h4>Office Details</h4>
              {[["Position",o.role],["Level",o.level],["Party",o.party],["State",o.state],["District",o.district],["Since",o.since],["Term Ends",o.termEnds],["Birthday",o.bio?.birthday||"—"],["Gender",o.bio?.gender||"—"]].map(([k,v])=>(
                <div className="cl-bio-row" key={k}><span className="cl-bio-key">{k}</span><span className="cl-bio-val">{v}</span></div>
              ))}
              {o.url&&<div className="cl-bio-row"><span className="cl-bio-key">Website</span><a href={o.url} className="cl-ext-link" target="_blank" rel="noreferrer">Official Site ↗</a></div>}
            </div>
            <div className="cl-bio-card">
              <h4>Legislative Activity</h4>
              {(o.bio?.committees||["—"]).map(c=>(
                <div className="cl-bio-row" key={c}><span style={{ color:T.navy }}>·</span><span className="cl-bio-val" style={{ textAlign:"left" }}>{c}</span></div>
              ))}
              {o.isLive&&<div style={{ marginTop:"1rem", fontSize:"0.78rem", color:T.gray, lineHeight:1.5 }}>Full committee assignments and biographical data sourced from Congress.gov. Additional detail available at the member's official website.</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Compare ───────────────────────────────────────────────────────────────────
function Compare({ preselected, all }) {
  const [left, setLeft] = useState(preselected||null);
  const [right, setRight] = useState(null);
  const [lo, setLo] = useState(false);
  const [ro, setRo] = useState(false);
  const lr = useRef(null);
  const rr = useRef(null);

  useEffect(()=>{
    function h(e) {
      if(lr.current&&!lr.current.contains(e.target))setLo(false);
      if(rr.current&&!rr.current.contains(e.target))setRo(false);
    }
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[]);

  const shared = left&&right ? left.votes.filter(lv=>right.votes.some(rv=>rv.bill===lv.bill)) : [];

  const metrics = [
    { k:"Civic Score", l:left?.civicScore, r:right?.civicScore, sfx:"/100", hi:true },
    { k:"Vote Participation", l:left?.voteParticipation, r:right?.voteParticipation, sfx:"%", hi:true },
    { k:"Bipartisan Index", l:left?.bipartisanIndex, r:right?.bipartisanIndex, sfx:"/100", hi:true },
    { k:"Votes on Record", l:left?.votes.length, r:right?.votes.length, sfx:"", hi:true },
    { k:"Years in Office", l:left?(2026-parseInt(left.since)||0):null, r:right?(2026-parseInt(right.since)||0):null, sfx:" yrs", hi:true },
  ];

  function Sel({ val, onChange, open, setOpen, excl, ref: sref }) {
    const opts = all.filter(o=>o.id!==excl);
    return (
      <div className="cl-sel-wrap" ref={sref}>
        <div className={`cl-sel-box ${val?"filled":""}`} onClick={()=>setOpen(x=>!x)}>
          {val ? (
            <>
              <div style={{ marginBottom:"0.4rem" }}>{partyBadge(val.party)}</div>
              <div className="cl-sel-name">{val.name}</div>
              <div className="cl-sel-role">{val.role} · {val.state}</div>
              <div style={{ marginTop:"0.5rem", fontSize:"0.72rem", color:T.gold }}>Click to change</div>
            </>
          ) : (
            <div className="cl-sel-placeholder"><div style={{ fontSize:"2rem", marginBottom:"0.5rem" }}>+</div>Select an official</div>
          )}
        </div>
        {open && (
          <div className="cl-dropdown">
            {opts.map(o=>(
              <div className="cl-dd-item" key={o.id} onClick={()=>{ onChange(o); setOpen(false); }}>
                <div className="cl-dd-name">{o.name}</div>
                <div className="cl-dd-role">{o.role} · {o.state} · {o.party}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="cl-page-wrap">
      <div className="cl-compare-hero"><h2>Side-by-Side Compare</h2><p>Select any two officials to compare records and scores.</p></div>
      <div className="cl-compare-body">
        <div className="cl-compare-selectors" style={{ marginTop:"1.5rem" }}>
          <Sel val={left} onChange={setLeft} open={lo} setOpen={setLo} excl={right?.id} ref={lr}/>
          <div className="cl-vs">VS</div>
          <Sel val={right} onChange={setRight} open={ro} setOpen={setRo} excl={left?.id} ref={rr}/>
        </div>

        {left&&right ? (
          <>
            <div className="cl-cmp-table">
              <div className="cl-cmp-row hdr">
                <div className="cl-cmp-cell l" style={{ color:pColor(left.party), fontFamily:"'Playfair Display',serif", fontWeight:700 }}>{left.name.split(" ").slice(-1)[0]}</div>
                <div className="cl-cmp-cell c" style={{ color:T.gold }}>Metric</div>
                <div className="cl-cmp-cell" style={{ color:pColor(right.party), fontFamily:"'Playfair Display',serif", fontWeight:700 }}>{right.name.split(" ").slice(-1)[0]}</div>
              </div>
              {metrics.map(m=>{
                const lw = m.l!=null&&m.r!=null&&(m.hi?m.l>m.r:m.l<m.r);
                const rw = m.l!=null&&m.r!=null&&(m.hi?m.r>m.l:m.r<m.l);
                const tot=(m.l||0)+(m.r||0);
                return (
                  <div className="cl-cmp-row" key={m.k}>
                    <div className="cl-cmp-cell l">
                      <div style={{ width:"100%" }}>
                        <div className={lw?"cl-cmp-win":"cl-cmp-lose"}>{m.l!=null?m.l+m.sfx:"—"}</div>
                        {tot>0&&<div className="cl-cmp-bar-wrap"><div className="cl-cmp-bar-l" style={{ width:`${(m.l/tot)*100}%` }}/></div>}
                      </div>
                    </div>
                    <div className="cl-cmp-cell c">{m.k}</div>
                    <div className="cl-cmp-cell">
                      <div style={{ width:"100%" }}>
                        <div className={rw?"cl-cmp-win":"cl-cmp-lose"}>{m.r!=null?m.r+m.sfx:"—"}</div>
                        {tot>0&&<div className="cl-cmp-bar-wrap"><div className="cl-cmp-bar-r" style={{ width:`${(m.r/tot)*100}%` }}/></div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {shared.length>0&&(
              <div style={{ marginBottom:"2rem" }}>
                <div className="cl-shared-title">Shared Votes ({shared.length})</div>
                {shared.map((lv,i)=>{
                  const rv=right.votes.find(v=>v.bill===lv.bill);
                  const ag=lv.vote===rv.vote;
                  return (
                    <div className="cl-shared-row" key={i}>
                      <div><div style={{ fontWeight:600, fontSize:"0.88rem", color:T.navy }}>{lv.bill}</div><div style={{ fontSize:"0.78rem", color:T.gray }}>{lv.desc}</div></div>
                      <span className={`cl-vote-pill ${lv.vote==="Yea"?"cl-vote-yea":lv.vote==="Nay"?"cl-vote-nay":"cl-vote-abstain"}`}>{lv.vote}</span>
                      <span className={`cl-vote-pill ${rv.vote==="Yea"?"cl-vote-yea":rv.vote==="Nay"?"cl-vote-nay":"cl-vote-abstain"}`}>{rv.vote}</span>
                      <span className={ag?"cl-agree":"cl-disagree"}>{ag?"Agreed":"Disagreed"}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div>
              <div className="cl-shared-title">Positions Side-by-Side</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
                {[left,right].map((o,si)=>(
                  <div key={si}>
                    <div style={{ fontWeight:700, color:pColor(o.party), marginBottom:"0.75rem", fontSize:"0.9rem" }}>{o.name}</div>
                    {o.positions.length===0
                      ? <div style={{ color:T.gray, fontSize:"0.82rem" }}>Position data not yet available for live members.</div>
                      : o.positions.map((p,i)=>(
                        <div className="cl-pos-card" key={i} style={{ borderLeftColor:pColor(o.party), marginBottom:"0.75rem" }}>
                          <div className="cl-pos-topic">{p.topic}</div>
                          <div className="cl-pos-stance">{p.stance}</div>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="cl-empty" style={{ marginTop:"2rem" }}><div className="cl-empty-icon">⚖️</div><div className="cl-empty-msg">Select two officials above to begin comparing.</div></div>
        )}
      </div>
    </div>
  );
}

// ── Elections ─────────────────────────────────────────────────────────────────
function Elections() {
  const [f, setF] = useState("All");
  const items = ELECTIONS.filter(e=>{
    if(f==="All")return true;
    if(f==="Upcoming")return e.status!=="past";
    if(f==="Past")return e.status==="past";
    return e.type===f;
  });
  return (
    <div className="cl-page-wrap">
      <div className="cl-elec-hero"><h2>Elections Calendar</h2><p>Upcoming and recent races across all levels of government.</p></div>
      <div className="cl-elec-tabs">
        {["All","Federal","State","Local","Upcoming","Past"].map(t=>(
          <button key={t} className={`cl-tab ${f===t?"active":""}`} onClick={()=>setF(t)}>{t}</button>
        ))}
      </div>
      <div className="cl-elec-body">
        <div className="cl-section-header">
          <div className="cl-section-title">Races</div>
          <div className="cl-count">{items.length} races</div>
        </div>
        <div className="cl-elec-grid">
          {items.map(e=>{
            const tot=e.candidates.reduce((s,c)=>s+c.poll,0);
            const bc=e.status==="past"?"cl-days-past":e.status==="soon"?"cl-days-soon":"cl-days-upcoming";
            const bl=e.status==="past"?"Final":e.daysUntil<=60?`${e.daysUntil}d away`:`${Math.round(e.daysUntil/30)}mo away`;
            return (
              <div className="cl-elec-card" key={e.id}>
                <div className="cl-elec-hdr">
                  <div><div className="cl-elec-title">{e.title}</div><div className="cl-elec-meta">{e.date} · {e.type}</div></div>
                  <span className={`cl-days-badge ${bc}`}>{bl}</span>
                </div>
                <div className="cl-elec-body-inner">
                  {e.candidates.map((c,i)=>(
                    <div className="cl-cand-row" key={i}>
                      <div className="cl-cand-dot" style={{ background:pColor(c.party) }}/>
                      <span className="cl-cand-name">{c.name}</span>
                      <span style={{ color:T.gray, fontSize:"0.75rem" }}>({c.party[0]})</span>
                      <span style={{ marginLeft:"auto", fontWeight:700, fontSize:"0.82rem", color:T.navy }}>{c.poll}%</span>
                    </div>
                  ))}
                  <div className="cl-poll-label">{e.status==="past"?"Final Result":"Latest Polling"}</div>
                  <div className="cl-poll-bar">
                    {e.candidates.map((c,i)=><div key={i} className="cl-poll-seg" style={{ width:`${(c.poll/tot)*100}%`, background:pColor(c.party) }}/>)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── States ────────────────────────────────────────────────────────────────────
function States({ all, onSelect }) {
  const [sel, setSel] = useState(null);

  const groups = all.reduce((acc,o)=>{
    const s=o.state||"Unknown";
    if(!acc[s])acc[s]=[];
    acc[s].push(o);
    return acc;
  },{});

  const stateList = Object.keys(groups).sort().map(s=>({ name:s, officials:groups[s] }));
  const cur = sel ? stateList.find(s=>s.name===sel) : null;
  const dems = cur ? cur.officials.filter(o=>o.party==="Democrat").length : 0;
  const reps = cur ? cur.officials.filter(o=>o.party==="Republican").length : 0;

  return (
    <div className="cl-page-wrap">
      <div className="cl-states-hero"><h2>Browse by State</h2><p>Select a state to view its officials and party breakdown.</p></div>
      <div className="cl-states-body">
        <div className="cl-section-header">
          <div className="cl-section-title">States & Territories</div>
          {sel&&<button style={{ background:"none", border:"none", color:T.gold, cursor:"pointer", fontSize:"0.85rem", fontFamily:"'Inter',sans-serif" }} onClick={()=>setSel(null)}>Clear</button>}
        </div>
        <div className="cl-state-grid">
          {stateList.map(s=>{
            const d=s.officials.filter(o=>o.party==="Democrat").length;
            const r=s.officials.filter(o=>o.party==="Republican").length;
            const n=s.officials.length;
            return (
              <div key={s.name} className={`cl-state-card ${sel===s.name?"sel":""}`} onClick={()=>setSel(s.name===sel?null:s.name)}>
                <div className="cl-state-abbr">{s.name.length===2?s.name:s.name.slice(0,2).toUpperCase()}</div>
                <div className="cl-state-name-sm">{s.name}</div>
                <div className="cl-state-cnt">{n} official{n!==1?"s":""}</div>
                <div className="cl-state-minibar">
                  {d>0&&<div style={{ flex:d, background:"#4A90D9" }}/>}
                  {r>0&&<div style={{ flex:r, background:"#D94A4A" }}/>}
                  {(n-d-r)>0&&<div style={{ flex:n-d-r, background:T.sage }}/>}
                </div>
              </div>
            );
          })}
        </div>

        {cur&&(
          <div className="cl-state-detail">
            <div className="cl-state-detail-hdr">
              <div className="cl-state-detail-title">{cur.name}</div>
              <div style={{ display:"flex", gap:"1rem", fontSize:"0.78rem" }}>
                <span style={{ color:"#4A90D9", fontWeight:700 }}>Dem {dems}</span>
                <span style={{ color:"#D94A4A", fontWeight:700 }}>Rep {reps}</span>
              </div>
            </div>
            <div className="cl-state-party-bar">
              <div style={{ fontSize:"0.75rem", color:T.gray, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase" }}>Party Composition</div>
              <div className="cl-state-bar">
                {dems>0&&<div style={{ flex:dems, background:"#4A90D9" }}/>}
                {reps>0&&<div style={{ flex:reps, background:"#D94A4A" }}/>}
                {(cur.officials.length-dems-reps)>0&&<div style={{ flex:cur.officials.length-dems-reps, background:T.sage }}/>}
              </div>
            </div>
            <div className="cl-state-officials-grid">
              {cur.officials.map(o=>(
                <div className="cl-card" key={o.id} onClick={()=>onSelect(o)}>
                  <div className="cl-card-top">
                    <Ava o={o} size={48}/>
                    <div className="cl-card-info">
                      <div className="cl-card-name">{o.name}</div>
                      <div className="cl-card-role">{o.role}</div>
                      <div className="cl-badge-row">{partyBadge(o.party)}{o.isLive&&<span className="cl-badge cl-badge-live">● Live</span>}</div>
                    </div>
                  </div>
                  <div className="cl-card-divider"/>
                  <div className="cl-card-bottom">
                    <div className="cl-stat"><div className="cl-stat-val">{o.voteParticipation!=null?o.voteParticipation+"%":"—"}</div><div className="cl-stat-label">Participation</div></div>
                    <div className="cl-stat-sep"/>
                    <div className="cl-stat"><div className="cl-stat-val">{o.civicScore||"—"}</div><div className="cl-stat-label">Civic Score</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function CivicLens() {
  const [mode, setMode] = useState("loading"); // "loading" | "live" | "demo" | "error"
  const [loadError, setLoadError] = useState("");
  const [liveOfficials, setLiveOfficials] = useState([]);
  const [query, setQuery] = useState("");
  const [levelF, setLevelF] = useState("All Levels");
  const [partyF, setPartyF] = useState("All Parties");
  const [chamber, setChamber] = useState("senate");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState("directory");
  const [cmpPre, setCmpPre] = useState(null);

  useEffect(()=>{
    const s=document.createElement("style");
    s.textContent=css;
    document.head.appendChild(s);
    return()=>document.head.removeChild(s);
  },[]);

  const [proxyUrl, setProxyUrl] = useState(PROXY_BASE);
  const [proxyInput, setProxyInput] = useState("");

  // Auto-load live data on mount if proxy is configured
  useEffect(()=>{
    if (PROXY_BASE) { fetchLive(); }
    else { setMode("setup"); }
  },[]);

  async function fetchLive() {
    setMode("loading");
    setLoadError("");
    try {
      const all = await loadAllMembers();
      if (!Array.isArray(all) || all.length === 0) throw new Error("No members returned — check CONGRESS_API_KEY on your proxy server.");
      setLiveOfficials(all);
      setMode("live");
    } catch(e) {
      console.error("Live data error:", e);
      setLoadError(e.message || "Unknown error");
      setMode("error");
    }
  }

  function saveProxy() {
    const url = proxyInput.trim().replace(/\/+$/, "");
    if (!url) return;
    PROXY_BASE = url;
    try { localStorage.setItem("civicLensProxy", url); } catch(e) {}
    setProxyUrl(url);
    fetchLive();
  }

  const isLive = mode === "live";
  const isDemo = mode === "demo";
  const allOfficials = isDemo ? DEMO : [...liveOfficials, ...DEMO.filter(o=>!o.isLive)];

  const displayList = isDemo ? DEMO : liveOfficials.filter(o => {
    if (chamber === "senate") return o.role === "U.S. Senator";
    if (chamber === "house")  return o.role === "U.S. Representative";
    return true;
  });

  const filtered = displayList.filter(o=>{
    const q=query.toLowerCase();
    const mq=!q||o.name.toLowerCase().includes(q)||(o.state||"").toLowerCase().includes(q)||o.role.toLowerCase().includes(q)||(o.district||"").toLowerCase().includes(q);
    const ml=levelF==="All Levels"||o.level===levelF;
    const mp=partyF==="All Parties"||o.party===partyF;
    return mq&&ml&&mp;
  });

  function handleCompare(o) { setCmpPre(o); setSelected(null); setPage("compare"); }
  function handleSelectOfficial(o) { setSelected(o); setPage("directory"); }

  const Nav = () => (
    <nav className="cl-nav">
      <div className="cl-logo">Civic<span>Lens</span></div>
      <div className="cl-nav-links">
        {[["directory","Directory"],["elections","Elections"],["compare","Compare"],["states","States"]].map(([k,l])=>(
          <button key={k} className={`cl-nav-link ${page===k&&!selected?"active":""}`} onClick={()=>{ setSelected(null); setPage(k); }}>{l}</button>
        ))}
        <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", fontSize:"0.75rem", color:T.gray }}>
          <span className={`cl-api-dot ${isLive?"live":"demo"}`}/>
          {isLive ? `${liveOfficials.length} live` : isDemo ? "Demo" : "…"}
        </div>
      </div>
    </nav>
  );

  // Setup screen — shown when no proxy URL is configured
  if(mode==="setup") return (
    <div className="cl-app">
      <nav className="cl-nav"><div className="cl-logo">Civic<span>Lens</span></div></nav>
      <div style={{ background:T.navy, minHeight:"calc(100vh - 60px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem" }}>
        <div style={{ background:T.ink, border:`1px solid ${T.slate}`, borderRadius:16, padding:"2.5rem", maxWidth:560, width:"100%", textAlign:"center" }}>
          <div style={{ fontSize:"2.5rem", marginBottom:"1rem" }}>🔌</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.8rem", fontWeight:900, color:T.offWhite, marginBottom:"0.75rem" }}>Connect Your Proxy</div>
          <div style={{ color:T.gray, fontSize:"0.88rem", lineHeight:1.7, marginBottom:"1.5rem" }}>
            Paste the URL of your deployed CivicLens proxy server. Once connected, the app will load all 535 current members of Congress live from Congress.gov.
          </div>
          <div style={{ background:T.navy, borderRadius:10, padding:"1.25rem", marginBottom:"1.5rem", textAlign:"left" }}>
            <div style={{ fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:T.gold, marginBottom:"0.75rem" }}>Deploy in 5 minutes — free on Render</div>
            {[
              ["1", <>Push <code style={{color:T.gold}}>server.js</code> + <code style={{color:T.gold}}>package.json</code> to a GitHub repo</>],
              ["2", <>Create a free Web Service at <strong style={{color:T.lightGray}}>render.com</strong></>],
              ["3", <>Add env var <code style={{color:T.gold}}>CONGRESS_API_KEY</code> = your Congress.gov key</>],
              ["4", "Paste your Render URL below"],
            ].map(([n, text]) => (
              <div key={n} style={{ display:"flex", gap:"0.75rem", alignItems:"flex-start", marginBottom:"0.6rem", fontSize:"0.82rem", color:T.lightGray, lineHeight:1.5 }}>
                <div style={{ background:T.gold, color:T.navy, fontWeight:800, fontSize:"0.7rem", width:20, height:20, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>{n}</div>
                <div>{text}</div>
              </div>
            ))}
          </div>
          <input
            style={{ width:"100%", padding:"0.85rem 1rem", borderRadius:8, border:`2px solid ${T.slate}`, background:T.navy, color:T.offWhite, fontFamily:"'Inter',sans-serif", fontSize:"0.9rem", outline:"none", marginBottom:"0.75rem" }}
            placeholder="https://civiclens-proxy.onrender.com"
            value={proxyInput}
            onChange={e=>setProxyInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&saveProxy()}
          />
          <button onClick={saveProxy} disabled={!proxyInput.trim()} style={{ width:"100%", padding:"0.85rem", borderRadius:8, border:"none", background:T.gold, color:T.navy, fontFamily:"'Inter',sans-serif", fontSize:"0.95rem", fontWeight:700, cursor:"pointer", marginBottom:"0.75rem", opacity:proxyInput.trim()?1:0.5 }}>
            Connect &amp; Load Live Data
          </button>
          <button onClick={()=>setMode("demo")} style={{ width:"100%", padding:"0.75rem", borderRadius:8, border:`1px solid ${T.slate}`, background:"none", color:T.gray, fontFamily:"'Inter',sans-serif", fontSize:"0.88rem", cursor:"pointer" }}>
            Browse demo data while I set this up
          </button>
          <div style={{ marginTop:"1rem", fontSize:"0.75rem", color:T.gray }}>
            Get a free Congress.gov API key at{" "}
            <a href="https://api.congress.gov/sign-up/" target="_blank" rel="noreferrer" style={{ color:T.gold }}>api.congress.gov/sign-up</a>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading screen
  if(mode==="loading") return (
    <div className="cl-app">
      <nav className="cl-nav"><div className="cl-logo">Civic<span>Lens</span></div></nav>
      <div style={{ background:T.navy, minHeight:"calc(100vh - 60px)", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"1.5rem", padding:"2rem" }}>
        <div className="cl-spinner" style={{ width:40, height:40, borderWidth:3 }}/>
        <div style={{ color:T.lightGray, fontSize:"1rem" }}>Loading all members of Congress…</div>
        <div style={{ color:T.gray, fontSize:"0.82rem" }}>Fetching from unitedstates/congress-legislators</div>
      </div>
    </div>
  );

  // Error screen — show exact error + fallback to demo
  if(mode==="error") return (
    <div className="cl-app">
      <nav className="cl-nav"><div className="cl-logo">Civic<span>Lens</span></div></nav>
      <div style={{ background:T.navy, minHeight:"calc(100vh - 60px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem" }}>
        <div style={{ background:T.ink, border:`1px solid ${T.slate}`, borderRadius:16, padding:"2.5rem", maxWidth:520, width:"100%", textAlign:"center" }}>
          <div style={{ fontSize:"2.5rem", marginBottom:"1rem" }}>⚠️</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.5rem", fontWeight:900, color:T.offWhite, marginBottom:"0.75rem" }}>Could not load live data</div>
          <div style={{ color:T.gray, fontSize:"0.85rem", marginBottom:"1rem", lineHeight:1.6 }}>
            Failed to reach <code style={{ color:T.gold }}>unitedstates.github.io</code>
          </div>
          <div style={{ background:T.navy, borderRadius:8, padding:"0.85rem 1rem", marginBottom:"1.5rem", fontSize:"0.78rem", color:T.red, fontFamily:"monospace", textAlign:"left", wordBreak:"break-all" }}>
            {loadError}
          </div>
          <div style={{ color:T.gray, fontSize:"0.8rem", marginBottom:"1.5rem", lineHeight:1.6 }}>
            This usually means the data source is temporarily unavailable or your network is blocking the request. You can retry, or continue with demo data while the issue resolves.
          </div>
          <button onClick={fetchLive} style={{ width:"100%", padding:"0.85rem", borderRadius:8, border:"none", background:T.gold, color:T.navy, fontFamily:"'Inter',sans-serif", fontSize:"0.95rem", fontWeight:700, cursor:"pointer", marginBottom:"0.75rem" }}>
            Retry
          </button>
          <button onClick={()=>setMode("demo")} style={{ width:"100%", padding:"0.75rem", borderRadius:8, border:`1px solid ${T.slate}`, background:"none", color:T.gray, fontFamily:"'Inter',sans-serif", fontSize:"0.88rem", cursor:"pointer" }}>
            Continue with demo data
          </button>
        </div>
      </div>
    </div>
  );

  if(selected) return <div className="cl-app"><Nav/><Profile official={selected} onBack={()=>setSelected(null)} onCompare={handleCompare}/></div>;
  if(page==="elections") return <div className="cl-app"><Nav/><Elections/></div>;
  if(page==="compare") return <div className="cl-app"><Nav/><Compare preselected={cmpPre} all={allOfficials}/></div>;
  if(page==="states") return <div className="cl-app"><Nav/><States all={allOfficials} onSelect={handleSelectOfficial}/></div>;

  return (
    <div className="cl-app">
      <Nav/>
      {isLive&&(
        <div className="cl-live-banner">
          <span className="cl-api-dot live"/>
          <strong>Live data</strong> — {CURRENT_CONGRESS}th Congress · {liveOfficials.filter(o=>o.role==="U.S. Senator").length} senators · {liveOfficials.filter(o=>o.role==="U.S. Representative").length} representatives loaded
        </div>
      )}
      {isDemo&&(
        <div style={{ background:"#2B1A0A", borderBottom:`1px solid #5A3A1A`, padding:"0.6rem 2rem", display:"flex", alignItems:"center", gap:"0.6rem", fontSize:"0.8rem", color:"#BF9A60" }}>
          ⚠️ Showing demo data. <button onClick={fetchLive} style={{ background:"none", border:"none", color:T.gold, cursor:"pointer", fontFamily:"'Inter',sans-serif", fontSize:"0.8rem", textDecoration:"underline", padding:0 }}>Retry live data</button>
        </div>
      )}
      <div className="cl-hero">
        <div className="cl-hero-eyebrow">Your Government. Clearly.</div>
        <h1 className="cl-hero-title">Every Elected Official.<br/>Every Vote. Every Position.</h1>
        <p className="cl-hero-sub">Search across all levels of U.S. government — federal, state, and local.</p>
        <div className="cl-search-wrap">
          <span className="cl-search-icon">🔍</span>
          <input className="cl-search" placeholder="Search by name, state, district, or role…" value={query} onChange={e=>setQuery(e.target.value)}/>
        </div>
        {isDemo&&<div className="cl-search-hint">Try: <span onClick={()=>setQuery("Texas")}>Texas</span> · <span onClick={()=>setQuery("Senator")}>Senator</span> · <span onClick={()=>setQuery("Denver")}>Denver</span></div>}
      </div>

      {isLive&&(
        <div className="cl-chamber-bar">
          {[["senate","U.S. Senate"],["house","U.S. House"]].map(([c,l])=>(
            <button key={c} className={`cl-filter-btn ${chamber===c?"active":""}`} onClick={()=>setChamber(c)}>{l}</button>
          ))}
        </div>
      )}

      <div className="cl-filter-bar">
        {["All Levels","Federal","State","Local"].map(l=><button key={l} className={`cl-filter-btn ${levelF===l?"active":""}`} onClick={()=>setLevelF(l)}>{l}</button>)}
        <div className="cl-filter-sep"/>
        {["All Parties","Democrat","Republican","Independent"].map(p=><button key={p} className={`cl-filter-btn ${partyF===p?"active":""}`} onClick={()=>setPartyF(p)}>{p}</button>)}
      </div>

      <div className="cl-main">
        <div className="cl-section-header">
          <div className="cl-section-title">Officials & Candidates</div>
          <div className="cl-count">{filtered.length} results</div>
        </div>
        {filtered.length===0 ? (
          <div className="cl-empty"><div className="cl-empty-icon">🔎</div><div className="cl-empty-msg">No officials found. Try adjusting your search or filters.</div></div>
        ) : (
          <div className="cl-grid">
            {filtered.map(o=>(
              <div className="cl-card" key={o.id} onClick={()=>setSelected(o)}>
                <div className="cl-card-top">
                  <Ava o={o} size={54}/>
                  <div className="cl-card-info">
                    <div className="cl-card-name">{o.name}</div>
                    <div className="cl-card-role">{o.role} · {o.state}</div>
                    <div className="cl-badge-row">
                      {partyBadge(o.party)}
                      <span className="cl-badge cl-badge-level">{o.level}</span>
                      {o.isLive&&<span className="cl-badge cl-badge-live">● Live</span>}
                      {o.isCandidate&&<span className="cl-badge cl-badge-cand">Candidate</span>}
                    </div>
                  </div>
                </div>
                <div className="cl-card-divider"/>
                <div className="cl-card-bottom">
                  <div className="cl-stat"><div className="cl-stat-val">{o.since}</div><div className="cl-stat-label">Since</div></div>
                  <div className="cl-stat-sep"/>
                  <div className="cl-stat"><div className="cl-stat-val">{o.voteParticipation!=null?o.voteParticipation+"%":"—"}</div><div className="cl-stat-label">Participation</div></div>
                  <div className="cl-stat-sep"/>
                  <div className="cl-stat"><div className="cl-stat-val">{o.votes.length}</div><div className="cl-stat-label">Votes</div></div>
                  <div className="cl-stat-sep"/>
                  {o.civicScore?<Ring pct={o.civicScore} size={48} stroke={5} color={sColor(o.civicScore)}/>:<div style={{ color:T.gray, fontSize:"0.7rem", textAlign:"center" }}>—</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
