// ── Formulario de contacto ────────────────────────────────────────────────
function submitForm(btn) {
  var nombre  = (document.getElementById('f-nombre')  || {}).value || '';
  var wa      = (document.getElementById('f-wa')      || {}).value || '';
  var email   = (document.getElementById('f-email')   || {}).value || '';
  var destino = (document.getElementById('f-destino') || {}).value || '';
  var mensaje = (document.getElementById('f-mensaje') || {}).value || '';

  // Validación mínima
  if (!nombre.trim()) {
    _showFormError('f-nombre', 'Ingresá tu nombre'); return false;
  }
  if (!wa.trim() && !email.trim()) {
    _showFormError('f-wa', 'Ingresá tu WhatsApp o email'); return false;
  }

  // Armar mensaje para WhatsApp
  var lines = [
    '👋 *Nueva consulta desde la web*',
    '',
    '👤 Nombre: ' + nombre.trim(),
  ];
  if (wa.trim())      lines.push('📱 WhatsApp: ' + wa.trim());
  if (email.trim())   lines.push('📧 Email: ' + email.trim());
  if (destino)        lines.push('🌍 Destino: ' + destino);
  if (mensaje.trim()) lines.push('💬 ' + mensaje.trim());

  var text = lines.join('\n');

  // GA4
  _ga('generate_lead', { event_category: 'contacto', event_label: destino || 'formulario', currency: 'ARS', value: 1 });

  // Abrir WhatsApp con los datos
  window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');

  // Feedback visual en el formulario
  var form = btn.closest('.c-form');
  if (form) {
    btn.textContent = '✓ Consulta enviada';
    btn.style.background = 'var(--green)';
    btn.disabled = true;
    var msg = document.createElement('p');
    msg.style.cssText = 'font-size:0.82rem;color:var(--green-lt);text-align:center;margin-top:12px;';
    msg.textContent = 'Te abrimos WhatsApp con tu consulta. ¡Te respondemos en menos de 2 hs!';
    btn.after(msg);
  }
  return false;
}

function _showFormError(fieldId, text) {
  var el = document.getElementById(fieldId);
  if (!el) return;
  el.style.borderColor = 'var(--red)';
  el.focus();
  var err = el.parentElement.querySelector('.f-err');
  if (!err) {
    err = document.createElement('span');
    err.className = 'f-err';
    err.style.cssText = 'font-size:0.72rem;color:var(--red);margin-top:4px;display:block;';
    el.after(err);
  }
  err.textContent = text;
  el.addEventListener('input', function() {
    el.style.borderColor = '';
    if (err) err.remove();
  }, { once: true });
}

const nav = document.getElementById("nav");
window.addEventListener("scroll",()=>nav.classList.toggle("scrolled",scrollY>50));

const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add("vis");obs.unobserve(e.target);}
  });
},{threshold:0.08});
document.querySelectorAll(".fade-up,.fade-left,.fade-right,.scale-in").forEach(el=>obs.observe(el));
setTimeout(()=>document.querySelectorAll("#hero .fade-up").forEach(el=>el.classList.add("vis")),150);

const pkgObs = new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting){
      setTimeout(()=>e.target.classList.add("vis"),i*120);
      pkgObs.unobserve(e.target);
    }
  });
},{threshold:0.05});
document.querySelectorAll(".pkg-card").forEach(el=>pkgObs.observe(el));

function animateCount(el, target, suffix="") {
  let start=0,duration=1800,step=duration/60,increment=target/60;
  const timer=setInterval(()=>{
    start+=increment;
    if(start>=target){start=target;clearInterval(timer);}
    el.textContent=Math.round(start)+suffix;
  },step);
}
const statsObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const stats=e.target.querySelectorAll(".stat-n");
      const vals=[500,12,4.9,8],sfx=["+","+","",""];
      stats.forEach((s,i)=>animateCount(s,vals[i],sfx[i]));
      statsObs.unobserve(e.target);
    }
  });
},{threshold:0.3});
const heroStats=document.querySelector(".hero-stats");
if(heroStats)statsObs.observe(heroStats);

document.querySelectorAll(".pkg-card").forEach(card=>{
  card.addEventListener("mousemove",e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-0.5,y=(e.clientY-r.top)/r.height-0.5;
    card.style.transform=`translateY(-8px) rotateX(${-y*6}deg) rotateY(${x*6}deg)`;
    card.style.transition="transform 0.1s ease";
  });
  card.addEventListener("mouseleave",()=>{card.style.transform="";card.style.transition="transform 0.5s ease";});
});

