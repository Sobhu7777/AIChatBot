import './BotMessageBubble.css';

function formatBotText(text) {
  if (!text || typeof text !== 'string') return null;

  const lines = text.split('\n');
  const elements = [];
  let bullets = [];

  // Helper: convert **bold** to <strong>bold</strong>
  const parseBold = (str) => {
    const parts = str.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (/^-\s+/.test(trimmed)) {
      bullets.push(trimmed.replace(/^-\s*/, ''));
    } else {
      if (bullets.length) {
        elements.push(
          <ul key={`ul-${idx}`} className="mb-2 ps-3">
            {bullets.map((item, i) => (
              <li key={i} className="mb-1">
                {parseBold(item)}
              </li>
            ))}
          </ul>
        );
        bullets = [];
      }

      if (/^\d+\.\s+/.test(trimmed)) {
        elements.push(
          <p key={`num-${idx}`} className="mb-2">
            {parseBold(trimmed)}
          </p>
        );
      } else if (trimmed) {
        elements.push(
          <p key={`p-${idx}`} className="mb-2">
            {parseBold(trimmed)}
          </p>
        );
      }
    }
  });

  if (bullets.length) {
    elements.push(
      <ul key="ul-last" className="mb-2 ps-3">
        {bullets.map((item, i) => (
          <li key={i} className="mb-1">
            {parseBold(item)}
          </li>
        ))}
      </ul>
    );
  }

  return elements;
}



function BotMessageBubble({ message }) {
    if (!message || typeof message.text !== 'string') return null
  return (
    <div className="bot-bubble">
      <div className="bot-message-content">
        <div className="bot-text">{formatBotText(message.text)}</div>
      </div>
    </div>
  );
}

export default BotMessageBubble;

