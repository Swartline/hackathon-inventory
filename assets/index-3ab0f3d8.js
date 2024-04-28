const v=[{name:"Carte cadeau Amazon 50 euros",description:"Liberté de choix illimitée avec cette carte cadeau Amazon d'une valeur de 50 euros.",sprite_url:"https://ryanmalonzo.github.io/workadventure-inventory-icons/gift_card.svg"},{name:"Formation HTML",description:"Maîtrisez les bases du langage HTML et créez des sites web dynamiques avec notre formation complète.",sprite_url:"https://ryanmalonzo.github.io/workadventure-inventory-icons/course.svg"},{name:"Abonnement Netflix 6 mois",description:"Liberté de choix illimitée avec cette carte cadeau Amazon d'une valeur de 50 euros.",sprite_url:"https://ryanmalonzo.github.io/workadventure-inventory-icons/tv.svg"},{name:"Coffret Cadeau Spa",description:"Offrez à vos proches une expérience de détente ultime avec ce coffret cadeau Spa. Laissez-les se relaxer et se ressourcer dans un cadre luxueux avec des massages, des soins du visage et bien plus encore.",sprite_url:"https://ryanmalonzo.github.io/workadventure-inventory-icons/gift.svg"},{name:"Abonnement salle de sport 1 mois",description:"Commencez votre voyage vers une meilleure forme physique avec cet abonnement salle de sport d'un mois. Profitez d'un accès illimité à des équipements de pointe, des cours de fitness et des conseils d'experts pour atteindre vos objectifs de santé.",sprite_url:"https://ryanmalonzo.github.io/workadventure-inventory-icons/dumbbell.svg"},{name:"Ticket restaurant 10€",description:"Découvrez une explosion de saveurs avec ce ticket restaurant d'une valeur de 10€. Offrez-vous un délicieux repas dans l'un de vos restaurants préférés et savourez une expérience gastronomique inoubliable.",sprite_url:"https://ryanmalonzo.github.io/workadventure-inventory-icons/burger.svg"}],m={items:v},s="exchange_partner_uuid",r="exchange_list",f=()=>{WA.ui.onRemotePlayerClicked.subscribe(e=>{e.addAction("Échanger",async()=>{await WA.player.state.saveVariable(s,e.uuid,{public:!0,persist:!1})})})},_=async e=>await u(e,r),g=async()=>{const e=await WA.ui.website.open({url:"./src/exchange/iframe/exchange.html",position:{vertical:"middle",horizontal:"right"},size:{height:"50vh",width:"50vw"},allowApi:!0});return WA.player.state.saveVariable("exchange_id",e.id,{persist:!1}),await z(),e},h=async()=>{const e=WA.player.state[r];for(const t of e)await y(t);await w(r)};async function k(){const e=await c(String(WA.player.state.inventory_id)),t=await c(String(WA.player.state.exchange_id));await h(),e&&e.close(),t&&t.close()}const E=async()=>{await WA.players.configureTracking({players:!0}),WA.player.state.saveVariable(s,null,{public:!0,persist:!1}),WA.player.state.saveVariable(r,[],{public:!0,persist:!1}),WA.players.onVariableChange(s).subscribe(async e=>{e.value===WA.player.uuid&&(await WA.player.state.saveVariable(s,e.player.uuid,{public:!0,persist:!1}),await g())}),f()},i=async e=>await WA.player.state.loadVariable(e)??[],w=async(e,t)=>{await WA.player.state.saveVariable(e,[],{public:!0,...t})},u=async(e,t,n)=>{const a=await i(t);return a.push(e),await WA.player.state.saveVariable(t,a,{public:!0,...n}),a},b=async(e,t,n)=>{const a=await i(t);return a.forEach((d,p)=>{d.id===e.id&&a.splice(p,1)}),await WA.player.state.saveVariable(t,a,{public:!0,...n}),a};async function P(e){return(await i(r)).find(t=>t.id===e)}async function L(e){return(await i("inventory")).find(t=>t.id===e)}async function c(e){return WA.ui.website.getById(e)}const C=async e=>{await WA.players.configureTracking({players:!0});const t=WA.players.list();for(const n of t)if(n.uuid===e)return n;return null},o="inventory";let l=m.items;l=l.map(e=>({id:crypto.randomUUID(),...e}));const A=(e,t)=>{const n=e.name.toUpperCase(),a=t.name.toUpperCase();return n<a?-1:n>a?1:0},T=async()=>{const e=await i(o);return e?e.sort(A):[]},I=async()=>{await WA.player.state.saveVariable(o,[])},y=async e=>await u(e,o),V=async e=>await b(e,o),W=async()=>{const e=await WA.ui.website.open({url:"./src/inventory/iframe/inventory.html",position:{vertical:"middle",horizontal:"middle"},size:{height:"50vh",width:"50vw"},allowApi:!0});return WA.player.state.inventory_open=!0,WA.player.state.inventory_id=e.id,e},z=async()=>{const e=await WA.ui.website.open({url:"./src/inventory/iframe/inventory.html",position:{vertical:"middle",horizontal:"left"},size:{height:"50vh",width:"50vw"},allowApi:!0});return WA.player.state.inventory_open=!0,WA.player.state.inventory_id=e.id,e},x=async()=>{const e=await c(String(WA.player.state.inventory_id));e==null||e.close(),WA.player.state.inventory_open=!1},B=async()=>{await I();for(const t of l)await y(t);let e;WA.ui.actionBar.addButton({id:"inventory-btn",type:"action",imageSrc:"https://ryanmalonzo.github.io/workadventure-inventory-icons/backpack.png",toolTip:"Inventaire",callback:async()=>{e?(await x(),e=void 0):e=await W()}}),WA.player.state.onVariableChange("inventory_open").subscribe(t=>{t||(e=void 0)})};export{s as E,o as I,L as a,_ as b,k as c,P as d,b as e,y as f,T as g,C as h,r as i,w as j,B as k,E as l,V as r};
