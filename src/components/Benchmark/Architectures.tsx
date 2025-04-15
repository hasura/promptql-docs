import React from 'react';
import PromptQLArchitecture from './PromptQLArchitecture';
import ClaudeArchitecture from './ClaudeArchitecture';
import './styles.css';

export default function Architectures() {
  return (
    <div className="architectures-grid">
      <div className="architecture-item">
        <PromptQLArchitecture />
      </div>
      <div className="architecture-item">
        <ClaudeArchitecture />
      </div>
    </div>
  );
}
