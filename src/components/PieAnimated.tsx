'use client'

import React from 'react'
import {
    VictoryPie,
    VictoryTheme
} from 'victory';

export function PieAnimated() {
  const [data, setData] =
    React.useState(getData());

  React.useEffect(() => {
    const setStateInterval =
      window.setInterval(() => {
        setData(getData());
      }, 4000);

    return () => {
      window.clearInterval(
        setStateInterval,
      );
    };
  }, []);

  return (
    <VictoryPie
      theme={VictoryTheme.clean}
      animate={{ duration: 1000 }}
      data={data}
    />
  );
}

function getData() {
  const rand = () =>
    Math.max(
      Math.floor(Math.random() * 10000),
      1000,
    );
  return [
    { x: "5-13", y: rand() },
    { x: "14-17", y: rand() },
    { x: "18-24", y: rand() },
    { x: "25-44", y: rand() },
    { x: "45-64", y: rand() },
    { x: "≥65", y: rand() },
  ];
}
