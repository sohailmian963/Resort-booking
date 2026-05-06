// ── ROOM DATA ──
const ROOMS={
  presidential:{type:'Signature Suite',name:'Presidential Suite',img:'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80',desc:'The absolute pinnacle of resort living. A private full-floor retreat with panoramic ocean views from every angle, a wraparound terrace, grand piano, and dedicated butler available around the clock.',details:{Size:'220 sqm',Capacity:'Up to 4 guests',View:'360° Ocean Panorama',Price:'$1,200 / night'},roomVal:'Presidential Suite'},
  deluxe:{type:'Premium',name:'Deluxe Ocean Room',img:'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=900&q=80',desc:'Spacious and refined, the Deluxe Ocean Room features a king-size bed, private balcony with unobstructed sea views, marble en-suite, and premium minibar.',details:{Size:'58 sqm',Capacity:'Up to 2 guests',View:'Direct Ocean View',Price:'$480 / night'},roomVal:'Deluxe Ocean Room'},
  junior:{type:'Suite',name:'Junior Suite',img:'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80',desc:'A beautifully appointed suite with a separate living room, king bedroom, and a private terrace overlooking the coastline. Perfect for couples seeking space and privacy.',details:{Size:'90 sqm',Capacity:'Up to 3 guests',View:'Coastal View',Price:'$680 / night'},roomVal:'Junior Suite'},
  standard:{type:'Classic',name:'Standard Room',img:'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=900&q=80',desc:'Elegantly appointed with premium bedding, rainfall shower, flat-screen TV, and garden or partial ocean views. The perfect balance of comfort and value.',details:{Size:'38 sqm',Capacity:'Up to 2 guests',View:'Garden / Partial Ocean',Price:'$280 / night'},roomVal:'Standard Room'},
  suite:{type:'Grand',name:'Grand Suite',img:'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=900&q=80',desc:'A two-bedroom masterpiece with a wraparound balcony, gourmet kitchenette, private dining area, and exclusive access to the Grand Lounge and concierge.',details:{Size:'145 sqm',Capacity:'Up to 4 guests',View:'Ocean & Skyline',Price:'$920 / night'},roomVal:'Grand Suite'}
};

let currentModalRoom=null;

