import React, { useState } from 'react';
import { useRealtime, DEMO_STORY_STEPS } from '../../context/RealtimeContext';
import { Play, Pause, RotateCcw, Activity, ShieldAlert, Cpu, ChevronDown, ChevronUp } from 'lucide-react';

export const DemoBar: React.FC = () => {
  const {
    currentDemoStep,
    runDemoStep,
    isDemoPlaying,
    setIsDemoPlaying,
    resetDemo,
    simulateTrack,
    simulateCameraFailure
  } = useRealtime();

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isExpandedSteps, setIsExpandedSteps] = useState<boolean>(false);
  const currentStepObj = DEMO_STORY_STEPS.find(s => s.stepNumber === currentDemoStep) || DEMO_STORY_STEPS[10];

  return (
    <div className="bg-surface-2 border-b border-border text-xs font-mono select-none z-20 shrink-0">
      {/* Collapsed Ribbon */}
      <div className="px-3 py-1 flex items-center justify-between text-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface hover:bg-surface-3 border border-border text-text-dim hover:text-text font-semibold uppercase tracking-wider transition-colors"
          >
            <Cpu className="w-3 h-3 text-info" />
            <span>DEMO / SIMULATION</span>
            {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <span className="text-[10px] text-text-dim border-l border-border pl-2 truncate max-w-xs">
            Step {currentDemoStep}/16: {currentStepObj.title.split(':')[1] || currentStepObj.title}
          </span>
        </div>

        {isOpen && (
          <div className="flex items-center gap-1.5">
            {/* Simulate Track */}
            <button
              onClick={simulateTrack}
              className="flex items-center gap-1 px-2 py-0.5 bg-surface hover:bg-surface-3 border border-border rounded text-text font-medium text-2xs transition-colors"
              title="Trigger YOLO detection & SWAN multi-camera handoff"
            >
              <Activity className="w-3 h-3 text-info" />
              <span>Simulate Track</span>
            </button>

            {/* Simulate Camera Failure */}
            <button
              onClick={simulateCameraFailure}
              className="flex items-center gap-1 px-2 py-0.5 bg-surface hover:bg-surface-3 border border-border rounded text-text font-medium text-2xs transition-colors"
              title="Trigger CAM-03 failure & SHIELD automated PTZ backup"
            >
              <ShieldAlert className="w-3 h-3 text-warning" />
              <span>Simulate Camera Failure</span>
            </button>

            <div className="h-3 w-px bg-border mx-0.5" />

            {/* Play Scenario */}
            <button
              onClick={() => setIsDemoPlaying(!isDemoPlaying)}
              className={`flex items-center gap-1 px-2 py-0.5 border rounded text-2xs font-medium transition-colors ${
                isDemoPlaying
                  ? 'bg-critical/20 text-critical border-critical/40'
                  : 'bg-surface hover:bg-surface-3 border-border text-text'
              }`}
              title={isDemoPlaying ? 'Pause story' : 'Auto-advance 16-step surveillance scenario'}
            >
              {isDemoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isDemoPlaying ? 'Pause' : 'Play Scenario'}</span>
            </button>

            {/* Reset */}
            <button
              onClick={resetDemo}
              className="flex items-center gap-1 px-2 py-0.5 bg-surface hover:bg-surface-3 border border-border rounded text-text-muted hover:text-text text-2xs transition-colors"
              title="Reset to baseline monitoring state"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>

            <button
              onClick={() => setIsExpandedSteps(!isExpandedSteps)}
              className="text-2xs text-text-dim hover:text-text ml-1 underline"
            >
              {isExpandedSteps ? 'Hide steps' : 'All steps'}
            </button>
          </div>
        )}
      </div>

      {/* Expanded Step-by-step Grid */}
      {isOpen && isExpandedSteps && (
        <div className="p-2 border-t border-border bg-surface grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-1">
          {DEMO_STORY_STEPS.map(s => (
            <button
              key={s.stepNumber}
              onClick={() => runDemoStep(s.stepNumber)}
              className={`p-1 rounded text-left border text-[10px] transition-all truncate ${
                currentDemoStep === s.stepNumber
                  ? 'bg-surface-3 border-info text-white font-bold'
                  : 'bg-surface-2 border-border text-text-muted hover:text-text'
              }`}
            >
              <div className="text-info text-[9px]">STEP {s.stepNumber}</div>
              <div className="truncate">{s.title.split(':')[1] || s.title}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
