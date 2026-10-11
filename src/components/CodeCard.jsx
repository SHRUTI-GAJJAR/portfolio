import { profile } from "../data/site";

/**
 * Decorative developer card shown beside the hero.
 *
 * The snippet is written as markup rather than a plain string so it can be
 * syntax highlighted, and it is hidden from screen readers since the same
 * information is already conveyed by the hero copy.
 */
export default function CodeCard() {
  return (
    <div className="codecard">
      <div className="dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      <pre>
        <code>
          <span className="t-key">const</span>{" "}
          <span className="t-var">developer</span> = {"{"}
          {"\n"}
          {"  "}
          <span className="t-prop">name</span>:{" "}
          <span className="t-str">&quot;{profile.name}&quot;</span>,
          {"\n"}
          {"  "}
          <span className="t-prop">role</span>:{" "}
          <span className="t-str">&quot;{profile.role}&quot;</span>,
          {"\n"}
          {"  "}
          <span className="t-prop">stack</span>: [
          <span className="t-str">&quot;React&quot;</span>,{" "}
          <span className="t-str">&quot;Node&quot;</span>,{" "}
          <span className="t-str">&quot;MongoDB&quot;</span>,{" "}
          <span className="t-str">&quot;MySQL&quot;</span>],
          {"\n"}
          {"  "}
          <span className="t-prop">strengths</span>: [
          <span className="t-str">&quot;REST APIs&quot;</span>,{" "}
          <span className="t-str">&quot;CRUD&quot;</span>,{" "}
          <span className="t-str">&quot;Auth&quot;</span>],
          {"\n"}
          {"  "}
          <span className="t-prop">mindset</span>:{" "}
          <span className="t-str">
            &quot;Build &bull; Learn &bull; Improve&quot;
          </span>
          {"\n"}
          {"}"};
        </code>
      </pre>

      <div className="status">
        <i aria-hidden="true" />
        {profile.statusLine}
      </div>
    </div>
  );
}