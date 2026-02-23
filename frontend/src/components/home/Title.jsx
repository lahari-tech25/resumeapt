import React from 'react'

const Title = ({title,description}) => {
  return (
    <div className="text-center my-10">
      <h2 className="text-3xl font-bold text-black">{title}</h2>
      <p className="mt-2 text-slate-700 max-w-xl mx-auto">{description}</p>
    </div>
  )
}

export default Title