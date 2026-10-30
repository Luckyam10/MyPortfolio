import React, { useMemo, useRef, useLayoutEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const V = (x, y, z) => new THREE.Vector3(x, y, z)
const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const rnd = (a, b) => a + Math.random() * (b - a)
const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
const h2 = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s) }
const vn = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); return h2(xi, yi) * (1 - u) * (1 - v) + h2(xi + 1, yi) * u * (1 - v) + h2(xi, yi + 1) * (1 - u) * v + h2(xi + 1, yi + 1) * u * v }
const fbm = (x, y, o = 5) => { let a = 0.5, s = 0; for (let i = 0; i < o; i++) { s += a * vn(x, y); x *= 2; y *= 2; a *= 0.5 } return s }
const ridged = (x, y) => { let a = 0.5, s = 0; for (let i = 0; i < 5; i++) { const n = 1 - Math.abs(vn(x, y) * 2 - 1); s += a * n * n; x *= 2; y *= 2; a *= 0.5 } return s }
const roadX = z => Math.sin(z * 0.021) * 22 + Math.sin(z * 0.007) * 14
const riverX = z => roadX(z) + 30
const PEAK = [25, -300]
function ground(x, z) {
  const valley = sm(10, 170, Math.abs(x - roadX(z)))
  const mf = Math.max(sm(170, 420, Math.abs(x)), sm(-170, -460, z))
  let y = Math.max(0, fbm(x * 0.01, z * 0.01) - 0.38) * 60 * (0.15 + 0.85 * valley)
  y += fbm(x * 0.07, z * 0.07, 3) * 1.4 + mf * (40 + ridged(x * 0.005, z * 0.005) * 300)
  y += 170 * Math.exp(-(((x - PEAK[0]) ** 2 + (z - PEAK[1]) ** 2) / (2 * 55 * 55)))
  return y - 5 * Math.exp(-(((x - riverX(z)) / 6) ** 2))
}
const CY = ground(PEAK[0], PEAK[1])
const zs = [150, 105, 60, 15, -30, -75, -125, -165]
const camPath = new THREE.CatmullRomCurve3(zs.map((z, i) => V(roadX(z) - 2, [7, 7.5, 8, 9, 12, 18, 30, 46][i], z)))
const CITADEL = V(PEAK[0], CY + 60, PEAK[1])
const SUN = V(-380, 130, -1160)

function Rig() {
  const t = useRef(0)
  useFrame(({ camera, pointer, clock }, dt) => {
    const h = document.body.scrollHeight - innerHeight
    const p = h > 0 ? Math.min(1, Math.max(0, scrollY / h)) : 0
    t.current += (p - t.current) * Math.min(1, dt * 2)
    const e = still ? 0 : clock.elapsedTime
    const c = camPath.getPoint(t.current)
    c.y = Math.max(c.y, ground(c.x, c.z) + 4)
    camera.position.copy(c).add(V(pointer.x * 1.8 + Math.sin(e * 0.4) * 0.5, pointer.y * 0.9 + Math.sin(e * 0.7) * 0.25, 0))
    const look = camPath.getPoint(Math.min(1, t.current + 0.1)).lerp(CITADEL, sm(0.2, 0.85, t.current))
    camera.lookAt(look); camera.rotation.z += Math.sin(e * 0.3) * 0.004
  })
  return null
}

