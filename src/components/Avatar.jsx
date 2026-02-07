import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { button, useControls } from "leva";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

export function Avatar({
  message,
  onMessagePlayed,
  chat,
  ...props
}) {
  const group = useRef();
  const { scene, animations } = useGLTF("/Character_update.glb");
  const { actions } = useAnimations(animations, group);

  const [animation, setAnimation] = useState("Action");
  const [facialExpression, setFacialExpression] = useState("default");

  const audioRef = useRef(null);
  const lipsyncRef = useRef(null);
  const eyeBlinkTimer = useRef(0);
  const blinkProgress = useRef(0);
  const blinkActive = useRef(false);
  const sequenceStarted = useRef(false);

  /* ------------------ Animation Transitions ------------------ */
  useEffect(() => {
    if (!actions[animation]) return;

    Object.values(actions).forEach((action) => {
      if (action !== actions[animation]) action.fadeOut(0.5);
    });

    actions[animation].reset().fadeIn(0.5).play();
  }, [animation, actions]);

  /* ------------------ Reset Morph Targets Once ------------------ */
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.morphTargetInfluences) {
        child.morphTargetInfluences.fill(0);
      }
    });
  }, [scene]);

  /* ------------------ Handle Incoming Message ------------------ */
  useEffect(() => {
    if (!message) return;

    setFacialExpression(message.facialExpression || "default");
    setAnimation(message.animation || "Action");
    lipsyncRef.current = message.lipsync || null;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }

    const audio = new Audio("data:audio/mp3;base64," + message.audio);
    audioRef.current = audio;

    audio.onended = () => {
      onMessagePlayed?.();
    };

    audio.play();

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [message, onMessagePlayed]);

  /* ------------------ Animation Sequence ------------------ */
  useEffect(() => {
    if (sequenceStarted.current) return;
    if (!actions || Object.keys(actions).length === 0) return;

    sequenceStarted.current = true;
    let timeouts = [];

    const playSequence = () => {
      setAnimation("Action");

      timeouts.push(setTimeout(() => {
        setAnimation("Arms_Hiphop_Dance");

        timeouts.push(setTimeout(() => {
          setAnimation("Action");

          timeouts.push(setTimeout(() => {
            setAnimation("Dance");

            timeouts.push(setTimeout(() => {
              setAnimation("Action");

              timeouts.push(setTimeout(() => {
                setAnimation("Snake_Hiphop_Dance");

                timeouts.push(setTimeout(() => {
                  setAnimation("Action");
                  setTimeout(playSequence, 3000);
                }, actions["Snake_Hiphop_Dance"]?.getClip().duration * 1000 || 3000));

              }, actions["Action"]?.getClip().duration * 1000 || 2000));

            }, actions["Dance"]?.getClip().duration * 1000 || 3000));

          }, actions["Action"]?.getClip().duration * 1000 || 2000));

        }, actions["Arms_Hiphop_Dance"]?.getClip().duration * 1000 || 2000));

      }, 2000));
    };

    playSequence();

    return () => timeouts.forEach(clearTimeout);
  }, [actions]);

  /* ------------------ Frame Loop ------------------ */
  useFrame((_, delta) => {
    const audio = audioRef.current;
    const lipsync = lipsyncRef.current;

    /* ---- Eye Blinking ---- */
    eyeBlinkTimer.current += delta;

    if (!blinkActive.current && eyeBlinkTimer.current > 3 + Math.random() * 2) {
      blinkActive.current = true;
      blinkProgress.current = 0;
      eyeBlinkTimer.current = 0;
    }

    if (blinkActive.current) {
      blinkProgress.current += delta * 5;
      if (blinkProgress.current >= 1) {
        blinkActive.current = false;
        blinkProgress.current = 0;
      }
    }

    scene.traverse((child) => {
      if (!child.isMesh || !child.morphTargetDictionary || !child.morphTargetInfluences) return;

      /* ---- Blink Morph ---- */
      const eyeIndex = child.morphTargetDictionary["eyes"];
      if (eyeIndex !== undefined) {
        child.morphTargetInfluences[eyeIndex] =
          blinkActive.current ? Math.sin(blinkProgress.current * Math.PI) : 0;
      }

      /* ---- Lipsync ---- */
      if (audio && lipsync) {
        const t = audio.currentTime;
        const activeTargets = new Set();

        lipsync.mouthCues.forEach((cue) => {
          if (t >= cue.start && t <= cue.end) {
            const target = corresponding[cue.value];
            const index = child.morphTargetDictionary[target];
            if (index !== undefined) {
              child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
                child.morphTargetInfluences[index],
                1,
                0.3
              );
              activeTargets.add(index);
            }
          }
        });

        Object.values(corresponding).forEach((target) => {
          const index = child.morphTargetDictionary[target];
          if (index !== undefined && !activeTargets.has(index)) {
            child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
              child.morphTargetInfluences[index],
              0,
              0.1
            );
          }
        });
      }
    });
  });

  /* ------------------ Controls ------------------ */
  useControls("Avatar", {
    chat: button(() => chat?.()),
    animation: {
      value: animation,
      options: Object.keys(actions),
      onChange: setAnimation,
    },
    blink: button(() => {
      blinkActive.current = true;
      blinkProgress.current = 0;
    }),
  });

  return <primitive ref={group} object={scene} {...props} />;
}

useGLTF.preload("/Character_update.glb");
