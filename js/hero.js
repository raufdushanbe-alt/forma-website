(function(){
  const hero = document.querySelector('.text-story-hero');
  const canvas = document.getElementById('storyNetworkCanvas');
  const lines = Array.from(document.querySelectorAll('.story-line'));
  const dots = Array.from(document.querySelectorAll('.story-cycle-dots span'));
  const conclusion = document.getElementById('storyConclusion');

  if(!hero || !canvas || !lines.length) return;

  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let current = 0;
  let cycleCount = 0;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let nodes = [];
  let raf = 0;
  let mouse = {x:0,y:0,active:false};

  function setStory(index){
    lines.forEach((line,i)=>line.classList.toggle('is-active',i===index));
    dots.forEach((dot,i)=>dot.classList.toggle('is-active',i===index));

    current = index;

    if(index === 2 && !conclusion.classList.contains('is-visible')){
      setTimeout(()=>conclusion.classList.add('is-visible'),1250);
    }
  }

  setStory(0);

  if(!reduced){
    setInterval(()=>{
      cycleCount++;
      setStory((current+1)%lines.length);
    },4000);
  }else{
    conclusion.classList.add('is-visible');
  }

  function resize(){
    const rect = hero.getBoundingClientRect();
    width = Math.max(1,Math.round(rect.width));
    height = Math.max(1,Math.round(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1,1.5);

    canvas.width = Math.round(width*dpr);
    canvas.height = Math.round(height*dpr);
    canvas.style.width = width+'px';
    canvas.style.height = height+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);

    const count = width < 600 ? 54 : width < 1000 ? 88 : 132;
    nodes = Array.from({length:count},(_,i)=>{
      const side = i%2===0 ? -1 : 1;
      const margin = width < 700 ? width*.16 : width*.25;
      const center = width/2;
      let x;

      if(side < 0){
        x = Math.random()*(center-margin);
      }else{
        x = center+margin+Math.random()*(center-margin);
      }

      return{
        x,
        y:Math.random()*height,
        vx:(Math.random()-.5)*1.15,
        vy:(Math.random()-.5)*1.15,
        r:1.1+Math.random()*2.1,
        phase:Math.random()*Math.PI*2
      };
    });
  }

  function enforceTextSafeZone(node){
    const centerX = width/2;
    const centerY = height*.47;
    const safeW = width < 700 ? width*.80 : width*.58;
    const safeH = width < 700 ? 330 : 360;

    const dx = node.x-centerX;
    const dy = node.y-centerY;

    if(Math.abs(dx)<safeW/2 && Math.abs(dy)<safeH/2){
      const pushX = (safeW/2-Math.abs(dx)+12)*Math.sign(dx || (Math.random()-.5));
      node.x += pushX;
      node.vx += Math.sign(pushX)*.08;
    }
  }

  function draw(time){
    ctx.clearRect(0,0,width,height);

    for(const node of nodes){
      if(!reduced){
        node.phase += .045;
        node.x += node.vx + Math.sin(node.phase)*.18;
        node.y += node.vy + Math.cos(node.phase*.8)*.14;

        if(node.x < -35) node.x = width+35;
        if(node.x > width+35) node.x = -35;
        if(node.y < -35) node.y = height+35;
        if(node.y > height+35) node.y = -35;

        enforceTextSafeZone(node);

        if(mouse.active){
          const dx = mouse.x-node.x;
          const dy = mouse.y-node.y;
          const dist = Math.hypot(dx,dy);

          if(dist<210 && dist>0){
            const pull = (1-dist/210)*.018;
            node.vx += dx/dist*pull;
            node.vy += dy/dist*pull;
          }
        }

        node.vx *= .994;
        node.vy *= .994;
      }
    }

    for(let i=0;i<nodes.length;i++){
      const a = nodes[i];

      for(let j=i+1;j<nodes.length;j++){
        const b = nodes[j];
        const dx = a.x-b.x;
        const dy = a.y-b.y;
        const dist = Math.hypot(dx,dy);

        if(dist<220){
          const opacity = Math.max(0,(1-dist/220)*.28);
          ctx.strokeStyle = `rgba(112,130,153,${opacity})`;
          ctx.lineWidth = dist<80 ? 1.2 : .8;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }

    for(const node of nodes){
      ctx.fillStyle = 'rgba(89,108,133,.54)';
      ctx.beginPath();
      ctx.arc(node.x,node.y,node.r,0,Math.PI*2);
      ctx.fill();

      if(node.r>2.1){
        ctx.fillStyle = 'rgba(130,157,193,.10)';
        ctx.beginPath();
        ctx.arc(node.x,node.y,node.r*4,0,Math.PI*2);
        ctx.fill();
      }
    }

    raf = requestAnimationFrame(draw);
  }

  hero.addEventListener('pointermove',event=>{
    const rect = hero.getBoundingClientRect();
    mouse.x = event.clientX-rect.left;
    mouse.y = event.clientY-rect.top;
    mouse.active = true;
  });

  hero.addEventListener('pointerleave',()=>{
    mouse.active = false;
  });

  resize();
  raf = requestAnimationFrame(draw);
  window.addEventListener('resize',resize);
  window.addEventListener('pagehide',()=>cancelAnimationFrame(raf));
})();

(function(){
const hero=document.querySelector('.generative-hero'),visual=document.getElementById('genHeroVisual'),shape=document.getElementById('genShape'),glow=document.getElementById('genShapeGlow'),fill=document.getElementById('genShapeFill'),nodesGroup=document.getElementById('genNodes'),formLabel=document.getElementById('genFormLabel'),dots=[...document.querySelectorAll('.gen-form-dots span')],stories=[...document.querySelectorAll('.gen-story-line')],conclusion=document.getElementById('genConclusion');
if(!hero||!visual||!shape||!glow||!fill||!nodesGroup||!stories.length)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,cycle=4600,morphTime=1450;
const forms=[
{label:'FOLDING CARTON',p:[[250,170],[510,170],[555,205],[565,535],[525,590],[235,590],[195,535],[205,205],[250,170],[300,145],[460,145],[510,170]]},
{label:'STAND-UP POUCH',p:[[255,145],[505,145],[545,190],[565,525],[515,605],[245,605],[195,525],[215,190],[255,145],[290,170],[470,170],[505,145]]},
{label:'BOTTLE',p:[[320,120],[440,120],[448,180],[495,225],[515,545],[470,620],[290,620],[245,545],[265,225],[312,180],[320,120],[380,105]]},
{label:'ALUMINIUM CAN',p:[[285,135],[475,135],[510,165],[525,565],[490,615],[270,615],[235,565],[250,165],[285,135],[320,120],[440,120],[475,135]]}
];
let current=0,from=forms[0].p.map(p=>p.slice()),to=from.map(p=>p.slice()),pts=from.map(p=>p.slice()),start=performance.now(),morphing=false,last=performance.now();
function path(a){let d=`M ${a[0][0]} ${a[0][1]}`;for(let i=0;i<a.length;i++){const p0=a[(i-1+a.length)%a.length],p1=a[i],p2=a[(i+1)%a.length],p3=a[(i+2)%a.length],c1x=p1[0]+(p2[0]-p0[0])/6,c1y=p1[1]+(p2[1]-p0[1])/6,c2x=p2[0]-(p3[0]-p1[0])/6,c2y=p2[1]-(p3[1]-p1[1])/6;d+=` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;}return d+' Z'}
function nodes(a){nodesGroup.replaceChildren();a.forEach((p,i)=>{if(i%2)return;const n=a[(i+1)%a.length],l=document.createElementNS('http://www.w3.org/2000/svg','line');l.setAttribute('x1',p[0]);l.setAttribute('y1',p[1]);l.setAttribute('x2',(p[0]+n[0])/2);l.setAttribute('y2',(p[1]+n[1])/2);l.setAttribute('class','gen-handle');nodesGroup.appendChild(l);const c=document.createElementNS('http://www.w3.org/2000/svg','circle');c.setAttribute('cx',p[0]);c.setAttribute('cy',p[1]);c.setAttribute('r','5.5');c.setAttribute('class','gen-node');nodesGroup.appendChild(c);})}
function draw(a){const d=path(a);shape.setAttribute('d',d);glow.setAttribute('d',d);fill.setAttribute('d',d);if(morphing)nodes(a)}
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function story(i){stories.forEach((e,j)=>e.classList.toggle('is-active',j===i%stories.length));if(i%stories.length===2&&!conclusion.classList.contains('is-visible'))setTimeout(()=>conclusion.classList.add('is-visible'),1300)}
function begin(i,now){from=pts.map(p=>p.slice());to=forms[i].p.map(p=>p.slice());start=now;morphing=true;visual.classList.add('is-morphing');current=i;formLabel.textContent=forms[i].label;dots.forEach((d,j)=>d.classList.toggle('is-active',j===i));story(i)}
function loop(now){if(!reduced){if(!morphing&&now-last>cycle-morphTime)begin((current+1)%forms.length,now);if(morphing){const r=Math.min(1,(now-start)/morphTime),t=ease(r);pts=from.map((p,i)=>[p[0]+(to[i][0]-p[0])*t,p[1]+(to[i][1]-p[1])*t]);draw(pts);if(r>=1){morphing=false;visual.classList.remove('is-morphing');nodesGroup.replaceChildren();pts=to.map(p=>p.slice());last=now}}}requestAnimationFrame(loop)}
if(innerWidth>820){hero.addEventListener('pointermove',e=>{const r=visual.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;visual.style.transform=`perspective(1200px) rotateY(${x*4.5}deg) rotateX(${-y*3.5}deg) translate3d(${x*8}px,${y*6}px,0)`});hero.addEventListener('pointerleave',()=>visual.style.transform='')}
story(0);draw(pts);if(reduced)conclusion.classList.add('is-visible');else requestAnimationFrame(loop);
})();

(function(){
  const hero=document.querySelector('.ai-grid-hero');
  const canvas=document.getElementById('aiGridCanvas');
  const ctx=canvas&&canvas.getContext('2d');
  const stories=[...document.querySelectorAll('.ai-grid-story-line')];
  const dots=[...document.querySelectorAll('.ai-grid-story-dots span')];
  const conclusion=document.getElementById('aiGridConclusion');
  if(!hero||!canvas||!ctx||!stories.length)return;

  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration=4600;
  let current=0,width=0,height=0,dpr=1,raf=0,lastTime=0;
  let mouse={x:0,y:0,active:false};
  let points=[],curves=[],guides=[],pulses=[];

  function setStory(index){
    current=index;
    stories.forEach((el,i)=>el.classList.toggle('is-active',i===index));
    dots.forEach((el,i)=>el.classList.toggle('is-active',i===index));
    if(index===2&&!conclusion.classList.contains('is-visible')){
      setTimeout(()=>conclusion.classList.add('is-visible'),1350);
    }
  }

  function resize(){
    const r=hero.getBoundingClientRect();
    width=Math.max(1,Math.round(r.width));
    height=Math.max(1,Math.round(r.height));
    dpr=Math.min(devicePixelRatio||1,1.5);
    canvas.width=Math.round(width*dpr);
    canvas.height=Math.round(height*dpr);
    canvas.style.width=width+'px';
    canvas.style.height=height+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    buildScene();
  }

  function buildScene(){
    points=[];curves=[];guides=[];pulses=[];
    const count=width<600?28:width<1000?42:62;
    const safeW=width<700?width*.82:width*.56;
    const safeH=width<700?340:390;

    for(let i=0;i<count;i++){
      let x,y,tries=0;
      do{
        x=Math.random()*width;
        y=Math.random()*height;
        tries++;
      }while(tries<50&&Math.abs(x-width/2)<safeW/2&&Math.abs(y-height*.48)<safeH/2);

      points.push({
        x,y,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,
        r:2+Math.random()*2.2,phase:Math.random()*Math.PI*2
      });
    }

    const curveCount=width<700?14:24;
    for(let i=0;i<curveCount;i++){
      let a=points[Math.floor(Math.random()*points.length)];
      let b=points[Math.floor(Math.random()*points.length)];
      if(a===b)b=points[(points.indexOf(a)+1)%points.length];
      curves.push({a,b,bend:(Math.random()-.5)*(width<700?100:180)});
    }

    for(let i=0;i<(width<700?6:10);i++){
      guides.push({vertical:i%2===0,pos:Math.random(),speed:.00002+Math.random()*.00003,alpha:.045+Math.random()*.045});
    }

    for(let i=0;i<(width<700?4:7);i++){
      pulses.push({curve:curves[Math.floor(Math.random()*curves.length)],t:Math.random(),speed:.0016+Math.random()*.0016,size:2+Math.random()*2});
    }
  }

  function bezierPoint(c,t){
    const {a,b,bend}=c;
    const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1;
    const cx=mx-(dy/len)*bend,cy=my+(dx/len)*bend,u=1-t;
    return{x:u*u*a.x+2*u*t*cx+t*t*b.x,y:u*u*a.y+2*u*t*cy+t*t*b.y};
  }

  function drawGrid(time){
    guides.forEach(g=>{
      g.pos+=g.speed*(time-lastTime||16);
      if(g.pos>1.1)g.pos=-.1;
      ctx.strokeStyle=`rgba(102,120,145,${g.alpha})`;
      ctx.lineWidth=1;
      ctx.setLineDash([8,10]);
      ctx.beginPath();
      if(g.vertical){
        const x=g.pos*width;ctx.moveTo(x,0);ctx.lineTo(x,height);
      }else{
        const y=g.pos*height;ctx.moveTo(0,y);ctx.lineTo(width,y);
      }
      ctx.stroke();
    });
    ctx.setLineDash([]);
  }

  function drawSelectionBoxes(time){
    const total=width<700?3:5;
    for(let i=0;i<total;i++){
      const w=90+i*18,h=58+i*11;
      const x=(width*(.07+i*.19)+Math.sin(time*.0004+i)*18)%width;
      const y=height*(.12+(i%3)*.26)+Math.cos(time*.00045+i)*16;
      ctx.strokeStyle='rgba(96,116,142,.10)';
      ctx.setLineDash([5,7]);
      ctx.strokeRect(x,y,w,h);
      ctx.setLineDash([]);
      [[x,y],[x+w,y],[x,y+h],[x+w,y+h]].forEach(([px,py])=>{
        ctx.fillStyle='rgba(255,255,255,.92)';
        ctx.strokeStyle='rgba(80,104,136,.22)';
        ctx.fillRect(px-3,py-3,6,6);
        ctx.strokeRect(px-3,py-3,6,6);
      });
    }
  }

  function draw(time){
    ctx.clearRect(0,0,width,height);
    drawGrid(time);
    drawSelectionBoxes(time);

    points.forEach(p=>{
      if(!reduced){
        p.phase+=.018;
        p.x+=p.vx+Math.sin(p.phase)*.10;
        p.y+=p.vy+Math.cos(p.phase*.9)*.08;
        if(p.x<-30||p.x>width+30)p.vx*=-1;
        if(p.y<-30||p.y>height+30)p.vy*=-1;
        if(mouse.active){
          const dx=mouse.x-p.x,dy=mouse.y-p.y,dist=Math.hypot(dx,dy);
          if(dist<180&&dist>0){
            const f=(1-dist/180)*.018;
            p.x-=dx/dist*f*20;
            p.y-=dy/dist*f*20;
          }
        }
      }
    });

    curves.forEach((c,index)=>{
      const {a,b,bend}=c;
      const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1;
      const cx=mx-(dy/len)*bend,cy=my+(dx/len)*bend;
      const center=Math.hypot((mx-width/2)/(width*.34),(my-height*.48)/260);
      const fade=center<1?.18+.32*center:1;

      ctx.strokeStyle=`rgba(104,124,151,${.18*fade})`;
      ctx.lineWidth=1.1;
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo(cx,cy,b.x,b.y);ctx.stroke();

      if(index%3===0){
        ctx.strokeStyle=`rgba(111,92,255,${.15*fade})`;
        ctx.setLineDash([5,8]);
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(cx,cy);ctx.lineTo(b.x,b.y);ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle=`rgba(255,255,255,${.86*fade})`;
        ctx.strokeStyle=`rgba(111,92,255,${.62*fade})`;
        ctx.beginPath();ctx.arc(cx,cy,4.2,0,Math.PI*2);ctx.fill();ctx.stroke();
      }
    });

    points.forEach((p,index)=>{
      const center=Math.hypot((p.x-width/2)/(width*.34),(p.y-height*.48)/260);
      const fade=center<1?.15+.35*center:1;
      ctx.fillStyle=`rgba(255,255,255,${.94*fade})`;
      ctx.strokeStyle=`rgba(84,109,141,${.52*fade})`;
      ctx.lineWidth=1.25;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();ctx.stroke();
      if(index%7===0){
        ctx.strokeStyle=`rgba(0,109,255,${.22*fade})`;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r*3.2,0,Math.PI*2);ctx.stroke();
      }
    });

    pulses.forEach(p=>{
      if(!reduced){p.t+=p.speed;if(p.t>1)p.t=0}
      const pt=bezierPoint(p.curve,p.t);
      ctx.fillStyle='rgba(113,87,255,.82)';
      ctx.shadowColor='rgba(113,87,255,.55)';
      ctx.shadowBlur=12;
      ctx.beginPath();ctx.arc(pt.x,pt.y,p.size,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;
    });

    lastTime=time;
    raf=requestAnimationFrame(draw);
  }

  hero.addEventListener('pointermove',e=>{
    const r=hero.getBoundingClientRect();
    mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;mouse.active=true;
  });
  hero.addEventListener('pointerleave',()=>mouse.active=false);

  setStory(0);
  if(!reduced)setInterval(()=>setStory((current+1)%stories.length),duration);
  else conclusion.classList.add('is-visible');

  resize();
  raf=requestAnimationFrame(draw);
  addEventListener('resize',resize);
  addEventListener('pagehide',()=>cancelAnimationFrame(raf));
})();
