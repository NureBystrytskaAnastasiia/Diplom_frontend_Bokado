import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import '../styles/Events.css';

interface TextEditorProps {
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}


const TextEditor: React.FC<TextEditorProps> = ({ description, setDescription }) => {
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [color, setColor] = useState<string>('#000000');
  const [font, setFont] = useState<string>('Arial');
  const [fontSize, setFontSize] = useState<string>('16px');
  const [addLink, setAddLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); 

  const handleFormatText = () => {
    let formattedText = description;

    if (bold) formattedText = `<b>${formattedText}</b>`;
    if (italic) formattedText = `<i>${formattedText}</i>`;
    if (color) formattedText = `<span style="color:${color}">${formattedText}</span>`;
    if (font) formattedText = `<span style="font-family:${font}">${formattedText}</span>`;
    if (fontSize) formattedText = `<span style="font-size:${fontSize}">${formattedText}</span>`;

    if (addLink && linkUrl && linkText) {
      formattedText += ` <a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
    }

    setDescription(formattedText);
  };

const handleEmojiClick = (emojiData: any) => {
  setDescription((prev: string) => prev + emojiData.emoji);
};

  return (
    <div className="format-controls">
      <label className="format-option">
        <input type="checkbox" checked={bold} onChange={() => setBold(!bold)} />
        <span>Жирний</span>
      </label>
      <label className="format-option">
        <input type="checkbox" checked={italic} onChange={() => setItalic(!italic)} />
        <span>Курсив</span>
      </label>
      <label className="format-option">
        <span>Колір тексту:</span>
        <input type="color" value={color} onChange={e => setColor(e.target.value)} />
      </label>
      <label className="format-option">
        <span>Шрифт:</span>
        <select value={font} onChange={e => setFont(e.target.value)} className="font-select">
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Verdana">Verdana</option>
          <option value="Georgia">Georgia</option>
          <option value="Brush Script MT">Brush Script MT</option>
          <option value="Lucida Handwriting">Lucida Handwriting</option>
          <option value="'Pacifico', cursive">Pacifico</option>
          <option value="'Dancing Script', cursive">Dancing Script</option>
          <option value="'Great Vibes', cursive">Great Vibes</option>
        </select>
      </label>
      <label className="format-option">
        <span>Розмір шрифту:</span>
        <select value={fontSize} onChange={e => setFontSize(e.target.value)} className="font-size-select">
          <option value="12px">12px</option>
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="28px">28px</option>
          <option value="32px">32px</option>
        </select>
      </label>

      <label className="format-option">
        <input type="checkbox" checked={addLink} onChange={() => setAddLink(!addLink)} />
        <span>Додати посилання</span>
      </label>
      {addLink && (
        <>
          <input
            type="text"
            className="form-input"
            placeholder="URL посилання"
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Текст посилання"
            value={linkText}
            onChange={e => setLinkText(e.target.value)}
          />
        </>
      )}
      <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
        😊 Додати емодзі
      </button>
      {showEmojiPicker && (
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      )}

      <button type="button" className="apply-btn" onClick={handleFormatText}>
        Застосувати форматування
      </button>

      <p>Попередній перегляд:</p>
      <div
        dangerouslySetInnerHTML={{ __html: description }}
        className="description-preview"
      />
    </div>
  );
};

export default TextEditor;
