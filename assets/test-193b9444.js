import{g as l}from"./index-e788fb3b.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))o(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const e of r.addedNodes)e.tagName==="LINK"&&e.rel==="modulepreload"&&o(e)}).observe(document,{childList:!0,subtree:!0});function s(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(t){if(t.ep)return;t.ep=!0;const r=s(t);fetch(t.href,r)}})();(async()=>{var r;await WA.onInit(),(r=document.getElementById("closeModal"))==null||r.addEventListener("click",()=>{t()});const i=document.getElementById("inventory"),n=await l();function s(e){i!=null&&(e===void 0?i.innerHTML+='<div class="card"></div>':i.innerHTML+=`<div class="card">
            <img src="${e==null?void 0:e.sprite_url}" alt="${e==null?void 0:e.description}" title="${e.name}" style="width:95%">
          </div>`)}let o=30;n.length>30&&(o=Math.ceil(n.length/10)*10);for(let e=0;e<o;e++)n[e]!==void 0?s(n[e]):s();async function t(){WA.ui.website.getById(String(WA.player.state.inventory_id)).then(e=>{e&&(WA.player.state.inventory_open=!1,e.close())})}})();
