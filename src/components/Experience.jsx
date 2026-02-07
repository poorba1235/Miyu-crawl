import { Environment } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { Scene } from "./Scene.jsx";

export const Experience = ({ chat, message, onMessagePlayed }) => {
  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.5} />

      <group position={[0, -1.3, 0]}>

        <Avatar
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={0.4}
          chat={chat}
          message={message}
          onMessagePlayed={onMessagePlayed}
        />


        <Scene />
      </group>
    </>
  );
};
