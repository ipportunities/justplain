import React from 'react'

export const ScoreDisplay = ({ score, maxScore }) => {
  const redColor = {
    r: 229,
    g: 22,
    b: 22
  }
  const orangeColor = {
    r: 244,
    g: 184,
    b: 20
  }
  const greenColor = {
    r: 22,
    g: 225,
    b: 0
  }

  const [r, setR] = React.useState(0)
  const [g, setG] = React.useState(0)
  const [b, setB] = React.useState(0)

  React.useEffect(() => {
    // Calculate the percentage that we need to use for the color
    let percentage = score / maxScore
    // Define that we have a end and start color
    let endColor, startColor

    if (percentage >= 0.5) {
      // If the percentage is above 50% we want to get the color between orange and green.
      startColor = orangeColor
      endColor = greenColor
      // We need the percentage between 50 and 100 percent so we subtract 50 and multiply by 2
      // eg. if percentage is 75% we want the 50% orange and 50% green so we take (75% - 50%) * 2 = 50%
      percentage -= 0.5
      percentage *= 2
    } else {
      startColor = redColor
      endColor = orangeColor
    }

    // DeltaColor is the difference between the start and end color we use this to add to the start color to get the end color
    const deltaColor = {
      r: endColor.r - startColor.r,
      g: endColor.g - startColor.g,
      b: endColor.b - startColor.b,
    }

    // Set RGB to the start color with delta color * the percentage
    setR(startColor.r + (deltaColor.r * percentage))
    setG(startColor.g + (deltaColor.g * percentage))
    setB(startColor.b + (deltaColor.b * percentage))
  }, [score, maxScore])

  return <div style={ { fontWeight: 'bold', color: `rgb(${ r },${ g },${ b })` } }>
    { `Score: ${ score }/${ maxScore } points (${ Math.round(score / maxScore * 100) }%)` }
  </div>

}