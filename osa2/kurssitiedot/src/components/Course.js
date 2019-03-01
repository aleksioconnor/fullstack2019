import React from 'react'

const Header = (props) => {
  return (
    <h1> {props.course} </h1>
  )
}

const Part = (props) => {
  return (
    <li>
      {props.part.name} {props.part.exercises}
    </li>
  )
}

const Content = (props) => {
  const renderParts = () => props.parts.map(part => <Part key={part.id} part={part} />)
  return (
    <div>
      <ul>
      {renderParts()}
      </ul>
    </div>
  )
}

const Total = (props) => {
  return (
    <p>yhteensä {props.parts.reduce((acc, currentVal) => acc + currentVal.exercises, 0)} tehtävää</p>
  )
}

const Course = ({courses}) => {

    const renderCourse = () => courses.map(course => 
      <div key={course.id}>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )


  return (
    <div>
      {renderCourse()}
    </div>
  )
}

export default Course

