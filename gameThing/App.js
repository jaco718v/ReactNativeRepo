import React, { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { GameEngine } from "react-native-game-engine";
import { DeviceMotion } from "expo-sensors";

export default function App() {
  const { width, height } = Dimensions.get("window");
  const [isAvailable, setIsAvalable] = useState(false);
  const [motionData, setMotionData] = useState(null)

  const ball = {
    position: {
      x: width / 2 - 25,
      y: height / 2 - 25,
    },
    size: 50,
    velocity: {
      x: 0.2,
      y: 0.2,
    },
    renderer: (props) => {
      const { position, size } = props;
      return (
        <View
          style={{
            backgroundColor: "red",
            position: "absolute",
            left: position.x,
            top: position.y,
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
        ></View>
      );
    },
  };

  const bat = {
    position: {
      x: width / 2,
      y: height,
    },
    size: 100,
    renderer: (props) => {
      const { position, size } = props;
      return (
        <View
          style={{
            backgroundColor: "green",
            position: "absolute",
            left: position.x / 2,
            top: height - 20,
            width: size,
            height: size / 5,
            borderRadius: size / 2,
          }}
        ></View>
      );
    },
  };

  useEffect(() => {
    async function subscribe() {
      const available = await DeviceMotion.isAvailableAsync();
      setIsAvalable(available); //Tager tid da den er async
      if (available) {
        DeviceMotion.setUpdateInterval(20); //20 miliseconds
        DeviceMotion.addListener((deviceMotionData) => {
          //console.log("device:", deviceMotionData.rotation.gamma);
          setMotionData(deviceMotionData.rotation.gamma)
        });
      } else {
        console.log("ikke tilladelse til motion");
      }
    }
    subscribe();
    return () => {
      DeviceMotion.removeAllListeners();
    };
  }, []);

  const update = (entities, { time }) => {
    const ballEntity = entities.ball;
    const batEntity = entities.bat

    ballEntity.position.x += ballEntity.velocity.x * time.delta;
    ballEntity.position.y += ballEntity.velocity.y * time.delta;
    

    if (ballEntity.position.x < 0) {
      ballEntity.velocity.x = Math.abs(ballEntity.velocity.x);
    }

    if (ballEntity.position.x + ballEntity.size > width) {
      ballEntity.velocity.x = -1 * Math.abs(ballEntity.velocity.x);
    }

    if (ballEntity.position.y < 0) {
      ballEntity.velocity.y = Math.abs(ballEntity.velocity.y);
    }

    if (ballEntity.position.y + ballEntity.size > height) {
      ballEntity.velocity.y = -1 * Math.abs(ballEntity.velocity.y);
    }

    if(motionData > 0.3){
      batEntity.position.x += 6
    }
    if(motionData < -0.3){
      batEntity.position.x -= 6
    }

    if(ballEntity.position.y + ballEntity.size > height - batEntity.size/5){
      console.log("kage")
      console.log(batEntity.position.x)
      console.log(ballEntity.position.x)
      if(ballEntity.position.x > batEntity.position - batEntity.size &&
        ballEntity.position.x < batEntity.position + batEntity.size){
          console.log("hej")
        }
    }

    return entities;
  };


  return (
    <GameEngine
      systems={[update]}
      entities={{ bat, ball }}
      style={{ flex: 1, backgroundColor: "white" }}
    />
  );
}
