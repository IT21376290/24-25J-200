'use client'; // Ensures the component runs on the client

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import close_icon from '../../../public/images/icons/close_icon.png';
import Image from 'next/image';

const VR360Image = ({ onClose, imageURL }: { onClose: () => void, imageURL: string }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const url = imageURL;

    const container = containerRef.current;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.xr.enabled = true;

    if (container) {
      container.appendChild(renderer.domElement);
    }

    if (VRButton && container) {
      container.appendChild(VRButton.createButton(renderer));
    }

    // Add texture loading with error handling
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      url,
      (texture) => {
        // When the texture loads, set up the material
        const geometry = new THREE.SphereGeometry(50, 60, 40);
        geometry.scale(-1, 1, 1); // Invert the geometry for 360 view

        const material = new THREE.MeshBasicMaterial({
          map: texture,
        });

        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;

        renderer.setAnimationLoop(() => {
          controls.update();
          renderer.render(scene, camera);
        });
      },
      (progress) => {
        console.log(`Loading texture: ${(progress.loaded / progress.total) * 100}%`);
      },
      (error) => {
        console.error('Error loading texture:', error);
      }
    );

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // Clean up
      renderer.dispose();
      if (container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [imageURL]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          fontSize: '20px',
          cursor: 'pointer',
          zIndex: 1100,
        }}
        src={close_icon} className='' alt='' />

      {/* 360 Viewer */}
      <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />
    </div>
  );
};

export default VR360Image;
