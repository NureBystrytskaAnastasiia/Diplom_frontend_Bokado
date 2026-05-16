import React, { useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { FiBold, FiItalic, FiUnderline, FiLink, FiSmile, FiList, FiEye } from 'react-icons/fi';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

const RichTextEditor: React.FC<Props> = ({ value, onChange }) => {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [showEmoji, setShowEmoji]     = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Обгорнути виділений текст тегом
  const wrap = (open: string, close = open) => {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    const before = value.slice(0, start);
    const sel    = value.slice(start, end);
    const after  = value.slice(end);
    const newVal = `${before}${open}${sel || 'текст'}${close}${after}`;
    onChange(newVal);
    setTimeout(() => {
      ta.focus();
      const pos = start + open.length + (sel.length || 'текст'.length);
      ta.setSelectionRange(pos, pos);
    }, 0);
  };

  const insert = (text: string) => {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const before = value.slice(0, start);
    const after  = value.slice(start);
    onChange(`${before}${text}${after}`);
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const insertLink = () => {
    const url = window.prompt('Введіть URL:', 'https://');
    if (!url) return;
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    const sel = value.slice(start, end) || url;
    wrap(`<a href="${url}" target="_blank">`, '</a>');
    // у wrap буде "текст" якщо selection пустий — підмінимо
    if (start === end) {
      setTimeout(() => {
        onChange(value.slice(0, start) + `<a href="${url}" target="_blank">${sel}</a>` + value.slice(end));
      }, 0);
    }
  };

  return (
    <div className="rte">
      <div className="rte__toolbar">
        <button type="button" className="rte__btn" onClick={() => wrap('<b>', '</b>')}     title="Жирний"><FiBold size={13} /></button>
        <button type="button" className="rte__btn" onClick={() => wrap('<i>', '</i>')}     title="Курсив"><FiItalic size={13} /></button>
        <button type="button" className="rte__btn" onClick={() => wrap('<u>', '</u>')}     title="Підкреслений"><FiUnderline size={13} /></button>
        <span  className="rte__divider" />
        <button type="button" className="rte__btn" onClick={() => insert('\n• ')} title="Список"><FiList size={13} /></button>
        <button type="button" className="rte__btn" onClick={insertLink}            title="Посилання"><FiLink size={13} /></button>
        <button type="button" className={`rte__btn ${showEmoji ? 'rte__btn--active' : ''}`} onClick={() => setShowEmoji(s => !s)} title="Емодзі"><FiSmile size={13} /></button>
        <span  className="rte__spacer" />
        <button
          type="button"
          className={`rte__btn rte__btn--preview ${showPreview ? 'rte__btn--active' : ''}`}
          onClick={() => setShowPreview(p => !p)}
        >
          <FiEye size={13} /> Перегляд
        </button>
      </div>

      {showPreview ? (
        <div
          className="rte__preview"
          dangerouslySetInnerHTML={{ __html: value || '<span class="rte__preview-empty">Тут з\'явиться відформатований текст…</span>' }}
        />
      ) : (
        <textarea
          ref={taRef}
          className="rte__textarea"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Розкажи про подію детальніше..."
          rows={5}
        />
      )}

      {showEmoji && (
        <div className="rte__emoji">
          <EmojiPicker
            onEmojiClick={(emoji) => { insert(emoji.emoji); setShowEmoji(false); }}
            width="100%"
            height={300}
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