const sections=document.querySelectorAll("section[id]");
const navLinks=document.querySelectorAll(".nav-links a");
const navObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      navLinks.forEach(a=>{a.style.color=a.getAttribute("href")==="#"+e.target.id?"var(--gold-lt)":"";});
    }
  });
},{threshold:0.4});
sections.forEach(s=>navObs.observe(s));

function toggleFaq(el){el.parentElement.classList.toggle("open");}

document.querySelectorAll(".dest-filter").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".dest-filter").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
  });
});

let mo=false;
function toggleMenu(){
  mo=!mo;
  const links=document.querySelector(".nav-links");
  if(mo){
    links.style.cssText="display:flex;flex-direction:column;position:fixed;top:66px;left:0;right:0;background:rgba(12,12,12,0.98);backdrop-filter:blur(20px);padding:28px;gap:20px;border-bottom:1px solid rgba(196,150,58,0.2);z-index:99;";
  }else{links.removeAttribute("style");}
  document.querySelectorAll(".nav-links a").forEach(a=>{
    a.addEventListener("click",()=>{mo=false;links.removeAttribute("style");});
  });
}

document.addEventListener("mousemove",e=>{
  const x=(e.clientX/innerWidth-0.5)*14,y=(e.clientY/innerHeight-0.5)*10;
  document.querySelectorAll(".orb").forEach((o,i)=>{o.style.transform=`translate(${x*(i+1)*0.5}px,${y*(i+1)*0.5}px)`;});
});

// ── Email ─────────────────────────────────────────────────────────────────
var MAIL = 'tuleona@gmail.com';

/**
 * Abre el cliente de correo con la dirección centralizada.
 * @param {string} [subject] Asunto pre-cargado (opcional)
 */
function openMail(subject) {
  var sub = subject ? '?subject=' + encodeURIComponent(subject) : '';
  window.location.href = 'mailto:' + MAIL + sub;
  return false;
}

// ── WhatsApp ─────────────────────────────────────────────────────────────
var WA_NUMBER = '5493885820032';

/**
 * Abre WhatsApp con el número centralizado.
 * @param {string} [msg]  Mensaje pre-cargado (opcional)
 * @param {string} [zone] Zona del click para GA4 (nav, hero, paquetes, galeria, footer, flotante)
 */
function openWhatsApp(msg, zone) {
  var text = msg ? '?text=' + encodeURIComponent(msg) : '';
  window.open('https://wa.me/' + WA_NUMBER + text, '_blank', 'noopener,noreferrer');
  _ga('whatsapp_click', {
    event_category: 'conversion',
    event_label: zone || 'general',
    value: 1
  });
  return false; // evita que <a href="#"> recargue la página
}

// ── GA4 — Eventos de conversión ──────────────────────────────────────────
function _ga(name,params){if(typeof gtag!=='undefined')gtag('event',name,params||{});}

document.querySelectorAll('.hero-btns a,.hero-btns button').forEach(function(el){
  el.addEventListener('click',function(){
    _ga('cta_click',{event_category:'hero',event_label:el.textContent.trim().slice(0,50)});
  });
});

document.querySelectorAll('.pkg-card').forEach(function(el){
  el.addEventListener('click',function(){
    var name=(el.querySelector('.pkg-name')||{}).textContent||'paquete';
    _ga('select_item',{content_type:'paquete',item_name:name.trim(),event_category:'paquetes'});
  });
});

document.querySelectorAll('.dc').forEach(function(el){
  el.addEventListener('click',function(){
    var name=(el.querySelector('.dc-name')||{}).textContent||'destino';
    _ga('select_item',{content_type:'destino',item_name:name.trim(),event_category:'destinos'});
  });
});

var fSubmit=document.querySelector('.f-submit');
if(fSubmit){
  fSubmit.addEventListener('click',function(){
    _ga('generate_lead',{event_category:'contacto',event_label:'formulario',currency:'ARS',value:1});
  });
}

document.querySelectorAll('.faq-q').forEach(function(el){
  el.addEventListener('click',function(){
    _ga('faq_open',{event_category:'engagement',event_label:el.textContent.trim().slice(0,60)});
  });
});

var _depths=[25,50,75,90],_fired={};
window.addEventListener('scroll',function(){
  var pct=Math.round(scrollY/(document.body.scrollHeight-innerHeight)*100);
  _depths.forEach(function(d){
    if(pct>=d&&!_fired[d]){_fired[d]=1;_ga('scroll_depth',{event_category:'engagement',event_label:d+'%',value:d});}
  });
},{passive:true});
