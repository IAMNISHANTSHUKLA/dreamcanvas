'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useEyeTracking } from '@/hooks/use-eye-tracking';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import * as facemesh from '@tensorflow-models/face-landmarks-detection';
import { Button } from '@/components/ui/button';

const MovementTrackingDemo = () => {
  const { eyePosition, isCalibrated, isLoading, error, calibrateEyeTracking } = useEyeTracking();
  const [handPosition, setHandPosition] = useState<{ x: number; y: number; z: number } | null>(null);
  const [headRotation, setHeadRotation] = useState({ pitch: 0, yaw: 0, roll: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    let handModel: handpose.HandPose | null = null;
    let faceModel: facemesh.FaceLandmarksDetector | null = null;
    let animationFrameId: number | null = null;

    const initializeTracking = async () => {
      try {
        // Initialize models
        handModel = await handpose.load();
        faceModel = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        setIsTracking(true);
        startTracking(handModel, faceModel);
      } catch (err) {
        console.error('Error initializing tracking:', err);
      }
    };

    const startTracking = async (handModel: handpose.HandPose, faceModel: facemesh.FaceLandmarksDetector) => {
      const detectMovements = async () => {
        if (!videoRef.current || !handModel || !faceModel) return;

        try {
          // Detect hand landmarks
          const hands = await handModel.estimateHands(videoRef.current);
          if (hands.length > 0) {
            const palmPosition = hands[0].landmarks[0];
            setHandPosition({
              x: palmPosition[0],
              y: palmPosition[1],
              z: palmPosition[2]
            });
          }

          // Detect face landmarks
          const faces = await faceModel.estimateFaces({
            input: videoRef.current,
            returnTensors: false,
            flipHorizontal: false,
            predictIrises: true
          });

          if (faces.length > 0) {
            // Calculate head rotation from facial landmarks
            const face = faces[0];
            const rotation = calculateHeadRotation(face.mesh);
            setHeadRotation(rotation);
          }

        } catch (err) {
          console.error('Detection error:', err);
        }

        animationFrameId = requestAnimationFrame(detectMovements);
      };

      detectMovements();
    };

    initializeTracking();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const calculateHeadRotation = (faceMesh: number[][]) => {
    // Calculate head rotation angles from facial landmarks
    // This is a simplified calculation
    const nose = faceMesh[1];
    const leftEye = faceMesh[33];
    const rightEye = faceMesh[263];
    const mouth = faceMesh[14];

    const pitch = Math.atan2(nose[1] - mouth[1], nose[2] - mouth[2]);
    const yaw = Math.atan2(rightEye[0] - leftEye[0], rightEye[2] - leftEye[2]);
    const roll = Math.atan2(rightEye[1] - leftEye[1], rightEye[0] - leftEye[0]);

    return {
      pitch: (pitch * 180) / Math.PI,
      yaw: (yaw * 180) / Math.PI,
      roll: (roll * 180) / Math.PI
    };
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Movement Tracking Demo</h1>
        <div className="mb-4">
          <span className="font-semibold">Status: </span>
          {isLoading ? (
            <span className="text-yellow-600">Initializing...</span>
          ) : (
            <span className={isTracking ? "text-green-600" : "text-red-600"}>
              {isTracking ? "Tracking Active" : "Tracking Inactive"}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full rounded-lg"
            playsInline
            muted
          />
        </div>

        <div className="space-y-6">
          {/* Eye Position Display */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2">Eye Position</h2>
            {eyePosition ? (
              <p>
                X: {Math.round(eyePosition.x)}, Y: {Math.round(eyePosition.y)}
              </p>
            ) : (
              <p>No eye movement detected</p>
            )}
          </div>

          {/* Hand Position Display */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2">Hand Position</h2>
            {handPosition ? (
              <p>
                X: {Math.round(handPosition.x)}<br />
                Y: {Math.round(handPosition.y)}<br />
                Z: {Math.round(handPosition.z)}
              </p>
            ) : (
              <p>No hand detected</p>
            )}
          </div>

          {/* Head Rotation Display */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-bold mb-2">Head Rotation</h2>
            <p>
              Pitch: {Math.round(headRotation.pitch)}°<br />
              Yaw: {Math.round(headRotation.yaw)}°<br />
              Roll: {Math.round(headRotation.roll)}°
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Button
          onClick={calibrateEyeTracking}
          disabled={isLoading}
        >
          {isLoading ? "Calibrating..." : "Recalibrate"}
        </Button>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-100 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default MovementTrackingDemo;

