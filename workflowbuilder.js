import React, { useState, useEffect } from "react";
import ReactFlow, { Handle, Position } from "reactflow";
import "reactflow/dist/style.css";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { X, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const LeadWorkflowBuilder = () => {
  const [leadStatuses, setLeadStatuses] = useState([]);
  const [transitions, setTransitions] = useState([]);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    // Initialize with sample data
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

  const deleteTaskFromStatus = (statusId, taskId) => {
    setLeadStatuses(
      leadStatuses.map((s) =>
        s.id === statusId ? { ...s, tasks: s.tasks.filter((t) => t.id !== taskId) } : s
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

  const addTransition = () => {
    const newTransition = { id: uuidv4(), from: "", tasks: [], to: "" };
    setTransitions([...transitions, newTransition]);
  };

  const deleteTransition = (id) => {
    setTransitions(transitions.filter((t) => t.id !== id));
  };

  const updateTransition = (id, key, value) => {
    setTransitions(
      transitions.map((t) =>
        t.id === id
          ? {
              ...t,
              [key]: value,
              tasks: key === "from" ? getTasksForStatus(value).map((task) => task.id) : t.tasks,
            }
          : t
      )
    );
  };

  const toggleTaskInTransition = (transitionId, taskId) => {
    setTransitions(
      transitions.map((t) =>
        t.id === transitionId
          ? {
              ...t,
              tasks: t.tasks.includes(taskId)
                ? t.tasks.filter((id) => id !== taskId)
                : [...t.tasks, taskId],
            }
          : t
      )
    );
  };

  const getTasksForStatus = (statusId) => {
    const status = leadStatuses.find((s) => s.id === statusId);
    return status ? status.tasks : [];
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
          <button onClick={() => addTaskToStatus(status.id)} className="text-sm text-blue-500 mt-2">+ Add Task</button>
          {status.tasks.map((task) => (
            <div key={task.id} className="flex items-center mt-1">
              <input
                type="text"
                value={task.name}
                onChange={(e) => updateTaskName(status.id, task.id, e.target.value)}
                placeholder="Enter Task Name"
                className="border p-1 rounded w-full"
              />
            </div>
          ))}
        </div>
      ))}

      <button onClick={addTransition} className="bg-green-500 text-white px-3 py-2 rounded mt-4 flex items-center">
        <Plus className="mr-2" /> Add Transition
      </button>
      {transitions.map((transition) => (
        <div key={transition.id} className="border p-3 mt-2 rounded relative">
          <button onClick={() => deleteTransition(transition.id)} className="absolute top-2 right-2 text-red-500">
            <X size={16} />
          </button>
          <select onChange={(e) => updateTransition(transition.id, "from", e.target.value)}>
            <option value="">Select Source Lead Status</option>
            {leadStatuses.map((status) => (
              <option key={status.id} value={status.id}>{status.name}</option>
            ))}
          </select>
          {getTasksForStatus(transition.from).map((task) => (
            <div key={task.id}>
              <input type="checkbox" checked={transition.tasks.includes(task.id)} onChange={() => toggleTaskInTransition(transition.id, task.id)} />
              {task.name}
            </div>
          ))}
          <select onChange={(e) => updateTransition(transition.id, "to", e.target.value)}>
            <option value="">Select Target Lead Status</option>
            {leadStatuses.map((status) => (
              <option key={status.id} value={status.id}>{status.name}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default LeadWorkflowBuilder;
