import React, { useState, useEffect } from "react";
import ReactFlow, { Handle, Position } from "reactflow";
import "reactflow/dist/style.css";
import { X, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const LeadWorkflowBuilder = () => {
  const [leadStatuses, setLeadStatuses] = useState([]);
  const [transitions, setTransitions] = useState([]);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    setLeadStatuses([
      { id: "1", name: "New", tasks: [{ id: "t1", name: "Email Sent" }, { id: "t2", name: "Follow-up Call" }] },
      { id: "2", name: "In Progress", tasks: [{ id: "t3", name: "Proposal Sent" }] },
      { id: "3", name: "Closed", tasks: [] },
    ]);
  }, []);

  const addLeadStatus = () => {
    const newStatus = { id: uuidv4(), name: "", tasks: [] };
    setLeadStatuses([...leadStatuses, newStatus]);
  };

  const deleteLeadStatus = (id) => {
    setLeadStatuses(leadStatuses.filter((s) => s.id !== id));
  };

  const updateLeadStatusName = (id, name) => {
    setLeadStatuses(leadStatuses.map((s) => (s.id === id ? { ...s, name } : s)));
  };

  const addTaskToStatus = (statusId) => {
    const taskId = uuidv4();
    setLeadStatuses(
      leadStatuses.map((s) =>
        s.id === statusId ? { ...s, tasks: [...s.tasks, { id: taskId, name: "" }] } : s
      )
    );
  };

  const updateTaskName = (statusId, taskId, name) => {
    setLeadStatuses(
      leadStatuses.map((s) =>
        s.id === statusId
          ? {
              ...s,
              tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, name } : t)),
            }
          : s
      )
    );
  };

  const addTransition = (from, to) => {
    const newTransition = { id: uuidv4(), from, to, tasks: getTasksForStatus(from) };
    setTransitions([...transitions, newTransition]);
  };

  const getTasksForStatus = (statusId) => {
    const status = leadStatuses.find((s) => s.id === statusId);
    return status ? status.tasks : [];
  };

  const buildGraph = () => {
    const nodes = leadStatuses.map((status) => ({
      id: status.id,
      data: { label: `${status.name}\n${status.tasks.map((task) => task.name).join(", ")}` },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    }));

    const edges = transitions.map((transition) => ({
      id: transition.id,
      source: transition.from,
      target: transition.to,
      label: transition.tasks.length ? "Tasks Required" : "Direct Move",
    }));

    console.log("Graph Data:", { nodes, edges });
    setGraphData({ nodes, edges });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Lead Workflow Builder</h2>
      <button onClick={addLeadStatus} className="bg-blue-500 text-white px-3 py-2 rounded mt-4 flex items-center">
        <Plus className="mr-2" /> Add Lead Status
      </button>
      {leadStatuses.map((status) => (
        <div key={status.id} className="border p-3 mt-2 rounded relative">
          <button onClick={() => deleteLeadStatus(status.id)} className="absolute top-2 right-2 text-red-500">
            <X size={16} />
          </button>
          <input
            type="text"
            value={status.name}
            onChange={(e) => updateLeadStatusName(status.id, e.target.value)}
            placeholder="Enter Lead Status Name"
            className="border p-2 rounded w-full"
          />
          {status.tasks.map((task) => (
            <input
              key={task.id}
              type="text"
              value={task.name}
              onChange={(e) => updateTaskName(status.id, task.id, e.target.value)}
              placeholder="Enter Task Name"
              className="border p-2 rounded w-full mt-1"
            />
          ))}
          <button onClick={() => addTaskToStatus(status.id)} className="text-sm text-blue-500 mt-2">
            + Add Task
          </button>
        </div>
      ))}
      <button onClick={() => addTransition("1", "2")} className="bg-green-500 text-white px-3 py-2 rounded mt-4 flex items-center">
        <Plus className="mr-2" /> Add Transition
      </button>
      <button onClick={buildGraph} className="bg-purple-500 text-white px-3 py-2 rounded mt-4 flex items-center">
        Build Graph
      </button>
      <ReactFlow nodes={graphData.nodes} edges={graphData.edges} style={{ height: 500, width: "100%" }} />
    </div>
  );
};

export default LeadWorkflowBuilder;
