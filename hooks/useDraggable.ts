"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

export type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface DraggablePosition {
  corner: Corner;
}

interface UseDraggableOptions {
  initialCorner?: Corner;
}

interface UseDraggableReturn {
  position: DraggablePosition;
  isDragging: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
}

export function useDraggable(options: UseDraggableOptions = {}): UseDraggableReturn {
  const {
    initialCorner = "bottom-right",
  } = options;

  const [position, setPosition] = useState<DraggablePosition>({ corner: initialCorner });
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);
  const currentPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const getCornerFromPosition = useCallback((x: number, y: number): Corner => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const isLeft = x < windowWidth / 2;
    const isTop = y < windowHeight / 2;
    
    if (isTop && isLeft) return "top-left";
    if (isTop && !isLeft) return "top-right";
    if (!isTop && isLeft) return "bottom-left";
    return "bottom-right";
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    
    // Remove the inline styles to let CSS handle positioning
    if (elementRef.current) {
      elementRef.current.style.transform = "";
    }
    
    // Determine which corner to snap to based on current center position
    const corner = getCornerFromPosition(currentPos.current.x, currentPos.current.y);
    setPosition({ corner });
    setIsDragging(false);
    dragStart.current = null;
    elementRef.current = null;
  }, [isDragging, getCornerFromPosition]);

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging || !dragStart.current || !elementRef.current) return;

    const element = elementRef.current;
    const rect = element.getBoundingClientRect();
    
    // Calculate new position
    const deltaX = clientX - dragStart.current.x;
    const deltaY = clientY - dragStart.current.y;
    
    // Update the element position via transform for smooth dragging
    element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    
    // Store current center position for snap calculation
    currentPos.current = {
      x: rect.left + rect.width / 2 + deltaX,
      y: rect.top + rect.height / 2 + deltaY,
    };
  }, [isDragging]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  }, [handleDragMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [handleDragMove]);

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
      
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    elementRef.current = target;
    
    const rect = target.getBoundingClientRect();
    dragStart.current = { x: e.clientX, y: e.clientY };
    currentPos.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    
    setIsDragging(true);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      const target = e.currentTarget as HTMLElement;
      elementRef.current = target;
      
      const rect = target.getBoundingClientRect();
      const touch = e.touches[0];
      dragStart.current = { x: touch.clientX, y: touch.clientY };
      currentPos.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
      
      setIsDragging(true);
    }
  }, []);

  return {
    position,
    isDragging,
    handleMouseDown,
    handleTouchStart,
  };
}
