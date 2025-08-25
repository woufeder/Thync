"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'

export default function EventCard({ image, description, time }) {
  return (
    <>
      <img src={image} alt="Event Image" className="image" />
      <div className="content">
        <p className="description">{description}</p>
        <div className="">
          <FontAwesomeIcon icon={faClock} />
          <p className="time">{time}</p>
        </div>
      </div>
    </>
  )
}