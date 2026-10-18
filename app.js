// 00. ការកំណត់ KHQR — ប្រើរូបភាព KHQR របស់អ្នក (មិនប្រើ API/ID)
const KHQR_CONFIG={
  readyAfterMinutes:1 // ប៊ូតុង Pay Ready លេចឡើងក្រោយបង្កើត QR ប៉ុន្មាននាទី
};

// 01. កំណត់កញ្ចប់ និងលេខក្បាលកូដ Active របស់ Khmer SRT
const plans=[
{id:'week1',name:'១ សប្ដាហ៍',days:7,uses:null,price:2,prefix:'147',qrImage:'khqr-2.png',available:true,desc:'មិនទាន់កំណត់ចំនួនដង'},
{id:'twoWeek',name:'២ សប្ដាហ៍',days:14,uses:null,price:2,prefix:'14',qrImage:'khqr-2.png',available:true,desc:'មិនទាន់កំណត់ចំនួនដង'},
{id:'month1',name:'១ ខែ',days:30,uses:50,price:5,prefix:'30',available:false,featured:true,desc:'មិនទាន់មាន KHQR'},
{id:'month2',name:'២ ខែ',days:60,uses:60,price:7,prefix:'60',available:false,desc:'មិនទាន់មាន KHQR'},
{id:'month3',name:'៣ ខែ',days:90,uses:80,price:null,prefix:'90',available:false,desc:'មិនទាន់កំណត់តម្លៃ និង KHQR'},
{id:'month4',name:'៤ ខែ',days:120,uses:90,price:null,prefix:'120',available:false,desc:'មិនទាន់កំណត់តម្លៃ និង KHQR'},
{id:'year1',name:'១ ឆ្នាំ',days:365,uses:200,price:null,prefix:'365',available:false,desc:'មិនទាន់កំណត់តម្លៃ និង KHQR'}
];
const CODE_LENGTHS={'14':26,'30':26,'60':26,'90':26,'147':27,'120':27,'365':27};
let selected=null,pending=null;
const grid=document.getElementById('grid'),dlg=document.getElementById('dlg'),formEl=document.getElementById('form'),payEl=document.getElementById('pay');
function render(){grid.innerHTML=plans.map(p=>`<article class="card ${p.featured?'featured':''}"><span class="code">${p.prefix?'លេខក្បាលកូដ '+p.prefix+'……':'មិនទាន់មានលេខក្បាលកូដ'}</span><div class="name">${p.name}</div>${p.price===null?'<div class="unpriced">មិនទាន់កំណត់តម្លៃ</div>':`<div class="price">$${p.price}<small> / កញ្ចប់</small></div>`}<p class="desc">${p.desc}</p><ul class="features"><li>ប្រើបាន ${p.days} ថ្ងៃ</li><li>${p.uses===null?'ចំនួនដងមិនទាន់កំណត់':`បម្លែងបាន ${p.uses} ដង`}</li><li>${p.prefix?'កូដចាប់ផ្ដើមដោយ '+p.prefix:'លេខក្បាលកូដមិនទាន់កំណត់'}</li><li class="${p.available?'':'off'}">${p.available?'អាចស្នើទិញបាន':'មិនទាន់អាចបញ្ជាទិញបាន'}</li></ul>${p.available?`<button class="btn" onclick="openOrder('${p.id}')">ទិញកញ្ចប់នេះ →</button>`:'<button class="secondary" disabled>មិនទាន់មានលក់</button>'}</article>`).join('')}
function showStep(s){formEl.hidden=s!=='form';payEl.hidden=s!=='pay'}
function openOrder(id){selected=plans.find(p=>p.id===id);document.getElementById('chosen').textContent=`${selected.name} · ${selected.days} ថ្ងៃ · ${selected.uses} ដង · $${selected.price} · Prefix ${selected.prefix}`;showStep('form');dlg.showModal()}
document.querySelectorAll('.close').forEach(b=>b.onclick=()=>b.closest('dialog').close());
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
dlg.addEventListener('close',()=>{stopTimer();document.getElementById('qr').innerHTML='';showStep('form')});
formEl.addEventListener('submit',e=>{
  e.preventDefault();
  pending={orderId:'KS-'+Date.now().toString().slice(-8),createdAt:new Date().toISOString(),
    plan:{id:selected.id,name:selected.name,days:selected.days,uses:selected.uses,price:selected.price,codePrefix:selected.prefix,qrImage:selected.qrImage},
    paymentMethod:'KHQR',status:'pending'};
  showPayment(pending);
});
let timerId=null;
const $$=id=>document.getElementById(id);
function setStage(s){['payGen','payQr','payWait','payGet','payCode'].forEach(id=>$$(id).hidden=id!==s);$$('cancel').hidden=s==='payCode'}
function stopTimer(){clearTimeout(timerId);timerId=null}
async function copyText(t){try{await navigator.clipboard.writeText(t)}catch(_){const x=document.createElement('textarea');x.value=t;document.body.appendChild(x);x.select();document.execCommand('copy');x.remove()}}
function toast(m,ms=3500){const t=$$('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),ms)}
function showPayment(o){
  $$('payInfo').innerHTML=`${o.plan.name} · ${o.plan.days} ថ្ងៃ<br><b>$${o.plan.price.toFixed(2)}</b>`;
  stopTimer();$$('qr').innerHTML='';
  $$('payGenMsg').textContent=o.plan.qrImage?'ចុចប៊ូតុងខាងក្រោម ដើម្បីបង្ហាញ KHQR។':'មិនទាន់មាន KHQR សម្រាប់កញ្ចប់នេះទេ។';
  $$('genQr').hidden=!o.plan.qrImage;
  setStage('payGen');showStep('pay');
}
$$('genQr').onclick=()=>{
  const qr=$$('qr'),warn=$$('qrWarn');
  qr.className='qr-img';qr.innerHTML='';
  const img=new Image();img.alt='KHQR $'+pending.plan.price.toFixed(2);img.src=pending.plan.qrImage;
  img.onerror=()=>{qr.className='qr-empty';qr.textContent='KHQR';warn.textContent='⚠ រកមិនឃើញរូប KHQR ('+pending.plan.qrImage+') ទេ។ សូមដាក់រូបក្នុង folder តែមួយជាមួយ index.html។'};
  qr.appendChild(img);
  warn.textContent='សូមស្កេន KHQR តាម Bakong ឬកម្មវិធីធនាគារ ហើយបង់ចំនួន $'+pending.plan.price.toFixed(2)+'។';
  stopTimer();$$('ready').hidden=true;setStage('payQr');
  timerId=setTimeout(()=>{$$('ready').hidden=false},KHQR_CONFIG.readyAfterMinutes*60000);
};
$$('ready').onclick=()=>{stopTimer();$$('qr').innerHTML='';setStage('payWait');setTimeout(()=>setStage('payGet'),2000)};
$$('getCode').onclick=()=>{
  const p=pending.plan.codePrefix,code=p+rnd(CODE_LENGTHS[p]-p.length);
  pending.activationCode=code;pending.status='paid_claimed';pending.paymentClaimedAt=new Date().toISOString();
  $$('actCode').textContent=code;setStage('payCode');
};
$$('copyCode').onclick=async e=>{await copyText($$('actCode').textContent);e.target.textContent='✓ បានចម្លង';setTimeout(()=>e.target.textContent='ចម្លង',2000)};
$$('cancel').onclick=()=>dlg.close();
document.getElementById('year').textContent=new Date().getFullYear();render();

// 02. ឧបករណ៍បង្កើតកូដ Active (សម្រាប់អ្នកគ្រប់គ្រង) — ប្ដូរលេខសម្ងាត់ដោយជំនួស ADMIN_HASH (SHA-256)
const ADMIN_HASH='7f70b51797099812f61b6dbb284d5475ce2789eb3c15f48b364b1860ae2231fd'; // លំនាំដើម: khmersrt
const CODE_PREFIXES=[{p:'147',n:'១ សប្ដាហ៍',d:7},{p:'14',n:'២ សប្ដាហ៍',d:14},{p:'30',n:'១ ខែ',d:30},{p:'60',n:'២ ខែ',d:60},{p:'90',n:'៣ ខែ',d:90},{p:'120',n:'៤ ខែ',d:120},{p:'365',n:'១ ឆ្នាំ',d:365}];
const $=id=>document.getElementById(id),adm=$('adm');let codes=[];
$('plan').innerHTML=CODE_PREFIXES.map(x=>`<option value="${x.p}">${x.p}…… = ${x.n} (${x.d} ថ្ងៃ)</option>`).join('');
function updateCodeLength(){ $('len').value=CODE_LENGTHS[$('plan').value] }
$('plan').addEventListener('change',updateCodeLength);updateCodeLength();
const rnd=n=>{const a=new Uint32Array(n);crypto.getRandomValues(a);return Array.from(a,v=>v%10).join('')};
async function sha256(s){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,'0')).join('')}
$('admLink').onclick=e=>{e.preventDefault();$('admPw').value='';$('admErr').textContent='';$('admLock').hidden=false;$('admTool').hidden=true;adm.showModal()};
adm.addEventListener('click',e=>{if(e.target===adm)adm.close()});
adm.addEventListener('close',()=>{codes=[];$('out').innerHTML='';$('acts').hidden=true;$('admTool').hidden=true;$('admLock').hidden=false});
async function admLogin(){
  if(!(window.crypto&&crypto.subtle)){$('admErr').textContent='Browser នេះមិនគាំទ្រ (ត្រូវការ HTTPS)។';return}
  if(await sha256($('admPw').value)===ADMIN_HASH){$('admLock').hidden=true;$('admTool').hidden=false}else $('admErr').textContent='លេខសម្ងាត់មិនត្រឹមត្រូវ។';
}
$('admOk').onclick=admLogin;$('admPw').addEventListener('keydown',e=>{if(e.key==='Enter')admLogin()});
$('gen').onclick=()=>{
  const p=$('plan').value,len=CODE_LENGTHS[p],qty=Math.max(1,Math.min(200,+$('qty').value||1));
  $('len').value=len;
  const set=new Set();while(set.size<qty)set.add(p+rnd(len-p.length));codes=[...set];
  $('out').innerHTML=codes.map(c=>`<li><code><b>${p}</b>${c.slice(p.length)}</code><button type="button" class="copybtn" data-c="${c}">ចម្លង</button></li>`).join('');$('acts').hidden=false;
};
$('out').onclick=async e=>{if(e.target.dataset.c){await copyText(e.target.dataset.c);toast('✓ បានចម្លង',1800)}};
$('copyAll').onclick=async()=>{await copyText(codes.join('\n'));toast('✓ បានចម្លងទាំងអស់',1800)};
$('csv').onclick=()=>{const p=$('plan').value,x=CODE_PREFIXES.find(v=>v.p===p);const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['code,prefix,days\n'+codes.map(c=>`${c},${p},${x.d}`).join('\n')],{type:'text/csv'}));a.download='codes-'+p+'.csv';a.click()};
