import { useState } from "react";
const StatisticLine = (props) => {
  /// ...
  return(
    <div>
    <table>
      <tbody>
        <tr><td>{props.text}</td><td>{props.value}</td></tr> 
        </tbody>
    </table>
      {/* <br></br> */}
   

    </div>
  )
}
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Statistics = (props) => {
  {if (props.totalClicks>0 ) {


    return (
      <div>
      <h1> statistics</h1>
      

      <StatisticLine text="good" value ={props.goodClicks} />
      <StatisticLine text="neutral" value ={props.neutralClicks} />
      <StatisticLine text="bad" value ={props.badClicks} />
      <StatisticLine text="all" value ={props.totalClicks} />
      <StatisticLine text="average" value ={(props.goodClicks-props.badClicks)/props.totalClicks} />
      <StatisticLine text="postive" value ={props.goodClicks/props.totalClicks*100} />

   
  
      </div>
  
    ); 

  } else {
return(

  <div>
          <h1> statistics</h1>

    No feedback given
</div>

);
  }
}
};
const App = () => {



  // save clicks of each button to its own state
  const [good , setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
 
  return (
    <div>
      <h1>give feedback</h1>

      <Button handleClick={() =>  setGood(good + 1)} text="good" />

      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />

      <Button handleClick={() =>  setBad(bad + 1)} text="bad" />

<Statistics goodClicks={good} neutralClicks= {neutral} badClicks={bad} totalClicks={good+bad+neutral}></Statistics>


    </div>
  );
  
};

export default App;
