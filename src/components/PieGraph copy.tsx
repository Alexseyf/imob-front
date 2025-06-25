'use client'

import React from 'react'
import {
  VictoryPie,
  VictoryTheme
} from "victory"; 

const PieGraph = () => {
  return (
    <div>
      <VictoryPie
  data={[
    { x: "Cats", y: 35 },
    { x: "Dogs", y: 40 },
    { x: "Birds", y: 55 },
  ]}
  theme={VictoryTheme.clean}
/>
    </div>
  )
}

export default PieGraph
