import { Link, useNavigate } from 'react-router-dom';
import {useMutation} from '@tanstack/react-query';
import {createNewEvent,client} from '../../store/http';
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import ErrorBlock from '../UI/ErrorBlock';

export default function NewEvent() {
  const navigate = useNavigate();
  const {mutate,isPending,isError,error} = useMutation({
    mutationFn:createNewEvent,
    onSuccess:()=>{
      client.invalidateQueries({queryKey:['events']})
      navigate('/events');
    }
  })
  function handleSubmit(formData) {
      mutate({event:formData});
  }

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && 'Submitting...'}
       {!isPending && 
        <>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Create
          </button>
        </>}
      </EventForm>
      {isError && <ErrorBlock title='Error in submmiting event' message={error.info?.message || 'Failed in posting the new event,try again later'} />}
    </Modal>
  );
}
