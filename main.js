import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import './style.css'

// Canvas
const canvas = document.querySelector('.webgl')

// Scene
const scene = new THREE.Scene()

// Galaxy
const parameters = {
  count: 100000,
  size: 0.01,
  radius: 5,
  branches: 3,
}

let geometry = null
let material = null
let points = null

const generateGalaxy = () => {
  // Destroy old galaxy
  if (points !== null) {
    geometry.dispose()
    material.dispose()
    scene.remove(points)
  }

  // Geometry
  geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(parameters.count * 3)

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3

    const radius = Math.random() * parameters.radius
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2

    positions[i3] = Math.cos(branchAngle) * radius
    positions[i3 + 1] = 0
    positions[i3 + 2] = Math.sin(branchAngle) * radius
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  // Material
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })

  // Points
  points = new THREE.Points(geometry, material)
  scene.add(points)
}
generateGalaxy()

// GUI
const gui = new dat.GUI({ width: 360 })

gui
  .add(parameters, 'count')
  .min(100)
  .max(1000000)
  .step(100)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'size')
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'radius')
  .min(0.1)
  .max(20)
  .step(0.1)
  .onFinishChange(generateGalaxy)
gui
  .add(parameters, 'branches')
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy)

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.y = 3
camera.position.z = 6
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// Resizing
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.03
controls.minDistance = 0.1
controls.maxDistance = 20
controls.update()

// Animations
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  renderer.render(scene, camera)
  controls.update()
  window.requestAnimationFrame(tick)
}
tick()
