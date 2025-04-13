// App.jsx
import { useEffect, useState } from "react";

export default function App() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // 用静态数据模拟
    setProjects([
      { id: 1, name: "策略一", description: "短线暴利策略A" },
      { id: 2, name: "策略二", description: "短线趋势策略B" },
      { id: 3, name: "策略三", description: "低吸反弹策略C" }
    ]);
  }, []);

  return (
    <div>
      <h1>策略筛选</h1>
      {projects.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}
