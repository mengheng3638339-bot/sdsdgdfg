// 01. កំណត់កញ្ចប់ និងលេខក្បាលកូដ Active របស់ Khmer SRT
const plans=[
{id:'week1',name:'១ សប្ដាហ៍',days:7,uses:null,price:0,prefix:'147',available:true,desc:'ឥតគិតថ្លៃ'},
{id:'twoWeek',name:'២ សប្ដាហ៍',days:14,uses:null,price:0,prefix:'14',available:true,desc:'ឥតគិតថ្លៃ'},
{id:'month1',name:'១ ខែ',days:30,uses:50,price:0,prefix:'30',available:true,featured:true,desc:'ឥតគិតថ្លៃ'},
{id:'month2',name:'២ ខែ',days:60,uses:60,price:0,prefix:'60',available:true,desc:'ឥតគិតថ្លៃ'},
{id:'month3',name:'៣ ខែ',days:90,uses:80,price:0,prefix:'90',available:true,desc:'ឥតគិតថ្លៃ'},
{id:'month4',name:'៤ ខែ',days:120,uses:90,price:0,prefix:'120',available:true,desc:'ឥតគិតថ្លៃ'},
{id:'year1',name:'១ ឆ្នាំ',days:365,uses:200,price:0,prefix:'365',available:true,desc:'ឥតគិតថ្លៃ'}
];
const CODE_LENGTHS={'14':26,'30':26,'60':26,'90':26,'147':27,'120':27,'365':27};
let selected=null;
const grid=document.getElementById('grid'),dlg=document.getElementById('dlg'),formEl=document.getElementById('form'),claimResult=document.getElementById('claimResult');
function render(){grid.innerHTML=plans.map(p=>`<article class="card ${p.featured?'featured':''}"><span class="code">លេខក្បាលកូដ ${p.prefix}……</span><div class="name">${p.name}</div><div class="price">ឥតគិតថ្លៃ<small> / កញ្ចប់</small></div><p class="desc">${p.desc}</p><ul class="features"><li>ប្រើបាន ${p.days} ថ្ងៃ</li><li>${p.uses===null?'ចំនួនដងមិនទាន់កំណត់':`បម្លែងបាន ${p.uses} ដង`}</li><li>កូដចាប់ផ្ដើមដោយ ${p.prefix}</li><li>អាចទទួលបាន</li></ul><button class="btn" onclick="openOrder('${p.id}')">ទទួលកញ្ចប់ឥតគិតថ្លៃ →</button></article>`).join('')}
function openOrder(id){selected=plans.find(p=>p.id===id);document.getElementById('chosen').textContent=`${selected.name} · ${selected.days} ថ្ងៃ · ${selected.uses===null?'មិនកំណត់ចំនួនដង':selected.uses+' ដង'} · ឥតគិតថ្លៃ · Prefix ${selected.prefix}`;formEl.hidden=false;claimResult.hidden=true;dlg.showModal()}
document.querySelectorAll('.close').forEach(b=>b.onclick=()=>b.closest('dialog').close());
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
dlg.addEventListener('close',()=>{selected=null;formEl.hidden=false;claimResult.hidden=true});
formEl.addEventListener('submit',e=>{
  e.preventDefault();
  if(!selected)return;
  const code=selected.prefix+rnd(CODE_LENGTHS[selected.prefix]-selected.prefix.length);
  document.getElementById('actCode').textContent=code;
  formEl.hidden=true;claimResult.hidden=false;
});
const $$=id=>document.getElementById(id);
async function copyText(t){try{await navigator.clipboard.writeText(t)}catch(_){const x=document.createElement('textarea');x.value=t;document.body.appendChild(x);x.select();document.execCommand('copy');x.remove()}}
function toast(m,ms=3500){const t=$$('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),ms)}
$$('copyCode').onclick=async e=>{await copyText($$('actCode').textContent);e.target.textContent='✓ បានចម្លង';setTimeout(()=>e.target.textContent='ចម្លង',2000)};
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
