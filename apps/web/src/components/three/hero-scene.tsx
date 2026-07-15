"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function FloatingSphere({
  position,
  color,
  speed,
}: {
  position: [number, number, number];
  color: string;
  speed: number;
}) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.15;
    meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.1;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
      <MeshDistortMaterial color={color} distort={0.4} speed={2} roughness={0.2} metalness={0.1} />
    </Sphere>
  );
}

export function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} intensity={1} />
      <FloatingSphere position={[-2.2, 0.5, -1]} color="#a855f7" speed={0.6} />
      <FloatingSphere position={[2.4, -0.8, -2]} color="#ec4899" speed={0.4} />
      <FloatingSphere position={[0.5, 1.2, -3]} color="#8b5cf6" speed={0.5} />
    </Canvas>
  );
}