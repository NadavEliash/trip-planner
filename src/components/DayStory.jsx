import React from 'react'

export default function DayStory({ dayStory, setDayStory, dayStories }) {
    return (
        <div className='day-story-main'>
            <div className='x' onClick={() => setDayStory(null)}>✖</div>
            <p className='description'>{dayStory.description}</p>
        </div>
    )
}
