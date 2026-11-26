import { useRef } from "react";
import { Atom, Braces, Database, Hexagon } from "lucide-react";

export default function DeveloperWorkspace() {
  const sceneRef = useRef(null);

  const handlePointerMove = (event) => {
    if (!sceneRef.current) return;

    const rect = sceneRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    sceneRef.current.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
    sceneRef.current.style.setProperty("--tilt-y", `${(x * 7).toFixed(2)}deg`);
    sceneRef.current.style.setProperty("--light-x", `${((x + 0.5) * 100).toFixed(1)}%`);
    sceneRef.current.style.setProperty("--light-y", `${((y + 0.5) * 100).toFixed(1)}%`);
  };

  const resetPointer = () => {
    if (!sceneRef.current) return;
    sceneRef.current.style.setProperty("--tilt-x", "0deg");
    sceneRef.current.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <div
      className="workspace"
      ref={sceneRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      aria-label="3D developer workspace illustration"
    >
      <div className="workspace-grid" aria-hidden="true" />
      <div className="workspace-glow" aria-hidden="true" />

      <div className="orbit orbit-one" aria-hidden="true">
        <i />
      </div>
      <div className="orbit orbit-two" aria-hidden="true">
        <i />
      </div>
      <div className="orbit orbit-three" aria-hidden="true">
        <i />
      </div>

      <div className="tech-card tech-react" aria-label="React">
        <Atom aria-hidden="true" />
        <span>React</span>
      </div>
      <div className="tech-card tech-js" aria-label="JavaScript">
        <Braces aria-hidden="true" />
        <span>JS</span>
      </div>
      <div className="tech-card tech-node" aria-label="Node.js">
        <Hexagon aria-hidden="true" />
        <span>Node</span>
      </div>
      <div className="tech-card tech-mongo" aria-label="MongoDB">
        <Database aria-hidden="true" />
        <span>Mongo</span>
      </div>

      <div className="laptop" aria-hidden="true">
        <div className="laptop-screen">
          <div className="screen-rim" />
          <div className="screen-bar">
            <i />
            <i />
            <i />
            <span>workspace.jsx</span>
          </div>
          <div className="screen-code">
            <div><b className="pn">01</b><span className="pk">const</span> <span className="pv">developer</span> = {"{"}</div>
            <div><b className="pn">02</b>&nbsp;&nbsp;<span className="pp">name</span>: <span className="ps">&quot;Shruti&quot;</span>,</div>
            <div><b className="pn">03</b>&nbsp;&nbsp;<span className="pp">role</span>: <span className="ps">&quot;Full Stack&quot;</span>,</div>
            <div><b className="pn">04</b>&nbsp;&nbsp;<span className="pp">stack</span>: [<span className="ps">&quot;MERN&quot;</span>]</div>
            <div><b className="pn">05</b>{"}"}</div>
            <div><b className="pn">06</b><span className="pk">build</span>(developer);</div>
          </div>
        </div>
        <div className="laptop-deck">
          <div className="keyboard">
            {Array.from({ length: 54 }, (_, index) => <i key={index} />)}
          </div>
          <div className="trackpad" />
        </div>
        <div className="laptop-edge" />
      </div>

      <div className="platform" aria-hidden="true">
        <div className="platform-ring platform-ring-one" />
        <div className="platform-ring platform-ring-two" />
        <div className="platform-core" />
        <div className="platform-glow" />
      </div>

      <div className="workspace-particles" aria-hidden="true">
        {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
      </div>
    </div>
  );
}