function Sky() {
  const u = useMemo(() => ({ sd: { value: SUN.clone().normalize() }, t: { value: 0 } }), [])
  useFrame(({ clock }) => { if (!still) u.t.value = clock.elapsedTime })
  return (
    <mesh>
      <sphereGeometry args={[1500, 32, 20]} />
      <shaderMaterial side={THREE.BackSide} depthWrite={false} fog={false} uniforms={u}
        vertexShader="varying vec3 p;void main(){p=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}"
        fragmentShader={`uniform vec3 sd;uniform float t;varying vec3 p;
float hs(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 q){vec2 i=floor(q),f=fract(q);f=f*f*(3.-2.*f);return mix(mix(hs(i),hs(i+vec2(1,0)),f.x),mix(hs(i+vec2(0,1)),hs(i+vec2(1,1)),f.x),f.y);}
float fb(vec2 q){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*n(q);q*=2.03;a*=.5;}return s;}
void main(){vec3 d=normalize(p);float h=max(d.y,0.);
vec3 c=mix(vec3(.74,.75,.73),vec3(.2,.31,.45),pow(h,.5));
float s=max(dot(d,sd),0.);c+=vec3(1.,.7,.4)*pow(s,5.)*.5+vec3(1.,.82,.58)*pow(s,50.)*.9;
vec2 uv=d.xz/(d.y+.3)*1.3+vec2(t*.008,0.);float cl=smoothstep(.42,.82,fb(uv));
vec3 cc=mix(vec3(.5,.54,.6),vec3(1.,.8,.55),pow(s,2.));
c=mix(c,cc,cl*smoothstep(0.,.2,h)*.8);gl_FragColor=vec4(c,1.);}`} />
    </mesh>
  )
}

function Terrain() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(1100, 1100, 360, 360).rotateX(-Math.PI / 2)
    const a = g.attributes.position
    for (let i = 0; i < a.count; i++) a.setY(i, ground(a.getX(i), a.getZ(i)))
    g.computeVertexNormals()
    const nr = g.attributes.normal, col = new Float32Array(a.count * 3), c = new THREE.Color()
    const grass = new THREE.Color('#3f5128'), grass2 = new THREE.Color('#6d7a3c'), rock = new THREE.Color('#6a6762'), snow = new THREE.Color('#e9edf0'), dirt = new THREE.Color('#7b6a48'), bank = new THREE.Color('#6a6350')
    for (let i = 0; i < a.count; i++) {
      const x = a.getX(i), y = a.getY(i), z = a.getZ(i), slope = 1 - nr.getY(i)
      c.copy(grass).lerp(grass2, fbm(x * 0.03, z * 0.03, 3) * 1.3 - 0.2)
      c.lerp(rock, Math.max(sm(0.16, 0.4, slope), sm(70, 140, y) * 0.8))
      c.lerp(snow, sm(150, 215, y) * (1 - sm(0.35, 0.7, slope) * 0.5))
      if (y < 0.7) c.lerp(bank, 0.8 * (1 - sm(0, 0.7, y) * 0.4))
      c.lerp(dirt, 1 - sm(1.8, 3.6, Math.abs(x - roadX(z))))
      c.toArray(col, i * 3)
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3)); return g
  }, [])
  return (
    <>
      <mesh geometry={geo}><meshStandardMaterial vertexColors roughness={1} /></mesh>
      <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1100, 1100]} /><meshStandardMaterial color="#3d5a60" roughness={0.12} metalness={0.35} transparent opacity={0.92} /></mesh>
    </>
  )
}

function Pines() {
  const lo = useRef(), up = useRef(), N = 2600
  useLayoutEffect(() => {
    const o = new THREE.Object3D(), c = new THREE.Color(), greens = ['#1f3224', '#27402a', '#2f4a2c', '#1b2b21']
    let n = 0
    for (let k = 0; n < N && k < 20000; k++) {
      const x = rnd(-430, 430), z = rnd(-340, 260), y = ground(x, z)
      if (y < 0.4 || y > 90 || Math.abs(x - roadX(z)) < 9 || Math.abs(x - riverX(z)) < 10 || fbm(x * 0.012 + 5, z * 0.012) < 0.46) continue
      const s = rnd(0.8, 2.1)
      o.rotation.set(0, rnd(0, 6), 0); o.scale.set(s, s * rnd(0.9, 1.4), s)
      o.position.set(x, y + 4.5 * s, z); o.updateMatrix(); lo.current.setMatrixAt(n, o.matrix)
      o.position.set(x, y + 9.5 * s, z); o.updateMatrix(); up.current.setMatrixAt(n, o.matrix)
      c.set(greens[n % 4]); lo.current.setColorAt(n, c); up.current.setColorAt(n, c); n++
    }
    lo.current.count = up.current.count = n
    ;[lo, up].forEach(r => { r.current.instanceMatrix.needsUpdate = true; r.current.instanceColor.needsUpdate = true })
  }, [])
  return (
    <>
      <instancedMesh ref={lo} args={[null, null, N]}><coneGeometry args={[2.8, 9, 7]} /><meshStandardMaterial roughness={1} /></instancedMesh>
      <instancedMesh ref={up} args={[null, null, N]}><coneGeometry args={[2, 7.5, 7]} /><meshStandardMaterial roughness={1} /></instancedMesh>
    </>
  )
}

