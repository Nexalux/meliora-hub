import { useParams, useNavigate } from "react-router-dom";
import ReactFlow, { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";

const graphs = {

  frontend: ["HTML","CSS","JavaScript","Git","React","Next.js"],
  backend: ["Internet","Linux","Node.js","Databases","APIs"],
  devops: ["Linux","Networking","Docker","Kubernetes","Cloud"],
  ai: ["Python","Math","Machine Learning","Deep Learning","LLMs"]

};

function buildGraph(skills, completed){

  const nodes = skills.map((skill,index)=>({

    id:String(index),

    data:{ label:skill },

    position:{ x:index*200, y:0 },

    style:{
      background: completed.includes(skill) ? "#22c55e" : "#1e293b",
      color:"#fff",
      border:"1px solid #334155",
      padding:"10px",
      borderRadius:"8px"
    }

  }));

  const edges = skills.slice(1).map((_,index)=>({

    id:"e"+index,
    source:String(index),
    target:String(index+1),
    animated:true

  }));

  return {nodes,edges};

}

function SkillGraph(){

  const { slug } = useParams();
  const navigate = useNavigate();

  const skills = graphs[slug] || [];

  const completed =
    JSON.parse(localStorage.getItem(slug)) || [];

  const {nodes,edges} = buildGraph(skills,completed);

  function onNodeClick(event,node){

    const skill = node.data.label
      .toLowerCase()
      .replace(/\s+/g,"-");

    navigate(`/roadmap/${skill}`);

  }

  return(

    <div className="page">

      <h1 className="title">
        {slug?.toUpperCase()} Skill Graph
      </h1>

      <div
        style={{
          height:"600px",
          border:"1px solid #334155",
          borderRadius:"12px"
        }}
      >

        <ReactFlowProvider>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodeClick={onNodeClick}
            fitView
          />

        </ReactFlowProvider>

      </div>

    </div>

  );

}

export default SkillGraph;