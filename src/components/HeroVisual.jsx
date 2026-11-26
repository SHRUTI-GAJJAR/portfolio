import { lazy, Suspense, useState } from "react";

const RobotMascot = lazy(() => import("./RobotMascot"));

export default function HeroVisual() {
  const [sceneReady, setSceneReady] = useState(false);

  return (
    <div className={`heroScene${sceneReady ? " heroScene--ready" : ""}`}>
      <div className="heroParticles" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <span className="heroParticle" key={index} />
        ))}
      </div>
      <div className="heroSceneFloor" aria-hidden="true" />

      <Suspense fallback={null}>
        <RobotMascot
          onReady={() => setSceneReady(true)}
          onFailure={() => setSceneReady(false)}
        />
      </Suspense>
    </div>
  );
}
