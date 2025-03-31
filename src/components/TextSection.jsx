import { Text } from "@react-three/drei";
import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export const TextSection = ({
  position,
  onClick,
  visible = true,
  starCount = 1,
  index = 0,
  link = "", // 프로젝트 링크 받기
}) => {
  const groupRef = useRef();
  const smallStarRefs = useRef([]);
  const bigStarRef = useRef();
  const backgroundRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const emissiveRef = useRef(0.15);
  const appearScale = useRef(0); // 첫 번째 간판 천천히 등장용

  // 별 Shape 생성
  const starShape = useMemo(() => {
    const shape = new THREE.Shape();
    const outerRadius = 0.3;
    const innerRadius = 0.15;
    const spikes = 5;
    const step = Math.PI / spikes;
    for (let i = 0; i < 2 * spikes; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(i * step) * r;
      const y = Math.sin(i * step) * r;
      i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);

  const smallStars = useMemo(() => (index === 0 ? [] : Array.from({ length: starCount }, (_, i) => i)), [starCount, index]);
  const starRadius = starCount === 3 ? 1.0 : starCount === 5 ? 1.2 : starCount === 7 ? 1.4 : 1.0;

  const hoverTexts = [
    "My first project",
    "My second project",
    "My third project",
    "My fourth project",
  ];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 첫 번째 간판 천천히 등장 (scale)
    if (index === 0) {
      const targetScale = 5;
      appearScale.current += ((targetScale - appearScale.current) * 0.02);
      groupRef.current.scale.set(appearScale.current, appearScale.current, appearScale.current);
    }

    // hover 텍스트 opacity 부드럽게
    const targetOpacity = hovered ? 1 : 0;
    setHoverOpacity((prev) => prev + (targetOpacity - prev) * 0.05);

    // 배경 빛 부드럽게 처리
    const targetEmissive = hovered ? 7 : 0.15;
    emissiveRef.current += (targetEmissive - emissiveRef.current) * 0.05;
    if (backgroundRef.current) backgroundRef.current.material.emissiveIntensity = emissiveRef.current;

    // 큰 별 반짝임
    if (bigStarRef.current) {
      bigStarRef.current.material.emissiveIntensity = hovered
        ? 0.8 + Math.sin(t * 2) * 0.2
        : 0.4 + Math.sin(t * 2) * 0.2;
      bigStarRef.current.rotation.z += 0.01;
    }

    // 작은 별 반짝임
    smallStarRefs.current.forEach((star, idx) => {
      if (star) {
        star.material.emissiveIntensity = hovered
          ? 0.6 + Math.sin(t * 2 + idx) * 0.3
          : 0.3 + Math.sin(t * 2 + idx) * 0.2;
        star.rotation.z += 0.02;
      }
    });
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={index === 0 ? 0 : 5} // 첫 번째 간판만 등장 애니메이션 적용
      onClick={(e) => {
        e.stopPropagation();
        if (link) window.open(link, "_blank");
      }}
      visible={visible}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* Glassmorphism 배경 */}
      <mesh ref={backgroundRef}>
        <circleGeometry args={[2, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          opacity={0.05}
          transparent
          roughness={0.1}
          metalness={0.3}
          emissive="#ffffff"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* 첫 번째 간판만 큰 별 */}
      {index === 0 && (
        <mesh ref={bigStarRef} position={[0, 0, 0.1]} scale={[2.25, 2.25, 2.25]}>
          <shapeGeometry args={[starShape]} />
          <meshStandardMaterial
            color="#f0f8ff"
            opacity={0.2}
            transparent
            roughness={0.1}
            metalness={0.6}
            emissive="#f0f8ff"
            emissiveIntensity={0.4}
          />
        </mesh>
      )}

      {/* 2번째부터 별들 */}
      {smallStars.map((i) => {
        const angle = (i / starCount) * Math.PI * 2;
        const x = Math.cos(angle) * starRadius;
        const y = Math.sin(angle) * starRadius;
        return (
          <mesh
            key={i}
            ref={(el) => (smallStarRefs.current[i] = el)}
            position={[x, y, 0.1]}
            scale={1.5}
          >
            <shapeGeometry args={[starShape]} />
            <meshStandardMaterial
              color="#f0f8ff"
              opacity={0.15}
              transparent
              roughness={0.1}
              metalness={0.6}
              emissive="#f0f8ff"
              emissiveIntensity={0.3}
            />
          </mesh>
        );
      })}

      {/* Hover 시 부드럽게 뜨는 텍스트 */}
      {hoverOpacity > 0.01 && (
        <Text
          position={[0, 2.5, 0.2]}
          color="white"
          fontSize={0.17}
          anchorX="center"
          anchorY="middle"
          font="./fonts/Roboto-VariableFont_wdth,wght.ttf"
          fillOpacity={hoverOpacity}
        >
          {hoverTexts[index]}
        </Text>
      )}
    </group>
  );
};