// ── MODAL ──
function openModal(key){
  const r=ROOMS[key];currentModalRoom=r;
  document.getElementById('modalImg').src=r.img;
  document.getElementById('modalImg').alt=r.name;
  document.getElementById('modalType').textContent=r.type;
  document.getElementById('modalName').textContent=r.name;
  document.getElementById('modalDesc').textContent=r.desc;
  document.getElementById('modalDetails').innerHTML=Object.entries(r.details).map(([k,v])=>`<div class="modal-detail"><div class="modal-detail-label">${k}</div><div class="modal-detail-val">${v}</div></div>`).join('');
  document.getElementById('modalBg').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeModal(e){if(e.target===document.getElementById('modalBg'))closeModalBtn()}
function closeModalBtn(){document.getElementById('modalBg').classList.remove('open');document.body.style.overflow=''}
function bookFromModal(){
  closeModalBtn();
  if(currentModalRoom){document.getElementById('fRoom').value=currentModalRoom.roomVal}
  document.getElementById('book').scrollIntoView({behavior:'smooth'});
}

// ── NAV ──
window.addEventListener('scroll',()=>{
  document.getElementById('mainNav').classList.toggle('scrolled',window.scrollY>40)
});
function toggleMenu(){
  const m=document.getElementById('mobileMenu');
  const isOpen=m.classList.toggle('open');
  document.body.style.overflow=isOpen?'hidden':''; // Fix 5: prevent bg scroll when menu open
}
function scrollTo(sel){document.querySelector(sel).scrollIntoView({behavior:'smooth'})}

// ── PARTICLES ──
(function(){
  const c=document.getElementById('particles');
  for(let i=0;i<18;i++){
    const p=document.createElement('div');
    p.className='particle';
    const s=Math.random()*6+3;
    p.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*100}%;animation-duration:${Math.random()*15+10}s;animation-delay:${Math.random()*10}s;opacity:${Math.random()*0.4+0.1}`;
    c.appendChild(p);
  }
})();

// ── SCROLL REVEAL ──
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')});
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// ── DATES (Fix 1: local date, Fix 4: checkout auto-reset on checkin change) ──
const today=new Date().toLocaleDateString('en-CA'); // Fix 1: local timezone, not UTC
document.getElementById('fCheckin').min=today;
document.getElementById('fCheckout').min=today;
document.getElementById('fCheckin').addEventListener('change',function(){
  const coEl=document.getElementById('fCheckout');
  if(this.value){
    // Fix 4: always reset checkout if it is no longer valid after checkin changes
    const d=new Date(this.value);d.setDate(d.getDate()+1);
    const minCo=d.toLocaleDateString('en-CA'); // Fix 1: local timezone
    coEl.min=minCo;
    if(coEl.value && coEl.value<=this.value){
      coEl.value=''; // Force reset — prevents saving invalid range silently
    }
  } else {
    coEl.min=today;
    coEl.value='';
  }
});

// ── STORAGE ──
const KEY='azure_bookings';
function getB(){try{return JSON.parse(localStorage.getItem(KEY))||[]}catch{return[]}}
function saveB(b){localStorage.setItem(KEY,JSON.stringify(b))}

// ── TOAST ──
function showToast(title,msg,type=''){
  const t=document.getElementById('toast');
  document.getElementById('toastTitle').textContent=title;
  document.getElementById('toastMsg').textContent=msg;
  t.className='toast '+(type==='err'?'t-error':'');
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),3600);
}

// ── VALIDATION HELPERS ──
function setErr(id,errId,show){
  document.getElementById(id).classList.toggle('err',show);
  document.getElementById(errId).classList.toggle('show',show);
}
function clearErrs(){
  [['fName','fNameErr'],['fEmail','fEmailErr'],['fCheckin','fCheckinErr'],['fCheckout','fCheckoutErr'],['fRoom','fRoomErr'],['fGuests','fGuestsErr']].forEach(([a,b])=>setErr(a,b,false));
}

// ── SUBMIT ──
function submitBooking(){
  clearErrs();
  const n=document.getElementById('fName').value.trim();
  const e=document.getElementById('fEmail').value.trim();
  const ci=document.getElementById('fCheckin').value;
  const co=document.getElementById('fCheckout').value;
  const rt=document.getElementById('fRoom').value;
  const g=document.getElementById('fGuests').value;
  let ok=true;
  if(!n){setErr('fName','fNameErr',true);ok=false}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)){setErr('fEmail','fEmailErr',true);ok=false}
  if(!ci){setErr('fCheckin','fCheckinErr',true);ok=false}
  if(!co||co<=ci){setErr('fCheckout','fCheckoutErr',true);ok=false}
  if(!rt){setErr('fRoom','fRoomErr',true);ok=false}
  const gn=parseInt(g);
  if(!g||isNaN(gn)||gn<1||gn>10){setErr('fGuests','fGuestsErr',true);ok=false}
  if(!ok){showToast('Check Fields','Please fill all fields correctly.','err');return}
  const b=getB();
  b.unshift({id:Date.now(),name:n,email:e,checkin:ci,checkout:co,room:rt,guests:gn,status:'Confirmed'}); // Fix 2: rt is already clean value
  saveB(b);renderTable();
  ['fName','fEmail','fCheckin','fCheckout','fGuests'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('fRoom').value='';clearErrs();
  showToast('Reservation Confirmed',`Booking for ${n} is confirmed.`);
  document.getElementById('records').scrollIntoView({behavior:'smooth'});
}

// ── DELETE ──
function delBooking(id){
  saveB(getB().filter(b=>b.id!==id));renderTable();
  showToast('Booking Removed','Reservation has been deleted.','err');
}

// ── CLEAR ALL ──
function clearAll(){
  if(!getB().length){showToast('No Records','No bookings to clear.','err');return}
  if(!confirm('Delete all reservations?'))return;
  saveB([]);renderTable();
  showToast('All Cleared','All reservations removed.','err');
}

// ── FORMAT DATE ──
function fmtDate(v){if(!v)return'—';const[y,m,d]=v.split('-');return`${d}/${m}/${y}`}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

// ── RENDER ──
function renderTable(){
  const b=getB();
  const tbody=document.getElementById('bookBody');
  const empty=document.getElementById('emptyTbl');
  const count=document.getElementById('recCount');
  count.textContent=b.length?`${b.length} reservation${b.length>1?'s':''} on record`:'';
  if(!b.length){tbody.innerHTML='';empty.style.display='block';return}
  empty.style.display='none';
  tbody.innerHTML=b.map((r,i)=>`
    <tr>
      <td style="color:var(--muted);font-size:11px">${String(i+1).padStart(2,'0')}</td>
      <td><div style="font-weight:400">${esc(r.name)}</div><div class="guest-email">${esc(r.email)}</div></td>
      <td>${esc(r.room)}</td>
      <td>${fmtDate(r.checkin)}</td>
      <td>${fmtDate(r.checkout)}</td>
      <td>${esc(r.guests)}</td>
      <td><span class="badge-confirmed"><span class="badge-dot"></span>${esc(r.status)}</span></td>
      <td><button type="button" class="btn-del" onclick="delBooking(${r.id})">Delete</button></td>
    </tr>`).join('');
}

renderTable();