const API='https://graphql.anilist.co';
let page=1, genre='', search='', busy=false, hasNext=true, timer=null;
const grid=document.getElementById('grid');
const status=document.getElementById('status');
const more=document.getElementById('more');
const input=document.getElementById('search');
const heading=document.getElementById('heading');

const query=`query($page:Int,$genre:String,$search:String){
 Page(page:$page,perPage:40){
  pageInfo{hasNextPage total}
  media(type:ANIME,genre:$genre,search:$search,sort:POPULARITY_DESC){
   id title{romaji english native} coverImage{large medium}
   averageScore episodes format seasonYear genres
  }
 }
}`;

function escapeHtml(value=''){
 const d=document.createElement('div'); d.textContent=value; return d.innerHTML;
}
function getTitle(a){return a.title.english||a.title.romaji||a.title.native||'Без названия'}
function renderCard(a){
 const title=getTitle(a);
 const score=a.averageScore ? (a.averageScore/10).toFixed(1) : '—';
 const tags=(a.genres||[]).slice(0,3).map(x=>`<span class="tag">${escapeHtml(x)}</span>`).join('');
 return `<article class="card" data-id="${a.id}">
  <div class="poster"><img loading="lazy" src="${a.coverImage.large||a.coverImage.medium||''}" alt="${escapeHtml(title)}"><span class="score">★ ${score}</span></div>
  <div class="info"><div class="title">${escapeHtml(title)}</div>
  <div class="meta">${a.seasonYear||'—'} · ${a.episodes ? a.episodes+' эп.' : (a.format||'ANIME')}</div>
  <div class="tags">${tags}</div></div></article>`;
}

async function load(reset=false){
 if(busy || (!hasNext && !reset)) return;
 busy=true;
 if(reset){
  page=1; hasNext=true;
  grid.innerHTML='<div class="loading">Загрузка аниме...</div>';
 }
 more.disabled=true; more.textContent='Загрузка...';
 try{
  const response=await fetch(API,{
   method:'POST',
   headers:{'Content-Type':'application/json','Accept':'application/json'},
   body:JSON.stringify({query,variables:{page,genre:genre||null,search:search||null}})
  });
  if(!response.ok) throw new Error('API вернул код '+response.status);
  const json=await response.json();
  if(json.errors) throw new Error(json.errors[0].message||'Ошибка API');
  const data=json.data.Page;
  if(reset) grid.innerHTML='';
  if(!data.media.length && page===1){
   grid.innerHTML='<div class="loading">Ничего не найдено.</div>';
  }else{
   grid.insertAdjacentHTML('beforeend',data.media.map(renderCard).join(''));
  }
  hasNext=data.pageInfo.hasNextPage;
  status.textContent=`Показано ${grid.querySelectorAll('.card').length} из ${data.pageInfo.total.toLocaleString('ru-RU')} тайтлов`;
  page++;
  more.style.display=hasNext?'inline-flex':'none';
 }catch(error){
  if(reset) grid.innerHTML=`<div class="loading">Не удалось загрузить каталог. Проверьте интернет и обновите страницу.<br><small>${escapeHtml(error.message)}</small></div>`;
  status.textContent='Ошибка загрузки';
  console.error(error);
 }finally{
  busy=false; more.disabled=false; more.textContent='Загрузить ещё';
 }
}

document.querySelectorAll('.genre').forEach(button=>{
 button.addEventListener('click',()=>{
  document.querySelectorAll('.genre').forEach(x=>x.classList.remove('active'));
  button.classList.add('active');
  genre=button.dataset.genre||'';
  search=''; input.value='';
  heading.textContent=genre?button.textContent:'Каталог аниме';
  load(true);
 });
});

input.addEventListener('input',()=>{
 clearTimeout(timer);
 timer=setTimeout(()=>{
  search=input.value.trim();
  genre='';
  document.querySelectorAll('.genre').forEach(x=>x.classList.toggle('active',x.dataset.genre===''));
  heading.textContent=search?`Поиск: ${search}`:'Каталог аниме';
  load(true);
 },450);
});

more.addEventListener('click',()=>load());
grid.addEventListener('click',event=>{
 const card=event.target.closest('.card');
 if(card) window.location.href=`anime.html?id=${encodeURIComponent(card.dataset.id)}`;
});
load(true);
