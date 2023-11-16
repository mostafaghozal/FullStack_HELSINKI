const App = () => {


  // const course = 'Half Stack application development'
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }


  // const parts = [
  //   {
  //     name: 'Fundamentals of React',
  //     exercises: 10
  //   },
  //   {
  //     name: 'Using props to pass data',
  //     exercises: 7
  //   },
  //   {
  //     name: 'State of a component',
  //     exercises: 14
  //   }
  // ]

  return (
    <div>
    <Header course = {course.name}/>
    <Part1 part1 = {course.parts[0].name} />
    <Part1 exercises1 = {course.parts[0].exercises} />
    <Part2 part2 = {course.parts[1].name} />
    <Part2 exercises2 = {course.parts[1].exercises} />
    <Part3 part3 = {course.parts[2].name} />
    <Part3 exercises3 = {course.parts[2].exercises} />


    <Content></Content>
    
    <Total TotalGrade={course.parts[0].exercises +course.parts[1].exercises + course.parts[2].exercises } />

    
    </div>
  )
}

export default App

 const Header = (props) => {
  return (
  <h1>{props.course}</h1>
  ) 
}



const Part1 = (props) => {
  return (
  <p>{props.part1}  {props.exercises1}</p>
  ) 
}
 const Part2 = (props) => {
  return (
    <p>{props.part2}  {props.exercises2}</p>
    ) 
}
 const Part3 = (props) => {
  return (
    <p>{props.part3}  {props.exercises3}</p>
    ) 
}

const Content = ( ) => {
  return (
    <div>
    <Part1></Part1>
    <Part2></Part2>
    <Part3></Part3>

  </div>
   ) 
}



 const Total = (props) => {
  return (
  <h1>{' '+props.TotalGrade}</h1>
  ) 
}


// const Content = () => {
// }
// const Total = () => {
// }