function Ruins() {
  const stone = <meshStandardMaterial color="#8a857b" roughness={1} flatShading />
  return [[70, 1], [-10, 1.5], [-95, 2.6]].map(([z, k], i) => (
    <group key={i} position={[roadX(z), ground(roadX(z), z) - 1, z]} scale={k}>
      <mesh position={[-7, 8, 0]}><boxGeometry args={[2.2, 16, 2.2]} />{stone}</mesh>
      <mesh position={[7, 6, 0]} rotation={[0, 0.2, 0.04]}><boxGeometry args={[2.2, 12, 2.2]} />{stone}</mesh>
      {i !== 1 && <mesh position={[-2, 16.5, 0]} rotation={[0, 0, 0.03]}><boxGeometry args={[12, 2, 2.6]} />{stone}</mesh>}
      <mesh position={[3, 0.8, 3]}><dodecahedronGeometry args={[1.6]} />{stone}</mesh>
    </group>
  ))
}

function Citadel() {
  const stone = <meshStandardMaterial color="#d8d3c6" roughness={0.9} />
  const tiers = [[24, 4], [19, 10], [14, 16], [10, 22], [6.5, 28]]
  return (
    <group position={[PEAK[0], CY - 6, PEAK[1]]} scale={2.4}>
      {tiers.map(([r, y], i) => (
        <group key={i}>
          <mesh position={[0, (y - 16) / 2, 0]}><cylinderGeometry args={[r, r + 1.5, y + 16, 24]} />{stone}</mesh>
          {i < 4 && [...Array(7)].map((_, k) => { const a = k * 0.9 + i; return <group key={k} position={[Math.cos(a) * (r - 1.4), y, Math.sin(a) * (r - 1.4)]}><mesh position={[0, 2.4, 0]}><cylinderGeometry args={[1.1, 1.3, 4.8, 8]} />{stone}</mesh><mesh position={[0, 6.2, 0]}><coneGeometry args={[1.6, 3, 8]} /><meshStandardMaterial color="#8d9aa6" /></mesh></group> })}
        </group>
      ))}
      <mesh position={[0, 40, 0]}><cylinderGeometry args={[2.6, 3.6, 24, 12]} />{stone}</mesh>
      <mesh position={[0, 58, 0]}><coneGeometry args={[3.6, 13, 12]} /><meshStandardMaterial color="#9fb0bd" /></mesh>
    </group>
  )
}

function Mist() {
  const ref = useRef()
  const tex = useMemo(() => {
    const c = document.createElement('canvas'); c.width = c.height = 128
    const g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64)
    r.addColorStop(0, 'rgba(255,255,255,.9)'); r.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c)
  }, [])
  const items = useMemo(() => [...Array(48)].map(() => { const z = rnd(-220, 170); return { x: roadX(z) + rnd(-100, 100), y: rnd(1, 16), z, s: rnd(70, 160) } }), [])
  useFrame((_, dt) => { if (!still) ref.current.children.forEach((m, i) => { m.position.x += dt * (0.8 + (i % 3) * 0.3); if (m.position.x > roadX(m.position.z) + 110) m.position.x -= 220 }) })
  return <group ref={ref}>{items.map((m, i) => <sprite key={i} position={[m.x, m.y, m.z]} scale={[m.s, m.s * 0.4, 1]}><spriteMaterial map={tex} color="#d5dde0" transparent opacity={0.2} depthWrite={false} /></sprite>)}</group>
}

