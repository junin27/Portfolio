// Each painted scene contains a scaled copy of the next. The camera lands
// on the same pixels that become the next scene's full-size frame.
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const range = document.querySelector('input');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const links = [...document.querySelectorAll('nav a')];
const chapters = [...document.querySelectorAll('section')];
let frames = [];
let portal;
let pending = false;

function paint(scene, width, height) {
  const layer = document.createElement('canvas');
  layer.width = width;
  layer.height = height;
  const g = layer.getContext('2d');
  g.scale(width / 1000, height / 700);
  const rect = (x,y,w,h,color) => { g.fillStyle=color; g.fillRect(x,y,w,h); };
  function shape(points,color,stroke=false) {
    g.beginPath();
    points.forEach(([x,y],i)=>i ? g.lineTo(x,y) : g.moveTo(x,y));
    if(stroke){g.strokeStyle=color;g.stroke();}else{g.closePath();g.fillStyle=color;g.fill();}
  }
  function disc(x,y,r,color){g.fillStyle=color;g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill();}
  let seed=917;
  const random=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);
  const sky=g.createLinearGradient(0,0,0,700);
  const colors=[['#233947','#e69d78'],['#839c92','#f5c795'],['#102c38','#588375']];
  sky.addColorStop(0,colors[scene][0]);sky.addColorStop(1,colors[scene][1]);
  rect(0,0,1000,700,sky);
  if(scene!==2) {
    disc(805,192,76,'#f6cf96');
    for(let i=0;i<5;i++){
      const ridge=[];
      for(let x=-10;x<=1010;x+=6){
        const y=272+i*55+Math.sin(x/109+i*2)*43+Math.cos(x/59+i)*19+random()*4;
        ridge.push([x,y]);
      }
      shape([...ridge,[1010,700],[-10,700]],['#a89886','#85958c','#617f79','#416764','#274d50'][i]);
      if(i>1) for(let j=0;j<ridge.length;j+=2){
        const [x,y]=ridge[j],h=4+random()*i*3;
        shape([[x-3,y+2],[x,y-h],[x+3,y+2]],['','','#617f79','#416764','#274d50'][i]);
      }
    }
  }
  if(scene===0){
    // Broad window, timber mullions, desk and an illuminated brass instrument.
    rect(0,0,1000,28,'#15282e');rect(450,0,15,480,'#293b40');rect(0,375,1000,9,'#263a3f');
    shape([[0,508],[1000,445],[1000,700],[0,700]],'#60483c');
    for(let i=0;i<180;i++){let x=random()*1000,y=510+random()*190;rect(x,y,15+random()*120,1,'#b4906b42');}
    for(let i=0;i<4;i++)rect(390+i*4,500-i*8,112,7,['#b36f54','#304f50','#e0b891','#35575c'][i]);
  }else if(scene===1){
    shape([[680,405],[710,402],[625,470],[776,535],[580,630],[660,700],[530,700],[482,635],[695,529],[591,468]],'#99bcb0');
    for(let i=0;i<36;i++){let x=random()*1000,y=500+random()*200;shape([[x-11,y],[x,y-36],[x+11,y]],'#22484a');}
  }else{
    for(let row=0;row<100;row++){
      const points=[];
      for(let x=0;x<=1000;x+=5){
        const peak=Math.exp(-((x-620)**2)/60000-((row-47)**2)/1500);
        points.push([x,165+row*5-peak*Number(range.value)*(2+.8*Math.cos(x/67+row/35))]);
      }
      shape(points,'rgba(171,221,177,'+(.24+row/190)+')',true);
    }
  }
  for(let i=0;i<6500;i++){const x=random()*1000,y=random()*700;rect(x,y,1+random()*2,1,'#fff2c318');}
  const shade=g.createLinearGradient(0,0,800,0);
  shade.addColorStop(0,'#102530cd');shade.addColorStop(1,'#10253000');rect(0,0,1000,700,shade);
  return layer;
}

function rebuild(){
  const w=canvas.clientWidth,h=canvas.clientHeight;
  const resolution=Math.min(devicePixelRatio,1.5,1800/Math.max(w,h));
  canvas.width=Math.round(w*resolution);canvas.height=Math.round(h*resolution);
  portal=w<700 ? {x:.24,y:.50,s:.53} : {x:.575,y:.32,s:.32};
  const {x,y,s}=portal;
  frames=[0,1,2,0].map(i=>paint(i,canvas.width,canvas.height));
  for(let i=2;i>=0;i--){
    const g=frames[i].getContext('2d');
    g.save();g.scale(canvas.width,canvas.height);
    g.shadowColor='#12282a';g.shadowBlur=16;
    g.fillStyle=['#54483c','#bdad83','#a3bdab'][i];
    g.fillRect(x-.01,y-.012,s+.02,s+.024);
    g.shadowBlur=0;g.drawImage(frames[i+1],x,y,s,s);g.restore();
  }
  render();
}
function render(){
  pending=false;
  const step=Math.min(3,Math.max(0,scrollY/chapters[0].offsetHeight));
  const i=Math.floor(step), fraction=step-i;
  const t=reduced.matches ? 0 : fraction*fraction*(3-2*fraction);
  const zoom=portal.s**(-t);
  const travel=(zoom-1)/(1/portal.s-1);
  const w=canvas.width,h=canvas.height;
  ctx.setTransform(zoom,0,0,zoom,-portal.x*w*travel/portal.s,-portal.y*h*travel/portal.s);
  ctx.drawImage(frames[i],0,0);
  // Redraw the inset at native resolution as it approaches the viewport.
  if(i<3)ctx.drawImage(frames[i+1],portal.x*w,portal.y*h,portal.s*w,portal.s*h);
  links.forEach((link,index)=>link.toggleAttribute('aria-current',index===Math.round(step)));
}
function schedule(){if(!pending){pending=true;requestAnimationFrame(render);}}
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',rebuild);
range.addEventListener('input',rebuild);
reduced.addEventListener('change',schedule);
rebuild();
range.addEventListener('input', () => {
  document.querySelector('output').value = range.value;
});
const archive = document.querySelector('dialog');
document.querySelectorAll('[data-open]').forEach(button => {
  button.addEventListener('click', () => archive.showModal());
});
