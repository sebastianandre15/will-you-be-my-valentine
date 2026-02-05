"use client";
import { useState, useEffect, useRef } from "react";

export default function Page() {
  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const yesButtonSize = noCount * 22 + 16;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  const phrases = [
    "No",
    "What??",
    "Are you sure?",
    "What about an iced caramel latte vanilla matcha frostie",
    "With a reece's cup on top",
    "Brother",
    "I am going to die",
    "I died",
    "Cmonnnn scabe",
    "Os gwelwch yn dda",
    "This ain't funny no more",
    "No more aquarium trips",
    "Right I'm coming to Cardiff",
    "Getting in the car",
    "Stopping at the shops",
    "Cookie dough in the basket",
    "Seriously??",
    "Do you want me to crash?",
    "I'm sad",
    "What would Nala/Nora/Nina say? (Still can't remember)",
    "Right!!! China it is",
    "Estoy meurto",
    "No :(",
  ];

  const handleNoClick = () => {
    setNoCount(noCount + 1);
  };

  const getNoButtonText = () => {
    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  const isFinalNo = noCount >= phrases.length - 1;

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Initialize position before button becomes fixed
  useEffect(() => {
    if (noCount === phrases.length - 2 && buttonRef.current) {
      // Capture position one click before final
      const rect = buttonRef.current.getBoundingClientRect();
      posRef.current = { x: rect.left, y: rect.top };
    }
  }, [noCount, phrases.length]);

  // Runaway animation for final No
  useEffect(() => {
    if (!isFinalNo || !buttonRef.current) return;

    // Use already-captured position or get current position as fallback
    if (posRef.current.x === 0 && posRef.current.y === 0) {
      const rect = buttonRef.current.getBoundingClientRect();
      posRef.current = { x: rect.left, y: rect.top };
    }

    const distanceThreshold = 150;
    const speed = 12;

    const animate = () => {
      if (!buttonRef.current) return;

      const dx = posRef.current.x - mouse.current.x;
      const dy = posRef.current.y - mouse.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < distanceThreshold) {
        // Move away from cursor
        const angle = Math.atan2(dy, dx);
        let newX = posRef.current.x + Math.cos(angle) * speed;
        let newY = posRef.current.y + Math.sin(angle) * speed;

        // Keep inside viewport with padding
        const btn = buttonRef.current;
        const padding = 10;
        newX = Math.min(
          Math.max(newX, padding),
          window.innerWidth - btn.offsetWidth - padding
        );
        newY = Math.min(
          Math.max(newY, padding),
          window.innerHeight - btn.offsetHeight - padding
        );

        posRef.current = { x: newX, y: newY };
      }

      // Apply to style directly for smooth animation
      buttonRef.current.style.left = posRef.current.x + "px";
      buttonRef.current.style.top = posRef.current.y + "px";

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isFinalNo]);

  return (
    <div className="-mt-16 flex h-screen flex-col items-center justify-center relative bg-orange-100">
      {yesPressed ? (
        <>
          <img src="https://media1.tenor.com/m/sBYfiPs3jZIAAAAC/jesus-christ-stath-lets-flat.gif" />
          <div className="my-4 text-4xl font-bold text-center">WOOOOOO!!! 😝
            <div className="mt-2 text-2xl">You're cute ;)</div>
          </div>
        </>
      ) : (
        <>
          <img
            className="h-[200px]"
            src="https://gifdb.com/images/high/cute-love-bear-roses-ou7zho5oosxnpo6k.gif"
          />
          <h1 className="my-4 text-4xl">Will you be my Valentine?</h1>
          <div className="flex items-center relative w-full justify-center h-[200px]">
            <button
              className={`mr-4 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700`}
              style={{ fontSize: yesButtonSize }}
              onClick={() => setYesPressed(true)}
            >
              Yes
            </button>

            <button
              ref={buttonRef}
              onClick={handleNoClick}
              className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
              style={
                isFinalNo
                  ? {
                    position: "fixed",
                    transition: "none",
                    left: posRef.current.x,
                    top: posRef.current.y,
                  }
                  : {}
              }
            >
              {getNoButtonText()}
            </button>
          </div>
        </>
      )}
    </div>
  );
}