function Motes() {
  const ref = useRef(), S = 320
  const d = useMemo(() => ({ q: [...Array(S)].map(() => ({ x: rnd(-30, 30), y: rnd(-3, 18), z: rnd(-60, 10), v: rnd(0.2, 0.8) })), p: new Float32Array(S * 3) }), [])
  useFrame(({ camera, clock }, dt) => {
    const e = still ? 0 : clock.elapsedTime, c = camera.position
    d.q.forEach((q, i) => {
      if (!still) { q.x += dt * q.v * 0.8; q.y += dt * q.v * 0.25 }
      if (q.x > 32) q.x = -32; if (q.y > 19) q.y = -3
      d.p.set([c.x + q.x, c.y + q.y - 2, c.z + q.z + Math.sin(e + i) * 0.5], i * 3)
    })
    ref.current.geometry.attributes.position.needsUpdate = true
  })
  return <points ref={ref} frustumCulled={false}><bufferGeometry><bufferAttribute attach="attributes-position" args={[d.p, 3]} /></bufferGeometry><pointsMaterial color="#ffe9c4" size={0.14} transparent opacity={0.55} depthWrite={false} /></points>
}

function Ravens() {
  const g = useRef()
  useFrame(({ clock }) => {
    const e = still ? 0 : clock.elapsedTime
    g.current.children.forEach((b, i) => {
      const t = e * 0.1 + i * 0.4
      b.position.set(Math.cos(t) * 70 - 20, 48 + Math.sin(e * 0.6 + i) * 4 + i * 1.5, Math.sin(t) * 50 - 110)
      b.rotation.y = -t + Math.PI
      const f = Math.sin(e * 5 + i) * 0.55
      b.children[0].rotation.z = f; b.children[1].rotation.z = -f
    })
  })
  return (
    <group ref={g}>
      {[...Array(6)].map((_, i) => (
        <group key={i} scale={1.8}>
          <mesh position={[0.8, 0, 0]}><boxGeometry args={[1.6, 0.05, 0.45]} /><meshBasicMaterial color="#15171a" /></mesh>
          <mesh position={[-0.8, 0, 0]}><boxGeometry args={[1.6, 0.05, 0.45]} /><meshBasicMaterial color="#15171a" /></mesh>
        </group>
      ))}
    </group>
  )
}

export default function World() {
  const glow = useMemo(() => {
    const c = document.createElement('canvas'); c.width = c.height = 128
    const g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64)
    r.addColorStop(0, 'rgba(255,236,190,1)'); r.addColorStop(0.25, 'rgba(255,200,130,.5)'); r.addColorStop(1, 'rgba(255,180,100,0)')
    g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c)
  }, [])
  return (
    <div className="world" aria-hidden="true">
      <Canvas camera={{ fov: 52, near: 0.5, far: 2200, position: [0, 8, 150] }} dpr={[1, 1.5]}>
        <fogExp2 attach="fog" args={['#b5b9b5', 0.0034]} />
        <hemisphereLight args={['#9fb4cc', '#3b4a2c', 1.1]} />
        <directionalLight position={[-380, 130, -1160]} intensity={3.2} color="#ffcf94" />
        <directionalLight position={[200, 120, 200]} intensity={0.55} color="#8fa4c0" />
        <sprite position={SUN.toArray()} scale={[900, 900, 1]}><spriteMaterial map={glow} blending={THREE.AdditiveBlending} transparent depthWrite={false} fog={false} /></sprite>
        <Rig /><Sky /><Terrain /><Pines /><Ruins /><Citadel /><Mist /><Motes /><Ravens />
      </Canvas>
    </div>
  )
}
