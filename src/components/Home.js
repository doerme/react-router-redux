import React from 'react'
import { connect } from 'react-redux'
import { increase, decrease } from '../actions/count'
import { setwrite } from '../actions/write'

function Home({ number, font, increase, decrease, setwrite }) {
  return (
    <div>
       <div>
         Some state changes:
         {number}
         <button onClick={() => increase(1)}>Increase</button>
         <button onClick={() => decrease(1)}>Decrease</button>
       </div>
       <div>
        write:{font}
        <button onClick={() => setwrite(new Date()*1)}>Write</button>
       </div>
    </div>
  )
}

export default connect(
   state => ({ 
    number: state.count.number,
    font: state.write.font
  }),
   { increase, decrease, setwrite }
)(Home)