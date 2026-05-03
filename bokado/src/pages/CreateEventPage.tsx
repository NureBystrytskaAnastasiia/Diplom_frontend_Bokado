import React, { useState } from 'react';
import { useAppDispatch } from '../hooks/useAuth';
import { createNewEvent } from '../store/slices/eventSlice';
import { useNavigate } from 'react-router-dom';
import TextEditor from '../components/CreatEvent/TextEditor';
import '../styles/Events.css';

const CreateEventPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [city, setCity] = useState('');
  const [maximum, setMaximum] = useState<number>(2); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(createNewEvent({ eventDto: { title, description, date, city, maximum } }));
    navigate('/events');
  };

  return (
    <div className="events-container">
      <form className="create-event-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Створити подію</h2>

        <div className="form-group">
          <label className="form-label">Назва</label>
          <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>

        <div className="form-group">
          <label className="form-label">Опис</label>
          <textarea
            className="form-input form-textarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <TextEditor description={description} setDescription={setDescription} />
        </div>

        <div className="form-group">
          <label className="form-label">Дата</label>
          <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label className="form-label">Місто</label>
          <input className="form-input" value={city} onChange={e => setCity(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Максимальна кількість учасників</label>
          <input
            type="number"
            className="form-input"
            value={maximum}
            onChange={e => setMaximum(Number(e.target.value))}
            min={2}
            required
          />
        </div>

        <button className="submit-btn" type="submit">Створити</button>
      </form>
    </div>
  );
};

export default CreateEventPage;
