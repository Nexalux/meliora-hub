/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

import {
  getLearning,
  completeStep as completeStepRequest,
  uncompleteStep as uncompleteStepRequest,
  recordRoadmapVisit,
} from "../api/learning";

const LearningContext = createContext(null);

export function LearningProvider({ children }) {
  const { user } = useAuth();

  const [completedSteps, setCompletedSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savingStepIds, setSavingStepIds] = useState([]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function loadLearning() {
      if (!user) {
        setCompletedSteps([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const data = await getLearning({
          signal: controller.signal,
        });

        if (active) {
          setCompletedSteps(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to load learning:", error);

        if (active) {
          setCompletedSteps([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadLearning();

    return () => {
      active = false;
      controller.abort();
    };
  }, [user]);

  const completedStepIds = useMemo(
    () =>
      new Set(
        completedSteps.map((step) => step.step_uuid.toLowerCase())
      ),
    [completedSteps]
  );

  function isCompleted(stepUuid) {
    return completedStepIds.has(stepUuid.toLowerCase());
  }

  function isSaving(stepUuid) {
    return savingStepIds.includes(stepUuid);
  }

  function beginSaving(stepUuid) {
    setSavingStepIds((current) =>
      current.includes(stepUuid)
        ? current
        : [...current, stepUuid]
    );
  }

  function finishSaving(stepUuid) {
    setSavingStepIds((current) =>
      current.filter((id) => id !== stepUuid)
    );
  }

  async function completeStep(roadmapId, stepUuid) {
    if (!user || isCompleted(stepUuid) || isSaving(stepUuid)) {
      return;
    }

    beginSaving(stepUuid);

    try {
      const response = await completeStepRequest(roadmapId, stepUuid);

      setCompletedSteps((current) => [
        response?.record ?? {
          roadmap_id: Number(roadmapId),
          step_uuid: stepUuid.toLowerCase(),
          completed_at: new Date().toISOString(),
        },
        ...current,
      ]);
    } finally {
      finishSaving(stepUuid);
    }
  }

  async function uncompleteStep(stepUuid) {
    if (!user || !isCompleted(stepUuid) || isSaving(stepUuid)) {
      return;
    }

    beginSaving(stepUuid);

    try {
      await uncompleteStepRequest(stepUuid);

      setCompletedSteps((current) =>
        current.filter(
          (step) => step.step_uuid !== stepUuid.toLowerCase()
        )
      );
    } finally {
      finishSaving(stepUuid);
    }
  }

  async function toggleStep(roadmapId, stepUuid) {
    if (isCompleted(stepUuid)) {
      await uncompleteStep(stepUuid);
    } else {
      await completeStep(roadmapId, stepUuid);
    }
  }

  function getCompletedCount(roadmapId) {
    return completedSteps.filter(
      (step) => Number(step.roadmap_id) === Number(roadmapId)
    ).length;
  }

  function getProgress(roadmapId, totalSteps) {
    if (!totalSteps) {
      return 0;
    }

    return Math.round(
      (getCompletedCount(roadmapId) / totalSteps) * 100
    );
  }

  return (
    <LearningContext.Provider
      value={{
        completedSteps,
        loading,

        isCompleted,
        isSaving,

        completeStep,
        uncompleteStep,
        toggleStep,

        getCompletedCount,
        getProgress,

        recordRoadmapVisit,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}

function useLearning() {
  const context = useContext(LearningContext);

  if (!context) {
    throw new Error(
      "useLearning must be used inside LearningProvider."
    );
  }

  return context;
}

export { useLearning };
