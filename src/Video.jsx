import React from 'react'

const Video = (props) => {
    const { title , img } = props.value
    // console.log(title,props.value)
  return (
    <div>
        <img src={img} alt="##" />
        <h4>{title}</h4>
    </div>
  )
}

export default Video