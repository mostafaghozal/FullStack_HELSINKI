import React from 'react';

const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ parts  }) => {
  const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0);
  return <h2>Number of exercises {totalExercises}</h2>;
}
const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => {
  return (
    <>
      {parts.map((part, index) => (
        <Part key={index} part={part} />
      ))}
    </>
  );
};
const Course = ({ course }) => {
    return (
      <div key={course.id}>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
        {/* You can include Total component here if needed */}
      </div>
    );
  };
  export default Course;