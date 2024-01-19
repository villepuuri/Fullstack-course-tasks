

const Header = ({ name }) => {
    return (
      <h2>
        {name}
      </h2>
    )
  }
  
  const Content = (props) => {
    const parts = props.parts
    console.log(parts)
    return (
      <div>
        {
          parts.map(part =>
            <Part key={part.id} part={part} />
          )
        }
      </div>
    )
  }
  
  const Part = (props) => {
    return (
      <div>
        <p>
          {props.part.name} {props.part.exercises}
        </p>
      </div>
    )
  }
  
  const Total = ({ parts }) => {
  
    const total_exercises = parts.reduce(
      (total, currentValue) => total + currentValue.exercises,
      0
    )
  
    console.log("Total exercises", total_exercises)
  
    return (
      <div>
        <h4>
          total of {total_exercises} exercises
        </h4>
      </div>
    )
  }
  
  const Course = ({ course }) => {
  
    return <div>
      <Header name={course.name}></Header>
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  
  }

  export default Course