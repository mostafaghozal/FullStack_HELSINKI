import { useState } from "react";

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}




function indexOfMax(arr) {
  if (arr.length === 0) {
      return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
          maxIndex = i;
          max = arr[i];
      }
  }

  return maxIndex;
}
var points = new Uint8Array(8); 

const App = () => {
  const [anecdoteIndex , setAnecdote] = useState(0);
  const [vote,setVote] = useState(0);
  const [MaxVote,setMaxVote] = useState(0);

  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  // const points = { 0: 0, 1: 0, 2: 0, 3: 0,  4: 0, 5: 0, 6: 0, 7: 0} 
 
  // save clicks of each button to its own state


  return (
    <div>
      <h2>Anecdote of the day</h2>
{anecdotes[anecdoteIndex]}
<br></br>
has {points[anecdoteIndex]} votes
<br></br>
      <Button handleClick={function Vote(){setVote(vote+1) ;  points[anecdoteIndex]+=1; setMaxVote (indexOfMax(points) ); console.log (indexOfMax(points))}} text="vote"/>
      <Button handleClick={function Shuffle(){  setAnecdote(getRandomInt(8));setVote(points[anecdoteIndex]);  }} text="next anecdote" />

      <h2>Anecdote with most votes</h2>
      {anecdotes[MaxVote]}


    </div>
  );
  
};

export default App;
