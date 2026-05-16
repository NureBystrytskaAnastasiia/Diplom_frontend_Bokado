// src/features/posts/components/PostCreate.tsx
import React, { useRef, useState } from 'react';
import { FiImage, FiSend, FiX } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useAuth';
import { createPost, clearCreateError } from '../store/postsSlice';
import type { CreatePostData } from '../types/post';

const PostCreate: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isCreating, createError } = useAppSelector(s => s.posts);
  const isPremium = useAppSelector(s => s.auth.user as any)?.isPremium ?? false;

  const [text, setText]               = useState('');
  const [imageFile, setImageFile]     = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!text.trim() && !imageFile) return;

    const data: CreatePostData = {
      text: text.trim() || undefined,
      image: imageFile || undefined,
    };

    const result = await dispatch(createPost(data));
    if (createPost.fulfilled.match(result)) {
      setText('');
      clearImage();
    }
  };

  const canSubmit = (text.trim().length > 0 || imageFile !== null) && !isCreating;

  return (
    <div className="post-create">
      <div className="post-create__top">
        <textarea
          className="post-create__textarea"
          placeholder={
            isPremium
              ? 'Поділіться чимось... (підтримується форматований текст)'
              : 'Поділіться чимось...'
          }
          value={text}
          onChange={e => {
            setText(e.target.value);
            if (createError) dispatch(clearCreateError());
          }}
          rows={3}
        />

        {imagePreview && (
          <div className="post-create__preview">
            <img src={imagePreview} alt="preview" />
            <button
              className="post-create__remove-img"
              onClick={clearImage}
              title="Видалити зображення"
            >
              <FiX size={13} />
            </button>
          </div>
        )}
      </div>

      {createError && (
        <p className="post-create__error">{createError}</p>
      )}

      <div className="post-create__actions">
        <button
          className="post-create__img-btn"
          onClick={() => fileRef.current?.click()}
          title="Додати фото"
        >
          <FiImage size={15} />
          Фото
        </button>

        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          style={{ display: 'none' }}
          onChange={handleImagePick}
        />

        <button
          className="post-create__submit"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {isCreating ? (
            <span className="post-create__spinner" />
          ) : (
            <FiSend size={14} />
          )}
          {isCreating ? 'Публікую...' : 'Опублікувати'}
        </button>
      </div>
    </div>
  );
};

export default PostCreate;