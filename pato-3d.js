/* Procedural PATO 3D avatar. Uses Three.js when available; graceful fallback remains. */
(() => {
  const instances = new Map();
  const palette = {yellow:0x1b7543, orange:0xf28b20, green:0x167447, dark:0x102d50, white:0xf7f8f2, mint:0x9de6c0};
  function mount(host, options={}) {
    if (!host || !window.THREE) return null;
    if(instances.has(host)) return instances.get(host);
    const THREE=window.THREE;
    const scene=new THREE.Scene();
    const backgroundFor=id=>({'bg-studio':'#e8f5ed','bg-campus':'#b7e4c7','bg-tech':'#173b2d','bg-office':'#dcebe2'}[id] || options.background || '#238e43');
    scene.background=new THREE.Color(backgroundFor(options.equipped?.background));
    const camera=new THREE.PerspectiveCamera(35,1,.1,100);
    camera.position.set(0,1.3,5.2);
    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
    renderer.setSize(host.clientWidth||300,host.clientHeight||350);
    renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    host.innerHTML='';host.appendChild(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xf7fff9,0x456044,2.1));
    const key=new THREE.DirectionalLight(0xfff6e8,2.2);key.position.set(-3,5,5);key.castShadow=true;scene.add(key);
    const fill=new THREE.DirectionalLight(0xd4ffe5,1.05);fill.position.set(3,2,-2);scene.add(fill);
    const pato=new THREE.Group();scene.add(pato);
    const mat=(color,rough=.72)=>new THREE.MeshStandardMaterial({color,roughness:rough,metalness:0.02});
    const yellow=mat(palette.yellow), orange=mat(palette.orange), dark=mat(palette.dark), white=mat(palette.white), black=mat(0x18221b), mint=mat(palette.mint), bodyBrown=mat(0x754322), bellyTan=mat(0xd8c1a0);
    const sphere=(parent,material,pos,scale)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(1,32,24),material);m.position.set(...pos);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;};
    const body=sphere(pato,bodyBrown,[0,-.35,0],[.85,1.0,.65]);
    sphere(pato,bellyTan,[0,-.48,.49],[.67,.68,.24]);
    const head=sphere(pato,yellow,[0,.95,.15],[.77,.78,.68]);
    const wingL=sphere(pato,yellow,[-.7,-.25,.05],[.28,.55,.3]);wingL.rotation.z=.35;
    const wingR=sphere(pato,yellow,[.7,-.25,.05],[.28,.55,.3]);wingR.rotation.z=-.35;
    const eyeL=sphere(pato,white,[-.29,1.10,.73],[.17,.18,.09]);
    const eyeR=sphere(pato,white,[.29,1.10,.73],[.17,.18,.09]);
    const pupilL=sphere(pato,black,[-.29,1.085,.81],[.082,.105,.055]);
    const pupilR=sphere(pato,black,[.29,1.085,.81],[.082,.105,.055]);
    sphere(pato,white,[-.315,1.12,.855],[.027,.03,.02]);sphere(pato,white,[.265,1.12,.855],[.027,.03,.02]);
    // Firm, level brows create a composed and authoritative expression without a worried tilt.
    const browL=sphere(pato,mat(0x14351f),[-.3,1.315,.75],[.245,.052,.07]);browL.rotation.z=.045;
    const browR=sphere(pato,mat(0x14351f),[.3,1.315,.75],[.245,.052,.07]);browR.rotation.z=-.045;
    const bill=sphere(pato,orange,[0,.72,.83],[.42,.16,.34]);
    const lowerBill=sphere(pato,orange,[0,.59,.79],[.34,.09,.25]);
    const feet=[];
    for(const x of [-.34,.34]){const f=sphere(pato,orange,[x,-1.25,.28],[.25,.12,.4]);feet.push(f);}
    let outfitParts=[], hat, glasses=[], accessory;
    function outfit(id){
      outfitParts.forEach(m=>{pato.remove(m);m.geometry?.dispose();if(m.material?.dispose)m.material.dispose();});outfitParts=[];
      const add=(m)=>{pato.add(m);outfitParts.push(m);return m;};
      const color=id==='cloth-hoodie'?0x12875b:id==='cloth-barong'?0xf5efdc:id==='cloth-suit'?0x183b32:0x167447;
      add(sphere(pato,mat(color),[0,-.4,.52],[.66,.6,.3]));
      if(id==='cloth-hoodie'){
        const hood=sphere(pato,mat(0x0d6343),[0,.12,.48],[.43,.32,.22]);hood.scale.z=.65;
        add(hood);add(sphere(pato,mat(0x0d6343),[-.53,-.48,.48],[.17,.48,.23]));add(sphere(pato,mat(0x0d6343),[.53,-.48,.48],[.17,.48,.23]));
        const cordMat=mat(0xd4f0df);for(const x of [-.09,.09]){const cord=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.28,8),cordMat);cord.position.set(x,-.1,.78);add(cord);}
      } else if(id==='cloth-suit'||id==='cloth-barong'||id==='cloth-polo'){
        const jacketColor=id==='cloth-suit'?0x102d50:id==='cloth-polo'?0x0f6842:0xf1ead8;
        add(sphere(pato,mat(jacketColor),[0,-.42,.57],[.73,.61,.31]));
        add(sphere(pato,white,[0,.02,.79],[.27,.35,.1]));
        if(id==='cloth-suit'){
          const tie=add(sphere(pato,mat(0x164c35),[0,-.25,.88],[.1,.42,.08]));
          for(const x of [-.25,.25]){const lapel=new THREE.Mesh(new THREE.BoxGeometry(.16,.55,.045),mat(0x254a62));lapel.position.set(x,-.35,.82);lapel.rotation.z=x<0?-.28:.28;add(lapel);}
        } else if(id==='cloth-polo'){
          for(const x of [-.06,.06]){const seam=new THREE.Mesh(new THREE.BoxGeometry(.025,.25,.025),mat(0xd8f1df));seam.position.set(x,-.13,.84);add(seam);}
        } else {
          const panel=new THREE.Mesh(new THREE.BoxGeometry(.025,.78,.025),mat(0xc7b98e));panel.position.set(0,-.38,.88);add(panel);
          for(let y=-.12;y>-.78;y-=.17){const stitch=new THREE.Mesh(new THREE.SphereGeometry(.025,10,8),mat(0xb49c6b));stitch.position.set(0,y,.9);add(stitch);}
        }
      }
    }
    function clearAccessory(){if(accessory){pato.remove(accessory);accessory.geometry.dispose();accessory=null;}}
    function apply(eq={}){
      outfit(eq.clothes||'cloth-polo');
      if(hat){pato.remove(hat);hat=null;}
      if(eq.hat==='hat-gradcap'){
        hat=new THREE.Group();pato.add(hat);
        const capMat=mat(0x123d2b),top=new THREE.Mesh(new THREE.BoxGeometry(1.2,.075,1.0),capMat);top.position.set(0,1.78,.08);hat.add(top);
        const base=new THREE.Mesh(new THREE.CylinderGeometry(.34,.38,.13,32),capMat);base.position.set(0,1.68,.08);hat.add(base);
        const tassel=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.3,8),mat(0xfacc15));tassel.position.set(.48,1.64,.12);tassel.rotation.z=-.2;hat.add(tassel);
      } else if(eq.hat==='hat-headset'){
        hat=new THREE.Group();pato.add(hat);
        const band=new THREE.Mesh(new THREE.TorusGeometry(.58,.055,10,48,Math.PI),mat(0x183b2d));band.rotation.x=Math.PI/2;band.position.set(0,1.14,.15);hat.add(band);
        for(const x of [-.57,.57]){const pad=sphere(hat,mat(0x183b2d),[x,1.12,.17],[.15,.24,.18]);const cushion=sphere(hat,mat(0x425c4e),[x,1.12,.23],[.11,.19,.13]);}
        const mic=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.38,8),mat(0x263a30));mic.position.set(-.5,.92,.38);mic.rotation.z=-.7;hat.add(mic);
      } else if(eq.hat==='hat-devcap'){
        hat=new THREE.Group();pato.add(hat);
        const crown=sphere(hat,mat(0x176a43),[0,1.65,.1],[.58,.22,.5]);
        const brim=new THREE.Mesh(new THREE.CylinderGeometry(.43,.43,.045,32),mat(0x0b4f32));brim.position.set(0,1.59,.28);hat.add(brim);
        const badge=new THREE.Mesh(new THREE.CircleGeometry(.12,24),mat(0xfacc15));badge.position.set(0,1.68,.59);hat.add(badge);
      }
      glasses.forEach(m=>{pato.remove(m);m.geometry.dispose();if(m.material?.dispose)m.material.dispose();});glasses=[];
      if(eq.glasses==='glass-classic'){
        const frame=mat(0x172e25,.35), lens=new THREE.MeshStandardMaterial({color:0x9cc9d6,transparent:true,opacity:.22,roughness:.2});
        for(const x of [-.29,.29]){
          const ring=new THREE.Mesh(new THREE.TorusGeometry(.145,.035,12,32),frame);ring.position.set(x,1.1,.86);pato.add(ring);glasses.push(ring);
          const glass=sphere(pato,lens,[x,1.1,.855],[.13,.13,.025]);glasses.push(glass);
        }
        const bridge=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.16,12),frame);bridge.rotation.z=Math.PI/2;bridge.position.set(0,1.1,.88);pato.add(bridge);glasses.push(bridge);
        for(const x of [-.43,.43]){const temple=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.28,8),frame);temple.rotation.x=Math.PI/2;temple.position.set(x,1.1,.73);pato.add(temple);glasses.push(temple);}
      } else if(eq.glasses==='glass-tech'){
        const visor=new THREE.Mesh(new THREE.BoxGeometry(.82,.22,.06),new THREE.MeshStandardMaterial({color:0x2a9a7b,transparent:true,opacity:.52,roughness:.18,metalness:.25}));visor.position.set(0,1.1,.86);pato.add(visor);glasses.push(visor);
        const rim=new THREE.Mesh(new THREE.BoxGeometry(.86,.26,.07),mat(0x0b4f32,.35));rim.position.set(0,1.1,.85);pato.add(rim);glasses.push(rim);
      }
      clearAccessory();
      if(eq.accessory==='acc-laptop'||eq.accessory==='acc-portfolio'){accessory=new THREE.Mesh(new THREE.BoxGeometry(.5,.42,.08),mat(eq.accessory==='acc-laptop'?0x4b6474:0x5c3827));accessory.position.set(.62,-.55,.6);accessory.rotation.z=-.25;pato.add(accessory);}
      if(eq.accessory==='acc-id'){accessory=new THREE.Mesh(new THREE.BoxGeometry(.18,.28,.07),white);accessory.position.set(.16,-.6,.85);pato.add(accessory);}
      // PATO keeps his natural orange webbed feet; footwear cosmetics do not render.
    }
    apply({clothes:'cloth-suit', ...(options.equipped||{})});
    const floor=new THREE.Mesh(new THREE.CircleGeometry(2.2,48),mat(0x237f43));floor.rotation.x=-Math.PI/2;floor.position.y=-1.4;floor.receiveShadow=true;scene.add(floor);
    let state='idle', start=performance.now(), frame;
    function animate(now){
      frame=requestAnimationFrame(animate);const t=(now-start)/1000;
      // Soft breathing and small, natural head movements keep PATO lively without changing his design.
      pato.position.y=Math.sin(t*1.65)*.025;
      pato.rotation.y=Math.sin(t*.42)*.055;
      head.rotation.z=state==='thinking'?.12+Math.sin(t*1.2)*.025:state==='listening'?Math.sin(t*1.15)*.065:Math.sin(t*.55)*.018;
      head.rotation.y=state==='listening'?Math.sin(t*1.05)*.045:Math.sin(t*.7)*.018;
      body.scale.y=1+Math.sin(t*1.65)*.012;
      wingL.rotation.z=.35+(state==='greeting'?Math.sin(t*5.2)*.48:state==='happy'?Math.sin(t*4.8)*.18:Math.sin(t*.9)*.018);
      wingR.rotation.z=-.35-(state==='greeting'?Math.sin(t*5.2)*.48:state==='happy'?Math.sin(t*4.8)*.18:Math.sin(t*.9)*.018);
      bill.scale.y=state==='speaking'?.16+Math.abs(Math.sin(t*11.5))*.15:.16;
      lowerBill.scale.y=state==='speaking'?.09+Math.abs(Math.sin(t*11.5))*.07:.09;
      // Natural blink with occasional short double blink; eyes remain firm and focused.
      const blinkPulse=Math.pow(Math.max(0,Math.sin(t*1.23-1.1)),22);
      const doubleBlink=Math.pow(Math.max(0,Math.sin(t*1.23-1.28)),28)*.65;
      const blink=Math.max(blinkPulse,doubleBlink);
      eyeL.scale.y=.18*(1-blink*.92);eyeR.scale.y=.18*(1-blink*.92);
      pupilL.scale.y=.105*(1-blink*.92);pupilR.scale.y=.105*(1-blink*.92);
      pupilL.position.x=-.29+Math.sin(t*.5)*.012;pupilR.position.x=.29+Math.sin(t*.5)*.012;
      if(state==='thinking')head.position.y=.95+Math.sin(t*1.4)*.025;else head.position.y=.95;
      renderer.render(scene,camera);
    }
    animate(start);
    const resize=()=>{const w=host.clientWidth||300,h=host.clientHeight||350;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);};
    const observer=new ResizeObserver(resize);observer.observe(host);
    const api={setState(s){state=s||'idle';},equip(eq){apply(eq||{});scene.background=new THREE.Color(backgroundFor(eq?.background));},dispose(){cancelAnimationFrame(frame);observer.disconnect();renderer.dispose();host.innerHTML='';instances.delete(host);}};
    instances.set(host,api);return api;
  }
  window.PATO3D={mount};
})();
