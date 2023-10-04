import {useState} from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { client, deleteEvent, fetchEvent } from "../../store/http";
import Header from "../Header.jsx";
import ErrorBlock from "../UI/ErrorBlock";
import Modal from "../UI/Modal";


export default function EventDetails() {
  let { id } = useParams();
  const [isDeleting,setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["event", { id: id }],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });
  const {mutate,isPending:deletePending,isError:deleteIsError,error:deleteError } = useMutation({
    mutationFn:deleteEvent,
    onSuccess:()=>{
      client.invalidateQueries({queryKey:['events'],refetchType:'none'})
     
    }
  })
  const startDeleteHandler = ()=>{
    setIsDeleting(true);
  }
  const stopDeleteHandler = ()=>{
    setIsDeleting(false);
  }
  const deleteNewEvent = ()=>{
    mutate({id:id});
    navigate('../');
  }
  let content;
  if(isPending){
    content = <div id="event-details-content" className="center">
        <p>Fetching Event data....</p>
    </div>
  }
  if(isError){
    content = <div id="event-details-content" className="center">
         <ErrorBlock
            title="Failed in loading the event data"
            message={
              error.info?.message || "Failed in loading the event details."
            }
          />
    </div>
  }
  if (data){
    content = <>
     <header>
              <h1>{data.title}</h1>
              <nav>
                <button onClick={startDeleteHandler}>Delete</button>
                <Link to="edit">Edit</Link>
              </nav>
            </header>
            <div id="event-details-content">
              <img src={`http://localhost:3000/${data.image}`} alt="" />
              <div id="event-details-info">
                <div>
                  <p id="event-details-location">{data.location}</p>
                  <time dateTime={`Todo-DateT$Todo-Time`}>{data.date} @ {data.time}</time>
                </div>
                <p id="event-details-description">{data.description}</p>
              </div>
            </div>
    </>
  }
  return (
    <>
      {isDeleting && <Modal>
        <h2>Are you sure?</h2>
        <p>Do you really want to delete this event?this action cant be undone.</p>
        <div className="form-actions">
            {deletePending && <p>Deleting , please wait...</p>}
            {!deletePending && (<>            <button className="button-text" onClick={stopDeleteHandler}>Cancel</button>
            <button className="button" onClick={deleteNewEvent}>Delete</button>
            </>
            )}
        </div>
        {deleteIsError && <ErrorBlock title="Failed to delete event" message={deleteError.info?.message || 'Failed to delete event , pplease try again.'} />}
      </Modal>}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
           {content}
      </article>
    </>
  );
}
