import { useState } from 'react';
import styles from './styles.module.css';

export default function CopyLLM() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const fileUrl =
    'https://raw.githubusercontent.com/hasura/promptql-docs/refs/heads/robdominguez/doc-2696-evaluate-the-idea-of-a-one-click-copy-to-llm-button/output/allDocs.md';

  async function handleCopy() {
    let showLoadingTimer: NodeJS.Timeout | undefined;

    try {
      // Adding a timer to deal with debouncing and janky issues
      showLoadingTimer = setTimeout(() => {
        setStatus('loading');
      }, 300);

      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch file.');
      }
      const text = await response.text();
      await navigator.clipboard.writeText(text);

      clearTimeout(showLoadingTimer);
      setStatus('success');

      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    } catch (err) {
      console.error(err);
      clearTimeout(showLoadingTimer);
      setStatus('error');
      setTimeout(() => {
        setStatus('idle');
      }, 2000);
    }
  }

  function getButtonText() {
    switch (status) {
      case 'loading':
        return 'Copying...';
      case 'success':
        return '✅ Copied!';
      case 'error':
        return 'Failed to copy';
      default:
        return '📋 Copy the docs for your LLM!';
    }
  }

  return (
    <div>
      <button className={styles['llm-button']} onClick={handleCopy} disabled={status === 'loading'}>
        {getButtonText()}
      </button>
    </div>
  );
}
