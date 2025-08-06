const { isFullscreen, toggleFullscreen } = useChatWidget();

return (
  <div className={`chat-widget ${isFullscreen ? 'fullscreen' : ''}`}>
    <div className="chat-header">
      <button onClick={toggleFullscreen}>
        {isFullscreen ? '⤓' : '⤢'}
      </button>
    </div>
    {/* ... rest of chat UI */}
  </div>
);