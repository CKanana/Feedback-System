import React, { useState, useRef } from 'react';
import './ReplyModal.css';

const ReplyModal = ({ item, onClose, onSubmit }) => {
  const [replyText, setReplyText] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(replyText, attachedFile);
  };

  return (
    <div className="reply-modal-overlay" onClick={onClose}>
      <div className="reply-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Replying to: "{item.title}"</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <textarea
            className="reply-textarea"
            placeholder="Type your anonymous reply here..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            required
          />
          <div className="modal-actions">
            <div className="file-attach-wrapper">
              <button
                type="button"
                className="attach-btn"
                onClick={() => fileInputRef.current.click()}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                Attach Document
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              {attachedFile && <span className="file-name">{attachedFile.name}</span>}
            </div>
            <button type="submit" className="send-reply-btn">
              Send Reply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReplyModal;